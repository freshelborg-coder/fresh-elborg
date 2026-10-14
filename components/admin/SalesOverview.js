"use client";
import {WEEK} from "@/lib/data";
import {useApp} from "@/lib/store";
export default function SalesOverview(){
  const {t,orders}=useApp();
  const today=orders.reduce((s,o)=>s+o.total,0);const data=[...WEEK,today];const max=Math.max(...data);
  return(<section className="space-y-3"><div className="grid grid-cols-2 gap-3">
    <div className="card p-4"><div className="text-sm text-ink/60">{t("today")}</div><div className="text-2xl font-extrabold text-brand">{today} {t("cur")}</div></div>
    <div className="card p-4"><div className="text-sm text-ink/60">{t("newOrders")}</div><div className="text-2xl font-extrabold">{orders.filter(o=>o.status==="new").length}</div></div></div>
    <div className="card flex h-40 items-end gap-2 p-4">{data.map((v,i)=><div key={i} className="flex-1 rounded-t-lg bg-brand/80" style={{height:`${v/max*100}%`}} title={String(v)}/>)}</div></section>);
}
