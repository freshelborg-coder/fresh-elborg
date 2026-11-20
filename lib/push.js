// Browser side of customer notifications (Web Push).
import {api} from "./api";
const toKey=s=>{const raw=atob((s+"=".repeat((4-s.length%4)%4)).replace(/-/g,"+").replace(/_/g,"/"));return Uint8Array.from(raw,c=>c.charCodeAt(0))};
export const pushSupported=()=>typeof window!=="undefined"&&"serviceWorker" in navigator&&"PushManager" in window&&"Notification" in window;
export const isIOS=()=>typeof navigator!=="undefined"&&(/iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1));
export const isStandalone=()=>typeof window!=="undefined"&&(window.matchMedia("(display-mode: standalone)").matches||window.navigator.standalone===true);
async function getReg(){
  const r=await Promise.race([navigator.serviceWorker.ready,new Promise(res=>setTimeout(()=>res(null),6000))]);
  return r||navigator.serviceWorker.register("/sw.js");
}
export async function currentSub(){
  if(!pushSupported())return null;
  try{const reg=await navigator.serviceWorker.getRegistration();return reg?await reg.pushManager.getSubscription():null}catch{return null}
}
// already subscribed: just attach a (new) order to this device
export async function linkOrder(orderId){
  const s=await currentSub();if(!s)return false;
  const r=await api("/api/push",{method:"POST",body:{endpoint:s.endpoint,orderId}});return r.ok;
}
// returns "ok" | "denied" | "ios-install" | "unsupported" | "server" | "failed"
export async function enablePush(orderId){
  if(!pushSupported())return isIOS()&&!isStandalone()?"ios-install":"unsupported";
  const perm=await Notification.requestPermission();      // must be the first thing: it needs the customer's tap
  if(perm!=="granted")return "denied";
  const k=await api("/api/push");if(!k.ok||!k.data||!k.data.key)return "server";
  try{
    const reg=await getReg();
    let sub=await reg.pushManager.getSubscription();
    if(!sub)sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:toKey(k.data.key)});
    const r=await api("/api/push",{method:"POST",body:{endpoint:sub.endpoint,orderId}});
    return r.ok?"ok":"server";
  }catch{return "failed"}
}
