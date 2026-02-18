export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative flex min-h-[520px] items-center justify-center overflow-hidden bg-gradient-to-br from-brand-leaf via-brand-green-dark to-brand-green md:min-h-[620px]"
    >
      {/* Decorative circles */}
      <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-white/5 blur-xl" />
      <div className="absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-white/5 blur-xl" />
      <div className="absolute top-1/2 left-1/3 h-40 w-40 rounded-full bg-brand-green-light/10 blur-2xl" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="animate-on-scroll">
          <span className="mb-4 inline-block rounded-full bg-white/15 px-4 py-1.5 text-xs font-medium tracking-wider text-white/90 uppercase">
            100% Tự Nhiên • Không Chất Bảo Quản
          </span>
        </div>

        <h1 className="animate-on-scroll animate-delay-100 mb-4 font-raleway text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl">
          Sữa Hạt Tươi Mỗi Ngày
        </h1>
        <h2 className="animate-on-scroll animate-delay-200 mb-6 font-playfair text-2xl font-medium text-brand-mint md:text-3xl lg:text-4xl">
          Sức Khoẻ Từng Ngụm
        </h2>
        <p className="animate-on-scroll animate-delay-300 mx-auto mb-10 max-w-2xl font-open-sans text-base leading-relaxed text-white/85 md:text-lg">
          Hạt Mộc mang đến sản phẩm sữa hạt tươi nguyên chất, được chế biến
          hàng ngày từ những nguyên liệu hữu cơ tốt nhất. Vì sức khoẻ của bạn
          và gia đình.
        </p>

        <div className="animate-on-scroll animate-delay-400 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#products"
            className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 font-raleway text-sm font-semibold text-brand-green shadow-lg transition-all duration-300 hover:bg-brand-cream hover:shadow-xl hover:scale-105"
          >
            Khám Phá Sản Phẩm
          </a>
          <a
            href="#blog"
            className="inline-flex items-center justify-center rounded-full border-2 border-white/70 px-8 py-3.5 font-raleway text-sm font-semibold text-white transition-all duration-300 hover:border-white hover:bg-white/10"
          >
            Đọc Blog Sức Khoẻ
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="mt-14 flex justify-center">
          <div className="animate-bounce">
            <svg
              className="h-6 w-6 text-white/50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
