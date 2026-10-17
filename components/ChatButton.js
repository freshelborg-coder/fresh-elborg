"use client";
import {useApp} from "@/lib/store";
import {PAY} from "@/lib/payments";
import {WhatsAppIcon} from "./Icons";
// Opens a WhatsApp chat with the store phone number (PAY.whatsapp in lib/payments.js).
export default function ChatButton(){
  const {lang}=useApp();
  const msg=lang==="ar"?"السلام عليكم، أريد الاستفسار عن منتجات فريش البرج":"Hello, I would like to ask about Fresh Al-Burj products";
  return(<a href={`https://wa.me/${PAY.whatsapp}?text=${encodeURIComponent(msg)}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
    className="fixed bottom-24 start-4 z-20 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg ring-4 ring-white/70 active:scale-95 md:bottom-6"><WhatsAppIcon size={30} color="#fff"/></a>);
}
