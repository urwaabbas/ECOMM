export function getProductImageUrl(
  product?: {
    title?: string;
    name?: string;
    images?: string[];
    image?: string;
  } | null,
) {
  const candidates = [
    ...(Array.isArray(product?.images) ? product.images : []),
    product?.image,
  ].filter(Boolean) as string[];

  if (candidates[0]) {
    return candidates[0];
  }

  const label = product?.title || product?.name || "Product";
  const safeLabel = label
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 100 100">
      <rect width="100%" height="100%" fill="#4f46e5" />
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="8" fill="white">
        ${safeLabel}
      </text>
    </svg>
  `)}`;
}
