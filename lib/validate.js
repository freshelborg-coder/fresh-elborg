// Input checks used by the cart (browser) AND by the server, so fake / mistyped data is rejected in both places.
export function normPhone(p){
  let d=String(p||"").replace(/[\u0660-\u0669]/g,c=>String(c.charCodeAt(0)-0x660)).replace(/[\u06F0-\u06F9]/g,c=>String(c.charCodeAt(0)-0x6F0)).replace(/\D/g,"");
  if(d.startsWith("0020"))d=d.slice(4);else if(d.startsWith("20")&&d.length===12)d=d.slice(2);
  if(d.length===10&&d.startsWith("1"))d="0"+d;
  return d;
}
export const validPhone=p=>/^01[0125]\d{8}$/.test(normPhone(p));          // Egyptian mobile: 010 / 011 / 012 / 015
export const validName=n=>{const s=String(n||"").trim();return s.length<=60&&(s.match(/\p{L}/gu)||[]).length>=2};          // at least 2 real letters (Arabic or English)
export const validAddress=a=>String(a||"").trim().length>=8;
