/* this is the global variables currentSongs and currFolder */

let currentSong = new Audio();

let currFolder;

/*  this is a function made by chat gpt used to convert seconfds to minute:seconds */

function formatTime(seconds) {// Handle invalid valuesif (isNaN(seconds) || seconds < 0) {return "00:00";}

// Convert to whole seconds
seconds = Math.floor(seconds);

// Calculate minutes and remaining seconds
let minutes = Math.floor(seconds / 60);
let remainingSeconds = seconds % 60;

// Add leading zeros
let formattedMinutes = String(minutes).padStart(2, "0");
let formattedSeconds = String(remainingSeconds).padStart(2, "0");

// Return in MM:SS format
return `${formattedMinutes}:${formattedSeconds}`;

}

/* function used to play music */

const playMusic = (track) => { /*  take input as songname.mps  */

// Stop current song
currentSong.pause();  
currentSong.currentTime = 0;

// Set new source
currentSong.src = `./${currFolder}/` + encodeURIComponent(track); /* in this the currFolder was in songs/folder form to it will make it /songs/folder/ form then the track which is in abc.mp3 form will added but beacuse some track may have spaces btw them so it convert it to url then add*/

// Play song
currentSong.play();  /* the song will play */
play.querySelector("img").src = "img/pause.svg";  /* change the play img to pause */

let track1 = track; 

if(track.length > 15){
    track1 = track1.slice(0,15) + "..."
}

document.querySelector(".songinfo").innerHTML = track1;  /* for the playbar update the songinformation */
document.querySelector(".songtime").innerHTML = "00:00 / 00:00";  /* for the song time by default */

};

async function getSongs(folder) {
    // Save current folder path (e.g. "songs/BollywoodHits")
    currFolder = folder;

    // Load songs.json from the selected folder
    let response = await fetch(`./${folder}/songs.json`);
    let songs = await response.json();   // Example: ["Kesariya.mp3", "Tum Hi Ho.mp3"]

    /* ================= UPDATE YOUR LIBRARY ================= */

    // Select the UL element
    let songUL = document.querySelector(".songs_list ul");

    // Clear previous songs
    songUL.innerHTML = "";

    // Add all songs to the library list
    for (const song of songs) {
        // Full filename
        let fullName = song;

        // Remove .mp3 for display
        let displayName = fullName.replace(".mp3", "");

        // Shorten long names
        if (displayName.length > 31) {
            displayName = displayName.slice(0, 31) + "...";
        }

        // Add song item
        songUL.innerHTML += `
            <li data-file="${fullName}">
                <img class="invert" style="width: 36px;" src="./${currFolder}/cover.jpeg" alt="">
                <div class="info">
                    <div>${displayName}</div>
                </div>
                <div class="playnow">
                    <span>Play Now</span>
                    <img src="img/play1.svg" alt="">
                </div>
            </li>`;
    }

    /* ================= SONG CLICK EVENTS ================= */

    // Select all song list items
    let arr = document.querySelectorAll(".songs_list li");

    // Add click event to each song
    arr.forEach((e) => {
        e.addEventListener("click", () => {
            // Get filename from data-file
            const track = e.dataset.file;

            // Play selected song
            playMusic(track);
        });
    });

    // Return songs array
    return songs;
}

/* display all folder function */

async function displayAlbums() {
    let cardContainer = document.querySelector(".card-container");

    let a = await fetch("./songs/data.json");
    let folders = await a.json();

    for (const folder of folders) {
        let res = await fetch(`./songs/${folder}/info.json`);
        let info = await res.json();

        cardContainer.innerHTML += `
        <div data-folder="${folder}" class="cards">
            <div class="play-btn">
                <svg xmlns="http://www.w3.org/2000/svg"
                     viewBox="0 0 24 24"
                     width="50"
                     height="50"
                     fill="none">
                    <circle cx="12" cy="12" r="10" fill="#1DB954"/>
                    <path d="M9.5 11.2V12.8C9.5 14.3 9.5 15.1 9.96 15.39C10.41 15.69 11.03 15.35 12.28 14.67L13.75 13.87C15.25 13.06 16 12.65 16 12C16 11.35 15.25 10.94 13.75 10.13L12.28 9.33C11.03 8.65 10.41 8.31 9.96 8.61C9.5 8.92 9.5 9.68 9.5 11.2Z"
                          fill="black"/>
                </svg>
            </div>
            <img src="./songs/${folder}/cover.jpeg" alt="">
            <h4 style="padding-left:10px;">${info.tittle}</h4>
            <p style="color:grey; padding-left:10px;">${info.description}</p>
        </div>`;
    }

    document.querySelectorAll(".cards").forEach(card => {
        card.addEventListener("click", async () => {
            let folder = card.dataset.folder;
            songs = await getSongs(`songs/${folder}`);
            document.querySelector(".yourlib").innerHTML =
                decodeURIComponent(folder);

            if (songs.length > 0) {
                playMusic(songs[0]);
            }
        });
    });
}

