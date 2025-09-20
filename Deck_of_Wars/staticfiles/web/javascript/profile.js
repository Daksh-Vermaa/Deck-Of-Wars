// Sound effects system
const playSound = (soundName) => {
  try {
    const audio = new Audio(`assets/sound/${soundName}.mp3`);
    audio.volume = 0.3;
    audio.play().catch((e) => console.log("Sound play failed:", e));
  } catch (e) {
    console.log("Sound loading failed:", e);
  }
};

// Global variables
const currentImage = null;
let cropCanvas = null;
let cropContext = null;
let isDragging = false;
const cropArea = { x: 0, y: 0, width: 200, height: 200 };
let cropper = null;

// Function declarations
function checkUsernameAvailability() {
  const username = document.getElementById("newUsername").value.trim();
  const statusElement = document.getElementById("usernameStatus");

  if (!username) {
    statusElement.textContent = "";
    statusElement.className = "username-status";
    return;
  }

  if (username.length < 3) {
    statusElement.textContent = "Too short";
    statusElement.className = "username-status taken";
    return;
  }

  // Simulate checking (in real app, this would be an API call)
  statusElement.textContent = "Checking...";
  statusElement.className = "username-status checking";

  setTimeout(() => {
    // Simulate availability check
    const isAvailable = !["admin", "user", "test"].includes(
      username.toLowerCase()
    );
    statusElement.textContent = isAvailable ? "Available ✓" : "Taken ✗";
    statusElement.className = `username-status ${
      isAvailable ? "available" : "taken"
    }`;
  }, 500);
}

function checkPasswordMatch() {
  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmNewPassword").value;

  if (!newPassword || !confirmPassword) return;

  const match = newPassword === confirmPassword;
  const confirmInput = document.getElementById("confirmNewPassword");

  if (match) {
    confirmInput.style.borderColor = "#32cd32";
    confirmInput.style.boxShadow = "0 0 0 4px rgba(50, 205, 50, 0.3)";
  } else {
    confirmInput.style.borderColor = "#ff6347";
    confirmInput.style.boxShadow = "0 0 0 4px rgba(255, 99, 71, 0.3)";
  }
}

// Initialize profile page
document.addEventListener("DOMContentLoaded", () => {
  loadPlayerData();
  setupEventListeners();
  initializeCropCanvas();
});

// Load player data from localStorage or set defaults
function loadPlayerData() {
  const playerData = JSON.parse(localStorage.getItem("playerData")) || {
    name: "Captain Thunder",
    rank: "NOOB",
    matchesPlayed: 0,
    matchesWon: 0,
    winningStreak: 0,
    achievements: 0,
    firstName: "",
    lastName: "",
    birthDate: "",
    location: "",
    bio: "",
    email: "",
    profileImage: null,
  };

  // Update UI with player data
  document.getElementById("playerName").textContent = playerData.name;
  document.getElementById("playerRank").textContent = playerData.rank;
  document.getElementById("matchesPlayed").textContent =
    playerData.matchesPlayed;
  document.getElementById("matchesWon").textContent = playerData.matchesWon;
  document.getElementById("winningStreak").textContent =
    playerData.winningStreak;
  document.getElementById("achievements").textContent = playerData.achievements;

  // Load personal details
  document.getElementById("firstName").value = playerData.firstName;
  document.getElementById("lastName").value = playerData.lastName;
  document.getElementById("birthDate").value = playerData.birthDate;
  document.getElementById("location").value = playerData.location;
  document.getElementById("bio").value = playerData.bio;
  document.getElementById("email").value = playerData.email;

  if (
    playerData.profileImage &&
    playerData.profileImage !== "null" &&
    playerData.profileImage !== "" &&
    playerData.profileImage.startsWith("data:")
  ) {
    const profileImg = document.getElementById("profileImage");
    const defaultAvatar = document.querySelector(".default-avatar");
    if (profileImg && defaultAvatar) {
      profileImg.src = playerData.profileImage;
      profileImg.style.display = "block";
      defaultAvatar.style.display = "none";
      const removeBtn = document.getElementById("removeBtn");
      if (removeBtn) {
        removeBtn.style.display = "inline-block";
      }
    }
  } else {
    setDefaultAvatar();
  }
}

