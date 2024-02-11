export function initializePlayer(audioPlayer) {
    let audioTitle = document.getElementById("player_music_title");

    audioPlayer.src = localStorage.getItem("currentMusic");
    audioTitle.innerHTML = localStorage.getItem("currentMusicTitle"); 
    audioPlayer.currentTime = localStorage.getItem(localStorage.getItem("currentMusicTitle") + "_time");  
}

export function playMusic(audioPlayer) {
    audioPlayer.play();
}

export function pauseMusic(audioPlayer) {
    audioPlayer.pause();
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
}

export function showPlayer() {
    sessionStorage.setItem("PlayerStatus", "visible");
    let player = document.getElementById("player")
    player.style.display = "block";
    let realBody = document.getElementById("real_body");
    realBody.style.height = "calc(100vh - 140px)"
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