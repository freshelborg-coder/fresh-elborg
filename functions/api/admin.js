import {json,isAdmin,notifyUrl} from "../../lib/server.js";
// GET: checks the admin password and reports what is configured. POST: sends a test WhatsApp message.
export async function onRequestGet({request,env}){
  if(!env.ADMIN_PASSWORD)return json({error:"no-password"},500);
  if(!isAdmin(request,env))return json({error:"unauthorized"},401);
  return json({ok:true,kv:!!env.DB,notify:!!(env.CALLMEBOT_KEY&&env.OWNER_PHONE)});
}
export async function onRequestPost({request,env}){
  if(!isAdmin(request,env))return json({error:"unauthorized"},401);
  const url=notifyUrl(env,"✅ اختبار: إشعارات فريش البرج شغالة");
  if(!url)return json({error:"not-configured"},400);
  try{const r=await fetch(url);return json({ok:r.ok,status:r.status})}catch{return json({ok:false},502)}
}
