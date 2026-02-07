// ======== CONFIG: change these ========
const STORE_NAME = "Red Store";
const STORE_WHATSAPP = "9725XXXXXXXX"; // no +, example: 972501234567
const INSTAGRAM_URL = "https://instagram.com/YOUR_PROFILE"; // change
const WAZE_URL = "https://waze.com/ul?q=Red%20Store";        // change

// ======== KEYS ========
// ✅ Age gate in sessionStorage => shows again when browser/tab is reopened
const AGE_KEY = "redstore_age_ok_session_v1";

const CART_KEY = "redstore_cart_v3";
const LANG_KEY = "redstore_lang_v1";
const productEls = new Map(); // id -> element


// ======== DATA ========
const categories = [
  { id: "all", icon: "🛒", restricted: false },
  { id: "cigarettes", icon: "🚬", restricted: true },
  { id: "alcohol", icon: "🥃", restricted: true },
  { id: "snacks", icon: "🍫", restricted: false },
  { id: "coffee", icon: "☕", restricted: false },
];

// const products = [
//   { id: "c1", name: "Marlboro Red", price: 35, category: "cigarettes", restricted: true },
//   { id: "c2", name: "LM Blue", price: 33, category: "cigarettes", restricted: true },
//   { id: "a1", name: "Vodka 700ml", price: 90, category: "alcohol", restricted: true },
//   { id: "a2", name: "Whisky 700ml", price: 150, category: "alcohol", restricted: true },
//   { id: "s1", name: "Chips", price: 8, category: "snacks", restricted: false },
//   { id: "s2", name: "Chocolate Bar", price: 6, category: "snacks", restricted: false },
//   { id: "k1", name: "Handmade Coffee (Cup)", price: 12, category: "coffee", restricted: false },
//   { id: "k2", name: "Iced Coffee", price: 15, category: "coffee", restricted: false },
// ];
const products = [
  { id: "c1", name: "Marlboro Red", price: 35, category: "cigarettes", restricted: true,  img: "assets/logo.jpg" },
  { id: "c2", name: "LM Blue",      price: 33, category: "cigarettes", restricted: true,  img: "assets/logo.jpg" },
  { id: "a1", name: "Vodka 700ml",  price: 90, category: "alcohol",    restricted: true,  img: "assets/logo.jpg" },
  { id: "a2", name: "Whisky 700ml", price: 150,category: "alcohol",    restricted: true,  img: "assets/logo.jpg" },
  { id: "s1", name: "Chips",        price: 8,  category: "snacks",     restricted: false, img: "assets/logo.jpg" },
  { id: "s2", name: "Chocolate Bar",price: 6,  category: "snacks",     restricted: false, img: "assets/logo.jpg" },
  { id: "k1", name: "Handmade Coffee (Cup)", price: 12, category: "coffee", restricted: false, img: "assets/logo.jpg" },
  { id: "k2", name: "Iced Coffee",  price: 15, category: "coffee",     restricted: false, img: "assets/logo.jpg" },
]


// ======== TRANSLATIONS (yours) ========
const i18n = {
  en: {
    dir: "ltr",
    storeTitle: "Red Store",
    storeSubtitle: "Cigarettes • Alcohol • Snacks • Handmade Coffee",
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
    cats: {
      all: { name: "All", tag: "Everything" },
      cigarettes: { name: "Cigarettes", tag: "Restricted" },
      alcohol: { name: "Alcohol", tag: "Restricted" },
      snacks: { name: "Snacks", tag: "Chips & sweets" },
      coffee: { name: "Handmade Coffee", tag: "Fresh cups" },
    }
  },
  he: {
    dir: "rtl",
    storeTitle: "רד סטור",
    storeSubtitle: "סיגריות • אלכוהול • חטיפים • קפה בעבודת יד",
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
    cats: {
      all: { name: "הכל", tag: "כל המוצרים" },
      cigarettes: { name: "סיגריות", tag: "מוגבל" },
      alcohol: { name: "אלכוהול", tag: "מוגבל" },
      snacks: { name: "חטיפים", tag: "מתוקים/מלוחים" },
      coffee: { name: "קפה בעבודת יד", tag: "חם/קר" },
    }
  },
  ar: {
    dir: "rtl",
    storeTitle: "ريد ستور",
    storeSubtitle: "سجائر • كحول • سناكس • قهوة يدوية",
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
    cats: {
      all: { name: "الكل", tag: "كل المنتجات" },
      cigarettes: { name: "سجائر", tag: "مقيّد" },
      alcohol: { name: "كحول", tag: "مقيّد" },
      snacks: { name: "سناكس", tag: "حلويات/مقرمشات" },
      coffee: { name: "قهوة يدوية", tag: "ساخن/بارد" },
    }
  },
};

