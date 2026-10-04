// 1. Hodiny
function updateTime() {
    var currentTime = new Date().toLocaleString();
    var timeText = document.querySelector("#timeElement");
    if (timeText) {
        timeText.innerHTML = currentTime;
    }
}
setInterval(updateTime, 1000);
updateTime();

// 2. Z-Index pro překrývání oken (Aktivní okno do popředí)
var highestZIndex = 10;
function bringToFront(element) {
    highestZIndex++;
    element.style.zIndex = highestZIndex;
}

// 3. Funkce pro přetahování oken (Drag)
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
        
        bringToFront(element); // Při kliknutí dá okno do popředí

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

        element.style.top = (element.offsetTop - currentY) + "px";
        element.style.left = (element.offsetLeft - currentX) + "px";
    }

    function stopDragging() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// 4. Pomocné funkce pro otevírání/zavírání
function closeWindow(element) {
    element.style.display = "none";
}

function openWindow(element) {
    element.style.display = "block";
    bringToFront(element); // Při otevření dá okno do popředí
}

// --- LOGIKA PRO OKNO WELCOME (catOS) ---
var welcomeScreen = document.querySelector("#welcome");
var welcomeScreenClose = document.querySelector("#welcomeclose");
var welcomeScreenOpen = document.querySelector("#welcomeopen");

if (welcomeScreen) {
    dragElement(welcomeScreen);

    if (welcomeScreenClose) {
        welcomeScreenClose.addEventListener("click", function() {
            closeWindow(welcomeScreen);
        });
    }

    if (welcomeScreenOpen) {
        welcomeScreenOpen.addEventListener("click", function() {
            openWindow(welcomeScreen);
        });
    }
}

// --- LOGIKA PRO OKNO NOTES ---
var notesScreen = document.querySelector("#notes");
var notesScreenClose = document.querySelector("#notesclose");
var notesScreenOpen = document.querySelector("#notesopen");

if (notesScreen) {
    dragElement(notesScreen);

    if (notesScreenClose) {
        notesScreenClose.addEventListener("click", function() {
            closeWindow(notesScreen);
        });
    }

    if (notesScreenOpen) {
        notesScreenOpen.addEventListener("click", function() {
            openWindow(notesScreen);
        });
    }
}
var biggestIndex = 100;
function addWindowTapHandling(element) {
  element.addEventListener("mousedown", () =>
    handleWindowTap(element)
  )
}