import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import Navigation from "@/components/public/Navigation";
import PublicFooter from "@/components/public/PublicFooter";
import ScrollAnimationProvider from "@/components/public/ScrollAnimationProvider";
import ContactForm from "@/components/public/ContactForm";

export const metadata: Metadata = {
  title: "Liên Hệ | Hạt Mộc - Sữa Hạt Tươi Tự Nhiên",
  description:
    "Liên hệ Hạt Mộc để đặt hàng, hỏi về sản phẩm hoặc hợp tác. Chúng tôi luôn sẵn sàng lắng nghe ý kiến của bạn.",
  openGraph: {
    title: "Liên Hệ | Hạt Mộc",
    description: "Liên hệ với chúng tôi - Hạt Mộc sữa hạt tươi tự nhiên.",
    type: "website",
    locale: "vi_VN",
    siteName: "Hạt Mộc",
  },
};

const contactInfo = [
  {
    icon: Phone,
    label: "Điện Thoại",
    value: "0909 xxx xxx",
    href: "tel:+84909000000",
  },
  {
    icon: Mail,
    label: "Email",
    value: "hello@hatmoc.vn",
    href: "mailto:hello@hatmoc.vn",
  },
  {
    icon: MapPin,
    label: "Địa Chỉ",
    value: "Hồ Chí Minh, Việt Nam",
    href: "https://maps.google.com/?q=Ho+Chi+Minh+City",
  },
  {
    icon: Clock,
    label: "Giờ Làm Việc",
    value: "Thứ Hai - Thứ Sáu: 9:00 - 18:00\nThứ Bảy: 9:00 - 17:00\nChủ Nhật: Nghỉ",
    href: null,
  },
];

export default function ContactPage() {
  return (
    <ScrollAnimationProvider>
      <main className="min-h-screen bg-white">
        <Navigation />

        {/* Header */}
        <section className="bg-gradient-to-br from-brand-green via-brand-green-dark to-brand-leaf py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="animate-on-scroll font-playfair text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Liên Hệ Với Chúng Tôi
            </h1>
            <p className="animate-on-scroll animate-delay-100 mx-auto mt-4 max-w-2xl font-open-sans text-base leading-relaxed text-white/80 sm:text-lg">
              Chúng tôi luôn sẵn sàng lắng nghe ý kiến của bạn
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-12 lg:flex-row">
            {/* Contact Form */}
            <div className="animate-on-scroll w-full lg:w-1/2">
              <h2 className="mb-6 font-raleway text-xl font-bold text-brand-charcoal">
                Gửi tin nhắn
              </h2>
              <ContactForm />
            </div>

            {/* Contact Info */}
            <div className="animate-on-scroll animate-delay-200 w-full lg:w-1/2">
              <h2 className="mb-6 font-raleway text-xl font-bold text-brand-charcoal">
                Thông Tin Liên Hệ
              </h2>
              <div className="space-y-6">
                {contactInfo.map((item) => (
                  <div key={item.label} className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-mint">
                      <item.icon className="h-5 w-5 text-brand-green" />
                    </div>
                    <div>
                      <h3 className="font-raleway text-sm font-bold text-brand-charcoal">
                        {item.label}
                      </h3>
                      {item.href ? (
                        <a
                          href={item.href}
                          target={item.href.startsWith("http") ? "_blank" : undefined}
                          rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="mt-1 block font-open-sans text-sm text-brand-green hover:text-brand-green-dark transition-colors"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="mt-1 font-open-sans text-sm text-brand-gray whitespace-pre-line">
                          {item.value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Social */}
              <div className="mt-8">
                <h3 className="mb-3 font-raleway text-sm font-bold text-brand-charcoal">
                  Theo Dõi Chúng Tôi
                </h3>
                <div className="flex gap-3">
                  {["Facebook", "Instagram", "TikTok"].map((platform) => (
                    <span
                      key={platform}
                      className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-cream font-open-sans text-xs font-medium text-brand-green-dark transition-colors hover:bg-brand-mint cursor-pointer"
                    >
                      {platform.slice(0, 2).toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Placeholder */}
        <section className="border-t border-gray-100">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="animate-on-scroll overflow-hidden rounded-2xl bg-brand-cream shadow-sm">
              <div className="flex h-[300px] items-center justify-center sm:h-[400px]">
                <div className="text-center">
                  <MapPin className="mx-auto h-10 w-10 text-brand-green" />
                  <p className="mt-3 font-open-sans text-sm text-brand-gray">
                    Hồ Chí Minh, Việt Nam
                  </p>
                  <a
                    href="https://maps.google.com/?q=Ho+Chi+Minh+City"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block font-open-sans text-sm font-medium text-brand-green hover:text-brand-green-dark transition-colors"
                  >
                    Mở trên Google Maps →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <PublicFooter />
      </main>
    </ScrollAnimationProvider>
  );
}
