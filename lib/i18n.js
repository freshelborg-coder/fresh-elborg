export const DICT={
ar:{brand:"فريش البرج",loc:"الإسكندرية",search:"ابحث عن منتج...",cart:"السلة",empty:"السلة فارغة",total:"الإجمالي",checkout:"تأكيد الطلب",home:"الرئيسية",track:"تتبع الطلب",account:"حسابي",best:"الأكثر مبيعاً",cats:"الأقسام",add:"إضافة للسلة",cur:"ج.م",
cheese:"الجبن",sauces:"الصوصات",meats:"اللحوم ومصنعاتها",pastries:"المعجنات",sweets:"حلويات",offers:"عروض",all:"الكل",
new:"جديد",preparing:"قيد التحضير",onway:"في الطريق",delivered:"تم التسليم",noOrder:"لا يوجد طلب حالي",
s1:"عروض الجبن الطازجة",s2:"مجمدات بجودة المطاعم",s3:"توصيل سريع لباب بيتك",
admin:"لوحة الإدارة",pass:"كلمة المرور",login:"دخول",today:"مبيعات اليوم",newOrders:"طلبات جديدة",prices:"إدارة الأسعار",orders:"إدارة الطلبات",driver:"المندوب",none:"بدون",product:"المنتج",price:"السعر",lang:"EN",logout:"خروج",bad:"كلمة مرور خاطئة"},
en:{brand:"Fresh AlBurj",loc:"Alexandria",search:"Search products...",cart:"Cart",empty:"Your cart is empty",total:"Total",checkout:"Place order",home:"Home",track:"Track",account:"Account",best:"Best Sellers",cats:"Categories",add:"Add to cart",cur:"EGP",
cheese:"Cheese",sauces:"Sauces",meats:"Meats",pastries:"Pastries",sweets:"Sweets",offers:"Offers",all:"All",
new:"New",preparing:"Preparing",onway:"On the way",delivered:"Delivered",noOrder:"No active order",
s1:"Fresh cheese deals",s2:"Restaurant-grade frozen foods",s3:"Fast delivery to your door",
admin:"Admin Dashboard",pass:"Password",login:"Sign in",today:"Today's sales",newOrders:"New orders",prices:"Price Management",orders:"Order Management",driver:"Driver",none:"None",product:"Product",price:"Price",lang:"عربي",logout:"Logout",bad:"Wrong password"}};
const X={
ar:{menu:"تصفح الخيارات",store:"المتجر",offers:"العروض",about:"من نحن",contact:"اتصل بنا",strip:"منتجات طازجة ومجمدة بأفضل سعر — توصيل سريع لباب بيتك",name:"الاسم",phone:"رقم الهاتف",address:"عنوان التوصيل",pay:"طريقة الدفع",cod:"الدفع عند الاستلام",wallet:"محفظة إلكترونية / انستا باي",card:"بطاقة بنكية",cardSoon:"قريباً (يتطلب ربط بوابة دفع)",transfer:"حوّل المبلغ إلى",refNo:"رقم العملية أو رقم المحوِّل",fill:"من فضلك أكمل البيانات المطلوبة",payPending:"بانتظار التحقق",paid:"تم الدفع",codS:"عند الاستلام",img:"رابط الصورة",aboutT:"فريش البرج متخصصة في الأغذية الطازجة والمجمدة بجودة عالية وأسعار منافسة.",contactT:"تواصل معنا على واتساب لأي استفسار أو طلب خاص.",wa:"واتساب"},
en:{menu:"Browse",store:"Store",offers:"Offers",about:"About us",contact:"Contact us",strip:"Fresh & frozen food at the best price — fast delivery",name:"Name",phone:"Phone",address:"Delivery address",pay:"Payment method",cod:"Cash on delivery",wallet:"E-wallet / InstaPay",card:"Bank card",cardSoon:"Coming soon (needs a payment gateway)",transfer:"Transfer the amount to",refNo:"Transaction or sender number",fill:"Please fill in the required fields",payPending:"Pending verification",paid:"Paid",codS:"On delivery",img:"Image URL",aboutT:"Fresh AlBurj specializes in quality fresh and frozen food at competitive prices.",contactT:"Message us on WhatsApp for any question or special order.",wa:"WhatsApp"}};
for(const l in X)Object.assign(DICT[l],X[l]);
const X2={
ar:{strip:"منتجاتنا الطازجة والمجمدة بأفضل سعر — توصيل سريع لباب بيتك",viewAll:"عرض الكل",hello:"السلام عليكم 👋 كيف نقدر نساعدك؟",chatSub:"خدمة العملاء جاهزين لمساعدتك",contactVia:"تواصل معنا عبر",fb:"صفحة فيسبوك",wch:"قناة واتساب"},
en:{strip:"Our fresh & frozen products at the best price — fast delivery to your door",viewAll:"View all",hello:"Hello 👋 How can we help you?",chatSub:"Customer service is here to help",contactVia:"Contact us via",fb:"Facebook page",wch:"WhatsApp channel"}};
for(const l in X2)Object.assign(DICT[l],X2[l]);
