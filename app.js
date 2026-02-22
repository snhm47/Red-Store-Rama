// app.js (SHOP)

// ======== DOM HELPER (MUST BE FIRST) ========
const $ = (id) => document.getElementById(id);

// ======== FIREBASE ========
import { db } from "./firebase-config.js";
import { SEED_PRODUCTS } from "./products-seed.js";

import {
  collection,
  onSnapshot,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// ======== CONFIG ========
const STORE_NAME = "Red Store";
const STORE_WHATSAPP = "972532415523";
const INSTAGRAM_URL = "https://www.instagram.com/red_store_ramah/";
const WAZE_URL =
  "https://ul.waze.com/ul?place=ChIJXbDQDq4xHBURMSYTp0TbYQ4&ll=32.93647600%2C35.36472470&navigate=yes&utm_campaign=default&utm_source=waze_website&utm_medium=lm_share_location";

const PLACEHOLDER_IMG = "assets/products/placeholder.jpg";

// ======== KEYS ========
const AGE_KEY = "redstore_age_ok_session_v1";
const CART_KEY = "redstore_cart_v3";
const LANG_KEY = "redstore_lang_v1";

// ======== CATEGORY + SUBCATEGORY MODEL ========
const MAIN_CATEGORIES = [
  { id: "all", icon: "🛒", restricted: false },
  { id: "tobacco", icon: "🚬", restricted: true },
  { id: "alcohol", icon: "🥃", restricted: true },
  { id: "snacks", icon: "🍫", restricted: false },
  { id: "coffee", icon: "☕", restricted: false },
];

const SUBCATS = {
  all: [{ id: "all" }],

  tobacco: [
    { id: "all" },
    { id: "cigarettes" },
    { id: "cigars" },
    { id: "hookah_tobacco" },
    { id: "vapes_pods" },
    { id: "rolling_tobacco" },
    { id: "other" },
  ],

  alcohol: [
    { id: "all" },
    { id: "beer" },
    { id: "vodka" },
    { id: "whisky" },
    { id: "arak" },
    { id: "wine" },
    { id: "other" },
  ],

  snacks: [
    { id: "all" },
    { id: "chips" },
    { id: "chocolate" },
    { id: "candy" },
    { id: "nuts" },
    { id: "other" },
  ],

  coffee: [
    { id: "all" },
    { id: "hot" },
    { id: "iced" },
    { id: "beans" },
    { id: "other" },
  ],
};

// ======== TRANSLATIONS ========
const i18n = window.i18n || {
  en: {
    dir: "ltr",
    storeTitle: "Red Store",
    storeSubtitle: "Tobacco • Alcohol • Snacks • Coffee",
    cart: "Cart",

    // Hero v2
    heroKicker: "Red Store • Rameh",
    heroTitle: "Premium Alcohol & Cold Beer — Fast WhatsApp Order",
    heroText: "Choose whisky, vodka, beer and more. Add to cart, then send your order in one tap.",
    shopNow: "Browse shop",
    waOrder: "Order on WhatsApp",
    heroNote: "18+ only • Responsible drinking",

    categories: "Categories",
    catHint: "Swipe on phone • Scroll on desktop",
    shop: "Shop",
    searchPH: "Search products…",

    cartTitle: "Your Cart",
    total: "Total",
    checkout: "Send order via WhatsApp",
    clear: "Clear cart",
    legal: "Restricted items require legal age. By continuing you confirm you are of legal age.",

    ageTitle: "Age Verification",
    ageText: "This store sells alcohol and tobacco. You must confirm you are of legal age to enter.",
    ageYes: "Yes, I’m 18+",
    ageNo: "No",
    ageHint: "If you are underage, you will be redirected out of the website.",

    namePH: "Name (required)",
    phonePH: "Phone (required)",
    addressPH: "Address (optional)",
    notesPH: "Notes (optional)",

    addToCart: "Add to cart",
    emptyCart: "Cart is empty.",
    namePhoneReq: "Name and phone required",
    cartEmptyAlert: "Cart is empty",
    outOfStock: "Out of stock",

    // Slider i18n
    sliderWhiskyTitle: "Johnnie Walker Collection",
    sliderWhiskyText: "Red • Black • Gold • Green • Blue",
    sliderShopWhisky: "Shop Whisky",

    sliderVodkaTitle: "Premium Vodka",
    sliderVodkaText: "Grey Goose • Absolut • Finlandia",
    sliderShopVodka: "Shop Vodka",

    sliderBeerTitle: "Cold Beer",
    sliderBeerText: "Heineken • Carlsberg • Corona",
    sliderShopBeer: "Shop Beer",

    badge1Title: "Pickup / Delivery",
    badge1Text: "Pay in cash or in store",
    badge2Title: "Age restricted",
    badge2Text: "18+ confirmation required",
    badge3Title: "Cold & Ready",
    badge3Text: "Beer and mixers chilled",

    heroCardTitle: "Tonight’s picks",
    heroCardText: "Whisky • Vodka • Beer • Mixers",

    cats: {
      all: { name: "All", tag: "Everything" },
      tobacco: { name: "Tobacco", tag: "Restricted" },
      alcohol: { name: "Alcohol", tag: "Restricted" },
      snacks: { name: "Snacks", tag: "Chips & sweets" },
      coffee: { name: "Coffee", tag: "Fresh cups" },
    },

    subcats: {
      all: "All types",
      cigarettes: "Cigarettes",
      cigars: "Cigars",
      hookah_tobacco: "Hookah tobacco",
      vapes_pods: "Vapes / Pods",
      rolling_tobacco: "Rolling tobacco",
      beer: "Beer",
      vodka: "Vodka",
      whisky: "Whisky",
      arak: "Arak",
      wine: "Wine",
      chips: "Chips",
      chocolate: "Chocolate",
      candy: "Candy",
      nuts: "Nuts",
      hot: "Hot coffee",
      iced: "Iced coffee",
      beans: "Beans / Ground",
      other: "Other",
    }
  },

  he: {
    dir: "rtl",
    storeTitle: "רד סטור",
    storeSubtitle: "טבק • אלכוהול • חטיפים • קפה",
    cart: "עגלה",

    heroKicker: "רד סטור • רמה",
    heroTitle: "אלכוהול פרימיום ובירה קרה — הזמנה מהירה בוואטסאפ",
    heroText: "בוחרים וויסקי, וודקה, בירה ועוד. מוסיפים לעגלה ושולחים הזמנה בלחיצה אחת.",
    shopNow: "לצפייה במוצרים",
    waOrder: "הזמנה בוואטסאפ",
    heroNote: "18+ בלבד • שתייה באחריות",

    categories: "קטגוריות",
    catHint: "החלקה בנייד • גלילה במחשב",
    shop: "חנות",
    searchPH: "חיפוש מוצרים…",

    cartTitle: "העגלה שלי",
    total: "סה״כ",
    checkout: "שליחת הזמנה בוואטסאפ",
    clear: "נקה עגלה",
    legal: "מוצרים מוגבלים דורשים גיל חוקי. בהמשך את/ה מאשר/ת גיל חוקי.",

    ageTitle: "אימות גיל",
    ageText: "החנות מוכרת אלכוהול וטבק. חייבים לאשר גיל חוקי כדי להיכנס.",
    ageYes: "כן, אני 18+",
    ageNo: "לא",
    ageHint: "אם את/ה מתחת לגיל — תועבר/י החוצה מהאתר.",

    namePH: "שם (חובה)",
    phonePH: "טלפון (חובה)",
    addressPH: "כתובת (לא חובה)",
    notesPH: "הערות (לא חובה)",

    addToCart: "הוסף לעגלה",
    emptyCart: "העגלה ריקה.",
    namePhoneReq: "שם וטלפון חובה",
    cartEmptyAlert: "העגלה ריקה",
    outOfStock: "לא במלאי",

    sliderWhiskyTitle: "קולקציית ג׳וני ווקר",
    sliderWhiskyText: "רד • בלאק • גולד • גרין • בלו",
    sliderShopWhisky: "לקניית וויסקי",

    sliderVodkaTitle: "וודקה פרימיום",
    sliderVodkaText: "גרייגוס • אבסולוט • פינלנדיה",
    sliderShopVodka: "לקניית וודקה",

    sliderBeerTitle: "בירה קרה",
    sliderBeerText: "הייניקן • קרלסברג • קורונה",
    sliderShopBeer: "לקניית בירה",

    badge1Title: "איסוף / משלוח",
    badge1Text: "תשלום במזומן או בחנות",
    badge2Title: "מוגבל גיל",
    badge2Text: "נדרש אישור 18+",
    badge3Title: "קר ומוכן",
    badge3Text: "בירה ומיקסרים בקירור",

    heroCardTitle: "מומלץ להערב",
    heroCardText: "וויסקי • וודקה • בירה • מיקסרים",

    cats: {
      all: { name: "הכל", tag: "כל המוצרים" },
      tobacco: { name: "טבק", tag: "מוגבל" },
      alcohol: { name: "אלכוהול", tag: "מוגבל" },
      snacks: { name: "חטיפים", tag: "מתוקים/מלוחים" },
      coffee: { name: "קפה", tag: "חם/קר" },
    },

    subcats: {
      all: "כל הסוגים",
      cigarettes: "סיגריות",
      cigars: "סיגרים",
      hookah_tobacco: "טבק לנרגילה",
      vapes_pods: "וייפ/פודים",
      rolling_tobacco: "טבק לגלגול",
      beer: "בירה",
      vodka: "וודקה",
      whisky: "וויסקי",
      arak: "ערק",
      wine: "יין",
      chips: "צ׳יפס",
      chocolate: "שוקולד",
      candy: "ממתקים",
      nuts: "אגוזים",
      hot: "קפה חם",
      iced: "קפה קר",
      beans: "פולים/טחינה",
      other: "אחר",
    }
  },

  ar: {
    dir: "rtl",
    storeTitle: "ريد ستور",
    storeSubtitle: "تبغ • كحول • سناكس • قهوة",
    cart: "السلة",

    heroKicker: "ريد ستور • الرامة",
    heroTitle: "كحول بريميوم وبيرة باردة — طلب سريع عبر واتساب",
    heroText: "اختر ويسكي، فودكا، بيرة وأكثر. أضف للسلة ثم أرسل طلبك بضغطة واحدة.",
    shopNow: "تصفح المنتجات",
    waOrder: "اطلب عبر واتساب",
    heroNote: "+18 فقط • الشرب بمسؤولية",

    categories: "الأقسام",
    catHint: "اسحب على الهاتف • مرر على الكمبيوتر",
    shop: "المتجر",
    searchPH: "ابحث عن منتج…",

    cartTitle: "سلتك",
    total: "المجموع",
    checkout: "إرسال الطلب عبر واتساب",
    clear: "تفريغ السلة",
    legal: "المنتجات المقيّدة تتطلب العمر القانوني. بالمتابعة أنت تؤكد أنك بالعمر القانوني.",

    ageTitle: "تأكيد العمر",
    ageText: "المتجر يبيع الكحول والتبغ. يجب تأكيد العمر القانوني للدخول.",
    ageYes: "نعم، أنا +18",
    ageNo: "لا",
    ageHint: "إذا كنت دون السن القانوني سيتم إخراجك من الموقع.",

    namePH: "الاسم (مطلوب)",
    phonePH: "الهاتف (مطلوب)",
    addressPH: "العنوان (اختياري)",
    notesPH: "ملاحظات (اختياري)",

    addToCart: "أضف للسلة",
    emptyCart: "السلة فارغة.",
    namePhoneReq: "الاسم والهاتف مطلوبان",
    cartEmptyAlert: "السلة فارغة",
    outOfStock: "غير متوفر",

    sliderWhiskyTitle: "مجموعة جوني ووكر",
    sliderWhiskyText: "ريد • بلاك • غولد • جرين • بلو",
    sliderShopWhisky: "تسوق الويسكي",

    sliderVodkaTitle: "فودكا بريميوم",
    sliderVodkaText: "غري غوس • أبسولوت • فنلنديا",
    sliderShopVodka: "تسوق الفودكا",

    sliderBeerTitle: "بيرة باردة",
    sliderBeerText: "هاينكن • كارلسبرغ • كورونا",
    sliderShopBeer: "تسوق البيرة",

    badge1Title: "استلام / توصيل",
    badge1Text: "الدفع نقداً أو في المتجر",
    badge2Title: "مقيّد بالعمر",
    badge2Text: "يتطلب تأكيد +18",
    badge3Title: "بارد وجاهز",
    badge3Text: "البيرة والمشروبات مبردة",

    heroCardTitle: "اختيارات الليلة",
    heroCardText: "ويسكي • فودكا • بيرة • مكسّرات",

    cats: {
      all: { name: "الكل", tag: "كل المنتجات" },
      tobacco: { name: "تبغ", tag: "مقيّد" },
      alcohol: { name: "كحول", tag: "مقيّد" },
      snacks: { name: "سناكس", tag: "حلويات/مقرمشات" },
      coffee: { name: "قهوة", tag: "ساخن/بارد" },
    },

    subcats: {
      all: "كل الأنواع",
      cigarettes: "سجائر",
      cigars: "سيجار",
      hookah_tobacco: "تبغ أرجيلة",
      vapes_pods: "فيب/بود",
      rolling_tobacco: "تبغ لف",
      beer: "بيرة",
      vodka: "فودكا",
      whisky: "ويسكي",
      arak: "عرق",
      wine: "نبيذ",
      chips: "شيبس",
      chocolate: "شوكولاتة",
      candy: "حلويات",
      nuts: "مكسرات",
      hot: "قهوة ساخنة",
      iced: "قهوة باردة",
      beans: "حبوب/مطحون",
      other: "أخرى",
    }
  }
};

// ======== STATE ========
let cart = loadCart();
let currentCategory = "all";
let currentSubCategory = "all";
let searchTerm = "";
let lang = detectLanguage();

let products = [];
const productEls = new Map();

// ======== STORAGE ========
function loadCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY) || "[]"); }
  catch { return []; }
}
function saveCart() { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }

