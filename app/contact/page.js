"use client";
import {useApp} from "@/lib/store";
import {PAY} from "@/lib/payments";
export default function Contact(){const {t}=useApp();return <div className="card space-y-3 p-6"><h1 className="text-xl font-extrabold">{t("contact")}</h1><p>{t("contactT")}</p>
  <a className="btn inline-block" href={`https://wa.me/${PAY.whatsapp}`} target="_blank" rel="noopener noreferrer">{t("wa")}</a></div>}
