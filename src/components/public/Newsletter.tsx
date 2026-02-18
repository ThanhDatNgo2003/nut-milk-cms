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
      toast.error("Vui long nhap email cua ban");
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
        toast.success("Dang ky thanh cong! Cam on ban da quan tam.");
        setEmail("");
      } else {
        toast.error(data.error || "Co loi xay ra, vui long thu lai.");
      }
    } catch {
      toast.error("Khong the ket noi. Vui long thu lai sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="bg-gradient-to-br from-brand-brown-dark via-brand-brown to-brand-gold py-16 md:py-24"
    >
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
          <Mail className="h-6 w-6 text-white" />
        </div>
        <h2 className="mb-4 font-raleway text-3xl font-bold text-white md:text-4xl">
          Nhan Cong Thuc & Tips Doc Quyen
        </h2>
        <p className="mb-8 font-open-sans text-white/80">
          Dang ky de nhan nhung cong thuc sua hat moi, meo dinh duong va uu dai
          dac biet tu Nut Milk.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <Input
            type="email"
            placeholder="Email cua ban..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 flex-1 rounded-full border-white/20 bg-white/10 px-5 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-white/20"
            required
          />
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-12 rounded-full bg-white px-8 font-raleway font-semibold text-brand-brown hover:bg-brand-offwhite transition-colors"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand-brown border-t-transparent" />
                Dang ky...
              </span>
            ) : (
              "Dang Ky"
            )}
          </Button>
        </form>

        <p className="mt-4 font-open-sans text-xs text-white/50">
          Chung toi ton trong quyen rieng tu cua ban. Huy dang ky bat cu luc nao.
        </p>
      </div>
    </section>
  );
}
