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
    loginForm.addEventListener("submit", async (e) => {
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

      const loginBtn = loginForm.querySelector('button[type="submit"]');
      const originalText = loginBtn.innerHTML;
      loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
      loginBtn.disabled = true;

      try {
        const res = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'login', payload: { email, password } })
        });
        const data = await res.json();

        if (data.success) {
          const user = {
            name: data.user.name,
            email: data.user.email,
            phone: data.user.phone || "",
            school: data.user.school || "",
            role: "student",
          };
          Auth.login(user);
          showToast("Login successful! Redirecting...", "success");
          setTimeout(() => {
            window.location.href = "index.html";
          }, 800);
        } else {
          document.getElementById("emailError").textContent = data.message;
          document.getElementById("emailError").classList.add("active");
        }
      } catch (err) {
        showToast("Error connecting to server. Falling back to local storage.", "error");
        // Fallback to local storage
        const account = findAccount(email);
        if (!account || account.password !== password) {
          document.getElementById("emailError").textContent = "Invalid credentials";
          document.getElementById("emailError").classList.add("active");
        } else {
          Auth.login({ name: account.name, email: account.email, role: "student" });
          window.location.href = "index.html";
        }
      } finally {
        loginBtn.innerHTML = originalText;
        loginBtn.disabled = false;
      }
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
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const firstName = document.getElementById("firstName").value.trim();
      const lastName = document.getElementById("lastName").value.trim();
      const email = document.getElementById("regEmail").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const school = document.getElementById("school").value;
      const password = document.getElementById("regPassword").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      let valid = true;

      if (!firstName || !lastName) {
        valid = false;
        showToast("Please enter your full name", "error");
      }

      if (!email || !email.includes("@")) {
        document.getElementById("regEmailError").classList.add("active");
        valid = false;
      } else {
        document.getElementById("regEmailError").classList.remove("active");
      }

      if (password.length < 6) {
        document.getElementById("regPasswordError").classList.add("active");
        valid = false;
      } else {
        document.getElementById("regPasswordError").classList.remove("active");
      }

      if (password !== confirmPassword) {
        document.getElementById("confirmError").classList.add("active");
        valid = false;
      } else {
        document.getElementById("confirmError").classList.remove("active");
      }

      if (!valid) return;

      const registerBtn = registerForm.querySelector('button[type="submit"]');
      const originalText = registerBtn.innerHTML;
      registerBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
      registerBtn.disabled = true;

      const newAccount = {
        name: firstName + " " + lastName,
        email: email,
        phone: phone,
        school: school,
        password: password,
        createdAt: new Date().toISOString(),
      };

      try {
        const res = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'register', payload: newAccount })
        });
        const data = await res.json();

        if (data.success) {
          // Also save locally as a backup for other pages
          const accounts = getAccounts();
          accounts.push(newAccount);
          saveAccounts(accounts);

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
        } else {
          document.getElementById("regEmailError").textContent = data.message;
          document.getElementById("regEmailError").classList.add("active");
        }
      } catch (err) {
        showToast("Server error, saving locally.", "warning");
        const accounts = getAccounts();
        if (findAccount(email)) {
          document.getElementById("regEmailError").textContent = "Account exists locally";
          document.getElementById("regEmailError").classList.add("active");
        } else {
          accounts.push(newAccount);
          saveAccounts(accounts);
          Auth.login({ name: newAccount.name, email: newAccount.email, role: "student" });
          window.location.href = "index.html";
        }
      } finally {
        registerBtn.innerHTML = originalText;
        registerBtn.disabled = false;
      }
    });

    // Reset duplicate email error on input
    document.getElementById("regEmail").addEventListener("input", () => {
      document.getElementById("regEmailError").textContent =
        "Please enter a valid email";
      document.getElementById("regEmailError").classList.remove("active");
    });
  }
});