function isAgeOk() { return sessionStorage.getItem(AGE_KEY) === "true"; }
function setAgeOk(val) { sessionStorage.setItem(AGE_KEY, val ? "true" : "false"); }

// ======== LANGUAGE ========
function detectLanguage(){
  const saved = localStorage.getItem(LANG_KEY);
  if (saved && i18n[saved]) return saved;

  const nav = (navigator.language || "en").toLowerCase();
  if (nav.startsWith("he")) return "he";
  if (nav.startsWith("ar")) return "ar";
  return "en";
}

function setLanguage(newLang){
  if (!i18n[newLang]) newLang = "en";
  lang = newLang;
  localStorage.setItem(LANG_KEY, newLang);

  applyLanguage();
  applySliderI18n();
  renderMainCategories();
  renderSubCategories();
  updateProductTextsOnly();
  filterProductsView();
  renderCart();

  // keep selects synced (desktop + mobile)
  const ls = $("langSelect");
  if (ls) ls.value = lang;
  const lsm = $("langSelectMobile");
  if (lsm) lsm.value = lang;
}

// ======== SAFE DOM SETTERS ========
function setText(id, value){
  const el = $(id);
  if (el) el.textContent = String(value ?? "");
}
function setPH(id, value){
  const el = $(id);
  if (el) el.placeholder = String(value ?? "");
}
function setValue(id, value){
  const el = $(id);
  if (el) el.value = String(value ?? "");
}

