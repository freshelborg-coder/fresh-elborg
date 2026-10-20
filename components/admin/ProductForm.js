"use client";
import {useState} from "react";
import {api} from "@/lib/api";
export const CATN={offers:"🔥 عروض",cheese:"🧀 الجبن",sauces:"🥫 الصوصات",meats:"🍗 اللحوم ومصنعاتها",pastries:"🥐 المعجنات",sweets:"🍫 حلويات"};
const EMO={offers:"🔥",cheese:"🧀",sauces:"🥫",meats:"🍗",pastries:"🥐",sweets:"🍫"};
// Fit the chosen photo into a 4:3 frame with a clean sand background, small JPEG (so every product looks the same)
async function prepare(file){
  const bmp=await createImageBitmap(file);const W=1200,H=900;const c=document.createElement("canvas");c.width=W;c.height=H;const g=c.getContext("2d");
  const gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,"#FBF6EE");gr.addColorStop(1,"#EEE1D0");g.fillStyle=gr;g.fillRect(0,0,W,H);
  const rr=(x,y,w,h,r)=>{g.beginPath();if(g.roundRect)g.roundRect(x,y,w,h,r);else g.rect(x,y,w,h)};
  if(Math.abs(bmp.width/bmp.height/(W/H)-1)<0.15){const s=Math.max(W/bmp.width,H/bmp.height);const w=bmp.width*s,h=bmp.height*s;g.drawImage(bmp,(W-w)/2,(H-h)/2,w,h)}
  else{const s=Math.min(W*0.95/bmp.width,H*0.95/bmp.height);const w=bmp.width*s,h=bmp.height*s,x=(W-w)/2,y=(H-h)/2;
    g.save();g.shadowColor="rgba(60,40,20,.35)";g.shadowBlur=24;g.shadowOffsetY=10;rr(x,y,w,h,24);g.fillStyle="#fff";g.fill();g.restore();
    g.save();rr(x,y,w,h,24);g.clip();g.drawImage(bmp,x,y,w,h);g.restore()}
  return new Promise(res=>c.toBlob(res,"image/jpeg",0.88));
}
export default function ProductForm({p,onSave,onDelete,onClose}){
  const isNew=!p;const id=p?.id||"p-"+Date.now().toString(36);
  const [f,setF]=useState({ar:p?.name?.ar||"",en:p?.name?.en&&p.name.en!==p.name.ar?p.name.en:"",cat:p?.cat||"meats",weight:p?.weight||"",price:p?String(p.price):"",old:p?.old?String(p.old):"",pct:""});
  const [blob,setBlob]=useState(null);const [prev,setPrev]=useState(p?.img||"");const [err,setErr]=useState("");const [busy,setBusy]=useState(false);
  const set=k=>e=>setF({...f,[k]:e.target.value});
  const pick=async e=>{const file=e.target.files?.[0];if(!file)return;try{const b=await prepare(file);setBlob(b);setPrev(URL.createObjectURL(b))}catch{setErr("الصورة دي مش مدعومة، جرّب صورة تانية")}};
  const applyPct=()=>{const pc=Number(f.pct);const base=f.old?Number(f.old):Number(f.price);if(!(pc>0&&pc<100)||!(base>0))return;setF({...f,old:String(base),price:String(Math.round(base*(1-pc/100)))})};
  const clearDiscount=()=>setF({...f,price:f.old||f.price,old:"",pct:""});
  const price=Number(f.price),old=Number(f.old);const off=old>price&&price>0?Math.round((1-price/old)*100):0;
  const save=async()=>{
    setErr("");const name=f.ar.trim();
    if(!name)return setErr("اكتب اسم المنتج");if(!(price>0))return setErr("اكتب السعر");
    if(f.old&&!(old>price))return setErr("السعر قبل الخصم لازم يكون أكبر من السعر الحالي");
    setBusy(true);let img=p?.img||"";
    if(blob){const r=await api(`/api/upload?id=${id}`,{method:"POST",admin:true,raw:true,body:blob,headers:{"content-type":"image/jpeg"}});
      if(r.ok&&r.data?.url)img=r.data.url;else{setBusy(false);return setErr(r.status===503||r.status===404||r.status===0?"رفع الصور محتاج تفعيل قاعدة البيانات (الخطوة 1 في الإعداد)":"فشل رفع الصورة، جرّب تاني")}}
    await onSave({id,name:{ar:name,en:f.en.trim()||name},cat:f.cat,weight:f.weight.trim(),price,old:f.old?old:null,sold:p?.sold||0,img,e:p?.e||EMO[f.cat]});
    setBusy(false);
  };
  const L="mb-1 block text-sm font-bold",I="w-full rounded-xl border border-black/15 bg-white px-3 py-3 text-base";
  return(<div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/50 sm:items-center sm:p-4" onClick={onClose}>
    <div onClick={e=>e.stopPropagation()} className="flex max-h-[94vh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl bg-white sm:rounded-3xl">
      <div className="flex items-center justify-between border-b p-4"><h2 className="text-lg font-extrabold">{isNew?"منتج جديد":"تعديل المنتج"}</h2><button onClick={onClose} className="text-2xl" aria-label="close">×</button></div>
      <div className="space-y-3 overflow-y-auto p-4">
        <div><span className={L}>صورة المنتج</span>
          <label className="grid aspect-[4/3] cursor-pointer place-items-center overflow-hidden rounded-2xl border-2 border-dashed border-brand/40 bg-brand-soft">
            {prev?<img src={prev} alt="" className="h-full w-full object-contain"/>:<span className="text-center text-sm font-bold text-brand">📷<br/>اضغط لاختيار صورة من الموبايل</span>}
            <input type="file" accept="image/*" onChange={pick} className="hidden"/></label>
          {prev&&<p className="mt-1 text-center text-xs text-ink/50">اضغط على الصورة لتغييرها</p>}</div>
        <div><label className={L}>اسم المنتج</label><input className={I} value={f.ar} onChange={set("ar")} placeholder="مثال: بيف برجر فريش 20 قطعة"/></div>
        <div><label className={L}>الاسم بالإنجليزي (اختياري)</label><input className={I} dir="ltr" value={f.en} onChange={set("en")}/></div>
        <div className="grid grid-cols-2 gap-3"><div><label className={L}>القسم</label><select className={I} value={f.cat} onChange={set("cat")}>{Object.entries(CATN).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></div>
          <div><label className={L}>الوزن / العدد</label><input className={I} value={f.weight} onChange={set("weight")} placeholder="1 كيلو"/></div></div>
        <div className="rounded-2xl bg-paper p-3"><div className="grid grid-cols-2 gap-3">
          <div><label className={L}>السعر الحالي (ج.م)</label><input className={I} type="number" inputMode="decimal" value={f.price} onChange={set("price")}/></div>
          <div><label className={L}>السعر قبل الخصم</label><input className={I} type="number" inputMode="decimal" value={f.old} onChange={set("old")} placeholder="فاضي = مفيش خصم"/></div></div>
          <div className="mt-3 flex items-end gap-2"><div className="flex-1"><label className={L}>🏷️ اعمل خصم بالنسبة %</label><input className={I} type="number" inputMode="numeric" value={f.pct} onChange={set("pct")} placeholder="مثال: 10"/></div>
            <button type="button" onClick={applyPct} className="btn h-[50px] px-4">طبّق</button></div>
          {off>0&&<p className="mt-2 text-sm font-bold text-green-700">الخصم {off}% — بدل {old} بقى {price} ج.م <button type="button" onClick={clearDiscount} className="mr-2 underline">إلغاء الخصم</button></p>}</div>
        {err&&<p className="text-sm font-bold text-red-600">{err}</p>}
      </div>
      <div className="flex items-center gap-2 border-t p-4"><button onClick={save} disabled={busy} className="btn flex-1 py-3 text-base disabled:opacity-50">{busy?"جاري الحفظ...":"حفظ ✓"}</button>
        {!isNew&&<button onClick={()=>onDelete(p)} className="rounded-xl bg-red-50 px-4 py-3 font-bold text-red-700">حذف</button>}</div>
    </div></div>);
}
