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
    const itemTotal = item.price * qty;

    total += itemTotal;

    items.innerHTML += `
      <div class="cart-item">
        <span>${item.name} (${item.size}ml)</span>
        <span>${qty} × GHS ${item.price}</span>
        <span>= GHS ${itemTotal}</span>
      </div>
    `;
  });

  totalEl.innerText = "Total: GHS " + total;
}

function handlePayment() {
  const email = document.getElementById("email").value;


  const btn = document.querySelector(".btn");
  btn.innerText = "Processing...";
  btn.disabled = true;

  payWithPaystack(email);
}

function payWithPaystack() {
  let emailInput = document.getElementById("email");
  let email = emailInput?.value || "customer@danwillhs.com";

  let total = cart.reduce((sum, item) => {
    return sum + (item.price * (item.qty || 1));
  }, 0);

  let handler = PaystackPop.setup({
    key: "YOUR_PUBLIC_KEY",
    email: email,
    amount: total * 100,
    currency: "GHS",
    callback: function () {
      showSuccess(); // 🎉

      localStorage.removeItem("cart");

      setTimeout(() => {
        window.location.href = "index.html";
      }, 2000);
    }
  });

  handler.openIframe();
}

renderCheckout();
