function filterByBrand(brand) {
  const filtered = products.filter(p => 
    p.brand.toLowerCase() === brand.toLowerCase()
  );

  displayProducts(filtered);

  document.getElementById("products")?.scrollIntoView({
    behavior: "smooth"
  });
}

function showAllProducts() {
  displayProducts(products);
}

// ================= INTELLIGENCE ENGINE =================

// Realistic fragrance database (expandable)
const fragranceDB = {
  woody: {
    accords: ["Woody", "Smoky", "Earthy"],
    notes: {
      top: ["Bergamot", "Lemon"],
      middle: ["Cedar", "Patchouli"],
      base: ["Sandalwood", "Amber", "Musk"]
    }
  },

  fresh: {
    accords: ["Citrus", "Fresh", "Aquatic"],
    notes: {
      top: ["Lemon", "Grapefruit"],
      middle: ["Lavender", "Mint"],
      base: ["Musk", "Amber"]
    }
  },

  sweet: {
    accords: ["Vanilla", "Sweet", "Amber"],
    notes: {
      top: ["Apple", "Caramel"],
      middle: ["Tonka Bean", "Chocolate"],
      base: ["Vanilla", "Amber", "Musk"]
    }
  },

  spicy: {
    accords: ["Spicy", "Warm", "Amber"],
    notes: {
      top: ["Pepper", "Cardamom"],
      middle: ["Cinnamon", "Clove"],
      base: ["Amber", "Vanilla", "Oud"]
    }
  }
};

// Auto assign profile
function enhanceProduct(product) {
  const profiles = Object.keys(fragranceDB);
  const profile = profiles[Math.floor(Math.random() * profiles.length)];
  const data = fragranceDB[profile];

  return {
    ...product,
    accords: data.accords,
    notes: data.notes,
    longevity: Math.floor(Math.random() * 40) + 60, // 60–100
    projection: Math.floor(Math.random() * 40) + 60
  };
}

const rawProducts = [
  {
    id: 1,
    name: "Asad",
    price: 120,
    brand: "Lattafa",
    image: "https://dxbperfume.co.uk/cdn/shop/files/Lattafa_Asad_Eau_De_Parfum_100ml.jpg?v=1730285011&width=2048"
  },
  {
    id: 2,
    name: "Club de Nuit Intense",
    price: 150,
    brand: "Armaf",
    image: "https://m.media-amazon.com/images/I/61xqXyVpYrL._AC_UF894,1000_QL80_.jpg"
  }
];

// AUTO-ENHANCED PRODUCTS
const products = rawProducts.map(enhanceProduct);

function filterByBrand(brand) {
  const filtered = products.filter(p =>
    p.brand.toLowerCase() === brand.toLowerCase()
  );

  displayProducts(filtered);

  document.getElementById("products")?.scrollIntoView({
    behavior: "smooth"
  });
}

function getOccasion(product) {
  if (product.accords.includes("Fresh")) return "Office / Day";
  if (product.accords.includes("Sweet")) return "Date / Night";
  if (product.accords.includes("Woody")) return "Evening / Formal";
  return "Anytime";
}

function getVibe(product) {
  if (product.accords.includes("Sweet")) return "Sexy 🔥";
  if (product.accords.includes("Fresh")) return "Clean 🧊";
  if (product.accords.includes("Woody")) return "Boss 💼";
  return "Signature ✨";
}

function getSimilarProducts(currentProduct) {
  return products.filter(p => {
    if (p.id === currentProduct.id) return false;

    const sameBrand = p.brand === currentProduct.brand;
    const sharedAccord = p.accords.some(a =>
      currentProduct.accords.includes(a)
    );

    return sameBrand || sharedAccord;
  }).slice(0, 4);
}

