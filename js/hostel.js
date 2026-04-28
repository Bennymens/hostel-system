/* ============================================
   Hostel Details Page JavaScript
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
  const hostelId = parseInt(getParam("id"));
  const hostel = HOSTELS.find((h) => h.id === hostelId);
  const content = document.getElementById("hostelContent");

  if (!hostel) {
    content.innerHTML = `
      <div class="no-results" style="padding:4rem 1rem;">
        <h3>Hostel not found</h3>
        <p>The hostel you're looking for doesn't exist or has been removed.</p>
        <a href="search.html" class="btn btn-primary" style="margin-top:1rem;">Browse Hostels</a>
      </div>
    `;
    return;
  }

  // Update page title
  document.title = `${hostel.name} - AccraHostels`;

  const amenityIcons = {
    "Wi-Fi": "fas fa-wifi",
    "24/7 Security": "fas fa-shield-alt",
    Security: "fas fa-shield-alt",
    "Water Supply": "fas fa-tint",
    "Study Room": "fas fa-book-reader",
    "Study Desk": "fas fa-book-reader",
    Parking: "fas fa-car",
    "Laundry Service": "fas fa-soap",
    AC: "fas fa-snowflake",
    "Shuttle Service": "fas fa-bus",
    "Common Room": "fas fa-couch",
    Meals: "fas fa-utensils",
    Furnished: "fas fa-bed",
    "En-suite Bathroom": "fas fa-bath",
    "Private Bathroom": "fas fa-bath",
    Balcony: "fas fa-door-open",
    "Backup Generator": "fas fa-bolt",
    Cafeteria: "fas fa-utensils",
    Gym: "fas fa-dumbbell",
    "Common Lounge": "fas fa-couch",
    "Storage Lockers": "fas fa-lock",
  };

  function getRatingClass(score) {
    if (score >= 9) return "excellent";
    if (score >= 7) return "good";
    return "average";
  }

  function getTagClass(tag) {
    const t = tag.toLowerCase();
    if (t === "affordable" || t === "budget") return "tag-hot";
    if (t === "popular") return "tag-popular";
    if (t === "new" || t === "premium") return "tag-new";
    return "tag-affordable";
  }

  // Build gallery HTML
  const galleryImages = hostel.gallery || [hostel.image];
  const mainImage = galleryImages[0];
  const sideImages = galleryImages.slice(1, 3);

  content.innerHTML = `
    <!-- Gallery -->
    <div class="gallery">
      <div class="gallery-main">
        <img src="${mainImage}" alt="${hostel.name}" class="clickable-hostel-img" style="cursor: pointer;" title="Click to view full image">
      </div>
      ${
        sideImages.length > 0
          ? `
        <div class="gallery-side">
          ${sideImages.map((img) => `<img src="${img}" alt="${hostel.name}" class="clickable-hostel-img" style="cursor: pointer;">`).join("")}
        </div>
      `
          : ""
      }
    </div>

    <!-- Detail Layout -->
    <div class="detail-layout">
      <!-- Left: Info -->
      <div class="detail-info">
        <h1>${hostel.name}</h1>
        <div class="detail-location">
          <i class="fas fa-map-marker-alt"></i>
          ${hostel.location} · ${hostel.school}
        </div>
        <div class="detail-rating">
          <div class="rating-info" style="text-align:left;">
            <div class="rating-text ${getRatingClass(hostel.ratingScore)}">${hostel.ratingText}</div>
            <div class="rating-count">${hostel.reviewCount.toLocaleString()} reviews</div>
          </div>
          <div class="rating-badge rating-${getRatingClass(hostel.ratingScore)}">${hostel.ratingScore}</div>
        </div>
        <div class="detail-tags">
          ${hostel.tags.map((t) => `<span class="tag ${getTagClass(t)}">#${t}</span>`).join("")}
        </div>

        <!-- Description -->
        <div class="detail-section">
          <h3>About this hostel</h3>
          <p>${hostel.description}</p>
        </div>

        <!-- Amenities -->
        <div class="detail-section">
          <h3>Amenities & Facilities</h3>
          <div class="amenities-grid">
            ${(hostel.amenities || [])
              .map(
                (a) => `
              <div class="amenity-item">
                <i class="${amenityIcons[a] || "fas fa-check-circle"}"></i>
                ${a}
              </div>
            `,
              )
              .join("")}
          </div>
        </div>

        <!-- Room Options -->
        <div class="detail-section">
          <h3>Available Room Types</h3>
          <table class="room-table">
            <thead>
              <tr>
                <th>Room Type</th>
                <th>Price / Semester</th>
                <th>Availability</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              ${(hostel.rooms || [])
                .map(
                  (r) => `
                <tr>
                  <td>${r.type}</td>
                  <td class="room-price">${formatGHS(r.price)}</td>
                  <td class="room-avail ${r.available <= 3 ? "low" : "good"}">
                    ${r.available <= 3 ? `Only ${r.available} left!` : `${r.available} rooms available`}
                  </td>
                  <td>
                    <a href="booking.html?id=${hostel.id}&room=${encodeURIComponent(r.type)}" class="btn btn-primary btn-sm">Book</a>
                  </td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        </div>

        <!-- Reviews -->
        <div class="detail-section">
          <h3>Student Reviews</h3>
          <div class="review-list">
            <div class="review-card">
              <div class="review-header">
                <div>
                  <span class="reviewer">Ama Mensah</span>
                  <div class="review-stars">★★★★★</div>
                </div>
                <span class="review-date">Aug 2025</span>
              </div>
              <p class="review-text">Great hostel! The rooms are clean and spacious. Wi-Fi is reliable and security is top-notch. I'd definitely recommend it to anyone looking for accommodation near campus.</p>
            </div>
            <div class="review-card">
              <div class="review-header">
                <div>
                  <span class="reviewer">Kofi Adjei</span>
                  <div class="review-stars">★★★★☆</div>
                </div>
                <span class="review-date">Jun 2025</span>
              </div>
              <p class="review-text">Good value for money. The location is perfect — just a short walk to lectures. Water supply could be more consistent but overall a solid choice.</p>
            </div>
            <div class="review-card">
              <div class="review-header">
                <div>
                  <span class="reviewer">Abena Osei</span>
                  <div class="review-stars">★★★★★</div>
                </div>
                <span class="review-date">May 2025</span>
              </div>
              <p class="review-text">I've stayed here for two semesters now and it keeps getting better. The management is very responsive and the study room is a lifesaver during exams.</p>
            </div>
          </div>
        </div>

        <!-- Map -->
        <div class="detail-section">
          <h3><i class="fas fa-map-marked-alt"></i> Location</h3>
          <div id="hostelMap" class="hostel-map"></div>
          <p class="map-address"><i class="fas fa-map-marker-alt"></i> ${hostel.location} · ${hostel.school}</p>
        </div>
      </div>

      <!-- Right: Booking Sidebar -->
      <div class="booking-sidebar">
        <div class="sidebar-price">
          <div class="from-text">From</div>
          <div class="big-price">${formatGHS(hostel.price)}</div>
          <div class="period">${hostel.pricePeriod}</div>
        </div>

        <div class="form-group">
          <label>Room type</label>
          <select class="form-control" id="sidebarRoom">
            ${(hostel.rooms || [])
              .map(
                (r) => `
              <option value="${r.type}" data-price="${r.price}">${r.type} — ${formatGHS(r.price)}</option>
            `,
              )
              .join("")}
          </select>
        </div>

        <div class="form-group">
          <label>Move-in date</label>
          <input type="date" class="form-control" id="sidebarMoveIn" value="2026-09-01">
        </div>

        <div class="form-group">
          <label>Move-out date</label>
          <input type="date" class="form-control" id="sidebarMoveOut" value="2027-06-30">
        </div>

        <a href="booking.html?id=${hostel.id}" class="btn btn-primary book-btn" id="sidebarBookBtn">
          <i class="fas fa-bookmark"></i> Book Now
        </a>

        <p class="sidebar-note"><i class="fas fa-lock"></i> Secure booking · Free cancellation</p>
      </div>
    </div>
  `;

  // Update book button link when room changes
  const sidebarRoom = document.getElementById("sidebarRoom");
  const sidebarBookBtn = document.getElementById("sidebarBookBtn");
  if (sidebarRoom && sidebarBookBtn) {
    sidebarRoom.addEventListener("change", () => {
      const room = sidebarRoom.value;
      sidebarBookBtn.href = `booking.html?id=${hostel.id}&room=${encodeURIComponent(room)}`;
    });
  }

  // Initialize Leaflet Map
  if (hostel.lat && hostel.lng && document.getElementById("hostelMap")) {
    const map = L.map("hostelMap", {
      scrollWheelZoom: false,
    }).setView([hostel.lat, hostel.lng], 16);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    L.marker([hostel.lat, hostel.lng])
      .addTo(map)
      .bindPopup(`<strong>${hostel.name}</strong><br>${hostel.location}`)
      .openPopup();

    // Also show nearby hostels from same school
    HOSTELS.forEach((h) => {
      if (h.id !== hostel.id && h.lat && h.lng && h.school === hostel.school) {
        L.marker([h.lat, h.lng], {
          opacity: 0.7,
        })
          .addTo(map)
          .bindPopup(`<a href="hostel.html?id=${h.id}"><strong>${h.name}</strong></a><br>${formatGHS(h.price)}`);
      }
    });
  }

  // Image Modal setup
  if (!document.getElementById("imageModal")) {
    const modalHtml = `
      <div id="imageModal" style="display:none; position:fixed; z-index:9999; left:0; top:0; width:100%; height:100%; background-color:rgba(0,0,0,0.85); justify-content:center; align-items:center; backdrop-filter:blur(5px);">
        <span class="close-modal" style="position:absolute; top:20px; right:35px; color:#fff; font-size:40px; font-weight:bold; cursor:pointer; transition:0.3s;" onmouseover="this.style.color='#bbb'" onmouseout="this.style.color='#fff'">&times;</span>
        <img id="modalImg" style="max-width:90%; max-height:90%; border-radius:8px; box-shadow:0 5px 25px rgba(0,0,0,0.5);">
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    document.getElementById("imageModal").addEventListener('click', function(e) {
      if (e.target.id === "imageModal" || e.target.classList.contains("close-modal")) {
        this.style.display = "none";
        document.body.style.overflow = "auto";
      }
    });
  }

  const galleryImgs = document.querySelectorAll(".clickable-hostel-img");
  galleryImgs.forEach((img) => {
    img.addEventListener("click", function() {
      document.getElementById("imageModal").style.display = "flex";
      document.getElementById("modalImg").src = this.src;
      document.body.style.overflow = "hidden";
    });
  });
});
