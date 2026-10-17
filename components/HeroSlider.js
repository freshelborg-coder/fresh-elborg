"use client";
import {useEffect,useState} from "react";
import {useApp} from "@/lib/store";
// Phones get the tall banners  public/banners/banner-N-m.jpg  (about 3:1, like the reference app).
// Wider screens get                public/banners/banner-N.jpg    (very wide strips).
// d / m = width/height of the wide / phone file, so nothing is cropped.
// If a file is missing, a colour slide is shown instead.
const S=[
  {k:"s1",e:"🧀",c:"from-brand to-sky-500",img:"/banners/banner-1.jpg",imgM:"/banners/banner-1-m.jpg",d:1600/258,m:1600/556},
  {k:"s2",e:"🍗",c:"from-ink to-slate-600",img:"/banners/banner-2.jpg",imgM:"/banners/banner-2-m.jpg",d:1600/196,m:1600/483},
  {k:"s3",e:"🛵",c:"from-teal-700 to-cyan-500",img:"/banners/banner-3.jpg",imgM:"/banners/banner-3-m.jpg",d:1600/206,m:1600/483}];
export default function HeroSlider(){
  const {t}=useApp();const [i,setI]=useState(0);const [bad,setBad]=useState({});
  useEffect(()=>{const id=setInterval(()=>setI(x=>(x+1)%S.length),4500);return()=>clearInterval(id)},[]);
  const cur=S[i];
  return(<section style={{"--rd":cur.d,"--rm":cur.m}} className="relative overflow-hidden rounded-2xl bg-brand-soft [aspect-ratio:var(--rd)] transition-[aspect-ratio] duration-500 max-md:[aspect-ratio:var(--rm)]">
    {S.map((x,n)=><div key={n} aria-hidden={n!==i} className={`absolute inset-0 transition-opacity duration-700 ${n===i?"opacity-100":"opacity-0"}`}>
      {bad[n]
        ?<div className={`flex h-full items-center justify-between bg-gradient-to-br p-6 text-white ${x.c}`}><h2 className="max-w-[60%] text-xl font-extrabold sm:text-4xl">{t(x.k)}</h2><span className="text-6xl sm:text-8xl">{x.e}</span></div>
        :<picture><source media="(max-width: 767px)" srcSet={x.imgM}/><img src={x.img} alt="" decoding="async" fetchPriority={n===0?"high":"auto"} className="h-full w-full object-cover" onError={()=>setBad(b=>({...b,[n]:true}))}/></picture>}
    </div>)}
    <button onClick={()=>setI((i+S.length-1)%S.length)} className="absolute start-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-black/30 text-white" aria-label="prev">‹</button>
    <button onClick={()=>setI((i+1)%S.length)} className="absolute end-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-black/30 text-white" aria-label="next">›</button>
    <div className="absolute inset-x-0 bottom-1.5 flex justify-center gap-1.5">{S.map((_,n)=><button key={n} onClick={()=>setI(n)} aria-label={`slide ${n+1}`} className={`h-1.5 rounded-full transition-all ${n===i?"w-5 bg-white":"w-1.5 bg-white/60"}`}/>)}</div>
  </section>);
}
