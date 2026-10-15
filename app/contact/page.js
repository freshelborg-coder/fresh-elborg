"use client";
import {useApp} from "@/lib/store";
import {PAY} from "@/lib/payments";
export default function Contact(){const {t}=useApp();
  const L=[["fb",PAY.facebook,"#1877F2"],["wch",PAY.channel,"#25D366"]];
  return <div className="card space-y-3 p-6"><h1 className="text-xl font-extrabold">{t("contact")}</h1><p>{t("contactT")}</p>
    <div className="flex flex-wrap gap-3">{L.map(([k,h,c])=><a key={k} className="rounded-xl px-4 py-2 font-bold text-white" style={{background:c}} href={h} target="_blank" rel="noopener noreferrer">{t(k)}</a>)}</div></div>}
