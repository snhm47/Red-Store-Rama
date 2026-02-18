// app.js (SHOP)

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
// ✅ main category is "tobacco" not "cigarettes"
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
    heroTitle: "Order fast with WhatsApp",
    heroText: "Choose products, add to cart, then send your order with one tap.",
    shopNow: "Shop now",
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
    heroTitle: "מזמינים מהר בוואטסאפ",
    heroText: "בוחרים מוצרים, מוסיפים לעגלה ושולחים הזמנה בלחיצה אחת.",
    shopNow: "לחנות",
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
    heroTitle: "اطلب بسرعة عبر واتساب",
    heroText: "اختر المنتجات، أضف للسلة، ثم أرسل الطلب بضغطة واحدة.",
    shopNow: "تسوق الآن",
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

let products = [];         // final merged + normalized
const productEls = new Map();

const $ = (id) => document.getElementById(id);

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
  renderMainCategories();
  renderSubCategories();
  updateProductTextsOnly();
  filterProductsView();
  renderCart();
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

// ======== PRODUCT NAME TRANSLATION ========
function productName(p){
  if (!p) return "";

  // seed style: i18nName
  if (p.i18nName && typeof p.i18nName === "object"){
    return p.i18nName[lang] || p.i18nName.en || p.name || "";
  }

  // db style: name_i18n
  if (p.name_i18n && typeof p.name_i18n === "object"){
    return p.name_i18n[lang] || p.name_i18n.en || p.name || "";
  }

  if (lang === "he" && p.name_he) return p.name_he;
  if (lang === "ar" && p.name_ar) return p.name_ar;

  return p.name || "";
}

