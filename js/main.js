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

if (localStorage.getItem("access") == "denied" || localStorage.getItem("access") == null) {
	window.location.href = "../index.html";
}



// ---------- COMMUN ELEMENTS TO ALL PAGES ------------
window.addEventListener('DOMContentLoaded', function() {

	//sessionStorage.setItem("try", "no");



	// --------PAGE NAVIGATION--------
    if (!localStorage.getItem("currentPage")) {
        // Code to execute if "currentPage" not exists in localStorage
        localStorage.setItem("currentPage", "home");
    }

	else {
		// Code to execute if "currentPage" exists in localStorage
		//loadPage(localStorage.getItem("currentPage"));
	}

    loadPage(localStorage.getItem("currentPage"));
	//loadPage("home");
	//loadPage("podcasts");	


	let menu_item_home = document.querySelector("#menu_item_home");
	menu_item_home.addEventListener('click', () => {
		loadPage("home");
	})

	let menu_item_podcasts = document.querySelector("#menu_item_podcasts");
	menu_item_podcasts.addEventListener('click', () => {
		loadPage("podcasts");
	})

	let menu_item_about = document.querySelector("#menu_item_ressource");
	menu_item_about.addEventListener('click', () => {
		loadPage("ressource");
	})

	// ----------MENU BUTTON-------------
	let header_menu_button = document.querySelector("#header_menu_button");
	header_menu_button.addEventListener('click', () => {
		let header_menu_dev = document.querySelector("#header_menu_dev");
		if (header_menu_dev.style.display === "flex") {
			header_menu_dev.style.display = "none";
		} else {
			header_menu_dev.style.display = "flex";
		}
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
        player.hidePlayer();
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

	// Change time by clicking on progress bar
	let progressBar = document.getElementById("player_progression_bar_background");
	progressBar.addEventListener("click", function(e) {
		let rect = progressBar.getBoundingClientRect();
		let x = e.clientX - rect.left;
		let width = rect.right - rect.left;
		let progress = x / width;
		audioPlayer.currentTime = progress * audioPlayer.duration;
	});

	// Detect when audio ends
	audioPlayer.addEventListener("ended", function() {
		player.pauseMusic(audioPlayer);
	});

});



///// ------------------ PODCASTS PAGE ------------------ /////
window.addEventListener('subload_podcasts', function() {

	// --------CARD BEHAVIOR--------
	let cards = document.querySelectorAll(".podcast_card");
	// transfomr list of card in .querySelector(".podcast_innercard").querySelector(".podcast_content") elements
	cards.forEach(card => {
		let podcast_text_info = card.querySelector(".card_upper").querySelector(".podcast_text_info");
		let card_lower = card.querySelector(".card_lower");
		
		podcast_text_info.addEventListener('click', () => {
			let cardHeight = window.getComputedStyle(card).height;
			if (cardHeight === "120px") {
				card.style.height = "fit-content";
			} else {
				card.style.height = "120px";
			}
		});

		card_lower.addEventListener('click', () => {
			let cardHeight = window.getComputedStyle(card).height;
			if (cardHeight === "120px") {
				card.style.height = "fit-content";
			} else {
				card.style.height = "120px";
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
		} else {
			bar.style.width = "0%";
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



///// ------------------ HOME PAGE ------------------ /////
window.addEventListener('subload_home', function() {

	let home_block_close_button = document.querySelectorAll(".home_block_close_button");
	home_block_close_button.forEach(button => {
		button.addEventListener('click', () => {
			loadPage("podcasts")
		})
	})
});