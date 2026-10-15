"use client";
import Link from "next/link";
import {useApp} from "@/lib/store";
import SearchBar from "./SearchBar";
export default function Header(){
  const {t,lang,setLang,count,setCartOpen,setMenuOpen}=useApp();
  return(<header className="sticky top-0 z-30 bg-white/95 shadow-sm backdrop-blur">
    <div className="mx-auto flex max-w-5xl items-center gap-2 px-4 py-3">
      <button onClick={()=>setMenuOpen(true)} className="grid h-10 w-10 place-items-center rounded-xl bg-paper text-xl" aria-label="menu">☰</button>
      <Link href="/" className="mx-auto flex items-center gap-2 text-xl font-extrabold text-brand sm:mx-4"><img src="/icons/icon-192.png" alt="" width="36" height="36" className="h-9 w-9 rounded-xl"/>{t("brand")}</Link>
      <button onClick={()=>setLang(lang==="ar"?"en":"ar")} className="rounded-lg border px-3 py-1 text-sm font-bold" aria-label="language">{t("lang")}</button>
      <button onClick={()=>setCartOpen(true)} className="btn relative" aria-label={t("cart")}>🛒{count>0&&<span className="ms-1">{count}</span>}</button>
    </div>
    <div className="mx-auto max-w-5xl px-4 pb-3"><SearchBar/></div>
  </header>);
}
