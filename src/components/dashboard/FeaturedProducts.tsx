import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ProductVariant {
  id: string;
  size: string;
  price: number;
  stock: number;
}

interface FeaturedProductsProps {
  products: Array<{
    id: string;
    name: string;
    image: string;
    price: number;
    variants: ProductVariant[];
    featuredLabel: string | null;
  }>;
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (products.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4 text-center">No featured products.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {products.map((product) => (
        <Link key={product.id} href={`/dashboard/products/${product.id}`}>
          <Card className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-muted">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="56px"
              />
            </div>
            <div className="min-w-0 flex-1 space-y-0.5">
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 shrink-0" />
                <p className="text-sm font-medium truncate">{product.name}</p>
              </div>
              <p className="text-xs text-muted-foreground">
                {product.price.toLocaleString("vi-VN")} VND
              </p>
              <p className="text-xs text-muted-foreground">
                {product.variants.length} variant{product.variants.length !== 1 ? "s" : ""}
              </p>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
