/* ============================================
   Search Page JavaScript
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
  const hostelList = document.getElementById("hostelList");
  const searchBtn = document.getElementById("searchBtn");
  const sortSelect = document.getElementById("sortBy");
  const priceRange = document.getElementById("priceRange");
  const priceValue = document.getElementById("priceValue");
  const resetFilters = document.getElementById("resetFilters");
  const filterCheckboxes = document.querySelectorAll('input[name="filter"]');
  const roomTypeCheckboxes = document.querySelectorAll(
    'input[name="roomType"]',
  );

  // Price slider
  if (priceRange && priceValue) {
    priceRange.addEventListener("input", (e) => {
      priceValue.textContent = formatGHS(e.target.value);
      filterHostels();
    });
  }

  // Reset filters
  if (resetFilters) {
    resetFilters.addEventListener("click", () => {
      filterCheckboxes.forEach((cb) => (cb.checked = false));
      roomTypeCheckboxes.forEach((cb) => (cb.checked = false));
      if (priceRange) {
        priceRange.value = 10000;
        priceValue.textContent = formatGHS(10000);
      }
      filterHostels();
    });
  }

  // Filter on checkbox change
  filterCheckboxes.forEach((cb) => {
    cb.addEventListener("change", filterHostels);
  });
  roomTypeCheckboxes.forEach((cb) => {
    cb.addEventListener("change", filterHostels);
  });

  // Sort
  if (sortSelect) {
    sortSelect.addEventListener("change", filterHostels);
  }

  // Search button
  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      showToast("Searching hostels...", "info");
      // Simulate search
      setTimeout(() => {
        filterHostels();
        showToast("Results updated!", "success");
      }, 500);
    });
  }

  function filterHostels() {
    const maxPrice = priceRange ? parseInt(priceRange.value) : 10000;
    const activeFilters = Array.from(filterCheckboxes)
      .filter((cb) => cb.checked)
      .map((cb) => cb.value);
    const activeRoomTypes = Array.from(roomTypeCheckboxes)
      .filter((cb) => cb.checked)
      .map((cb) => cb.value);

    let filtered = HOSTELS.filter((h) => h.price <= maxPrice);

    // Apply feature filters
    if (activeFilters.includes("wifi")) {
      filtered = filtered.filter((h) =>
        h.features.some((f) => f.toLowerCase().includes("wi-fi")),
      );
    }
    if (activeFilters.includes("shuttle")) {
      filtered = filtered.filter((h) =>
        h.features.some((f) => f.toLowerCase().includes("shuttle")),
      );
    }
    if (activeFilters.includes("meals")) {
      filtered = filtered.filter((h) =>
        h.features.some((f) => f.toLowerCase().includes("meal")),
      );
    }
    if (activeFilters.includes("security")) {
      filtered = filtered.filter((h) =>
        h.features.some(
          (f) =>
            f.toLowerCase().includes("security") ||
            (h.amenities && h.amenities.includes("24/7 Security")),
        ),
      );
    }
    if (activeFilters.includes("furnished")) {
      filtered = filtered.filter((h) =>
        h.features.some((f) => f.toLowerCase().includes("furnished")),
      );
    }
    if (activeFilters.includes("budget")) {
      filtered = filtered.filter((h) => h.price <= 2500);
    }

    // Apply room type filters
    if (activeRoomTypes.length > 0) {
      filtered = filtered.filter((h) => {
        const rt = h.roomType.toLowerCase();
        return activeRoomTypes.some((t) => {
          if (t === "single") return rt.includes("single");
          if (t === "shared-2") return rt.includes("2 in a room");
          if (t === "shared-3") return rt.includes("3 in a room");
          if (t === "shared-4") return rt.includes("4 in a room");
          return false;
        });
      });
    }

    // Sort
    const sortBy = sortSelect ? sortSelect.value : "recommended";
    if (sortBy === "price-low") filtered.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-high")
      filtered.sort((a, b) => b.price - a.price);
    else if (sortBy === "rating")
      filtered.sort((a, b) => b.ratingScore - a.ratingScore);

    renderHostels(filtered);
    updateResultsCount(filtered.length, activeFilters);
  }

  function updateResultsCount(count, activeFilters) {
    const countEl = document.getElementById("resultsCount");
    const filterEl = document.getElementById("activeFilter");
    const school = document.getElementById("searchSchool");

    if (countEl) {
      countEl.textContent = `${count} filtered results for: ${school ? school.value : "Accra"}, Sep 2026 - Jun 2027`;
    }
    if (filterEl) {
      const filterNames = activeFilters.map((f) => {
        const labels = {
          wifi: "Wi-Fi included",
          shuttle: "Free shuttle",
          meals: "Meals included",
          security: "24/7 Security",
          furnished: "Furnished",
          budget: "Budget",
        };
        return labels[f] || f;
      });
      filterEl.textContent =
        filterNames.length > 0 ? filterNames.join(" · ") : "All Hostels";
    }
  }

  function getTagClass(tag) {
    const t = tag.toLowerCase();
    if (t === "affordable" || t === "budget") return "tag-hot";
    if (t === "popular") return "tag-popular";
    if (t === "new" || t === "premium") return "tag-new";
    return "tag-affordable";
  }

  function getRatingClass(score) {
    if (score >= 9) return "excellent";
    if (score >= 7) return "good";
    return "average";
  }

  function getRatingBadgeClass(score) {
    if (score >= 9) return "rating-excellent";
    if (score >= 7) return "rating-good";
    return "rating-average";
  }

  function renderHostels(hostels) {
    if (!hostelList) return;

    if (hostels.length === 0) {
      hostelList.innerHTML = `
        <div class="no-results">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3>No hostels found</h3>
          <p>Try adjusting your filters or search criteria</p>
        </div>
      `;
      updateSearchMap(hostels);
      return;
    }

    hostelList.innerHTML = hostels
      .map(
        (h) => `
      <div class="hostel-card">
        <div class="hostel-card-image">
          <img src="${h.image}" alt="${h.name}" loading="lazy">
        </div>
        <div class="hostel-card-body">
          <div class="hostel-card-top">
            <div class="hostel-card-info">
              <h3>${h.name}</h3>
              <p class="location">${h.location}</p>
              <p class="features">${h.features.map((f, i) => (i === 0 ? `<span>${f}</span>` : f)).join(" · ")}</p>
            </div>
            <div class="hostel-card-rating">
              <div class="rating-info">
                <div class="rating-text ${getRatingClass(h.ratingScore)}">${h.ratingText}</div>
                <div class="rating-count">${h.reviewCount.toLocaleString()} reviews</div>
              </div>
              <div class="rating-badge ${getRatingBadgeClass(h.ratingScore)}">${h.ratingScore}</div>
            </div>
          </div>
          <div class="hostel-card-details">
            <p class="room-type">${h.roomType}</p>
            <p class="room-info">${h.roomInfo}</p>
          </div>
          <div class="hostel-card-bottom">
            <div class="hostel-card-tags">
              ${h.tags.map((t) => `<span class="tag ${getTagClass(t)}">#${t}</span>`).join("")}
            </div>
            <div class="hostel-card-price-action">
              <div>
                <div class="price-amount">${formatGHS(h.price)}</div>
                <div class="price-period">${h.pricePeriod}</div>
              </div>
              <a href="hostel.html?id=${h.id}" class="btn btn-primary btn-book">See booking options</a>
            </div>
          </div>
        </div>
      </div>
    `,
      )
      .join("");

    updateSearchMap(hostels);
  }

  // ---- Map View ----
  const mapToggle = document.getElementById("mapToggle");
  const mapContainer = document.getElementById("searchMapContainer");
  let searchMap = null;
  let mapMarkers = [];
  let mapVisible = false;

  if (mapToggle && mapContainer) {
    mapToggle.addEventListener("click", () => {
      mapVisible = !mapVisible;
      mapContainer.style.display = mapVisible ? "block" : "none";
      mapToggle.innerHTML = mapVisible
        ? '<i class="fas fa-list"></i> List View'
        : '<i class="fas fa-map"></i> Map View';

      if (mapVisible && !searchMap) {
        searchMap = L.map("searchMap", {
          scrollWheelZoom: true,
        }).setView([5.6505, -0.1862], 14);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        }).addTo(searchMap);

        updateSearchMap(HOSTELS);
      }
      if (mapVisible && searchMap) {
        setTimeout(() => searchMap.invalidateSize(), 100);
      }
    });
  }

  function updateSearchMap(hostels) {
    if (!searchMap) return;

    // Clear existing markers
    mapMarkers.forEach((m) => searchMap.removeLayer(m));
    mapMarkers = [];

    const bounds = [];
    hostels.forEach((h) => {
      if (h.lat && h.lng) {
        const marker = L.marker([h.lat, h.lng])
          .addTo(searchMap)
          .bindPopup(
            `<strong><a href="hostel.html?id=${h.id}">${h.name}</a></strong><br>` +
              `${h.location}<br>` +
              `<strong>${formatGHS(h.price)}</strong> ${h.pricePeriod}<br>` +
              `<span style="color:#10b981;font-weight:700;">${h.ratingScore}</span> ${h.ratingText}`,
          );
        mapMarkers.push(marker);
        bounds.push([h.lat, h.lng]);
      }
    });

    if (bounds.length > 1) {
      searchMap.fitBounds(bounds, { padding: [30, 30] });
    } else if (bounds.length === 1) {
      searchMap.setView(bounds[0], 15);
    }
  }

  // Initial render
  filterHostels();
});
