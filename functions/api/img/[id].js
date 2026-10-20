export async function onRequestGet({params,env}){
  if(!env.DB)return new Response("kv-missing",{status:503});
  const id=String(params.id||"").replace(/[^a-zA-Z0-9_-]/g,"");
  const r=await env.DB.getWithMetadata("img:"+id,"arrayBuffer");
  if(!r.value)return new Response("not found",{status:404});
  return new Response(r.value,{headers:{"content-type":r.metadata?.ct||"image/jpeg","cache-control":"public, max-age=31536000, immutable"}});
}
