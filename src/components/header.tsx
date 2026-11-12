"use client";
import Link from "next/link";
import { Search, ShoppingBag, Menu, X, Leaf } from "lucide-react";
import { useState } from "react";
import { useStore } from "./store-provider";
export function Header() {
  const { count } = useStore(); const [open, setOpen] = useState(false);
  const links = <><Link href="/products">كل المنتجات</Link><a href="/#categories">الأقسام</a><a href="/#about">عن المتجر</a></>;
  return <header className="sticky top-0 z-40 border-b border-black/[.05] bg-[#fbfbf8]/90 backdrop-blur-xl"><div className="container-page flex h-[76px] items-center justify-between gap-5">
    <Link href="/" className="flex items-center gap-2"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-forest text-lime"><Leaf size={20}/></span><span><b className="block text-lg leading-tight">سوق السودان</b><small className="text-[10px] tracking-wide text-muted">اختيارك الأقرب</small></span></Link>
    <nav className="hidden items-center gap-8 text-sm font-semibold text-ink/75 md:flex">{links}</nav>
    <div className="flex items-center gap-2"><Link href="/products" aria-label="بحث" className="grid h-10 w-10 place-items-center rounded-full hover:bg-black/5"><Search size={19}/></Link><Link href="/cart" className="relative flex h-10 items-center gap-2 rounded-full bg-forest px-4 text-sm font-bold text-white"><ShoppingBag size={17}/><span className="hidden sm:inline">السلة</span>{count > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-lime px-1 text-[10px] font-black text-ink">{count}</span>}</Link><button onClick={() => setOpen(!open)} className="grid h-10 w-10 place-items-center rounded-full md:hidden" aria-label="القائمة">{open ? <X/> : <Menu/>}</button></div>
  </div>{open && <nav className="container-page flex flex-col gap-4 border-t py-5 text-sm font-semibold md:hidden">{links}</nav>}</header>;
}
