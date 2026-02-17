#!/bin/sh
set -e

echo "Starting Nut Milk CMS..."

# Fix uploads directory permissions (volume mount may have different ownership)
if [ -d /app/public/uploads ]; then
  chown -R nextjs:nodejs /app/public/uploads 2>/dev/null || true
fi
mkdir -p /app/public/uploads
chown nextjs:nodejs /app/public/uploads

# Wait for database to be ready using Node.js TCP check
echo "Waiting for database..."
until su-exec nextjs node -e "
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
  su-exec nextjs node ./node_modules/prisma/build/index.js migrate deploy 2>&1 || echo "Migration warning (may be first run)"
  echo "Migrations complete."
fi

# Drop privileges and execute the main command as nextjs user
exec su-exec nextjs "$@"
