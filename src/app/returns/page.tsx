import type { Metadata } from "next";
import LegalPageLayout from "@/components/public/LegalPageLayout";

export const metadata: Metadata = {
  title: "Chính Sách Đổi Trả | Hạt Mộc",
  description: "Chính sách đổi trả hàng của Hạt Mộc - đảm bảo quyền lợi khách hàng.",
};

export default function ReturnsPage() {
  return (
    <LegalPageLayout
      title="Chính Sách Đổi Trả"
      lastUpdated="24 Tháng 02, 2026"
      currentPath="/returns"
    >
      <h2>1. Điều Kiện Đổi Trả</h2>
      <p>
        Hạt Mộc cam kết chất lượng sản phẩm. Bạn có thể yêu cầu đổi trả trong các
        trường hợp sau:
      </p>
      <ul>
        <li>Sản phẩm bị hư hỏng trong quá trình vận chuyển.</li>
        <li>Sản phẩm không đúng đơn hàng đã đặt.</li>
        <li>Sản phẩm có lỗi từ nhà sản xuất.</li>
        <li>Sản phẩm hết hạn sử dụng tại thời điểm giao hàng.</li>
      </ul>

      <h2>2. Thời Gian Đổi Trả</h2>
      <p>
        Yêu cầu đổi trả cần được gửi trong vòng <strong>24 giờ</strong> kể từ khi
        nhận hàng. Do đặc thù sản phẩm tươi, chúng tôi không chấp nhận đổi trả
        sau thời hạn này.
      </p>

      <h2>3. Quy Trình Đổi Trả</h2>
      <ol>
        <li>Liên hệ Hạt Mộc qua điện thoại hoặc email trong vòng 24 giờ.</li>
        <li>Cung cấp thông tin đơn hàng và mô tả vấn đề (kèm hình ảnh nếu có).</li>
        <li>Đội ngũ hỗ trợ sẽ xác nhận và hướng dẫn các bước tiếp theo.</li>
        <li>Sản phẩm thay thế sẽ được giao lại miễn phí, hoặc hoàn tiền theo yêu cầu.</li>
      </ol>

      <h2>4. Trường Hợp Không Áp Dụng</h2>
      <p>Chính sách đổi trả không áp dụng khi:</p>
      <ul>
        <li>Sản phẩm đã được mở nắp và sử dụng (trừ trường hợp lỗi chất lượng).</li>
        <li>Sản phẩm không được bảo quản đúng hướng dẫn.</li>
        <li>Yêu cầu đổi trả sau thời hạn 24 giờ.</li>
      </ul>

      <h2>5. Hoàn Tiền</h2>
      <p>
        Trong trường hợp hoàn tiền, chúng tôi sẽ hoàn lại đầy đủ số tiền sản phẩm
        trong vòng 3-5 ngày làm việc qua phương thức thanh toán ban đầu hoặc chuyển
        khoản ngân hàng.
      </p>

      <h2>6. Liên Hệ Hỗ Trợ</h2>
      <p>
        Mọi yêu cầu đổi trả, vui lòng liên hệ:
        <br />
        Email: <a href="mailto:hello@hatmoc.vn">hello@hatmoc.vn</a>
        <br />
        Điện thoại: 0909 xxx xxx
        <br />
        Giờ hỗ trợ: Thứ Hai - Thứ Sáu, 9:00 - 18:00
      </p>
    </LegalPageLayout>
  );
}
