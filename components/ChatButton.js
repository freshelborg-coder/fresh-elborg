"use client";
import {useEffect,useState} from "react";
import {useApp} from "@/lib/store";
import {PAY} from "@/lib/payments";
import {WhatsAppIcon,FacebookIcon} from "./Icons";
// Floating "message" button. Opens a chat-style card with WhatsApp (store phone number) and Facebook.
const PLUS="url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28'%3E%3Cpath d='M14 10v8M10 14h8' stroke='%23d3dbe6' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E\")";
function MessageIcon({size=28}){
  return(<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 3.2a8.6 8.6 0 1 1-4.1 16.2L3.4 20.8l1.3-4.2A8.6 8.6 0 0 1 12 3.2Z"/></svg>);
}
export default function ChatButton(){
  const {t,lang}=useApp();const [open,setOpen]=useState(false);const [time,setTime]=useState("");
  useEffect(()=>{if(open)setTime(new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"}))},[open]);
  useEffect(()=>{
    if(!open)return;
    const k=e=>{if(e.key==="Escape")setOpen(false)};
    document.addEventListener("keydown",k);return()=>document.removeEventListener("keydown",k);
  },[open]);
  const msg=lang==="ar"?"السلام عليكم، أريد الاستفسار عن منتجات فريش البرج":"Hello, I would like to ask about Fresh Al-Burj products";
  const wa=`https://wa.me/${PAY.whatsapp}?text=${encodeURIComponent(msg)}`;
  return(<>
    {open&&<div onClick={()=>setOpen(false)} className="fixed inset-0 z-20 bg-black/35"/>}
    {open&&<div role="dialog" aria-label={t("brand")} className="fixed inset-x-4 bottom-44 z-30 mx-auto max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl md:inset-x-auto md:bottom-24 md:start-4 md:w-80">
      <div className="flex items-center gap-3 bg-brand p-4 text-white">
        <img src="/icons/icon-192.png" alt="" width="48" height="48" className="h-12 w-12 shrink-0 rounded-full ring-4 ring-white/30"/>
        <div className="min-w-0 flex-1"><div className="text-lg font-extrabold leading-tight">{t("brand")}</div>
          <div className="flex items-center gap-1.5 text-sm text-white/85"><span className="h-2 w-2 rounded-full bg-[#4ade80]"/>{t("chatSub")}</div></div>
        <button onClick={()=>setOpen(false)} aria-label="close" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/20 text-xl leading-none">×</button>
      </div>
      <div className="flex items-end gap-2 bg-[#eef2f7] p-4" style={{backgroundImage:PLUS}}>
        <img src="/icons/icon-192.png" alt="" width="32" height="32" className="h-8 w-8 shrink-0 rounded-full"/>
        <div className="rounded-2xl rounded-es-md bg-white px-4 py-3 shadow-sm"><div className="text-base">{t("hello")}</div><div dir="ltr" className="mt-1 text-start text-xs text-slate-400">{time}</div></div>
      </div>
      <div className="bg-white px-4 pb-4 pt-3">
        <div className="mb-3 text-center text-base font-bold">{t("contactVia")}</div>
        <div className="flex justify-center gap-6">
          <a href={wa} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 text-xs text-slate-600">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-[#25D366] shadow"><WhatsAppIcon size={28} color="#fff"/></span>WhatsApp</a>
          <a href={PAY.facebook} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 text-xs text-slate-600">
            <span className="grid h-12 w-12 place-items-center"><FacebookIcon size={48} color="#1877F2"/></span>Facebook</a>
        </div>
      </div>
    </div>}
    <button onClick={()=>setOpen(!open)} aria-label="chat" aria-expanded={open} className="fixed bottom-24 start-4 z-30 grid h-14 w-14 place-items-center rounded-full bg-brand text-white shadow-lg ring-4 ring-white/70 active:scale-95 md:bottom-6">
      {!open&&<span className="pointer-events-none absolute -inset-2 animate-ping rounded-full bg-brand/20" style={{animationDuration:"2.4s"}}/>}
      <span className="relative text-2xl leading-none">{open?"×":<MessageIcon/>}</span></button></>);
}
