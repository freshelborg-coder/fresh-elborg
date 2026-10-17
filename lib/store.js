"use client";
import {createContext,useContext,useEffect,useState,useCallback} from "react";
import {DICT} from "./i18n";
import {PRODUCTS,SEED_ORDERS} from "./data";
const Ctx=createContext(null);
export const useApp=()=>useContext(Ctx);
const load=(k,d)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch{return d}};
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}};
export function AppProvider({children}){
  const [ready,setReady]=useState(false);
  const [lang,setLang]=useState("ar");
  const [products,setProducts]=useState(PRODUCTS);
  const [orders,setOrders]=useState(SEED_ORDERS);
  const [cart,setCart]=useState({});
  const [cartOpen,setCartOpen]=useState(false);
  const [myOrder,setMyOrder]=useState(null);
  const [cat,setCat]=useState("all");const [viewing,setViewing]=useState(null);const [menuOpen,setMenuOpen]=useState(false);
  const sync=useCallback(()=>{setLang(load("fb_lang","ar"));setProducts(load("fb_products_v3",PRODUCTS));setOrders(load("fb_orders_v3",SEED_ORDERS));setCart(load("fb_cart_v2",{}));setMyOrder(load("fb_my_v2",null))},[]);
  useEffect(()=>{sync();setReady(true);window.addEventListener("storage",sync);return()=>window.removeEventListener("storage",sync)},[sync]);
  useEffect(()=>{if(!ready)return;save("fb_lang",lang);save("fb_products_v3",products);save("fb_orders_v3",orders);save("fb_cart_v2",cart);save("fb_my_v2",myOrder)},[ready,lang,products,orders,cart,myOrder]);
  useEffect(()=>{document.documentElement.lang=lang;document.documentElement.dir=lang==="ar"?"rtl":"ltr"},[lang]);
  const t=k=>DICT[lang][k]||k;
  const add=id=>setCart(c=>({...c,[id]:(c[id]||0)+1}));
  const addN=(id,n)=>setCart(c=>({...c,[id]:(c[id]||0)+n}));
  const dec=id=>setCart(c=>{const n={...c,[id]:(c[id]||0)-1};if(n[id]<=0)delete n[id];return n});
  const lines=Object.keys(cart).map(id=>{const p=products.find(x=>x.id==id);return{p,qty:cart[id]}});
  const total=lines.reduce((s,l)=>s+l.p.price*l.qty,0);
  const count=lines.reduce((s,l)=>s+l.qty,0);
  const checkout=d=>{if(!lines.length)return null;const id=Date.now()%100000;
    setOrders(o=>[{id,items:lines.map(l=>({id:l.p.id,qty:l.qty,price:l.p.price})),total,status:"new",driver:"",at:Date.now(),
      customer:{name:d.name,phone:d.phone,address:d.address},pay:{method:d.method,ref:d.ref||"",status:d.method==="cod"?"cod":"pending"}},...o]);
    setMyOrder(id);setCart({});setCartOpen(false);return id};
  const setProduct=(id,patch)=>setProducts(ps=>ps.map(p=>p.id===id?{...p,...patch}:p));
  const setPrice=(id,price)=>setProduct(id,{price:Math.max(0,Number(price)||0)});
  const updateOrder=(id,patch)=>setOrders(os=>os.map(o=>o.id===id?{...o,...patch}:o));
  return <Ctx.Provider value={{lang,setLang,t,products,orders,cart,lines,total,count,add,dec,cartOpen,setCartOpen,checkout,myOrder,setPrice,setProduct,addN,viewing,setViewing,cat,setCat,menuOpen,setMenuOpen,updateOrder}}>{children}</Ctx.Provider>;
}
