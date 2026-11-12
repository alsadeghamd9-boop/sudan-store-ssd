import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db";
import { products } from "@/db/schema";
import { requireAdminApi } from "@/lib/auth";
import { slugify } from "@/lib/format";
export const dynamic = 'force-dynamic';
const input=z.object({name:z.string().trim().min(2).max(180),slug:z.string().trim().max(200).optional(),description:z.string().trim().min(5).max(5000),price:z.number().int().positive().max(1000000000),compareAtPrice:z.number().int().positive().nullable().optional(),stock:z.number().int().min(0).max(1000000),categoryId:z.number().int().positive().nullable().optional(),imageUrl:z.string().url().max(2000).nullable().optional(),imagePublicId:z.string().max(255).nullable().optional(),featured:z.boolean(),active:z.boolean()});
type Context={params:Promise<{id:string}>};
export async function PUT(request:Request,{params}:Context){const auth=await requireAdminApi();if(auth)return auth;const {id:raw}=await params;const id=Number(raw);if(!Number.isInteger(id)||id<1)return NextResponse.json({error:"معرف غير صالح"},{status:400});const parsed=input.safeParse(await request.json().catch(()=>null));if(!parsed.success)return NextResponse.json({error:"بيانات المنتج غير صالحة"},{status:400});const b=parsed.data;try{const [updated]=await getDb().update(products).set({...b,slug:slugify(b.slug||b.name),compareAtPrice:b.compareAtPrice??null,imageUrl:b.imageUrl??null,imagePublicId:b.imagePublicId??null,categoryId:b.categoryId??null,updatedAt:new Date()}).where(eq(products.id,id)).returning();return updated?NextResponse.json(updated):NextResponse.json({error:"المنتج غير موجود"},{status:404});}catch{return NextResponse.json({error:"تعذر تعديل المنتج. ربما الرابط المختصر مستخدم بالفعل."},{status:409});}}
export async function DELETE(_request:Request,{params}:Context){const auth=await requireAdminApi();if(auth)return auth;const {id:raw}=await params;const id=Number(raw);if(!Number.isInteger(id)||id<1)return NextResponse.json({error:"معرف غير صالح"},{status:400});const [deleted]=await getDb().delete(products).where(eq(products.id,id)).returning({id:products.id});return deleted?NextResponse.json({ok:true}):NextResponse.json({error:"المنتج غير موجود"},{status:404});}
