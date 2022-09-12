{
	try {
		const routes = {
			home: "/",
			jobs: "/jobs",
			profile: "/profile",
		};

		document.querySelectorAll(".nav-links a").forEach((item) => {
			// if (!item.classList.contains("active")) {
			console.log(window.location.pathname);
			// if (window.location.pathname === routes[item.classList[0]]) {
			// 	item.classList.add("active");
			// }
			// }
		});
	} catch (error) {
		console.log(error);
	}
}
