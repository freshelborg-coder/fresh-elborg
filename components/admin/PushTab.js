"use client";
import {useEffect,useState} from "react";
import {api} from "@/lib/api";
const I="w-full rounded-xl border border-black/15 bg-white px-3 py-2.5 text-base";
export default function PushTab(){
  const [info,setInfo]=useState(null);const [f,setF]=useState({title:"",body:""});const [msg,setMsg]=useState("");const [busy,setBusy]=useState(false);
  useEffect(()=>{(async()=>{const r=await api("/api/push/send",{admin:true});setInfo(r.ok?r.data:{configured:false,count:0})})()},[]);
  const set=k=>e=>setF({...f,[k]:e.target.value});
  const send=async()=>{
    if(!f.title.trim()||!f.body.trim())return setMsg("اكتب العنوان ونص الإشعار");
    if(!window.confirm("تبعت الإشعار ده لكل المشتركين ("+info.count+(info.more?"+":"")+" جهاز)؟"))return;
    setBusy(true);let cursor=null,sent=0,failed=0;
    for(let i=0;i<200;i++){
      setMsg("جاري الإرسال... ("+sent+")");
      const r=await api("/api/push/send",{method:"POST",admin:true,body:{title:f.title,body:f.body,url:"/",cursor}});
      if(!r.ok){setBusy(false);setMsg("⚠️ فشل الإرسال");return}
      sent+=r.data.sent;failed+=r.data.failed;
      if(r.data.done)break;cursor=r.data.cursor;
    }
    setBusy(false);setMsg("✅ اتبعت لـ "+sent+" جهاز"+(failed?" (فشل "+failed+")":""));
  };
  if(!info)return <p className="p-8 text-center text-ink/60">...</p>;
  if(!info.configured)return <p className="rounded-xl bg-gold/20 p-4 text-sm font-bold">🔔 إشعارات العملاء لسه مش متفعّلة. لازم تضيف VAPID_PUBLIC وVAPID_PRIVATE في Cloudflare (الخطوات اتشرحت في المحادثة).</p>;
  return(<div className="space-y-3">
    <p className="rounded-xl bg-green-50 p-3 text-sm font-bold text-green-800">✅ الإشعارات شغالة. عدد الأجهزة المشتركة: {info.count}{info.more?"+":""}. العميل بيوصله إشعار تلقائي لما تغيّر حالة طلبه.</p>
    <div className="card space-y-3 p-4"><h2 className="font-extrabold">📣 ابعت عرض لكل المشتركين</h2>
      <input value={f.title} onChange={set("title")} maxLength={60} placeholder="العنوان (مثلاً: عرض اليوم 🔥)" className={I}/>
      <textarea value={f.body} onChange={set("body")} maxLength={200} rows={3} placeholder="نص الإشعار" className={I}/>
      <button onClick={send} disabled={busy} className="btn w-full">{busy?"...":"إرسال الإشعار"}</button>
      {msg&&<p className="text-sm font-bold">{msg}</p>}</div>
  </div>);
}
