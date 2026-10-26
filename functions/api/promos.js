import {json,isAdmin,getPromos,cleanPromo} from "../../lib/server.js";
// Admin: list / save the promo codes
export async function onRequestGet({request,env}){
  if(!isAdmin(request,env))return json({error:"unauthorized"},401);
  if(!env.DB)return json({error:"kv-missing"},503);
  return json({promos:await getPromos(env)});
}
export async function onRequestPut({request,env}){
  if(!isAdmin(request,env))return json({error:"unauthorized"},401);
  if(!env.DB)return json({error:"kv-missing"},503);
  let b;try{b=await request.json()}catch{return json({error:"bad-json"},400)}
  if(!Array.isArray(b.promos))return json({error:"bad-promos"},400);
  const old=new Map((await getPromos(env)).map(p=>[p.code,p]));const seen=new Set();
  const clean=b.promos.slice(0,100).map(cleanPromo).filter(p=>p.code&&p.value>0&&!seen.has(p.code)&&seen.add(p.code))
    .map(p=>({...p,used:Math.max(p.used,old.get(p.code)?.used||0)}));          // never lose uses counted while the admin was editing
  await env.DB.put("promos",JSON.stringify(clean));
  return json({ok:true,count:clean.length});
}
