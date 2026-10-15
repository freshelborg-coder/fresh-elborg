"use client";
import {useState} from "react";
import {useApp} from "@/lib/store";
import {PAY} from "@/lib/payments";
import {WhatsAppIcon,FacebookIcon} from "./Icons";
export default function ChatButton(){
  const {t}=useApp();const [open,setOpen]=useState(false);
  return(<>
    {open&&<div className="fixed bottom-40 start-4 z-20 w-72 overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 md:bottom-24">
      <div className="bg-brand p-3 text-white"><div className="font-extrabold">{t("brand")}</div><div className="text-xs opacity-80">{t("chatSub")}</div></div>
      <div className="space-y-3 p-4"><p className="rounded-xl bg-paper p-3 text-sm">{t("hello")}</p>
        <div className="text-center text-sm font-bold">{t("contactVia")}</div>
        <div className="flex justify-center gap-6">
          <a href={PAY.facebook} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 text-xs font-bold">
            <span className="grid h-12 w-12 place-items-center"><FacebookIcon size={48} color="#1877F2"/></span>{t("fb")}</a>
          <a href={PAY.channel} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 text-xs font-bold">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-[#25D366]"><WhatsAppIcon size={28} color="#fff"/></span>{t("wch")}</a>
        </div></div></div>}
    <button onClick={()=>setOpen(!open)} aria-label="chat" aria-expanded={open} className="fixed bottom-24 start-4 z-20 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-3xl leading-none text-white shadow-lg ring-4 ring-white/70 active:scale-95 md:bottom-6">{open?"×":<WhatsAppIcon size={30} color="#fff"/>}</button></>);
}
