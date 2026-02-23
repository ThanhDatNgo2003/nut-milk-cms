/**
 * Blog utility functions for search, filter, and content processing
 */

/**
 * Calculate reading time from content string (HTML or plain text)
 */
export function calculateReadingTime(content: string): number {
  const text = content.replace(/<[^>]*>/g, "");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/**
 * Format date in Vietnamese style
 */
export function formatDateVN(date: string | Date): string {
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear();
  return `${day} Tháng ${month}, ${year}`;
}

/**
 * Format price in VND
 */
export function formatPriceVND(price: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Strip HTML tags for excerpt generation
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

/**
 * Truncate text to max length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).replace(/\s+\S*$/, "") + "...";
}

/**
 * Extract headings from HTML content for Table of Contents
 */
export function extractHeadings(
  htmlContent: string
): { id: string; text: string; level: number }[] {
  const headings: { id: string; text: string; level: number }[] = [];
  const regex = /<h([2-3])[^>]*(?:id="([^"]*)")?[^>]*>(.*?)<\/h[2-3]>/gi;
  let match;

  while ((match = regex.exec(htmlContent)) !== null) {
    const level = parseInt(match[1]);
    const text = match[3].replace(/<[^>]*>/g, "").trim();
    const id =
      match[2] ||
      text
        .toLowerCase()
        .replace(/[^\w\sàáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
    headings.push({ id, text, level });
  }

  return headings;
}

/**
 * Add IDs to headings in HTML content for anchor links
 */
export function addHeadingIds(htmlContent: string): string {
  return htmlContent.replace(
    /<h([2-3])([^>]*)>(.*?)<\/h([2-3])>/gi,
    (_match, level, attrs, text, _closeLevel) => {
      const plainText = text.replace(/<[^>]*>/g, "").trim();
      const id = plainText
        .toLowerCase()
        .replace(/[^\w\sàáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

      if (attrs.includes("id=")) {
        return `<h${level}${attrs}>${text}</h${level}>`;
      }
      return `<h${level} id="${id}"${attrs}>${text}</h${level}>`;
    }
  );
}

/**
 * Build search query for blog posts
 */
export interface BlogFilterParams {
  search?: string;
  category?: string;
  tags?: string[];
  sort?: "newest" | "oldest" | "popular";
  page?: number;
  limit?: number;
}

export function parseBlogSearchParams(
  searchParams: Record<string, string | string[] | undefined>
): BlogFilterParams {
  const search = typeof searchParams.search === "string" ? searchParams.search : undefined;
  const category = typeof searchParams.category === "string" ? searchParams.category : undefined;
  const tagsParam = typeof searchParams.tags === "string" ? searchParams.tags : undefined;
  const tags = tagsParam ? tagsParam.split(",").filter(Boolean) : undefined;
  const sort = (typeof searchParams.sort === "string" ? searchParams.sort : "newest") as BlogFilterParams["sort"];
  const page = typeof searchParams.page === "string" ? Math.max(1, parseInt(searchParams.page)) : 1;
  const limit = typeof searchParams.limit === "string" ? Math.min(20, Math.max(1, parseInt(searchParams.limit))) : 10;

  return { search, category, tags, sort, page, limit };
}
