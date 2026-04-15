import { collection, getDocs } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

let products = [];

// ================= LOAD PRODUCTS FROM FIREBASE =================
async function loadProducts() {
  try {
    const querySnapshot = await getDocs(collection(window.db, "products"));

    products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    renderProducts(products);
    renderTrending();

  } catch (err) {
    console.error("Error loading products:", err);
  }
}

// ================= FILTER =================
function filterByBrand(brand) {
  const filtered = products.filter(p =>
    p.brand.toLowerCase() === brand.toLowerCase()
  );

  renderProducts(filtered);

  document.getElementById("products")?.scrollIntoView({
    behavior: "smooth"
  });
}

function showAllProducts() {
  renderProducts(products);
}

// ================= INIT =================
document.addEventListener("DOMContentLoaded", loadProducts);
