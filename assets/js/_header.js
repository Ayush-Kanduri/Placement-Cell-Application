{
	try {
		let id = 0;
		//Get Employee ID
		if (document.getElementById("employeeProfile")) {
			id = document.getElementById("employeeProfile").value;
		}

		//Routes Mapping
		const routes = {
			home: "/",
			jobs: "/jobs",
			profile: `/profile/${id}`,
		};

		//Set the Active Nav Link in the Header Navbar
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
