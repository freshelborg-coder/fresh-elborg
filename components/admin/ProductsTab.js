"use client";
import {useState} from "react";
import {useApp} from "@/lib/store";
import {api} from "@/lib/api";
import ProductForm,{CATN} from "./ProductForm";
function Thumb({p}){const [bad,setBad]=useState(false);
  return bad||!p.img?<span className="text-2xl">{p.e}</span>:<img src={p.img} alt="" loading="lazy" className="h-full w-full object-cover" onError={()=>setBad(true)}/>}
export default function ProductsTab(){
  const {products,setProducts}=useApp();
  const [q,setQ]=useState("");const [cat,setCat]=useState("all");const [edit,setEdit]=useState(undefined);const [draft,setDraft]=useState({});const [toast,setToast]=useState("");
  const flash=m=>{setToast(m);setTimeout(()=>setToast(""),3500)};
  const persist=async list=>{
    const r=await api("/api/products",{method:"PUT",admin:true,body:{products:list}});setProducts(list);
    flash(r.ok?"✅ اتحفظ وظهر في الموقع لكل العملاء":"⚠️ اتحفظ على جهازك بس، لأن قاعدة البيانات مش مفعّلة");return r.ok;
  };
  const saveOne=async p=>{const list=products.some(x=>x.id===p.id)?products.map(x=>x.id===p.id?p:x):[p,...products];await persist(list);setEdit(undefined)};
  const del=async p=>{if(!confirm("تحذف المنتج ده؟"))return;await persist(products.filter(x=>x.id!==p.id));setEdit(undefined)};
  const list=products.filter(p=>(cat==="all"||p.cat===cat)&&(!q.trim()||p.name.ar.includes(q.trim())));
  return(<div className="space-y-3">
    {toast&&<div className="fixed inset-x-4 top-4 z-[80] mx-auto max-w-sm rounded-2xl bg-ink px-4 py-3 text-center text-sm font-bold text-white shadow-xl">{toast}</div>}
    <button onClick={()=>setEdit(null)} className="btn w-full py-3 text-base">＋ إضافة منتج جديد</button>
    <input value={q} onChange={e=>setQ(e.target.value)} placeholder="🔍 دوّر على منتج" className="w-full rounded-xl border border-black/15 bg-white px-3 py-3"/>
    <div className="no-scrollbar flex gap-2 overflow-x-auto">{[["all","الكل"],...Object.entries(CATN)].map(([k,l])=><button key={k} onClick={()=>setCat(k)} className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-bold ${cat===k?"bg-brand text-white":"bg-white ring-1 ring-black/10"}`}>{l}</button>)}</div>
    <p className="text-xs text-ink/50">{list.length} منتج. اضغط على الصورة أو الاسم للتعديل، أو غيّر السعر مباشرة واضغط حفظ.</p>
    {list.map(p=>{const dv=draft[p.id];const changed=dv!==undefined&&Number(dv)!==p.price&&Number(dv)>0;
      return(<div key={p.id} className="card flex items-center gap-3 p-2.5">
        <button onClick={()=>setEdit(p)} className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-xl bg-brand-soft"><Thumb p={p}/></button>
        <button onClick={()=>setEdit(p)} className="min-w-0 flex-1 text-start"><div className="line-clamp-2 text-sm font-bold">{p.name.ar}</div><div className="text-xs text-ink/50">{p.weight}</div>
          {p.old&&<div className="text-xs font-bold text-red-600">🏷️ خصم {Math.round((1-p.price/p.old)*100)}% (كان {p.old})</div>}</button>
        <div className="flex shrink-0 flex-col items-end gap-1"><input type="number" inputMode="decimal" value={dv??p.price} onChange={e=>setDraft({...draft,[p.id]:e.target.value})} className="w-24 rounded-lg border border-black/15 px-2 py-1.5 text-end font-bold"/>
          {changed&&<button onClick={async()=>{await saveOne({...p,price:Number(dv)});setDraft(d=>{const n={...d};delete n[p.id];return n})}} className="btn px-3 py-1 text-xs">حفظ ✓</button>}</div>
      </div>)})}
    {edit!==undefined&&<ProductForm p={edit} onSave={saveOne} onDelete={del} onClose={()=>setEdit(undefined)}/>}
  </div>);
}
