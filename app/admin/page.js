"use client";
import {useState} from "react";
import {useApp} from "@/lib/store";
import SalesOverview from "@/components/admin/SalesOverview";
import PriceManager from "@/components/admin/PriceManager";
import OrderManager from "@/components/admin/OrderManager";
// DEMO ONLY: client-side gate. Replace with real server auth (e.g. NextAuth + middleware) before production.
const PASS=process.env.NEXT_PUBLIC_ADMIN_PASS||"admin123";
export default function Admin(){
  const {t}=useApp();const [ok,setOk]=useState(false);const [v,setV]=useState("");const [bad,setBad]=useState(false);
  if(!ok)return(<div className="card mx-auto max-w-sm space-y-3 p-6"><h1 className="text-xl font-extrabold">{t("admin")}</h1>
    <input type="password" value={v} onChange={e=>setV(e.target.value)} placeholder={t("pass")} className="w-full rounded-xl border px-3 py-2"/>
    {bad&&<p className="text-sm text-red-600">{t("bad")}</p>}
    <button className="btn w-full" onClick={()=>v===PASS?setOk(true):setBad(true)}>{t("login")}</button></div>);
  return(<div className="space-y-4"><div className="flex items-center justify-between"><h1 className="text-xl font-extrabold">{t("admin")}</h1><button onClick={()=>setOk(false)} className="text-sm underline">{t("logout")}</button></div>
    <SalesOverview/><PriceManager/><OrderManager/></div>);
}
