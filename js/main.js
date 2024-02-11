window.addEventListener('load', function() {
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

});

  

function loadPage(page) {
	console.log("Load page : " + page + ".html")
	fetch("./" + page + ".html")
		.then(res => {
			if(res.ok) {
				res.text().then(text => {
					var parser = new DOMParser();
					var text = parser.parseFromString(text, "text/html");
					document.getElementById("real_body").innerHTML = text.body.innerHTML;
					localStorage.setItem("currentPage", page);
				})				
			} else {
				throw new Error('Something went wrong');
			}
		})
}

