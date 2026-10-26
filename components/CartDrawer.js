"use client";
import {useEffect,useMemo,useState} from "react";
import {useRouter} from "next/navigation";
import {useApp} from "@/lib/store";
import {api} from "@/lib/api";
import {PAY,METHODS} from "@/lib/payments";
import {cairoNow,daysList,slotsFor,isOpenNow,checkDelivery} from "@/lib/config";
import {validPhone,validName,validAddress} from "@/lib/validate";
const TX={
 ar:{when:"موعد التوصيل",asap:"في أقرب وقت (خلال ساعة تقريباً)",closed:"مفيش مواعيد متاحة في اليوم ده",promo:"كود الخصم",apply:"تطبيق",remove:"إلغاء",sub:"المجموع",disc:"الخصم",
  p_invalid:"الكود غير صحيح",p_expired:"الكود منتهي",p_used:"الكود خلص عدده",p_min:"الحد الأدنى للطلب لهذا الكود",p_ok:"تم تطبيق الكود 🎉",
  e_phone:"اكتب رقم موبايل صحيح (مثال: 01012345678)",e_name:"اكتب اسمك (حرفين على الأقل)",e_addr:"اكتب العنوان بالتفصيل (8 حروف على الأقل)",e_slot:"الموعد ده بقى مش متاح، اختار موعد تاني",e_pick:"اختار موعد التوصيل",e_many:"حاولت أكتر من مرة في وقت قصير، جرّب بعد شوية",e_gen:"حصلت مشكلة، جرّب تاني"},
 en:{when:"Delivery time",asap:"As soon as possible (about 1 hour)",closed:"No slots available for this day",promo:"Promo code",apply:"Apply",remove:"Remove",sub:"Subtotal",disc:"Discount",
  p_invalid:"Invalid code",p_expired:"Code expired",p_used:"Code fully used",p_min:"Minimum order for this code",p_ok:"Code applied 🎉",
  e_phone:"Enter a valid mobile number (e.g. 01012345678)",e_name:"Enter your name (2+ letters)",e_addr:"Enter the full address (8+ characters)",e_slot:"That slot is no longer available, pick another",e_pick:"Choose a delivery time",e_many:"Too many attempts, try again in a little while",e_gen:"Something went wrong, try again"}};
