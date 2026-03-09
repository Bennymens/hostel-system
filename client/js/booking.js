/* ============================================
   Booking Page JavaScript
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
  const hostelId = parseInt(getParam("id"));
  const roomParam = getParam("room");
  const hostel = HOSTELS.find((h) => h.id === hostelId);
  const content = document.getElementById("bookingContent");
  const page = document.getElementById("bookingPage");

  if (!hostel) {
    content.innerHTML = `
      <div class="no-results" style="padding:3rem; grid-column:1/-1;">
        <h3>Hostel not found</h3>
        <p>Please go back and try again.</p>
        <a href="search.html" class="btn btn-primary" style="margin-top:1rem;">Browse Hostels</a>
      </div>
    `;
    return;
  }

  // Find selected room or use first
  const selectedRoom =
    hostel.rooms.find((r) => r.type === roomParam) || hostel.rooms[0];
  const user = Auth.getUser();

  content.innerHTML = `
    <!-- Left: Booking Form -->
    <div>
      <!-- Student Info -->
      <div class="booking-form-card" style="margin-bottom:1.25rem;">
        <h3><i class="fas fa-user"></i> Student Information</h3>
        <div class="form-row">
          <div class="form-group">
            <label>First name</label>
            <input type="text" class="form-control" id="bookFirstName" value="${user ? user.name.split(" ")[0] : ""}" placeholder="Kwame" required>
          </div>
          <div class="form-group">
            <label>Last name</label>
            <input type="text" class="form-control" id="bookLastName" value="${user ? user.name.split(" ")[1] || "" : ""}" placeholder="Asante" required>
          </div>
        </div>
        <div class="form-group">
          <label>Email address</label>
          <input type="email" class="form-control" id="bookEmail" value="${user ? user.email : ""}" placeholder="student@ug.edu.gh" required>
        </div>
        <div class="form-group">
          <label>Phone number</label>
          <input type="tel" class="form-control" id="bookPhone" value="${user ? user.phone || "" : ""}" placeholder="024 XXX XXXX" required>
        </div>
        <div class="form-group">
          <label>Student ID</label>
          <input type="text" class="form-control" id="bookStudentId" placeholder="e.g. 10900XXX">
        </div>
      </div>

      <!-- Room Selection -->
      <div class="booking-form-card" style="margin-bottom:1.25rem;">
        <h3><i class="fas fa-bed"></i> Room Details</h3>
        <div class="form-group">
          <label>Room type</label>
          <select class="form-control" id="bookRoomType">
            ${hostel.rooms
              .map(
                (r) => `
              <option value="${r.type}" data-price="${r.price}" ${r.type === selectedRoom.type ? "selected" : ""}>
                ${r.type} — ${formatGHS(r.price)} / semester ${r.available <= 3 ? "(Only " + r.available + " left!)" : ""}
              </option>
            `,
              )
              .join("")}
          </select>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Move-in date</label>
            <input type="date" class="form-control" id="bookMoveIn" value="2026-09-01">
          </div>
          <div class="form-group">
            <label>Move-out date</label>
            <input type="date" class="form-control" id="bookMoveOut" value="2027-06-30">
          </div>
        </div>
        <div class="form-group">
          <label>Special requests (optional)</label>
          <textarea class="form-control" id="bookRequests" rows="3" placeholder="Any special requirements…" style="resize:vertical;"></textarea>
        </div>
      </div>

      <!-- Payment -->
      <div class="booking-form-card">
        <h3><i class="fas fa-credit-card"></i> Payment Method</h3>
        <div class="payment-methods">
          <label class="payment-option active">
            <input type="radio" name="payment" value="momo" checked>
            <span class="pay-label">Mobile Money (MoMo)</span>
            <span class="pay-icon"><i class="fas fa-mobile-alt"></i></span>
          </label>
          <label class="payment-option">
            <input type="radio" name="payment" value="card">
            <span class="pay-label">Debit / Credit Card</span>
            <span class="pay-icon"><i class="fas fa-credit-card"></i></span>
          </label>
          <label class="payment-option">
            <input type="radio" name="payment" value="bank">
            <span class="pay-label">Bank Transfer</span>
            <span class="pay-icon"><i class="fas fa-university"></i></span>
          </label>
        </div>

        <!-- MoMo fields -->
        <div id="momoFields">
          <div class="form-group">
            <label>Mobile Money Number</label>
            <input type="tel" class="form-control" id="momoNumber" placeholder="024 XXX XXXX">
          </div>
          <div class="form-group">
            <label>Network</label>
            <select class="form-control" id="momoNetwork">
              <option>MTN Mobile Money</option>
              <option>Vodafone Cash</option>
              <option>AirtelTigo Money</option>
            </select>
          </div>
        </div>

        <label class="checkbox-label" style="font-size:0.85rem; margin:1rem 0;">
          <input type="checkbox" id="agreeTerms" required>
          I agree to the <a href="#" style="color:var(--primary);">Terms & Conditions</a> and <a href="#" style="color:var(--primary);">Cancellation Policy</a>
        </label>

        <button class="btn btn-primary btn-block btn-lg" id="confirmBookingBtn">
          <i class="fas fa-lock"></i> Confirm & Pay
        </button>
      </div>
    </div>

    <!-- Right: Order Summary -->
    <div class="order-summary">
      <h3>Booking Summary</h3>
      <div class="order-hostel">
        <img src="${hostel.image}" alt="${hostel.name}">
        <div class="order-hostel-info">
          <h4>${hostel.name}</h4>
          <p>${hostel.location}</p>
          <p>${hostel.school}</p>
        </div>
      </div>

      <div class="order-lines" id="orderLines">
        <div class="order-line">
          <span>Room type</span>
          <span id="orderRoomType">${selectedRoom.type}</span>
        </div>
        <div class="order-line">
          <span>Period</span>
          <span>Sep 2026 – Jun 2027</span>
        </div>
        <div class="order-line">
          <span>Room price</span>
          <span id="orderRoomPrice">${formatGHS(selectedRoom.price)}</span>
        </div>
        <div class="order-line">
          <span>Service fee</span>
          <span id="orderServiceFee">${formatGHS(Math.round(selectedRoom.price * 0.05))}</span>
        </div>
        <div class="order-line total">
          <span>Total</span>
          <span class="order-total-price" id="orderTotal">${formatGHS(selectedRoom.price + Math.round(selectedRoom.price * 0.05))}</span>
        </div>
      </div>

      <p class="order-note"><i class="fas fa-shield-alt"></i> Your payment is secure & you can cancel for free</p>
    </div>
  `;

  // Payment method toggle
  const paymentOptions = document.querySelectorAll(".payment-option");
  paymentOptions.forEach((opt) => {
    opt.addEventListener("click", () => {
      paymentOptions.forEach((o) => o.classList.remove("active"));
      opt.classList.add("active");
      const val = opt.querySelector("input").value;
      document.getElementById("momoFields").style.display =
        val === "momo" ? "block" : "none";
    });
  });

  // Update order summary when room changes
  const roomSelect = document.getElementById("bookRoomType");
  if (roomSelect) {
    roomSelect.addEventListener("change", () => {
      const option = roomSelect.options[roomSelect.selectedIndex];
      const price = parseInt(option.dataset.price);
      const fee = Math.round(price * 0.05);
      document.getElementById("orderRoomType").textContent = roomSelect.value;
      document.getElementById("orderRoomPrice").textContent = formatGHS(price);
      document.getElementById("orderServiceFee").textContent = formatGHS(fee);
      document.getElementById("orderTotal").textContent = formatGHS(
        price + fee,
      );
    });
  }

  // Confirm booking
  const confirmBtn = document.getElementById("confirmBookingBtn");
  if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {
      const firstName = document.getElementById("bookFirstName").value.trim();
      const email = document.getElementById("bookEmail").value.trim();
      const phone = document.getElementById("bookPhone").value.trim();
      const terms = document.getElementById("agreeTerms").checked;

      if (!firstName || !email || !phone) {
        showToast("Please fill in all required fields", "error");
        return;
      }
      if (!terms) {
        showToast("Please agree to the Terms & Conditions", "error");
        return;
      }

      // Generate booking ref
      const ref =
        "AH-" +
        Date.now().toString(36).toUpperCase() +
        "-" +
        Math.random().toString(36).substring(2, 6).toUpperCase();

      // Store booking in localStorage
      const bookings = JSON.parse(
        localStorage.getItem("acchostel_bookings") || "[]",
      );
      bookings.push({
        ref: ref,
        hostelId: hostel.id,
        hostelName: hostel.name,
        room: roomSelect.value,
        moveIn: document.getElementById("bookMoveIn").value,
        moveOut: document.getElementById("bookMoveOut").value,
        name: `${firstName} ${document.getElementById("bookLastName").value.trim()}`,
        email: email,
        phone: phone,
        status: "confirmed",
        date: new Date().toISOString(),
      });
      localStorage.setItem("acchostel_bookings", JSON.stringify(bookings));

      // Show success
      page.innerHTML = `
        <div class="booking-success">
          <div class="success-icon"><i class="fas fa-check"></i></div>
          <h2>Booking Confirmed!</h2>
          <p>Your room at ${hostel.name} has been reserved. Check your email for confirmation details.</p>
          <div class="booking-ref">${ref}</div>
          <p style="font-size:0.82rem; color:var(--gray-400);">Save this reference number for check-in</p>
          <div style="display:flex; gap:1rem; justify-content:center; margin-top:1.5rem;">
            <a href="profile.html" class="btn btn-primary">View My Bookings</a>
            <a href="search.html" class="btn btn-outline">Browse More Hostels</a>
          </div>
        </div>
      `;
    });
  }
});
