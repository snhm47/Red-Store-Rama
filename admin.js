// admin.js
import { auth, db, OWNER_EMAIL } from "./firebase-config.js";

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

const PLACEHOLDER_IMG = "assets/products/placeholder.jpg";
const $ = (id) => document.getElementById(id);

let editingId = null;

function setMsg(el, msg, isError=false){
  el.textContent = msg || "";
  el.style.color = isError ? "#ff7a7a" : "";
}

function popupError(message){
  alert(message); // ✅ simple popup as you asked
}

// ===== LOGIN =====
async function login(){
  const email = $("email").value.trim();
  const password = $("password").value;

  if (!email || !password){
    setMsg($("loginMsg"), "Missing email/password", true);
    popupError("Missing email or password");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    setMsg($("loginMsg"), "");
    // ✅ onAuthStateChanged will switch to dashboard
  } catch (e) {
    setMsg($("loginMsg"), e.message, true);
    popupError("Login failed: " + e.message);
  }
}

async function logout(){
  await signOut(auth);
}

// ===== FORM =====
function clearForm(){
  editingId = null;
  $("pName").value = "";
  $("pPrice").value = "";
  $("pCategory").value = "snacks";
  $("pRestricted").checked = false;
  $("pInStock").checked = true;
  $("pImgUrl").value = "";
  setMsg($("formMsg"), "");
}

async function saveProduct(){
  const user = auth.currentUser;
  if (!user) return popupError("Not logged in");
  if (user.email !== OWNER_EMAIL) return popupError("Not owner email");

  const name = $("pName").value.trim();
  const price = Number($("pPrice").value);
  const category = $("pCategory").value;
  const restricted = $("pRestricted").checked;
  const inStock = $("pInStock").checked;
  const imgUrl = $("pImgUrl").value.trim();

  if (!name) return popupError("Name required");
  if (!Number.isFinite(price) || price < 0) return popupError("Price must be a number");

  try {
    setMsg($("formMsg"), "Saving...");

    if (!editingId){
      await addDoc(collection(db, "products"), {
        name, price, category, restricted, inStock,
        imgUrl: imgUrl || PLACEHOLDER_IMG,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setMsg($("formMsg"), "✅ Added");
      clearForm();
    } else {
      const refDoc = doc(db, "products", editingId);
      const patch = {
        name, price, category, restricted, inStock,
        updatedAt: serverTimestamp(),
      };
      if (imgUrl) patch.imgUrl = imgUrl;
      await updateDoc(refDoc, patch);
      setMsg($("formMsg"), "✅ Updated");
    }
  } catch (e) {
    setMsg($("formMsg"), e.message, true);
    popupError("Save failed: " + e.message);
  }
}

async function editProduct(id){
  const refDoc = doc(db, "products", id);
  const snap = await getDoc(refDoc);
  if (!snap.exists()) return;

  const p = snap.data();
  editingId = id;

  $("pName").value = p.name || "";
  $("pPrice").value = p.price ?? "";
  $("pCategory").value = p.category || "snacks";
  $("pRestricted").checked = !!p.restricted;
  $("pInStock").checked = p.inStock !== false;
  $("pImgUrl").value = p.imgUrl || "";
  setMsg($("formMsg"), `Editing: ${id}`);
}

async function toggleStock(id, current){
  await updateDoc(doc(db, "products", id), {
    inStock: !current,
    updatedAt: serverTimestamp(),
  });
}

async function removeProduct(id){
  if (!confirm("Delete this product?")) return;
  await deleteDoc(doc(db, "products", id));
}

function renderAdminList(items){
  const box = $("productAdminList");
  box.innerHTML = "";

  items.forEach(p=>{
    const el = document.createElement("div");
    el.className = "admin-item";

    el.innerHTML = `
      <div class="admin-item-top">
        <div class="row gap" style="align-items:flex-start;">
          <div class="admin-thumb"><img src="${p.imgUrl || PLACEHOLDER_IMG}" alt=""></div>
          <div>
            <div style="font-weight:900;">${p.name}</div>
            <div class="muted small">₪${p.price} • ${p.category} • ${p.restricted ? "18+" : "OK"} • ${p.inStock ? "In stock" : "Out of stock"}</div>
            <div class="muted small">id: ${p.id}</div>
          </div>
        </div>

        <div class="admin-actions">
          <button class="btn ghost" data-edit="${p.id}" type="button">Edit</button>
          <button class="btn ghost" data-stock="${p.id}" type="button">${p.inStock ? "Set OUT" : "Set IN"}</button>
          <button class="btn" data-del="${p.id}" type="button">Delete</button>
        </div>
      </div>
    `;
    box.appendChild(el);
  });

  box.querySelectorAll("[data-edit]").forEach(b=>{
    b.addEventListener("click", ()=> editProduct(b.getAttribute("data-edit")));
  });

  box.querySelectorAll("[data-stock]").forEach(b=>{
    const id = b.getAttribute("data-stock");
    const p = items.find(x=>x.id===id);
    b.addEventListener("click", ()=> toggleStock(id, !!p?.inStock));
  });

  box.querySelectorAll("[data-del]").forEach(b=>{
    b.addEventListener("click", ()=> removeProduct(b.getAttribute("data-del")));
  });
}

function listenAdminProducts(){
  const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
  onSnapshot(q, (snap)=>{
    const items = snap.docs.map(d=>({ id: d.id, ...d.data() }));
    renderAdminList(items);
  });
}

function showLogin(){
  $("loginCard").classList.remove("hidden");
  $("dashCard").classList.add("hidden");
}

function showDash(user){
  $("loginCard").classList.add("hidden");
  $("dashCard").classList.remove("hidden");
  $("userInfo").textContent = `Logged in as: ${user.email}`;
}

function init(){
  $("loginBtn").addEventListener("click", login);
  $("logoutBtn").addEventListener("click", logout);
  $("saveBtn").addEventListener("click", saveProduct);
  $("clearFormBtn").addEventListener("click", clearForm);

  onAuthStateChanged(auth, (user)=>{
    if (!user) {
      showLogin();
      return;
    }

    if (user.email !== OWNER_EMAIL){
      showLogin();
      setMsg($("loginMsg"), "This email is not allowed to edit.", true);
      popupError("This email is not allowed to edit.");
      signOut(auth);
      return;
    }

    showDash(user);
    listenAdminProducts();
  });
}

document.addEventListener("DOMContentLoaded", init);
