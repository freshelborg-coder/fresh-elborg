"use client";
import {useEffect,useRef,useState} from "react";
import {DELIVERY} from "@/lib/config";
import {quote} from "@/lib/delivery";
// Map (Leaflet + OpenStreetMap, free, no API key). The library is loaded only when this window opens.
const CSS=["https://unpkg.com/leaflet@1.9.4/dist/leaflet.css","sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="];
const JS=["https://unpkg.com/leaflet@1.9.4/dist/leaflet.js","sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="];
function loadLeaflet(){return new Promise((res,rej)=>{
  if(window.L)return res(window.L);
  if(!document.getElementById("lf-css")){const l=document.createElement("link");l.id="lf-css";l.rel="stylesheet";l.href=CSS[0];l.integrity=CSS[1];l.crossOrigin="";document.head.appendChild(l)}
  let s=document.getElementById("lf-js");
  if(!s){s=document.createElement("script");s.id="lf-js";s.src=JS[0];s.integrity=JS[1];s.crossOrigin="";s.async=true;document.head.appendChild(s)}
  s.addEventListener("load",()=>res(window.L));s.addEventListener("error",()=>{s.remove();rej(new Error("leaflet"))});
})}
const TX={ar:{title:"حدد مكان التوصيل",hint:"اضغط على الخريطة أو حرّك الدبوس 📍 لمكان بيتك",me:"📡 موقعي الحالي",ok:"تأكيد الموقع ✓",dist:"المسافة التقريبية",km:"كم",fee:"رسوم التوصيل",free:"توصيل مجاني 🎉",out:"الموقع ده خارج نطاق التوصيل",
  locating:"جاري تحديد موقعك...",gpsFail:"مقدرناش نحدد موقعك. فعّل الـ GPS أو حرّك الدبوس بإيدك",err:"الخريطة ما اتحمّلتش. اتأكد من النت وجرّب تاني",loading:"جاري تحميل الخريطة..."},
 en:{title:"Choose delivery location",hint:"Tap the map or drag the pin 📍 to your place",me:"📡 My location",ok:"Confirm location ✓",dist:"Approx. distance",km:"km",fee:"Delivery fee",free:"Free delivery 🎉",out:"This location is outside our delivery area",
  locating:"Finding your location...",gpsFail:"Could not get your location. Turn on GPS or drag the pin",err:"The map could not load. Check your internet and try again",loading:"Loading map..."}};
export default function MapPicker({lang,initial,payable,onConfirm,onClose}){
  const x=TX[lang]||TX.ar,el=useRef(null),mapRef=useRef(null),pinRef=useRef(null),putRef=useRef(null);
  const [pos,setPos]=useState(initial||null),[state,setState]=useState("loading"),[gps,setGps]=useState("");
  useEffect(()=>{
    let dead=false;
    loadLeaflet().then(L=>{
      if(dead||!el.current)return;
      const c=initial||DELIVERY.store,m=L.map(el.current).setView([c.lat,c.lng],initial?16:13);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:"© OpenStreetMap"}).addTo(m);
      L.marker([DELIVERY.store.lat,DELIVERY.store.lng],{icon:L.divIcon({html:"🏪",className:"fb-pin",iconSize:[32,32],iconAnchor:[16,16]}),interactive:false}).addTo(m);
      const icon=L.divIcon({html:"📍",className:"fb-pin",iconSize:[34,34],iconAnchor:[17,32]});
      const put=ll=>{
        setPos({lat:ll.lat,lng:ll.lng});
        if(pinRef.current)pinRef.current.setLatLng(ll);
        else{const mk=L.marker(ll,{icon,draggable:true}).addTo(m);mk.on("dragend",()=>{const q=mk.getLatLng();setPos({lat:q.lat,lng:q.lng})});pinRef.current=mk}
      };
      putRef.current=put;m.on("click",e=>put(e.latlng));if(initial)put({lat:initial.lat,lng:initial.lng});
      mapRef.current=m;setState("ready");setTimeout(()=>m.invalidateSize(),250);
    }).catch(()=>{if(!dead)setState("error")});
    return()=>{dead=true;if(mapRef.current){mapRef.current.remove();mapRef.current=null}pinRef.current=null;putRef.current=null};
  },[]);
  const locate=()=>{
    if(!navigator.geolocation||!mapRef.current)return setGps(x.gpsFail);
    setGps(x.locating);
    navigator.geolocation.getCurrentPosition(p=>{const ll={lat:p.coords.latitude,lng:p.coords.longitude};mapRef.current&&mapRef.current.setView([ll.lat,ll.lng],17);putRef.current&&putRef.current(ll);setGps("")},()=>setGps(x.gpsFail),{enableHighAccuracy:true,timeout:10000});
  };
  const q=pos?quote(pos,payable):null;
  return(<div className="fixed inset-0 z-[90] flex flex-col bg-white" role="dialog" aria-modal="true">
    <div className="flex items-center justify-between border-b p-3"><h2 className="font-extrabold">📍 {x.title}</h2><button onClick={onClose} className="text-2xl" aria-label="close">×</button></div>
    <div className="relative flex-1">
      <div ref={el} className="absolute inset-0"/>
      {state!=="ready"&&<div className="absolute inset-0 z-[500] grid place-items-center bg-white p-6 text-center font-bold text-ink/70">{state==="error"?x.err:x.loading}</div>}
    </div>
    <div className="space-y-2 border-t p-3">
      <p className="text-center text-sm">{gps||(!pos?x.hint:q?.ok?<>{x.dist}: <b>{q.km} {x.km}</b> • {x.fee}: <b>{q.free?x.free:`${q.fee} ${lang==="en"?"EGP":"ج.م"}`}</b></>:<span className="font-bold text-red-600">{x.out}</span>)}</p>
      <div className="flex gap-2"><button onClick={locate} className="flex-1 rounded-xl border border-brand bg-brand-soft px-3 py-3 text-sm font-bold">{x.me}</button>
        <button disabled={!q?.ok} onClick={()=>onConfirm({lat:Math.round(pos.lat*1e6)/1e6,lng:Math.round(pos.lng*1e6)/1e6})} className="btn flex-1 py-3 disabled:opacity-40">{x.ok}</button></div>
    </div></div>);
}
