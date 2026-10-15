"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {useApp} from "@/lib/store";
import {PAY} from "@/lib/payments";
import {WhatsAppIcon,FacebookIcon,ShareIcon,StarIcon} from "./Icons";
const ITEMS=[["home","🏠","/"],["store","🛒","/#store"],["offers","🔥","/#store"],["track","📍","/track"],["about","ℹ️","/about"],["contact","✉️","/contact"]];
const ROW="flex w-full items-center gap-3 rounded-xl p-3 text-start font-bold hover:bg-brand-soft";
const TILE="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft";
export default function SideMenu(){
  const {t,menuOpen,setMenuOpen,setCat}=useApp();const r=useRouter();
  const [toast,setToast]=useState("");
  const [rateOpen,setRateOpen]=useState(false);
  const [stars,setStars]=useState(0);
  const go=(k,href)=>{setCat(k==="offers"?"offers":"all");setMenuOpen(false);r.push(href)};
  const flash=m=>{setToast(m);setTimeout(()=>setToast(""),2200)};

  const share=async()=>{
    const url=window.location.origin;
    const data={title:t("brand"),text:t("shareText"),url};
    setMenuOpen(false);
    try{
      if(navigator.share){await navigator.share(data);return;}
      await navigator.clipboard.writeText(`${data.text}\n${url}`);
      flash(t("copied"));
    }catch(e){ /* user cancelled the share sheet */ }
  };
  const rate=()=>{
    setMenuOpen(false);
    if(PAY.rateUrl){window.open(PAY.rateUrl,"_blank","noopener");return;}
    setStars(0);setRateOpen(true);
  };
  const waFeedback=`https://wa.me/${PAY.whatsapp}?text=${encodeURIComponent(`${t("brand")} - ${stars}/5 ⭐\n`)}`;

  return(<>
    <div onClick={()=>setMenuOpen(false)} className={`fixed inset-0 z-40 bg-black/40 transition ${menuOpen?"opacity-100":"pointer-events-none opacity-0"}`}/>
    <aside className={`fixed inset-y-0 start-0 z-50 flex w-72 flex-col overflow-y-auto bg-white shadow-2xl transition-transform duration-300 ${menuOpen?"translate-x-0":"ltr:-translate-x-full rtl:translate-x-full"}`}>
      <div className="flex items-center justify-between bg-brand p-6 text-white"><div><div className="text-xl font-extrabold">{t("brand")}</div><div className="text-sm opacity-80">{t("menu")}</div></div>
        <button onClick={()=>setMenuOpen(false)} className="h-9 w-9 rounded-xl bg-white/20 text-xl" aria-label="close">×</button></div>
      <ul className="p-3">{ITEMS.map(([k,e,h])=><li key={k}><button onClick={()=>go(k,h)} className={ROW}>
        <span className={TILE}>{e}</span>{t(k==="track"?"track":k)}</button></li>)}</ul>
      <div className="space-y-1 border-t p-3">
        <a href={PAY.facebook} target="_blank" rel="noopener noreferrer" className={ROW}><span className={TILE}><FacebookIcon size={26} color="#1877F2"/></span>{t("fb")}</a>
        <a href={PAY.channel} target="_blank" rel="noopener noreferrer" className={ROW}><span className={TILE}><WhatsAppIcon size={24} color="#25D366"/></span>{t("wch")}</a>
      </div>
      <div className="space-y-1 border-t p-3 pb-6">
        <button onClick={share} className={ROW}><span className={TILE}><ShareIcon size={22} color="#12508F"/></span>{t("share")}</button>
        <button onClick={rate} className={ROW}><span className={TILE}><StarIcon size={24} color="#F2B01E"/></span>{t("rate")}</button>
      </div>
    </aside>

    {rateOpen&&<div className="fixed inset-0 z-[60] grid place-items-center bg-black/50 p-4" onClick={()=>setRateOpen(false)}>
      <div role="dialog" onClick={e=>e.stopPropagation()} className="w-full max-w-sm rounded-2xl bg-white p-5 text-center shadow-2xl">
        <div className="text-lg font-extrabold text-brand">{t("rateTitle")}</div>
        <p className="mt-1 text-sm text-ink/70">{t("rateAsk")}</p>
        <div className="my-4 flex justify-center gap-1" dir="ltr">{[1,2,3,4,5].map(n=>
          <button key={n} onClick={()=>setStars(n)} aria-label={`${n}`} className="p-1 transition active:scale-90">
            <StarIcon size={38} color={n<=stars?"#F2B01E":"#CBD5E1"}/></button>)}</div>
        {stars>0&&<div className="space-y-2">
          <p className="text-sm font-bold">{stars>=4?t("rateThanks"):t("rateSorry")}</p>
          <a href={PAY.facebook+"reviews"} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-xl bg-[#1877F2] px-4 py-3 font-bold text-white"><FacebookIcon size={22} color="#fff"/>{t("rateFb")}</a>
          <a href={waFeedback} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 font-bold text-white"><WhatsAppIcon size={22} color="#fff"/>{t("rateWa")}</a>
        </div>}
        <button onClick={()=>setRateOpen(false)} className="mt-3 text-sm font-bold text-ink/60">{t("close")}</button>
      </div></div>}

    {toast&&<div role="status" className="fixed inset-x-0 bottom-24 z-[70] mx-auto w-max max-w-[90%] rounded-full bg-ink px-5 py-2 text-sm font-bold text-white shadow-lg">{toast}</div>}
  </>);
}
