{
	try {
		//---------Change Header Title---------
		if (document.getElementById("User").value === "false") {
			if (window.location.pathname === "/signup") {
				document.querySelector("header h1").textContent =
					"Employee Sign Up";
			}
		}
		//---------Redirect to Login Page---------
		document.querySelectorAll(".login-btn").forEach((btn) => {
			btn.addEventListener("click", (e) => {
				e.preventDefault();
				e.stopPropagation();
				window.location.href = "/";
			});
		});
		//---------Redirect to Google Login---------
		document.querySelectorAll(".google-btn").forEach((btn) => {
			btn.addEventListener("click", (e) => {
				e.preventDefault();
				e.stopPropagation();
			});
		});
	} catch (error) {
		console.log(error);
	}
}
