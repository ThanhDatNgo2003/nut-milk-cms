"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/", anchor: "#home", label: "Trang Chủ" },
  { href: "/products", anchor: null, label: "Sản Phẩm" },
  { href: "/about", anchor: null, label: "Về Chúng Tôi" },
  { href: "/blog", anchor: null, label: "Blog" },
  { href: "/contact", anchor: null, label: "Liên Hệ" },
];

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getHref = (link: (typeof navLinks)[number]) => {
    // On home page, use anchor links for sections; on other pages use full path
    if (isHome && link.anchor) return link.anchor;
    return link.href;
  };

  const isActive = (link: (typeof navLinks)[number]) => {
    if (link.href === "/") return pathname === "/";
    return pathname.startsWith(link.href);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b bg-white/95 backdrop-blur shadow-sm supports-[backdrop-filter]:bg-white/80"
          : "bg-white"
      )}
    >
      <div className="mx-auto flex h-[70px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl font-bold font-playfair text-brand-green transition-colors group-hover:text-brand-green-dark">
            🌿 Hạt Mộc
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const href = getHref(link);
            const active = isActive(link);
            // Use Link for /blog, <a> for anchor links
            if (!link.anchor) {
              return (
                <Link
                  key={link.href}
                  href={href}
                  className={cn(
                    "text-sm font-medium font-open-sans transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-brand-green after:transition-all after:duration-300 hover:after:w-full",
                    active
                      ? "text-brand-green after:w-full"
                      : "text-brand-charcoal hover:text-brand-green"
                  )}
                >
                  {link.label}
                </Link>
              );
            }
            return (
              <a
                key={link.href}
                href={href}
                className="text-sm font-medium font-open-sans text-brand-charcoal hover:text-brand-green transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-brand-green after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-brand-gray hover:text-brand-green transition-colors"
          >
            Quản Trị
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] p-0">
            <SheetTitle className="sr-only">Menu điều hướng</SheetTitle>
            <div className="flex flex-col h-full">
              <div className="flex items-center border-b px-4 py-4">
                <span className="text-xl font-bold font-playfair text-brand-green">
                  🌿 Hạt Mộc
                </span>
              </div>
              <nav className="flex flex-col gap-1 p-4">
                {navLinks.map((link) => {
                  const href = getHref(link);
                  if (!link.anchor) {
                    return (
                      <SheetClose key={link.href} asChild>
                        <Link
                          href={href}
                          className="rounded-md px-3 py-2.5 text-sm font-medium font-open-sans text-brand-charcoal hover:bg-brand-cream hover:text-brand-green transition-colors"
                        >
                          {link.label}
                        </Link>
                      </SheetClose>
                    );
                  }
                  return (
                    <SheetClose key={link.href} asChild>
                      <a
                        href={href}
                        className="rounded-md px-3 py-2.5 text-sm font-medium font-open-sans text-brand-charcoal hover:bg-brand-cream hover:text-brand-green transition-colors"
                      >
                        {link.label}
                      </a>
                    </SheetClose>
                  );
                })}
                <div className="mt-4 border-t pt-4">
                  <SheetClose asChild>
                    <Link
                      href="/dashboard"
                      className="block rounded-md px-3 py-2.5 text-sm font-medium text-brand-gray hover:bg-brand-cream hover:text-brand-green transition-colors"
                    >
                      Quản Trị Dashboard
                    </Link>
                  </SheetClose>
                </div>
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
