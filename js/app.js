import { db } from "./firebase.js";

import {
  collection,
  getDocs,
  query,
  limit
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";



// ================= DOM ELEMENTS =================
const container = document.getElementById("products");
const searchInput = document.getElementById("searchInput");
const checkboxes = document.querySelectorAll(".filter-group input");
const trendingContainer = document.getElementById("trending");


let products = []; // ✅ now comes from Firebase

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


async function loadProductsFromFirebase() {
  if (!container && !trendingContainer) return;

  if (container) {
    container.innerHTML = "Loading products...";
  }

  try {
    const snap = await getDocs(collection(db, "products"));

    products = [];

    snap.forEach(doc => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });

    renderProducts(products);

    const trending = products.filter(p => p.trending === true);
    renderTrending(trending);

  } catch (err) {
    console.error(err);

    if (container) {
      container.innerHTML = "Failed to load products";
    }
  }
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

    let stars = "";
    for (let i = 1; i <= 5; i++) {
      stars += `<span class="star ${i <= (p.rating || 4) ? "filled" : ""}">★</span>`;
    }

    container.innerHTML += `
  <div class="card" data-id="${p.id}">

    <img src="${p.image}" alt="${p.name}">

    <h3>${p.name}</h3>
    <p class="brand">${p.brand}</p>

    <div class="rating">
      ${stars}
      <span class="rating-value">${p.rating || 4}/5</span>
    </div>

    <p class="price">GHS ${p.price}</p>

    <div class="card-actions">
      <button class="btn view-btn">View</button>

      <button 
        class="btn add-cart-btn"
        data-product='${encodeURIComponent(JSON.stringify(p))}'>
        Add
      </button>
    </div>

  </div>
`;

  });
}


document.body.addEventListener("click", (e) => {

  // ADD TO CART
  const addBtn = e.target.closest(".add-cart-btn");
  if (addBtn) {
    const product = JSON.parse(
      decodeURIComponent(addBtn.dataset.product)
    );

    window.addToCart(product);

    const img = addBtn.closest(".card")?.querySelector("img");
    if (img) flyToCart(img);

    return;
  }

  // VIEW BUTTON
  const viewBtn = e.target.closest(".view-btn");
  if (viewBtn) {
    const card = viewBtn.closest(".card");
    goToProduct(card.dataset.id);
    return;
  }

  // CLICK CARD
  const card = e.target.closest(".card");
  if (card) {
    goToProduct(card.dataset.id);
  }

});



window.addEventListener("scroll", () => {
  const scrolled = window.scrollY;

  document.querySelectorAll(".parallax").forEach(el => {
    const speed = el.getAttribute("data-speed") || 0.3;
    el.style.transform = `translateY(${scrolled * speed}px)`;
  });
});

function flyToCart(imgElement) {
  const cart = document.querySelector(".floating-cart");
  const img = imgElement.cloneNode(true);

  img.classList.add("fly-item");

  const rect = imgElement.getBoundingClientRect();
  img.style.left = rect.left + "px";
  img.style.top = rect.top + "px";

  document.body.appendChild(img);

  const cartRect = cart.getBoundingClientRect();

  setTimeout(() => {
    img.style.left = cartRect.left + "px";
    img.style.top = cartRect.top + "px";
    img.style.opacity = 0.3;
    img.style.transform = "scale(0.3)";
  }, 50);

  setTimeout(() => img.remove(), 800);
}

// ================= TRENDING =================
function renderTrending(products) {
  const track = document.getElementById("trending");

  if (!track) return; // 🛑 prevents crash

  track.innerHTML = "";

  products.forEach(product => {
    const card = document.createElement("div");
    card.classList.add("trending-item");

    card.addEventListener("click", () => {
      goToProduct(product.id);
    });

    card.innerHTML = `
      <div class="media">
        <img src="${product.image}" class="product-img">

        ${product.video ? `
          <video class="preview-video" muted loop playsinline>
            <source src="${product.video}" type="video/mp4">
          </video>
        ` : ""}
      </div>

      <div class="trending-info">
        <h4>${product.name}</h4>
        <p class="trending-price">GH₵ ${product.price}</p>
      </div>
    `;

    track.appendChild(card);

    const video = card.querySelector(".preview-video");

    if (video) {
      card.addEventListener("mouseenter", () => {
        video.currentTime = 0;
        video.play();
      });

      card.addEventListener("mouseleave", () => {
        video.pause();
        video.currentTime = 0;
      });
    }
  });
}

// ================= NAVIGATION =================
function goToProduct(id) {
  window.location.href = `product.html?id=${id}`;
}

function toggleMenu() {
  const nav = document.getElementById("navLinks");
  if (!nav) return;
  nav.classList.toggle("show");
}

// ================= AUTO CLOSE NAV =================
document.addEventListener("click", function (e) {
  const nav = document.getElementById("navLinks");
  const toggle = document.querySelector(".menu-toggle");

  if (!nav || !toggle) return;

  const isClickInsideNav = nav.contains(e.target);
  const isClickToggle = toggle.contains(e.target);

  if (!isClickInsideNav && !isClickToggle) {
    nav.classList.remove("show");
  }
});

function initNav() {
  const nav = document.getElementById("navLinks");
  if (!nav) return;

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("show");
    });
  });
}

// ================= FILTER LOGIC =================
function showAllProducts() {
  if (!searchInput) return;

  searchInput.value = "";
  checkboxes.forEach(cb => cb.checked = false);

  renderProducts(products);
}