// ======== HELPERS ========
function formatILS(n){
  const v = Math.round(Number(n || 0) * 100) / 100;
  return String(v);
}
function cartCount(){ return cart.reduce((s,i)=>s+i.qty,0); }
function cartTotal(){ return cart.reduce((s,i)=>s+i.price*i.qty,0); }

function waLink(message){
  return `https://api.whatsapp.com/send?phone=${STORE_WHATSAPP}&text=${encodeURIComponent(message)}`;
}

// ======== SLIDER I18N ========
function applySliderI18n(){
  const t = i18n[lang] || i18n.en;
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const key = el.getAttribute("data-i18n");
    if (!key) return;
    const value = t[key];
    if (typeof value === "string") el.textContent = value;
  });
}

// ======== QUICK FILTER FROM SLIDER ========
function setShopFilter(main, sub){
  currentCategory = main || "all";
  currentSubCategory = sub || "all";

  // sync selects too
  const cs = $("categorySelect");
  if (cs) cs.value = currentCategory;

  renderMainCategories();
  renderSubCategories();

  const sc = $("subCategorySelect");
  if (sc) sc.value = currentSubCategory;

  // clear search when jumping from hero/slider (optional)
  searchTerm = "";
  const si = $("searchInput");
  if (si) si.value = "";

  filterProductsView();
  location.hash = "#shop";
}

