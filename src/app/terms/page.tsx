import type { Metadata } from "next";
import LegalPageLayout from "@/components/public/LegalPageLayout";

export const metadata: Metadata = {
  title: "Điều Khoản Sử Dụng",
  description: "Điều khoản sử dụng trang web và dịch vụ của Hạt Mộc.",
  twitter: {
    card: "summary",
    title: "Điều Khoản Sử Dụng | Hạt Mộc",
    description: "Điều khoản sử dụng trang web và dịch vụ của Hạt Mộc.",
  },
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <LegalPageLayout
      title="Điều Khoản Sử Dụng"
      lastUpdated="24 Tháng 02, 2026"
      currentPath="/terms"
    >
      <h2>1. Giới Thiệu</h2>
      <p>
        Chào mừng bạn đến với trang web Hạt Mộc. Bằng việc truy cập và sử dụng
        trang web này, bạn đồng ý tuân thủ các điều khoản sử dụng dưới đây.
        Vui lòng đọc kỹ trước khi sử dụng dịch vụ.
      </p>

      <h2>2. Sử Dụng Trang Web</h2>
      <p>Khi sử dụng trang web, bạn cam kết:</p>
      <ul>
        <li>Cung cấp thông tin chính xác khi đặt hàng hoặc đăng ký.</li>
        <li>Không sử dụng trang web cho mục đích bất hợp pháp.</li>
        <li>Không sao chép, phân phối nội dung mà không có sự cho phép.</li>
        <li>Bảo mật thông tin tài khoản của mình.</li>
      </ul>

      <h2>3. Sản Phẩm & Đặt Hàng</h2>
      <p>
        Tất cả sản phẩm trên trang web được mô tả chính xác nhất có thể.
        Giá cả có thể thay đổi mà không cần thông báo trước. Đơn hàng chỉ
        được xác nhận sau khi chúng tôi gửi email hoặc tin nhắn xác nhận.
      </p>

      <h2>4. Thanh Toán</h2>
      <p>
        Chúng tôi chấp nhận nhiều hình thức thanh toán bao gồm: thanh toán khi
        nhận hàng (COD), chuyển khoản ngân hàng và ví điện tử. Mọi giao dịch
        đều được xử lý an toàn và bảo mật.
      </p>

      <h2>5. Giao Hàng</h2>
      <p>
        Thời gian giao hàng tuỳ thuộc vào khu vực. Chúng tôi cố gắng giao hàng
        trong thời gian ngắn nhất. Trong trường hợp sản phẩm hết hàng hoặc có
        vấn đề, chúng tôi sẽ liên hệ bạn ngay lập tức.
      </p>

      <h2>6. Sở Hữu Trí Tuệ</h2>
      <p>
        Tất cả nội dung trên trang web bao gồm logo, hình ảnh, văn bản và thiết kế
        đều thuộc quyền sở hữu của Hạt Mộc. Việc sao chép hoặc sử dụng mà không
        có sự cho phép bằng văn bản là vi phạm pháp luật.
      </p>

      <h2>7. Liên Hệ</h2>
      <p>
        Nếu bạn có thắc mắc về điều khoản sử dụng, vui lòng liên hệ:
        <br />
        Email: <a href="mailto:hello@hatmoc.vn">hello@hatmoc.vn</a>
      </p>
    </LegalPageLayout>
  );
}
