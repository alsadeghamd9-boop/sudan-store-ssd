"use client";
import Link from "next/link";
import { ShoppingBag, ArrowUpLeft } from "lucide-react";
import { useStore } from "./store-provider";
import { ProductImage } from "./product-image";
import { formatPrice } from "@/lib/format";
export type ProductCardData = { id: number; name: string; slug: string; price: number; compareAtPrice: number | null; imageUrl: string | null; stock: number; category?: { name: string } | null };
export function ProductCard({ product }: { product: ProductCardData }) {
  const { add } = useStore();
  return <article className="group overflow-hidden rounded-[22px] border border-black/[.05] bg-white transition hover:-translate-y-1 hover:shadow-soft">
    <Link href={`/products/${product.slug}`} className="block"><div className="relative"><ProductImage src={product.imageUrl} name={product.name} className="aspect-[1.08]"/>{product.compareAtPrice && product.compareAtPrice > product.price && <span className="absolute right-3 top-3 rounded-full bg-lime px-3 py-1 text-xs font-bold text-ink">عرض خاص</span>}<span className="absolute bottom-3 left-3 grid h-9 w-9 place-items-center rounded-full bg-white text-forest shadow-sm transition group-hover:bg-forest group-hover:text-white"><ArrowUpLeft size={16}/></span></div></Link>
    <div className="p-4"><p className="mb-1 text-xs text-muted">{product.category?.name ?? "اختياراتنا"}</p><Link href={`/products/${product.slug}`} className="line-clamp-1 text-[15px] font-bold text-ink hover:text-forest">{product.name}</Link><div className="mt-3 flex items-center justify-between gap-2"><div><strong className="block text-sm">{formatPrice(product.price)}</strong>{product.compareAtPrice && <del className="text-xs text-muted">{formatPrice(product.compareAtPrice)}</del>}</div><button aria-label="أضف إلى السلة" disabled={product.stock < 1} onClick={() => add(product)} className="grid h-10 w-10 place-items-center rounded-full bg-[#f1f4ed] text-forest transition hover:bg-lime"><ShoppingBag size={17}/></button></div></div>
  </article>;
}
