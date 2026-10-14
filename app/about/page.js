"use client";
import {useApp} from "@/lib/store";
export default function About(){const {t}=useApp();return <div className="card p-6"><h1 className="mb-2 text-xl font-extrabold">{t("about")}</h1><p>{t("aboutT")}</p></div>}
