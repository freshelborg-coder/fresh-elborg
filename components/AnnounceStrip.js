"use client";
import {useApp} from "@/lib/store";
export default function AnnounceStrip(){const {t}=useApp();return <div className="rounded-xl bg-brand-dark px-3 py-2 text-center text-sm font-semibold text-white">{t("strip")}</div>}
