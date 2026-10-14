"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useApp} from "@/lib/store";
export default function BottomNav(){
  const {t,count,setCartOpen}=useApp();const path=usePathname();
  const cls=a=>`flex flex-1 flex-col items-center py-2 text-xs font-bold ${a?"text-brand":"text-ink/60"}`;
  return(<nav className="fixed inset-x-0 bottom-0 z-30 flex border-t bg-white pb-[env(safe-area-inset-bottom)] md:hidden">
    <Link href="/" className={cls(path==="/")}><span className="text-xl">🏠</span>{t("home")}</Link>
    <Link href="/track" className={cls(path==="/track")}><span className="text-xl">📍</span>{t("track")}</Link>
    <button onClick={()=>setCartOpen(true)} className={cls(false)}><span className="text-xl">🛒{count>0?` ${count}`:""}</span>{t("cart")}</button>
    <Link href="/account" className={cls(path==="/account")}><span className="text-xl">👤</span>{t("account")}</Link>
  </nav>);
}
