// Small helper for talking to the Cloudflare Functions. Never throws: returns {ok,status,data}.
const KEY="fb_admin_key";
export const adminKey=()=>{try{return sessionStorage.getItem(KEY)||""}catch{return ""}};
export const setAdminKey=v=>{try{v?sessionStorage.setItem(KEY,v):sessionStorage.removeItem(KEY)}catch{}};
export async function api(path,{method="GET",body,admin=false,raw=false,headers={}}={}){
  const h={...headers};if(admin)h["x-admin-key"]=adminKey();
  if(body&&!raw)h["content-type"]="application/json";
  try{
    const r=await fetch(path,{method,headers:h,body:raw?body:(body?JSON.stringify(body):undefined),cache:"no-store"});
    let data=null;try{data=await r.json()}catch{}
    return {ok:r.ok,status:r.status,data};
  }catch{return {ok:false,status:0,data:null}}
}
