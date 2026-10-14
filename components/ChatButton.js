import {PAY} from "@/lib/payments";
export default function ChatButton(){
  return <a href={`https://wa.me/${PAY.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
    className="fixed bottom-24 start-4 z-20 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-2xl text-white shadow-lg md:bottom-6">💬</a>;
}
