// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Menu button functions
  window.createTeam = function () {
    showComicAlert("POW! Creating a new team...", "#FF6B6B");
    // Add your create team logic here
  };

  window.joinTeam = function () {
    showComicAlert("BOOM! Joining existing team...", "#4ECDC4");
    // Add your join team logic here
  };

  window.openRules = function () {
    const backdrop = document.getElementById("rulesBackdrop");
    backdrop.style.display = "block";
    setTimeout(() => {
      backdrop.style.backdropFilter = "blur(8px)";
      backdrop.style.webkitBackdropFilter = "blur(8px)";
    }, 10);
    document.getElementById("rulesPanel").style.display = "block";
    showComicAlert("BAM! Opening rules...", "#A8E6CF");
  };

  window.closeRules = function () {
    const panel = document.getElementById("rulesPanel");
    const backdrop = document.getElementById("rulesBackdrop");
    backdrop.style.backdropFilter = "blur(0px)";
    backdrop.style.webkitBackdropFilter = "blur(0px)";
    panel.classList.add("panel-closing");
    setTimeout(() => {
      panel.style.display = "none";
      panel.classList.remove("panel-closing");
      backdrop.style.display = "none";
    }, 400);
  };

  window.showAchievements = function () {
    const backdrop = document.getElementById("rulesBackdrop");
    backdrop.style.display = "block";
    setTimeout(() => {
      backdrop.style.backdropFilter = "blur(8px)";
      backdrop.style.webkitBackdropFilter = "blur(8px)";
    }, 10);
    document.getElementById("achievementsPanel").style.display = "block";
    showComicAlert("KAPOW! Loading achievements...", "#FFD93D");
  };

  window.closeAchievements = function () {
    const panel = document.getElementById("achievementsPanel");
    const backdrop = document.getElementById("rulesBackdrop");
    backdrop.style.backdropFilter = "blur(0px)";
    backdrop.style.webkitBackdropFilter = "blur(0px)";
    panel.classList.add("panel-closing");
    setTimeout(() => {
      panel.style.display = "none";
      panel.classList.remove("panel-closing");
      backdrop.style.display = "none";
    }, 400);
  };

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
  document.head.appendChild(style);

  // Add stamp animation to title on page load
  const gameTitle = document.querySelector(".game-title");
  if (gameTitle) {
    setTimeout(() => {
      gameTitle.classList.add("stamp-animation");
    }, 200);
  }

  // Close Rules when clicking outside
  document.addEventListener("click", function (e) {
    const rulesPanel = document.getElementById("rulesPanel");
    if (
      rulesPanel &&
      rulesPanel.style.display === "block" &&
      !rulesPanel.contains(e.target) &&
      !e.target.classList.contains("btn-rules")
    ) {
      window.closeRules();
    }
  });
  // Close Achievements when clicking outside
  document.addEventListener("click", function (e) {
    const achievementsPanel = document.getElementById("achievementsPanel");
    if (
      achievementsPanel &&
      achievementsPanel.style.display === "block" &&
      !achievementsPanel.contains(e.target) &&
      !e.target.classList.contains("btn-achievements")
    ) {
      window.closeAchievements();
    }
  });
});
