"use client";
import {useApp} from "@/lib/store";
import Categories from "./Categories";
import ProductCard from "./ProductCard";
export default function ProductGrid(){
  const {t,products,cat,setCat}=useApp();
  const list=products.filter(p=>cat==="all"||p.cat===cat);
  return(<section id="store" className="scroll-mt-32 space-y-3"><h2 className="text-lg font-extrabold">{t("cats")}</h2>
    <Categories active={cat} onPick={setCat}/>
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">{list.map(p=><ProductCard key={p.id} p={p}/>)}</div></section>);
}
