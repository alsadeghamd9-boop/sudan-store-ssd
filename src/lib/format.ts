export function formatPrice(value: number) {
  return `${new Intl.NumberFormat("ar-SD", { maximumFractionDigits: 0 }).format(value)} ج.س`;
}
export function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "");
}
