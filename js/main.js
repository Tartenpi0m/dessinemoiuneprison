import * as player from './player.js';



async function loadPage(page) {
	console.log("Load page : " + page + ".html")
	fetch("./" + page + ".html")
		.then(res => {
			if(res.ok) {
				res.text().then(text => {
					var parser = new DOMParser();
					var text = parser.parseFromString(text, "text/html");
					document.getElementById("real_body").innerHTML = text.body.innerHTML;
					localStorage.setItem("currentPage", page);
					const event = new Event('subload_' + page);
					window.dispatchEvent(event);
				})				
			} else {
				throw new Error('Something went wrong');
			}
		})
}



window.addEventListener('load', function() {

	sessionStorage.setItem("try", "no");



	// --------PAGE NAVIGATION--------
    if (!localStorage.getItem("currentPage")) {
        // Code to execute if "currentPage" not exists in localStorage
        localStorage.setItem("currentPage", "home");
    }

	else {
		// Code to execute if "currentPage" exists in localStorage
		//loadPage(localStorage.getItem("currentPage"));
	}

    //loadPage(localStorage.getItem("currentPage"));
	//loadPage("home");
	loadPage("podcasts");	




	// --------AUDIO PLAYER--------
	const audioPlayer = document.getElementById("audio");


	// Current music behavior
	if (!localStorage.getItem("currentMusic")) {
        // Code to execute if "currentMusic" not exists in localStorage
        localStorage.setItem("currentMusic", "None");
    }


    if (localStorage.getItem("currentMusic") == "None") {
        console.log("No music");
        player.hidePlayer();
    }

    if (localStorage.getItem("currentMusic") != "None") {
		console.log("PLayer intialized to : " + localStorage.getItem("currentMusic"));
        player.initializePlayer(audioPlayer);
		player.showPlayer();
    }

	// Play button
	let playButton = document.getElementById("play_pause_button");
	playButton.addEventListener("click", function() {
		if (audioPlayer.paused) {
			player.playMusic(audioPlayer);
			playButton.classList.remove("fa-play");
			playButton.classList.add("fa-pause");
		} else {
			player.pauseMusic(audioPlayer);
			playButton.classList.remove("fa-pause");
			playButton.classList.add("fa-play");
		}
	});

	// Forward button
	let forwardButton = document.getElementById("forward_button");
	forwardButton.addEventListener("click", function() {
		player.forwardMusic(audioPlayer);
	});

	// Backward button
	let backwardButton = document.getElementById("backward_button");
	backwardButton.addEventListener("click", function() {
		player.backwardMusic(audioPlayer);
	});
});




window.addEventListener('subload_podcasts', function() {
	const audioPlayer = document.getElementById("audio");

	console.log("subload_podcasts event triggered");

	// Set progress bar width for each card podcast
	let bars = document.querySelectorAll(".podcast_time_bar");
	console.log(bars);
	bars.forEach(bar => {
		console.log(bar.title)
		let audioTitle = bar.getAttribute("title");
		console.log("Setting bar width for : " + audioTitle);
		if(localStorage.getItem(audioTitle + "_time")) {
			console.log("Setting bar width to : " + localStorage.getItem(audioTitle + "_time") / localStorage.getItem(audioTitle + "_duration") * 100 + "%");
			bar.style.width = localStorage.getItem(audioTitle + "_time") / localStorage.getItem(audioTitle + "_duration") * 100 + "%";
		}
	});

	let button_list = document.querySelectorAll(".play_button");
	console.log("Button list : ");
	console.log(button_list);
	button_list.forEach(play_button => {
		console.log(play_button)
		play_button.addEventListener("click", function() {
			console.log("Play button clicked");
			let audioSource = play_button.getAttribute("src");
			let audioTitle = play_button.getAttribute("title");
			console.log("Playing audio from: " + audioSource);
			localStorage.setItem("currentMusic", audioSource);
			localStorage.setItem("currentMusicTitle", audioTitle);
			if (localStorage.getItem(audioTitle + "_time") != null) {
				audioPlayer.currentTime = localStorage.getItem(audioTitle + "_time");
				localStorage.setItem(audioTitle + "_duration", audioPlayer.duration);

			} else {
				audioPlayer.currentTime = 0;
				localStorage.setItem(audioTitle + "_time", 0);
				localStorage.setItem(audioTitle + "_duration", audioPlayer.duration);
			}
			player.initializePlayer(audioPlayer);   
			if (sessionStorage.getItem("PlayerStatus") == "hidden") player.showPlayer();   
			player.playMusic(audioPlayer);
		});

    });


	// Live time update for progress bar
	audioPlayer.addEventListener("timeupdate", function() {
		let progressBar = document.getElementById("player_progression_bar_foreground");
		let progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
		progressBar.style.width = progress + "%";
		localStorage.setItem(localStorage.getItem("currentMusicTitle") + "_time", audioPlayer.currentTime);


		try {let progressBarCard = document.querySelector(".podcast_time_bar[title='" + localStorage.getItem("currentMusicTitle") + "']");
		progressBarCard.style.width = progress + "%";}
		catch (error) {console.log("No podcast bar found for this podcast"); console.log(localStorage.getItem("currentMusicTitle"))}
		

		let currentTimeElement = document.getElementById("player_time");
		let currentTime = player.convertToHHSS(audioPlayer.currentTime);
		let totalTime = player.convertToHHSS(audioPlayer.duration);
		currentTimeElement.innerHTML = currentTime + " / " + totalTime;

	})
})
  