// Save player data to localStorage
function savePlayerData() {
  const playerData = {
    name: document.getElementById("playerName").textContent,
    rank: document.getElementById("playerRank").textContent,
    matchesPlayed: Number.parseInt(
      document.getElementById("matchesPlayed").textContent
    ),
    matchesWon: Number.parseInt(
      document.getElementById("matchesWon").textContent
    ),
    winningStreak: Number.parseInt(
      document.getElementById("winningStreak").textContent
    ),
    achievements: Number.parseInt(
      document.getElementById("achievements").textContent
    ),
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    birthDate: document.getElementById("birthDate").value,
    location: document.getElementById("location").value,
    bio: document.getElementById("bio").value,
    email: document.getElementById("email").value,
    profileImage: document.getElementById("profileImage").src || null,
  };

  localStorage.setItem("playerData", JSON.stringify(playerData));
}

// Setup event listeners
function setupEventListeners() {
  // Real-time username checking
  const usernameInput = document.getElementById("newUsername");
  if (usernameInput) {
    usernameInput.addEventListener("input", checkUsernameAvailability);
  }

  // Password confirmation checking
  const newPassword = document.getElementById("newPassword");
  const confirmPassword = document.getElementById("confirmNewPassword");
  if (newPassword && confirmPassword) {
    confirmPassword.addEventListener("input", checkPasswordMatch);
  }

  // File input for image upload
  const imageInput = document.getElementById("imageInput");
  if (imageInput) {
    imageInput.addEventListener("change", handleImageSelect);
  }

  // Add sound effects to buttons
  document.querySelectorAll(".comic-btn").forEach((button) => {
    button.addEventListener("mouseenter", () => playSound("hover"));
    button.addEventListener("click", () => playSound("click"));
  });

  // Tab switching functionality
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () =>
      window.switchTab(btn.id.replace("Tab", ""))
    );
  });

  // Forgot password functionality
  const forgotPasswordBtn = document.getElementById("forgotPasswordBtn");
  if (forgotPasswordBtn) {
    forgotPasswordBtn.addEventListener("click", window.forgotPassword);
  }

  // Confirmation modal for image removal
  const closeConfirmationBtn = document.getElementById("closeConfirmationBtn");
  if (closeConfirmationBtn) {
    closeConfirmationBtn.addEventListener("click", window.closeConfirmation);
  }

  const confirmRemoveImageBtn = document.getElementById(
    "confirmRemoveImageBtn"
  );
  if (confirmRemoveImageBtn) {
    confirmRemoveImageBtn.addEventListener("click", window.confirmRemoveImage);
  }

  // Open confirmation modal for image removal
  const openConfirmationBtn = document.getElementById("openConfirmationBtn");
  if (openConfirmationBtn) {
    openConfirmationBtn.addEventListener("click", window.openConfirmation);
  }

  // Save personal details
  const savePersonalDetailsBtn = document.getElementById(
    "savePersonalDetailsBtn"
  );
  if (savePersonalDetailsBtn) {
    savePersonalDetailsBtn.addEventListener(
      "click",
      window.savePersonalDetails
    );
  }

  // Update email
  const updateEmailBtn = document.getElementById("updateEmailBtn");
  if (updateEmailBtn) {
    updateEmailBtn.addEventListener("click", window.updateEmail);
  }

  // Update username
  const updateUsernameBtn = document.getElementById("updateUsernameBtn");
  if (updateUsernameBtn) {
    updateUsernameBtn.addEventListener("click", window.updateUsername);
  }

  // Update password
  const updatePasswordBtn = document.getElementById("updatePasswordBtn");
  if (updatePasswordBtn) {
    updatePasswordBtn.addEventListener("click", window.updatePassword);
  }

  // Update all security settings
  const updateAllSecurityBtn = document.getElementById("updateAllSecurityBtn");
  if (updateAllSecurityBtn) {
    updateAllSecurityBtn.addEventListener("click", window.updateAllSecurity);
  }
}