// ======== PRODUCT NAME TRANSLATION ========
function productName(p){
  if (!p) return "";

  if (p.i18nName && typeof p.i18nName === "object"){
    return p.i18nName[lang] || p.i18nName.en || p.name || "";
  }

  if (p.name_i18n && typeof p.name_i18n === "object"){
    return p.name_i18n[lang] || p.name_i18n.en || p.name || "";
  }

  if (lang === "he" && p.name_he) return p.name_he;
  if (lang === "ar" && p.name_ar) return p.name_ar;

  return p.name || "";
}

// ======== NORMALIZE ========
function normalizeProduct(raw){
  const mainCategory = raw.mainCategory || raw.category || "snacks";
  const subCategory = raw.subCategory || "all";

  const restricted =
    (typeof raw.restricted === "boolean")
      ? raw.restricted
      : (mainCategory === "alcohol" || mainCategory === "tobacco");

  return {
    ...raw,
    id: raw.id,
    mainCategory,
    subCategory,
    restricted,
    inStock: raw.inStock !== false,
    price: Number(raw.price || 0),
    imgUrl: (raw.imgUrl && String(raw.imgUrl).trim()) ? raw.imgUrl : PLACEHOLDER_IMG
  };
}

// ======== MERGE SEED + DB ========
function mergeProducts(seed, dbProducts){
  const map = new Map();

  seed.forEach(p=>{
    const np = normalizeProduct({ ...p, source:"seed" });
    map.set(np.id, np);
  });

  dbProducts.forEach(p=>{
    const np = normalizeProduct({ ...p, source:"db" });
    const prev = map.get(np.id);
    map.set(np.id, { ...(prev || {}), ...np });
  });

  return [...map.values()];
}

