import type { Metadata } from "next";
import Navigation from "@/components/public/Navigation";
import PublicFooter from "@/components/public/PublicFooter";
import ScrollAnimationProvider from "@/components/public/ScrollAnimationProvider";
import FAQAccordion from "@/components/public/FAQAccordion";

export const metadata: Metadata = {
  title: "Câu Hỏi Thường Gặp | Hạt Mộc",
  description:
    "Tìm câu trả lời cho các câu hỏi thường gặp về sữa hạt Hạt Mộc - sản phẩm, đặt hàng, giao hàng và bảo quản.",
  openGraph: {
    title: "FAQ | Hạt Mộc",
    description: "Câu hỏi thường gặp về sữa hạt Hạt Mộc.",
    type: "website",
    locale: "vi_VN",
    siteName: "Hạt Mộc",
  },
};

const faqCategories = [
  {
    name: "Sản Phẩm",
    items: [
      {
        question: "Sữa hạt Hạt Mộc có tốt cho sức khoẻ không?",
        answer:
          "Có, sữa hạt Hạt Mộc rất tốt cho sức khoẻ. Sản phẩm của chúng tôi giàu canxi (tốt cho xương), vitamin E (chống oxy hoá), protein thực vật và nhiều khoáng chất thiết yếu. Không chứa cholesterol, lactose, phù hợp với người ăn chay và người bị dị ứng sữa bò.",
      },
      {
        question: "Sữa hạt có chứa đường không?",
        answer:
          "Tất cả sản phẩm của Hạt Mộc không thêm đường tinh luyện. Vị ngọt tự nhiên từ các loại hạt. Chúng tôi cũng có dòng sản phẩm không đường dành cho người kiểm soát đường huyết.",
      },
      {
        question: "Sữa hạt bảo quản bao lâu?",
        answer:
          "Sữa hạt tươi Hạt Mộc nên bảo quản trong tủ lạnh ở nhiệt độ 2-8°C. Sau khi mở nắp, sử dụng trong vòng 3-5 ngày. Sản phẩm chưa mở có hạn sử dụng ghi trên bao bì, thường là 7 ngày kể từ ngày sản xuất.",
      },
      {
        question: "Nguyên liệu được nhập từ đâu?",
        answer:
          "Chúng tôi chọn lọc nguyên liệu từ những vùng trồng uy tín, đảm bảo chất lượng và an toàn. Các loại hạt được kiểm tra chất lượng nghiêm ngặt trước khi đưa vào sản xuất.",
      },
    ],
  },
  {
    name: "Đặt Hàng",
    items: [
      {
        question: "Làm cách nào để đặt hàng?",
        answer:
          "Bạn có thể đặt hàng trực tiếp qua trang web, gọi điện thoại hoặc nhắn tin qua Facebook/Zalo. Đội ngũ tư vấn của chúng tôi luôn sẵn sàng hỗ trợ bạn.",
      },
      {
        question: "Có yêu cầu đơn hàng tối thiểu không?",
        answer:
          "Không, chúng tôi không có yêu cầu đơn hàng tối thiểu. Bạn có thể đặt từ 1 chai trở lên. Tuy nhiên, đơn hàng từ 200.000₫ sẽ được miễn phí vận chuyển trong nội thành TP.HCM.",
      },
      {
        question: "Phương thức thanh toán nào được chấp nhận?",
        answer:
          "Chúng tôi chấp nhận: thanh toán khi nhận hàng (COD), chuyển khoản ngân hàng, ví điện tử (MoMo, ZaloPay) và thanh toán qua thẻ. Bạn có thể chọn phương thức phù hợp nhất khi đặt hàng.",
      },
    ],
  },
  {
    name: "Giao Hàng",
    items: [
      {
        question: "Hạt Mộc giao hàng ở đâu?",
        answer:
          "Hiện tại chúng tôi giao hàng trong nội thành TP. Hồ Chí Minh. Thời gian giao hàng từ 2-4 giờ trong giờ hành chính. Chúng tôi đang mở rộng phạm vi giao hàng ra các tỉnh thành khác.",
      },
      {
        question: "Phí giao hàng bao nhiêu?",
        answer:
          "Phí giao hàng từ 15.000₫ - 30.000₫ tùy khu vực. Miễn phí giao hàng cho đơn hàng từ 200.000₫ trong nội thành TP.HCM.",
      },
    ],
  },
  {
    name: "Khác",
    items: [
      {
        question: "Tôi có thể trả hàng không?",
        answer:
          "Có, chúng tôi chấp nhận trả hàng trong vòng 24 giờ nếu sản phẩm bị lỗi hoặc không đúng đơn hàng. Vui lòng liên hệ ngay với chúng tôi để được hỗ trợ.",
      },
      {
        question: "Hạt Mộc có chương trình khách hàng thân thiết không?",
        answer:
          "Có! Chúng tôi đang phát triển chương trình khách hàng thân thiết với nhiều ưu đãi hấp dẫn. Hãy theo dõi trang web và mạng xã hội để cập nhật thông tin mới nhất.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <ScrollAnimationProvider>
      <main className="min-h-screen bg-white">
        <Navigation />

        {/* Header */}
        <section className="bg-gradient-to-br from-brand-green via-brand-green-dark to-brand-leaf py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="animate-on-scroll font-playfair text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Câu Hỏi Thường Gặp
            </h1>
            <p className="animate-on-scroll animate-delay-100 mx-auto mt-4 max-w-2xl font-open-sans text-base leading-relaxed text-white/80 sm:text-lg">
              Tìm câu trả lời cho những câu hỏi phổ biến về Hạt Mộc
            </p>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <FAQAccordion categories={faqCategories} />
        </section>

        <PublicFooter />
      </main>
    </ScrollAnimationProvider>
  );
}
