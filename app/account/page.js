"use client";
import Link from "next/link";
import {useApp} from "@/lib/store";
export default function Account(){const {t,lang,setLang}=useApp();
  return(<div className="card space-y-3 p-6"><h1 className="text-xl font-extrabold">{t("account")}</h1>
    <button className="btn" onClick={()=>setLang(lang==="ar"?"en":"ar")}>{t("lang")}</button>
    <Link href="/admin" className="block font-bold text-brand underline">{t("admin")}</Link></div>)}