// ======== AGE GATE ========
function showAgeGate(){
  $("ageGate")?.classList.remove("hidden");
  document.documentElement.style.overflow = "hidden";
  document.body.style.overflow = "hidden";
}
function hideAgeGate(){
  $("ageGate")?.classList.add("hidden");
  document.documentElement.style.overflow = "";
  document.body.style.overflow = "";
}
function enforceEntryAgeGate(){
  if (isAgeOk()) hideAgeGate();
  else showAgeGate();
}
function exitWebsite(){
  if (history.length > 1) history.back();
  else window.location.href = "https://google.com";
}

// ======== APPLY LANGUAGE (FIXED) ========
// IMPORTANT:
// - sets <html dir="rtl"> for HE/AR (so CSS [dir="rtl"] works)
// - no duplicate/conflicting assignments
// - safe DOM updates (no null crash)
function applyLanguage(){
  const t = i18n[lang] || i18n.en;

  // ✅ This is the ONLY place we set lang/dir
  document.documentElement.setAttribute("lang", lang);
  document.documentElement.setAttribute("dir", t.dir || ((lang === "he" || lang === "ar") ? "rtl" : "ltr"));

  // Header
  setText("storeTitle", t.storeTitle);
  setText("storeSubtitle", t.storeSubtitle);
  setText("cartLabel", t.cart);

  // Hero (v2)
  setText("heroKicker", t.heroKicker || STORE_NAME);
  setText("heroTitle", t.heroTitle);
  setText("heroText", t.heroText);
  setText("heroNote", t.heroNote || "");

  setText("shopNowBtn", t.shopNow);
  setText("waQuickBtn", t.waOrder || "WhatsApp");

  // Badges (optional elements)
  setText("badge1Title", t.badge1Title || "");
  setText("badge1Text", t.badge1Text || "");
  setText("badge2Title", t.badge2Title || "");
  setText("badge2Text", t.badge2Text || "");
  setText("badge3Title", t.badge3Title || "");
  setText("badge3Text", t.badge3Text || "");

  // Hero card (optional)
  setText("heroCardTitle", t.heroCardTitle || "");
  setText("heroCardText", t.heroCardText || "");

  // Sections
  setText("catTitle", t.categories);
  setText("catHint", t.catHint);
  setText("shopTitle", t.shop);
  setPH("searchInput", t.searchPH);

  // Cart
  setText("cartTitle", t.cartTitle);
  setText("totalLabel", t.total);
  setText("checkoutWaBtn", t.checkout);
  setText("clearCartBtn", t.clear);
  setText("legalText", t.legal);

  // Form placeholders
  setPH("name", t.namePH);
  setPH("phone", t.phonePH);
  setPH("address", t.addressPH);
  setPH("notes", t.notesPH);

  // Age gate
  setText("ageTitle", t.ageTitle);
  setText("ageText", t.ageText);
  setText("ageYes", t.ageYes);
  setText("ageNo", t.ageNo);
  setText("ageHint", t.ageHint);

  // Language selects (desktop + mobile)
  setValue("langSelect", lang);
  setValue("langSelectMobile", lang);

  // Optional: mirror mobile header title/subtitle if you have these IDs
  setText("storeTitleMobile", t.storeTitle);
  setText("storeSubtitleMobile", t.storeSubtitle);
}

// ======== MAIN CATEGORIES ========
function renderMainCategories(){
  const t = i18n[lang] || i18n.en;

  const slider = $("categorySlider");
  if (slider){
    slider.innerHTML = MAIN_CATEGORIES.map(c=>{
      const label = t.cats?.[c.id]?.name || c.id;
      const tag = t.cats?.[c.id]?.tag || "";
      return `
        <div class="cat ${c.id===currentCategory?"active":""}" data-cat="${c.id}">
          <div class="name">${c.icon} ${label}</div>
          <div class="tag">${tag}</div>
        </div>
      `;
    }).join("");
  }

  const select = $("categorySelect");
  if (select){
    select.innerHTML = MAIN_CATEGORIES.map(c=>{
      const label = t.cats?.[c.id]?.name || c.id;
      return `<option value="${c.id}" ${c.id===currentCategory?"selected":""}>${label}</option>`;
    }).join("");
    select.value = currentCategory;
  }
}

