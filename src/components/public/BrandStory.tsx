export default function BrandStory() {
  return (
    <section id="story" className="bg-brand-green py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          {/* Image placeholder */}
          <div className="relative order-2 md:order-1">
            <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-brand-gold/30 to-brand-brown/20">
              <div className="flex h-full w-full items-center justify-center">
                <div className="text-center">
                  <span className="text-6xl md:text-8xl">🌿</span>
                  <p className="mt-4 font-playfair text-lg text-white/70">
                    Tu Thien Nhien
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 md:order-2">
            <h2 className="mb-6 font-raleway text-3xl font-bold text-brand-gold md:text-4xl">
              Cau Chuyen Cua Chung Toi
            </h2>
            <div className="space-y-4 font-open-sans text-white/90 leading-relaxed">
              <p>
                Nut Milk ra doi tu niem dam me voi loi song lanh manh va tu
                nhien. Chung toi tin rang moi nguoi deu xung dang duoc thuong
                thuc nhung san pham sua hat tuoi ngon, bo duong va an toan.
              </p>
              <p>
                Voi quy trinh san xuat khep kin, nguyen lieu huu co nhap khau va
                doi ngu chuyen gia dinh duong, chung toi cam ket mang den nhung
                san pham chat luong cao nhat.
              </p>
              <p>
                Moi chai sua hat la ket qua cua su tam huyet, tu viec chon loc
                nguyen lieu, che bien thu cong den dong goi can than — tat ca vi
                suc khoe cua ban.
              </p>
            </div>
            <div className="mt-8">
              <a
                href="#"
                className="inline-flex items-center rounded-full bg-brand-gold px-6 py-3 font-raleway text-sm font-semibold text-white transition-all hover:bg-brand-gold/90 hover:shadow-lg"
              >
                Doc Cau Chuyen Day Du →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
