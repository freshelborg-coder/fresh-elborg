"use client";
const day=t=>{const d=new Date(t);return new Date(d.getFullYear(),d.getMonth(),d.getDate()).getTime()};
export default function StatsTab({orders}){
  if(!orders)return <p className="p-8 text-center text-ink/60">...</p>;
  const today=day(Date.now());const D=86400000;
  const sum=l=>l.reduce((s,o)=>s+o.total,0);
  const tdy=orders.filter(o=>day(o.at)===today);
  const days=[...Array(7)].map((_,i)=>{const d=today-(6-i)*D;return{d,v:sum(orders.filter(o=>day(o.at)===d))}});
  const mx=Math.max(1,...days.map(x=>x.v));
  const card=(l,v)=><div className="card p-4"><div className="text-sm text-ink/60">{l}</div><div className="text-2xl font-extrabold text-brand">{v}</div></div>;
  return(<div className="space-y-3"><div className="grid grid-cols-2 gap-3">
    {card("مبيعات اليوم",`${sum(tdy)} ج.م`)}{card("طلبات اليوم",tdy.length)}
    {card("طلبات جديدة",orders.filter(o=>o.status==="new").length)}{card("تم تسليمها",orders.filter(o=>o.status==="delivered").length)}</div>
    <div className="card p-4"><div className="mb-2 text-sm font-bold">آخر 7 أيام</div>
      <div className="flex h-36 items-end gap-2">{days.map(x=><div key={x.d} className="flex flex-1 flex-col items-center gap-1"><div className="w-full rounded-t-lg bg-brand/80" style={{height:`${x.v/mx*100}%`,minHeight:2}} title={String(x.v)}/>
        <span className="text-[10px] text-ink/60">{new Date(x.d).toLocaleDateString("ar-EG",{weekday:"short"})}</span></div>)}</div></div>
    <p className="text-center text-xs text-ink/50">الأرقام محسوبة من آخر 150 طلب.</p></div>);
}
