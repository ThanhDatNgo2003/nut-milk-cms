import Link from "next/link";
import Navigation from "@/components/public/Navigation";
import PublicFooter from "@/components/public/PublicFooter";
import ScrollAnimationProvider from "@/components/public/ScrollAnimationProvider";

const legalLinks = [
  { href: "/privacy", label: "Chính Sách Bảo Mật" },
  { href: "/terms", label: "Điều Khoản Sử Dụng" },
  { href: "/returns", label: "Chính Sách Đổi Trả" },
];

interface LegalPageLayoutProps {
  title: string;
  lastUpdated: string;
  currentPath: string;
  children: React.ReactNode;
}

export default function LegalPageLayout({
  title,
  lastUpdated,
  currentPath,
  children,
}: LegalPageLayoutProps) {
  return (
    <ScrollAnimationProvider>
      <main className="min-h-screen bg-white">
        <Navigation />

        {/* Header */}
        <section className="bg-brand-cream/50 py-12 sm:py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h1 className="animate-on-scroll font-playfair text-2xl font-bold text-brand-charcoal sm:text-3xl lg:text-4xl">
              {title}
            </h1>
            <p className="animate-on-scroll animate-delay-100 mt-2 font-open-sans text-xs text-brand-gray">
              Cập nhật lần cuối: {lastUpdated}
            </p>

            {/* Tab Navigation */}
            <nav className="animate-on-scroll animate-delay-200 mt-6 flex flex-wrap gap-2">
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-3.5 py-1.5 font-open-sans text-xs font-medium transition-all ${
                    currentPath === link.href
                      ? "bg-brand-green text-white"
                      : "bg-white text-brand-charcoal border border-gray-200 hover:border-brand-green/40 hover:text-brand-green"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </section>

        {/* Content */}
        <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="animate-on-scroll blog-prose">{children}</div>
        </section>

        <PublicFooter />
      </main>
    </ScrollAnimationProvider>
  );
}