// ======== SUB CATEGORIES ========
function renderSubCategories(){
  const t = i18n[lang] || i18n.en;
  const list = SUBCATS[currentCategory] || [{ id:"all" }];

  if (!list.some(x => x.id === currentSubCategory)) currentSubCategory = "all";

  const select = $("subCategorySelect");
  if (!select) return;

  select.innerHTML = list.map(sc=>{
    const label = t.subcats?.[sc.id] || sc.id;
    return `<option value="${sc.id}" ${sc.id===currentSubCategory?"selected":""}>${label}</option>`;
  }).join("");

  select.value = currentSubCategory;
}

// ======== PRODUCTS VIEW ========
function buildProductsOnce(){
  const list = $("productList");
  if (!list) return;

  list.innerHTML = "";
  productEls.clear();

  const t = i18n[lang] || i18n.en;

  products.forEach(p=>{
    const el = document.createElement("div");
    el.className = "product";
    el.dataset.pid = p.id;

    const img = p.imgUrl || PLACEHOLDER_IMG;

    el.innerHTML = `
      <div class="pimg">
        <img
          src="${img}"
          alt=""
          loading="lazy"
          decoding="async"
          draggable="false"
          referrerpolicy="no-referrer"
          onerror="this.onerror=null;this.src='${PLACEHOLDER_IMG}';"
        />
        ${p.restricted ? `<span class="badge badge-top">18+</span>` : ``}
      </div>

      <div class="pname" data-pname></div>
      <div class="muted small" data-catlabel></div>
      <div class="muted small" data-subcatlabel></div>

      <div class="price" data-price></div>
      <div class="muted small" data-oos style="display:${p.inStock ? "none":"block"}">${t.outOfStock}</div>

      <button class="btn primary full" data-add="${p.id}" type="button">${t.addToCart}</button>
    `;

    list.appendChild(el);
    productEls.set(p.id, el);
  });

  updateProductTextsOnly();
}

function updateProductTextsOnly(){
  const t = i18n[lang] || i18n.en;

  productEls.forEach((el, id)=>{
    const p = products.find(x=>x.id===id);
    if (!p) return;

    el.querySelector("[data-pname]")?.replaceChildren(document.createTextNode(productName(p)));
    el.querySelector("[data-catlabel]")?.replaceChildren(document.createTextNode(t.cats?.[p.mainCategory]?.name || p.mainCategory));

    const subLabel = t.subcats?.[p.subCategory] || p.subCategory || "";
    const subText = (p.subCategory && p.subCategory !== "all") ? subLabel : "";
    el.querySelector("[data-subcatlabel]")?.replaceChildren(document.createTextNode(subText));

    const priceEl = el.querySelector("[data-price]");
    if (priceEl) priceEl.textContent = `₪${formatILS(p.price)}`;

    const btn = el.querySelector("[data-add]");
    if (btn){
      btn.textContent = t.addToCart;
      btn.disabled = !p.inStock;
      btn.classList.toggle("btn-disabled", !p.inStock);
    }

    const oos = el.querySelector("[data-oos]");
    if (oos){
      oos.textContent = t.outOfStock;
      oos.style.display = p.inStock ? "none" : "block";
    }
  });
}

function productMatches(p){
  const catOk = currentCategory==="all" || p.mainCategory===currentCategory;
  const subOk = currentCategory==="all" || currentSubCategory==="all" || p.subCategory===currentSubCategory;

  const s = searchTerm.trim().toLowerCase();
  const name = productName(p).toLowerCase();
  const searchOk = !s || name.includes(s);

  return catOk && subOk && searchOk;
}

function filterProductsView(){
  productEls.forEach((el, id)=>{
    const p = products.find(x=>x.id===id);
    if (!p) return;
    el.classList.toggle("hidden", !productMatches(p));
  });
}

// ======== CART ========
function addToCart(p){
  const displayName = productName(p);

  const found = cart.find(x=>x.id===p.id);
  if (found) found.qty += 1;
  else cart.push({ id:p.id, name:displayName, price:p.price, qty:1, restricted: !!p.restricted });

  saveCart();
  renderCart();
  openCart();
}

function removeFromCart(id){
  cart = cart.filter(x=>x.id!==id);
  saveCart();
  renderCart();
}

function setQty(id, qty){
  const item = cart.find(x=>x.id===id);
  if (!item) return;
  item.qty = Math.max(1, qty);
  saveCart();
  renderCart();
}

// ======== CART UI ========
function openCart(){
  $("cartDrawer")?.classList.remove("hidden");
  $("cartBackdrop")?.classList.remove("hidden");
}
function closeCart(){
  $("cartDrawer")?.classList.add("hidden");
  $("cartBackdrop")?.classList.add("hidden");
}

