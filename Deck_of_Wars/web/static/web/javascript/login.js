// Tab switching functionality
function switchTab(tabName) {
  const signinForm = document.getElementById("signinForm");
  const signupForm = document.getElementById("signupForm");
  const signinTab = document.getElementById("signinTab");
  const signupTab = document.getElementById("signupTab");
  const title = document.querySelector(".auth-title");

  // Clear any messages
  clearMessages();

  if (tabName === "signin") {
    signinForm.style.display = "block";
    signupForm.style.display = "none";
    signinTab.classList.add("active");
    signupTab.classList.remove("active");
    title.textContent = " ";
    title.setAttribute("data-text", " ");
  }

  // Add tab switch effect
  createPowerBurst(event.target);
}

// Handle sign in
// Handle sign in with specific error messages
function handleSignIn(event) {
  event.preventDefault();

  const username = document.getElementById("signinEmail").value;
  const password = document.getElementById("signinPassword").value;

  if (!username || !password) {
    showMessage("All fields are required, hero!", "error");
    return;
  }

  showLoading(true);

  // Simulate API call
  setTimeout(() => {
    showLoading(false);

    // Define valid credentials for testing
    const validCredentials = {
      "hero@test.com": "password123",
      admin: "admin123",
      player1: "game123",
    };

    const isValidUsername = validCredentials.hasOwnProperty(username);
    const isValidPassword =
      isValidUsername && validCredentials[username] === password;

    // Determine specific error message
    if (!isValidUsername && !isValidPassword) {
      showMessage("Wrong Username and Password!", "error");
      shakeInputs(["signinEmail", "signinPassword"]);
      shakeForm();
    } else if (!isValidUsername) {
      showMessage("Wrong Username!", "error");
      shakeInputs(["signinEmail"]);
      // Highlight the username field
      document.getElementById("signinEmail").style.borderColor = "#FF0000";
      document.getElementById("signinEmail").style.backgroundColor = "#FFE4E4";
    } else if (!isValidPassword) {
      showMessage("Wrong Password!", "error");
      shakeInputs(["signinPassword"]);
      // Highlight the password field
      document.getElementById("signinPassword").style.borderColor = "#FF0000";
      document.getElementById("signinPassword").style.backgroundColor =
        "#FFE4E4";
    } else {
      // Success case
      showMessage("KABOOM! Sign in successful!", "success");
      createMultipleBursts();

      // Redirect after success animation
      setTimeout(() => {
        // In real implementation, this would submit the form
        event.target.closest("form").submit();
      }, 2000);
    }
  }, 1500);
}

// Handle sign up
function handleSignUp(event) {
  event.preventDefault();

  const username = document.getElementById("signupUsername").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // Validation
  if (!username || !email || !password || !confirmPassword) {
    showMessage("All fields are required, future hero!", "error");
    return;
  }

  if (username.length < 3) {
    showMessage("Hero name must be at least 3 characters!", "error");
    return;
  }

  if (password.length < 6) {
    showMessage("Password must be at least 6 characters strong!", "error");
    return;
  }

  if (password !== confirmPassword) {
    showMessage("Passwords don't match! Check your powers!", "error");
    shakeInputs(["signupPassword", "confirmPassword"]);
    return;

    // For production - replace the mock validation with:
    if (isValidUsername && isValidPassword) {
      // Submit the actual form to Django
      event.target.closest("form").submit();
    } else {
      // Handle errors as shown above
    }
  }

  showLoading(true);

  // Simulate API call
  setTimeout(() => {
    showLoading(false);
    showMessage("BOOM! Welcome to the hero squad!", "success");
    createMultipleBursts();

    // Clear form
    document.getElementById("signupForm").reset();

    // Switch to sign in tab after success
    setTimeout(() => {
      switchTab("signin");
      showMessage("Now sign in with your new hero account!", "success");
    }, 2000);
  }, 2000);
}

// Show loading indicator
function showLoading(show) {
  const loading = document.getElementById("loadingIndicator");
  loading.style.display = show ? "block" : "none";
}

// Show messages
function showMessage(text, type) {
  const messageArea = document.getElementById("messageArea");
  const message = document.createElement("div");
  message.className = `message ${type}`;
  message.innerHTML = `<i class="fas fa-${
    type === "success" ? "check-circle" : "exclamation-triangle"
  }"></i> ${text}`;

  messageArea.innerHTML = "";
  messageArea.appendChild(message);

  // Add screen shake for errors
  if (type === "error") {
    shakeScreen();
  }

  setTimeout(() => {
    if (message.parentNode) {
      message.remove();
    }
  }, 5000);
}

// Clear messages
function clearMessages() {
  document.getElementById("messageArea").innerHTML = "";
}

// Forgot password
function forgotPassword() {
  showMessage("POW! Password reset link sent to your email!", "success");
  createPowerBurst(event.target);
}

