"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface DashboardNavProps {
  user: {
    name?: string | null;
    email?: string | null;
    role: string;
  };
}

const navItems = [
  { href: "/", label: "Dashboard", icon: "grid" },
  { href: "/blog", label: "Blog Posts", icon: "file-text" },
  { href: "/products", label: "Products", icon: "package" },
  { href: "/analytics", label: "Analytics", icon: "bar-chart" },
  { href: "/settings", label: "Settings", icon: "settings" },
];

export function DashboardNav({ user }: DashboardNavProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 border-r bg-muted/40 md:flex md:flex-col">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="text-lg">Nut Milk CMS</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          // Only show settings to admins
          if (item.href === "/settings" && user.role !== "ADMIN") {
            return null;
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-3">
        <div className="flex items-center gap-3 rounded-md px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
            {user.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="flex-1 truncate">
            <p className="text-sm font-medium truncate">{user.name || "User"}</p>
            <p className="text-xs text-muted-foreground truncate">{user.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