export default function CartDrawer(){
  const {t,lang,lines,total,add,dec,cartOpen,setCartOpen,checkout}=useApp();const r=useRouter();const x=TX[lang]||TX.ar;
  const [f,setF]=useState({name:"",phone:"",address:"",method:"cod",ref:"",hp:""});const [err,setErr]=useState("");const [busy,setBusy]=useState(false);
  const set=k=>e=>setF({...f,[k]:e.target.value});
  // delivery day / slot (recomputed when the drawer opens, so past slots disappear)
  const now=useMemo(()=>cartOpen?cairoNow():cairoNow(),[cartOpen]);
  const days=useMemo(()=>daysList(now),[now]);
  const [day,setDay]=useState("");const [slot,setSlot]=useState("");
  const curDay=day&&days.some(d=>d.id===day)?day:days[0].id;
  const slots=useMemo(()=>slotsFor(curDay,now),[curDay,now]);
  const asap=curDay===now.date&&isOpenNow(now);
  // promo code
  const [pin,setPin]=useState("");const [promo,setPromo]=useState(null);const [pmsg,setPmsg]=useState("");
  const body=()=>lines.map(l=>({id:l.p.id,qty:l.qty}));
  const perr=(e,min)=>e==="expired"?x.p_expired:e==="used-up"?x.p_used:e==="min"?`${x.p_min}: ${min} ${t("cur")}`:x.p_invalid;
  const applyPromo=async(code=pin)=>{
    const c=String(code).trim().toUpperCase();if(!c)return;setPmsg("...");
    const q=await api("/api/promo",{method:"POST",body:{code:c,items:body()}});
    if(q.ok&&q.data?.ok){setPromo({code:c,discount:q.data.discount});setPmsg(x.p_ok)}else{setPromo(null);setPmsg(perr(q.data?.error,q.data?.min))}
  };
  useEffect(()=>{if(promo)applyPromo(promo.code)},[total]);                 // cart changed: re-check the code
  const discount=promo?promo.discount:0;const grand=Math.max(0,total-discount);
  const E=c=>c==="bad-phone"?x.e_phone:c==="bad-name"?x.e_name:c==="bad-address"?x.e_addr:c==="slot-invalid"?x.e_slot:c==="too-many"?x.e_many:c?.startsWith("promo-")?perr(c.slice(6)):x.e_gen;
  const submit=async()=>{
    if(busy)return;
    if(!validName(f.name))return setErr(x.e_name);if(!validPhone(f.phone))return setErr(x.e_phone);if(!validAddress(f.address))return setErr(x.e_addr);
    const delivery={day:curDay,slot};if(!slot||!checkDelivery(delivery,cairoNow()).ok)return setErr(slot?x.e_slot:x.e_pick);
    if(f.method==="wallet"&&!f.ref.trim())return setErr(t("fill"));
    setErr("");setBusy(true);
    const res=await checkout({...f,delivery,promo:promo?.code||"",discount});setBusy(false);
    if(res&&res.error){setErr(E(res.error));if(res.error==="slot-invalid")setSlot("");if(res.error.startsWith("promo-")){setPromo(null)}return}
    if(res){setF({...f,ref:""});setPromo(null);setPin("");setPmsg("");setSlot("");r.push("/track")}
  };
  const inp="w-full rounded-xl border border-black/10 bg-paper px-3 py-2 text-sm outline-none focus:ring-2 ring-brand";
  const chip=on=>`rounded-xl border px-3 py-2 text-sm font-bold ${on?"border-brand bg-brand text-white":"border-black/10 bg-white"}`;
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
          <input className={inp} placeholder={t("name")} autoComplete="name" maxLength={60} value={f.name} onChange={set("name")}/>
          <input className={inp} placeholder={t("phone")} inputMode="tel" autoComplete="tel" maxLength={16} dir="ltr" value={f.phone} onChange={set("phone")}/>
          <input className={inp} placeholder={t("address")} autoComplete="street-address" maxLength={250} value={f.address} onChange={set("address")}/>
          <input tabIndex={-1} autoComplete="off" aria-hidden="true" name="website" value={f.hp} onChange={set("hp")} className="absolute -left-[9999px] h-0 w-0 opacity-0"/>
          <div className="pt-1 text-sm font-extrabold">🕒 {x.when}</div>
          <div className="flex gap-2">{days.map(d=><button key={d.id} onClick={()=>{setDay(d.id);setSlot("")}} className={`flex-1 ${chip(curDay===d.id)}`}>{d.label}</button>)}</div>
          <div className="grid grid-cols-2 gap-2">
            {asap&&<button onClick={()=>setSlot("asap")} className={`col-span-2 ${chip(slot==="asap")}`}>⚡ {x.asap}</button>}
            {slots.map(s=><button key={s.id} onClick={()=>setSlot(s.id)} className={chip(slot===s.id)}>{s.label}</button>)}
            {!asap&&slots.length===0&&<p className="col-span-2 text-center text-sm text-ink/60">{x.closed}</p>}
          </div>
          <div className="pt-1 text-sm font-extrabold">🏷️ {x.promo}</div>
          <div className="flex gap-2"><input className={inp} dir="ltr" placeholder="FRESH10" value={promo?promo.code:pin} disabled={!!promo} onChange={e=>setPin(e.target.value.toUpperCase())}/>
            {promo?<button onClick={()=>{setPromo(null);setPmsg("");setPin("")}} className="rounded-xl bg-red-50 px-3 text-sm font-bold text-red-700">{x.remove}</button>:<button onClick={()=>applyPromo()} className="btn px-4 text-sm">{x.apply}</button>}</div>
          {pmsg&&<p className={`text-sm font-bold ${promo?"text-green-700":"text-red-600"}`}>{pmsg}</p>}
          <div className="pt-1 text-sm font-extrabold">{t("pay")}</div>
          {METHODS.map(m=><button key={m.id} disabled={m.off} onClick={()=>setF({...f,method:m.id})} className={`flex w-full items-center gap-3 rounded-xl border p-3 text-start text-sm font-bold disabled:opacity-50 ${f.method===m.id?"border-brand bg-brand-soft":"border-black/10"}`}>
            <span className="text-2xl">{m.e}</span><span>{t(m.id)}{m.off&&<small className="block font-normal">{t("cardSoon")}</small>}</span></button>)}
          {f.method==="wallet"&&<div className="space-y-2 rounded-xl bg-brand-soft p-3 text-sm"><div>{t("transfer")}: <b>{PAY.wallet}</b> / <b>{PAY.instapay}</b></div>
            <input className={inp} placeholder={t("refNo")} value={f.ref} onChange={set("ref")}/></div>}
        </div>}
      </div>
      <div className="space-y-2 border-t p-4">{err&&<p className="text-sm font-bold text-red-600">{err}</p>}
        {discount>0&&<><div className="flex justify-between text-sm"><span>{x.sub}</span><span>{total} {t("cur")}</span></div><div className="flex justify-between text-sm text-green-700"><span>{x.disc} ({promo.code})</span><span>-{discount} {t("cur")}</span></div></>}
        <div className="flex justify-between text-lg font-extrabold"><span>{t("total")}</span><span>{grand} {t("cur")}</span></div>
        <button disabled={!lines.length||busy} onClick={submit} className="btn w-full disabled:opacity-40">{busy?"...":t("checkout")}</button></div>
    </aside></>);
}
