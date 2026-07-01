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
        <img src="${hostel.image}" alt="${hostel.name}" id="bookingHostelImg" style="cursor: pointer;" title="Click to view full image">
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

  const bookingHostelImg = document.getElementById("bookingHostelImg");
  if (bookingHostelImg) {
    bookingHostelImg.addEventListener("click", function() {
      document.getElementById("imageModal").style.display = "flex";
      document.getElementById("modalImg").src = this.src;
      document.body.style.overflow = "hidden";
    });
  }

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

  // ---- Booking Confirmation Modal ----
  function showBookingConfirmModal(booking) {
    // Remove existing modal if any
    const existing = document.getElementById("bookingConfirmModal");
    if (existing) existing.remove();

    const roomOption = document.querySelector(`#bookRoomType option[value="${booking.room}"]`);
    const roomPrice = roomOption ? parseInt(roomOption.dataset.price) : 0;
    const serviceFee = Math.round(roomPrice * 0.05);
    const total = roomPrice + serviceFee;

    const moveInFormatted = formatDateDisplay(booking.moveIn);
    const moveOutFormatted = formatDateDisplay(booking.moveOut);

    const modalHtml = `
      <div id="bookingConfirmModal" class="confirm-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="confirmModalTitle">
        <div class="confirm-modal">
          <!-- Animated success header -->
          <div class="confirm-modal-header">
            <div class="confirm-success-ring">
              <div class="confirm-success-icon">
                <i class="fas fa-check"></i>
              </div>
            </div>
            <h2 id="confirmModalTitle">Booking Confirmed!</h2>
            <p class="confirm-subtitle">Your accommodation has been successfully reserved</p>
          </div>

          <!-- Booking reference badge -->
          <div class="confirm-ref-badge">
            <span class="confirm-ref-label"><i class="fas fa-hashtag"></i> Booking Reference</span>
            <span class="confirm-ref-code" id="confirmRefCode">${booking.ref}</span>
            <button class="confirm-copy-btn" onclick="copyBookingRef('${booking.ref}')" title="Copy reference">
              <i class="fas fa-copy"></i>
            </button>
          </div>

          <!-- Details grid -->
          <div class="confirm-details-grid">
            <div class="confirm-detail-item">
              <i class="fas fa-building"></i>
              <div>
                <span class="confirm-detail-label">Hostel</span>
                <span class="confirm-detail-value">${booking.hostelName}</span>
              </div>
            </div>
            <div class="confirm-detail-item">
              <i class="fas fa-bed"></i>
              <div>
                <span class="confirm-detail-label">Room Type</span>
                <span class="confirm-detail-value">${booking.room}</span>
              </div>
            </div>
            <div class="confirm-detail-item">
              <i class="fas fa-calendar-check"></i>
              <div>
                <span class="confirm-detail-label">Move In</span>
                <span class="confirm-detail-value">${moveInFormatted}</span>
              </div>
            </div>
            <div class="confirm-detail-item">
              <i class="fas fa-calendar-times"></i>
              <div>
                <span class="confirm-detail-label">Move Out</span>
                <span class="confirm-detail-value">${moveOutFormatted}</span>
              </div>
            </div>
            <div class="confirm-detail-item">
              <i class="fas fa-user"></i>
              <div>
                <span class="confirm-detail-label">Guest</span>
                <span class="confirm-detail-value">${booking.name}</span>
              </div>
            </div>
            <div class="confirm-detail-item">
              <i class="fas fa-envelope"></i>
              <div>
                <span class="confirm-detail-label">Email</span>
                <span class="confirm-detail-value">${booking.email}</span>
              </div>
            </div>
          </div>

          <!-- Total amount -->
          <div class="confirm-amount-box">
            <div class="confirm-amount-row">
              <span>Room price</span><span>${formatGHS(roomPrice)}</span>
            </div>
            <div class="confirm-amount-row">
              <span>Service fee (5%)</span><span>${formatGHS(serviceFee)}</span>
            </div>
            <div class="confirm-amount-row confirm-amount-total">
              <span>Total Paid</span><span>${formatGHS(total)}</span>
            </div>
          </div>

          <!-- Email status -->
          <div class="confirm-email-status" id="confirmEmailStatus">
            <i class="fas fa-paper-plane"></i>
            <span id="confirmEmailStatusText">Sending confirmation email to <strong>${booking.email}</strong>…</span>
          </div>

          <!-- Actions -->
          <div class="confirm-modal-actions">
            <a href="profile.html" class="btn btn-primary confirm-btn-primary">
              <i class="fas fa-list-alt"></i> View My Bookings
            </a>
            <a href="search.html" class="btn btn-outline confirm-btn-outline">
              <i class="fas fa-search"></i> Browse More Hostels
            </a>
          </div>

          <p class="confirm-footnote">
            <i class="fas fa-shield-alt"></i> Save your reference number for check-in verification
          </p>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modalHtml);
    document.body.style.overflow = "hidden";

    // Trigger entrance animation
    requestAnimationFrame(() => {
      const modal = document.getElementById("bookingConfirmModal");
      if (modal) modal.classList.add("confirm-modal-visible");
    });
  }

  // Copy booking reference to clipboard
  window.copyBookingRef = function(ref) {
    navigator.clipboard.writeText(ref).then(() => {
      showToast("Reference copied to clipboard!", "success");
    }).catch(() => {
      showToast("Could not copy. Please copy manually.", "info");
    });
  };

  // Update email status in the modal
  function updateEmailStatus(success, email) {
    const statusEl = document.getElementById("confirmEmailStatus");
    const textEl = document.getElementById("confirmEmailStatusText");
    if (!statusEl || !textEl) return;

    if (success) {
      statusEl.className = "confirm-email-status confirm-email-sent";
      statusEl.querySelector("i").className = "fas fa-check-circle";
      textEl.innerHTML = `Confirmation email sent to <strong>${email}</strong>`;
    } else {
      statusEl.className = "confirm-email-status confirm-email-failed";
      statusEl.querySelector("i").className = "fas fa-exclamation-triangle";
      textEl.innerHTML = `Could not send email. Please save your booking reference above.`;
    }
  }

  // Confirm booking
  const confirmBtn = document.getElementById("confirmBookingBtn");
  if (confirmBtn) {
    confirmBtn.addEventListener("click", async () => {
      const firstName = document.getElementById("bookFirstName").value.trim();
      const lastName = document.getElementById("bookLastName").value.trim();
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

      const originalText = confirmBtn.innerHTML;
      confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Confirming...';
      confirmBtn.disabled = true;

      // Generate booking ref
      const ref =
        "AH-" +
        Date.now().toString(36).toUpperCase() +
        "-" +
        Math.random().toString(36).substring(2, 6).toUpperCase();

      // Get selected room price
      const roomOption = roomSelect ? roomSelect.options[roomSelect.selectedIndex] : null;
      const roomPrice = roomOption ? parseInt(roomOption.dataset.price) : 0;
      const serviceFee = Math.round(roomPrice * 0.05);
      const total = roomPrice + serviceFee;

      // Get selected payment method
      const activePayment = document.querySelector(".payment-option.active input");
      const paymentMethod = activePayment ? activePayment.value : "momo";
      const paymentLabels = { momo: "Mobile Money (MoMo)", card: "Debit / Credit Card", bank: "Bank Transfer" };

      const newBooking = {
        ref: ref,
        hostelId: hostel.id,
        hostelName: hostel.name,
        room: roomSelect ? roomSelect.value : selectedRoom.type,
        moveIn: document.getElementById("bookMoveIn").value,
        moveOut: document.getElementById("bookMoveOut").value,
        name: `${firstName} ${lastName}`.trim(),
        email: email,
        phone: phone,
        status: "confirmed",
        date: new Date().toISOString(),
        totalAmount: total,
        paymentMethod: paymentLabels[paymentMethod] || paymentMethod,
      };

      try {
        await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newBooking)
        });
      } catch (err) {
        console.warn("Failed to sync with API, storing locally.");
      }

      // Always store locally as a backup for the profile page
      const bookings = JSON.parse(
        localStorage.getItem("acchostel_bookings") || "[]",
      );
      bookings.push(newBooking);
      localStorage.setItem("acchostel_bookings", JSON.stringify(bookings));

      // Show confirmation modal
      showBookingConfirmModal(newBooking);

      // Send confirmation email via EmailJS
      if (typeof EmailService !== "undefined") {
        EmailService.sendConfirmation(newBooking).then((result) => {
          updateEmailStatus(result.success, newBooking.email);
        });
      } else {
        updateEmailStatus(false, newBooking.email);
      }
    });
  }
});
