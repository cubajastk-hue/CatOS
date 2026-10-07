// 1. Update time display
function updateTime() {
    var currentTime = new Date().toLocaleString("en-US");
    var timeText = document.querySelector("#timeElement");
    if (timeText) {
        timeText.innerHTML = currentTime;
    }
}
setInterval(updateTime, 1000);
updateTime();

// 2. Layer management (Z-Index)
var biggestIndex = 10;
var topBar = document.querySelector("#top");

function bringToFront(element) {
    biggestIndex++;
    element.style.zIndex = biggestIndex;
    if (topBar) {
        topBar.style.zIndex = biggestIndex + 1; // Top bar stays on top
    }
}

// 3. Window dragging functionality with screen boundaries
function dragElement(element) {
    var initialX = 0, initialY = 0, currentX = 0, currentY = 0;
    var header = document.getElementById(element.id + "header");

    if (header) {
        header.onmousedown = startDragging;
    } else {
        element.onmousedown = startDragging;
    }

    function startDragging(e) {
        e = e || window.event;
        e.preventDefault();

        bringToFront(element);

        initialX = e.clientX;
        initialY = e.clientY;

        document.onmouseup = stopDragging;
        document.onmousemove = drag;
    }

    function drag(e) {
        e = e || window.event;
        e.preventDefault();

        currentX = initialX - e.clientX;
        currentY = initialY - e.clientY;
        initialX = e.clientX;
        initialY = e.clientY;

        // Calculate target positions
        var newTop = element.offsetTop - currentY;
        var newLeft = element.offsetLeft - currentX;

        // Calculate bottom bar height
        var footerHeight = topBar ? topBar.offsetHeight : 0;

        // Screen boundary limits
        var minTop = 0;
        var maxTop = window.innerHeight - element.offsetHeight - footerHeight;
        var minLeft = 0;
        var maxLeft = window.innerWidth - element.offsetWidth;

        // Prevent negative maximums if window is larger than screen
        if (maxTop < 0) maxTop = 0;
        if (maxLeft < 0) maxLeft = 0;

        // Apply boundaries
        if (newTop < minTop) newTop = minTop;
        if (newTop > maxTop) newTop = maxTop;
        if (newLeft < minLeft) newLeft = minLeft;
        if (newLeft > maxLeft) newLeft = maxLeft;

        element.style.top = newTop + "px";
        element.style.left = newLeft + "px";
    }

    function stopDragging() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// 4. Open and close window functions
function closeWindow(element) {
    element.style.display = "none";
}

function openWindow(element) {
    element.style.display = "block";
    bringToFront(element);
}

// Window event handlers
var welcomeScreen = document.querySelector("#welcome");
var welcomeScreenClose = document.querySelector("#welcomeclose");
var welcomeScreenOpen = document.querySelector("#welcomeopen");

if (welcomeScreen) {
    dragElement(welcomeScreen);
    if (welcomeScreenClose) welcomeScreenClose.addEventListener("click", () => closeWindow(welcomeScreen));
    if (welcomeScreenOpen) welcomeScreenOpen.addEventListener("click", () => openWindow(welcomeScreen));
}

var notesScreen = document.querySelector("#notes");
var notesScreenClose = document.querySelector("#notesclose");
var notesScreenOpen = document.querySelector("#notesopen");

if (notesScreen) {
    dragElement(notesScreen);
    if (notesScreenClose) notesScreenClose.addEventListener("click", () => closeWindow(notesScreen));
    if (notesScreenOpen) notesScreenOpen.addEventListener("click", () => openWindow(notesScreen));
}

// 5. Notes App with LocalStorage
var defaultNotes = [
  {
    title: "Welcome",
    date: "06/28/2023",
    content: `
      <p contenteditable="true">
        Welcome to <strong>Hacker Notes</strong><br><br>
        <img src="images/Croissant.png" class="note-img" alt="Croissant" /><br><br>
        This is a place where I store my thoughts as they come to mind. What exactly will you find when browsing through these notes? As I <del>once said</del> <ins>always say</ins>
      </p>
      <blockquote contenteditable="true">
        <i>Time Will Tell<br>~ Jastk</i>
      </blockquote>
      <p contenteditable="true">
        I suppose you may see a bit of content about technology. Perhaps some insights regarding recent projects. Maybe even some thoughts regarding nature & tea? Go and find out!
      </p>
    `
  },
  {
    title: "catOS Ideas",
    date: "07/01/2023",
    content: `
      <p contenteditable="true">
        <strong>Ideas for catOS:</strong><br><br>
        🥐 Add draggable windows<br>
        🥐 Custom wallpapers<br>
        🥐 Playable mini-games

        Its AI generated ...
      </p>
    `
  }
];

// Load saved notes from browser memory
var savedNotes = localStorage.getItem("catOS_notes");
var content = savedNotes ? JSON.parse(savedNotes) : defaultNotes;
var currentNoteIndex = 0;

function renderNotes() {
    var sidebar = document.querySelector("#noteSidebar");
    var contentArea = document.querySelector("#noteContent");

    if (!sidebar || !contentArea) return;

    sidebar.innerHTML = "";

    content.forEach(function(note, index) {
        var item = document.createElement("div");
        item.classList.add("note-item");
        if (index === currentNoteIndex) item.classList.add("active");

        item.innerHTML = `
            <p class="note-title">${note.title}</p>
            <p class="note-date">${note.date}</p>
        `;

        item.addEventListener("click", function() {
            currentNoteIndex = index;
            renderNotes();
        });

        sidebar.appendChild(item);
    });

    contentArea.innerHTML = content[currentNoteIndex].content;

    // Auto-save changes on user edit
    contentArea.oninput = function() {
        content[currentNoteIndex].content = contentArea.innerHTML;
        localStorage.setItem("catOS_notes", JSON.stringify(content));
    };
}

renderNotes();

// 6. CATOFY MUSIC PLAYER

// Window event handlers for catOfy
var catofyScreen = document.querySelector("#catofy");
var catofyScreenClose = document.querySelector("#catofyclose");
var catofyScreenOpen = document.querySelector("#catofyopen");

if (catofyScreen) {
    dragElement(catofyScreen);
    if (catofyScreenClose) catofyScreenClose.addEventListener("click", () => closeWindow(catofyScreen));
    if (catofyScreenOpen) catofyScreenOpen.addEventListener("click", () => openWindow(catofyScreen));
}

var tracks = [
  { id: 0, title: "Meow Purr Vibe", file: "audio/meow.mp3" },
  { id: 1, title: "Cat Lo-Fi Chill", file: "audio/chill.mp3" },
  { id: 2, title: "Midnight Purring", file: "audio/purring.mp3" }
];

var currentAudio = new Audio();
var currentTrackId = null;
var isPlaying = false;

function renderCatofyTracks() {
    var trackListContainer = document.querySelector("#trackList");
    if (!trackListContainer) return;

    trackListContainer.innerHTML = "";

    tracks.forEach(function(track) {
        var trackRow = document.createElement("div");
        trackRow.classList.add("track-item");

        var trackPlayingThis = (currentTrackId === track.id && isPlaying);
        
        // Zabalení ikony do spanu s vlastní třídou pro pauzu
        var buttonIcon = trackPlayingThis 
            ? '<span class="pause-icon">⏸</span>' 
            : '<span class="play-icon">▶</span>';

        trackRow.innerHTML = `
            <p class="track-title">${track.title}</p>
            <button class="play-btn" data-id="${track.id}">${buttonIcon}</button>
        `;

        var playButton = trackRow.querySelector(".play-btn");
        playButton.addEventListener("click", function() {
            togglePlayTrack(track);
        });

        trackListContainer.appendChild(trackRow);
    });
}

function togglePlayTrack(track) {
    if (currentTrackId === track.id) {
        if (isPlaying) {
            currentAudio.pause();
            isPlaying = false;
        } else {
            currentAudio.play();
            isPlaying = true;
        }
    } else {
        currentAudio.pause();
        currentAudio.src = track.file;
        currentAudio.play();
        currentTrackId = track.id;
        isPlaying = true;
    }

    renderCatofyTracks();
}

currentAudio.onended = function() {
    isPlaying = false;
    renderCatofyTracks();
};

renderCatofyTracks();

// --- CATTEMP INTERACTION LOGIC ---
var cattempScreen = document.querySelector("#cattemp");
var cattempScreenClose = document.querySelector("#cattempclose");
var cattempScreenOpen = document.querySelector("#cattempopen");

if (cattempScreen) {
    dragElement(cattempScreen);
    if (cattempScreenClose) cattempScreenClose.addEventListener("click", () => closeWindow(cattempScreen));
    if (cattempScreenOpen) cattempScreenOpen.addEventListener("click", () => openWindow(cattempScreen));
}

// --- CATGAME INTERACTION LOGIC ---
var catgameScreen = document.querySelector("#catgame");
var catgameScreenClose = document.querySelector("#catgameclose");
var catgameScreenOpen = document.querySelector("#catgameopen");

if (catgameScreen) {
  if (typeof dragElement === "function") dragElement(catgameScreen);
  if (catgameScreenClose) catgameScreenClose.addEventListener("click", () => closeWindow(catgameScreen));
  if (catgameScreenOpen) catgameScreenOpen.addEventListener("click", () => openWindow(catgameScreen));
}

// --- CATTEMPLATE ---

(function () {
  const templateCards = document.querySelectorAll('.template-card');
  if (!templateCards.length) return;

  const savedTheme = localStorage.getItem('catos_theme') || 'coffee';
  applyTheme(savedTheme);

  templateCards.forEach(card => {
    card.addEventListener('click', () => {
      const themeName = card.getAttribute('data-theme');
      
      applyTheme(themeName);
      localStorage.setItem('catos_theme', themeName);
    });
  });

  function applyTheme(themeName) {
    document.body.classList.remove('theme-cat', 'theme-beans', 'theme-barista');

    if (themeName !== 'coffee' && themeName !== 'default') {
      document.body.classList.add(`theme-${themeName}`);
    }

    templateCards.forEach(card => {
      const cardTheme = card.getAttribute('data-theme');
      if (cardTheme === themeName || (themeName === 'default' && cardTheme === 'coffee')) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });
  }
})();

// --- CATGAME BOT LOGIC ---
(function () {
  const cells = document.querySelectorAll(".cg-cell");
  const statusText = document.querySelector("#cg-status");
  const restartBtn = document.querySelector("#cg-restart-btn");

  if (!cells.length) return;

  const PLAYER = "X";
  const BOT = "O";
  let board = ["", "", "", "", "", "", "", "", ""];
  let isGameActive = true;

  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  function checkWin(currentBoard, p) {
    return winPatterns.some(pattern => {
      return pattern.every(index => currentBoard[index] === p);
    });
  }

  function checkDraw(currentBoard) {
    return currentBoard.every(cell => cell !== "");
  }

  function handleCellClick(e) {
    const index = e.target.getAttribute("data-index");

    if (board[index] !== "" || !isGameActive) return;

    makeMove(index, PLAYER);

    if (checkWin(board, PLAYER)) {
      statusText.textContent = "You win!";
      isGameActive = false;
      return;
    }

    if (checkDraw(board)) {
      statusText.textContent = "It's a draw!";
      isGameActive = false;
      return;
    }

    isGameActive = false;
    statusText.textContent = "Bot is thinking...";

    setTimeout(() => {
      const bestMove = getBestMove(board);
      makeMove(bestMove, BOT);

      if (checkWin(board, BOT)) {
        statusText.textContent = "Bot wins!";
      } else if (checkDraw(board)) {
        statusText.textContent = "It's a draw!";
      } else {
        statusText.textContent = "Your turn (X)";
        isGameActive = true;
      }
    }, 400);
  }

  function makeMove(index, player) {
    board[index] = player;
    const cell = cells[index];
    cell.textContent = player;
    cell.classList.add(player === PLAYER ? "x-mark" : "o-mark");
    cell.disabled = true;
  }

  function getBestMove(currentBoard) {
    let bestScore = -Infinity;
    let move = -1;

    for (let i = 0; i < currentBoard.length; i++) {
      if (currentBoard[i] === "") {
        currentBoard[i] = BOT;
        let score = minimax(currentBoard, 0, false);
        currentBoard[i] = "";
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    return move;
  }

  function minimax(currentBoard, depth, isMaximizing) {
    if (checkWin(currentBoard, BOT)) return 10 - depth;
    if (checkWin(currentBoard, PLAYER)) return depth - 10;
    if (checkDraw(currentBoard)) return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < currentBoard.length; i++) {
        if (currentBoard[i] === "") {
          currentBoard[i] = BOT;
          let score = minimax(currentBoard, depth + 1, false);
          currentBoard[i] = "";
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < currentBoard.length; i++) {
        if (currentBoard[i] === "") {
          currentBoard[i] = PLAYER;
          let score = minimax(currentBoard, depth + 1, true);
          currentBoard[i] = "";
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  }

  function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    isGameActive = true;
    statusText.textContent = "Your turn (X)";

    cells.forEach(cell => {
      cell.textContent = "";
      cell.className = "cg-cell";
      cell.disabled = false;
    });
  }

  cells.forEach(cell => cell.addEventListener("click", handleCellClick));
  if (restartBtn) restartBtn.addEventListener("click", resetGame);
})();

//CATOS LOADING SCREEN LOGIC
document.addEventListener('DOMContentLoaded', () => {
  const progressFill = document.getElementById('progressFill');
  const progressText = document.getElementById('progressText');
  const loadingOverlay = document.getElementById('loadingOverlay');
  const tapHint = document.getElementById('tapHint');

  let progress = 0;
  let isReady = false;

  // Simulate loading progress from 0% to 100%
  const loadingInterval = setInterval(() => {
    progress += Math.floor(Math.random() * 10) + 3;

    if (progress >= 100) {
      progress = 100;
      clearInterval(loadingInterval);

      // Set progress bar and text to 100%
      if (progressFill) progressFill.style.width = '100%';
      if (progressText) progressText.textContent = '100%';

      // Enable ready state and show tap hint at the bottom
      isReady = true;
      if (loadingOverlay) loadingOverlay.classList.add('ready');
      if (tapHint) tapHint.classList.remove('hidden');
    } else {
      if (progressFill) progressFill.style.width = `${progress}%`;
      if (progressText) progressText.textContent = `${progress}%`;
    }
  }, 120);

  // Dismiss loading overlay when clicking anywhere after reaching 100%
  if (loadingOverlay) {
    loadingOverlay.addEventListener('click', () => {
      if (isReady) {
        loadingOverlay.classList.add('hidden');
      }
    });
  }
});