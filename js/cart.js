// Load cart
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Save cart helper
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Add to cart
function addToCart(id, btn) {
  let size = document.getElementById("size")?.value || "50";
  const product = products.find(p => p.id == id);

  const existing = cart.find(item => item.id == id && item.size == size);

  if (existing) {
    existing.qty = (existing.qty || 1) + 1;
  } else {
    cart.push({ ...product, size, qty: 1 });
  }

  saveCart();

  // Button feedback
  if (btn) {
    const originalText = btn.innerText;

    btn.innerText = "Added ✓";
    btn.disabled = true;

    setTimeout(() => {
      btn.innerText = originalText;
      btn.disabled = false;
    }, 2000);
  }


updateCartCount(); // 👈 ADD THIS
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
    const qty = item.qty || 1;
    const itemTotal = item.price * qty;

    total += itemTotal;

    el.innerHTML += `
      <div class="cart-item">
        
        <div>
          <strong>${item.name}</strong><br>
          <small>${item.size}ml</small>
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
}

// Run
renderCart();

function updateCartCount() {
  const countEl = document.getElementById("cartCount");
  if (!countEl) return;

  let totalItems = 0;
  cart.forEach(item => totalItems += item.qty || 1);

  countEl.innerText = totalItems;

  // Bounce effect
  countEl.classList.add("bounce");
  setTimeout(() => countEl.classList.remove("bounce"), 400);
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