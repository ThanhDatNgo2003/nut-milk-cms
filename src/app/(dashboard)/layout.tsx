export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar will be implemented in Phase 2 */}
      <aside className="hidden w-64 border-r bg-muted/40 md:block">
        <div className="flex h-14 items-center border-b px-4 font-semibold">
          Nut Milk CMS
        </div>
        <nav className="space-y-1 p-4">
          <p className="text-sm text-muted-foreground">Dashboard</p>
        </nav>
      </aside>
      <main className="flex-1">
        <header className="flex h-14 items-center border-b px-6">
          <h2 className="text-lg font-semibold">Dashboard</h2>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
