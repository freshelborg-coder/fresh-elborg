"use client";
import {useState} from "react";
import {useApp} from "@/lib/store";
function Pic({p}){const [bad,setBad]=useState(false);
  return bad||!p.img?<span className="text-5xl">{p.e}</span>:<img src={p.img} alt={p.name.ar} loading="lazy" decoding="async" onError={()=>setBad(true)} className="h-full w-full object-cover"/>}
export default function ProductCard({p,rank}){
  const {t,lang,add}=useApp();
  return(<article className="card relative flex flex-col overflow-hidden">
    {rank&&<span className="absolute start-2 top-2 z-10 rounded-full bg-ink px-2 py-0.5 text-xs font-bold text-white">🔥 #{rank}</span>}
    {p.old&&<span className="absolute end-2 top-2 z-10 rounded-full bg-gold px-2 py-0.5 text-xs font-extrabold text-ink">-{Math.round((1-p.price/p.old)*100)}%</span>}
    <div className="grid h-28 place-items-center overflow-hidden bg-brand-soft"><Pic p={p}/></div>
    <div className="flex flex-1 flex-col gap-1 p-3">
      <h3 className="text-sm font-bold leading-snug">{p.name[lang]}</h3><p className="text-xs text-ink/60">{p.weight}</p>
      <div className="mt-auto flex items-center justify-between pt-2"><span className="font-extrabold text-brand">{p.price} {t("cur")}{p.old&&<s className="ms-1 text-xs font-normal text-ink/40">{p.old}</s>}</span>
        <button onClick={()=>add(p.id)} className="btn px-3 py-1 text-sm" aria-label={t("add")}>🛒</button></div>
    </div></article>);
}
