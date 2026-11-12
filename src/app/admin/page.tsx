import { redirect } from "next/navigation";
import { asc } from "drizzle-orm";
import { getDb } from "@/db";
import { categories, products } from "@/db/schema";
import { isAdmin } from "@/lib/auth";
import { AdminProducts } from "@/components/admin-products";
export const dynamic = 'force-dynamic';
export default async function AdminPage(){if(!(await isAdmin()))redirect("/admin/login");const [list,cats]=await Promise.all([getDb().select().from(products).orderBy(asc(products.createdAt)),getDb().select().from(categories).orderBy(asc(categories.name))]);return <main className="container-page min-h-[60vh] py-10"><AdminProducts initialProducts={list} categories={cats}/></main>}
