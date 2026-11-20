import {json} from "../../lib/server.js";
import {okEndpoint,hashEndpoint,pushReady} from "../../lib/webpush.js";
// GET (public): the public key the browser needs, or null when push is not set up yet.
export async function onRequestGet({env}){return json({key:pushReady(env)?env.VAPID_PUBLIC:null})}
// POST (public): a device subscribes. With an orderId it also gets that order's status notifications.
export async function onRequestPost({request,env}){
  if(!pushReady(env))return json({error:"not-configured"},503);
  let b;try{b=await request.json()}catch{return json({error:"bad-json"},400)}
  const e=String(b.endpoint||"");if(!okEndpoint(e))return json({error:"bad-endpoint"},400);
  const h=await hashEndpoint(e);
  if(!(await env.DB.get("sub:"+h)))await env.DB.put("sub:"+h,"1",{metadata:{e}});
  const id=String(b.orderId||"").replace(/[^a-zA-Z0-9]/g,"").slice(0,20);
  if(id&&(await env.DB.get("ord:"+id)))await env.DB.put("os:"+id+":"+h,"1",{metadata:{e},expirationTtl:2592000});
  return json({ok:true});
}
