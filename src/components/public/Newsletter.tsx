"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Vui lòng nhập email của bạn");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/public/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Đăng ký thành công! Cảm ơn bạn đã quan tâm.");
        setEmail("");
      } else {
        toast.error(data.error || "Có lỗi xảy ra, vui lòng thử lại.");
      }
    } catch {
      toast.error("Không thể kết nối. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="bg-gradient-to-br from-brand-leaf via-brand-green-dark to-brand-green py-16 md:py-24"
    >
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <div className="animate-on-scroll">
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
            <Mail className="h-6 w-6 text-white" />
          </div>
          <h2 className="mb-4 font-raleway text-3xl font-bold text-white md:text-4xl">
            Nhận Công Thức & Tips Độc Quyền
          </h2>
          <p className="mb-8 font-open-sans text-white/80">
            Đăng ký để nhận những công thức sữa hạt mới, mẹo dinh dưỡng và ưu đãi
            đặc biệt từ Hạt Mộc.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="animate-on-scroll animate-delay-200 mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <Input
            type="email"
            placeholder="Email của bạn..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 flex-1 rounded-full border-white/20 bg-white/10 px-5 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-white/20"
            required
          />
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-12 rounded-full bg-white px-8 font-raleway font-semibold text-brand-green transition-all duration-300 hover:bg-brand-cream hover:shadow-lg hover:scale-105"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand-green border-t-transparent" />
                Đang ký...
              </span>
            ) : (
              "Đăng Ký"
            )}
          </Button>
        </form>

        <p className="animate-on-scroll animate-delay-300 mt-4 font-open-sans text-xs text-white/50">
          Chúng tôi tôn trọng quyền riêng tư của bạn. Huỷ đăng ký bất cứ lúc nào.
        </p>
      </div>
    </section>
  );
}