function filterProducts() {
  if (!searchInput) return;

  let search = searchInput.value.toLowerCase();

  let selectedBrands = Array.from(checkboxes)
    .filter(cb => cb.checked)
    .map(cb => cb.value);

  let filtered = products.filter(p => {

    let matchSearch =
      (p.name || "").toLowerCase().includes(search) ||
      (p.brand || "").toLowerCase().includes(search);

    let matchBrand =
      selectedBrands.length === 0 ||
      selectedBrands.includes((p.brand || "").trim());

    return matchSearch && matchBrand;
  });

  renderProducts(filtered);
}


function filterByBrand(brand) {
  if (!searchInput) return;

  searchInput.value = "";

  const mainBrands = ["Lattafa", "Armaf", "Creed", "Tom Ford"];

  let filtered;

  if (brand === "Other") {
    filtered = products.filter(p => !mainBrands.includes(p.brand));
  } else {
    filtered = products.filter(p => p.brand === brand);
  }

  renderProducts(filtered);

  document.getElementById("products")
    ?.scrollIntoView({ behavior: "smooth" });
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



function payWithWhatsApp(btn) {

  const phone = "233249144616";
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    alert("Your cart is empty");
    return;
  }

  // 🔥 BUTTON LOADING STATE
  if (btn) {
    btn.innerText = "Processing...";
    btn.disabled = true;
  }

  let message = `Hello Danwilhs Fragrance Hub,%0A%0A`;
  message += `I want to order:%0A%0A`;

  let total = 0;

  cart.forEach(item => {
    let qty = item.qty || 1;
    let price = Number(item.price) || 0;
    let subtotal = price * qty;

    total += subtotal;

    message += `• ${item.name} (x${qty}) - GHS ${subtotal}%0A`;
  });

  message += `%0A*Total:* GHS ${total}`;

  // 🔥 SHOW SUCCESS FIRST
  showSuccess();

  // 🔊 SOUND (subtle click feel)
  playSuccessSound();

  // 📳 VIBRATION (mobile luxury feel)
  if (navigator.vibrate) navigator.vibrate([10, 40, 10]);

  // 🧹 CLEAR CART (IMPORTANT)
  localStorage.removeItem("cart");
  updateCartCount();

  setTimeout(() => {
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  }, 900);
}

//Sucess Popup
function showSuccess() {
  const popup = document.getElementById("successPopup");
  if (!popup) return;

  popup.classList.add("show");

  setTimeout(() => {
    popup.classList.remove("show");

    // 🔥 OPTIONAL: reload cart page clean
    setTimeout(() => {
      window.location.reload();
    }, 300);

  }, 2500);
}

function closeSuccess() {
  const popup = document.getElementById("successPopup");
  if (popup) popup.classList.remove("show");
}

function playSuccessSound() {
  const audio = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-positive-interface-beep-221.mp3");
  audio.volume = 0.3;
  audio.play();
}

// ================= CONTACT FORM → WHATSAPP =================
 document.addEventListener("DOMContentLoaded", () => {
  initAnimations();
  initEvents();
  initNav();

  loadProductsFromFirebase(); // shop
  loadAboutProducts();        // about page

  // scroll reveal
  const reveals = document.querySelectorAll(".section");

  window.addEventListener("scroll", () => {
    reveals.forEach(el => {
      const top = el.getBoundingClientRect().top;
      if (top < window.innerHeight - 100) {
        el.classList.add("active");
      }
    });
  });

  // CONTACT FORM
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const message = document.getElementById("message").value;

      const phone = "233249144616";

      let text = `Hello Danwilhs Fragrance Hub,%0A%0A`;
      text += `Name: ${name}%0A`;
      text += `Email: ${email}%0A%0A`;
      text += `Message:%0A${message}`;

      window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
    });
  }

  
});

function openQuickView(product) {
  document.getElementById("quickView").style.display = "flex";
  document.getElementById("quickImg").src = product.image;
  document.getElementById("quickName").textContent = product.name;
  document.getElementById("quickPrice").textContent = "GHS " + product.price;
  document.getElementById("quickLink").href = `product.html?id=${product.id}`;
}

function closeQuickView() {
  document.getElementById("quickView").style.display = "none";
}

function openQuickViewById(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;
  openQuickView(product);
}


window.toggleMenu = toggleMenu;
window.goToCart = goToCart;
window.goToProduct = goToProduct;
window.filterByBrand = filterByBrand;
window.showAllProducts = showAllProducts;

window.payWithWhatsApp = payWithWhatsApp;

window.addToCart = window.addToCart || function(product) {
  console.error("addToCart not found. Check cart.js load order.");
};



window.addEventListener("scroll", () => {
  const reveals = document.querySelectorAll(".section");

  reveals.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < window.innerHeight - 100) {
      el.classList.add("active");
    }
  });
});

async function loadAboutProducts() {
  const aboutProducts = document.getElementById("aboutProducts");
  if (!aboutProducts) return;

  try {
    const q = query(collection(db, "products"), limit(4));
    const snap = await getDocs(q);

    aboutProducts.innerHTML = snap.docs.map(doc => {
      const p = doc.data();

      return `
        <div class="card" onclick="location.href='product.html?id=${doc.id}'">
          <img src="${p.image}" alt="${p.name}">
          <h3>${p.name}</h3>
          <p class="price">GHS ${p.price}</p>
        </div>
      `;
    }).join("");

  } catch (err) {
    console.error("About products failed:", err);
  }
}
