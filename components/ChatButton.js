"use client";
import {useState} from "react";
import {useApp} from "@/lib/store";
import {PAY} from "@/lib/payments";
export default function ChatButton(){
  const {t}=useApp();const [open,setOpen]=useState(false);
  const links=[["fb",PAY.facebook,"#1877F2","f"],["wch",PAY.channel,"#25D366","💬"]];
  return(<>
    {open&&<div className="fixed bottom-40 start-4 z-20 w-72 overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 md:bottom-24">
      <div className="bg-brand p-3 text-white"><div className="font-extrabold">{t("brand")}</div><div className="text-xs opacity-80">{t("chatSub")}</div></div>
      <div className="space-y-3 p-4"><p className="rounded-xl bg-paper p-3 text-sm">{t("hello")}</p>
        <div className="text-center text-sm font-bold">{t("contactVia")}</div>
        <div className="flex justify-center gap-6">{links.map(([k,h,c,i])=><a key={k} href={h} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 text-xs font-bold">
          <span className="grid h-12 w-12 place-items-center rounded-full text-xl font-bold text-white" style={{background:c}}>{i}</span>{t(k)}</a>)}</div></div></div>}
    <button onClick={()=>setOpen(!open)} aria-label="chat" aria-expanded={open} className="fixed bottom-24 start-4 z-20 grid h-14 w-14 place-items-center rounded-full bg-brand text-2xl text-white shadow-lg md:bottom-6">{open?"×":"💬"}</button></>);
}