function renderCart(){
  const t = i18n[lang] || i18n.en;

  setText("cartCount", String(cartCount()));
  setText("cartTotal", formatILS(cartTotal()));

  const box = $("cartItems");
  if (!box) return;

  if (!cart.length){
    box.innerHTML = `<div class="muted">${t.emptyCart}</div>`;
    const cm0 = $("cartCountMobile");
    if (cm0) cm0.textContent = String(cartCount());
    return;
  }

  box.innerHTML = cart.map(i=>`
    <div class="cart-item">
      <div class="cart-top">
        <div>
          <div style="font-weight:900;">${i.name}</div>
          <div class="muted small">₪${formatILS(i.price)} each</div>
        </div>
        <button class="btn ghost" data-remove="${i.id}" type="button">✕</button>
      </div>

      <div class="qty">
        <button data-dec="${i.id}" aria-label="decrease" type="button">−</button>
        <div class="num">${i.qty}</div>
        <button data-inc="${i.id}" aria-label="increase" type="button">+</button>
        <div class="muted small" style="margin-left:auto;">₪${formatILS(i.price*i.qty)}</div>
      </div>
    </div>
  `).join("");

  document.querySelectorAll("[data-remove]").forEach(b =>
    b.addEventListener("click", () => removeFromCart(b.getAttribute("data-remove")))
  );
  document.querySelectorAll("[data-inc]").forEach(b =>
    b.addEventListener("click", () => {
      const id = b.getAttribute("data-inc");
      const qty = cart.find(x=>x.id===id)?.qty || 1;
      setQty(id, qty+1);
    })
  );
  document.querySelectorAll("[data-dec]").forEach(b =>
    b.addEventListener("click", () => {
      const id = b.getAttribute("data-dec");
      const qty = cart.find(x=>x.id===id)?.qty || 1;
      setQty(id, qty-1);
    })
  );

  const cm = $("cartCountMobile");
  if (cm) cm.textContent = String(cartCount());
}

// ======== CHECKOUT ========
function buildOrderText(){
  const name = ($("name")?.value || "").trim();
  const phone = ($("phone")?.value || "").trim();
  const address = ($("address")?.value || "").trim();
  const notes = ($("notes")?.value || "").trim();

  const lines = [];
  lines.push(`${STORE_NAME} - New Order`);
  lines.push(`Name: ${name || "-"}`);
  lines.push(`Phone: ${phone || "-"}`);
  if (address) lines.push(`Address: ${address}`);
  if (notes) lines.push(`Notes: ${notes}`);
  lines.push("");
  lines.push("Items:");
  cart.forEach(i => lines.push(`- ${i.name} x${i.qty} = ₪${formatILS(i.price*i.qty)}`));
  lines.push("");
  lines.push(`Total: ₪${formatILS(cartTotal())}`);

  return { text: lines.join("\n"), name, phone };
}

function checkoutWhatsApp(){
  const t = i18n[lang] || i18n.en;

  if (!cart.length) return alert(t.cartEmptyAlert);
  if (!isAgeOk()) { showAgeGate(); return; }

  const { text, name, phone } = buildOrderText();
  if (!name || !phone) return alert(t.namePhoneReq);

  window.open(waLink(text), "_blank");
}

// ======== FIRESTORE LISTENER ========
function listenProducts(){
  const q = query(collection(db, "products"), orderBy("createdAt", "desc"));

  onSnapshot(q, (snap)=>{
    const dbProductsRaw = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    products = mergeProducts(SEED_PRODUCTS, dbProductsRaw);

    buildProductsOnce();
    renderSubCategories();
    filterProductsView();
  });
}

// ======== SLIDER ========
function initSlider(){
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");
  if (!slides.length || !dots.length) return;

  let current = 0;

  function showSlide(index){
    slides.forEach(s=>s.classList.remove("active"));
    dots.forEach(d=>d.classList.remove("active"));
    slides[index].classList.add("active");
    dots[index].classList.add("active");
    current = index;
  }

  dots.forEach(dot=>{
    dot.addEventListener("click", ()=>{
      showSlide(Number(dot.dataset.slide));
    });
  });

  setInterval(()=>{
    const next = (current + 1) % slides.length;
    showSlide(next);
  }, 3000);
}