// ======== NORMALIZE (ONE VERSION ONLY) ========
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
  $("ageGate").classList.remove("hidden");
  document.documentElement.style.overflow = "hidden";
  document.body.style.overflow = "hidden";
}
function hideAgeGate(){
  $("ageGate").classList.add("hidden");
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

// ======== APPLY LANGUAGE ========
function applyLanguage(){
  const t = i18n[lang] || i18n.en;

  document.documentElement.lang = lang;
  document.documentElement.dir = t.dir;

  $("storeTitle").textContent = t.storeTitle;
  $("storeSubtitle").textContent = t.storeSubtitle;
  $("cartLabel").textContent = t.cart;

  $("heroTitle").textContent = t.heroTitle;
  $("heroText").textContent = t.heroText;
  $("shopNowBtn").textContent = t.shopNow;

  $("catTitle").textContent = t.categories;
  $("catHint").textContent = t.catHint;

  $("shopTitle").textContent = t.shop;
  $("searchInput").placeholder = t.searchPH;

  $("cartTitle").textContent = t.cartTitle;
  $("totalLabel").textContent = t.total;
  $("checkoutWaBtn").textContent = t.checkout;
  $("clearCartBtn").textContent = t.clear;
  $("legalText").textContent = t.legal;

  $("name").placeholder = t.namePH;
  $("phone").placeholder = t.phonePH;
  $("address").placeholder = t.addressPH;
  $("notes").placeholder = t.notesPH;

  $("ageTitle").textContent = t.ageTitle;
  $("ageText").textContent = t.ageText;
  $("ageYes").textContent = t.ageYes;
  $("ageNo").textContent = t.ageNo;
  $("ageHint").textContent = t.ageHint;

  $("langSelect").value = lang;
}

// ======== MAIN CATEGORIES ========
function renderMainCategories(){
  const t = i18n[lang] || i18n.en;

  $("categorySlider").innerHTML = MAIN_CATEGORIES.map(c=>{
    const label = t.cats?.[c.id]?.name || c.id;
    const tag = t.cats?.[c.id]?.tag || "";
    return `
      <div class="cat ${c.id===currentCategory?"active":""}" data-cat="${c.id}">
        <div class="name">${c.icon} ${label}</div>
        <div class="tag">${tag}</div>
      </div>
    `;
  }).join("");

  $("categorySelect").innerHTML = MAIN_CATEGORIES.map(c=>{
    const label = t.cats?.[c.id]?.name || c.id;
    return `<option value="${c.id}" ${c.id===currentCategory?"selected":""}>${label}</option>`;
  }).join("");
}

// ======== SUB CATEGORIES ========
function renderSubCategories(){
  const t = i18n[lang] || i18n.en;
  const list = SUBCATS[currentCategory] || [{ id:"all" }];

  // reset invalid selection
  if (!list.some(x => x.id === currentSubCategory)) currentSubCategory = "all";

  $("subCategorySelect").innerHTML = list.map(sc=>{
    const label = (t.subcats && t.subcats[sc.id]) ? t.subcats[sc.id] : sc.id;
    return `<option value="${sc.id}" ${sc.id===currentSubCategory?"selected":""}>${label}</option>`;
  }).join("");
}

// ======== PRODUCTS VIEW ========
function buildProductsOnce(){
  const list = $("productList");
  list.innerHTML = "";
  productEls.clear();

  const t = i18n[lang] || i18n.en;

  products.forEach(p=>{
    const el = document.createElement("div");
    el.className = "product";
    el.dataset.pid = p.id;
    el.dataset.category = p.mainCategory;
    el.dataset.subcategory = p.subCategory || "all";

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

    const nameEl = el.querySelector("[data-pname]");
    const catEl = el.querySelector("[data-catlabel]");
    const subEl = el.querySelector("[data-subcatlabel]");
    const priceEl = el.querySelector("[data-price]");
    const btn = el.querySelector("[data-add]");
    const oos = el.querySelector("[data-oos]");

    if (nameEl) nameEl.textContent = productName(p);
    if (catEl) catEl.textContent = t.cats?.[p.mainCategory]?.name || p.mainCategory;

    const subLabel = t.subcats?.[p.subCategory] || p.subCategory || "";
    if (subEl) subEl.textContent = (p.subCategory && p.subCategory !== "all") ? subLabel : "";

    if (priceEl) priceEl.textContent = `₪${formatILS(p.price)}`;

    if (btn) {
      btn.textContent = t.addToCart;
      btn.disabled = !p.inStock;
      btn.classList.toggle("btn-disabled", !p.inStock);
    }

    if (oos) {
      oos.textContent = t.outOfStock;
      oos.style.display = p.inStock ? "none" : "block";
    }
  });
}

function productMatches(p){
  const catOk = currentCategory==="all" || p.mainCategory===currentCategory;
  const subOk =
    currentCategory==="all" ||
    currentSubCategory==="all" ||
    p.subCategory===currentSubCategory;

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
  $("cartDrawer").classList.remove("hidden");
  $("cartBackdrop").classList.remove("hidden");
}
function closeCart(){
  $("cartDrawer").classList.add("hidden");
  $("cartBackdrop").classList.add("hidden");
}

function renderCart(){
  const t = i18n[lang] || i18n.en;

  $("cartCount").textContent = String(cartCount());
  $("cartTotal").textContent = formatILS(cartTotal());

  const box = $("cartItems");
  if (!cart.length){
    box.innerHTML = `<div class="muted">${t.emptyCart}</div>`;
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
}

// ======== CHECKOUT ========
function buildOrderText(){
  const name = $("name").value.trim();
  const phone = $("phone").value.trim();
  const address = $("address").value.trim();
  const notes = $("notes").value.trim();

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

// ======== EVENTS ========
function initEvents(){
  $("instagramBtn").href = INSTAGRAM_URL;
  $("wazeBtn").href = WAZE_URL;

  $("langSelect").addEventListener("change", (e)=> setLanguage(e.target.value));

  $("ageYes").addEventListener("click", ()=>{
    setAgeOk(true);
    hideAgeGate();
  });
  $("ageNo").addEventListener("click", ()=>{
    setAgeOk(false);
    exitWebsite();
  });

  $("openCartBtn").addEventListener("click", openCart);
  $("closeCartBtn").addEventListener("click", closeCart);
  $("cartBackdrop").addEventListener("click", closeCart);

  $("waQuickBtn").href = `https://wa.me/${STORE_WHATSAPP}?text=${encodeURIComponent("Hi! I want to order from Red Store.")}`;

  $("searchInput").addEventListener("input", (e)=>{
    searchTerm = e.target.value || "";
    filterProductsView();
  });

  $("categorySelect").addEventListener("change", (e)=>{
    currentCategory = e.target.value;
    currentSubCategory = "all";
    renderMainCategories();
    renderSubCategories();
    filterProductsView();
  });

  $("subCategorySelect").addEventListener("change", (e)=>{
    currentSubCategory = e.target.value;
    filterProductsView();
  });

  $("categorySlider").addEventListener("click", (e)=>{
    const cat = e.target.closest("[data-cat]")?.getAttribute("data-cat");
    if (!cat) return;
    currentCategory = cat;
    currentSubCategory = "all";
    renderMainCategories();
    renderSubCategories();
    filterProductsView();
    location.hash = "#shop";
  });

  const slider = $("categorySlider");
  $("catLeft").addEventListener("click", ()=> slider.scrollBy({ left: -260, behavior:"smooth" }));
  $("catRight").addEventListener("click", ()=> slider.scrollBy({ left: 260, behavior:"smooth" }));

  slider.addEventListener("wheel", (e)=>{
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      slider.scrollLeft += e.deltaY;
      e.preventDefault();
    }
  }, { passive:false });

  $("checkoutWaBtn").addEventListener("click", checkoutWhatsApp);
  $("clearCartBtn").addEventListener("click", ()=>{
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
  renderMainCategories();
  renderSubCategories();
  renderCart();
  initEvents();
  enforceEntryAgeGate();
  listenProducts();
}

document.addEventListener("DOMContentLoaded", boot);