// Navigation functions
window.goToMainMenu = () => {
  playSound("click");
  showComicAlert("WHOOSH! Returning to main menu...", "#4ecdc4");
  setTimeout(() => {
    window.location.href = "index.html";
  }, 1000);
};

// Profile picture functions
window.uploadImage = () => {
  playSound("click");
  createPowerBurst(event.target);
  document.getElementById("imageInput").click();
};

window.removeImage = () => {
  playSound("click");
  createPowerBurst(event.target);

  // Show confirmation modal instead of directly removing
  document.getElementById("confirmationModal").style.display = "flex";
};

// Confirmation modal functions
window.closeConfirmation = () => {
  playSound("click");
  document.getElementById("confirmationModal").style.display = "none";
};

window.confirmRemoveImage = () => {
  playSound("click");
  createPowerBurst(event.target);

  // Clear the stored profile image first
  const playerData = JSON.parse(localStorage.getItem("playerData")) || {};
  playerData.profileImage = null;
  localStorage.setItem("playerData", JSON.stringify(playerData));

  // Then reset to default avatar
  setDefaultAvatar();

  // Close confirmation modal
  document.getElementById("confirmationModal").style.display = "none";

  showComicAlert("ZAP! Profile image removed!", "#ff6b6b");
};

// Handle image selection
function handleImageSelect(event) {
  const file = event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    showComicAlert("BAM! Please select an image file!", "#ff6b6b");
    event.target.value = ""; // Clear the input
    return;
  }

  // Check file size (limit to 5MB)
  if (file.size > 5 * 1024 * 1024) {
    showComicAlert("BOOM! Image must be smaller than 5MB!", "#ff6b6b");
    event.target.value = ""; // Clear the input
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const imageToCrop = document.getElementById("imageToCrop");
    imageToCrop.src = e.target.result;
    showCropModal();
  };
  reader.readAsDataURL(file);
}

// Initialize crop canvas
function initializeCropCanvas() {
  cropCanvas = document.getElementById("cropCanvas");
  cropContext = cropCanvas.getContext("2d");

  // Set canvas size
  cropCanvas.width = 400;
  cropCanvas.height = 400;

  // Add mouse events for cropping
  cropCanvas.addEventListener("mousedown", startCrop);
  cropCanvas.addEventListener("mousemove", updateCrop);
  cropCanvas.addEventListener("mouseup", endCrop);
}

// Show crop modal
function showCropModal() {
  const modal = document.getElementById("cropModal");
  const imageToCrop = document.getElementById("imageToCrop");

  modal.style.display = "flex";

  // Initialize Cropper.js with free-form cropping
  if (cropper) {
    cropper.destroy();
  }

  // Assuming Cropper.js is imported or defined elsewhere
  const Cropper = window.Cropper || null;
  if (Cropper) {
    cropper = new Cropper(imageToCrop, {
      aspectRatio: Number.NaN, // Free-form cropping
      viewMode: 1,
      background: false,
      responsive: true,
      restore: true,
      checkOrientation: true,
      rotatable: true,
      scalable: true,
      zoomable: true,
      movable: true,
      cropBoxResizable: true,
      cropBoxMovable: true,
      toggleDragModeOnDblclick: false,
    });
  } else {
    console.error("Cropper.js is not defined.");
  }
}

// Crop event handlers
function startCrop(e) {
  const rect = cropCanvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // Check if click is inside crop area for dragging
  if (
    x >= cropArea.x &&
    x <= cropArea.x + cropArea.width &&
    y >= cropArea.y &&
    y <= cropArea.y + cropArea.height
  ) {
    isDragging = true;
    cropArea.startX = x - cropArea.x;
    cropArea.startY = y - cropArea.y;
  } else {
    // Start new crop area
    cropArea.x = x;
    cropArea.y = y;
    cropArea.width = 0;
    cropArea.height = 0;
    isDragging = false;
  }
}

