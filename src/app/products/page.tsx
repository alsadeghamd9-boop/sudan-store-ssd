import { asc, eq, ilike, and } from "drizzle-orm";
import { getDb } from "@/db";
import { categories, products } from "@/db/schema";
import { ProductCard } from "@/components/product-card";
export const dynamic = 'force-dynamic';
type Props = { searchParams: Promise<{ category?: string; q?: string }> };
export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams; const db = process.env.DATABASE_URL ? getDb() : null;
  const conditions = [eq(products.active, true)];
  if (params.category) conditions.push(eq(categories.slug, params.category) as never);
  if (params.q) conditions.push(ilike(products.name, `%${params.q.slice(0, 80)}%`));
  const list = db ? await db.select({ id: products.id, name: products.name, slug: products.slug, price: products.price, compareAtPrice: products.compareAtPrice, imageUrl: products.imageUrl, stock: products.stock, category: { name: categories.name } }).from(products).leftJoin(categories, eq(products.categoryId, categories.id)).where(and(...conditions)).orderBy(asc(products.name)) : [];
  const cats = db ? await db.select().from(categories) : [];
  return <main className="container-page min-h-[60vh] py-12"><div className="mb-8 rounded-[28px] bg-[#e9f0e3] px-7 py-9 md:px-12"><p className="mb-2 text-xs font-bold text-forest">تسوق براحتك</p><h1 className="text-3xl font-black">كل المنتجات</h1><p className="mt-3 text-sm text-ink/60">اختيارات متنوعة، مصممة لتناسب يومك.</p></div><div className="mb-7 flex flex-wrap gap-2"><a href="/products" className="rounded-full bg-forest px-4 py-2 text-xs font-bold text-white">الكل</a>{cats.map(c => <a key={c.id} href={`/products?category=${c.slug}`} className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-bold">{c.name}</a>)}</div>{list.length ? <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">{list.map(p=><ProductCard key={p.id} product={p}/>)}</div> : <div className="rounded-3xl bg-white p-12 text-center"><p className="font-bold">لم نعثر على منتجات هنا بعد</p><p className="mt-2 text-sm text-muted">جرّب قسماً آخر أو عد لاحقاً.</p></div>}</main>;
}
