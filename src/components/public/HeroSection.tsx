import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative flex min-h-[500px] items-center justify-center overflow-hidden bg-gradient-to-br from-brand-brown-dark via-brand-brown to-brand-gold md:min-h-[600px]"
    >
      {/* Overlay pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1)_0%,transparent_60%)]" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="mb-4 font-raleway text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl">
          Sua Hat Tuoi 100%
        </h1>
        <h2 className="mb-6 font-playfair text-2xl font-medium text-brand-gold md:text-3xl lg:text-4xl">
          Suc Khoe Tung Ngum
        </h2>
        <p className="mx-auto mb-10 max-w-2xl font-open-sans text-base leading-relaxed text-white/90 md:text-lg">
          San pham sua hat tuoi nguyen chat, khong chat bao quan, duoc che bien
          hang ngay tu nhung nguyen lieu huu co tot nhat. Vi suc khoe cua ban va
          gia dinh.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#products"
            className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 font-raleway text-sm font-semibold text-brand-brown shadow-lg transition-all hover:bg-brand-offwhite hover:shadow-xl hover:scale-105"
          >
            Kham Pha San Pham
          </a>
          <a
            href="#blog"
            className="inline-flex items-center justify-center rounded-full border-2 border-white/70 px-8 py-3.5 font-raleway text-sm font-semibold text-white transition-all hover:border-white hover:bg-white/10"
          >
            Doc Blog Suc Khoe
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="mt-12 flex justify-center">
          <div className="animate-bounce">
            <svg
              className="h-6 w-6 text-white/60"
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
