"use client";
import {CATS} from "@/lib/data";
import {useApp} from "@/lib/store";
import Categories from "./Categories";
import ProductCard from "./ProductCard";
const GRID="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4";
export default function ProductGrid(){
  const {t,products,cat,setCat}=useApp();
  const order=[...CATS].sort((a,b)=>(b.id==="offers")-(a.id==="offers"));
  return(<section id="store" className="scroll-mt-32 space-y-4"><h2 className="text-lg font-extrabold">{t("cats")}</h2>
    <Categories active={cat} onPick={setCat}/>
    {cat==="all"?order.map(c=>{const l=products.filter(p=>p.cat===c.id);return(
      <div key={c.id} className="space-y-3">
        <div className="flex items-center justify-between"><h3 className="border-s-4 border-brand ps-2 text-lg font-extrabold">{t(c.id)} <span className="text-sm font-normal text-ink/50">({l.length})</span></h3>
          {l.length>4&&<button onClick={()=>setCat(c.id)} className="text-sm font-bold text-brand">{t("viewAll")}</button>}</div>
        <div className={GRID}>{l.slice(0,4).map(p=><ProductCard key={p.id} p={p}/>)}</div></div>)})
    :<div className={GRID}>{products.filter(p=>p.cat===cat).map(p=><ProductCard key={p.id} p={p}/>)}</div>}
  </section>);
}
