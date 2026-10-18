"use client";
import {useEffect,useState} from "react";
import {useApp} from "@/lib/store";
// Phones get the tall banners public/banners/banner-N-m.jpg (about 3:1); wider screens get banner-N.jpg (wide strips).
// d / m = width/height of the wide / phone version, so nothing is cropped.
// Slide 1 on phones is built live from banner-1-photo.jpg + text (meat & chicken), so the text stays sharp.
// If a file is missing, a colour slide is shown instead.
const S=[
  {k:"s1",e:"🍗",c:"from-ink to-stone-600",img:"/banners/banner-1.jpg",comp:true,d:1600/258,m:3},
  {k:"s2",e:"🧀",c:"from-brand to-brand-dark",img:"/banners/banner-2.jpg",imgM:"/banners/banner-2-m.jpg",d:1600/196,m:1600/483},
  {k:"s3",e:"🛵",c:"from-brand-dark to-stone-500",img:"/banners/banner-3.jpg",imgM:"/banners/banner-3-m.jpg",d:1600/206,m:1600/483}];
const TX={ar:{h:"لحوم طازجة",p:"ودجاج كرسبي بجودة عالية",b:"تسوق الآن"},en:{h:"Fresh meat",p:"Crispy chicken, top quality",b:"Shop now"}};
export default function HeroSlider(){
  const {t,lang,setCat}=useApp();const [i,setI]=useState(0);const [bad,setBad]=useState({});
  useEffect(()=>{const id=setInterval(()=>setI(x=>(x+1)%S.length),4500);return()=>clearInterval(id)},[]);
  const cur=S[i];const x1=TX[lang]||TX.ar;
  const shop=()=>{setCat("meats");setTimeout(()=>document.getElementById("store")?.scrollIntoView({behavior:"smooth"}),60)};
  return(<section style={{"--rd":cur.d,"--rm":cur.m}} className="relative overflow-hidden rounded-2xl bg-brand-soft [aspect-ratio:var(--rd)] transition-[aspect-ratio] duration-500 max-md:[aspect-ratio:var(--rm)]">
    {S.map((x,n)=><div key={n} aria-hidden={n!==i} className={`absolute inset-0 transition-opacity duration-700 ${n===i?"opacity-100":"opacity-0"}`}>
      {bad[n]
        ?<div className={`flex h-full items-center justify-between bg-gradient-to-br p-6 text-white ${x.c}`}><h2 className="max-w-[60%] text-xl font-extrabold sm:text-4xl">{t(x.k)}</h2><span className="text-6xl sm:text-8xl">{x.e}</span></div>
        :x.comp
          ?<>
            <img src={x.img} alt="" decoding="async" fetchPriority="high" className="hidden h-full w-full object-cover md:block" onError={()=>setBad(b=>({...b,[n]:true}))}/>
            <div dir="ltr" className="flex h-full md:hidden">
              <div dir={lang==="ar"?"rtl":"ltr"} className="relative z-10 flex w-[44%] shrink-0 flex-col items-start justify-center gap-1.5 bg-gradient-to-br from-brand-dark to-brand px-4 text-white">
                <h2 className="text-xl font-extrabold leading-tight">{x1.h}</h2>
                <p className="text-xs leading-snug text-white/90">{x1.p}</p>
                <button onClick={shop} className="mt-1 rounded-full bg-[#3A2A22] px-3 py-1 text-xs font-bold">🛒 {x1.b}</button>
              </div>
              <div className="relative flex-1">
                <img src="/banners/banner-1-photo.jpg" alt="" decoding="async" className="h-full w-full object-cover" style={{objectPosition:"78% 50%"}}/>
                <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-brand to-transparent"/>
                <div className="absolute right-2 top-2 rounded-xl bg-[#f7eedc] px-2 py-1 shadow"><img src="/banners/brand-logo.png" alt="فريش البرج" className="h-7 w-auto"/></div>
              </div>
            </div>
          </>
          :<picture><source media="(max-width: 767px)" srcSet={x.imgM}/><img src={x.img} alt="" decoding="async" className="h-full w-full object-cover" onError={()=>setBad(b=>({...b,[n]:true}))}/></picture>}
    </div>)}
    <button onClick={()=>setI((i+S.length-1)%S.length)} className="absolute start-2 top-1/2 z-20 h-8 w-8 -translate-y-1/2 rounded-full bg-black/30 text-white" aria-label="prev">‹</button>
    <button onClick={()=>setI((i+1)%S.length)} className="absolute end-2 top-1/2 z-20 h-8 w-8 -translate-y-1/2 rounded-full bg-black/30 text-white" aria-label="next">›</button>
    <div className="absolute inset-x-0 bottom-1.5 z-20 flex justify-center gap-1.5">{S.map((_,n)=><button key={n} onClick={()=>setI(n)} aria-label={`slide ${n+1}`} className={`h-1.5 rounded-full transition-all ${n===i?"w-5 bg-white":"w-1.5 bg-white/60"}`}/>)}</div>
  </section>);
}
