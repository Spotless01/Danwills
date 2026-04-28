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

  saveCart();

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

  // 🔥 sync with drawer
  if (typeof renderCartDrawer === "function") {
    renderCartDrawer();
  }


  // Smooth vibration feedback (mobile luxury feel)
if (navigator.vibrate) navigator.vibrate(10);
}

// Increase quantity
function increaseQty(index) {
  cart[index].qty += 1;
  saveCart();
  renderCart();
  updateCartCount();
}

// Decrease quantity
function decreaseQty(index) {
  if (cart[index].qty > 1) {
    cart[index].qty -= 1;
  } else {
    cart.splice(index, 1);
  }

  saveCart();
  renderCart();
  updateCartCount();
}

// Remove item completely
function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
  updateCartCount();
}

// Render cart
function renderCart() {
  const el = document.getElementById("cartItems");
  const totalEl = document.getElementById("total");
  const grandTotalEl = document.getElementById("grandTotal");
  const checkoutBtn = document.getElementById("checkoutBtn");
  const empty = document.getElementById("emptyCart");

  if (!el) return;

  // EMPTY STATE
  if (cart.length === 0) {
    el.innerHTML = "";
    if (empty) empty.style.display = "block";

    if (totalEl) totalEl.innerText = "GHS 0";
    if (grandTotalEl) grandTotalEl.innerText = "GHS 0";

    if (checkoutBtn) checkoutBtn.style.display = "none";
    return;
  }

  if (empty) empty.style.display = "none";

  let total = 0;
  el.innerHTML = "";

  cart.forEach((item, index) => {
    const price = Number(item.price) || 0;
    const qty = item.qty || 1;
    const itemTotal = price * qty;

    total += itemTotal;

    el.innerHTML += `
      <div class="cart-item">

        <img src="${item.image}" onerror="this.style.display='none'">

        <div class="cart-info">
          <h4>${item.name}</h4>
          <p>${item.size || ""}ml</p>
        </div>

        <div class="cart-controls">
          <button onclick="decreaseQty(${index})">−</button>
          <span>${qty}</span>
          <button onclick="increaseQty(${index})">+</button>
        </div>

        <div class="cart-price">GHS ${itemTotal}</div>

        <button class="remove" onclick="removeItem(${index})">
          <i class="fas fa-trash"></i>
        </button>

      </div>
    `;
  });

  if (totalEl) totalEl.innerText = "GHS " + total;
  if (grandTotalEl) grandTotalEl.innerText = "GHS " + total;

  if (checkoutBtn) checkoutBtn.style.display = "inline-block";
}


function updateCartCount() {
  const countEl = document.getElementById("cartCount");
  if (!countEl) return;

  let totalItems = 0;
  cart.forEach(item => totalItems += item.qty || 1);

  countEl.innerText = totalItems;
}

// Go to Cart
function goToCart() {
  window.location.href = "cart.html";
}

document.addEventListener("DOMContentLoaded", () => {
  renderCart();
  updateCartCount();
});

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




window.addToCart = addToCart;
window.updateCartCount = updateCartCount;
window.goToCart = goToCart;
window.removeItem = removeItem;
window.increaseQty = increaseQty;
window.decreaseQty = decreaseQty;