async function main() {// Load default songslet songs = await getSongs("songs/BollywoodHits"); /* make a song array inn which we stroe the urls but this is a dummy array because we use default bollywood no use of this songs */

// Display albums
await displayAlbums();  

/* ================= PLAY / PAUSE ================= */
play.addEventListener("click", () => {
    if (currentSong.src) {
        if (currentSong.paused) {
            currentSong.play();
            play.querySelector("img").src = "img/pause.svg";
        } else {
            currentSong.pause();
            play.querySelector("img").src = "img/play.svg";
        }
    }
});

/* ================= ALBUM CARD CLICK ================= */
Array.from(document.getElementsByClassName("cards")).forEach((card) => {
    card.addEventListener("click", async (item) => {
        // Load songs from clicked album
        songs = await getSongs(
            `songs/${item.currentTarget.dataset.folder}`
        );

        // Automatically play first song
        if (songs.length > 0) {
            playMusic(songs[0]);
        }
    });
});

/* add an evenlistner to an hamburger */

    document.querySelector(".hamburger").addEventListener("click", () => {
    let left = document.querySelector(".left");
    left.style.transform = "translateX(0)";
    document.querySelector(".right").style.heigth = "100vh";
    });

    /* css does not handle the javascript inline codes it cant over rulled it */

    window.addEventListener("resize", () => {
    if (window.innerWidth > 1200) {
    document.querySelector(".left").style.transform = "";
    }
    });

    /* add an evenlistner to an close */

    document.querySelector(".close").addEventListener("click", () => {
    let left = document.querySelector(".left");
    left.style.transform = "translateX(-120%)";
    });

/* ================= PREVIOUS BUTTON ================= */
previous.addEventListener("click", () => {
    if (!currentSong.src || songs.length === 0) return;

    let currentTrack = decodeURIComponent(
        currentSong.src.split("/").pop()
    );

    let index = songs.indexOf(currentTrack);

    if (index <= 0) {
        // If first song, go to last song
        playMusic(songs[songs.length - 1]);
    } else {
        playMusic(songs[index - 1]);
    }
});

/* ================= NEXT BUTTON ================= */
document.querySelector("#next").addEventListener("click", () => {
    if (!currentSong.src || songs.length === 0) return;

    let currentTrack = decodeURIComponent(
        currentSong.src.split("/").pop()
    );

    let index = songs.indexOf(currentTrack);

    if (index === -1 || index >= songs.length - 1) {
        // If last song, go to first song
        playMusic(songs[0]);
    } else {
        playMusic(songs[index + 1]);
    }
});

/* ================= TIME UPDATE ================= */
currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML =
        `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`;

    document.querySelector(".circle").style.left =
        (currentSong.currentTime / currentSong.duration) * 100 + "%";
});

/* ================= SEEKBAR ================= */
document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent =
        (e.offsetX / e.target.getBoundingClientRect().width) * 100;

    document.querySelector(".circle").style.left = percent + "%";

    currentSong.currentTime =
        (currentSong.duration * percent) / 100;
});

/* add event lister to vol */

    document.querySelector(".vol img").addEventListener("click",()=>{
        if(document.querySelector(".range").style.display === "none"){
        document.querySelector(".vol").style.right = "148px"
        document.querySelector(".range").style.display = "block"
        }
        else{
            document.querySelector(".vol").style.right = "40px"
        document.querySelector(".range").style.display = "none"
        }
    })

/* ================= VOLUME CONTROL ================= */
document.querySelector(".range input").addEventListener("input", (e) => {
    currentSong.volume = e.target.value / 100;
});

}

main();
