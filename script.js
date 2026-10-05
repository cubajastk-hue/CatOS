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