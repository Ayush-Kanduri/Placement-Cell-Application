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

		//---------On Form Submit---------
		const file = document.querySelector("input.image");
		const submit = document.querySelector(".submit-btn");
		const form = document.querySelector("form");
		const name = document.querySelector("#name").value.trim();
		const email = document.querySelector("#email").value.trim();
		const password = document.querySelector("#password").value.trim();
		const regex1 = /\S+@\S+\.\S+/;
		const regex2 = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		const at = email.indexOf("@");
		const dot = email.indexOf(".");

		submit.addEventListener("click", (e) => {
			//If name is empty
			if (name === "") return notify("error", "Name is Required ❌");
			//If email is empty
			if (email === "") return notify("error", "Email is Required ❌");
			//If password is empty
			if (password === "") return notify("error", "Password is Required ❌");
			//If name is less than 3 characters
			if (name.length < 3) {
				let message = "Name must be at least 6 Characters Long ❌";
				notify("error", message);
				return;
			}
			//If password is less than 6 characters
			if (password.length < 6) {
				let message = "Password must be at least 6 Characters Long ❌";
				notify("error", message);
				return;
			}
			//For @ and . in email
			if (!email.match(regex1)) {
				let message = "Invalid Email Address ❌";
				notify("error", message);
				return;
			}
			//For characters, digits, special characters, @ and . in email
			if (!email.match(regex2)) {
				let message = "Invalid Email Address ❌";
				notify("error", message);
				return;
			}
			//For @ and . indexes in email
			if (at < 1 || dot < at + 2 || dot + 2 >= email.length) {
				let message = "Invalid Email Address ❌";
				notify("error", message);
				return;
			}

			if (file.files.length > 0) {
				//FRONTEND VALIDATION :: File Size must be less than equal to 3MB
				if (file.files[0].size > 1024 * 1024 * 3) {
					let message = "Image size must be less than 3MB ❌";
					notify("error", message);
					return;
				}
				//FRONTEND VALIDATION :: File must be an Image
				if (
					file.files[0].type !== "image/jpeg" &&
					file.files[0].type !== "image/png" &&
					file.files[0].type !== "image/jpg" &&
					file.files[0].type !== "image/gif" &&
					file.files[0].type !== "image/svg"
				) {
					let message =
						"Image must be in jpeg, png, jpg, gif or svg format ❌";
					notify("error", message);
					return;
				}
			}

			form.submit();
		});
	} catch (error) {
		console.log(error);
	}
}
