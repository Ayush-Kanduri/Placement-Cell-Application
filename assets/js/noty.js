{
	try {
		const noty = document.getElementById("Noty");
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
				sounds: {
					sources: ["/storage/sounds/Ting.mp3"],
					volume: 0.5,
					conditions: ["docHidden", "docVisible"],
				},
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
				sounds: {
					sources: ["/storage/sounds/Ting.mp3"],
					volume: 0.5,
					conditions: ["docHidden", "docVisible"],
				},
			}).show();
		}
	} catch (error) {
		console.log(error);
	}
}
