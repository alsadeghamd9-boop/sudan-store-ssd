import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { products, categories } from "@/db/schema";
import { ProductDetailActions } from "@/components/product-detail-actions";
import { ProductImage } from "@/components/product-image";
import { formatPrice } from "@/lib/format";
export const dynamic = 'force-dynamic';
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> { const { slug } = await params; const [p] = await getDb().select().from(products).where(eq(products.slug, slug)).limit(1); return { title: p?.name ?? "المنتج غير موجود", description: p?.description }; }
export default async function ProductPage({ params }: Props) {
 const { slug } = await params; const [product] = await getDb().select({ id: products.id, name: products.name, slug: products.slug, description: products.description, price: products.price, compareAtPrice: products.compareAtPrice, stock: products.stock, imageUrl: products.imageUrl, category: { name: categories.name } }).from(products).leftJoin(categories, eq(products.categoryId, categories.id)).where(eq(products.slug, slug)).limit(1);
 if (!product) notFound();
 return <main className="container-page py-10"><div className="mb-7 text-sm text-muted"><Link href="/">الرئيسية</Link> / <Link href="/products">المنتجات</Link> / <span className="text-ink">{product.name}</span></div><div className="grid gap-8 md:grid-cols-2 md:gap-14"><ProductImage src={product.imageUrl} name={product.name} className="aspect-square rounded-[30px]"/><div className="py-3"><span className="inline-flex rounded-full bg-[#edf3e6] px-3 py-1.5 text-xs font-bold text-forest">{product.category?.name ?? "منتجات مختارة"}</span><h1 className="mt-5 text-3xl font-black md:text-4xl">{product.name}</h1><div className="mt-4 flex items-center gap-3"><b className="text-2xl">{formatPrice(product.price)}</b>{product.compareAtPrice && <del className="text-muted">{formatPrice(product.compareAtPrice)}</del>}</div><p className="mt-6 leading-8 text-ink/65">{product.description}</p><p className={`mt-5 text-sm font-bold ${product.stock > 0 ? "text-forest" : "text-red-600"}`}>{product.stock > 0 ? `متوفر — ${product.stock} قطعة` : "نفد من المخزون"}</p><ProductDetailActions product={product}/><div className="mt-8 grid grid-cols-2 gap-3 border-t border-black/10 pt-6 text-xs text-muted"><p>🚚 توصيل حسب منطقتك</p><p>🔒 دفع مرن وآمن</p></div></div></div></main>;
}
