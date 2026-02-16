// products-seed.js
export const SEED_PRODUCTS = [
  {
    id: "vodka_700",
    mainCategory: "alcohol",     // ✅ (or keep "category", both work)
    subCategory: "vodka",
    restricted: true,
    inStock: true,
    price: 90,
    imgUrl: "assets/products/vodka_700.webp",

    // ✅ this matches app.js productName()
    name_i18n: {
      en: "Vodka 700ml",
      he: "וודקה 700 מ״ל",
      ar: "فودكا 700 مل"
    }
  }
];
