{
	try {
		let id = 0;
		if (document.getElementById("employeeProfile")) {
			id = document.getElementById("employeeProfile").value;
		}
		const routes = {
			home: "/",
			jobs: "/jobs",
			profile: `/profile/${id}`,
		};

		const navLinks = document.querySelectorAll(".nav-links a");
		const currentLinks = [];
		navLinks.forEach((item) => {
			navLinks.forEach((item) => item.classList.remove("active"));
			if (!item.classList.contains("active")) {
				if (window.location.pathname === routes[item.classList[0]]) {
					currentLinks.push(item);
				}
			}
		});

		currentLinks.forEach((i) => i.classList.add("active"));
	} catch (error) {
		console.log(error);
	}
}
