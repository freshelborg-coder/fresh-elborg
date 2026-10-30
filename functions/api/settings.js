import {json,isAdmin,getDelivery} from "../../lib/server.js";
import {cleanDelivery} from "../../lib/delivery.js";
// GET (public): delivery settings used by the cart. PUT (admin): save them.
export async function onRequestGet({env}){return json({delivery:await getDelivery(env)})}
export async function onRequestPut({request,env}){
  if(!isAdmin(request,env))return json({error:"unauthorized"},401);
  if(!env.DB)return json({error:"kv-missing"},503);
  let b;try{b=await request.json()}catch{return json({error:"bad-json"},400)}
  const delivery=cleanDelivery(b.delivery);
  await env.DB.put("delivery",JSON.stringify(delivery));
  return json({ok:true,delivery});
}
