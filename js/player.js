window.addEventListener('load', function() {
    if (!localStorage.getItem("currentMusic")) {
        // Code to execute if "currentPage" not exists in localStorage
        localStorage.setItem("currentMusic", "None");
    }


    if (localStorage.getItem("currentMusic") == "None") {
        console.log("No music");
        hidePlayer();
        
        
    }
});





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