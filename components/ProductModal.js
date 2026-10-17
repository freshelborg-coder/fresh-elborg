"use client";
import {useEffect,useState} from "react";
import {useApp} from "@/lib/store";
const TX={ar:{size:"الحجم",required:"مطلوب",add:"أضف",best:"الأكثر مبيعاً",cur:"ج.م"},en:{size:"Size",required:"Required",add:"Add",best:"Best seller",cur:"EGP"}};
// The window uses the large photo (public/products/lg/<id>.jpg); falls back to the normal photo, then the emoji.
const lg=s=>s&&s.startsWith("/products/")?s.replace("/products/","/products/lg/"):s;
function Big({p}){
  const [step,setStep]=useState(0);
  useEffect(()=>{setStep(0)},[p.id]);
  const src=step===0?lg(p.img):step===1?p.img:null;
  return !src?<span className="text-8xl">{p.e}</span>:<img key={src} src={src} alt={p.name.ar} decoding="async" onError={()=>setStep(s=>s+1)} className="h-full w-full object-contain"/>;
}
export default function ProductModal(){
  const {lang,products,viewing,setViewing,addN}=useApp();
  const [sel,setSel]=useState(null);const [qty,setQty]=useState(1);
  useEffect(()=>{setSel(viewing);setQty(1)},[viewing]);
  useEffect(()=>{
    if(!viewing)return;
    const k=e=>{if(e.key==="Escape")setViewing(null)};
    document.addEventListener("keydown",k);document.body.style.overflow="hidden";
    return()=>{document.removeEventListener("keydown",k);document.body.style.overflow=""};
  },[viewing,setViewing]);
  const base=products.find(x=>x.id===viewing);
  if(!base)return null;
  const x=TX[lang]||TX.ar;
  const p=products.find(v=>v.id===sel)||base;
  const sizes=products.filter(v=>v.name.ar===base.name.ar);
  const best=[...products].sort((a,b)=>b.sold-a.sold).slice(0,6).some(v=>v.id===p.id&&v.sold>0);
  const close=()=>setViewing(null);
  return(<div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 sm:items-center sm:p-4" onClick={close} role="dialog" aria-modal="true">
    <div onClick={e=>e.stopPropagation()} className="relative flex max-h-[94vh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl bg-white sm:rounded-3xl">
      <button onClick={close} aria-label="close" className="absolute start-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-ink/80 text-xl text-white">×</button>
      <div className="overflow-y-auto">
        <div className="grid aspect-[4/3] w-full place-items-center bg-brand-soft"><Big p={p}/></div>
        <div className="space-y-4 p-5">
          {best&&<span className="inline-flex items-center gap-1 rounded-full border border-brand/30 bg-brand-soft px-3 py-1 text-xs font-bold text-brand">🏆 {x.best}</span>}
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-xl font-extrabold leading-snug">{p.name[lang]}</h2>
            <div className="shrink-0 text-lg font-extrabold text-brand">{p.price.toFixed(2)} {x.cur}{p.old&&<s className="block text-sm font-normal text-ink/40">{p.old.toFixed(2)}</s>}</div>
          </div>
          <div className="flex items-center justify-between border-t pt-4"><span className="font-bold">📐 {x.size}</span><span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-bold text-red-600">{x.required}</span></div>
          <div className="grid grid-cols-2 gap-3">{sizes.map(v=><button key={v.id} onClick={()=>setSel(v.id)} className={`rounded-2xl border-2 p-3 text-center transition ${v.id===p.id?"border-brand bg-brand-soft":"border-black/10 hover:border-brand/40"}`}>
            <div className="text-sm font-bold">{v.weight}</div><div className="mt-1 text-sm text-ink/60">{v.price.toFixed(2)} {x.cur}</div></button>)}</div>
        </div>
      </div>
      <div className="flex items-center gap-3 border-t bg-white p-4">
        <button onClick={()=>{addN(p.id,qty);close()}} className="btn flex flex-1 items-center justify-center gap-2 rounded-2xl py-3 text-base">🛒 {x.add} • {(p.price*qty).toFixed(2)} {x.cur}</button>
        <div className="flex items-center rounded-2xl bg-paper p-1">
          <button onClick={()=>setQty(q=>Math.max(1,q-1))} className="h-10 w-10 text-xl font-bold" aria-label="-">−</button>
          <span className="w-8 text-center font-bold">{qty}</span>
          <button onClick={()=>setQty(q=>q+1)} className="h-10 w-10 text-xl font-bold" aria-label="+">+</button>
        </div>
      </div>
    </div></div>);
}
