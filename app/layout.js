import "./globals.css";
import {Cairo} from "next/font/google";
import {AppProvider} from "@/lib/store";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import SideMenu from "@/components/SideMenu";
import ChatButton from "@/components/ChatButton";
import CartDrawer from "@/components/CartDrawer";
import InstallPrompt from "@/components/InstallPrompt";
import SplashScreen from "@/components/SplashScreen";
const cairo=Cairo({subsets:["arabic","latin"],display:"swap",variable:"--font-cairo"});
export const metadata={title:"فريش البرج | Fresh AlBurj",description:"Food & frozen delivery",
  manifest:"/manifest.webmanifest",
  icons:{icon:[{url:"/icons/favicon.ico"},{url:"/icons/favicon-32.png",sizes:"32x32",type:"image/png"},{url:"/icons/icon-192.png",sizes:"192x192",type:"image/png"}],apple:"/icons/apple-touch-icon.png"},
  appleWebApp:{capable:true,title:"فريش البرج",statusBarStyle:"default"}};
export const viewport={themeColor:"#12508F",width:"device-width",initialScale:1};
export default function RootLayout({children}){
  return(<html lang="ar" dir="rtl" className={cairo.variable}><body className="font-sans">
    <SplashScreen/><AppProvider><Header/><main className="mx-auto max-w-5xl px-4 py-4">{children}</main><CartDrawer/><SideMenu/><ChatButton/><InstallPrompt/><BottomNav/></AppProvider>
  </body></html>);
}
