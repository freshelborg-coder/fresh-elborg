"use client";
import {useApp} from "@/lib/store";
import {PAY} from "@/lib/payments";
// Edit the texts below to change the About page.
const TX={
 ar:{title:"من نحن",tag:"أغذية طازجة ومجمدة بجودة عالية",
  story:"في فريش البرج بنوفر احتياجات بيتك ومطعمك من الأجبان واللحوم ومصنعاتها والصوصات والمعجنات والحلويات، من ماركات معروفة وبأسعار مناسبة، وبنوصلها لحد باب بيتك.",
  whyT:"ليه فريش البرج؟",
  why:[["🧀","تشكيلة كبيرة","أجبان وصوصات ولحوم ومعجنات وحلويات في مكان واحد."],["🏷️","أسعار مناسبة وعروض","عروض مستمرة وخصومات على منتجات مختارة."],["🛵","توصيل سريع","بنوصل طلبك لحد باب البيت وتتابعه خطوة بخطوة."],["💬","تواصل سهل","اسألنا أو اطلب على واتساب في أي وقت."]],
  howT:"إزاي تطلب؟",how:["اختار منتجاتك وضيفها للسلة","اكتب بياناتك واختار الدفع (كاش أو تحويل)","استلم طلبك وتابعه من صفحة «تتبع الطلب»"],
  callT:"تواصل معنا",call:"واتساب",fb:"فيسبوك",ch:"قناة واتساب",phone:"رقم الطلبات"},
 en:{title:"About us",tag:"Fresh & frozen food, top quality",
  story:"At Fresh Al-Burj we bring cheese, meats, sauces, pastries and sweets from well-known brands at fair prices, delivered to your door.",
  whyT:"Why Fresh Al-Burj?",
  why:[["🧀","Wide selection","Cheese, sauces, meats, pastries and sweets in one place."],["🏷️","Fair prices & offers","Ongoing offers and discounts on selected items."],["🛵","Fast delivery","We deliver to your door and you can track every step."],["💬","Easy contact","Ask or order on WhatsApp any time."]],
  howT:"How to order",how:["Pick your products and add them to the cart","Enter your details and choose payment (cash or transfer)","Receive your order and follow it on the «Track» page"],
  callT:"Contact us",call:"WhatsApp",fb:"Facebook",ch:"WhatsApp channel",phone:"Orders phone"}};
export default function About(){
  const {t,lang}=useApp();const x=TX[lang]||TX.ar;
  const phone=PAY.whatsapp.replace(/^20/,"0");
  const btn="rounded-xl px-4 py-2.5 font-bold text-white";
  return(<div className="space-y-5">
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-brand to-brand-dark p-6 text-center text-white">
      <img src="/splash/logo.webp" alt="" width="120" height="161" className="mx-auto h-28 w-auto"/>
      <h1 className="mt-3 text-2xl font-extrabold">{t("brand")}</h1><p className="mt-1 text-white/85">{x.tag}</p></section>
    <section className="card p-5"><h2 className="mb-2 text-lg font-extrabold">{x.title}</h2><p className="leading-8 text-ink/80">{x.story}</p></section>
    <section><h2 className="mb-3 border-s-4 border-brand ps-2 text-lg font-extrabold">{x.whyT}</h2>
      <div className="grid grid-cols-2 gap-3">{x.why.map(([e,h,d])=><div key={h} className="card p-4"><div className="text-3xl">{e}</div><div className="mt-1 font-extrabold">{h}</div><p className="mt-1 text-sm text-ink/70">{d}</p></div>)}</div></section>
    <section className="card p-5"><h2 className="mb-3 text-lg font-extrabold">{x.howT}</h2>
      <ol className="space-y-3">{x.how.map((s,i)=><li key={i} className="flex items-center gap-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand font-bold text-white">{i+1}</span><span>{s}</span></li>)}</ol></section>
    <section className="card space-y-3 p-5"><h2 className="text-lg font-extrabold">{x.callT}</h2>
      <p className="text-sm text-ink/70">{x.phone}: <b dir="ltr">{phone}</b></p>
      <div className="flex flex-wrap gap-2">
        <a className={btn} style={{background:"#25D366"}} href={`https://wa.me/${PAY.whatsapp}`} target="_blank" rel="noopener noreferrer">{x.call}</a>
        <a className={btn} style={{background:"#1877F2"}} href={PAY.facebook} target="_blank" rel="noopener noreferrer">{x.fb}</a>
        <a className={btn} style={{background:"#128C7E"}} href={PAY.channel} target="_blank" rel="noopener noreferrer">{x.ch}</a></div></section>
  </div>);
}
