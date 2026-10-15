"use client";
import {useApp} from "@/lib/store";
export default function AnnounceStrip(){
  const {t}=useApp();
  const half=<div className="flex shrink-0">{[0,1,2,3].map(i=><span key={i} className="whitespace-nowrap px-8 text-sm font-semibold">{t("strip")} ✦</span>)}</div>;
  return <div className="mq rounded-xl bg-brand-dark py-2.5 text-white" role="marquee" aria-label={t("strip")}><div className="mq-track" aria-hidden="true" style={{"--d":"30s"}}>{half}{half}</div></div>;
}
