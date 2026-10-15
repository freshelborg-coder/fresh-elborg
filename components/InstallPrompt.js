"use client";
import {useEffect,useState} from "react";
import {useApp} from "@/lib/store";

// Registers the service worker and shows an "Install app" banner in Chrome (Android/desktop).
// On iOS Safari (no install event) it shows a short "Add to Home Screen" hint instead.
export default function InstallPrompt(){
  const {lang}=useApp();
  const [evt,setEvt]=useState(null);
  const [ios,setIos]=useState(false);
  const [hidden,setHidden]=useState(true);
  const ar=lang==="ar";

  useEffect(()=>{
    if("serviceWorker" in navigator){
      navigator.serviceWorker.register("/sw.js").catch(()=>{});
    }
    const standalone=window.matchMedia("(display-mode: standalone)").matches||window.navigator.standalone;
    let dismissed=false;
    try{dismissed=sessionStorage.getItem("install-dismissed")==="1";}catch(e){}
    if(standalone||dismissed)return;

    const onPrompt=e=>{e.preventDefault();setEvt(e);setHidden(false);};
    const onInstalled=()=>{setEvt(null);setHidden(true);};
    window.addEventListener("beforeinstallprompt",onPrompt);
    window.addEventListener("appinstalled",onInstalled);

    const ua=navigator.userAgent;
    if(/iphone|ipad|ipod/i.test(ua)&&/safari/i.test(ua)&&!/crios|fxios/i.test(ua)){setIos(true);setHidden(false);}
    return()=>{window.removeEventListener("beforeinstallprompt",onPrompt);window.removeEventListener("appinstalled",onInstalled);};
  },[]);

  const close=()=>{setHidden(true);try{sessionStorage.setItem("install-dismissed","1");}catch(e){}};
  const install=async()=>{
    if(!evt)return;
    evt.prompt();
    try{await evt.userChoice;}catch(e){}
    setEvt(null);setHidden(true);
  };

  if(hidden||(!evt&&!ios))return null;
  return(<div role="dialog" className="fixed inset-x-3 bottom-20 z-40 mx-auto max-w-md md:bottom-4">
    <div className="flex items-center gap-3 rounded-2xl bg-brand-dark p-3 text-white shadow-xl ring-1 ring-white/10">
      <img src="/icons/icon-192.png" alt="" width="48" height="48" className="h-12 w-12 shrink-0 rounded-xl"/>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-extrabold">{ar?"ثبّت تطبيق فريش البرج":"Install Fresh Al-Burj"}</p>
        <p className="text-xs text-white/80">{ios
          ?(ar?"اضغط زر المشاركة ثم «إضافة إلى الشاشة الرئيسية»":"Tap Share, then “Add to Home Screen”")
          :(ar?"تسوق أسهل .. لحياة أفضل":"Shop easier, live better")}</p>
      </div>
      {!ios&&<button onClick={install} className="shrink-0 rounded-xl bg-gold px-4 py-2 text-sm font-extrabold text-ink active:scale-95">{ar?"تثبيت":"Install"}</button>}
      <button onClick={close} aria-label="close" className="shrink-0 px-1 text-xl leading-none text-white/70">×</button>
    </div>
  </div>);
}
