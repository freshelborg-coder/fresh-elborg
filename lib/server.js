// Shared helpers for the Cloudflare Pages Functions in /functions (server side only).
import {PRODUCTS} from "./data.js";
import {cleanDelivery} from "./delivery.js";
export const STATUSES=["new","preparing","onway","delivered"];
export const json=(d,s=200)=>new Response(JSON.stringify(d),{status:s,headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store"}});
export const isAdmin=(req,env)=>!!env.ADMIN_PASSWORD&&req.headers.get("x-admin-key")===env.ADMIN_PASSWORD;
export async function getCatalog(env){
  if(env.DB){try{const v=await env.DB.get("products","json");if(Array.isArray(v)&&v.length)return v}catch{}}
  return PRODUCTS;
}
// ---- promo codes (saved by the admin in KV under "promos") ----
export async function getPromos(env){
  if(!env.DB)return [];
  try{const v=await env.DB.get("promos","json");return Array.isArray(v)?v:[]}catch{return []}
}
export const cleanPromo=p=>({
  code:String(p.code||"").toUpperCase().replace(/[^A-Z0-9_-]/g,"").slice(0,20),
  type:p.type==="fixed"?"fixed":"percent",
  value:Math.min(p.type==="fixed"?100000:100,Math.max(0,Number(p.value)||0)),
  min:Math.max(0,Number(p.min)||0),max:p.max?Math.max(0,Number(p.max)||0)||null:null,
  expires:/^\d{4}-\d{2}-\d{2}$/.test(p.expires||"")?p.expires:null,
  limit:p.limit?Math.max(0,Math.floor(Number(p.limit)))||null:null,
  used:Math.max(0,Math.floor(Number(p.used)||0)),active:p.active!==false});
// returns {ok:true,discount} or {ok:false,error}
export function evalPromo(promo,subtotal,today){
  if(!promo||!promo.active)return {ok:false,error:"invalid"};
  if(promo.expires&&today>promo.expires)return {ok:false,error:"expired"};
  if(promo.limit&&promo.used>=promo.limit)return {ok:false,error:"used-up"};
  if(subtotal<(promo.min||0))return {ok:false,error:"min",min:promo.min};
  let d=promo.type==="percent"?Math.round(subtotal*promo.value/100):promo.value;
  if(promo.max)d=Math.min(d,promo.max);d=Math.min(d,subtotal);
  return d>0?{ok:true,discount:d}:{ok:false,error:"invalid"};
}
const PAYL={cod:"الدفع عند الاستلام",wallet:"محفظة / انستا باي",card:"بطاقة"};
export function orderText(o){
  const lines=o.items.slice(0,20).map(i=>`${i.qty} × ${i.name}${i.weight?` (${i.weight})`:""} = ${i.qty*i.price}`);
  return ["🛒 طلب جديد #"+o.id,"👤 "+o.customer.name,"📞 "+o.customer.phone,"📍 "+o.customer.address,
    o.location?`🗺️ https://www.google.com/maps?q=${o.location.lat},${o.location.lng}`:null,
    o.delivery?.label?"🕒 "+o.delivery.label:null,
    "💳 "+(PAYL[o.pay.method]||o.pay.method)+(o.pay.ref?` (رقم العملية: ${o.pay.ref})`:""),"",...lines,"",
    o.discount>0?`🏷️ كود ${o.promo}: -${o.discount}`:null,o.deliveryFee>0?`🛵 رسوم التوصيل: ${o.deliveryFee}`:null,"💰 الإجمالي: "+o.total+" ج.م"].filter(x=>x!==null).join("\n");
}
// WhatsApp notification through the free CallMeBot service (needs OWNER_PHONE + CALLMEBOT_KEY)
export function notifyUrl(env,text){
  if(!env.CALLMEBOT_KEY||!env.OWNER_PHONE)return null;
  return `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(env.OWNER_PHONE)}&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(env.CALLMEBOT_KEY)}`;
}
// delivery settings saved by the admin (store location, price tiers...), safe defaults when nothing is saved
export async function getDelivery(env){
  let v=null;if(env.DB){try{v=await env.DB.get("delivery","json")}catch{}}
  return cleanDelivery(v);
}
