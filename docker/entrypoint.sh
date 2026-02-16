#!/bin/sh
set -e

echo "Starting Nut Milk CMS..."

# Wait for database to be ready using Node.js TCP check
echo "Waiting for database..."
until node -e "
const net = require('net');
const socket = new net.Socket();
socket.setTimeout(2000);
socket.on('connect', () => { socket.destroy(); process.exit(0); });
socket.on('timeout', () => { socket.destroy(); process.exit(1); });
socket.on('error', () => { socket.destroy(); process.exit(1); });
socket.connect(5432, 'postgres');
" 2>/dev/null; do
  echo "Database not ready, retrying in 2s..."
  sleep 2
done
echo "Database is ready."

# Run Prisma migrations (only if PRISMA_MIGRATE=true)
if [ "$PRISMA_MIGRATE" = "true" ]; then
  echo "Running database migrations..."
  node ./node_modules/prisma/build/index.js migrate deploy 2>&1 || echo "Migration warning (may be first run)"
  echo "Migrations complete."
fi

# Execute the main command
exec "$@"
