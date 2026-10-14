"use client";
import {STATUSES,DRIVERS} from "@/lib/data";
import {useApp} from "@/lib/store";
const PS={cod:"codS",pending:"payPending",paid:"paid"};
export default function OrderManager(){
  const {t,orders,updateOrder}=useApp();
  return(<section className="card space-y-3 p-4"><h2 className="font-extrabold">{t("orders")}</h2>
    {orders.map(o=><div key={o.id} className="space-y-2 border-t pt-3 text-sm">
      <div className="flex flex-wrap items-center gap-2"><b>#{o.id}</b><span className="text-brand">{o.total} {t("cur")}</span>
        <select value={o.status} onChange={e=>updateOrder(o.id,{status:e.target.value})} className="ms-auto rounded-lg border px-2 py-1">{STATUSES.map(s=><option key={s} value={s}>{t(s)}</option>)}</select>
        <select value={o.driver} onChange={e=>updateOrder(o.id,{driver:e.target.value})} className="rounded-lg border px-2 py-1"><option value="">{t("driver")}: {t("none")}</option>{DRIVERS.map(d=><option key={d}>{d}</option>)}</select></div>
      {o.customer&&<div className="text-xs text-ink/70">{o.customer.name} · {o.customer.phone} · {o.customer.address}</div>}
      {o.pay&&<div className="flex items-center gap-2 text-xs">{t(o.pay.method)}{o.pay.ref&&<code>{o.pay.ref}</code>}
        <select value={o.pay.status} onChange={e=>updateOrder(o.id,{pay:{...o.pay,status:e.target.value}})} className="rounded-lg border px-2 py-1">{Object.entries(PS).map(([v,k])=><option key={v} value={v}>{t(k)}</option>)}</select></div>}
    </div>)}</section>);
}
