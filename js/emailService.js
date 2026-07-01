/* ============================================
   Email Service - EmailJS Integration
   Sender: kelvyndavies60@gmail.com
   ============================================ */

const EmailService = {
  // EmailJS Public Key & Service Config
  PUBLIC_KEY: "Fas5Fx22Q4U40Ziog",
  SERVICE_ID: "74739kelvyn",
  TEMPLATE_ID: "template_ggui0xo",

  /**
   * Initialize EmailJS with the public key
   */
  init() {
    if (typeof emailjs !== "undefined") {
      emailjs.init({
        publicKey: this.PUBLIC_KEY,
      });
    }
  },

  /**
   * Send a booking confirmation email to the user
   * @param {Object} booking - The booking details object
   * @returns {Promise}
   */
  async sendConfirmation(booking) {
    if (typeof emailjs === "undefined") {
      console.warn("EmailJS not loaded. Cannot send email.");
      return { success: false, error: "EmailJS not available" };
    }

    const templateParams = {
      name: booking.name, // Maps to {{name}} in the body
      to_name: booking.name,
      to_email: booking.email,
      email: booking.email, // Maps to {{email}} in To Email and Reply-To
      from_name: "UPSA HOSTELS",
      reply_to: booking.email, // Fallback reply_to value
      title: `Booking for ${booking.hostelName} (${booking.room}) - Ref: ${booking.ref}`, // Maps to {{title}} in the body
      booking_ref: booking.ref,
      hostel_name: booking.hostelName,
      room_type: booking.room,
      move_in: formatDateDisplay(booking.moveIn),
      move_out: formatDateDisplay(booking.moveOut),
      total_amount: formatGHS(booking.totalAmount || 0),
      payment_method: booking.paymentMethod || "Mobile Money",
      booking_date: new Date(booking.date).toLocaleDateString("en-GB", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      support_email: "kelvyndavies60@gmail.com",
    };

    try {
      console.log("EmailJS sending with:", {
        serviceId: this.SERVICE_ID,
        templateId: this.TEMPLATE_ID,
        params: templateParams,
      });
      const response = await emailjs.send(
        this.SERVICE_ID,
        this.TEMPLATE_ID,
        templateParams
      );
      console.log("Confirmation email sent successfully:", response);
      return { success: true, response };
    } catch (error) {
      console.error("Failed to send confirmation email:", error);
      const errorMsg = error?.text || error?.message || JSON.stringify(error);
      console.error("Error detail:", errorMsg);
      return { success: false, error: errorMsg };
    }
  },
};

/**
 * Format a date string (YYYY-MM-DD) to a readable display
 */
function formatDateDisplay(dateStr) {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
