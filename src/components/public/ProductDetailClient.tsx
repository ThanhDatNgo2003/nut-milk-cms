"use client";

import { useState } from "react";
import { ShoppingBag, Heart } from "lucide-react";

interface Variant {
  id: string;
  size: string;
  price: number;
  stock: number;
}

interface ProductDetailClientProps {
  price: number;
  variants: Variant[];
}

export default function ProductDetailClient({ price, variants }: ProductDetailClientProps) {
  const [selectedVariant, setSelectedVariant] = useState(
    variants.length > 0 ? variants[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);

  const currentPrice = selectedVariant ? selectedVariant.price : price;
  const inStock = selectedVariant ? selectedVariant.stock > 0 : true;
  const maxQty = selectedVariant ? Math.min(selectedVariant.stock, 10) : 10;

  return (
    <div className="space-y-5">
      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="font-playfair text-3xl font-bold text-brand-charcoal">
          {currentPrice.toLocaleString("vi-VN")}₫
        </span>
        {inStock ? (
          <span className="rounded-full bg-brand-mint px-2.5 py-0.5 font-open-sans text-xs font-medium text-brand-green">
            Có sẵn
          </span>
        ) : (
          <span className="rounded-full bg-red-50 px-2.5 py-0.5 font-open-sans text-xs font-medium text-red-500">
            Hết hàng
          </span>
        )}
      </div>

      {/* Variants */}
      {variants.length > 1 && (
        <div>
          <h4 className="mb-2 font-raleway text-xs font-semibold uppercase tracking-wider text-brand-gray">
            Kích thước
          </h4>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => (
              <button
                key={v.id}
                onClick={() => {
                  setSelectedVariant(v);
                  setQuantity(1);
                }}
                className={`rounded-lg border px-4 py-2 font-open-sans text-sm transition-all ${
                  selectedVariant?.id === v.id
                    ? "border-brand-green bg-brand-cream text-brand-green font-medium shadow-sm"
                    : "border-gray-200 text-brand-charcoal hover:border-brand-green/40"
                } ${v.stock === 0 ? "opacity-40 cursor-not-allowed" : ""}`}
                disabled={v.stock === 0}
              >
                {v.size}
                <span className="ml-1.5 text-xs text-brand-gray">
                  {v.price.toLocaleString("vi-VN")}₫
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div>
        <h4 className="mb-2 font-raleway text-xs font-semibold uppercase tracking-wider text-brand-gray">
          Số lượng
        </h4>
        <div className="inline-flex items-center rounded-lg border border-gray-200">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="flex h-10 w-10 items-center justify-center text-brand-gray transition-colors hover:bg-brand-cream hover:text-brand-green rounded-l-lg"
            disabled={quantity <= 1}
          >
            −
          </button>
          <span className="flex h-10 w-12 items-center justify-center border-x border-gray-200 font-open-sans text-sm font-medium text-brand-charcoal">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(Math.min(maxQty, quantity + 1))}
            className="flex h-10 w-10 items-center justify-center text-brand-gray transition-colors hover:bg-brand-cream hover:text-brand-green rounded-r-lg"
            disabled={quantity >= maxQty}
          >
            +
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-green px-6 py-3 font-open-sans text-base font-semibold text-white transition-colors hover:bg-brand-green-dark disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!inStock}
        >
          <ShoppingBag className="h-5 w-5" />
          {inStock ? "Mua Ngay" : "Hết Hàng"}
        </button>
        <button
          onClick={() => setLiked(!liked)}
          className={`flex h-12 w-12 items-center justify-center rounded-xl border-2 transition-all ${
            liked
              ? "border-red-300 bg-red-50 text-red-500"
              : "border-gray-200 text-brand-gray hover:border-red-300 hover:text-red-400"
          }`}
          aria-label="Yêu thích"
        >
          <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
        </button>
      </div>
    </div>
  );
}
