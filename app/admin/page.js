"use client";
import {useCallback,useEffect,useState} from "react";
import {api,adminKey,setAdminKey} from "@/lib/api";
import OrdersTab from "@/components/admin/OrdersTab";
import ProductsTab from "@/components/admin/ProductsTab";
import StatsTab from "@/components/admin/StatsTab";
import PromosTab from "@/components/admin/PromosTab";
import DeliveryTab from "@/components/admin/DeliveryTab";
export default function Admin(){
  const [state,setState]=useState("check");const [info,setInfo]=useState(null);const [pw,setPw]=useState("");const [msg,setMsg]=useState("");
  const [tab,setTab]=useState("orders");const [orders,setOrders]=useState(null);const [oerr,setOerr]=useState("");const [test,setTest]=useState("");
  const verify=async(first)=>{
    const r=await api("/api/admin",{admin:true});
    if(r.ok){setInfo(r.data);setState("ok");setMsg("");return}
    setState("login");
    setMsg(r.status===401?(first?"":"كلمة السر غلط"):r.status===500?"كلمة السر لسه متحددتش في Cloudflare (راجع خطوات الإعداد)":"الخادم لسه مش متفعّل (راجع خطوات الإعداد)");
  };
  useEffect(()=>{if(adminKey())verify(true);else setState("login")},[]);
  const load=useCallback(async()=>{
    const r=await api("/api/orders",{admin:true});
    if(r.ok){setOrders(r.data.orders||[]);setOerr("")}else setOerr(r.status===503||r.status===404||r.status===0?"server":"auth");
  },[]);
  useEffect(()=>{if(state!=="ok")return;load();const t=setInterval(load,25000);return()=>clearInterval(t)},[state,load]);
  const nNew=(orders||[]).filter(o=>o.status==="new").length;
  useEffect(()=>{document.title=nNew?`(${nNew}) طلب جديد | لوحة الإدارة`:"لوحة الإدارة"},[nNew]);
  const patch=async(o,p)=>{
    setOrders(os=>os.map(x=>x.id===o.id?{...x,...(p.status?{status:p.status}:{}),...(p.driver!==undefined?{driver:p.driver}:{}),pay:p.payStatus?{...x.pay,status:p.payStatus}:x.pay}:x));
    await api("/api/orders/"+o.id,{method:"PATCH",admin:true,body:p});
  };
  const sendTest=async()=>{setTest("جاري الإرسال...");const r=await api("/api/admin",{method:"POST",admin:true});setTest(r.ok?"اتبعتت رسالة تجريبية. استنى لحد دقيقة وشوف واتساب.":"فشل الإرسال. راجع المفتاح ورقم الهاتف.")};
  if(state==="check")return <p className="p-8 text-center text-ink/60">...</p>;
  if(state==="login")return(<div className="card mx-auto max-w-sm space-y-3 p-6"><h1 className="text-xl font-extrabold">لوحة الإدارة</h1>
    <input type="password" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){setAdminKey(pw);verify(false)}}} placeholder="كلمة السر" className="w-full rounded-xl border px-3 py-3"/>
    {msg&&<p className="text-sm font-bold text-red-600">{msg}</p>}
    <button className="btn w-full" onClick={()=>{setAdminKey(pw);verify(false)}}>دخول</button></div>);
  const TABS=[["orders",`📦 الطلبات${nNew?` (${nNew})`:""}`],["products","🛍️ المنتجات"],["promos","🏷️ الكوبونات"],["delivery","🛵 التوصيل"],["stats","📊 المبيعات"]];
  return(<div className="space-y-3">
    <div className="flex items-center justify-between"><h1 className="text-xl font-extrabold">لوحة الإدارة</h1>
      <button onClick={()=>{setAdminKey("");setState("login");setPw("")}} className="text-sm underline">خروج</button></div>
    {!info.kv&&<p className="rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">⚠️ قاعدة البيانات مش مفعّلة: الأسعار والطلبات مش هتوصل للعملاء. راجع الخطوة 1 في الإعداد.</p>}
    {info.kv&&!info.notify&&<p className="rounded-xl bg-gold/20 p-3 text-sm font-bold">🔔 إشعارات واتساب مش مفعّلة لسه. راجع الخطوة 3 في الإعداد.</p>}
    {info.kv&&info.notify&&<p className="flex flex-wrap items-center gap-2 rounded-xl bg-green-50 p-3 text-sm text-green-800">✅ إشعارات واتساب مفعّلة <button onClick={sendTest} className="rounded-lg bg-white px-3 py-1 font-bold ring-1 ring-green-300">إرسال رسالة تجريبية</button>{test&&<span>{test}</span>}</p>}
    <div className="sticky top-[118px] z-20 flex gap-2 overflow-x-auto rounded-2xl bg-paper py-1 no-scrollbar">{TABS.map(([k,l])=><button key={k} onClick={()=>setTab(k)} className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-bold ${tab===k?"bg-brand text-white":"bg-white ring-1 ring-black/10"}`}>{l}</button>)}</div>
    {tab==="orders"&&<OrdersTab orders={orders} err={oerr} reload={load} patch={patch}/>}
    {tab==="products"&&<ProductsTab/>}
    {tab==="promos"&&<PromosTab/>}
    {tab==="delivery"&&<DeliveryTab/>}
    {tab==="stats"&&<StatsTab orders={orders}/>}
  </div>);
}
