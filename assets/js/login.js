{
	try {
		//---------Redirect to Sign Up Page---------
		document.querySelectorAll(".signup-btn").forEach((btn) => {
			btn.addEventListener("click", (e) => {
				e.preventDefault();
				e.stopPropagation();
				window.location.href = "/signup";
			});
		});
	} catch (e) {
		console.log(e);
	}
}
