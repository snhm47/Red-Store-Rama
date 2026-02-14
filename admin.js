// admin.js
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

function setMsg(el, msg, isError=false){
  if (!el) return;
  el.textContent = msg || "";
  el.style.color = isError ? "#ff7a7a" : "";
}

// ---------- AUTH ----------
async function login(){
  const email = $("email").value.trim();
  const password = $("password").value;

  if (!email || !password) {
    setMsg($("loginMsg"), "Missing email/password", true);
    alert("Missing email/password");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    setMsg($("loginMsg"), "");
  } catch (e) {
    // Popup + message
    setMsg($("loginMsg"), e.message, true);
    alert("Login failed:\n" + e.message);
  }
}

async function logout(){
  await signOut(auth);
}

// ---------- FORM ----------
function clearForm(){
  editingId = null;
  $("pName").value = "";
  $("pPrice").value = "";
  $("pCategory").value = "snacks";
  $("pRestricted").checked = false;
  $("pInStock").checked = true;

  // URL + file input
  const urlEl = $("pImgUrl");
  if (urlEl) urlEl.value = "";
  const fileEl = $("pImageFile");
  if (fileEl) fileEl.value = "";

  setMsg($("formMsg"), "");
  setMsg($("imgMsg"), "");
}

async function resizeImage(file, maxWidth = 1200, quality = 0.7) {
  return new Promise((resolve) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = e => {
      img.src = e.target.result;
    };

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const scale = maxWidth / img.width;
      const width = img.width > maxWidth ? maxWidth : img.width;
      const height = img.width > maxWidth ? img.height * scale : img.height;

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => resolve(blob),
        "image/jpeg",
        quality
      );
    };

    reader.readAsDataURL(file);
  });
}


async function uploadToCloudinary(file){
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UNSIGNED_PRESET ||
      CLOUDINARY_CLOUD_NAME.includes("YOUR_") || CLOUDINARY_UNSIGNED_PRESET.includes("YOUR_")) {
    throw new Error("Cloudinary is not configured (cloud name / upload preset).");
  }

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", CLOUDINARY_UNSIGNED_PRESET);

  // (optional) put images in folder
  // form.append("folder", "red-store/products");

  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

  const res = await fetch(endpoint, { method: "POST", body: form });
  const data = await res.json();

  if (!res.ok) {
    // Cloudinary errors come as { error: { message: ... } }
    throw new Error(data?.error?.message || "Cloudinary upload failed");
  }

  return data.secure_url || data.url;
}

async function handleUploadButton(){
  const file = $("pImageFile")?.files?.[0];
  if (!file) {
    setMsg($("imgMsg"), "Choose an image first (camera/gallery).", true);
    alert("Choose an image first.");
    return;
  }

  try {
    setMsg($("imgMsg"), "Uploading...");
    const url = await uploadToCloudinary(file);
    $("pImgUrl").value = url;
    setMsg($("imgMsg"), "✅ Uploaded! URL filled in.", false);
  } catch (e) {
    setMsg($("imgMsg"), e.message, true);
    alert("Image upload failed:\n" + e.message);
  }
}
// async function resizeImage(file, maxWidth = 1200, quality = 0.7) {
//   return new Promise((resolve) => {
//     const img = new Image();
//     const reader = new FileReader();

//     reader.onload = e => img.src = e.target.result;

//     img.onload = () => {
//       const canvas = document.createElement("canvas");
//       const scale = maxWidth / img.width;
//       const width = img.width > maxWidth ? maxWidth : img.width;
//       const height = img.width > maxWidth ? img.height * scale : img.height;

//       canvas.width = width;
//       canvas.height = height;

//       const ctx = canvas.getContext("2d");
//       ctx.drawImage(img, 0, 0, width, height);

//       canvas.toBlob(
//         (blob) => resolve(blob),
//         "image/jpeg",
//         quality
//       );
//     };

//     reader.readAsDataURL(file);
//   });
// }

async function saveProduct(){
  const user = auth.currentUser;
  if (!user) return setMsg($("formMsg"), "Not logged in", true);
  if (user.email !== OWNER_EMAIL)
    return setMsg($("formMsg"), "Not owner email", true);

  const name = $("pName").value.trim();
  const price = Number($("pPrice").value);
  const category = $("pCategory").value;
  const restricted = $("pRestricted").checked;
  const inStock = $("pInStock").checked;

  if (!name) return setMsg($("formMsg"), "Name required", true);
  if (!Number.isFinite(price) || price < 0)
    return setMsg($("formMsg"), "Price must be a number", true);

  try {
    setMsg($("formMsg"), "Uploading image...");

    let imgUrl = PLACEHOLDER_IMG;

    const file = $("pImage").files[0];

    if (file) {
      const compressedBlob = await resizeImage(file);

      const formData = new FormData();
      formData.append("file", compressedBlob);
      formData.append("upload_preset", "YOUR_UPLOAD_PRESET");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload",
        {
          method: "POST",
          body: formData
        }
      );

      const data = await res.json();

      if (!data.secure_url)
        throw new Error("Image upload failed");

      imgUrl = data.secure_url;
    }

    setMsg($("formMsg"), "Saving product...");

    if (!editingId) {
      await addDoc(collection(db, "products"), {
        name,
        price,
        category,
        restricted,
        inStock,
        imgUrl,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setMsg($("formMsg"), "✅ Product Added");
      clearForm();

    } else {
      await updateDoc(doc(db, "products", editingId), {
        name,
        price,
        category,
        restricted,
        inStock,
        imgUrl,
        updatedAt: serverTimestamp(),
      });

      setMsg($("formMsg"), "✅ Product Updated");
    }

  } catch (e) {
    setMsg($("formMsg"), e.message, true);
  }
}


async function editProduct(id){
  const snap = await getDoc(doc(db, "products", id));
  if (!snap.exists()) return;

  const p = snap.data();
  editingId = id;

  $("pName").value = p.name || "";
  $("pPrice").value = p.price ?? "";
  $("pCategory").value = p.category || "snacks";
  $("pRestricted").checked = !!p.restricted;
  $("pInStock").checked = p.inStock !== false;
  $("pImgUrl").value = p.imgUrl || "";
  if ($("pImageFile")) $("pImageFile").value = "";

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

// ---------- LIST ----------
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

// ---------- UI ----------
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

  // image upload button
  const uploadBtn = $("uploadImgBtn");
  if (uploadBtn) uploadBtn.addEventListener("click", handleUploadButton);

  // optional: auto-upload when file selected
  const fileEl = $("pImageFile");
  if (fileEl) fileEl.addEventListener("change", () => {
    // comment this out if you only want manual "Upload" click
    // handleUploadButton();
  });

  onAuthStateChanged(auth, (user)=>{
    if (!user) {
      showLogin();
      return;
    }

    if (user.email !== OWNER_EMAIL){
      showLogin();
      setMsg($("loginMsg"), "This email is not allowed to edit.", true);
      alert("This email is not allowed to edit.");
      signOut(auth);
      return;
    }

    showDash(user);
    listenAdminProducts();
  });
}

document.addEventListener("DOMContentLoaded", init);
