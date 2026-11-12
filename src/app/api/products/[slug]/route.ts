import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { products, categories } from "@/db/schema";
export const dynamic = 'force-dynamic';
export async function GET(_request: Request,{params}:{params:Promise<{slug:string}>}) { const {slug}=await params; const [product]=await getDb().select({id:products.id,name:products.name,slug:products.slug,description:products.description,price:products.price,compareAtPrice:products.compareAtPrice,stock:products.stock,imageUrl:products.imageUrl,category:{name:categories.name,slug:categories.slug}}).from(products).leftJoin(categories,eq(products.categoryId,categories.id)).where(eq(products.slug,slug)).limit(1); return product?NextResponse.json(product):NextResponse.json({error:"المنتج غير موجود"},{status:404}); }