function updateCrop(e) {
  if (!currentImage) return;

  const rect = cropCanvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (isDragging) {
    // Move crop area
    cropArea.x = x - cropArea.startX;
    cropArea.y = y - cropArea.startY;

    // Keep within canvas bounds
    cropArea.x = Math.max(
      0,
      Math.min(cropArea.x, cropCanvas.width - cropArea.width)
    );
    cropArea.y = Math.max(
      0,
      Math.min(cropArea.y, cropCanvas.height - cropArea.height)
    );
  } else if (e.buttons === 1) {
    // Resize crop area
    cropArea.width = x - cropArea.x;
    cropArea.height = y - cropArea.y;

    // Make it square
    const size = Math.min(Math.abs(cropArea.width), Math.abs(cropArea.height));
    cropArea.width = cropArea.width < 0 ? -size : size;
    cropArea.height = cropArea.height < 0 ? -size : size;
  }

  drawImageOnCanvas();
}

function endCrop() {
  isDragging = false;
}

// Apply crop
window.applyCrop = () => {
  if (!cropper) return;

  playSound("click");

  // Get cropped canvas from Cropper.js
  const canvas = cropper.getCroppedCanvas({
    width: 256,
    height: 256,
  });

  // Update profile picture
  const profileImg = document.getElementById("profileImage");
  const defaultAvatar = document.querySelector(".default-avatar");
  const removeBtn = document.getElementById("removeBtn");

  const croppedImageDataURL = canvas.toDataURL("image/png");
  profileImg.src = croppedImageDataURL;
  profileImg.style.display = "block";
  defaultAvatar.style.display = "none";
  removeBtn.style.display = "inline-block";

  // Save data and close modal
  savePlayerData();
  window.cancelCrop();

  showComicAlert("BOOM! Profile picture updated!", "#32cd32");
  createPowerBurst(event.target);
};

// Cancel crop
window.cancelCrop = () => {
  playSound("click");

  if (cropper) {
    cropper.destroy();
    cropper = null;
  }

  document.getElementById("cropModal").style.display = "none";

  // Reset file input
  document.getElementById("imageInput").value = "";
};

// Draw image on canvas with crop area
function drawImageOnCanvas() {
  const canvas = cropCanvas;
  const ctx = cropContext;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Calculate image dimensions to fit canvas
  const scale = Math.min(
    canvas.width / currentImage.width,
    canvas.height / currentImage.height
  );
  const scaledWidth = currentImage.width * scale;
  const scaledHeight = currentImage.height * scale;
  const x = (canvas.width - scaledWidth) / 2;
  const y = (canvas.height - scaledHeight) / 2;

  // Draw image
  ctx.drawImage(currentImage, x, y, scaledWidth, scaledHeight);

  // Draw crop area overlay
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Clear crop area
  ctx.globalCompositeOperation = "destination-out";
  ctx.fillRect(cropArea.x, cropArea.y, cropArea.width, cropArea.height);

  // Draw crop border
  ctx.globalCompositeOperation = "source-over";
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 2;
  ctx.strokeRect(cropArea.x, cropArea.y, cropArea.width, cropArea.height);
}

// Tab switching functionality
window.switchTab = (tabName) => {
  playSound("click");

  // Remove active class from all tabs and content
  document
    .querySelectorAll(".tab-btn")
    .forEach((btn) => btn.classList.remove("active"));
  document
    .querySelectorAll(".tab-content")
    .forEach((content) => content.classList.remove("active"));

  // Add active class to selected tab and content
  document.getElementById(tabName + "Tab").classList.add("active");
  document.getElementById(tabName + "Content").classList.add("active");

  // Create power burst effect
  createPowerBurst(event.target);
};

// Default image functionality
function setDefaultAvatar() {
  const profileImg = document.getElementById("profileImage");
  const defaultAvatar = document.querySelector(".default-avatar");
  const removeBtn = document.getElementById("removeBtn");

  if (profileImg) {
    profileImg.style.display = "none";
    profileImg.src = ""; // Clear the src
  }

  if (defaultAvatar) {
    defaultAvatar.style.display = "block"; // Change back to block for img element
  }

  if (removeBtn) {
    removeBtn.style.display = "none";
  }
}

