import {json} from "../../../lib/server.js";
import {okEndpoint,hashEndpoint} from "../../../lib/webpush.js";
// POST (public, called by the service worker when a push arrives): returns the waiting message once.
export async function onRequestPost({request,env}){
  if(!env.DB)return json({});
  let b;try{b=await request.json()}catch{return json({})}
  const e=String(b.endpoint||"");if(!okEndpoint(e))return json({});
  const h=await hashEndpoint(e);
  const m=await env.DB.get("msg:"+h,"json");
  if(!m)return json({});
  await env.DB.delete("msg:"+h);
  return json(m);
}
