"use client";
import {useEffect,useState} from "react";
import {useApp} from "@/lib/store";
// Banner files live in public/banners/ : banner-1.jpg, banner-2.jpg, banner-3.jpg (best size 1600x500).
// If a file is missing, a colour slide is shown instead.
const S=[
  {k:"s1",e:"🧀",c:"from-brand to-sky-500",img:"/banners/banner-1.jpg"},
  {k:"s2",e:"🍗",c:"from-ink to-slate-600",img:"/banners/banner-2.jpg"},
  {k:"s3",e:"🛵",c:"from-teal-700 to-cyan-500",img:"/banners/banner-3.jpg"}];
export default function HeroSlider(){
  const {t}=useApp();const [i,setI]=useState(0);const [bad,setBad]=useState({});
  useEffect(()=>{const id=setInterval(()=>setI(x=>(x+1)%S.length),4500);return()=>clearInterval(id)},[]);
  return(<section className="relative aspect-[16/5] overflow-hidden rounded-2xl bg-brand-soft">
    {S.map((x,n)=><div key={n} aria-hidden={n!==i} className={`absolute inset-0 transition-opacity duration-700 ${n===i?"opacity-100":"opacity-0"}`}>
      {bad[n]
        ?<div className={`flex h-full items-center justify-between bg-gradient-to-br p-6 text-white ${x.c}`}><h2 className="max-w-[60%] text-xl font-extrabold sm:text-4xl">{t(x.k)}</h2><span className="text-6xl sm:text-8xl">{x.e}</span></div>
        :<img src={x.img} alt="" decoding="async" fetchPriority={n===0?"high":"auto"} className="h-full w-full object-cover" onError={()=>setBad(b=>({...b,[n]:true}))}/>}
    </div>)}
    <button onClick={()=>setI((i+S.length-1)%S.length)} className="absolute start-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-black/30 text-white" aria-label="prev">‹</button>
    <button onClick={()=>setI((i+1)%S.length)} className="absolute end-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-black/30 text-white" aria-label="next">›</button>
    <div className="absolute inset-x-0 bottom-2 flex justify-center gap-1.5">{S.map((_,n)=><button key={n} onClick={()=>setI(n)} aria-label={`slide ${n+1}`} className={`h-2 rounded-full transition-all ${n===i?"w-6 bg-white":"w-2 bg-white/60"}`}/>)}</div>
  </section>);
}
