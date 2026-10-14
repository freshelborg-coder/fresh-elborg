"use client";
import {useApp} from "@/lib/store";
export default function PriceManager(){
  const {t,lang,products,setProduct}=useApp();
  return(<section className="card overflow-x-auto p-4"><h2 className="mb-3 font-extrabold">{t("prices")}</h2>
    <table className="w-full text-sm"><thead><tr className="text-ink/60"><th className="text-start">{t("product")}</th><th className="text-start">{t("price")}</th><th className="text-start">{t("img")}</th></tr></thead>
      <tbody>{products.map(p=><tr key={p.id} className="border-t"><td className="py-2">{p.e} {p.name[lang]} <span className="text-xs text-ink/50">({p.weight})</span></td>
        <td><input type="number" min="0" value={p.price} onChange={e=>setProduct(p.id,{price:Math.max(0,Number(e.target.value)||0)})} className="w-24 rounded-lg border px-2 py-1"/></td>
        <td><input value={p.img||""} onChange={e=>setProduct(p.id,{img:e.target.value})} className="w-44 rounded-lg border px-2 py-1 text-xs" dir="ltr"/></td></tr>)}</tbody></table></section>);
}
