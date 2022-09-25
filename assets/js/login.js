{
	try {
		//---------Notifications Handling---------
		const notify = (type, message) => {
			let noty = {};
			noty[type] = {
				theme: "relax",
				text: message,
				type: type,
				layout: "topRight",
				progressBar: true,
				closeWith: ["click", "button"],
				timeout: 6000,
				sounds: {
					sources: ["/storage/sounds/Ting.mp3"],
					volume: 0.5,
					conditions: ["docHidden", "docVisible"],
				},
			};

			if (noty[type].type === "success") noty[type].theme = "relax";
			if (noty[type].type === "error") noty[type].theme = "sunset";

			return new Noty(noty[type]).show();
		};

		//---------On Login Form Submit---------
		document.querySelectorAll(".login-btn").forEach((btn) => {
			btn.addEventListener("click", (e) => {
				e.preventDefault();
				e.stopPropagation();

				//FRONTEND VALIDATION :: Frontend Form Validation
				let email = document.getElementById("exampleInputEmail1").value;
				const pass = document.getElementById("exampleInputPassword1").value;
				const regex1 = /\S+@\S+\.\S+/;
				const regex2 = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
				const at = email.indexOf("@");
				const dot = email.indexOf(".");
				email = email.trim();

				//If name is empty
				if (email === "") return notify("error", "Email is Required ❌");
				//If password is empty
				if (pass === "") return notify("error", "Password is Required ❌");
				//If password is less than 6 characters
				if (pass.length < 6) {
					let message = "Password must be at least 6 Characters Long ❌";
					notify("error", message);
					return;
				}

				document.querySelector("form").submit();
			});
		});
	} catch (e) {
		console.log(e);
	}
}

try {
	//---------Redirect to Google Login---------
	document.querySelectorAll(".google-btn").forEach((btn) => {
		btn.addEventListener("click", (e) => {
			e.preventDefault();
			e.stopPropagation();
			window.location.href = "/auth/google";
		});
	});
} catch (error) {
	console.log(error);
}

try {
	//---------Redirect to Sign Up Page---------
	document.querySelectorAll(".signup-btn").forEach((btn) => {
		btn.addEventListener("click", (e) => {
			e.preventDefault();
			e.stopPropagation();
			window.location.href = "/signup";
		});
	});
} catch (error) {
	console.log(error);
}
