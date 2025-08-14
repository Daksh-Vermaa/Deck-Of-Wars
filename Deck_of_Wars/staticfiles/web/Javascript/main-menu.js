// Volume control functionality
const volumeSlider = document.getElementById("volumeSlider");
const volumeValue = document.getElementById("volumeValue");

volumeSlider.addEventListener("input", function () {
  volumeValue.textContent = this.value + "%";
  // Here you would typically adjust game audio volume
  console.log("Volume set to:", this.value + "%");
});

// Menu button functions
function createTeam() {
  showComicAlert("POW! Creating a new team...", "#FF6B6B");
  // Add your create team logic here
}

function joinTeam() {
  showComicAlert("BOOM! Joining existing team...", "#4ECDC4");
  // Add your join team logic here
}

function openSettings() {
  document.getElementById("settingsPanel").style.display = "block";
  showComicAlert("BAM! Opening settings...", "#A8E6CF");
}

function closeSettings() {
  document.getElementById("settingsPanel").style.display = "none";
}

function showAchievements() {
  showComicAlert("KAPOW! Loading achievements...", "#FFD93D");
  // Add your achievements logic here
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
          `;
  alert.textContent = message;
  document.body.appendChild(alert);

  // Remove alert after 3 seconds
  setTimeout(() => {
    alert.style.animation = "slideOut 0.5s ease-in";
    setTimeout(() => alert.remove(), 500);
  }, 3000);
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

// Close settings when clicking outside
document.addEventListener("click", function (e) {
  const settingsPanel = document.getElementById("settingsPanel");
  if (
    settingsPanel.style.display === "block" &&
    !settingsPanel.contains(e.target) &&
    !e.target.classList.contains("btn-settings")
  ) {
    closeSettings();
  }
});
