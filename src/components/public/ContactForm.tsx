"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";

const subjects = [
  "Hỏi về sản phẩm",
  "Đặt hàng",
  "Hợp tác kinh doanh",
  "Góp ý & Phản hồi",
  "Khác",
];

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: subjects[0],
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.message) {
      setError("Vui lòng điền đầy đủ thông tin bắt buộc.");
      return;
    }

    setSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-brand-mint bg-brand-cream/50 py-16 text-center">
        <CheckCircle className="mb-4 h-12 w-12 text-brand-green" />
        <h3 className="font-raleway text-xl font-bold text-brand-charcoal">
          Cảm ơn bạn!
        </h3>
        <p className="mt-2 max-w-sm font-open-sans text-sm text-brand-gray">
          Chúng tôi đã nhận được tin nhắn của bạn và sẽ phản hồi trong thời gian sớm nhất.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setForm({ name: "", email: "", phone: "", subject: subjects[0], message: "" });
          }}
          className="mt-6 font-open-sans text-sm font-medium text-brand-green hover:text-brand-green-dark transition-colors"
        >
          Gửi tin nhắn khác
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 font-open-sans text-sm text-red-600">
          {error}
        </div>
      )}

      <div>
        <label className="mb-1.5 block font-open-sans text-sm font-medium text-brand-charcoal">
          Tên của bạn <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Nguyễn Văn A"
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 font-open-sans text-sm text-brand-charcoal placeholder:text-brand-gray/50 focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20 transition-all"
          required
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block font-open-sans text-sm font-medium text-brand-charcoal">
            Email <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="email@example.com"
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 font-open-sans text-sm text-brand-charcoal placeholder:text-brand-gray/50 focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20 transition-all"
            required
          />
        </div>
        <div>
          <label className="mb-1.5 block font-open-sans text-sm font-medium text-brand-charcoal">
            Số điện thoại
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="0909 xxx xxx"
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 font-open-sans text-sm text-brand-charcoal placeholder:text-brand-gray/50 focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20 transition-all"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block font-open-sans text-sm font-medium text-brand-charcoal">
          Chủ đề
        </label>
        <select
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 font-open-sans text-sm text-brand-charcoal focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20 transition-all"
        >
          {subjects.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block font-open-sans text-sm font-medium text-brand-charcoal">
          Tin nhắn <span className="text-red-400">*</span>
        </label>
        <textarea
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="Viết tin nhắn của bạn..."
          rows={5}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 font-open-sans text-sm text-brand-charcoal placeholder:text-brand-gray/50 focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20 transition-all resize-y"
          required
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-green px-6 py-3 font-open-sans text-base font-semibold text-white transition-colors hover:bg-brand-green-dark disabled:opacity-60"
      >
        {submitting ? (
          "Đang gửi..."
        ) : (
          <>
            <Send className="h-4 w-4" />
            Gửi Tin Nhắn
          </>
        )}
      </button>
    </form>
  );
}
