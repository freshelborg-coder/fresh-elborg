"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {useApp} from "@/lib/store";
import {PAY,METHODS} from "@/lib/payments";
export default function CartDrawer(){
  const {t,lang,lines,total,add,dec,cartOpen,setCartOpen,checkout}=useApp();const r=useRouter();
  const [f,setF]=useState({name:"",phone:"",address:"",method:"cod",ref:""});const [err,setErr]=useState("");
  const set=k=>e=>setF({...f,[k]:e.target.value});
  const submit=()=>{if(!f.name.trim()||!f.phone.trim()||!f.address.trim()||(f.method==="wallet"&&!f.ref.trim())){setErr(t("fill"));return}
    setErr("");if(checkout(f)){setF({...f,ref:""});r.push("/track")}};
  const inp="w-full rounded-xl border border-black/10 bg-paper px-3 py-2 text-sm outline-none focus:ring-2 ring-brand";
  return(<>
    <div onClick={()=>setCartOpen(false)} className={`fixed inset-0 z-40 bg-black/40 transition ${cartOpen?"opacity-100":"pointer-events-none opacity-0"}`}/>
    <aside className={`fixed inset-y-0 end-0 z-50 flex w-full max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ${cartOpen?"translate-x-0":"ltr:translate-x-full rtl:-translate-x-full"}`}>
      <div className="flex items-center justify-between border-b p-4"><h2 className="text-lg font-extrabold">🛒 {t("cart")}</h2><button onClick={()=>setCartOpen(false)} className="text-2xl" aria-label="close">×</button></div>
      <div className="flex-1 space-y-3 overflow-auto p-4">
        {lines.length===0&&<p className="py-10 text-center text-ink/60">{t("empty")}</p>}
        {lines.map(({p,qty})=><div key={p.id} className="flex items-center gap-3"><span className="text-3xl">{p.e}</span>
          <div className="flex-1 text-sm"><div className="font-bold">{p.name[lang]}</div><div className="text-brand">{p.price*qty} {t("cur")}</div></div>
          <div className="flex items-center gap-2"><button onClick={()=>dec(p.id)} className="h-7 w-7 rounded-lg border">−</button><span>{qty}</span><button onClick={()=>add(p.id)} className="h-7 w-7 rounded-lg border">+</button></div></div>)}
        {lines.length>0&&<div className="space-y-2 border-t pt-3">
          <input className={inp} placeholder={t("name")} value={f.name} onChange={set("name")}/>
          <input className={inp} placeholder={t("phone")} inputMode="tel" value={f.phone} onChange={set("phone")}/>
          <input className={inp} placeholder={t("address")} value={f.address} onChange={set("address")}/>
          <div className="pt-1 text-sm font-extrabold">{t("pay")}</div>
          {METHODS.map(m=><button key={m.id} disabled={m.off} onClick={()=>setF({...f,method:m.id})} className={`flex w-full items-center gap-3 rounded-xl border p-3 text-start text-sm font-bold disabled:opacity-50 ${f.method===m.id?"border-brand bg-brand-soft":"border-black/10"}`}>
            <span className="text-2xl">{m.e}</span><span>{t(m.id)}{m.off&&<small className="block font-normal">{t("cardSoon")}</small>}</span></button>)}
          {f.method==="wallet"&&<div className="space-y-2 rounded-xl bg-brand-soft p-3 text-sm"><div>{t("transfer")}: <b>{PAY.wallet}</b> / <b>{PAY.instapay}</b></div>
            <input className={inp} placeholder={t("refNo")} value={f.ref} onChange={set("ref")}/></div>}
        </div>}
      </div>
      <div className="space-y-3 border-t p-4">{err&&<p className="text-sm text-red-600">{err}</p>}
        <div className="flex justify-between text-lg font-extrabold"><span>{t("total")}</span><span>{total} {t("cur")}</span></div>
        <button disabled={!lines.length} onClick={submit} className="btn w-full disabled:opacity-40">{t("checkout")}</button></div>
    </aside></>);
}
