import {json,isAdmin} from "../../lib/server.js";
// GET: the catalogue saved by the admin (null = use the built-in list). PUT: admin saves the whole catalogue.
export async function onRequestGet({env}){
  let custom=null;if(env.DB){try{custom=await env.DB.get("products","json")}catch{}}
  return json({products:Array.isArray(custom)&&custom.length?custom:null});
}
export async function onRequestPut({request,env}){
  if(!isAdmin(request,env))return json({error:"unauthorized"},401);
  if(!env.DB)return json({error:"kv-missing"},503);
  let b;try{b=await request.json()}catch{return json({error:"bad-json"},400)}
  if(!Array.isArray(b.products))return json({error:"bad-products"},400);
  const s=(v,n)=>String(v??"").slice(0,n);
  const clean=b.products.slice(0,500).map(p=>({id:s(p.id,60),name:{ar:s(p.name?.ar,120),en:s(p.name?.en||p.name?.ar,120)},cat:s(p.cat||"offers",20),
    weight:s(p.weight,60),price:Math.max(0,Number(p.price)||0),old:p.old?Math.max(0,Number(p.old)||0):null,sold:Number(p.sold)||0,img:s(p.img,200),e:s(p.e||"🛒",8)})).filter(p=>p.id&&p.name.ar);
  await env.DB.put("products",JSON.stringify(clean));
  return json({ok:true,count:clean.length});
}
