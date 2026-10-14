"use client";
import {useEffect,useState} from "react";
import {useApp} from "@/lib/store";
const S=[{k:"s1",e:"🧀",c:"from-brand to-sky-500"},{k:"s2",e:"🍗",c:"from-ink to-slate-600"},{k:"s3",e:"🛵",c:"from-teal-700 to-cyan-500"}];
export default function HeroSlider(){
  const {t}=useApp();const [i,setI]=useState(0);
  useEffect(()=>{const id=setInterval(()=>setI(x=>(x+1)%S.length),4000);return()=>clearInterval(id)},[]);
  const s=S[i];
  return(<section className={`relative flex h-44 items-center justify-between overflow-hidden rounded-2xl bg-gradient-to-br p-6 text-white transition-all sm:h-56 ${s.c}`}>
    <h2 className="max-w-[60%] text-2xl font-extrabold sm:text-4xl">{t(s.k)}</h2><span className="text-7xl sm:text-8xl">{s.e}</span>
    <button onClick={()=>setI((i+S.length-1)%S.length)} className="absolute start-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-black/30" aria-label="prev">‹</button>
    <button onClick={()=>setI((i+1)%S.length)} className="absolute end-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-black/30" aria-label="next">›</button>
    <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">{S.map((_,n)=><button key={n} onClick={()=>setI(n)} aria-label={`slide ${n+1}`} className={`h-2 rounded-full transition-all ${n===i?"w-6 bg-white":"w-2 bg-white/50"}`}/>)}</div>
  </section>);
}
