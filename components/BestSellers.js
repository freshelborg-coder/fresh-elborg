"use client";
import {useApp} from "@/lib/store";
import ProductCard from "./ProductCard";
export default function BestSellers(){
  const {t,products}=useApp();
  const top=[...products].sort((a,b)=>b.sold-a.sold).slice(0,8);
  const half=<div className="flex shrink-0 gap-3 pe-3">{top.map((p,i)=><div key={p.id} className="w-40 shrink-0"><ProductCard p={p} rank={i+1} sm/></div>)}</div>;
  return(<section><h2 className="mb-3 border-s-4 border-brand ps-2 text-lg font-extrabold">🔥 {t("best")}</h2>
    <div className="mq"><div className="mq-track" style={{"--d":"50s"}}>{half}{half}</div></div></section>);
}
