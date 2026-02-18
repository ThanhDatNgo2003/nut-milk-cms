export default function BrandStory() {
  return (
    <section id="story" className="bg-brand-leaf py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          {/* Image placeholder */}
          <div className="animate-on-scroll animate-from-left relative order-2 md:order-1">
            <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-brand-green-light/30 to-white/10">
              <div className="flex h-full w-full items-center justify-center">
                <div className="text-center">
                  <span className="text-7xl md:text-8xl">🌿</span>
                  <p className="mt-4 font-playfair text-lg text-white/60">
                    Từ Thiên Nhiên
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="animate-on-scroll animate-from-right order-1 md:order-2">
            <span className="mb-3 inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-medium tracking-wider text-brand-mint uppercase">
              Câu Chuyện Thương Hiệu
            </span>
            <h2 className="mb-6 font-raleway text-3xl font-bold text-white md:text-4xl">
              Câu Chuyện Của <span className="text-brand-mint">Hạt Mộc</span>
            </h2>
            <div className="space-y-4 font-open-sans text-white/85 leading-relaxed">
              <p>
                Hạt Mộc ra đời từ niềm đam mê với lối sống lành mạnh và tự
                nhiên. Chúng tôi tin rằng mỗi người đều xứng đáng được thưởng
                thức những sản phẩm sữa hạt tươi ngon, bổ dưỡng và an toàn.
              </p>
              <p>
                Với quy trình sản xuất khép kín, nguyên liệu hữu cơ nhập khẩu và
                đội ngũ chuyên gia dinh dưỡng, chúng tôi cam kết mang đến những
                sản phẩm chất lượng cao nhất.
              </p>
              <p>
                Mỗi chai sữa hạt là kết quả của sự tâm huyết, từ việc chọn lọc
                nguyên liệu, chế biến thủ công đến đóng gói cẩn thận — tất cả vì
                sức khoẻ của bạn.
              </p>
            </div>
            <div className="mt-8">
              <a
                href="#"
                className="inline-flex items-center rounded-full bg-white px-6 py-3 font-raleway text-sm font-semibold text-brand-leaf transition-all duration-300 hover:bg-brand-cream hover:shadow-lg hover:scale-105"
              >
                Đọc Câu Chuyện Đầy Đủ →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
