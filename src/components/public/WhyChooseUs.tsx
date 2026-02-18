import { Leaf, Sparkles, Heart } from "lucide-react";

const features = [
  {
    icon: Leaf,
    title: "100% Hữu Cơ",
    description:
      "Nguyên liệu hữu cơ được chọn lọc kỹ lưỡng, đảm bảo an toàn và chất lượng cao nhất cho sức khoẻ của bạn.",
    color: "text-brand-green",
    bgColor: "bg-brand-mint",
  },
  {
    icon: Sparkles,
    title: "Tươi Mới Mỗi Ngày",
    description:
      "Sản xuất mỗi ngày, giao hàng tận nơi. Không chất bảo quản, không phụ gia, giữ trọn vị tự nhiên.",
    color: "text-brand-green-dark",
    bgColor: "bg-emerald-50",
  },
  {
    icon: Heart,
    title: "Tốt Cho Sức Khoẻ",
    description:
      "Giàu dinh dưỡng, tốt cho tim mạch, hỗ trợ tiêu hoá và tăng cường hệ miễn dịch tự nhiên.",
    color: "text-brand-green-light",
    bgColor: "bg-green-50",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="animate-on-scroll mb-12 text-center">
          <h2 className="mb-4 font-raleway text-3xl font-bold text-brand-charcoal md:text-4xl">
            Tại Sao Chọn <span className="text-brand-green">Hạt Mộc</span>?
          </h2>
          <p className="mx-auto max-w-2xl font-open-sans text-brand-gray">
            Chúng tôi cam kết mang đến những sản phẩm sữa hạt tốt nhất, vì sức
            khoẻ và hạnh phúc của bạn.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={`animate-on-scroll animate-delay-${(i + 1) * 100} group rounded-2xl bg-white p-8 border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:border-brand-green/20`}
            >
              <div
                className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl ${feature.bgColor} transition-transform duration-300 group-hover:scale-110`}
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