// Create power burst effect
function createPowerBurst(element) {
  const rect = element.getBoundingClientRect();
  const burst = document.createElement("div");
  burst.className = "power-burst";
  burst.style.left = rect.left + rect.width / 2 - 50 + "px";
  burst.style.top = rect.top + rect.height / 2 - 50 + "px";
  document.body.appendChild(burst);

  setTimeout(() => {
    if (burst.parentNode) burst.remove();
  }, 1000);
}

// Create multiple power bursts
function createMultipleBursts() {
  const container = document.querySelector(".auth-container");

  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      const burst = document.createElement("div");
      burst.className = "power-burst";
      burst.style.left = Math.random() * container.offsetWidth + "px";
      burst.style.top = Math.random() * container.offsetHeight + "px";
      burst.style.position = "absolute";
      container.appendChild(burst);

      setTimeout(() => burst.remove(), 1000);
    }, i * 150);
  }
}

// Add enhanced button interactions
function addButtonEnhancements() {
  // Enhance tab buttons
  document.querySelectorAll(".tab-button").forEach((btn) => {
    btn.addEventListener("mouseenter", function () {
      if (!this.classList.contains("active")) {
        this.style.filter = "brightness(1.1)";
      }
    });

    btn.addEventListener("mouseleave", function () {
      this.style.filter = "brightness(1)";
    });
  });

  // Enhance form inputs
  document.querySelectorAll(".form-input").forEach((input) => {
    input.addEventListener("mouseenter", function () {
      this.style.filter = "brightness(1.02)";
    });

    input.addEventListener("mouseleave", function () {
      this.style.filter = "brightness(1)";
    });
  });

  // Enhance submit and guest buttons
  document.querySelectorAll(".submit-btn, .guest-btn").forEach((btn) => {
    btn.addEventListener("mouseenter", function () {
      this.style.filter = "brightness(1.05)";
    });

    btn.addEventListener("mouseleave", function () {
      this.style.filter = "brightness(1)";
    });
  });
}

// Call the enhancement function
addButtonEnhancements();

// Clear error styling when user starts typing
document.getElementById("signinEmail").addEventListener("input", function () {
  this.style.borderColor = "#000";
  this.style.backgroundColor = "";
  clearMessages();
});

document
  .getElementById("signinPassword")
  .addEventListener("input", function () {
    this.style.borderColor = "#000";
    this.style.backgroundColor = "";
    clearMessages();
  });

// Shake form on error
function shakeForm() {
  const container = document.querySelector(".auth-container");
  container.style.animation = "none";
  container.offsetHeight; // Trigger reflow
  container.style.animation = "formShake 0.6s ease-in-out";

  setTimeout(() => {
    container.style.animation = "containerFloat 4s ease-in-out infinite";
  }, 400);
}

// Shake specific inputs
function shakeInputs(inputIds) {
  inputIds.forEach((id) => {
    const input = document.getElementById(id);
    input.style.animation = "inputShake 0.5s ease-in-out";
    setTimeout(() => {
      input.style.animation = "";
    }, 300);
  });
}

// Add shake animations
const shakeStyles = document.createElement("style");
shakeStyles.textContent = `
            @keyframes formShake {
                0%, 100% { transform: translateX(0) translateY(0); }
                10% { transform: translateX(-10px) translateY(0); }
                20% { transform: translateX(10px) translateY(0); }
                30% { transform: translateX(-8px) translateY(0); }
                40% { transform: translateX(8px) translateY(0); }
                50% { transform: translateX(-6px) translateY(0); }
                60% { transform: translateX(6px) translateY(0); }
                70% { transform: translateX(-4px) translateY(0); }
                80% { transform: translateX(4px) translateY(0); }
                90% { transform: translateX(-2px) translateY(0); }
            }
            
            @keyframes inputShake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
        `;
document.head.appendChild(shakeStyles);

// Enhanced form interactions
const inputs = document.querySelectorAll(".form-input");
inputs.forEach((input) => {
  input.addEventListener("focus", function () {
    createPowerBurst(this);
  });

  input.addEventListener("input", function () {
    if (this.value.length > 0) {
      this.style.borderColor = "#32CD32";
      this.style.backgroundColor = "#F0FFF0";
    } else {
      this.style.borderColor = "#000";
      this.style.backgroundColor = "";
    }
  });
});

// Add click effects to buttons
document.addEventListener("click", function (e) {
  if (
    e.target.classList.contains("submit-btn") ||
    e.target.classList.contains("tab-button") ||
    e.target.tagName === "A"
  )
    // Create particle explosion effect
    function createParticleExplosion(x, y) {
      // Simple burst effect
      createPowerBurst({
        getBoundingClientRect: () => ({
          left: x - 25,
          top: y - 25,
          width: 50,
          height: 50,
        }),
      });
    }
});

// Screen shake effect for dramatic moments
function screenShake() {
  document.body.style.animation = "screenShakeEffect 0.6s ease-in-out";
  setTimeout(() => {
    document.body.style.animation = "";
  }, 600);
}