// ======== STATE ========
let cart = loadCart();
let currentCategory = "all";
let searchTerm = "";
let lang = detectLanguage();

// ======== DOM ========
const $ = (id) => document.getElementById(id);

// ======== STORAGE ========
function loadCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY) || "[]"); }
  catch { return []; }
}
function saveCart() { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }

// ✅ Age gate: session only
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
  renderCategories();
  filterProductsView()
  renderCart();
}

// ======== FORMAT ========
function formatILS(n){
  const v = Math.round(n * 100) / 100;
  return String(v);
}
function cartCount(){ return cart.reduce((s,i)=>s+i.qty,0); }
function cartTotal(){ return cart.reduce((s,i)=>s+i.price*i.qty,0); }

// ======== AGE GATE (show every time site opens) ========
function showAgeGate(){
  $("ageGate").classList.remove("hidden");
  document.body.style.overflow = "hidden";
}
function hideAgeGate(){
  $("ageGate").classList.add("hidden");
  document.body.style.overflow = "";
}
function enforceEntryAgeGate(){
  // Always show on page open until accepted in THIS SESSION
  if (isAgeOk()) hideAgeGate();
  else showAgeGate();
}
function exitWebsite(){
  // If possible go back, otherwise go to google
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
function setLanguage(newLang){
  if (!i18n[newLang]) newLang = "en";
  lang = newLang;
  localStorage.setItem(LANG_KEY, newLang);

  applyLanguage();
  renderCategories();
  updateProductCategoryLabels(); // ✅ updates text without recreating images
  filterProductsView();
  renderCart();
}

// ======== RENDER: CATEGORIES ========
function renderCategories(){
  const t = i18n[lang] || i18n.en;

  $("categorySlider").innerHTML = categories.map(c=>{
    const label = t.cats[c.id]?.name || c.id;
    const tag = t.cats[c.id]?.tag || "";
    return `
      <div class="cat ${c.id===currentCategory?"active":""}" data-cat="${c.id}">
        <div class="name">${c.icon} ${label}</div>
        <div class="tag">${tag}</div>
      </div>
    `;
  }).join("");

  $("categorySelect").innerHTML = categories.map(c=>{
    const label = t.cats[c.id]?.name || c.id;
    return `<option value="${c.id}" ${c.id===currentCategory?"selected":""}>${label}</option>`;
  }).join("");
}

// ======== RENDER: PRODUCTS ========
function productMatches(p){
  const catOk = currentCategory==="all" || p.category===currentCategory;
  const s = searchTerm.trim().toLowerCase();
  const searchOk = !s || p.name.toLowerCase().includes(s);
  return catOk && searchOk;
}
function buildProductsOnce(){
  const list = $("productList");
  list.innerHTML = "";

  const t = i18n[lang] || i18n.en;

  products.forEach(p=>{
    const el = document.createElement("div");
    el.className = "product";
    el.dataset.pid = p.id;
    el.dataset.category = p.category;

    el.innerHTML = `
      <div class="pimg">
        <img
          src="${p.img || "assets/products/placeholder.jpg"}"
          alt="${p.name}"
          loading="lazy"
          decoding="async"
          draggable="false"
        />
        ${p.restricted ? `<span class="badge badge-top">18+</span>` : ``}
      </div>

      <div class="pname">${p.name}</div>
      <div class="muted small" data-catlabel></div>
      <div class="price">₪${formatILS(p.price)}</div>
      <button class="btn primary full" data-add="${p.id}" type="button">${t.addToCart}</button>
    `;

    list.appendChild(el);
    productEls.set(p.id, el);
  });

  // fill category label once
  updateProductCategoryLabels();
}

function updateProductCategoryLabels(){
  const t = i18n[lang] || i18n.en;
  productEls.forEach((el, id)=>{
    const p = products.find(x=>x.id===id);
    if (!p) return;
    const catLabel = t.cats[p.category]?.name || p.category;
    const labelEl = el.querySelector("[data-catlabel]");
    if (labelEl) labelEl.textContent = catLabel;
  });

  // also update button text for language
  document.querySelectorAll("[data-add]").forEach(btn=>{
    btn.textContent = (i18n[lang] || i18n.en).addToCart;
  });
}

function filterProductsView(){
  const s = searchTerm.trim().toLowerCase();

  productEls.forEach((el, id)=>{
    const p = products.find(x=>x.id===id);
    if (!p) return;

    const catOk = currentCategory==="all" || p.category===currentCategory;
    const searchOk = !s || p.name.toLowerCase().includes(s);

    el.classList.toggle("hidden", !(catOk && searchOk));
  });
}
function renderProducts(){
  const t = i18n[lang] || i18n.en;
  const filtered = products.filter(productMatches);

  $("productList").innerHTML = filtered.map(p=>{
    const catLabel = t.cats[p.category]?.name || p.category;

    return `
      <div class="product">
        <div class="pimg">
          <img
            src="${p.img || "assets/products/placeholder.jpg"}"
            alt="${p.name}"
            loading="lazy"
            onerror="this.src='assets/products/placeholder.jpg'"
          />
          ${p.restricted ? `<span class="badge badge-top">18+</span>` : ``}
        </div>

        <div class="pname">${p.name}</div>
        <div class="muted small">${catLabel}</div>

        <div class="price">₪${formatILS(p.price)}</div>
        <button class="btn primary full" data-add="${p.id}" type="button">${t.addToCart}</button>
      </div>
    `;
  }).join("");
}

// ======== CART ========
function addToCart(p){
  const found = cart.find(x=>x.id===p.id);
  if (found) found.qty += 1;
  else cart.push({ id:p.id, name:p.name, price:p.price, qty:1, restricted: !!p.restricted });

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

// ======== CHECKOUT (WhatsApp) ========
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

  // If user somehow reaches checkout without age ok
  if (!isAgeOk()) { showAgeGate(); return; }

  const { text, name, phone } = buildOrderText();
  if (!name || !phone) return alert(t.namePhoneReq);

  const url = `https://wa.me/${STORE_WHATSAPP}?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank");
}

// ======== EVENTS ========
function initEvents(){
  $("instagramBtn").href = INSTAGRAM_URL;
  $("wazeBtn").href = WAZE_URL;

  $("langSelect").addEventListener("change", (e)=> setLanguage(e.target.value));

  $("ageYes").addEventListener("click", ()=>{
    setAgeOk(true);   // session only
    hideAgeGate();
  });
  $("ageNo").addEventListener("click", ()=>{
    setAgeOk(false);
    exitWebsite();
  });

  $("openCartBtn").addEventListener("click", openCart);
  $("closeCartBtn").addEventListener("click", closeCart);
  $("cartBackdrop").addEventListener("click", closeCart);

  $("waQuickBtn").href =
    `https://wa.me/${STORE_WHATSAPP}?text=${encodeURIComponent("Hi! I want to order from Red Store.")}`;

  $("searchInput").addEventListener("input", (e)=>{
    searchTerm = e.target.value || "";
    filterProductsView();
  });

  $("categorySelect").addEventListener("change", (e)=>{
    currentCategory = e.target.value;
    renderCategories();
    filterProductsView();
  });

  $("categorySlider").addEventListener("click", (e)=>{
    const cat = e.target.closest("[data-cat]")?.getAttribute("data-cat");
    if (!cat) return;
    currentCategory = cat;
    renderCategories();
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

  // Add-to-cart
  document.addEventListener("click", (e)=>{
    const btn = e.target.closest("[data-add]");
    if (!btn) return;
    const id = btn.getAttribute("data-add");
    const p = products.find(x=>x.id===id);
    if (!p) return;
    if (!isAgeOk()) { showAgeGate(); return; }
    addToCart(p);
  });
}

// ======== BOOT ========
function boot(){
  applyLanguage();
  renderCategories();
  buildProductsOnce();      // ✅ create DOM once (images won’t reload)
  filterProductsView();     // ✅ just hide/show
  renderCart();
  initEvents();
  enforceEntryAgeGate();
}
document.addEventListener("DOMContentLoaded", boot);
