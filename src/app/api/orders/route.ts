import { NextResponse } from "next/server";
import { and, eq, gte, inArray } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db";
import { orders, orderItems, products } from "@/db/schema";
import { BANKS } from "@/lib/banks";
export const dynamic = 'force-dynamic';
const schema=z.object({customerName:z.string().trim().min(2).max(160),phone:z.string().trim().min(7).max(30),email:z.union([z.string().email().max(254),z.literal("")]).optional(),city:z.string().trim().min(2).max(100),address:z.string().trim().min(8).max(1000),notes:z.string().max(1000).optional(),paymentMethod:z.enum(["cod","bank_transfer"]),bankName:z.string().max(100).optional(),items:z.string().max(6000)});
class CheckoutConflict extends Error {}
export async function POST(request:Request){
 try {
  const parsed=schema.safeParse(await request.json()); if(!parsed.success)return NextResponse.json({error:"يرجى التحقق من البيانات المدخلة"},{status:400});
  const body=parsed.data; let cart: {productId:number;quantity:number}[]; try {cart=z.array(z.object({productId:z.number().int().positive(),quantity:z.number().int().min(1).max(30)})).min(1).max(30).parse(JSON.parse(body.items));}catch{return NextResponse.json({error:"السلة غير صالحة"},{status:400});}
  if(body.paymentMethod==="bank_transfer"&&!BANKS.some(b=>b.name===body.bankName))return NextResponse.json({error:"طريقة التحويل غير صالحة"},{status:400});
  const uniqueIds=[...new Set(cart.map(i=>i.productId))]; if(uniqueIds.length!==cart.length)return NextResponse.json({error:"عناصر السلة مكررة"},{status:400});
  const db=getDb();
  const orderNumber=`SS-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0,5).toUpperCase()}`;
  const result=await db.transaction(async(tx)=>{
   const dbProducts=await tx.select().from(products).where(and(inArray(products.id,uniqueIds),eq(products.active,true)));
   if(dbProducts.length!==cart.length)throw new CheckoutConflict("المنتج المطلوب لم يعد متاحاً");
   const byId=new Map(dbProducts.map(p=>[p.id,p])); let subtotal=0;
   for(const item of cart){const p=byId.get(item.productId)!; if(p.stock<item.quantity)throw new CheckoutConflict(`الكمية المطلوبة من ${p.name} غير متوفرة`);subtotal+=p.price*item.quantity;}
   const shipping=0;
   const [created]=await tx.insert(orders).values({orderNumber,customerName:body.customerName,phone:body.phone,email:body.email||null,city:body.city,address:body.address,notes:body.notes||null,subtotal,shipping,total:subtotal+shipping,paymentMethod:body.paymentMethod,bankName:body.paymentMethod==="bank_transfer"?body.bankName:null,paymentStatus:body.paymentMethod==="bank_transfer"?"pending_verification":"unpaid"}).returning({id:orders.id,orderNumber:orders.orderNumber});
   for(const item of cart){const p=byId.get(item.productId)!;const updated=await tx.update(products).set({stock:p.stock-item.quantity,updatedAt:new Date()}).where(and(eq(products.id,p.id),gte(products.stock,item.quantity))).returning({id:products.id});if(!updated.length)throw new CheckoutConflict(`نفدت كمية ${p.name} أثناء تأكيد الطلب`);await tx.insert(orderItems).values({orderId:created.id,productId:p.id,productName:p.name,unitPrice:p.price,quantity:item.quantity});}
   return created;
  });
  return NextResponse.json({orderNumber:result.orderNumber},{status:201});
 }catch(error){if(error instanceof CheckoutConflict)return NextResponse.json({error:error.message},{status:409});console.error("Order creation failed",error);return NextResponse.json({error:"حدث خطأ أثناء تسجيل الطلب. حاول مرة أخرى لاحقاً."},{status:500});}
}
