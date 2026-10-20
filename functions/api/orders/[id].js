import {json,isAdmin,STATUSES} from "../../../lib/server.js";
// GET: the customer's tracking page asks for the status (no personal data returned)
export async function onRequestGet({params,env}){
  if(!env.DB)return json({error:"kv-missing"},503);
  const o=await env.DB.get("ord:"+params.id,"json");if(!o)return json({error:"not-found"},404);
  return json({id:o.id,status:o.status,driver:o.driver,payStatus:o.pay?.status});
}
// PATCH: admin changes status / driver / payment status
export async function onRequestPatch({request,params,env}){
  if(!isAdmin(request,env))return json({error:"unauthorized"},401);
  if(!env.DB)return json({error:"kv-missing"},503);
  const o=await env.DB.get("ord:"+params.id,"json");if(!o)return json({error:"not-found"},404);
  let b;try{b=await request.json()}catch{return json({error:"bad-json"},400)}
  if(STATUSES.includes(b.status))o.status=b.status;
  if(typeof b.driver==="string")o.driver=b.driver.slice(0,40);
  if(["cod","pending","paid"].includes(b.payStatus))o.pay={...o.pay,status:b.payStatus};
  await env.DB.put("ord:"+params.id,JSON.stringify(o));
  return json({ok:true});
}
