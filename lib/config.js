// Store settings shared by the app and the server (delivery hours / time slots).
// Change the numbers below to match your working hours.
export const HOURS={open:10,close:23,slotMinutes:120,leadMinutes:60,tz:"Africa/Cairo",daysAhead:2};
const P=n=>String(n).padStart(2,"0");
const fmt=m=>{const h=Math.floor(m/60);return `${h%12||12}:${P(m%60)} ${h<12?"ص":"م"}`};
export const labelOf=id=>{const [h,m]=String(id).split(":").map(Number);const s=h*60+m;return `${fmt(s)} – ${fmt(s+HOURS.slotMinutes)}`};
// current date/time in Cairo, on any device and on the server
export function cairoNow(d=new Date()){
  const p=new Intl.DateTimeFormat("en-CA",{timeZone:HOURS.tz,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hour12:false}).formatToParts(d).reduce((a,x)=>(a[x.type]=x.value,a),{});
  return {date:`${p.year}-${p.month}-${p.day}`,minutes:(Number(p.hour)%24)*60+Number(p.minute)};
}
export const addDays=(s,n)=>{const d=new Date(s+"T12:00:00Z");d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10)};
export function daysList(now=cairoNow()){return [...Array(HOURS.daysAhead)].map((_,i)=>({id:addDays(now.date,i),label:i===0?"اليوم":i===1?"غداً":"بعد غد"}))}
export const dayWord=(day,now=cairoNow())=>(daysList(now).find(x=>x.id===day)||{label:day}).label;
export const isOpenNow=(now=cairoNow())=>now.minutes>=HOURS.open*60&&now.minutes<=HOURS.close*60-30;
// available slots for a day (today's slots must start at least `leadMinutes` from now)
export function slotsFor(day,now=cairoNow()){
  if(day<now.date)return [];
  const earliest=day===now.date?now.minutes+HOURS.leadMinutes:0,out=[];
  for(let m=HOURS.open*60;m+HOURS.slotMinutes<=HOURS.close*60;m+=HOURS.slotMinutes)
    if(m>=earliest)out.push({id:`${P(Math.floor(m/60))}:${P(m%60)}`,label:labelOf(`${Math.floor(m/60)}:${m%60}`)});
  return out;
}
// validates what the customer picked: {day:"2026-10-22",slot:"asap"|"14:00"}
export function checkDelivery(d,now=cairoNow()){
  if(!d||typeof d!=="object")return {ok:false};
  const day=String(d.day||""),slot=String(d.slot||"");
  if(!daysList(now).some(x=>x.id===day))return {ok:false};
  if(slot==="asap"){if(day!==now.date||!isOpenNow(now))return {ok:false};return {ok:true,label:"اليوم، في أقرب وقت (خلال ساعة تقريباً)"}}
  if(!slotsFor(day,now).some(s=>s.id===slot))return {ok:false};
  return {ok:true,label:`${dayWord(day,now)} ${labelOf(slot)}`};
}

// ---- Delivery by distance (Step 2) ----
export const DELIVERY={
  store:{lat:30.84,lng:29.60},       // approximate centre of Borg El Arab. Set the exact place from the admin panel: التوصيل ← حدد مكان المحل
  roadFactor:1.3,                    // straight-line distance × this ≈ the real road distance
  tiers:[{upTo:3,fee:20},{upTo:6,fee:30},{upTo:10,fee:45},{upTo:15,fee:60}],   // sample prices: up to X km = fee in EGP (edit them in the admin panel). Farther than the last tier = no delivery
  freeOver:0,                        // free delivery when the order (after discount) reaches this amount. 0 = off
  requirePin:true                    // the customer must pin the location on the map
};
