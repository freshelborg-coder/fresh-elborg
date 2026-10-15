"use client";
import {useRouter} from "next/navigation";
import {useApp} from "@/lib/store";
import {PAY} from "@/lib/payments";
const ITEMS=[["home","🏠","/"],["store","🛒","/#store"],["offers","🔥","/#store"],["track","📍","/track"],["about","ℹ️","/about"],["contact","✉️","/contact"]];
export default function SideMenu(){
  const {t,menuOpen,setMenuOpen,setCat}=useApp();const r=useRouter();
  const go=(k,href)=>{setCat(k==="offers"?"offers":"all");setMenuOpen(false);r.push(href)};
  return(<>
    <div onClick={()=>setMenuOpen(false)} className={`fixed inset-0 z-40 bg-black/40 transition ${menuOpen?"opacity-100":"pointer-events-none opacity-0"}`}/>
    <aside className={`fixed inset-y-0 start-0 z-50 w-72 bg-white shadow-2xl transition-transform duration-300 ${menuOpen?"translate-x-0":"ltr:-translate-x-full rtl:translate-x-full"}`}>
      <div className="flex items-center justify-between bg-brand p-6 text-white"><div><div className="text-xl font-extrabold">{t("brand")}</div><div className="text-sm opacity-80">{t("menu")}</div></div>
        <button onClick={()=>setMenuOpen(false)} className="h-9 w-9 rounded-xl bg-white/20 text-xl" aria-label="close">×</button></div>
      <ul className="p-3">{ITEMS.map(([k,e,h])=><li key={k}><button onClick={()=>go(k,h)} className="flex w-full items-center gap-3 rounded-xl p-3 text-start font-bold hover:bg-brand-soft">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft">{e}</span>{t(k==="track"?"track":k)}</button></li>)}</ul>
      <div className="space-y-1 border-t p-3">{[["fb",PAY.facebook,"📘"],["wch",PAY.channel,"💚"]].map(([k,h,e])=><a key={k} href={h} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl p-3 font-bold hover:bg-brand-soft"><span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft">{e}</span>{t(k)}</a>)}</div>
    </aside></>);
}
