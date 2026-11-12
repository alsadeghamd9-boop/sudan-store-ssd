# سوق السودان — Next.js Store

متجر عربي RTL مبني بـ Next.js App Router وTypeScript وTailwind CSS وDrizzle ORM وSupabase PostgreSQL. يشمل المنتجات والأقسام والسلة والطلبات مع الدفع عند الاستلام أو التحويل البنكي، ولوحة مسؤول محمية ورفع صور مباشر إلى Cloudinary.

## ابدأ محلياً

1. ثبّت Node.js 20+ ثم شغّل `npm install`.
2. انسخ `.env.example` إلى `.env.local` وأدخل بيانات Supabase وCloudinary. لا تضع أسراراً في متغيرات `NEXT_PUBLIC_*`.
3. أنشئ الجداول في قاعدة Supabase:
   - `npm run db:push` (الأسرع للتطوير)، أو استخدم `npm run db:generate` ثم `npm run db:migrate` لإدارة التغييرات بالترحيلات.
4. أدخل بيانات تجريبية اختيارية: `npm run db:seed`.
5. شغّل `npm run dev` وافتح `http://localhost:3000`.

## النشر على Vercel

اربط مستودع GitHub بمشروع Vercel، أضف جميع المتغيرات المذكورة أدناه ضمن Project Settings → Environment Variables، ثم أعد النشر. استخدم **Supabase Transaction Pooler** في `DATABASE_URL` (عادة المنفذ 6543) مع `sslmode=require`. شغّل `npm run db:push` من بيئة موثوقة مرة واحدة قبل أول نشر (أو نفّذ الترحيلات من CI). الاتصال في `src/db/index.ts` ينشأ فقط عند أول استدعاء `getDb()` وليس عند تحميل الوحدة؛ صفحات قاعدة البيانات ديناميكية لتجنب اتصال قاعدة البيانات أثناء البناء.

## متغيرات البيئة

| المتغير | مطلوب | الوصف |
|---|---:|---|
| `DATABASE_URL` | نعم | رابط PostgreSQL من Supabase؛ استخدم رابط Transaction Pooler في Vercel. |
| `ADMIN_EMAIL` | نعم | بريد المسؤول، محفوظ على الخادم فقط. |
| `ADMIN_PASSWORD` | نعم | كلمة مرور قوية وفريدة لحساب الإدارة. |
| `ADMIN_SESSION_SECRET` | نعم | سر عشوائي لا يقل عن 32 حرفاً لتوقيع جلسات المسؤول؛ أنشئه بـ `openssl rand -base64 32`. |
| `CLOUDINARY_CLOUD_NAME` | لرفع الصور | اسم Cloudinary cloud. |
| `CLOUDINARY_API_KEY` | لرفع الصور | مفتاح API الخاص بـ Cloudinary. |
| `CLOUDINARY_API_SECRET` | لرفع الصور | السر الخاص بـ Cloudinary؛ لا يكشف للمتصفح. |
| `NEXT_PUBLIC_SITE_URL` | اختياري | عنوان المتجر المنشور. |

## الحزم

حزم التشغيل: `next`, `react`, `react-dom`, `drizzle-orm`, `postgres`, `jose`, `zod`, `lucide-react`. أدوات التطوير والبناء: `typescript`, `tailwindcss`, `postcss`, `autoprefixer`, `drizzle-kit`, `tsx`, `@types/node`, `@types/react`, `@types/react-dom`.

> ملاحظة: حسابات البنوك المعروضة في صفحة الدفع أرقام وهمية توضيحية. استبدلها بأرقام صحيحة ومصرح باستخدامها قبل استقبال طلبات حقيقية. نموذج الدفع لا يعالج مدفوعات إلكترونية ولا يطلب بيانات بطاقات. عنوان التوصيل ورسومه بحاجة إلى مواءمة مع شركة التوصيل التي ستستخدمها.

## قاعدة البيانات

التعريف الكامل للجداول والعلاقات والفهارس والـ enums في `src/db/schema.ts`: `categories`, `products`, `orders`, `order_items`. الأسعار مخزنة كأعداد صحيحة بالجنيه السوداني؛ السعر والمخزون في إنشاء الطلب يعاد التحقق منهما من قاعدة البيانات داخل transaction، ولا يعتمد الخادم على إجمالي السلة المرسل من المتصفح.
