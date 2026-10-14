import "./globals.css";
import {Cairo} from "next/font/google";
import {AppProvider} from "@/lib/store";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import SideMenu from "@/components/SideMenu";
import ChatButton from "@/components/ChatButton";
import CartDrawer from "@/components/CartDrawer";
const cairo=Cairo({subsets:["arabic","latin"],display:"swap",variable:"--font-cairo"});
export const metadata={title:"فريش البرج | Fresh AlBurj",description:"Food & frozen delivery"};
export default function RootLayout({children}){
  return(<html lang="ar" dir="rtl" className={cairo.variable}><body className="font-sans">
    <AppProvider><Header/><main className="mx-auto max-w-5xl px-4 py-4">{children}</main><CartDrawer/><SideMenu/><ChatButton/><BottomNav/></AppProvider>
  </body></html>);
}
