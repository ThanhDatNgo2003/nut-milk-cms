"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
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
  { href: "#home", label: "Trang chu" },
  { href: "#products", label: "San Pham" },
  { href: "#story", label: "Ve Chung Toi" },
  { href: "#blog", label: "Blog" },
  { href: "#contact", label: "Lien He" },
];

export default function Navigation() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-[70px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold font-playfair text-brand-brown">
            Nut Milk
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium font-open-sans text-brand-charcoal hover:text-brand-brown transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-brand-brown after:transition-all hover:after:w-full"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-brand-gray hover:text-brand-brown transition-colors"
          >
            Admin
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
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between border-b px-4 py-4">
                <span className="text-xl font-bold font-playfair text-brand-brown">
                  Nut Milk
                </span>
              </div>
              <nav className="flex flex-col gap-1 p-4">
                {navLinks.map((link) => (
                  <SheetClose key={link.href} asChild>
                    <a
                      href={link.href}
                      className="rounded-md px-3 py-2.5 text-sm font-medium font-open-sans text-brand-charcoal hover:bg-brand-offwhite hover:text-brand-brown transition-colors"
                    >
                      {link.label}
                    </a>
                  </SheetClose>
                ))}
                <div className="mt-4 border-t pt-4">
                  <SheetClose asChild>
                    <Link
                      href="/dashboard"
                      className="block rounded-md px-3 py-2.5 text-sm font-medium text-brand-gray hover:bg-brand-offwhite hover:text-brand-brown transition-colors"
                    >
                      Admin Dashboard
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