// ======== EVENTS ========
function initEvents(){
  // Desktop header buttons (if exist)
  const ig = $("instagramBtn");
  if (ig) ig.href = INSTAGRAM_URL;

  const wz = $("wazeBtn");
  if (wz) wz.href = WAZE_URL;

  // Mobile header buttons (if exist)
  const igM = $("instagramBtnMobile");
  if (igM) igM.href = INSTAGRAM_URL;

  const wzM = $("wazeBtnMobile");
  if (wzM) wzM.href = WAZE_URL;

  // Language selects
  const langSelect = $("langSelect");
  if (langSelect){
    langSelect.value = lang;
    langSelect.addEventListener("change", (e)=> setLanguage(e.target.value));
  }
  const langSelectM = $("langSelectMobile");
  if (langSelectM){
    langSelectM.value = lang;
    langSelectM.addEventListener("change", (e)=> setLanguage(e.target.value));
  }

  // Age gate
  $("ageYes")?.addEventListener("click", ()=>{
    setAgeOk(true);
    hideAgeGate();
  });
  $("ageNo")?.addEventListener("click", ()=>{
    setAgeOk(false);
    exitWebsite();
  });

  // Cart open/close
  $("openCartBtn")?.addEventListener("click", openCart);
  $("openCartBtnMobile")?.addEventListener("click", openCart);

  $("closeCartBtn")?.addEventListener("click", closeCart);
  $("cartBackdrop")?.addEventListener("click", closeCart);

  // WhatsApp quick button
  const waq = $("waQuickBtn");
  if (waq){
    waq.href = `https://wa.me/${STORE_WHATSAPP}?text=${encodeURIComponent("Hi! I want to order from Red Store.")}`;
  }

  // Search
  $("searchInput")?.addEventListener("input", (e)=>{
    searchTerm = e.target.value || "";
    filterProductsView();
  });

  // Optional mirrored top search inputs (if exist)
  const mainSearch = $("searchInput");
  const topSearch = $("searchInputTop");
  const topSearchM = $("searchInputTopMobile");

  function bindSearchMirror(src){
    if (!src || !mainSearch) return;
    src.addEventListener("input", (e)=>{
      mainSearch.value = e.target.value;
      searchTerm = e.target.value || "";
      filterProductsView();
    });
  }
  bindSearchMirror(topSearch);
  bindSearchMirror(topSearchM);

  // Category selects
  $("categorySelect")?.addEventListener("change", (e)=>{
    currentCategory = e.target.value;
    currentSubCategory = "all";
    renderMainCategories();
    renderSubCategories();
    filterProductsView();
  });

  $("subCategorySelect")?.addEventListener("change", (e)=>{
    currentSubCategory = e.target.value;
    filterProductsView();
  });

  // Category slider click
  $("categorySlider")?.addEventListener("click", (e)=>{
    const cat = e.target.closest("[data-cat]")?.getAttribute("data-cat");
    if (!cat) return;
    currentCategory = cat;
    currentSubCategory = "all";
    renderMainCategories();
    renderSubCategories();
    filterProductsView();
    location.hash = "#shop";
  });

  // Category slider arrows
  const slider = $("categorySlider");
  const left = $("catLeft");
  const right = $("catRight");
  if (slider && left && right){
    left.addEventListener("click", ()=> slider.scrollBy({ left: -260, behavior:"smooth" }));
    right.addEventListener("click", ()=> slider.scrollBy({ left: 260, behavior:"smooth" }));

    slider.addEventListener("wheel", (e)=>{
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        slider.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    }, { passive:false });
  }

  // Hero chips / buttons filter
  document.querySelectorAll(".js-hero-filter").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const main = btn.getAttribute("data-shop-cat") || btn.dataset.shopCat || "all";
      const sub = btn.getAttribute("data-shop-sub") || btn.dataset.shopSub || "all";
      setShopFilter(main, sub);
    });
  });

  // Slider "Shop" links -> filter shop
  document.querySelectorAll(".js-shop-link").forEach(a=>{
    a.addEventListener("click", (e)=>{
      e.preventDefault();
      const main = a.getAttribute("data-shop-cat") || "all";
      const sub = a.getAttribute("data-shop-sub") || "all";
      setShopFilter(main, sub);
    });
  });

  // Checkout / clear
  $("checkoutWaBtn")?.addEventListener("click", checkoutWhatsApp);
  $("clearCartBtn")?.addEventListener("click", ()=>{
    cart = [];
    saveCart();
    renderCart();
  });

  // Add-to-cart (event delegation)
  document.addEventListener("click", (e)=>{
    const btn = e.target.closest("[data-add]");
    if (!btn) return;

    const id = btn.getAttribute("data-add");
    const p = products.find(x=>x.id===id);
    if (!p) return;

    if (!p.inStock) return;
    if (!isAgeOk()) { showAgeGate(); return; }

    addToCart(p);
  });
}

// ======== BOOT ========
function boot(){
  applyLanguage();
  applySliderI18n();
  renderMainCategories();
  renderSubCategories();
  renderCart();
  initEvents();
  enforceEntryAgeGate();
  listenProducts();
  initSlider();
}

document.addEventListener("DOMContentLoaded", boot);