

window.addEventListener('load', function() {
    if (!localStorage.getItem("currentMusic")) {
        // Code to execute if "currentPage" not exists in localStorage
        localStorage.setItem("currentMusic", "None");
    }


    if (localStorage.getItem("currentMusic") == "None") {
        console.log("No music");
        hidePlayer();
    }

    if (localStorage.getItem("currentMusic") != "None") {
        const audioPlayer = document.getElementById("audio");
        showPlayer();
        audioPlayer.src = "../audio/ " + localStorage.getItem("currentMusic") + ".mp3";
    }
});

// Create audio player from element with id "audio"
const audioPlayer = document.getElementById("audio");

// Add event listener for all <i> elements
const iElements = document.getElementsByTagName("i");
for (let i = 0; i < iElements.length; i++) {
    iElements[i].addEventListener("click", function() {
        // Code to execute when <i> element is clicked
    });
}






function hidePlayer() {
    let player = document.getElementById("player")
    player.style.display = "none";
    let realBody = document.getElementById("real_body");
    realBody.style.height = "calc(100vh - 70px)"
}

function showPlayer() {
    let player = document.getElementById("player")
    player.style.display = "block";
    let realBody = document.getElementById("real_body");
    realBody.style.height = "calc(100vh - 140px)"
}