"use client";
import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { useStore } from "./store-provider";
export function ProductDetailActions({ product }: { product: { id: number; name: string; slug: string; price: number; imageUrl: string | null; stock: number } }) {
 const { add } = useStore(); const [added, setAdded] = useState(false);
 return <button disabled={product.stock < 1} onClick={() => { add(product); setAdded(true); setTimeout(() => setAdded(false), 1800); }} className="mt-7 flex w-full items-center justify-center gap-3 rounded-full bg-forest px-6 py-4 font-bold text-white transition hover:bg-ink disabled:bg-gray-300">{added ? <Check size={19}/> : <ShoppingBag size={19}/>} {added ? "تمت الإضافة إلى السلة" : "أضف إلى السلة"}</button>;
}
