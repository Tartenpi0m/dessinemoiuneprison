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


// ---------- COMMUN ELEMENTS TO ALL PAGES ------------
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
	loadPage("home");
	//loadPage("podcasts");	


	// ----------MENU BUTTON-------------
	const menuButton = document.querySelector("#header_menu_button");
	menuButton.addEventListener('click', () => {
		if (localStorage.getItem("currentPage") === "home") loadPage("podcasts");
		if (localStorage.getItem("currentPage") == "podcasts") loadPage("home");
	})




	// --------AUDIO PLAYER--------
	const audioPlayer = document.getElementById("audio");


	// Current music behavior
	if (!localStorage.getItem("currentMusic")) {
        // Code to execute if "currentMusic" not exists in localStorage
        localStorage.setItem("currentMusic", "None");
		player.hidePlayer();
    }


    if (localStorage.getItem("currentMusic") == "None") {
        console.log("No music selected. Player hidden.");
        //player.hidePlayer();
		player.showPlayer();
    }

    if (localStorage.getItem("currentMusic") != "None") {
		console.log("Player intialized to : " + localStorage.getItem("currentMusic"));
        player.initializePlayer(audioPlayer);
		player.showPlayer();
    }

	// Live time update for progress bar
	audioPlayer.addEventListener("timeupdate", function() {
		
		let currentTime = player.convertToHHSS(audioPlayer.currentTime);
		let totalTime = player.convertToHHSS(audioPlayer.duration);
		if (currentTime !== "NaN:NaN" && totalTime !== "NaN:NaN") {
			let currentTimeElement = document.getElementById("player_time");
			currentTimeElement.innerHTML = (currentTime + " / " + totalTime).toString();

			let progressBar = document.getElementById("player_progression_bar_foreground");
			let progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
			progressBar.style.width = progress + "%";
			localStorage.setItem(localStorage.getItem("currentMusicTitle") + "_time", audioPlayer.currentTime);
		}
	})

	// Play button
	let playButton = document.getElementById("play_pause_button");
	playButton.addEventListener("click", function() {
		if (audioPlayer.paused) {
			player.playMusic(audioPlayer);
			
		} else {
			player.pauseMusic(audioPlayer);
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



///// ------------------ PODCASTS PAGE ------------------ /////
window.addEventListener('subload_podcasts', function() {

	// --------CARD BEHAVIOR--------
	let cards = document.querySelectorAll(".podcast_card");
	cards.forEach(card => {
		card.addEventListener('click', () => {
			if (card.style.height === "120px") {
				card.style.height = "fit-content";
				card.querySelector(".podcast_innercard").querySelector(".podcast_content").style.height = "fit-content";
			} else {
				card.style.height = "120px";
				card.querySelector(".podcast_innercard").querySelector(".podcast_content").style.height = "90px";
			}
		});
	});


	// --------AUDIO PLAYER--------
	const audioPlayer = document.getElementById("audio");


	// Set progress bar width (on page load) for each card podcast (according to local storage)
	let bars = document.querySelectorAll(".podcast_time_bar");
	bars.forEach(bar => {
		let audioTitle = bar.getAttribute("title");
		if(localStorage.getItem(audioTitle + "_time")) {
			bar.style.width = localStorage.getItem(audioTitle + "_time") / localStorage.getItem(audioTitle + "_duration") * 100 + "%";
		}
	});

	// add event listener to each play button of each cards
	let button_list = document.querySelectorAll(".play_button");
	button_list.forEach(play_button => {
		console.log("Adding event listener to play button : " + play_button.getAttribute("title") + " with source : " + play_button.getAttribute("src"));
		play_button.addEventListener("click", () => {

			let audioSource = play_button.getAttribute("src");
			let audioTitle = play_button.getAttribute("title");
			

			if (localStorage.getItem("currentMusic") == audioSource) {
				console.log("Same music selected. Play/Pause it.");
				if (localStorage.getItem("currentlyPlaying") == "true") {
					player.pauseMusic(audioPlayer);
				} else {
					player.playMusic(audioPlayer);
				}
			} else {
				console.log("Different music selected. Play it.");
				if (localStorage.getItem("currentlyPlaying") == "true") {
					console.log("Currently playing another music. Pause it.");
					player.pauseMusic(audioPlayer);

					//set all other play buttons to pause
					let buttons = document.querySelectorAll(".play_button");
					buttons.forEach(button => {
						console.log("Setting pause icon to : " + button.getAttribute("title"));
						player.setPauseIcon(button);
					});

				}

				localStorage.setItem("currentMusic", audioSource);
				localStorage.setItem("currentMusicTitle", audioTitle);

				player.setPlayIcon(play_button);
				
				// Set time from local storage if exists, else set to 0
				if (localStorage.getItem(audioTitle + "_time") != null) {
					audioPlayer.currentTime = localStorage.getItem(audioTitle + "_time");
					audioPlayer.onloadedmetadata = function() {
						localStorage.setItem(audioTitle + "_duration", audioPlayer.duration);
					}
				} else {
					audioPlayer.currentTime = 0;
					localStorage.setItem(audioTitle + "_time", 0);
					audioPlayer.onloadedmetadata = function() {
						localStorage.setItem(audioTitle + "_duration", audioPlayer.duration);
					}
				}

				player.initializePlayer(audioPlayer);   
				if (sessionStorage.getItem("PlayerStatus") == "hidden") player.showPlayer();   
				player.playMusic(audioPlayer);

			}


			
			// if (localStorage.getItem("currentlyPlaying") == "true") {
			// 	if (localStorage.getItem("currentMusic") == audioSource) {
			// 		audioPlayer.pause();
			// 		player.setPauseIcon(play_button);
			// 		localStorage.setItem("currentlyPlaying", false);
			// 	} else {
			// 		//set all other play buttons to pause
			// 		let buttons = document.querySelectorAll(".play_button");
			// 		buttons.forEach(button => {
			// 			if (button.getAttribute("src") != audioSource) {
			// 				audioPlayer.pause();
			// 				player.setPauseIcon(button);
			// 			}
			// 		});
			// 	}
				
			// } else {

			// 	player.setPlayIcon(play_button);
				
			// 	if (localStorage.getItem(audioTitle + "_time") != null) {
			// 		audioPlayer.currentTime = localStorage.getItem(audioTitle + "_time");
			// 	audioPlayer.onloadedmetadata = function() {
			// 		localStorage.setItem(audioTitle + "_duration", audioPlayer.duration);
			// 	}

			// 	} else {
			// 		audioPlayer.currentTime = 0;
			// 		localStorage.setItem(audioTitle + "_time", 0);
			// 		audioPlayer.onloadedmetadata = function() {
			// 			localStorage.setItem(audioTitle + "_duration", audioPlayer.duration);
			// 		}
			// 	}
			// 	player.initializePlayer(audioPlayer);   
			// 	if (sessionStorage.getItem("PlayerStatus") == "hidden") player.showPlayer();   
			// 	player.playMusic(audioPlayer);
			// }
		});

    });


	// Live time update for progress bar (using event listener)
	audioPlayer.addEventListener('timeupdate', () => {
		try {let progressBarCard = document.querySelector(".podcast_time_bar[title='" + localStorage.getItem("currentMusicTitle") + "']");
		let progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
		progressBarCard.style.width = progress + "%";}
		catch (error) {console.log("No podcast bar found for this podcast"); console.log(localStorage.getItem("currentMusicTitle"))}
	
	})
})
