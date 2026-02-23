import type { Metadata } from "next";
import LegalPageLayout from "@/components/public/LegalPageLayout";

export const metadata: Metadata = {
  title: "Chính Sách Bảo Mật | Hạt Mộc",
  description: "Chính sách bảo mật và quyền riêng tư của Hạt Mộc.",
};

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      title="Chính Sách Bảo Mật"
      lastUpdated="24 Tháng 02, 2026"
      currentPath="/privacy"
    >
      <h2>1. Chúng Tôi Thu Thập Thông Tin Nào</h2>
      <p>
        Khi bạn sử dụng trang web và dịch vụ của Hạt Mộc, chúng tôi có thể thu thập
        các loại thông tin sau:
      </p>
      <ul>
        <li><strong>Thông tin cá nhân:</strong> Họ tên, email, số điện thoại khi bạn đăng ký tài khoản hoặc đặt hàng.</li>
        <li><strong>Thông tin đặt hàng:</strong> Địa chỉ giao hàng, lịch sử mua hàng, phương thức thanh toán.</li>
        <li><strong>Thông tin kỹ thuật:</strong> Địa chỉ IP, loại trình duyệt, thời gian truy cập (tự động thu thập).</li>
      </ul>

      <h2>2. Cách Chúng Tôi Sử Dụng Thông Tin</h2>
      <p>Thông tin thu thập được sử dụng cho các mục đích:</p>
      <ul>
        <li>Xử lý và giao đơn hàng của bạn.</li>
        <li>Liên hệ hỗ trợ và chăm sóc khách hàng.</li>
        <li>Gửi thông tin về sản phẩm mới, khuyến mãi (nếu bạn đồng ý).</li>
        <li>Cải thiện trải nghiệm người dùng trên trang web.</li>
      </ul>

      <h2>3. Bảo Vệ Dữ Liệu</h2>
      <p>
        Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn bằng các biện pháp bảo mật
        phù hợp. Dữ liệu được mã hoá và lưu trữ an toàn. Chúng tôi không bán hoặc
        chia sẻ thông tin cá nhân với bên thứ ba trừ khi có sự đồng ý của bạn hoặc
        theo yêu cầu pháp luật.
      </p>

      <h2>4. Quyền Của Bạn</h2>
      <p>Bạn có quyền:</p>
      <ul>
        <li>Yêu cầu xem, sửa đổi hoặc xoá thông tin cá nhân.</li>
        <li>Huỷ đăng ký nhận email marketing.</li>
        <li>Yêu cầu xuất dữ liệu cá nhân của bạn.</li>
      </ul>

      <h2>5. Liên Hệ</h2>
      <p>
        Nếu bạn có thắc mắc về chính sách bảo mật, vui lòng liên hệ:
        <br />
        Email: <a href="mailto:hello@hatmoc.vn">hello@hatmoc.vn</a>
        <br />
        Điện thoại: 0909 xxx xxx
      </p>
    </LegalPageLayout>
  );
}
