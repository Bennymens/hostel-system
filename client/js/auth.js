/* ============================================
   Auth JavaScript (Login / Register)
   ============================================ */

// Toggle password visibility
function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const icon = btn.querySelector("i");
  if (input.type === "password") {
    input.type = "text";
    icon.className = "fas fa-eye-slash";
  } else {
    input.type = "password";
    icon.className = "fas fa-eye";
  }
}

// ---- Accounts Storage Helpers ----
function getAccounts() {
  try {
    return JSON.parse(localStorage.getItem("acchostel_accounts")) || [];
  } catch (e) {
    return [];
  }
}
function saveAccounts(accounts) {
  localStorage.setItem("acchostel_accounts", JSON.stringify(accounts));
}
function findAccount(email) {
  return getAccounts().find(
    (a) => a.email.toLowerCase() === email.toLowerCase(),
  );
}

document.addEventListener("DOMContentLoaded", () => {
  // If already logged in, redirect away from auth pages
  if (Auth.isLoggedIn()) {
    window.location.href = "index.html";
    return;
  }

  // ──────────────── Login Form ────────────────
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      // Validation
      let valid = true;
      if (!email || !email.includes("@")) {
        document.getElementById("emailError").classList.add("active");
        valid = false;
      } else {
        document.getElementById("emailError").classList.remove("active");
      }
      if (!password) {
        document.getElementById("passwordError").classList.add("active");
        valid = false;
      } else {
        document.getElementById("passwordError").classList.remove("active");
      }
      if (!valid) return;

      // Check account exists
      const account = findAccount(email);
      if (!account) {
        document.getElementById("emailError").textContent =
          "No account found with this email";
        document.getElementById("emailError").classList.add("active");
        return;
      }
      // Check password
      if (account.password !== password) {
        document.getElementById("passwordError").textContent =
          "Incorrect password";
        document.getElementById("passwordError").classList.add("active");
        return;
      }

      // Success — log in
      const user = {
        name: account.name,
        email: account.email,
        phone: account.phone || "",
        school: account.school || "",
        role: "student",
      };
      Auth.login(user);
      showToast("Login successful! Redirecting...", "success");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 800);
    });

    // Reset error text on input
    document.getElementById("email").addEventListener("input", () => {
      document.getElementById("emailError").textContent =
        "Please enter a valid email";
      document.getElementById("emailError").classList.remove("active");
    });
    document.getElementById("password").addEventListener("input", () => {
      document.getElementById("passwordError").textContent =
        "Password is required";
      document.getElementById("passwordError").classList.remove("active");
    });
  }

  // ──────────────── Register Form ────────────────
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const firstName = document.getElementById("firstName").value.trim();
      const lastName = document.getElementById("lastName").value.trim();
      const email = document.getElementById("regEmail").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const school = document.getElementById("school").value;
      const password = document.getElementById("regPassword").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      let valid = true;

      // Name check
      if (!firstName || !lastName) {
        valid = false;
        showToast("Please enter your full name", "error");
      }

      // Email
      if (!email || !email.includes("@")) {
        document.getElementById("regEmailError").classList.add("active");
        valid = false;
      } else {
        document.getElementById("regEmailError").classList.remove("active");
      }

      // Check duplicate email
      if (valid && findAccount(email)) {
        document.getElementById("regEmailError").textContent =
          "An account with this email already exists";
        document.getElementById("regEmailError").classList.add("active");
        valid = false;
      }

      // Password length
      if (password.length < 6) {
        document.getElementById("regPasswordError").classList.add("active");
        valid = false;
      } else {
        document.getElementById("regPasswordError").classList.remove("active");
      }

      // Password match
      if (password !== confirmPassword) {
        document.getElementById("confirmError").classList.add("active");
        valid = false;
      } else {
        document.getElementById("confirmError").classList.remove("active");
      }

      if (!valid) return;

      // Save new account
      const accounts = getAccounts();
      const newAccount = {
        name: firstName + " " + lastName,
        email: email,
        phone: phone,
        school: school,
        password: password,
        createdAt: new Date().toISOString(),
      };
      accounts.push(newAccount);
      saveAccounts(accounts);

      // Auto-login after registration
      const user = {
        name: newAccount.name,
        email: newAccount.email,
        phone: newAccount.phone,
        school: newAccount.school,
        role: "student",
      };
      Auth.login(user);
      showToast("Account created successfully! Redirecting...", "success");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 800);
    });

    // Reset duplicate email error on input
    document.getElementById("regEmail").addEventListener("input", () => {
      document.getElementById("regEmailError").textContent =
        "Please enter a valid email";
      document.getElementById("regEmailError").classList.remove("active");
    });
  }
});
