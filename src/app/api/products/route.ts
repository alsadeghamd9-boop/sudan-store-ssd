import { NextRequest, NextResponse } from "next/server";
import { and, eq, ilike } from "drizzle-orm";
import { getDb } from "@/db";
import { categories, products } from "@/db/schema";
export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
 const { searchParams } = new URL(request.url); const conditions = [eq(products.active, true)]; const q=searchParams.get("q")?.slice(0,80); const category=searchParams.get("category")?.slice(0,120);
 if(q) conditions.push(ilike(products.name,`%${q}%`));
 const result=await getDb().select({id:products.id,name:products.name,slug:products.slug,description:products.description,price:products.price,compareAtPrice:products.compareAtPrice,stock:products.stock,imageUrl:products.imageUrl,featured:products.featured,category:{name:categories.name,slug:categories.slug}}).from(products).leftJoin(categories,eq(products.categoryId,categories.id)).where(and(...conditions)).limit(100);
 return NextResponse.json(result);
}
