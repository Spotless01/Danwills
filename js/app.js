// ================= DOM ELEMENTS =================
const container = document.getElementById("products");
const searchInput = document.getElementById("searchInput");
const checkboxes = document.querySelectorAll(".filter-group input");
const trendingContainer = document.getElementById("trending");

// ================= SCROLL ANIMATIONS =================
function initAnimations() {
  const elements = document.querySelectorAll('.animate, .reveal');

  if (!elements.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
      }
    });
  }, { threshold: 0.2 });

  elements.forEach(el => observer.observe(el));
}

// ================= RENDER PRODUCTS =================
function renderProducts(list) {
  if (!container) return;

  container.innerHTML = "";

  if (!list || list.length === 0) {
    container.innerHTML = "<p>No products found.</p>";
    return;
  }

  list.forEach(p => {

    // ⭐ Generate rating stars
    let stars = "";
    for (let i = 1; i <= 5; i++) {
      stars += `<span class="star ${i <= (p.rating || 4) ? "filled" : ""}">★</span>`;
    }

    container.innerHTML += `
      <div class="card">

        <img src="${p.image}" alt="${p.name}">

        <h3>${p.name}</h3>
        <p class="brand">${p.category}</p>

        <!-- ⭐ RATING -->
        <div class="rating">
          ${stars}
          <span class="rating-value">${p.rating || 4}/5</span>
        </div>

        <!-- 🧴 NOTES -->
        <div class="notes">
          <div><strong>Top:</strong> ${p.notes?.top || "-"}</div>
          <div><strong>Middle:</strong> ${p.notes?.middle || "-"}</div>
          <div><strong>Base:</strong> ${p.notes?.base || "-"}</div>
        </div>

        <p class="price">GHS ${p.price}</p>

        <a href="product.html?id=${p.id}" class="btn">View</a>

      </div>
    `;
  });
}

// ================= TRENDING =================
function renderTrending() {
  if (!trendingContainer) return;

  const trending = [...products]
    .sort((a, b) => (b.rating || 4) - (a.rating || 4))
    .slice(0, 4);

  trendingContainer.innerHTML = trending.map(p => `
    <div class="trending-item" onclick="goToProduct(${p.id})">
      <img src="${p.image}" alt="${p.name}">
      <div>
        <p>${p.name}</p>
        <span>⭐ ${p.rating || 4}</span>
      </div>
    </div>
  `).join("");
}

// ================= NAVIGATION =================
function goToProduct(id) {
  window.location.href = `product.html?id=${id}`;
}

function toggleMenu() {
  const nav = document.getElementById("navLinks");
  nav.classList.toggle("show");
}

document.querySelectorAll("#navLinks a").forEach(link => {
  link.addEventListener("click", () => {
    document.getElementById("navLinks").classList.remove("show");
  });
});

// ================= FILTER LOGIC =================
function filterProducts() {
  if (!searchInput) return;

  let search = searchInput.value.toLowerCase();

  let selectedCategories = Array.from(checkboxes)
    .filter(cb => cb.checked)
    .map(cb => cb.value);

  let filtered = products.filter(p => {

    let matchSearch = (p.name || "").toLowerCase().includes(search);

    let matchCategory =
  selectedCategories.length === 0 ||
  selectedCategories.includes((p.category || "").trim());

    return matchSearch && matchCategory;
  });

  renderProducts(filtered);
}

// ================= EVENTS =================
function initEvents() {
  if (searchInput) {
    searchInput.addEventListener("input", filterProducts);
  }

  if (checkboxes.length > 0) {
    checkboxes.forEach(cb => {
      cb.addEventListener("change", filterProducts);
    });
  }
}

// ================= INITIAL LOAD =================
document.addEventListener("DOMContentLoaded", () => {
  initAnimations();
  initEvents();

  // Only render if products exist
  if (Array.isArray(products)) {
    renderProducts(products);
    renderTrending();
  }
});

function payWithWhatsApp() {

  const phone = "233249144616";
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    alert("Your cart is empty");
    return;
  }

  let message = `Hello Danwilhs Fragrance Hub,%0A%0A`;
  message += `I want to make payment for the following items:%0A%0A`;

  let total = 0;

  cart.forEach(item => {
    let qty = item.qty || 1;
    let price = Number(item.price) || 0;
    let subtotal = price * qty;

    total += subtotal;

    message += `• ${item.name} (x${qty}) - GHS ${subtotal}%0A`;
  });

  message += `%0A*Total:* GHS ${total}%0A`;
  message += `%0APlease assist me with payment.`;

  // ✅ Show success BEFORE redirect
  showSuccess();

  setTimeout(() => {
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  }, 1000);
}

//Sucess Popup
function showSuccess() {
  const popup = document.getElementById("successPopup");
  if (popup) popup.style.display = "flex";
}

function closeSuccess() {
  const popup = document.getElementById("successPopup");
  if (popup) popup.style.display = "none";
}