import { Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  about: {
    title: "Ve Nut Milk",
    links: [
      { label: "Cau Chuyen", href: "#story" },
      { label: "Doi Ngu", href: "#" },
      { label: "Tuyen Dung", href: "#" },
      { label: "Lien He", href: "#contact" },
    ],
  },
  products: {
    title: "San Pham",
    links: [
      { label: "Sua Hat Dieu", href: "#products" },
      { label: "Sua Hat Hanh Nhan", href: "#products" },
      { label: "Sua Hat Oc Cho", href: "#products" },
      { label: "Combo Tiet Kiem", href: "#products" },
    ],
  },
  support: {
    title: "Ho Tro",
    links: [
      { label: "Huong Dan Dat Hang", href: "#" },
      { label: "Chinh Sach Doi Tra", href: "#" },
      { label: "Cau Hoi Thuong Gap", href: "#" },
      { label: "Bao Mat Thong Tin", href: "#" },
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
              Nut Milk
            </h3>
            <p className="mb-6 font-open-sans text-sm leading-relaxed text-gray-400">
              Sua hat tuoi 100% tu nhien, giau dinh duong, tot cho suc khoe moi
              ngay.
            </p>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-brand-gold" />
                <span>Ho Chi Minh City, Vietnam</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-brand-gold" />
                <span>0909 xxx xxx</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-brand-gold" />
                <span>hello@nutmilk.vn</span>
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
                    <a
                      href={link.href}
                      className="font-open-sans text-sm text-gray-400 transition-colors hover:text-brand-gold"
                    >
                      {link.label}
                    </a>
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
              &copy; {new Date().getFullYear()} Nut Milk. All rights reserved.
            </p>
            <p className="font-open-sans text-xs text-gray-500">
              Made with ❤️ in Ho Chi Minh City
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
