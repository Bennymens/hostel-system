/* ============================================
   UPSA ACCOMMODATION FINDER - Shared App JavaScript
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
    return !!localStorage.getItem("upsafinder_user");
  },
  getUser() {
    const u = localStorage.getItem("upsafinder_user");
    return u ? JSON.parse(u) : null;
  },
  login(user) {
    localStorage.setItem("upsafinder_user", JSON.stringify(user));
    this.updateNavbar();
  },
  logout() {
    localStorage.removeItem("upsafinder_user");
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
    name: "MB3 Hostel",
    location: "UPSA Area",
    school: "UPSA",
    lat: 5.6505,
    lng: -0.1862,
    features: ["Wi-Fi included", "24/7 Security", "Study Room"],
    roomType: "Multiple Options",
    roomInfo: "Options for 4 or 2 individuals per room",
    tags: ["Study Room", "Laundry"],
    ratingText: "Excellent",
    ratingScore: 9.6,
    reviewCount: 1240,
    price: 2700,
    pricePeriod: "per semester",
    image: "img/MB3 hostel/Copilot_20260420_215912.png",
    gallery: [
      "img/MB3 hostel/Copilot_20260420_215912.png",
      "img/MB3 hostel/Copilot_20260420_215928.png",
      "img/MB3 hostel/Copilot_20260420_220022.png",
      "img/MB3 hostel/Copilot_20260420_220035.png",
      "img/MB3 hostel/Copilot_20260420_220041.png",
      "img/MB3 hostel/photo_1_2026-04-20_22-05-33.jpg",
      "img/MB3 hostel/photo_9_2026-04-20_21-20-35.jpg",
      "img/MB3 hostel/photo_11_2026-04-20_21-20-35.jpg",
      "img/MB3 hostel/photo_12_2026-04-20_21-20-35.jpg",
    ],
    description: "This accommodation boasts a dedicated study room for focused learning, convenient dry lines for laundry, and private en-suite washrooms within each room, complemented by a shared kitchen facility, with options for four individuals per room at 2700 or two per room for 4000.",
    amenities: ["Wi-Fi", "24/7 Security", "Water Supply", "Study Room", "Laundry Service", "En-suite Bathroom"],
    rooms: [
      { type: "4 in a room", price: 2700, available: 12 },
      { type: "2 in a room", price: 4000, available: 8 },
    ],
  },
  {
    id: 2,
    name: "E.N Schroder Hostel",
    location: "UPSA Area",
    school: "UPSA",
    lat: 5.6488,
    lng: -0.1835,
    features: ["Girls Only", "Large Rooms", "Study Area", "Wi-Fi included"],
    roomType: "2 in a room",
    roomInfo: "Exclusively for girls, large rooms",
    tags: ["Girls Only", "Spacious"],
    ratingText: "Excellent",
    ratingScore: 9.4,
    reviewCount: 890,
    price: 4500,
    pricePeriod: "per semester",
    image: "img/E.N Schroder Hostel/WhatsApp Image 2026-04-20 at 10.28.48 AM.jpeg",
    gallery: [
      "img/E.N Schroder Hostel/WhatsApp Image 2026-04-20 at 10.28.48 AM.jpeg",
      "img/E.N Schroder Hostel/WhatsApp Image 2026-04-20 at 10.28.49 AM (1).jpeg",
      "img/E.N Schroder Hostel/WhatsApp Image 2026-04-20 at 10.28.49 AM (2).jpeg",
      "img/E.N Schroder Hostel/WhatsApp Image 2026-04-20 at 10.28.49 AM (3).jpeg",
      "img/E.N Schroder Hostel/WhatsApp Image 2026-04-20 at 10.28.49 AM (4).jpeg",
      "img/E.N Schroder Hostel/WhatsApp Image 2026-04-20 at 10.28.49 AM (5).jpeg",
      "img/E.N Schroder Hostel/WhatsApp Image 2026-04-20 at 10.28.49 AM.jpeg",
    ],
    description: "This spacious accommodation offers a large room with a dedicated study area, private washrooms, and a kitchen, exclusively for girls, with options for two per room at 4500.",
    amenities: ["Wi-Fi", "Security", "Water Supply", "Study Area", "Private Bathroom", "Kitchen"],
    rooms: [
      { type: "2 in a room", price: 4500, available: 6 },
    ],
  },
  {
    id: 3,
    name: "Precious Hostel",
    location: "Madina",
    school: "UPSA",
    lat: 5.6698,
    lng: -0.1762,
    features: ["Generous Space", "Study Friendly", "Wi-Fi included"],
    roomType: "2 in a room",
    roomInfo: "Perfect for studying, generous space",
    tags: ["Spacious", "New"],
    ratingText: "Excellent",
    ratingScore: 9.2,
    reviewCount: 450,
    price: 4500,
    pricePeriod: "per semester",
    image: "img/Precious hostel/Copilot_20260420_210425.png",
    gallery: [
      "img/Precious hostel/Copilot_20260420_210425.png",
      "img/Precious hostel/Copilot_20260420_210422.png",
      "img/Precious hostel/Copilot_20260420_210413.png",
    ],
    description: "This option provides a generous room space perfect for studying, complete with an in-room washroom, available for two people at 4500.",
    amenities: ["Wi-Fi", "Security", "Water Supply", "Study Desk", "In-room Washroom"],
    rooms: [
      { type: "2 in a room", price: 4500, available: 10 },
    ],
  },
];
