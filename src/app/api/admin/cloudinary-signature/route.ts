import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { requireAdminApi } from "@/lib/auth";
export const dynamic = 'force-dynamic';
export async function POST(){const auth=await requireAdminApi();if(auth)return auth;const cloudName=process.env.CLOUDINARY_CLOUD_NAME;const apiKey=process.env.CLOUDINARY_API_KEY;const apiSecret=process.env.CLOUDINARY_API_SECRET;if(!cloudName||!apiKey||!apiSecret)return NextResponse.json({error:"إعدادات Cloudinary غير مكتملة"},{status:503});const timestamp=Math.floor(Date.now()/1000);const folder="sudan-store/products";const signature=createHash("sha1").update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`).digest("hex");return NextResponse.json({cloudName,apiKey,timestamp,folder,signature});}
