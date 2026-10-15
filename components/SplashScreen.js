"use client";
import {useEffect,useState} from "react";

// Launch screen shown once each time the app is opened (browser tab or installed app).
export default function SplashScreen(){
  const [phase,setPhase]=useState("show"); // show -> hide -> gone

  useEffect(()=>{
    let seen=false;
    try{seen=sessionStorage.getItem("splash-seen")==="1";}catch(e){}
    if(seen){setPhase("gone");return;}
    try{sessionStorage.setItem("splash-seen","1");}catch(e){}
    const start=Date.now(),MIN=2200;
    let t1,t2,done=false;
    const finish=()=>{
      if(done)return;done=true;
      const wait=Math.max(0,MIN-(Date.now()-start));
      t1=setTimeout(()=>{setPhase("hide");t2=setTimeout(()=>setPhase("gone"),600);},wait);
    };
    if(document.readyState==="complete")finish();else window.addEventListener("load",finish);
    const safety=setTimeout(finish,4500);
    return()=>{window.removeEventListener("load",finish);clearTimeout(t1);clearTimeout(t2);clearTimeout(safety);};
  },[]);

  if(phase==="gone")return null;
  return(<div aria-hidden="true" className={`splash ${phase==="hide"?"splash-out":""}`}>
    <div className="splash-glow"/>
    <div className="splash-top">
      <img src="/splash/logo.webp" alt="" className="splash-logo" width="180" height="241"/>
      <h1 className="splash-ar">فريش البرج</h1>
      <p className="splash-en">FRESH AL-BURJ</p>
      <p className="splash-tag"><span/>تسوق أسهل .. لحياة أفضل<span/></p>
    </div>
    <img src="/splash/basket.webp" alt="" className="splash-basket" width="320" height="308"/>
    <div className="splash-load"><i className="splash-ring"/><span>جاري التحميل ...</span></div>
  </div>);
}
