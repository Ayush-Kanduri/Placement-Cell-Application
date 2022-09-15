{
	try {
		function accordion() {
			const collapse = document.querySelectorAll(".accordion-collapse");
			collapse.forEach((item) => {
				const ele = item.previousElementSibling;
				ele.children[0].addEventListener("click", (e) => {
					if (e.target.getAttribute("aria-expanded") === "true") {
						ele.classList.add("round");
						e.target.classList.add("round");
					} else {
						ele.classList.remove("round");
						e.target.classList.remove("round");
					}
				});
			});
		}
		accordion();
	} catch (error) {
		console.log(error);
	}
}


//for each item or part, pass it through the initializer class which initializes on page reload and use it for the ajax as well.
//AJAX - new class(Single Item) 
//Reload - for each(item -> new class(item))
