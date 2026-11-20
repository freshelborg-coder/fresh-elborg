// Web Push (VAPID) for Cloudflare Workers.
// We send an EMPTY push (a "wake-up"). The service worker then asks /api/push/pull for the message text.
// This works with Chrome/Android (FCM), Firefox and Safari/iOS without any payload encryption.
const enc=new TextEncoder();
const b64u=buf=>{let s="";for(const x of new Uint8Array(buf))s+=String.fromCharCode(x);return btoa(s).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")};
const unb64u=s=>{s=s.replace(/-/g,"+").replace(/_/g,"/");while(s.length%4)s+="=";const bin=atob(s);const a=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)a[i]=bin.charCodeAt(i);return a};
// Only real browser push services are accepted (stops anyone from making our server call random URLs).
export const PUSH_HOSTS=["fcm.googleapis.com","android.googleapis.com","push.services.mozilla.com","push.apple.com","notify.windows.com"];
export function okEndpoint(u){
  try{const x=new URL(String(u));return x.protocol==="https:"&&String(u).length<=700&&PUSH_HOSTS.some(h=>x.hostname===h||x.hostname.endsWith("."+h))}catch{return false}
}
export async function hashEndpoint(u){
  const d=await crypto.subtle.digest("SHA-256",enc.encode(u));
  return [...new Uint8Array(d)].slice(0,16).map(b=>b.toString(16).padStart(2,"0")).join("");
}
export const pushReady=env=>!!(env.DB&&env.VAPID_PUBLIC&&env.VAPID_PRIVATE);
async function signingKey(env){
  const pub=unb64u(env.VAPID_PUBLIC);
  return crypto.subtle.importKey("jwk",{kty:"EC",crv:"P-256",x:b64u(pub.slice(1,33)),y:b64u(pub.slice(33,65)),d:env.VAPID_PRIVATE,ext:true},{name:"ECDSA",namedCurve:"P-256"},false,["sign"]);
}
export async function vapidHeader(env,endpoint){
  const head=b64u(enc.encode(JSON.stringify({typ:"JWT",alg:"ES256"})));
  const body=b64u(enc.encode(JSON.stringify({aud:new URL(endpoint).origin,exp:Math.floor(Date.now()/1000)+12*3600,sub:env.VAPID_SUBJECT||"https://fresh-elborg.pages.dev"})));
  const sig=await crypto.subtle.sign({name:"ECDSA",hash:"SHA-256"},await signingKey(env),enc.encode(head+"."+body));
  return `vapid t=${head}.${body}.${b64u(sig)}, k=${env.VAPID_PUBLIC}`;
}
// returns {ok, gone (subscription is dead and should be deleted), status}
export async function sendPush(env,endpoint){
  try{
    const r=await fetch(endpoint,{method:"POST",headers:{Authorization:await vapidHeader(env,endpoint),TTL:"86400",Urgency:"high"}});
    return {ok:r.ok,gone:r.status===404||r.status===410,status:r.status};
  }catch{return {ok:false,gone:false,status:0}}
}
// text of the notification the customer gets when the order status changes (null = no notification)
export function orderPushMsg(o){
  const id=o.id;
  if(o.status==="preparing")return {title:"👨‍🍳 طلبك قيد التحضير",body:`طلبك #${id} بيتجهز دلوقتي`,url:"/track",tag:"o"+id};
  if(o.status==="onway")return {title:"🛵 طلبك في الطريق",body:`طلبك #${id} خرج للتوصيل${o.driver?` مع ${o.driver}`:""}`,url:"/track",tag:"o"+id};
  if(o.status==="delivered")return {title:"✅ تم تسليم طلبك",body:`بالهنا والشفا! طلبك #${id} اتسلّم`,url:"/track",tag:"o"+id};
  return null;
}
// store the message for one subscriber, wake its device, and clean up dead subscriptions
export async function deliver(env,hash,endpoint,msg,extraKeys=[]){
  await env.DB.put("msg:"+hash,JSON.stringify(msg),{expirationTtl:86400});
  const r=await sendPush(env,endpoint);
  if(r.gone)await Promise.all([env.DB.delete("msg:"+hash),env.DB.delete("sub:"+hash),...extraKeys.map(k=>env.DB.delete(k))]);
  return r;
}
export async function pushToOrder(env,o){
  const m=orderPushMsg(o);if(!m||!pushReady(env))return;
  const l=await env.DB.list({prefix:"os:"+o.id+":",limit:10});
  await Promise.all(l.keys.map(k=>{const e=k.metadata&&k.metadata.e,h=k.name.split(":")[2];return e&&h?deliver(env,h,e,m,[k.name]):null}));
}
