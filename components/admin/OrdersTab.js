"use client";
import {DRIVERS,STATUSES} from "@/lib/data";
const SL={new:"جديد",preparing:"قيد التحضير",onway:"في الطريق",delivered:"تم التسليم"};
const SC={new:"border-red-400 bg-red-50",preparing:"border-amber-300 bg-amber-50",onway:"border-sky-300 bg-sky-50",delivered:"border-green-300 bg-green-50"};
const PM={cod:"💵 الدفع عند الاستلام",wallet:"📱 محفظة / انستا باي"};
const PS={cod:"عند الاستلام",pending:"بانتظار التحقق",paid:"تم الدفع"};
const intl=ph=>{const d=String(ph||"").replace(/\D/g,"");return d.startsWith("20")?d:d.replace(/^0/,"20")};
export default function OrdersTab({orders,err,reload,patch}){
  if(err==="server")return <p className="card p-6 text-center text-sm text-ink/70">الطلبات بتظهر هنا بعد ما تفعّل قاعدة البيانات (الخطوة 1 في الإعداد).</p>;
  if(err==="auth")return <p className="card p-6 text-center text-sm text-red-600">كلمة السر غلط. اخرج وادخل تاني.</p>;
  if(!orders)return <p className="p-8 text-center text-ink/60">...</p>;
  return(<div className="space-y-3">
    <div className="flex items-center justify-between text-sm text-ink/60"><span>{orders.length} طلب (الأحدث فوق)</span><button onClick={reload} className="rounded-lg bg-white px-3 py-1.5 font-bold ring-1 ring-black/10">🔄 تحديث</button></div>
    {orders.length===0&&<p className="card p-8 text-center text-ink/60">مفيش طلبات لسه.</p>}
    {orders.map(o=>{const st=STATUSES.indexOf(o.status);
      const say=`${"السلام عليكم "+(o.customer?.name||"")}، طلبك رقم ${o.id} حالته: ${SL[o.status]}`;
      return(<article key={o.id} className={`rounded-2xl border-2 p-3 ${SC[o.status]||""}`}>
        <div className="flex items-center justify-between"><b>#{o.id}</b><span className="text-xs text-ink/60">{new Date(o.at).toLocaleString("ar-EG",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}</span></div>
        <div className="mt-1 text-lg font-extrabold text-brand">{o.total} ج.م</div>
        {o.delivery?.label&&<div className="mt-1 text-sm font-bold">🕒 {o.delivery.label}</div>}
        {o.discount>0&&<div className="text-sm text-green-700">🏷️ كود {o.promo}: خصم {o.discount} ج.م</div>}
        <div className="mt-2 text-sm"><div className="font-bold">👤 {o.customer?.name}</div><div>📍 {o.customer?.address}</div>
          <div className="mt-1 flex flex-wrap gap-2"><a href={`tel:${o.customer?.phone}`} className="rounded-lg bg-white px-3 py-1.5 font-bold ring-1 ring-black/10">📞 {o.customer?.phone}</a>
            <a href={`https://wa.me/${intl(o.customer?.phone)}?text=${encodeURIComponent(say)}`} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-[#25D366] px-3 py-1.5 font-bold text-white">واتساب للعميل</a></div></div>
        <ul className="mt-2 space-y-0.5 rounded-xl bg-white/70 p-2 text-sm">{(o.items||[]).map((i,n)=><li key={n}>{i.qty} × {i.name||i.id}{i.weight?` (${i.weight})`:""}</li>)}</ul>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm"><span>{PM[o.pay?.method]}</span>{o.pay?.ref&&<code className="rounded bg-white px-2 py-0.5">{o.pay.ref}</code>}
          <select value={o.pay?.status} onChange={e=>patch(o,{payStatus:e.target.value})} className="rounded-lg border bg-white px-2 py-1">{Object.entries(PS).map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></div>
        <div className="mt-3 grid grid-cols-4 gap-1">{STATUSES.map((s,n)=><button key={s} onClick={()=>patch(o,{status:s})} className={`rounded-lg px-1 py-2 text-xs font-bold ${n===st?"bg-brand text-white":"bg-white ring-1 ring-black/10"}`}>{SL[s]}</button>)}</div>
        <div className="mt-2 flex items-center gap-2 text-sm"><span>🛵 المندوب:</span>
          <select value={o.driver||""} onChange={e=>patch(o,{driver:e.target.value})} className="flex-1 rounded-lg border bg-white px-2 py-1.5"><option value="">بدون</option>{DRIVERS.map(d=><option key={d}>{d}</option>)}</select></div>
      </article>)})}
  </div>);
}
