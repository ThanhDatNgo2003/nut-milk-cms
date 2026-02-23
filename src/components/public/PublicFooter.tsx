import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  about: {
    title: "Về Hạt Mộc",
    links: [
      { label: "Câu Chuyện", href: "/about" },
      { label: "Liên Hệ", href: "/contact" },
      { label: "Câu Hỏi Thường Gặp", href: "/faq" },
      { label: "Chính Sách Bảo Mật", href: "/privacy" },
    ],
  },
  products: {
    title: "Sản Phẩm",
    links: [
      { label: "Tất Cả Sản Phẩm", href: "/products" },
      { label: "Sữa Hạt Điều", href: "/products?category=S%E1%BB%AFa+H%E1%BA%A1t+%C4%90i%E1%BB%81u" },
      { label: "Sữa Hạnh Nhân", href: "/products?category=S%E1%BB%AFa+H%E1%BA%A1nh+Nh%C3%A2n" },
      { label: "Sữa Yến Mạch", href: "/products?category=S%E1%BB%AFa+Y%E1%BA%BFn+M%E1%BA%A1ch" },
    ],
  },
  blog: {
    title: "Blog",
    links: [
      { label: "Tất Cả Bài Viết", href: "/blog" },
      { label: "Sức Khoẻ", href: "/blog?category=suc-khoe" },
      { label: "Dinh Dưỡng", href: "/blog?category=dinh-duong" },
      { label: "Lối Sống", href: "/blog?category=loi-song" },
    ],
  },
};

export default function PublicFooter() {
  return (
    <footer className="bg-brand-charcoal">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div>
            <h3 className="mb-4 font-playfair text-xl font-bold text-white">
              🌿 Hạt Mộc
            </h3>
            <p className="mb-6 font-open-sans text-sm leading-relaxed text-gray-400">
              Sữa hạt tươi 100% tự nhiên, giàu dinh dưỡng, tốt cho sức khoẻ mỗi
              ngày.
            </p>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-brand-green-light" />
                <span>Hồ Chí Minh, Việt Nam</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-brand-green-light" />
                <span>0909 xxx xxx</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-brand-green-light" />
                <span>hello@hatmoc.vn</span>
              </div>
            </div>
          </div>

          {/* Link Columns */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h4 className="mb-4 font-raleway text-sm font-semibold uppercase tracking-wider text-white">
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("/") ? (
                      <Link
                        href={link.href}
                        className="font-open-sans text-sm text-gray-400 transition-colors hover:text-brand-green-light"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="font-open-sans text-sm text-gray-400 transition-colors hover:text-brand-green-light"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-gray-700 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="font-open-sans text-xs text-gray-500">
              &copy; {new Date().getFullYear()} Hạt Mộc. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="font-open-sans text-xs text-gray-500 hover:text-brand-green-light transition-colors">
                Bảo mật
              </Link>
              <Link href="/terms" className="font-open-sans text-xs text-gray-500 hover:text-brand-green-light transition-colors">
                Điều khoản
              </Link>
              <Link href="/returns" className="font-open-sans text-xs text-gray-500 hover:text-brand-green-light transition-colors">
                Đổi trả
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
