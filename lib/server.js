// Shared helpers for the Cloudflare Pages Functions in /functions (server side only).
import {PRODUCTS} from "./data.js";
export const STATUSES=["new","preparing","onway","delivered"];
export const json=(d,s=200)=>new Response(JSON.stringify(d),{status:s,headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store"}});
export const isAdmin=(req,env)=>!!env.ADMIN_PASSWORD&&req.headers.get("x-admin-key")===env.ADMIN_PASSWORD;
export async function getCatalog(env){
  if(env.DB){try{const v=await env.DB.get("products","json");if(Array.isArray(v)&&v.length)return v}catch{}}
  return PRODUCTS;
}
const PAYL={cod:"الدفع عند الاستلام",wallet:"محفظة / انستا باي"};
export function orderText(o){
  const lines=o.items.slice(0,20).map(i=>`${i.qty} × ${i.name}${i.weight?` (${i.weight})`:""} = ${i.qty*i.price}`);
  return ["🛒 طلب جديد #"+o.id,"👤 "+o.customer.name,"📞 "+o.customer.phone,"📍 "+o.customer.address,
    "💳 "+(PAYL[o.pay.method]||o.pay.method)+(o.pay.ref?` (رقم العملية: ${o.pay.ref})`:""),"",...lines,"","💰 الإجمالي: "+o.total+" ج.م"].join("\n");
}
// WhatsApp notification through the free CallMeBot service (needs OWNER_PHONE + CALLMEBOT_KEY)
export function notifyUrl(env,text){
  if(!env.CALLMEBOT_KEY||!env.OWNER_PHONE)return null;
  return `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(env.OWNER_PHONE)}&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(env.CALLMEBOT_KEY)}`;
}
