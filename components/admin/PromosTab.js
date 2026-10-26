"use client";
import {useEffect,useState} from "react";
import {api} from "@/lib/api";
const blank={code:"",type:"percent",value:"",min:"",max:"",expires:"",limit:""};
const I="w-full rounded-xl border border-black/15 bg-white px-3 py-2.5 text-base";
export default function PromosTab(){
  const [list,setList]=useState(null);const [f,setF]=useState(blank);const [msg,setMsg]=useState("");
  useEffect(()=>{(async()=>{const r=await api("/api/promos",{admin:true});setList(r.ok?r.data.promos:[]);if(!r.ok)setMsg("⚠️ الكوبونات محتاجة تفعيل قاعدة البيانات (الخطوة 1 في الإعداد)")})()},[]);
  const set=k=>e=>setF({...f,[k]:e.target.value});
  const save=async next=>{setList(next);const r=await api("/api/promos",{method:"PUT",admin:true,body:{promos:next}});setMsg(r.ok?"✅ اتحفظ":"⚠️ ما اتحفظش، قاعدة البيانات مش مفعّلة");setTimeout(()=>setMsg(""),3000)};
  const add=()=>{
    const code=f.code.trim().toUpperCase().replace(/[^A-Z0-9_-]/g,"");const v=Number(f.value);
    if(!code)return setMsg("اكتب الكود (حروف إنجليزي وأرقام)");if(!(v>0))return setMsg("اكتب قيمة الخصم");
    if(f.type==="percent"&&v>100)return setMsg("النسبة لازم تكون 100 أو أقل");if((list||[]).some(p=>p.code===code))return setMsg("الكود ده موجود قبل كده");
    save([{code,type:f.type,value:v,min:Number(f.min)||0,max:f.max?Number(f.max):null,expires:f.expires||null,limit:f.limit?Number(f.limit):null,used:0,active:true},...(list||[])]);setF(blank);
  };
  if(!list)return <p className="p-8 text-center text-ink/60">...</p>;
  return(<div className="space-y-3">
    {msg&&<p className="rounded-xl bg-gold/20 p-3 text-sm font-bold">{msg}</p>}
    <div className="card space-y-3 p-4"><h2 className="font-extrabold">＋ كود خصم جديد</h2>
      <input className={I} dir="ltr" placeholder="الكود مثال: FRESH10" value={f.code} onChange={e=>setF({...f,code:e.target.value.toUpperCase()})}/>
      <div className="grid grid-cols-2 gap-3"><select className={I} value={f.type} onChange={set("type")}><option value="percent">نسبة %</option><option value="fixed">مبلغ ثابت (ج.م)</option></select>
        <input className={I} type="number" inputMode="decimal" placeholder={f.type==="percent"?"النسبة مثال: 10":"المبلغ مثال: 30"} value={f.value} onChange={set("value")}/></div>
      <div className="grid grid-cols-2 gap-3"><input className={I} type="number" inputMode="decimal" placeholder="أقل قيمة للطلب (اختياري)" value={f.min} onChange={set("min")}/>
        {f.type==="percent"?<input className={I} type="number" inputMode="decimal" placeholder="أقصى خصم بالجنيه (اختياري)" value={f.max} onChange={set("max")}/>:<span/>}</div>
      <div className="grid grid-cols-2 gap-3"><div><label className="mb-1 block text-xs font-bold">ينتهي في (اختياري)</label><input className={I} type="date" value={f.expires} onChange={set("expires")}/></div>
        <div><label className="mb-1 block text-xs font-bold">عدد مرات الاستخدام (اختياري)</label><input className={I} type="number" inputMode="numeric" placeholder="مثال: 50" value={f.limit} onChange={set("limit")}/></div></div>
      <button onClick={add} className="btn w-full py-3">إضافة الكود</button></div>
    {list.length===0&&<p className="card p-6 text-center text-sm text-ink/60">مفيش كوبونات لسه.</p>}
    {list.map(p=><div key={p.code} className={`card flex items-center gap-3 p-3 ${p.active?"":"opacity-60"}`}>
      <div className="min-w-0 flex-1"><div className="font-extrabold" dir="ltr">{p.code}</div>
        <div className="text-sm text-ink/70">{p.type==="percent"?`خصم ${p.value}%`:`خصم ${p.value} ج.م`}{p.min?` • أقل طلب ${p.min}`:""}{p.max?` • حد أقصى ${p.max}`:""}</div>
        <div className="text-xs text-ink/50">استُخدم {p.used||0}{p.limit?` من ${p.limit}`:""} مرة{p.expires?` • ينتهي ${p.expires}`:""}</div></div>
      <button onClick={()=>save(list.map(x=>x.code===p.code?{...x,active:!x.active}:x))} className={`rounded-lg px-3 py-2 text-sm font-bold ${p.active?"bg-green-100 text-green-800":"bg-paper ring-1 ring-black/10"}`}>{p.active?"شغّال":"موقوف"}</button>
      <button onClick={()=>{if(confirm("تحذف الكود ده؟"))save(list.filter(x=>x.code!==p.code))}} className="rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-700">حذف</button></div>)}
  </div>);
}