const screenShakeStyles = document.createElement("style");
screenShakeStyles.textContent = `
            @keyframes screenShakeEffect {
                0%, 100% { transform: translateX(0px) translateY(0px); }
                10% { transform: translateX(-3px) translateY(-3px); }
                20% { transform: translateX(3px) translateY(3px); }
                30% { transform: translateX(-3px) translateY(3px); }
                40% { transform: translateX(3px) translateY(-3px); }
                50% { transform: translateX(-2px) translateY(-2px); }
                60% { transform: translateX(2px) translateY(2px); }
                70% { transform: translateX(-2px) translateY(2px); }
                80% { transform: translateX(2px) translateY(-2px); }
                90% { transform: translateX(-1px) translateY(-1px); }
            }
        `;
document.head.appendChild(screenShakeStyles);

// Add screen shake on form errors
function shakeScreen() {
  screenShake();
}

// Add keyboard shortcuts for better UX
document.addEventListener("keydown", function (e) {
  // Enter key to submit forms
  if (e.key === "Enter" && e.ctrlKey) {
    const activeForm = document.querySelector(
      '.form-container:not([style*="display: none"])'
    );
    if (activeForm) {
      const submitBtn = activeForm.querySelector(".submit-btn");
      if (submitBtn) {
        submitBtn.click();
      }
    }
  }

  // Tab key to switch between sign in/up
  if (e.key === "Tab" && e.ctrlKey) {
    e.preventDefault();
    const activeTab = document.querySelector(".tab-button.active");
    if (activeTab.id === "signinTab") {
      switchTab("signup");
    } else {
      switchTab("signin");
    }
  }
});

// Add some initial welcome effects
window.addEventListener("load", function () {
  // Create welcome burst
  setTimeout(() => {
    createMultipleBursts();
  }, 500);

  // Show welcome message
  setTimeout(() => {
    showMessage("Welcome to Power Clash!", "success");
  }, 1000);
});

function validatePassword(password) {
  return password.length >= 6;
}

function validateUsername(username) {
  return username.length >= 3 && /^[a-zA-Z0-9\s]+$/.test(username);
}

// Debounce function for better performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

document
  .getElementById("signupPassword")
  .addEventListener("input", function () {
    const strength = this.value.length;
    if (strength < 6 && strength > 0) {
      this.style.borderColor = "#FF6347";
      this.style.backgroundColor = "#FFF0E6";
    } else if (strength >= 6) {
      this.style.borderColor = "#32CD32";
      this.style.backgroundColor = "#F0FFF0";
    }
  });

document
  .getElementById("confirmPassword")
  .addEventListener("input", function () {
    const password = document.getElementById("signupPassword").value;
    if (this.value && this.value !== password) {
      this.style.borderColor = "#FF0000";
      this.style.backgroundColor = "#FFE4E4";
    } else if (this.value === password && this.value) {
      this.style.borderColor = "#32CD32";
      this.style.backgroundColor = "#F0FFF0";
    }
  });

// Auto-focus first input when switching tabs
function switchTab(tabName) {
  const signinForm = document.getElementById("signinForm");
  const signupForm = document.getElementById("signupForm");
  const signinTab = document.getElementById("signinTab");
  const signupTab = document.getElementById("signupTab");
  const title = document.querySelector(".auth-title");
  const guestContainer = document.querySelector(".guest-login-container");
  clearMessages();

  if (tabName === "signin") {
    signinForm.style.display = "block";
    signupForm.style.display = "none";
    guestContainer.style.display = "block";
    signinTab.classList.add("active");
    signupTab.classList.remove("active");
    title.textContent = " ";
    title.setAttribute("data-text", " ");

    setTimeout(() => {
      document.getElementById("signinEmail").focus();
    }, 200);
  } else {
    signupForm.style.display = "block";
    signinForm.style.display = "none";
    guestContainer.style.display = "none";
    signinTab.classList.remove("active");
    signupTab.classList.add("active");

    setTimeout(() => {
      document.getElementById("signupUsername").focus();
    }, 3);
  }

  createPowerBurst(event.target);
}

// Handle Guest Login
function handleGuestLogin(event) {
  event.preventDefault();
  event.stopPropagation();

  showMessage("ZAP! Entering as a guest!", "success");
  createPowerBurst(event.target);

  showLoading(true);

  // Redirect to the Django guest login URL
  setTimeout(() => {
    window.location.href = "/guest/";
  }, 1500);
}

// Real-time username availability check
document.getElementById("signupUsername").addEventListener("blur", function () {
  const username = this.value;
  if (username.length >= 3) {
    // Simulate checking if username exists
    // In production, you'd make an AJAX call to your Django backend
    const existingUsernames = [
      "admin",
      "player1",
      "hero@test.com",
      "testuser",
      "superman",
    ];

    if (existingUsernames.includes(username.toLowerCase())) {
      this.style.borderColor = "#FF0000";
      this.style.backgroundColor = "#FFE4E4";
      showMessage(`Username "${username}" is already taken!`, "error");
    } else {
      this.style.borderColor = "#32CD32";
      this.style.backgroundColor = "#F0FFF0";
    }
  }
});
