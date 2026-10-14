"use client";
import {CATS} from "@/lib/data";
import {useApp} from "@/lib/store";
export default function Categories({active,onPick}){
  const {t}=useApp();
  return(<div className="no-scrollbar flex gap-2 overflow-x-auto py-1">
    {[{id:"all",e:"🛍️"},...CATS].map(c=><button key={c.id} onClick={()=>onPick(c.id)} className={`flex shrink-0 items-center gap-2 rounded-full py-1.5 ps-1.5 pe-4 text-sm font-bold ring-1 transition ${active===c.id?"bg-brand text-white ring-brand":"bg-white ring-black/10 hover:bg-brand-soft"}`}>
      <span className={`grid h-8 w-8 place-items-center rounded-full ${active===c.id?"bg-white/20":"bg-brand-soft"}`}>{c.e}</span>{t(c.id)}</button>)}
  </div>);
}
