import {json} from "../../../lib/server.js";
// PLACEHOLDER for online payment (card / e-wallet gateway). Not active yet.
// When a gateway account is ready (e.g. Paymob): 1) load the order  2) create the payment for order.total on the gateway
// 3) return {url} of the hosted payment page  4) add a webhook endpoint that marks the order as paid.
export async function onRequestPost({env}){
  if(!env.PAYMOB_API_KEY)return json({error:"gateway-not-configured"},501);
  return json({error:"not-implemented"},501);
}
