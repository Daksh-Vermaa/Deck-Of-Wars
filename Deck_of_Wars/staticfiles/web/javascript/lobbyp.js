let selectedMode = "";
let selectedPlayers = 2;

// Panel click handlers
document.querySelectorAll(".panel-box:not(.box-4)").forEach((panel) => {
  panel.addEventListener("click", function () {
    selectedMode = this.dataset.mode;
    showPlayerSelection();

    // Add shake effect
    this.classList.add("shake");
    setTimeout(() => {
      this.classList.remove("shake");
    }, 600);
  });
});

// Coming soon panel
document.querySelector(".box-4").addEventListener("click", function () {
  this.classList.add("shake");
  setTimeout(() => {
    this.classList.remove("shake");
  }, 600);

  showComingSoonPopup();
});

// Attach initial listeners for the player selection popup
attachPlayerSelectionListeners();

function showComingSoonPopup() {
  const overlay = document.getElementById("popupOverlay");
  const mainContainer = document.getElementById("mainContainer");

  // Create coming soon popup content
  const comingSoonHTML = `
    <div class="coming-soon-panel" id="comingSoonPanel">
      <div class="coming-soon-icon">
        <i class="fas fa-rocket"></i>
      </div>
      <h2 class="coming-soon-title">COMING SOON!</h2>
      <div class="popup-buttons">
        <button class="popup-btn ok-btn" id="comingSoonOkBtn">
          🎮 Got It!
        </button>
      </div>
    </div>
  `;

  // Replace popup content
  overlay.innerHTML = comingSoonHTML;

  // Show popup
  overlay.classList.add("show");
  mainContainer.classList.add("blurred");

  // Add event listener for OK button
  document
    .getElementById("comingSoonOkBtn")
    .addEventListener("click", hideComingSoonPopup);

  // Add entrance effect
  playComicEffect();
}

function hideComingSoonPopup() {
  const overlay = document.getElementById("popupOverlay");
  const mainContainer = document.getElementById("mainContainer");

  overlay.classList.remove("show");
  mainContainer.classList.remove("blurred");

  // Restore original popup content
  overlay.innerHTML = `
    <div class="popup-panel" id="popupPanel">
      <h2 class="popup-title">Choose Players</h2>
      <div class="player-options">
        <div class="player-btn" data-players="2">
          <i class="fas fa-users"></i>
          <span>2 Players</span>
        </div>
        <div class="player-btn" data-players="3">
          <i class="fas fa-users"></i>
          <span>3 Players</span>
        </div>
        <div class="player-btn" data-players="4">
          <i class="fas fa-users"></i>
          <span>4 Players</span>
        </div>
      </div>
      <div class="popup-buttons">
        <button class="popup-btn start-btn" id="startGameBtn">
          ▶ Start Game
        </button>
        <button class="popup-btn cancel-btn" id="cancelBtn">← Back</button>
      </div>
    </div>
  `;

  // Re-attach event listeners
  attachPlayerSelectionListeners();
}

function attachPlayerSelectionListeners() {
  // Player selection handlers
  document.querySelectorAll(".player-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      document
        .querySelectorAll(".player-btn")
        .forEach((b) => b.classList.remove("selected"));
      this.classList.add("selected");
      selectedPlayers = parseInt(this.dataset.players);
    });
  });

  // Start game button
  document
    .getElementById("startGameBtn")
    .addEventListener("click", function () {
      if (selectedMode && selectedPlayers) {
        this.style.transform = "scale(0.95)";
        setTimeout(() => {
          this.style.transform = "";
          // Submit the form data
          submitGameForm();
          hidePlayerSelection();
        }, 150);
      }
    });

  // Cancel button
  document.getElementById("cancelBtn").addEventListener("click", function () {
    hidePlayerSelection();
  });

  // Close popup when clicking overlay
  document
    .getElementById("popupOverlay")
    .addEventListener("click", function (e) {
      if (e.target === this) {
        hidePlayerSelection();
      }
    });
}

function showPlayerSelection() {
  const overlay = document.getElementById("popupOverlay");
  const panel = document.getElementById("popupPanel");
  const mainContainer = document.getElementById("mainContainer");

  // Set theme based on selected mode
  panel.className = `popup-panel theme-${selectedMode}`;

  // Reset player selection
  document
    .querySelectorAll(".player-btn")
    .forEach((btn) => btn.classList.remove("selected"));
  document.querySelector('[data-players="2"]').classList.add("selected");
  selectedPlayers = 2;

  // Show popup with animations
  overlay.classList.add("show");
  mainContainer.classList.add("blurred");

  // Add entrance sound effect simulation
  playComicEffect();
}

function hidePlayerSelection() {
  const overlay = document.getElementById("popupOverlay");
  const mainContainer = document.getElementById("mainContainer");

  overlay.classList.remove("show");
  mainContainer.classList.remove("blurred");
}

// Add keyboard support
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    const overlay = document.getElementById("popupOverlay");
    if (overlay.classList.contains("show")) {
      // Check if the coming soon panel is visible
      if (document.getElementById("comingSoonPanel")) {
        hideComingSoonPopup();
      } else {
        hidePlayerSelection();
      }
    }
  }
});

function submitGameForm() {
  // Create a form dynamically and submit it
  const form = document.createElement("form");
  form.method = "POST";
  form.action = "/lobbyp/";

  // Add CSRF token
  const csrfToken = document.querySelector("[name=csrfmiddlewaretoken]");
  if (csrfToken) {
    const csrfInput = document.createElement("input");
    csrfInput.type = "hidden";
    csrfInput.name = "csrfmiddlewaretoken";
    csrfInput.value = csrfToken.value;
    form.appendChild(csrfInput);
  }

  // Add mode field
  const modeInput = document.createElement("input");
  modeInput.type = "hidden";
  modeInput.name = "mode";
  modeInput.value = selectedMode;
  form.appendChild(modeInput);

  // Add num_players field
  const playersInput = document.createElement("input");
  playersInput.type = "hidden";
  playersInput.name = "num_players";
  playersInput.value = selectedPlayers;
  form.appendChild(playersInput);

  // Submit form
  document.body.appendChild(form);
  form.submit();
}