// Forgot password functionality
window.forgotPassword = () => {
  playSound("click");
  createPowerBurst(event.target);

  showComicAlert(
    "WHOOSH! Password reset instructions sent to your email!",
    "#f39c12"
  );

  // In a real application, this would trigger an email to be sent
  // For now, we'll just show a confirmation message
  setTimeout(() => {
    showComicAlert("Check your email for reset instructions!", "#3498db");
  }, 2000);
};

// Rank progression system
function updatePlayerRank(matchesPlayed) {
  const rankElement = document.getElementById("playerRank");
  let newRank = "NOOB";

  if (matchesPlayed >= 100) newRank = "LEGEND";
  else if (matchesPlayed >= 50) newRank = "MASTER";
  else if (matchesPlayed >= 25) newRank = "EXPERT";
  else if (matchesPlayed >= 10) newRank = "WARRIOR";
  else if (matchesPlayed >= 5) newRank = "FIGHTER";

  if (rankElement.textContent !== newRank) {
    rankElement.textContent = newRank;
    showComicAlert(`RANK UP! You are now ${newRank}!`, "#ffd700");
  }
}

// Achievement calculation system
function updateAchievements() {
  const matchesPlayed = Number.parseInt(
    document.getElementById("matchesPlayed").textContent
  );
  const matchesWon = Number.parseInt(
    document.getElementById("matchesWon").textContent
  );
  const winningStreak = Number.parseInt(
    document.getElementById("winningStreak").textContent
  );
  const achievementsElement = document.getElementById("achievements");

  let achievements = 0;

  // Win rate achievements
  const winRate = matchesPlayed > 0 ? (matchesWon / matchesPlayed) * 100 : 0;
  if (winRate >= 90) achievements += 3;
  else if (winRate >= 75) achievements += 2;
  else if (winRate >= 50) achievements += 1;

  // Streak achievements
  if (winningStreak >= 20) achievements += 3;
  else if (winningStreak >= 10) achievements += 2;
  else if (winningStreak >= 5) achievements += 1;

  // Match milestones
  if (matchesPlayed >= 100) achievements += 2;
  else if (matchesPlayed >= 50) achievements += 1;

  // Win milestones
  if (matchesWon >= 75) achievements += 2;
  else if (matchesWon >= 25) achievements += 1;

  achievementsElement.textContent = achievements;
}

