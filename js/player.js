export function initializePlayer(audioPlayer) {
    let audioTitle = document.getElementById("player_music_title");
    let audioTime = document.getElementById("player_time");
    let progressBar = document.getElementById("player_progression_bar_foreground");

    let duration = localStorage.getItem(localStorage.getItem("currentMusicTitle") + "_duration");
    let currentTime = localStorage.getItem(localStorage.getItem("currentMusicTitle") + "_time");
    let progress = (currentTime / duration) * 100;

    audioTitle.innerHTML = localStorage.getItem("currentMusicTitle"); 
    audioPlayer.src = localStorage.getItem("currentMusic");
    audioPlayer.currentTime = localStorage.getItem(localStorage.getItem("currentMusicTitle") + "_time"); 
    audioTime.innerHTML = convertToHHSS(currentTime) + " / " + convertToHHSS(duration);
    progressBar.style.width = progress + "%";    
}


export function setPlayIcon(button) {
    button.classList.remove("fa-play");
    button.classList.add("fa-pause");
}

export function setPauseIcon(button) {
    button.classList.remove("fa-pause");
    button.classList.add("fa-play");
}


export function playMusic(audioPlayer) {
    if (localStorage.getItem("currentMusic") != "None") {
        audioPlayer.play();
        let playButton = document.getElementById("play_pause_button");
        setPlayIcon(playButton);
        localStorage.setItem("currentlyPlaying", true);

        if (localStorage.getItem("currentPage") == "podcasts") {
            let playButton = document.getElementById(localStorage.getItem("currentMusicTitle").toLowerCase() + "_play_button"); 
            setPlayIcon(playButton);
        }
    }
}

export function pauseMusic(audioPlayer) {
    audioPlayer.pause();
    let playButton = document.getElementById("play_pause_button");
    setPauseIcon(playButton);
    localStorage.setItem("currentlyPlaying", false);
    if (localStorage.getItem("currentPage") == "podcasts") {
        let playButton = document.getElementById(localStorage.getItem("currentMusicTitle").toLowerCase() + "_play_button");
        setPauseIcon(playButton);
    }
}

export function forwardMusic(audioPlayer) {
    audioPlayer.currentTime += 10;
}

export function backwardMusic(audioPlayer) {
    audioPlayer.currentTime -= 10;
}

export function hidePlayer() {
    sessionStorage.setItem("PlayerStatus", "hidden");
    let player = document.getElementById("player");
    player.style.display = "none";
    let realBody = document.getElementById("real_body");
    realBody.style.height = "calc(100vh - 70px)"

    let fake_player = document.getElementById("fake_player");
    if (fake_player != null) fake_player.style.display = "none";
}

export function showPlayer() {
    sessionStorage.setItem("PlayerStatus", "visible");
    let player = document.getElementById("player")
    player.style.display = "block";
    let realBody = document.getElementById("real_body");
    realBody.style.height = "calc(100vh - 140px)"

    let fake_player = document.getElementById("fake_player");
    if (fake_player != null) fake_player.style.display = "block";
}

export function convertToHHSS(number) {
    // Convert number to HH:MM format
    let hours = Math.floor(number / 60);
    let minutes = Math.floor(number % 60);

    let formattedHours = String(hours).padStart(2, "0");
    let formattedMinutes = String(minutes).padStart(2, "0");

    let result = formattedHours + ":" + formattedMinutes;
    return result;
}