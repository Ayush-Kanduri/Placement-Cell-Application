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
		//---------Redirect to Google Login---------
		document.querySelectorAll(".google-btn").forEach((btn) => {
			btn.addEventListener("click", (e) => {
				e.preventDefault();
				e.stopPropagation();
			});
		});
	} catch (e) {
		console.log(e);
	}
}
