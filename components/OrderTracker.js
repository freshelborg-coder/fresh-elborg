"use client";
import {STATUSES} from "@/lib/data";
import {useApp} from "@/lib/store";
const PTS=[[40,170],[120,110],[230,90],[320,40]];
export default function OrderTracker(){
  const {t,orders,myOrder}=useApp();
  const o=orders.find(x=>x.id===myOrder);
  if(!o)return <p className="card p-8 text-center text-ink/60">{t("noOrder")}</p>;
  const i=STATUSES.indexOf(o.status);const [x,y]=PTS[i];
  return(<div className="space-y-4"><h1 className="text-xl font-extrabold">#{o.id}</h1>
    <div className="card overflow-hidden"><svg viewBox="0 0 360 200" className="w-full bg-brand-soft" role="img" aria-label="map">
      <path d="M0 150 Q90 120 150 150 T360 100" stroke="#fff" strokeWidth="14" fill="none"/>
      <polyline points={PTS.map(p=>p.join(",")).join(" ")} fill="none" stroke="#B5472F" strokeWidth="3" strokeDasharray="6 6"/>
      <text x="30" y="190" fontSize="20">🏪</text><text x="310" y="35" fontSize="20">🏠</text>
      <circle cx={x} cy={y} r="14" fill="#B5472F"><animate attributeName="r" values="12;16;12" dur="1.5s" repeatCount="indefinite"/></circle>
      <text x={x-8} y={y+6} fontSize="16">🛵</text></svg></div>
    <div className="card p-4"><div className="h-2 overflow-hidden rounded-full bg-paper"><div className="h-full rounded-full bg-brand transition-all duration-700" style={{width:`${(i+1)/STATUSES.length*100}%`}}/></div>
      <ol className="mt-3 grid grid-cols-4 text-center text-xs font-bold">{STATUSES.map((s,n)=><li key={s} className={n<=i?"text-brand":"text-ink/40"}>{t(s)}</li>)}</ol></div>
  </div>);
}
