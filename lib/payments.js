import {GATEWAYS} from "./gateways";
// EDIT THESE with your real numbers/links
export const PAY={wallet:"201011411026",instapay:"fresh-alburj@instapay",whatsapp:"201011411026",
  facebook:"https://www.facebook.com/mozzarelfreshburjalarab/",
  channel:"https://whatsapp.com/channel/0029Vah36w92v1It73usoV2A"};
// card stays disabled until the online gateway is switched on in lib/gateways.js
export const METHODS=[{id:"cod",e:"💵"},{id:"wallet",e:"📱"},{id:"card",e:"💳",off:!GATEWAYS.card.enabled}];
