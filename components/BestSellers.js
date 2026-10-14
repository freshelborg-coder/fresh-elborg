"use client";
import {useApp} from "@/lib/store";
import ProductCard from "./ProductCard";
export default function BestSellers(){
  const {t,products}=useApp();
  const top=[...products].sort((a,b)=>b.sold-a.sold).slice(0,6);
  return(<section><h2 className="mb-3 text-lg font-extrabold">🔥 {t("best")}</h2>
    <div className="no-scrollbar flex snap-x gap-3 overflow-x-auto pb-2">{top.map((p,i)=><div key={p.id} className="w-44 shrink-0 snap-start"><ProductCard p={p} rank={i+1}/></div>)}</div></section>);
}
