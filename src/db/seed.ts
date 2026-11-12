import { getDb } from "./index";
import { categories, products } from "./schema";

async function seed() {
  const db = getDb();
  const created = await db.insert(categories).values([
    { name: "إلكترونيات", slug: "electronics", description: "أجهزة وتقنيات" },
    { name: "المنزل والمطبخ", slug: "home", description: "اختيارات تجعل بيتك أجمل" },
    { name: "أزياء", slug: "fashion", description: "أناقة بطابع سوداني" },
    { name: "عناية شخصية", slug: "personal-care", description: "عناية يومية" }
  ]).onConflictDoNothing().returning();
  const cats = await db.select().from(categories);
  const bySlug = Object.fromEntries(cats.map((c) => [c.slug, c.id]));
  const items = [
    { name: "سماعات لاسلكية برو", slug: "wireless-pro-headphones", description: "صوت نقي وبطارية تدوم طوال اليوم. تصميم مريح للاستخدام اليومي مع عزل فعال للضوضاء.", price: 48500, compareAtPrice: 56000, stock: 14, categoryId: bySlug.electronics, featured: true },
    { name: "مصباح طاولة ذكي", slug: "smart-table-lamp", description: "إضاءة دافئة قابلة للتعديل لتناسب كل لحظة في منزلك.", price: 32000, compareAtPrice: null, stock: 8, categoryId: bySlug.home, featured: true },
    { name: "حقيبة يومية كلاسيكية", slug: "classic-daily-bag", description: "حقيبة عملية بخامات متينة ومساحة واسعة لأغراضك اليومية.", price: 27500, compareAtPrice: 31000, stock: 20, categoryId: bySlug.fashion, featured: true },
    { name: "طقم عناية طبيعي", slug: "natural-care-set", description: "مجموعة عناية يومية بتركيبات لطيفة ومناسبة لكل أنواع البشرة.", price: 19500, compareAtPrice: null, stock: 32, categoryId: bySlug["personal-care"], featured: true },
    { name: "ساعة يد عصرية", slug: "modern-wrist-watch", description: "تصميم أنيق يجمع بين البساطة والمتانة، هدية مثالية.", price: 42000, compareAtPrice: null, stock: 11, categoryId: bySlug.fashion, featured: false },
    { name: "طقم أكواب خزفي", slug: "ceramic-mug-set", description: "أكواب خزفية مصنوعة بعناية لتضيف لمسة جميلة إلى مائدتك.", price: 16000, compareAtPrice: 19000, stock: 25, categoryId: bySlug.home, featured: false }
  ];
  await db.insert(products).values(items).onConflictDoNothing();
  console.log(`Seed complete (${created.length} categories checked).`);
  process.exit(0);
}
seed().catch((e) => { console.error(e); process.exit(1); });
