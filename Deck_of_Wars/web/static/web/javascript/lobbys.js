document.addEventListener("DOMContentLoaded", () => {
  // --- DOM Element References ---
  const gameCodeInput = document.getElementById("gameCode");
  const pasteBtn = document.getElementById("pasteBtn");
  const clearBtn = document.getElementById("clearBtn");
  const joinBtn = document.getElementById("joinBtn");
  const backBtn = document.getElementById("backBtn");
  const statusIndicator = document.getElementById("statusIndicator");

  const CODE_LENGTH = 6;
  let statusTimeout;

  // --- Utility Functions ---

  /**
   * Displays a status message to the user.
   * @param {string} message - The message to display.
   * @param {'success'|'error'|'loading'} type - The type of message.
   */
  function showStatus(message, type) {
    clearTimeout(statusTimeout);
    statusIndicator.className = `status-indicator show ${type}`;

    if (type === "loading") {
      statusIndicator.innerHTML = `<span class="loading-spinner"></span> ${message}`;
    } else {
      statusIndicator.textContent = message;
      // Auto-hide non-loading messages after 3 seconds
      statusTimeout = setTimeout(hideStatus, 3000);
    }
  }

  /** Hides the status indicator. */
  function hideStatus() {
    statusIndicator.classList.remove("show");
  }

  /** Simulates a comic book sound effect with a visual shake. */
  function playComicEffect() {
    document.body.style.transform = "translateX(-2px)";
    setTimeout(() => (document.body.style.transform = "translateX(2px)"), 50);
    setTimeout(() => (document.body.style.transform = ""), 100);
  }

  // --- Core Logic ---

  /** Validates and formats the game code input. */
  function handleInput() {
    // Sanitize input: uppercase, alphanumeric only
    const sanitizedValue = gameCodeInput.value
      .replace(/[^a-zA-Z0-9]/g, "")
      .toUpperCase();
    gameCodeInput.value = sanitizedValue;

    // Enable join button only when code is the correct length
    joinBtn.disabled = sanitizedValue.length !== CODE_LENGTH;

    // Clear status when user is typing
    if (statusIndicator.classList.contains("show")) {
      hideStatus();
    }
  }

  /** Attempts to join a game. */
  function joinGame() {
    const code = gameCodeInput.value.trim();

    if (code.length !== CODE_LENGTH) {
      showStatus(`Code must be ${CODE_LENGTH} characters`, "error");
      return;
    }

    playComicEffect();
    showStatus("Joining game...", "loading");

    // --- Mock API Call ---
    // Replace this with your actual fetch/API call logic
    setTimeout(() => {
      const random = Math.random();
      if (random > 0.7) {
        showStatus("KABOOM! Game not found", "error");
      } else if (random > 0.4) {
        showStatus("POW! This game is full", "error");
      } else {
        showStatus("ZAP! Joining game...", "success");
        setTimeout(() => {
          console.log(`Redirecting to game with code: ${code}`);
          // window.location.href = `/game/?code=${code}`; // Uncomment to redirect
        }, 1000);
      }
    }, 1500);
  }

  /** Clears the input field. */
  function clearCode() {
    gameCodeInput.value = "";
    joinBtn.disabled = true;
    hideStatus();
    gameCodeInput.focus();
    playComicEffect();
  }

  /** Navigates to the previous page. */
  function goBack() {
    window.history.back();
  }

  /** Pastes text from clipboard into the input field. */
  async function pasteFromClipboard() {
    playComicEffect();
    try {
      const text = await navigator.clipboard.readText();
      const cleanCode = text
        .trim()
        .replace(/[^a-zA-Z0-9]/g, "")
        .toUpperCase()
        .substring(0, CODE_LENGTH);

      gameCodeInput.value = cleanCode;
      handleInput(); // Trigger validation and button state update

      if (cleanCode.length > 0) {
        showStatus("Pasted from clipboard!", "success");
      }
    } catch (err) {
      console.error("Clipboard paste failed:", err);
      showStatus("Clipboard access denied", "error");
    }
  }

  // --- Event Listeners ---
  gameCodeInput.addEventListener("input", handleInput);
  gameCodeInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && !joinBtn.disabled) {
      joinGame();
    }
  });

  pasteBtn.addEventListener("click", pasteFromClipboard);
  clearBtn.addEventListener("click", clearCode);
  joinBtn.addEventListener("click", joinGame);
  backBtn.addEventListener("click", goBack);

  // Set focus to the input on page load
  gameCodeInput.focus();
});
