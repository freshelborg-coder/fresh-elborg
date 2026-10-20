import {json,isAdmin,getCatalog,orderText,notifyUrl} from "../../lib/server.js";
const clip=(v,n)=>String(v??"").trim().slice(0,n);
// POST: a customer places an order (public). Prices are re-read on the server, so they cannot be tampered with.
export async function onRequestPost(ctx){
  const {request,env}=ctx;
  if(!env.DB)return json({error:"kv-missing"},503);
  let b;try{b=await request.json()}catch{return json({error:"bad-json"},400)}
  const c=b.customer||{};const customer={name:clip(c.name,80),phone:clip(c.phone,30),address:clip(c.address,250)};
  const method=b.pay?.method==="wallet"?"wallet":"cod";const ref=clip(b.pay?.ref,60);
  if(!customer.name||!customer.phone||!customer.address)return json({error:"missing"},400);
  if(method==="wallet"&&!ref)return json({error:"missing-ref"},400);
  const cat=await getCatalog(env);const items=[];let total=0;
  for(const it of (Array.isArray(b.items)?b.items:[]).slice(0,60)){
    const p=cat.find(x=>x.id===it.id);const qty=Math.floor(Number(it.qty));
    if(!p||!(qty>=1&&qty<=99))continue;
    items.push({id:p.id,qty,price:p.price,name:p.name.ar,weight:p.weight});total+=p.price*qty;
  }
  if(!items.length)return json({error:"empty"},400);
  const at=Date.now();const id=(at%1e9).toString(36).toUpperCase()+Math.random().toString(36).slice(2,4).toUpperCase();
  const order={id,items,total,status:"new",driver:"",at,customer,pay:{method,ref,status:method==="cod"?"cod":"pending"}};
  await env.DB.put("ord:"+id,JSON.stringify(order));
  await env.DB.put("order:"+String(9999999999999-at).padStart(13,"0")+":"+id,id);      // newest first when listed
  const url=notifyUrl(env,orderText(order));
  if(url)ctx.waitUntil(fetch(url).catch(()=>{}));
  return json({ok:true,id,notified:!!url});
}
// GET: admin lists the latest orders
export async function onRequestGet({request,env}){
  if(!isAdmin(request,env))return json({error:"unauthorized"},401);
  if(!env.DB)return json({error:"kv-missing"},503);
  const l=await env.DB.list({prefix:"order:",limit:150});
  const orders=await Promise.all(l.keys.map(async k=>{const id=await env.DB.get(k.name);return id?env.DB.get("ord:"+id,"json"):null}));
  return json({orders:orders.filter(Boolean)});
}
