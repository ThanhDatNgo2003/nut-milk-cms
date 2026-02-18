import { Leaf, Sparkles, Heart } from "lucide-react";

const features = [
  {
    icon: Leaf,
    title: "100% Organic",
    description:
      "Nguyen lieu huu co duoc chon loc ky luong, dam bao an toan va chat luong cao nhat cho suc khoe cua ban.",
    color: "text-brand-green",
    bgColor: "bg-green-50",
  },
  {
    icon: Sparkles,
    title: "Tuoi Moi Ngay",
    description:
      "San xuat moi ngay, giao hang tan noi. Khong chat bao quan, khong phu gia, giu tron vi tu nhien.",
    color: "text-brand-gold",
    bgColor: "bg-amber-50",
  },
  {
    icon: Heart,
    title: "Tot Cho Suc Khoe",
    description:
      "Giau dinh duong, tot cho tim mach, ho tro tieu hoa va tang cuong he mien dich tu nhien.",
    color: "text-brand-green-fresh",
    bgColor: "bg-emerald-50",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-brand-offwhite py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-raleway text-3xl font-bold text-brand-brown md:text-4xl">
            Tai Sao Chon Nut Milk?
          </h2>
          <p className="mx-auto max-w-2xl font-open-sans text-brand-gray">
            Chung toi cam ket mang den nhung san pham sua hat tot nhat, vi suc
            khoe va hanh phuc cua ban.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div
                className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl ${feature.bgColor}`}
              >
                <feature.icon className={`h-7 w-7 ${feature.color}`} />
              </div>
              <h3 className="mb-3 font-raleway text-xl font-semibold text-brand-charcoal">
                {feature.title}
              </h3>
              <p className="font-open-sans text-sm leading-relaxed text-brand-gray">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
