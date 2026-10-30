import {json,isAdmin,getCatalog,getPromos,evalPromo,getDelivery,orderText,notifyUrl} from "../../lib/server.js";
import {normPhone,validPhone,validName,validAddress} from "../../lib/validate.js";
import {checkDelivery,cairoNow} from "../../lib/config.js";
import {quote} from "../../lib/delivery.js";
const clip=(v,n)=>String(v??"").trim().slice(0,n);
// POST: a customer places an order (public). Everything is checked and priced again on the server.
export async function onRequestPost(ctx){
  const {request,env}=ctx;
  if(!env.DB)return json({error:"kv-missing"},503);
  let b;try{b=await request.json()}catch{return json({error:"bad-json"},400)}
  if(b.hp)return json({ok:true,id:"X"+Date.now().toString(36).toUpperCase()});          // hidden bot-trap field: pretend success, save nothing
  const c=b.customer||{};const customer={name:clip(c.name,60),phone:normPhone(c.phone),address:clip(c.address,250)};
  if(!validName(customer.name))return json({error:"bad-name"},400);
  if(!validPhone(customer.phone))return json({error:"bad-phone"},400);
  if(!validAddress(customer.address))return json({error:"bad-address"},400);
  const method=["wallet","card"].includes(b.pay?.method)?b.pay.method:"cod";const ref=clip(b.pay?.ref,60);
  if(method==="wallet"&&!ref)return json({error:"missing-ref"},400);
  const now=cairoNow();const del=checkDelivery(b.delivery,now);
  if(!del.ok)return json({error:"slot-invalid"},400);
  const rk="rl:"+customer.phone;const recent=Number(await env.DB.get(rk))||0;           // max 3 orders / 15 minutes per phone number
  if(recent>=3)return json({error:"too-many"},429);
  const cat=await getCatalog(env);const items=[];let subtotal=0;
  for(const it of (Array.isArray(b.items)?b.items:[]).slice(0,60)){
    const p=cat.find(x=>x.id===it.id);const qty=Math.floor(Number(it.qty));
    if(!p||!(qty>=1&&qty<=99))continue;
    items.push({id:p.id,qty,price:p.price,name:p.name.ar,weight:p.weight});subtotal+=p.price*qty;
  }
  if(!items.length)return json({error:"empty"},400);
  let discount=0,promoCode=null,promos=null,pi=-1;const code=clip(b.promo,20).toUpperCase();
  if(code){
    promos=await getPromos(env);pi=promos.findIndex(x=>x.code===code);const r=evalPromo(promos[pi],subtotal,now.date);
    if(!r.ok)return json({error:"promo-"+(r.error||"invalid"),min:r.min},400);
    discount=r.discount;promoCode=code;
  }
  // delivery fee from the pinned location, computed here so the app cannot cheat
  let qf={ok:true,km:null,fee:0},location=null;const dcfg=await getDelivery(env);
  if(dcfg.requirePin||b.location){
    const lo=b.location;if(!lo)return json({error:"no-location"},400);
    qf=quote({lat:Number(lo.lat),lng:Number(lo.lng)},subtotal-discount,dcfg);
    if(!qf.ok)return json({error:qf.error,km:qf.km},400);
    location={lat:Math.round(Number(lo.lat)*1e6)/1e6,lng:Math.round(Number(lo.lng)*1e6)/1e6};
  }
  if(promoCode){promos[pi]={...promos[pi],used:(promos[pi].used||0)+1};await env.DB.put("promos",JSON.stringify(promos))}   // counted only after everything is valid
  const at=Date.now();const id=(at%1e9).toString(36).toUpperCase()+Math.random().toString(36).slice(2,4).toUpperCase();
  const order={id,items,subtotal,discount,promo:promoCode,total:subtotal-discount+qf.fee,deliveryFee:qf.fee,distanceKm:qf.km,location,delivery:{day:b.delivery.day,slot:b.delivery.slot,label:del.label},status:"new",driver:"",at,customer,
    pay:{method,ref,status:method==="cod"?"cod":"pending"}};
  await env.DB.put("ord:"+id,JSON.stringify(order));
  await env.DB.put("order:"+String(9999999999999-at).padStart(13,"0")+":"+id,id);
  await env.DB.put(rk,String(recent+1),{expirationTtl:900});
  const url=notifyUrl(env,orderText(order));
  if(url)ctx.waitUntil(fetch(url).catch(()=>{}));
  return json({ok:true,id,total:order.total,discount,deliveryFee:qf.fee,distanceKm:qf.km,deliveryLabel:del.label,notified:!!url});
}
// GET: admin lists the latest orders
export async function onRequestGet({request,env}){
  if(!isAdmin(request,env))return json({error:"unauthorized"},401);
  if(!env.DB)return json({error:"kv-missing"},503);
  const l=await env.DB.list({prefix:"order:",limit:150});
  const orders=await Promise.all(l.keys.map(async k=>{const id=await env.DB.get(k.name);return id?env.DB.get("ord:"+id,"json"):null}));
  return json({orders:orders.filter(Boolean)});
}
