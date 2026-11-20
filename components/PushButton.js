"use client";
import {useEffect,useState} from "react";
import {useApp} from "@/lib/store";
import {api} from "@/lib/api";
import {enablePush,currentSub,linkOrder,pushSupported,isIOS,isStandalone} from "@/lib/push";

// "Turn on notifications" button. Shows nothing until push is set up on the server (VAPID keys in Cloudflare).
export default function PushButton({orderId}){
  const {lang}=useApp();const ar=lang==="ar";
  const [st,setSt]=useState("hidden");   // hidden | idle | busy | on | denied | ios | err
  useEffect(()=>{
    let off=false;
    (async()=>{
      const k=await api("/api/push");
      if(off||!k.ok||!k.data||!k.data.key)return;
      if(!pushSupported()){setSt(isIOS()&&!isStandalone()?"ios":"hidden");return}
      if(Notification.permission==="denied"){setSt("denied");return}
      const s=await currentSub();
      if(s&&Notification.permission==="granted"){if(orderId)linkOrder(orderId);setSt("on")}else setSt("idle");
    })();
    return()=>{off=true};
  },[orderId]);
  const go=async()=>{
    setSt("busy");
    const r=await enablePush(orderId);
    setSt(r==="ok"?"on":r==="denied"?"denied":r==="ios-install"?"ios":"err");
  };
  if(st==="hidden")return null;
  if(st==="on")return <p className="rounded-xl bg-green-50 p-3 text-center text-sm font-bold text-green-800">{ar?"🔔 الإشعارات شغالة على جهازك":"🔔 Notifications are on"}</p>;
  if(st==="denied")return <p className="rounded-xl bg-gold/20 p-3 text-center text-sm font-bold">{ar?"الإشعارات مقفولة من إعدادات المتصفح. افتح إعدادات الموقع وفعّلها.":"Notifications are blocked. Enable them in your browser's site settings."}</p>;
  if(st==="ios")return <p className="rounded-xl bg-gold/20 p-3 text-center text-sm font-bold">{ar?"علشان تستقبل الإشعارات على الآيفون: اضغط زر المشاركة ثم «إضافة إلى الشاشة الرئيسية»، وافتح التطبيق من هناك وفعّل الإشعارات.":"On iPhone: tap Share, then Add to Home Screen, open the app from there and turn notifications on."}</p>;
  return(<div className="space-y-2">
    <button onClick={go} disabled={st==="busy"} className="btn block w-full text-center">{st==="busy"?"...":(ar?(orderId?"🔔 فعّل إشعارات طلبك":"🔔 استقبل العروض والإشعارات"):(orderId?"🔔 Notify me about my order":"🔔 Get offers and updates"))}</button>
    {st==="err"&&<p className="text-center text-sm font-bold text-red-600">{ar?"ما قدرناش نفعّل الإشعارات. جرّب تاني.":"Could not turn notifications on. Try again."}</p>}
  </div>);
}
