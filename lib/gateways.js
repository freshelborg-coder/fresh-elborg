// Online payment (card / e-wallet gateway). It is OFF until a gateway account exists.
// To turn it on later: 1) set enabled:true  2) add the gateway keys as secrets in Cloudflare  3) finish functions/api/pay/intent.js
export const GATEWAYS={card:{enabled:false,provider:"paymob"}};
