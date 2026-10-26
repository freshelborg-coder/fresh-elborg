import {json,getCatalog,getPromos,evalPromo} from "../../lib/server.js";
import {cairoNow} from "../../lib/config.js";
// POST {code,items}: tells the cart if a promo code is valid and how much it takes off (public, computed on the server)
export async function onRequestPost({request,env}){
  let b;try{b=await request.json()}catch{return json({error:"bad-json"},400)}
  const code=String(b.code||"").trim().toUpperCase().slice(0,20);if(!code)return json({ok:false,error:"empty"});
  const cat=await getCatalog(env);let sub=0;
  for(const it of (Array.isArray(b.items)?b.items:[]).slice(0,60)){const p=cat.find(x=>x.id===it.id);const q=Math.floor(Number(it.qty));if(p&&q>=1&&q<=99)sub+=p.price*q}
  const promo=(await getPromos(env)).find(x=>x.code===code);
  const r=evalPromo(promo,sub,cairoNow().date);
  return json(r.ok?{ok:true,code,discount:r.discount,subtotal:sub,total:sub-r.discount}:{ok:false,error:r.error||"invalid",min:r.min});
}
