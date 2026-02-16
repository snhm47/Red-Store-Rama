import {
  auth, db, OWNER_EMAIL,
  CLOUDINARY_CLOUD_NAME, CLOUDINARY_UNSIGNED_PRESET
} from "./firebase-config.js";

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const PLACEHOLDER_IMG = "assets/logo.jpg";
const $ = (id) => document.getElementById(id);
let editingId = null;

/* =============================
   SUB CATEGORY MAP
============================= */
const SUB_CATEGORY_MAP = {
  alcohol: ["beer", "vodka", "whisky", "arak", "wine"],
  tobacco: ["cigarettes", "vapes", "cigars", "hookah", "rolling"],
  snacks: ["chips", "chocolate", "nuts", "drinks"],
  coffee: ["hot", "cold", "beans"]
};

/* =============================
   HELPERS
============================= */
function setMsg(el, msg, err=false){
  if (!el) return;
  el.textContent = msg || "";
  el.style.color = err ? "#ff7a7a" : "";
}

/* =============================
   AUTH
============================= */
async function login(){
  const email = $("email").value.trim();
  const password = $("password").value;
  if (!email || !password) return alert("Missing email/password");

  try { await signInWithEmailAndPassword(auth, email, password); }
  catch (e) { alert(e.message); }
}

async function logout(){ await signOut(auth); }

/* =============================
   CATEGORY LOGIC
============================= */
function updateSubCategories(){
  const main = $("pMainCategory").value;
  const subSelect = $("pSubCategory");
  subSelect.innerHTML = "";

  (SUB_CATEGORY_MAP[main] || []).forEach(sub=>{
    const opt = document.createElement("option");
    opt.value = sub;
    opt.textContent = sub;
    subSelect.appendChild(opt);
  });
}

/* =============================
   IMAGE UPLOAD
============================= */
async function uploadToCloudinary(file){
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", CLOUDINARY_UNSIGNED_PRESET);

  const endpoint =
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

  const res = await fetch(endpoint, { method:"POST", body:form });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Upload failed");
  return data.secure_url;
}

/* =============================
   SAVE PRODUCT
============================= */
async function saveProduct(){
  const user = auth.currentUser;
  if (!user || user.email !== OWNER_EMAIL)
    return alert("Not allowed");

  const name = $("pName").value.trim();
  const price = Number($("pPrice").value);
  const mainCategory = $("pMainCategory").value;
  const subCategory = $("pSubCategory").value;
  const restricted = $("pRestricted").checked;
  const inStock = $("pInStock").checked;

  if (!name) return alert("Name required");

  let imgUrl = $("pImgUrl").value || PLACEHOLDER_IMG;
  const file = $("pImageFile")?.files?.[0];
  if (file) imgUrl = await uploadToCloudinary(file);

  const data = {
    name,
    price,
    mainCategory,
    subCategory,
    restricted,
    inStock,
    imgUrl,
    updatedAt: serverTimestamp()
  };

  if (!editingId){
    await addDoc(collection(db,"products"),{
      ...data,
      createdAt: serverTimestamp()
    });
    alert("Product Added");
  } else {
    await updateDoc(doc(db,"products",editingId), data);
    alert("Product Updated");
  }

  clearForm();
}

function clearForm(){
  editingId = null;
  $("pName").value="";
  $("pPrice").value="";
  $("pImgUrl").value="";
  $("pImageFile").value="";
}

/* =============================
   LIST
============================= */
function renderAdminList(items){
  const box = $("productAdminList");
  box.innerHTML = "";

  items.forEach(p=>{
    const el = document.createElement("div");
    el.className = "admin-item";
    el.innerHTML = `
      <img src="${p.imgUrl || PLACEHOLDER_IMG}" width="70">
      <div>
        <strong>${p.name}</strong><br>
        ₪${p.price} • ${p.mainCategory} → ${p.subCategory}
      </div>
      <button data-edit="${p.id}">Edit</button>
      <button data-del="${p.id}">Delete</button>
    `;
    box.appendChild(el);
  });

  box.querySelectorAll("[data-edit]").forEach(b=>{
    b.onclick = ()=> editProduct(b.dataset.edit);
  });
  box.querySelectorAll("[data-del]").forEach(b=>{
    b.onclick = ()=> deleteDoc(doc(db,"products",b.dataset.del));
  });
}

async function editProduct(id){
  const snap = await getDoc(doc(db,"products",id));
  if (!snap.exists()) return;

  const p = snap.data();
  editingId = id;

  $("pName").value = p.name;
  $("pPrice").value = p.price;
  $("pMainCategory").value = p.mainCategory;
  updateSubCategories();
  $("pSubCategory").value = p.subCategory;
  $("pImgUrl").value = p.imgUrl;
}

/* =============================
   INIT
============================= */
function init(){
  $("loginBtn").onclick = login;
  $("logoutBtn").onclick = logout;
  $("saveBtn").onclick = saveProduct;
  $("clearFormBtn").onclick = clearForm;
  $("pMainCategory").onchange = updateSubCategories;

  updateSubCategories();

  onAuthStateChanged(auth,user=>{
    if (!user || user.email!==OWNER_EMAIL){
      $("loginCard").classList.remove("hidden");
      $("dashCard").classList.add("hidden");
      return;
    }

    $("loginCard").classList.add("hidden");
    $("dashCard").classList.remove("hidden");
    $("userInfo").textContent = user.email;

    const q = query(collection(db,"products"), orderBy("createdAt","desc"));
    onSnapshot(q,snap=>{
      const items = snap.docs.map(d=>({id:d.id,...d.data()}));
      renderAdminList(items);
    });
  });
}

document.addEventListener("DOMContentLoaded", init);
