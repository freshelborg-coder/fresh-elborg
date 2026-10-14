"use client";
import {useMemo,useState} from "react";
import {useApp} from "@/lib/store";
export default function SearchBar(){
  const {t,lang,products,add}=useApp();
  const [q,setQ]=useState("");
  const hits=useMemo(()=>q.trim()?products.filter(p=>p.name[lang].toLowerCase().includes(q.trim().toLowerCase())).slice(0,5):[],[q,products,lang]);
  return(<div className="relative">
    <input value={q} onChange={e=>setQ(e.target.value)} placeholder={t("search")} className="w-full rounded-xl bg-paper px-4 py-2.5 outline-none ring-brand focus:ring-2"/>
    {hits.length>0&&<ul className="card absolute z-40 mt-1 w-full overflow-hidden">
      {hits.map(p=><li key={p.id}><button onClick={()=>{add(p.id);setQ("")}} className="flex w-full items-center justify-between px-4 py-2 text-start hover:bg-brand-soft">
        <span>{p.e} {p.name[lang]}</span><span className="font-bold text-brand">{p.price} {t("cur")}</span></button></li>)}
    </ul>}
  </div>);
}
