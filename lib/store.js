"use client";
import {createContext,useContext,useEffect,useState,useCallback} from "react";
import {DICT} from "./i18n";
import {PRODUCTS} from "./data";
import {api} from "./api";
import {GATEWAYS} from "./gateways";
const Ctx=createContext(null);
export const useApp=()=>useContext(Ctx);
const load=(k,d)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch{return d}};
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}};
export function AppProvider({children}){
  const [ready,setReady]=useState(false);
  const [lang,setLang]=useState("ar");
  const [products,setProducts]=useState(PRODUCTS);
  const [orders,setOrders]=useState([]);
  const [cart,setCart]=useState({});
  const [cartOpen,setCartOpen]=useState(false);
  const [myOrder,setMyOrder]=useState(null);
  const [cat,setCat]=useState("all");const [viewing,setViewing]=useState(null);const [menuOpen,setMenuOpen]=useState(false);
  const sync=useCallback(()=>{setLang(load("fb_lang","ar"));setProducts(load("fb_products_v3",PRODUCTS));setOrders(load("fb_orders_v4",[]));setCart(load("fb_cart_v2",{}));setMyOrder(load("fb_my_v2",null))},[]);
  useEffect(()=>{sync();setReady(true);window.addEventListener("storage",sync);return()=>window.removeEventListener("storage",sync)},[sync]);
  useEffect(()=>{if(!ready)return;save("fb_lang",lang);save("fb_products_v3",products);save("fb_orders_v4",orders);save("fb_cart_v2",cart);save("fb_my_v2",myOrder)},[ready,lang,products,orders,cart,myOrder]);
  useEffect(()=>{document.documentElement.lang=lang;document.documentElement.dir=lang==="ar"?"rtl":"ltr"},[lang]);
  const t=k=>DICT[lang][k]||k;
  const add=id=>setCart(c=>({...c,[id]:(c[id]||0)+1}));
  const addN=(id,n)=>setCart(c=>({...c,[id]:(c[id]||0)+n}));
  const dec=id=>setCart(c=>{const n={...c,[id]:(c[id]||0)-1};if(n[id]<=0)delete n[id];return n});
  const lines=Object.keys(cart).map(id=>{const p=products.find(x=>x.id==id);return{p,qty:cart[id]}});
  const total=lines.reduce((s,l)=>s+l.p.price*l.qty,0);
  const count=lines.reduce((s,l)=>s+l.qty,0);
  const checkout=async d=>{
    if(!lines.length)return null;
    const customer={name:d.name,phone:d.phone,address:d.address};const discount=d.discount||0;
    const local={items:lines.map(l=>({id:l.p.id,qty:l.qty,price:l.p.price,name:l.p.name.ar,weight:l.p.weight})),subtotal:total,discount,promo:d.promo||null,total:Math.max(0,total-discount),
      delivery:d.delivery,status:"new",driver:"",at:Date.now(),customer,pay:{method:d.method,ref:d.ref||"",status:d.method==="cod"?"cod":"pending"}};
    // the server re-checks everything (phone, slot, promo, prices). A clear refusal comes back as {error}; if the server is simply not set up we keep the order on this device.
    const r=await api("/api/orders",{method:"POST",body:{items:lines.map(l=>({id:l.p.id,qty:l.qty})),customer,pay:{method:d.method,ref:d.ref||""},
      delivery:{day:d.delivery?.day,slot:d.delivery?.slot},promo:d.promo||"",hp:d.hp||""}});
    if(!r.ok&&r.status>=400&&r.status<500&&r.data?.error)return {error:r.data.error,min:r.data.min};
    const synced=!!(r.ok&&r.data&&r.data.id);const id=synced?r.data.id:String(Date.now()%1000000);
    const order={...local,id,synced,...(synced?{total:r.data.total??local.total,discount:r.data.discount??discount,delivery:{...local.delivery,label:r.data.deliveryLabel||local.delivery?.label}}:{})};
    setOrders(o=>[order,...o]);setMyOrder(id);setCart({});setCartOpen(false);
    // online payment: only when the gateway is switched on (lib/gateways.js)
    if(synced&&d.method==="card"&&GATEWAYS.card.enabled){const pr=await api("/api/pay/intent",{method:"POST",body:{orderId:id}});if(pr.ok&&pr.data?.url)window.location.href=pr.data.url}
    return id;
  };
  const setProduct=(id,patch)=>setProducts(ps=>ps.map(p=>p.id===id?{...p,...patch}:p));
  const setPrice=(id,price)=>setProduct(id,{price:Math.max(0,Number(price)||0)});
  const updateOrder=(id,patch)=>setOrders(os=>os.map(o=>o.id===id?{...o,...patch}:o));
  // products saved by the admin on the server replace the built-in list for every visitor
  useEffect(()=>{let off=false;(async()=>{const r=await api("/api/products");if(!off&&r.ok&&r.data)setProducts(Array.isArray(r.data.products)&&r.data.products.length?r.data.products:PRODUCTS)})();return()=>{off=true}},[]);
  // keep the customer's order status fresh while the tracking page / app is open
  useEffect(()=>{
    if(!myOrder)return;let off=false;
    const tick=async()=>{const r=await api("/api/orders/"+myOrder);if(off||!r.ok||!r.data)return;
      setOrders(os=>os.map(o=>String(o.id)===String(myOrder)?{...o,status:r.data.status,driver:r.data.driver,synced:true,pay:{...o.pay,status:r.data.payStatus||o.pay?.status}}:o))};
    tick();const iv=setInterval(tick,20000);return()=>{off=true;clearInterval(iv)};
  },[myOrder]);
  return <Ctx.Provider value={{lang,setLang,t,products,orders,cart,lines,total,count,add,dec,cartOpen,setCartOpen,checkout,myOrder,setPrice,setProduct,setProducts,addN,viewing,setViewing,cat,setCat,menuOpen,setMenuOpen,updateOrder}}>{children}</Ctx.Provider>;
}