// Utility functions
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Comic-style alert function
function showComicAlert(message, color) {
  const alert = document.createElement("div");
  alert.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${color};
    color: #000;
    border: 4px solid #000;
    padding: 20px;
    font-family: 'Bangers', cursive;
    font-size: 1.2rem;
    border-radius: 15px;
    box-shadow: 8px 8px 0px #000;
    z-index: 10000;
    animation: slideIn 0.5s ease-out;
    text-transform: uppercase;
    letter-spacing: 2px;
    max-width: 300px;
  `;
  alert.textContent = message;
  document.body.appendChild(alert);

  // Remove alert after 3 seconds
  setTimeout(() => {
    alert.style.animation = "slideOut 0.5s ease-in";
    setTimeout(() => alert.remove(), 500);
  }, 3000);
}

// Create power burst effect
function createPowerBurst(element) {
  const rect = element.getBoundingClientRect();
  const burst = document.createElement("div");
  burst.className = "power-burst";
  burst.style.left = rect.left + rect.width / 2 - 50 + "px";
  burst.style.top = rect.top + rect.height / 2 - 50 + "px";
  document.body.appendChild(burst);

  setTimeout(() => burst.remove(), 1000);
}

// Add slide animations
const style = document.createElement("style");
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(style);

// Open confirmation modal for image removal
window.openConfirmation = () => {
  playSound("click");
  document.getElementById("confirmationModal").style.display = "flex";
};

// Personal info and security functions
window.savePersonalDetails = () => {
  playSound("click");
  createPowerBurst(event.target);

  savePlayerData();
  showComicAlert("KAPOW! Personal details saved!", "#32cd32");
};

window.updateEmail = () => {
  const email = document.getElementById("email").value;

  if (email && !isValidEmail(email)) {
    showComicAlert("BAM! Please enter a valid email!", "#ff6b6b");
    return;
  }

  playSound("click");
  createPowerBurst(event.target);

  savePlayerData();
  showComicAlert("ZAP! Email updated successfully!", "#32cd32");
};

window.updateUsername = () => {
  const newUsername = document.getElementById("newUsername").value.trim();
  const statusElement = document.getElementById("usernameStatus");

  if (!newUsername) {
    showComicAlert("POW! Please enter a new username!", "#ff6b6b");
    return;
  }

  if (newUsername.length < 3) {
    showComicAlert("BOOM! Username must be at least 3 characters!", "#ff6b6b");
    return;
  }

  if (statusElement.classList.contains("taken")) {
    showComicAlert("WHAM! Username is already taken!", "#ff6b6b");
    return;
  }

  playSound("click");
  createPowerBurst(event.target);

  // Update player name
  document.getElementById("playerName").textContent = newUsername;
  document.getElementById("newUsername").value = "";
  statusElement.textContent = "";

  savePlayerData();
  showComicAlert("KABOOM! Username updated successfully!", "#32cd32");
};

window.updatePassword = () => {
  const currentPassword = document.getElementById("currentPassword").value;
  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmNewPassword").value;

  if (!currentPassword || !newPassword || !confirmPassword) {
    showComicAlert("ZAP! Please fill all password fields!", "#ff6b6b");
    return;
  }

  if (newPassword.length < 6) {
    showComicAlert(
      "POW! New password must be at least 6 characters!",
      "#ff6b6b"
    );
    return;
  }

  if (newPassword !== confirmPassword) {
    showComicAlert("BOOM! New passwords don't match!", "#ff6b6b");
    return;
  }

  playSound("click");
  createPowerBurst(event.target);

  // Clear password fields
  document.getElementById("currentPassword").value = "";
  document.getElementById("newPassword").value = "";
  document.getElementById("confirmNewPassword").value = "";

  showComicAlert("WHAM! Password updated successfully!", "#3498db");
};

// Combined security update function
window.updateAllSecurity = () => {
  const email = document.getElementById("email").value;
  const newUsername = document.getElementById("newUsername").value.trim();
  const currentPassword = document.getElementById("currentPassword").value;
  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmNewPassword").value;
  const statusElement = document.getElementById("usernameStatus");

  let hasUpdates = false;
  const errors = [];

  // Validate email if provided
  if (email) {
    if (!isValidEmail(email)) {
      errors.push("Please enter a valid email!");
    } else {
      hasUpdates = true;
    }
  }

  // Validate username if provided
  if (newUsername) {
    if (newUsername.length < 3) {
      errors.push("Username must be at least 3 characters!");
    } else if (statusElement.classList.contains("taken")) {
      errors.push("Username is already taken!");
    } else {
      hasUpdates = true;
    }
  }

  // Validate password if any password field is filled
  if (currentPassword || newPassword || confirmPassword) {
    if (!currentPassword || !newPassword || !confirmPassword) {
      errors.push("Please fill all password fields to update password!");
    } else if (newPassword.length < 6) {
      errors.push("New password must be at least 6 characters!");
    } else if (newPassword !== confirmPassword) {
      errors.push("New passwords don't match!");
    } else {
      hasUpdates = true;
    }
  }

  // Show errors if any
  if (errors.length > 0) {
    showComicAlert(`BAM! ${errors[0]}`, "#ff6b6b");
    return;
  }

  // Check if there are any updates to make
  if (!hasUpdates) {
    showComicAlert("POW! Please fill at least one field to update!", "#ff6b6b");
    return;
  }

  playSound("click");
  createPowerBurst(event.target);

  // Update username if provided
  if (newUsername) {
    document.getElementById("playerName").textContent = newUsername;
    document.getElementById("newUsername").value = "";
    statusElement.textContent = "";
  }

  // Clear password fields if password was updated
  if (currentPassword && newPassword && confirmPassword) {
    document.getElementById("currentPassword").value = "";
    document.getElementById("newPassword").value = "";
    document.getElementById("confirmNewPassword").value = "";
  }

  savePlayerData();
  showComicAlert(
    "KABOOM! All security settings updated successfully!",
    "#32cd32"
  );
};
