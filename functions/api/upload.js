import {json,isAdmin} from "../../lib/server.js";
// Admin uploads a product photo (already resized by the browser). Stored in KV, served from /api/img/<id>.
export async function onRequestPost({request,env}){
  if(!isAdmin(request,env))return json({error:"unauthorized"},401);
  if(!env.DB)return json({error:"kv-missing"},503);
  const id=(new URL(request.url).searchParams.get("id")||"").replace(/[^a-zA-Z0-9_-]/g,"").slice(0,60);
  if(!id)return json({error:"no-id"},400);
  const ct=request.headers.get("content-type")||"image/jpeg";
  if(!/^image\/(jpeg|png|webp)$/.test(ct))return json({error:"type"},415);
  const buf=await request.arrayBuffer();
  if(!buf.byteLength||buf.byteLength>4*1024*1024)return json({error:"size"},413);
  const v=Date.now().toString(36);
  await env.DB.put("img:"+id,buf,{metadata:{ct,v}});
  return json({ok:true,url:`/api/img/${id}?v=${v}`});
}
