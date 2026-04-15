// ================= LOAD CART =================
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ================= GET CUSTOMER =================
function getCustomer() {
  return {
    name: document.getElementById("name")?.value.trim() || "",
    phone: document.getElementById("phone")?.value.trim() || "",
    email: document.getElementById("email")?.value.trim() || "",
    address: document.getElementById("address")?.value.trim() || ""
  };
}

function validateCustomer(c) {
  if (!c.name || !c.phone || !c.address) {
    alert("Please fill all required fields");
    return false;
  }
  return true;
}

// ================= RENDER CHECKOUT =================
function renderCheckout() {
  const items = document.getElementById("checkoutItems");
  const totalEl = document.getElementById("checkoutTotal");

  if (!items) return;

  let total = 0;
  items.innerHTML = "";

  if (cart.length === 0) {
    items.innerHTML = "<p>Your cart is empty.</p>";
    totalEl.innerText = "";
    return;
  }

  cart.forEach(item => {
    const qty = item.qty || 1;
    const price = Number(item.price) || 0;
    const itemTotal = price * qty;

    total += itemTotal;

    items.innerHTML += `
      <div class="cart-item">
        <span><strong>${item.name}</strong></span>
        <span>${qty} × GHS ${price}</span>
        <span>= GHS ${itemTotal}</span>
      </div>
    `;
  });

  totalEl.innerText = "Total: GHS " + total;
  window.checkoutTotal = total;
}

if (!cart.length) {
  document.querySelectorAll(".btn").forEach(btn => btn.disabled = true);
}

// ================= PAYSTACK =================
function payWithPaystack() {

  if (!cart.length) {
    alert("Your cart is empty");
    return;
  }

  const customer = getCustomer();
  if (!validateCustomer(customer)) return;

  let handler = PaystackPop.setup({
    key: "YOUR_PUBLIC_KEY",
    email: customer.email || "customer@danwillhs.com",
    amount: window.checkoutTotal * 100,
    currency: "GHS",

    callback: function () {
      showThankYou();

      localStorage.removeItem("cart");
      cart = [];

      updateCartCount();

      setTimeout(() => {
        window.location.href = "index.html";
      }, 2500);
    }
  });

  handler.openIframe();
}

// ================= WHATSAPP =================
function payWithWhatsApp() {

  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

  if (!cart.length) {
    alert("Cart is empty");
    return;
  }

const name = document.getElementById("name")?.value?.trim() || "";
const phone = document.getElementById("phone")?.value?.trim() || "";
const address = document.getElementById("address")?.value?.trim() || "";
const email = document.getElementById("email")?.value?.trim() || "";


console.log("FIELDS FOUND:",
  document.getElementById("name"),
  document.getElementById("phone"),
  document.getElementById("address"),
  document.getElementById("email")
);

  console.log("Customer:", { name, phone, address, email });

  if (!name || !phone || !address) {
    alert("Please fill all required fields");
    return;
  }

  const businessPhone = "233249144616";

  let message = `Hello Danwilhs Fragrance Hub,%0A%0A`;

  message += `🧾 *NEW ORDER*%0A%0A`;

  message += `👤 *Customer Details*%0A`;
  message += `Name: ${name}%0A`;
  message += `Phone: ${phone}%0A`;
  message += `Address: ${address}%0A`;
  message += `Email: ${email || "N/A"}%0A%0A`;

  message += `🛍️ *Items*%0A`;

  let total = 0;

  cart.forEach(item => {
    const qty = item.qty || 1;
    const price = Number(item.price) || 0;
    const subtotal = qty * price;

    total += subtotal;

    message += `• ${item.name} x${qty} = GHS ${subtotal}%0A`;
  });

  message += `%0A💰 *Total:* GHS ${total}`;

  showThankYou();

  setTimeout(() => {
    window.open(`https://wa.me/${businessPhone}?text=${message}`, "_blank");

    localStorage.removeItem("cart");
    cart = [];

    updateCartCount();

  }, 1000);
}

// ================= THANK YOU POPUP =================
function showThankYou() {
  const popup = document.getElementById("thankYouPopup");
  if (popup) popup.style.display = "flex";
}

function closeThankYou() {
  const popup = document.getElementById("thankYouPopup");
  if (popup) popup.style.display = "none";
}

// ================= INIT =================
renderCheckout();
updateCartCount();

// ✅ make global (VERY IMPORTANT)
window.showThankYou = showThankYou;
window.closeThankYou = closeThankYou;
window.payWithWhatsApp = payWithWhatsApp;
window.payWithPaystack = payWithPaystack;
