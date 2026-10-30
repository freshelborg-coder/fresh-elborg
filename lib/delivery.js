// Distance + delivery fee. Used by the cart (to show the price) and by the server (to charge it).
import {DELIVERY} from "./config.js";
export const inEgypt=(lat,lng)=>lat>=21.5&&lat<=31.9&&lng>=24.5&&lng<=37;
export function distanceKm(a,b){
  const R=6371,r=x=>x*Math.PI/180,dLa=r(b.lat-a.lat),dLo=r(b.lng-a.lng);
  const h=Math.sin(dLa/2)**2+Math.cos(r(a.lat))*Math.cos(r(b.lat))*Math.sin(dLo/2)**2;
  return 2*R*Math.asin(Math.sqrt(h));
}
// loc={lat,lng}; payable = order amount after discount (for the free-delivery rule)
export function quote(loc,payable=0,cfg=DELIVERY){
  if(!loc||typeof loc.lat!=="number"||typeof loc.lng!=="number"||!isFinite(loc.lat)||!isFinite(loc.lng)||!inEgypt(loc.lat,loc.lng))return {ok:false,error:"bad-location"};
  const km=distanceKm(cfg.store,loc)*cfg.roadFactor,shown=Math.round(km*10)/10;
  const tier=cfg.tiers.find(t=>km<=t.upTo);
  if(!tier)return {ok:false,error:"out-of-range",km:shown};
  const free=cfg.freeOver>0&&payable>=cfg.freeOver;
  return {ok:true,km:shown,fee:free?0:tier.fee,free};
}

// makes any saved/received settings safe to use (falls back to the defaults for anything invalid)
export function cleanDelivery(d){
  const st=d&&d.store,lat=Number(st&&st.lat),lng=Number(st&&st.lng);
  const tiers=(Array.isArray(d&&d.tiers)?d.tiers:[]).map(t=>({upTo:Number(t.upTo),fee:Number(t.fee)}))
    .filter(t=>t.upTo>0&&t.upTo<=300&&t.fee>=0&&t.fee<=10000).sort((a,b)=>a.upTo-b.upTo).slice(0,12);
  const rf=Number(d&&d.roadFactor);
  return {store:isFinite(lat)&&isFinite(lng)&&inEgypt(lat,lng)?{lat,lng}:DELIVERY.store,
    roadFactor:rf>=1&&rf<=2?rf:DELIVERY.roadFactor,tiers:tiers.length?tiers:DELIVERY.tiers,
    freeOver:Math.max(0,Number(d&&d.freeOver)||0),requirePin:!(d&&d.requirePin===false)};
}
