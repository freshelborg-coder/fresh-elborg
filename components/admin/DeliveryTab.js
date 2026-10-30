"use client";
import {useEffect,useState} from "react";
import dynamic from "next/dynamic";
import {api} from "@/lib/api";
import {DELIVERY} from "@/lib/config";
import {cleanDelivery} from "@/lib/delivery";
import {useApp} from "@/lib/store";
const MapPicker=dynamic(()=>import("../MapPicker"),{ssr:false});
const I="w-full rounded-xl border border-black/15 bg-white px-3 py-2.5 text-base";
export default function DeliveryTab(){
  const {setDelivery}=useApp();
  const [cfg,setCfg]=useState(null);const [map,setMap]=useState(false);const [msg,setMsg]=useState("");
  useEffect(()=>{(async()=>{const r=await api("/api/settings");setCfg(r.ok&&r.data?.delivery?r.data.delivery:DELIVERY)})()},[]);
  if(!cfg)return <p className="p-8 text-center text-ink/60">...</p>;
  const tier=(i,k,v)=>setCfg({...cfg,tiers:cfg.tiers.map((t,n)=>n===i?{...t,[k]:v}:t)});
  const save=async()=>{
    const tiers=cfg.tiers.map(t=>({upTo:Number(t.upTo),fee:Number(t.fee)})).filter(t=>t.upTo>0&&t.fee>=0);
    if(!tiers.length)return setMsg("ضيف شريحة واحدة على الأقل");
    const r=await api("/api/settings",{method:"PUT",admin:true,body:{delivery:{...cfg,tiers,freeOver:Number(cfg.freeOver)||0}}});
    if(r.ok){setCfg(r.data.delivery);setDelivery(cleanDelivery(r.data.delivery));setMsg("✅ اتحفظ وبقى شغال لكل العملاء")}
    else setMsg(r.status===503||r.status===404||r.status===0?"⚠️ ما اتحفظش: قاعدة البيانات مش مفعّلة":"⚠️ ما اتحفظش، جرّب تاني");
  };
  const s=cfg.store;
  return(<div className="space-y-3">
    {msg&&<p className="rounded-xl bg-gold/20 p-3 text-sm font-bold">{msg}</p>}
    <div className="card space-y-2 p-4"><h2 className="font-extrabold">📍 مكان المحل (نقطة البداية)</h2>
      <p className="text-sm text-ink/70">المسافة بتتحسب من هنا لحد العميل. لو شغال من البيت، حدد مكان بيتك.</p>
      <p className="text-xs text-ink/50" dir="ltr">{s.lat.toFixed(5)}, {s.lng.toFixed(5)} <a className="mr-2 underline" href={`https://www.google.com/maps?q=${s.lat},${s.lng}`} target="_blank" rel="noopener noreferrer">Google Maps</a></p>
      <button onClick={()=>setMap(true)} className="btn w-full py-3">🗺️ حدد مكاني على الخريطة</button></div>
    <div className="card space-y-3 p-4"><h2 className="font-extrabold">🛵 تكلفة التوصيل حسب المسافة</h2>
      <p className="text-sm text-ink/70">مثال: لحد 3 كم = 20 جنيه. أبعد من آخر شريحة العميل مش هيقدر يطلب.</p>
      {cfg.tiers.map((t,i)=><div key={i} className="flex items-center gap-2"><span className="text-sm">لحد</span>
        <input className={I} type="number" inputMode="decimal" value={t.upTo} onChange={e=>tier(i,"upTo",e.target.value)}/><span className="text-sm">كم =</span>
        <input className={I} type="number" inputMode="decimal" value={t.fee} onChange={e=>tier(i,"fee",e.target.value)}/><span className="text-sm">جنيه</span>
        <button onClick={()=>setCfg({...cfg,tiers:cfg.tiers.filter((_,n)=>n!==i)})} className="rounded-lg bg-red-50 px-3 py-2 font-bold text-red-700" aria-label="حذف">×</button></div>)}
      <button onClick={()=>setCfg({...cfg,tiers:[...cfg.tiers,{upTo:"",fee:""}]})} className="w-full rounded-xl border-2 border-dashed border-brand/40 py-2 font-bold text-brand">＋ إضافة شريحة</button></div>
    <div className="card space-y-2 p-4"><h2 className="font-extrabold">🎁 توصيل مجاني</h2>
      <p className="text-sm text-ink/70">التوصيل يبقى مجاني لو الطلب (بعد الخصم) وصل للمبلغ ده. اكتب 0 لو مش عايز.</p>
      <input className={I} type="number" inputMode="decimal" value={cfg.freeOver} onChange={e=>setCfg({...cfg,freeOver:e.target.value})}/></div>
    <div className="card space-y-2 p-4"><h2 className="font-extrabold">⚙️ تقدير مسافة الطريق</h2>
      <p className="text-sm text-ink/70">المسافة بتتحسب خط مستقيم × الرقم ده كتقدير للطريق الحقيقي. لو المسافات طالعة أقل من الحقيقة زوّده (مثلاً 1.4).</p>
      <input className={I} type="number" step="0.1" inputMode="decimal" value={cfg.roadFactor} onChange={e=>setCfg({...cfg,roadFactor:e.target.value})}/></div>
    <button onClick={save} className="btn w-full py-3 text-base">حفظ ✓</button>
    {map&&<MapPicker lang="ar" mode="store" cfg={cfg} initial={cfg.store} onClose={()=>setMap(false)} onConfirm={p=>{setCfg({...cfg,store:p});setMap(false);setMsg("اضغط «حفظ» تحت علشان مكان المحل الجديد يشتغل")}}/>}
  </div>);
}
