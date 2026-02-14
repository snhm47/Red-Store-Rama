// admin.js
import { auth, db, storage, OWNER_EMAIL } from "./firebase-config.js";

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

import {
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";

const PLACEHOLDER_IMG = "assets/products/placeholder.jpg";
const MAX_IMG_MB = 3;

const $ = (id) => document.getElementById(id);

let editingId = null; // Firestore doc id

function setMsg(el, msg, isError = false) {
  if (!el) return;
  el.textContent = msg || "";
  el.style.color = isError ? "#ff7a7a" : "";
}

function showPopupError(message) {
  alert(message); // simple popup requested
}

// ===== LOGIN (with popup) =====
async function login() {
  const email = $("email")?.value.trim();
  const password = $("password")?.value;

  if (!email || !password) {
    setMsg($("loginMsg"), "Missing email/password", true);
    showPopupError("Missing email or password");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    setMsg($("loginMsg"), "");
    // Dashboard will show via onAuthStateChanged
  } catch (e) {
    const msg = firebaseNiceError(e);
    setMsg($("loginMsg"), msg, true);
    showPopupError(msg);
  }
}

async function logout() {
  await signOut(auth);
}

// Make Firebase errors readable
function firebaseNiceError(e) {
  const code = e?.code || "";
  if (code === "auth/invalid-credential") return "Wrong email or password.";
  if (code === "auth/wrong-password") return "Wrong password.";
  if (code === "auth/user-not-found") return "No user found with this email.";
  if (code === "auth/too-many-requests") return "Too many tries. Wait a bit and try again.";
  if (code === "auth/network-request-failed") return "Network error. Check internet.";
  return e?.message || "Login error.";
}

// ===== FORM =====
function clearForm() {
  editingId = null;

  $("pName").value = "";
  $("pPrice").value = "";
  $("pCategory").value = "snacks";
  $("pRestricted").checked = false;
  $("pInStock").checked = true;

  if ($("pImage")) $("pImage").value = "";

  const preview = $("imgPreview");
  if (preview) {
    preview.src = "";
    preview.classList.add("hidden");
  }

  setMsg($("formMsg"), "");
}

function setupImagePreview() {
  const input = $("pImage");
  const preview = $("imgPreview");
  if (!input || !preview) return;

  input.addEventListener("change", () => {
    const file = input.files?.[0];
    if (!file) {
      preview.src = "";
      preview.classList.add("hidden");
      return;
    }
    preview.src = URL.createObjectURL(file);
    preview.classList.remove("hidden");
  });
}

async function uploadImageIfAny() {
  const file = $("pImage")?.files?.[0];
  if (!file) return null;

  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file.");
  if (file.size > MAX_IMG_MB * 1024 * 1024) throw new Error(`Image too large. Max ${MAX_IMG_MB}MB.`);

  const safeName = `${Date.now()}_${file.name}`.replace(/[^\w.\-]+/g, "_");
  const storagePath = `products/${safeName}`;
  const storageRef = ref(storage, storagePath);

  await uploadBytes(storageRef, file, { contentType: file.type });
  return await getDownloadURL(storageRef);
}

async function saveProduct() {
  const user = auth.currentUser;
  if (!user) return setMsg($("formMsg"), "Not logged in", true);
  if (user.email !== OWNER_EMAIL) return setMsg($("formMsg"), "Not owner email", true);

  const name = $("pName").value.trim();
  const price = Number($("pPrice").value);
  const category = $("pCategory").value;
  const restricted = $("pRestricted").checked;
  const inStock = $("pInStock").checked;

  if (!name) return setMsg($("formMsg"), "Name required", true);
  if (!Number.isFinite(price) || price < 0) return setMsg($("formMsg"), "Price must be a number", true);

  try {
    setMsg($("formMsg"), "Saving...");

    const uploadedUrl = await uploadImageIfAny(); // null if no file

    if (!editingId) {
      // CREATE
      await addDoc(collection(db, "products"), {
        name,
        price,
        category,
        restricted,
        inStock,
        imgUrl: uploadedUrl || PLACEHOLDER_IMG,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setMsg($("formMsg"), "✅ Added");
      clearForm();
    } else {
      // UPDATE
      const refDoc = doc(db, "products", editingId);

      const patch = {
        name,
        price,
        category,
        restricted,
        inStock,
        updatedAt: serverTimestamp(),
      };

      // only update image if user selected a new file
      if (uploadedUrl) patch.imgUrl = uploadedUrl;

      await updateDoc(refDoc, patch);

      setMsg($("formMsg"), "✅ Updated");

      // reset file + preview
      if ($("pImage")) $("pImage").value = "";
      const preview = $("imgPreview");
      if (preview) {
        preview.src = "";
        preview.classList.add("hidden");
      }
    }
  } catch (e) {
    setMsg($("formMsg"), e.message, true);
    showPopupError(e.message);
  }
}

async function editProduct(id) {
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

  // show current image as preview (not a selected file)
  const preview = $("imgPreview");
  if (preview) {
    preview.src = p.imgUrl || PLACEHOLDER_IMG;
    preview.classList.remove("hidden");
  }

  if ($("pImage")) $("pImage").value = "";
  setMsg($("formMsg"), `Editing: ${id}`);
}

async function toggleStock(id, current) {
  await updateDoc(doc(db, "products", id), {
    inStock: !current,
    updatedAt: serverTimestamp(),
  });
}

async function removeProduct(id) {
  if (!confirm("Delete this product?")) return;
  await deleteDoc(doc(db, "products", id));
}

// ===== LIST =====
function renderAdminList(items) {
  const box = $("productAdminList");
  box.innerHTML = "";

  items.forEach((p) => {
    const el = document.createElement("div");
    el.className = "admin-item";

    el.innerHTML = `
      <div class="admin-item-top">
        <div class="row gap" style="align-items:flex-start;">
          <div class="admin-thumb"><img src="${p.imgUrl || PLACEHOLDER_IMG}" alt=""></div>
          <div>
            <div style="font-weight:900;">${escapeHtml(p.name)}</div>
            <div class="muted small">₪${p.price} • ${escapeHtml(p.category)} • ${p.restricted ? "18+" : "OK"} • ${p.inStock ? "In stock" : "Out of stock"}</div>
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

  box.querySelectorAll("[data-edit]").forEach((b) => {
    b.addEventListener("click", () => editProduct(b.getAttribute("data-edit")));
  });

  box.querySelectorAll("[data-stock]").forEach((b) => {
    const id = b.getAttribute("data-stock");
    const p = items.find((x) => x.id === id);
    b.addEventListener("click", () => toggleStock(id, !!p?.inStock));
  });

  box.querySelectorAll("[data-del]").forEach((b) => {
    b.addEventListener("click", () => removeProduct(b.getAttribute("data-del")));
  });
}

function listenAdminProducts() {
  const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
  onSnapshot(q, (snap) => {
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    renderAdminList(items);
  });
}

// Prevent HTML injection in admin list
function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// ===== BOOT =====
function showLogin() {
  $("loginCard").classList.remove("hidden");
  $("dashCard").classList.add("hidden");
}

function showDash(user) {
  $("loginCard").classList.add("hidden");
  $("dashCard").classList.remove("hidden");
  $("userInfo").textContent = `Logged in as: ${user.email}`;
}

function init() {
  $("loginBtn").addEventListener("click", login);
  $("logoutBtn").addEventListener("click", logout);

  $("saveBtn").addEventListener("click", saveProduct);
  $("clearFormBtn").addEventListener("click", clearForm);

  setupImagePreview();

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      showLogin();
      return;
    }

    if (user.email !== OWNER_EMAIL) {
      showLogin();
      setMsg($("loginMsg"), "This email is not allowed to edit.", true);
      showPopupError("This email is not allowed to edit.");
      signOut(auth);
      return;
    }

    showDash(user);
    listenAdminProducts();
  });
}

document.addEventListener("DOMContentLoaded", init);
