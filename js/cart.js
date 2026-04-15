// ================= CART STATE =================
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ================= SAVE =================
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ================= ADD TO CART =================
function addToCart(product, btn) {
  if (!product || !product.id) {
    alert("Invalid product");
    return;
  }

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.image || "",
      qty: 1
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  showToast("Added to cart 🛒");
  updateCartCount();

  if (btn) {
    btn.innerText = "Added ✓";
    btn.disabled = true;

    setTimeout(() => {
      btn.innerText = "Add to Cart";
      btn.disabled = false;
    }, 1500);
  }
}

// Increase quantity
function increaseQty(index) {
  cart[index].qty += 1;
  saveCart();
  renderCart();
}

// Decrease quantity
function decreaseQty(index) {
  if (cart[index].qty > 1) {
    cart[index].qty -= 1;
  } else {
    cart.splice(index, 1); // remove if qty = 0
  }

  saveCart();
  renderCart();
}

// Remove item completely
function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
}

// Render cart
function renderCart() {
  const el = document.getElementById("cartItems");
  const totalEl = document.getElementById("total");
  const checkoutBtn = document.getElementById("checkoutBtn");

  if (!el) return;

  // Empty cart
  if (cart.length === 0) {
    el.innerHTML = "<p>Your cart is empty.</p>";
    totalEl.innerText = "";

    if (checkoutBtn) checkoutBtn.style.display = "none";
    return;
  }

  let total = 0;
  el.innerHTML = "";

  cart.forEach((item, index) => {
    const name = item.name || "Unknown Product";
const price = Number(item.price) || 0;
const qty = item.qty || 1;
const itemTotal = price * qty;

    total += itemTotal;

    el.innerHTML += `
      <div class="cart-item">

  <img src="${item.image}"
     onerror="this.style.display='none'"
     style="width:60px;height:60px;object-fit:cover">

  <div>
    <strong>${item.name || "Unknown Product"}</strong><br>
    <small>${item.size || ""}ml</small>
  </div>

        <div>
          <button onclick="decreaseQty(${index})">−</button>
          <span>${qty}</span>
          <button onclick="increaseQty(${index})">+</button>
        </div>

        <div>GHS ${itemTotal}</div>

        <button onclick="removeItem(${index})">❌</button>

      </div>
    `;
  });

  totalEl.innerText = "Total: GHS " + total;

  if (checkoutBtn) checkoutBtn.style.display = "inline-block";
checkoutBtn.href = "checkout.html";
}

// Run
renderCart();

function updateCartCount() {
  const countEl = document.getElementById("cartCount");
  if (!countEl) return;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  let totalItems = 0;
  cart.forEach(item => totalItems += item.qty || 1);

  countEl.innerText = totalItems;
}

// Go to Cart
function goToCart() {
  window.location.href = "cart.html";
}

// Run on load
updateCartCount();

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.innerText = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
});
