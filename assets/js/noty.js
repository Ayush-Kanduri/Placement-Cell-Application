{
	try {
		//Displays the Notifications coming from the Back-End on to the Screen
		const Notification = () => {
			const noty = document.getElementById("Noty");
			if (noty === null || noty === undefined) return;
			const notyType = noty.getAttribute("data");
			const notyText = noty.value;

			if (notyType === "success") {
				new Noty({
					theme: "relax",
					text: notyText,
					type: notyType,
					layout: "topRight",
					progressBar: true,
					closeWith: ["click", "button"],
					timeout: 6000,
					// sounds: {
					// 	sources: ["/storage/sounds/Ting.mp3"],
					// 	volume: 0.5,
					// 	conditions: ["docHidden", "docVisible"],
					// },
				}).show();
			} else {
				new Noty({
					theme: "sunset",
					text: notyText,
					type: notyType,
					layout: "topRight",
					progressBar: true,
					closeWith: ["click", "button"],
					timeout: 6000,
					// sounds: {
					// 	sources: ["/storage/sounds/Ting.mp3"],
					// 	volume: 0.5,
					// 	conditions: ["docHidden", "docVisible"],
					// },
				}).show();
			}
		};

		Notification();
	} catch (error) {
		console.log(error);
	}
}
