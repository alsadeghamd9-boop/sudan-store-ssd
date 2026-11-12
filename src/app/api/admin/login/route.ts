import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { createAdminSession } from "@/lib/auth";
export const dynamic = 'force-dynamic';
const bodySchema=z.object({email:z.string().email().max(254),password:z.string().min(1).max(500)});
function safeEqual(a:string,b:string){const left=Buffer.from(a);const right=Buffer.from(b);return left.length===right.length&&timingSafeEqual(left,right);}
export async function POST(request:Request){
 const input=bodySchema.safeParse(await request.json().catch(()=>null));if(!input.success)return NextResponse.json({error:"بيانات الدخول غير صحيحة"},{status:400});
 const email=process.env.ADMIN_EMAIL;const password=process.env.ADMIN_PASSWORD;if(!email||!password||!process.env.ADMIN_SESSION_SECRET)return NextResponse.json({error:"إعدادات الإدارة غير مكتملة على الخادم"},{status:503});
 if(!safeEqual(input.data.email,email)||!safeEqual(input.data.password,password))return NextResponse.json({error:"البريد الإلكتروني أو كلمة المرور غير صحيحة"},{status:401});
 try{await createAdminSession(email);return NextResponse.json({ok:true});}catch{return NextResponse.json({error:"تعذر إنشاء جلسة الإدارة. تحقق من إعدادات الخادم."},{status:500});}
}
