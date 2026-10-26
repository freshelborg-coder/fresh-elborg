// Distance + delivery fee. Used by the cart (to show the price) and by the server (to charge it).
import {DELIVERY} from "./config.js";
export const inEgypt=(lat,lng)=>lat>=21.5&&lat<=31.9&&lng>=24.5&&lng<=37;
export function distanceKm(a,b){
  const R=6371,r=x=>x*Math.PI/180,dLa=r(b.lat-a.lat),dLo=r(b.lng-a.lng);
  const h=Math.sin(dLa/2)**2+Math.cos(r(a.lat))*Math.cos(r(b.lat))*Math.sin(dLo/2)**2;
  return 2*R*Math.asin(Math.sqrt(h));
}
// loc={lat,lng}; payable = order amount after discount (for the free-delivery rule)
export function quote(loc,payable=0){
  if(!loc||typeof loc.lat!=="number"||typeof loc.lng!=="number"||!isFinite(loc.lat)||!isFinite(loc.lng)||!inEgypt(loc.lat,loc.lng))return {ok:false,error:"bad-location"};
  const km=distanceKm(DELIVERY.store,loc)*DELIVERY.roadFactor,shown=Math.round(km*10)/10;
  const tier=DELIVERY.tiers.find(t=>km<=t.upTo);
  if(!tier)return {ok:false,error:"out-of-range",km:shown};
  const free=DELIVERY.freeOver>0&&payable>=DELIVERY.freeOver;
  return {ok:true,km:shown,fee:free?0:tier.fee,free};
}
