/* ============================================
   AccraHostels - Shared App JavaScript
   ============================================ */

// ---- Mobile Nav Toggle ----
document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
    });
  }
});

// ---- Toast Notifications ----
function showToast(message, type = "info", duration = 3000) {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "slideOut 0.3s ease forwards";
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ---- Format Currency ----
function formatGHS(amount) {
  return "GH₵ " + Number(amount).toLocaleString();
}

// ---- Simple Auth Helpers (localStorage based) ----
const Auth = {
  isLoggedIn() {
    return !!localStorage.getItem("acchostel_user");
  },
  getUser() {
    const u = localStorage.getItem("acchostel_user");
    return u ? JSON.parse(u) : null;
  },
  login(user) {
    localStorage.setItem("acchostel_user", JSON.stringify(user));
    this.updateNavbar();
  },
  logout() {
    localStorage.removeItem("acchostel_user");
    window.location.href = "index.html";
  },
  updateNavbar() {
    const actions = document.querySelector(".navbar-actions");
    if (!actions) return;

    if (this.isLoggedIn()) {
      const user = this.getUser();
      actions.innerHTML = `
        <a href="profile.html" class="btn btn-outline">
          <i class="fas fa-user"></i> ${user.name || "Profile"}
        </a>
        <button class="btn btn-primary" onclick="Auth.logout()">Log out</button>
      `;
    }
  },
};

// Update navbar on load
document.addEventListener("DOMContentLoaded", () => {
  Auth.updateNavbar();
});

// ---- URL Params Helper ----
function getParam(key) {
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
}

// ---- Sample Hostel Data (used across pages until backend is connected) ----
const HOSTELS = [
  {
    id: 1,
    name: "Pentagon Hostel",
    location: "0.3 km from campus gate",
    school: "University of Ghana, Legon",
    lat: 5.6505,
    lng: -0.1862,
    features: ["Free cancellation", "Wi-Fi included"],
    roomType: "Shared Room (2 in a room)",
    roomInfo: "2x single beds · 1x shared bathroom · Desk & wardrobe",
    tags: ["Affordable", "Popular"],
    ratingText: "Excellent",
    ratingScore: 9.6,
    reviewCount: 1820,
    price: 2800,
    pricePeriod: "per semester, 2 students",
    image:
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&fit=crop",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&fit=crop",
      "https://images.unsplash.com/photo-1590490360182-c33d955bc90c?w=800&fit=crop",
    ],
    description:
      "Pentagon Hostel is a premier student accommodation located just 300 meters from the University of Ghana main campus gate. It features modern amenities, 24/7 security, reliable Wi-Fi, and a peaceful study environment. Each room comes equipped with study desks, wardrobes, and comfortable beds.",
    amenities: [
      "Wi-Fi",
      "24/7 Security",
      "Water Supply",
      "Study Room",
      "Parking",
      "Laundry Service",
    ],
    rooms: [
      { type: "Shared (2 in a room)", price: 2800, available: 5 },
      { type: "Shared (3 in a room)", price: 2000, available: 8 },
      { type: "Single Room", price: 4500, available: 2 },
    ],
  },
  {
    id: 2,
    name: "Evandy Hostel",
    location: "0.5 km from campus gate",
    school: "University of Ghana, Legon",
    lat: 5.6488,
    lng: -0.1835,
    features: ["Free shuttle to campus", "Wi-Fi included"],
    roomType: "Standard Room",
    roomInfo: "1x queen size bed · 1x shared bathroom · Study area",
    tags: ["Budget"],
    ratingText: "Good",
    ratingScore: 8.3,
    reviewCount: 792,
    price: 3500,
    pricePeriod: "per semester, 2 students",
    image:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&fit=crop",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&fit=crop",
    ],
    description:
      "Evandy Hostel provides comfortable and affordable student accommodation near the University of Ghana. With free shuttle service to campus & reliable Wi-Fi, it's the perfect choice for budget-conscious students who don't want to compromise on convenience.",
    amenities: [
      "Wi-Fi",
      "Security",
      "Shuttle Service",
      "Water Supply",
      "Common Room",
    ],
    rooms: [
      { type: "Standard Room", price: 3500, available: 12 },
      { type: "Shared (2 in a room)", price: 2500, available: 6 },
      { type: "Shared (4 in a room)", price: 1500, available: 10 },
    ],
  },
  {
    id: 3,
    name: "Akuafo Hall Annex",
    location: "On campus",
    school: "University of Ghana, Legon",
    lat: 5.6521,
    lng: -0.187,
    features: ["Wi-Fi included", "24/7 Security"],
    roomType: "Premium Single Room",
    roomInfo: "1x single bed · Private bathroom · AC & Study desk",
    tags: ["Popular", "Premium"],
    ratingText: "Excellent",
    ratingScore: 9.5,
    reviewCount: 2100,
    price: 5200,
    pricePeriod: "per semester, 1 student",
    image:
      "https://images.unsplash.com/photo-1590490360182-c33d955bc90c?w=400&h=300&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1590490360182-c33d955bc90c?w=800&fit=crop",
      "https://images.unsplash.com/photo-1564078516393-cf04bd966897?w=800&fit=crop",
    ],
    description:
      "Akuafo Hall Annex is the premium on-campus residence at the University of Ghana. Enjoy the convenience of being right on campus with top-tier facilities including air conditioning, private bathrooms, and a dedicated study area.",
    amenities: [
      "Wi-Fi",
      "24/7 Security",
      "AC",
      "Private Bathroom",
      "Study Desk",
      "Cafeteria",
      "Gym",
    ],
    rooms: [
      { type: "Premium Single", price: 5200, available: 3 },
      { type: "Standard Single", price: 4000, available: 7 },
      { type: "Shared (2 in a room)", price: 3200, available: 15 },
    ],
  },
  {
    id: 4,
    name: "TF Hostel",
    location: "1.2 km from campus gate",
    school: "University of Ghana, Legon",
    lat: 5.6455,
    lng: -0.181,
    features: ["Meals included", "Wi-Fi", "Furnished"],
    roomType: "Shared Room (3 in a room)",
    roomInfo: "3x single beds · 1x shared bathroom · Common lounge",
    tags: ["Affordable"],
    ratingText: "Good",
    ratingScore: 7.8,
    reviewCount: 640,
    price: 1800,
    pricePeriod: "per semester, 3 students",
    image:
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&h=300&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&fit=crop",
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&fit=crop",
    ],
    description:
      "TF Hostel is the most affordable option for students near the University of Ghana. While slightly farther from campus, it compensates with meals included, fully furnished rooms, and a vibrant community of students.",
    amenities: [
      "Wi-Fi",
      "Meals",
      "Security",
      "Furnished",
      "Common Lounge",
      "Water Supply",
    ],
    rooms: [
      { type: "Shared (3 in a room)", price: 1800, available: 20 },
      { type: "Shared (4 in a room)", price: 1400, available: 15 },
      { type: "Shared (2 in a room)", price: 2600, available: 4 },
    ],
  },
  {
    id: 5,
    name: "Midway Hostel",
    location: "0.8 km from campus gate",
    school: "University of Ghana, Legon",
    lat: 5.6478,
    lng: -0.1848,
    features: ["Free cancellation", "Wi-Fi", "24/7 Security"],
    roomType: "Shared Room (2 in a room)",
    roomInfo: "2x single beds · En-suite bathroom · Balcony",
    tags: ["Popular", "New"],
    ratingText: "Excellent",
    ratingScore: 9.2,
    reviewCount: 1450,
    price: 4200,
    pricePeriod: "per semester, 2 students",
    image:
      "https://images.unsplash.com/photo-1564078516393-cf04bd966897?w=400&h=300&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1564078516393-cf04bd966897?w=800&fit=crop",
      "https://images.unsplash.com/photo-1590490360182-c33d955bc90c?w=800&fit=crop",
    ],
    description:
      "Midway Hostel is a newly built student accommodation offering modern amenities and a premium living experience. Features include en-suite bathrooms, private balconies, and a dedicated study environment.",
    amenities: [
      "Wi-Fi",
      "24/7 Security",
      "En-suite Bathroom",
      "Balcony",
      "Study Room",
      "Backup Generator",
    ],
    rooms: [
      { type: "Shared (2 in a room)", price: 4200, available: 6 },
      { type: "Single Room", price: 5800, available: 2 },
      { type: "Shared (3 in a room)", price: 3000, available: 10 },
    ],
  },
  {
    id: 6,
    name: "KNUST Hall 7 Annex",
    location: "0.2 km from campus",
    school: "KNUST, Kumasi",
    lat: 6.6745,
    lng: -1.5716,
    features: ["Wi-Fi included", "Furnished"],
    roomType: "Shared Room (4 in a room)",
    roomInfo: "4x bunk beds · Shared bathroom · Storage lockers",
    tags: ["Affordable", "Popular"],
    ratingText: "Good",
    ratingScore: 7.5,
    reviewCount: 920,
    price: 1200,
    pricePeriod: "per semester, 4 students",
    image:
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&fit=crop",
    ],
    description:
      "Affordable hostel accommodation near KNUST campus. Perfect for students on a budget with all basic amenities included.",
    amenities: ["Wi-Fi", "Security", "Furnished", "Water Supply"],
    rooms: [
      { type: "Shared (4 in a room)", price: 1200, available: 25 },
      { type: "Shared (2 in a room)", price: 2200, available: 10 },
    ],
  },
];
