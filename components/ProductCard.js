"use client";
import {useState,useRef,useEffect} from "react";
import {useApp} from "@/lib/store";
// If the photo is missing we show the emoji. The effect also catches images that already failed
// before React attached onError (which showed a broken-image icon).
function Pic({p}){const [bad,setBad]=useState(false);const ref=useRef(null);
  useEffect(()=>{const i=ref.current;if(i&&i.complete&&i.naturalWidth===0)setBad(true);},[]);
  return bad||!p.img?<span className="text-6xl">{p.e}</span>:<img ref={ref} src={p.img} alt={p.name.ar} loading="lazy" decoding="async" onError={()=>setBad(true)} className="h-full w-full object-cover"/>}
export default function ProductCard({p,rank,sm}){
  const {t,lang,add,setViewing}=useApp();
  return(<article onClick={()=>setViewing(p.id)} className="card relative flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl">
    {rank&&<span className="absolute end-2 top-2 z-10 rounded-full bg-brand px-2 py-0.5 text-xs font-bold text-white">🔥 #{rank}</span>}
    {p.old&&<span className="absolute start-2 top-2 z-10 rounded-full bg-gold px-2 py-0.5 text-xs font-extrabold text-ink">-{Math.round((1-p.price/p.old)*100)}%</span>}
    <div className={`grid place-items-center overflow-hidden bg-brand-soft ${sm?"aspect-square":"aspect-[4/3]"}`}><Pic p={p}/></div>
    <div className="flex flex-1 flex-col gap-1 p-3">
      <h3 className="line-clamp-2 min-h-[2.6rem] text-sm font-bold leading-snug">{p.name[lang]}</h3>
      <p className="text-xs text-ink/50">{p.weight}</p>
      <div className="mt-auto flex items-center justify-between pt-2">
        <span className="text-sm font-extrabold text-brand">{p.price.toFixed(2)} {t("cur")}{p.old&&<s className="block text-xs font-normal text-ink/40">{p.old.toFixed(2)}</s>}</span>
        <button onClick={e=>{e.stopPropagation();add(p.id)}} className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-soft text-xl font-bold text-brand transition hover:bg-brand hover:text-white active:scale-90" aria-label={t("add")}>+</button></div>
    </div></article>);
}
