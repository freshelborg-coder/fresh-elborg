import {json,isAdmin} from "../../../lib/server.js";
import {pushReady,deliver} from "../../../lib/webpush.js";
const clip=(v,n)=>String(v??"").trim().slice(0,n);
// GET (admin): is push set up, and how many devices are subscribed
export async function onRequestGet({request,env}){
  if(!isAdmin(request,env))return json({error:"unauthorized"},401);
  if(!pushReady(env))return json({configured:false,count:0});
  const l=await env.DB.list({prefix:"sub:",limit:1000});
  return json({configured:true,count:l.keys.length,more:!l.list_complete});
}
// POST (admin): send an offer / announcement. Works in small batches (the admin page repeats it with the cursor).
export async function onRequestPost({request,env}){
  if(!isAdmin(request,env))return json({error:"unauthorized"},401);
  if(!pushReady(env))return json({error:"not-configured"},503);
  let b;try{b=await request.json()}catch{return json({error:"bad-json"},400)}
  const title=clip(b.title,60),body=clip(b.body,200);if(!title||!body)return json({error:"empty"},400);
  const url=typeof b.url==="string"&&b.url.startsWith("/")&&!b.url.startsWith("//")?b.url.slice(0,100):"/";
  const msg={title,body,url,tag:"offer"};
  const l=await env.DB.list({prefix:"sub:",limit:20,cursor:b.cursor||undefined});
  let sent=0,failed=0;
  await Promise.all(l.keys.map(async k=>{
    const e=k.metadata&&k.metadata.e;if(!e)return;
    const r=await deliver(env,k.name.slice(4),e,msg);
    if(r.ok)sent++;else failed++;
  }));
  return json({sent,failed,done:l.list_complete,cursor:l.list_complete?null:l.cursor});
}
