import type { Metadata } from "next";
import { Target, Sprout, Heart } from "lucide-react";
import Navigation from "@/components/public/Navigation";
import PublicFooter from "@/components/public/PublicFooter";
import ScrollAnimationProvider from "@/components/public/ScrollAnimationProvider";

export const metadata: Metadata = {
  title: "Về Chúng Tôi - Câu Chuyện Thương Hiệu",
  description:
    "Tìm hiểu câu chuyện Hạt Mộc - từ đam mê sức khoẻ đến sứ mệnh mang sữa hạt tươi nguyên chất đến mỗi gia đình Việt.",
  openGraph: {
    title: "Về Chúng Tôi | Hạt Mộc",
    description: "Câu chuyện và sứ mệnh của Hạt Mộc.",
    type: "website",
    locale: "vi_VN",
    siteName: "Hạt Mộc",
  },
  twitter: {
    card: "summary",
    title: "Về Chúng Tôi | Hạt Mộc",
    description: "Câu chuyện và sứ mệnh của Hạt Mộc.",
  },
  alternates: {
    canonical: "/about",
  },
};

const values = [
  {
    icon: Target,
    title: "Sứ Mệnh",
    description:
      "Mang sức khoẻ đến mỗi gia đình thông qua sữa hạt tươi, ngon và đáng tin cậy. Chúng tôi tin rằng mỗi người đều xứng đáng được thưởng thức những sản phẩm tự nhiên nhất.",
  },
  {
    icon: Sprout,
    title: "Bền Vững",
    description:
      "Cam kết bảo vệ môi trường, sử dụng nguyên liệu tự nhiên và bao bì thân thiện với môi trường. Mỗi sản phẩm là một bước tiến cho tương lai xanh.",
  },
  {
    icon: Heart,
    title: "Chất Lượng",
    description:
      "Mỗi sản phẩm được kiểm soát chất lượng nghiêm ngặt, từ khâu chọn nguyên liệu đến quy trình sản xuất, để đảm bảo sự hài lòng của khách hàng.",
  },
];

const team = [
  {
    name: "Đạt Ngô",
    role: "Founder & CEO",
    bio: "Đam mê về dinh dưỡng và sức khoẻ, với sứ mệnh mang sữa hạt tươi chất lượng đến mọi gia đình Việt Nam.",
  },
];

export default function AboutPage() {
  return (
    <ScrollAnimationProvider>
      <main className="min-h-screen bg-white">
        <Navigation />

        {/* Header */}
        <section className="bg-gradient-to-br from-brand-leaf via-brand-green-dark to-brand-green py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="animate-on-scroll font-playfair text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Câu Chuyện Hạt Mộc
            </h1>
            <p className="animate-on-scroll animate-delay-100 mt-4 font-playfair text-xl text-brand-green-light sm:text-2xl">
              Từ Đam Mê Đến Sứ Mệnh
            </p>
          </div>
        </section>

        {/* Brand Story */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-12 lg:flex-row">
            <div className="animate-on-scroll animate-from-left w-full lg:w-5/12">
              <div className="relative mx-auto aspect-square max-w-sm overflow-hidden rounded-2xl bg-gradient-to-br from-brand-mint to-brand-cream shadow-lg">
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-8xl">🌿</span>
                </div>
              </div>
            </div>
            <div className="animate-on-scroll animate-from-right w-full lg:w-7/12 space-y-6">
              <h2 className="font-raleway text-2xl font-bold text-brand-charcoal sm:text-3xl">
                Chúng Tôi Là Ai
              </h2>
              <div className="space-y-4 font-open-sans text-base leading-relaxed text-brand-gray">
                <p>
                  Hạt Mộc ra đời từ niềm đam mê dành cho sức khoẻ và dinh dưỡng tự nhiên.
                  Chúng tôi tin rằng những gì tự nhiên nhất cũng là những gì tốt nhất cho
                  cơ thể.
                </p>
                <p>
                  Với quy trình sản xuất hiện đại, nguyên liệu được chọn lọc kỹ càng từ
                  những vùng trồng uy tín, mỗi chai sữa hạt Hạt Mộc đều mang trong mình
                  sự tươi ngon và giàu dinh dưỡng.
                </p>
                <p>
                  Chúng tôi không chỉ tạo ra sản phẩm - chúng tôi xây dựng một lối sống
                  khoẻ mạnh, bền vững cho cộng đồng Việt Nam. Mỗi ngày, chúng tôi nỗ lực
                  để mang đến những sản phẩm tốt hơn, vì sức khoẻ của bạn và gia đình.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Values */}
        <section className="bg-brand-cream/50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="animate-on-scroll mb-12 text-center font-raleway text-2xl font-bold text-brand-charcoal sm:text-3xl">
              Sứ Mệnh & Giá Trị Của Chúng Tôi
            </h2>
            <div className="grid gap-8 sm:grid-cols-3">
              {values.map((item, idx) => (
                <div
                  key={item.title}
                  className={`animate-on-scroll animate-delay-${(idx + 1) * 100} rounded-2xl bg-white p-8 text-center shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
                >
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-mint">
                    <item.icon className="h-7 w-7 text-brand-green" />
                  </div>
                  <h3 className="mb-3 font-raleway text-lg font-bold text-brand-charcoal">
                    {item.title}
                  </h3>
                  <p className="font-open-sans text-sm leading-relaxed text-brand-gray">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="animate-on-scroll mb-12 text-center font-raleway text-2xl font-bold text-brand-charcoal sm:text-3xl">
            Đội Ngũ Chúng Tôi
          </h2>
          <div className="flex justify-center">
            {team.map((member, idx) => (
              <div
                key={member.name}
                className={`animate-on-scroll animate-delay-${(idx + 1) * 100} max-w-sm text-center`}
              >
                <div className="mx-auto mb-6 flex h-40 w-40 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-brand-mint to-brand-cream shadow-lg">
                  <span className="text-5xl">👤</span>
                </div>
                <h4 className="font-raleway text-lg font-bold text-brand-charcoal">
                  {member.name}
                </h4>
                <p className="mt-1 font-open-sans text-sm text-brand-green font-medium">
                  {member.role}
                </p>
                <p className="mt-3 font-open-sans text-sm leading-relaxed text-brand-gray">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </section>

        <PublicFooter />
      </main>
    </ScrollAnimationProvider>
  );
}
