"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus } from "lucide-react";

export interface VariantInput {
  size: string;
  price: number;
  stock: number;
}

interface VariantManagerProps {
  variants: VariantInput[];
  onChange: (variants: VariantInput[]) => void;
}

const QUICK_ADD_SIZES = ["250ml", "500ml", "1L"];

export default function VariantManager({ variants, onChange }: VariantManagerProps) {
  function addVariant(size = "") {
    onChange([...variants, { size, price: 0, stock: 0 }]);
  }

  function removeVariant(index: number) {
    onChange(variants.filter((_, i) => i !== index));
  }

  function updateVariant(index: number, field: keyof VariantInput, value: string | number) {
    const updated = variants.map((v, i) =>
      i === index ? { ...v, [field]: value } : v
    );
    onChange(updated);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Variants</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addVariant()}
          className="h-8 gap-1"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Variant
        </Button>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-muted-foreground">Quick add:</span>
        {QUICK_ADD_SIZES.map((size) => (
          <Button
            key={size}
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => addVariant(size)}
            className="h-7 px-2 text-xs"
          >
            {size}
          </Button>
        ))}
      </div>

      {variants.length === 0 ? (
        <div className="rounded-md border border-dashed p-6 text-center">
          <p className="text-sm text-muted-foreground">
            No variants added. Click Add Variant or use quick-add buttons.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {variants.map((variant, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={variant.size}
                onChange={(e) => updateVariant(index, "size", e.target.value)}
                placeholder="e.g. 500ml"
                className="flex-1"
              />
              <Input
                type="number"
                value={variant.price === 0 ? "" : variant.price}
                onChange={(e) =>
                  updateVariant(index, "price", parseFloat(e.target.value) || 0)
                }
                placeholder="Price"
                className="w-28"
                min={0}
              />
              <Input
                type="number"
                value={variant.stock === 0 ? "" : variant.stock}
                onChange={(e) =>
                  updateVariant(index, "stock", parseInt(e.target.value, 10) || 0)
                }
                placeholder="Stock"
                className="w-24"
                min={0}
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => removeVariant(index)}
                className="h-9 w-9 p-0 shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
