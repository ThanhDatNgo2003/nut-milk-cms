import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FeaturedBadgeProps {
  isFeatured: boolean;
  position?: number | null;
  label?: string | null;
}

export default function FeaturedBadge({
  isFeatured,
  position,
  label,
}: FeaturedBadgeProps) {
  if (!isFeatured) {
    return null;
  }

  return (
    <Badge
      variant="default"
      className="bg-amber-500 hover:bg-amber-600 text-white gap-1"
    >
      <Star className="h-3 w-3 fill-current" />
      #{position ?? "?"}
      {label && <span className="font-normal ml-0.5">{label}</span>}
    </Badge>
  );
}
