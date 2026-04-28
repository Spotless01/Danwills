import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
  query
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

const form = document.getElementById("productForm");
const list = document.getElementById("productList");
const preview = document.getElementById("preview");
const imageInput = document.getElementById("image");

// ================= IMAGE PREVIEW =================
imageInput.addEventListener("input", function () {
  preview.src = this.value;
  preview.style.display = this.value ? "block" : "none";
});

// ================= ADD PRODUCT =================
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const product = {
    name: document.getElementById("name").value.trim(),
    price: Number(document.getElementById("price").value),
    brand: document.getElementById("brand").value,
    image: imageInput.value.trim(),
    createdAt: Date.now()
  };

  if (!product.name || !product.price || !product.brand || !product.image) {
    alert("Please fill all fields correctly");
    return;
  }

  try {
    await addDoc(collection(window.db, "products"), product);

    alert("✅ Product added successfully!");

    form.reset();
    preview.style.display = "none";

    loadProducts();

  } catch (err) {
    console.error(err);
    alert("❌ Failed to add product");
  }
});

// ================= LOAD PRODUCTS =================
async function loadProducts() {
  try {
    list.innerHTML = "<p>Loading...</p>";

    const q = query(
      collection(window.db, "products"),
      orderBy("createdAt", "desc")
    );

    const snap = await getDocs(q);

    if (snap.empty) {
      list.innerHTML = "<p>No products yet.</p>";
      return;
    }

    list.innerHTML = "";

    snap.forEach((docSnap) => {
      const p = docSnap.data();

      list.innerHTML += `
        <div style="
          display:flex;
          gap:10px;
          margin:10px 0;
          padding:10px;
          background:#111;
          color:#fff;
          border-radius:10px;
          align-items:center;
        ">
          <img src="${p.image}" style="
            width:60px;
            height:60px;
            object-fit:cover;
            border-radius:6px;
          ">

          <div style="flex:1;">
            <strong>${p.name}</strong><br>
            <small>${p.brand} - GHS ${p.price}</small>
          </div>

          <button onclick="deleteProduct('${docSnap.id}')" style="
            background:red;
            color:#fff;
            border:none;
            padding:6px 10px;
            cursor:pointer;
            border-radius:6px;
          ">
            Delete
          </button>
        </div>
      `;
    });

  } catch (err) {
    console.error(err);
    list.innerHTML = "<p style='color:red;'>Failed to load products</p>";
  }
}

// ================= DELETE =================
window.deleteProduct = async function(id) {
  if (!confirm("Delete this product?")) return;

  try {
    await deleteDoc(doc(window.db, "products", id));
    loadProducts();
  } catch (err) {
    console.error(err);
    alert("❌ Failed to delete product");
  }
};

// ================= INIT =================
window.addEventListener("DOMContentLoaded", loadProducts);
