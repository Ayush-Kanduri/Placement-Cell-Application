class Students {
	constructor(element) {
		this.studentForm = element;
		let self = this;
		let accordion = document.querySelectorAll(".student-accordion-item");
		accordion.forEach((item) => {
			self.toggleAccordion(item);
			let deleteBtn = item.querySelector(".delete-student-button");
			self.deleteStudent(deleteBtn);
		});
		self.addStudent(self.studentForm);
	}

	addStudent(form) {
		let self = this;
		form.addEventListener("submit", async (e) => {
			e.preventDefault();
			e.stopPropagation();
			const formData = new FormData(form);
			const Data = Object.fromEntries(formData.entries());
			const response = await fetch("/students/add", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(Data),
			});
			const data = await response.json();
			if (data.status === "error") return self.notify(data.message, "error");
			form.reset();
			self.notify(data.message, "success");
			let accordion = self.createStudentInDOM(data.student);
			let deleteBtn = accordion.querySelector(".delete-student-button");
			self.toggleAccordion(accordion);
			self.deleteStudent(deleteBtn);
		});
	}

	createStudentInDOM(student) {
		let template = document.querySelectorAll("template")[0];
		let clone = template.content.cloneNode(true);
		let accordion = clone.querySelector(".student-accordion-item");
		accordion.classList.add(`accordion-item-${student.id}`);
		let h2 = accordion.querySelector(".accordion-header");
		h2.id = `student-heading-${student.id}`;
		let btn = h2.querySelector("button");
		btn.setAttribute("data-bs-target", `#student-${student.id}`);
		btn.setAttribute("aria-controls", `student-${student.id}`);
		btn.textContent =
			student.name + " " + student.gender === "male" ? "👦" : "👧";
		let body = accordion.querySelector(".accordion-collapse");
		body.id = `student-${student.id}`;
		body.setAttribute("aria-labelledby", `student-heading-${student.id}`);
		body.querySelector("img").src = `${student.avatar}`;
		body.querySelector("img").alt = `${student.name}`;
		let p = body.querySelectorAll(".student-data p");
		p[0].querySelector("span").textContent = student.id;
		p[1].querySelector("span").textContent = student.name;
		p[2].querySelector("span").textContent = student.age;
		p[3].querySelector("span").textContent = student.gender;
		p[4].querySelector("span").textContent = student.college;
		p[5].querySelector("span").textContent = student.batch;
		p[6].querySelector("span").textContent = student.status;
		p[7].querySelector("span").textContent = student.dsa;
		p[8].querySelector("span").textContent = student.react;
		p[9].querySelector("span").textContent = student.webd;
		body
			.querySelector(".delete-student-button")
			.setAttribute("data-id", student.id);

		document.getElementById("students").appendChild(accordion);
		return accordion;
	}

	deleteStudent(btn) {
		let self = this;
		btn.addEventListener("click", async (e) => {
			e.preventDefault();
			e.stopPropagation();
			const id = e.target.getAttribute("data-id");
			const response = await fetch(`/students/delete/${id}`, {
				method: "DELETE",
			});
			const data = await response.json();
			if (data.status === "error") return self.notify(data.message, "error");
			self.notify(data.message, "success");
			e.target.closest(".student-accordion-item").remove();
		});
	}

	toggleAccordion(accordion) {
		const collapse = accordion.querySelectorAll(".accordion-collapse");
		collapse.forEach((item) => {
			const ele = item.previousElementSibling;
			ele.children[0].addEventListener("click", (e) => {
				e.preventDefault();
				e.stopPropagation();
				if (e.target.getAttribute("aria-expanded") === "true") {
					ele.classList.add("round");
					e.target.classList.add("round");
				} else {
					ele.classList.remove("round");
					e.target.classList.remove("round");
				}
			});
		});
	}

	notify(message, type) {
		new Noty({
			theme: type === "success" ? "relax" : "sunset",
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
		}).show();
	}
}

{
	try {
		const studentForm = document.getElementsByClassName("student-form");
		Array.from(studentForm).forEach((item) => {
			let self = item;
			new Students(self);
		});
	} catch (e) {
		console.log(e);
	}
}

//for each item or part, pass it through the initializer class which initializes on page reload and use it for the ajax as well.
//AJAX - new class(Single Item)
//Reload - for each(item -> new class(item))

//Use temp.content.cloneNode(true); for Templates
//Use temp.cloneNode(true); for normal elements
