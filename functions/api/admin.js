import {json,isAdmin,notifyUrl,notifyTelegram,telegramReady} from "../../lib/server.js";
// GET: checks the admin password and reports what is configured. POST: sends a test message (WhatsApp and/or Telegram).
export async function onRequestGet({request,env}){
  if(!env.ADMIN_PASSWORD)return json({error:"no-password"},500);
  if(!isAdmin(request,env))return json({error:"unauthorized"},401);
  const whatsapp=!!(env.CALLMEBOT_KEY&&env.OWNER_PHONE),telegram=telegramReady(env);
  return json({ok:true,kv:!!env.DB,notify:whatsapp||telegram,whatsapp,telegram});
}
export async function onRequestPost({request,env}){
  if(!isAdmin(request,env))return json({error:"unauthorized"},401);
  const text="✅ اختبار: إشعارات فريش البرج شغالة";
  const url=notifyUrl(env,text),tg=notifyTelegram(env,text);
  if(!url&&!tg)return json({error:"not-configured"},400);
  let ok=false;
  if(url){try{const r=await fetch(url);ok=ok||r.ok}catch{}}
  if(tg){try{const r=await tg;ok=ok||r.ok}catch{}}
  return json({ok},ok?200:502);
}
