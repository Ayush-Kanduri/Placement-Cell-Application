//Students Class
class Students {
	//Constructor
	constructor(element) {
		this.studentForm = element;
		let self = this;
		self.convertToAJAX();
	}

	//Creates a new Student using AJAX
	addStudent(form) {
		let self = this;
		//On Form Submit
		form.addEventListener("submit", async (e) => {
			e.preventDefault();
			e.stopPropagation();
			const formData = new FormData(form);
			const Data = Object.fromEntries(formData.entries());

			//If Form Fields are Empty
			if (
				Data.name === "" ||
				Data.age === "" ||
				Data.gender === "" ||
				Data.college === "" ||
				Data.batch === "" ||
				Data.dsa === "" ||
				Data.react === "" ||
				Data.webd === ""
			) {
				return self.notify("Please enter all the details 🤷‍♂️", "error");
			}

			//Send AJAX Request
			const response = await fetch("/students/add", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(Data),
			});
			//Get Response Data
			const data = await response.json();
			//If Error
			if (data.status === "error") return self.notify(data.message, "error");
			//Form Reset
			form.reset();
			//Success Message
			self.notify(data.message, "success");
			//Create Student in DOM using AJAX
			let accordion = self.createStudentInDOM(data.student);
			let deleteBtn = accordion.querySelector(".delete-student-button");
			//Updates the Selection Option of Interview Form
			self.addToSelection(data.student);
			//Toggle Accordion on click using AJAX
			self.toggleAccordion(accordion);
			//Delete Student on Click using AJAX
			self.deleteStudent(deleteBtn);
		});
	}

	//Updates the Selection Option of Interview Form
	addToSelection(student) {
		let items = document.querySelectorAll(".interview-accordion-item");
		if (items.length !== 0) {
			items.forEach((item) => {
				let selects = item.querySelectorAll(".form-group select");
				if (selects.length !== 0) {
					selects.forEach((select) => {
						if (select && select.name === "name") {
							let option = document.createElement("option");
							option.value = student.id;
							option.textContent = student.name;
							select.appendChild(option);
						}
					});
				}
			});
		}
	}

	//Creates a new Student in DOM
	createStudentInDOM(student) {
		//Use Accordion Template
		let template = document.querySelectorAll("template")[0];
		let clone = template.content.cloneNode(true);
		let accordion = clone.querySelector(".student-accordion-item");
		accordion.classList.add(`accordion-item-${student.id}`);
		let h2 = accordion.querySelector(".accordion-header");
		h2.id = `student-heading-${student.id}`;
		let button = accordion.querySelector(".accordion-button");
		button.textContent = student.name;
		button.setAttribute("data-bs-target", `#student-${student.id}`);
		button.setAttribute("aria-controls", `student-${student.id}`);
		if (student.gender === "male") button.textContent += " 👦";
		if (student.gender === "female") button.textContent += " 👧";
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

	//Delete Interviews of Student from the Interviews Section
	deleteInterviews({ students, companies, interviewIDs, studentID }) {
		let self = this;
		if (companies.length === 0) return;
		companies.forEach((company) => {
			//For Each Company
			let COMPANY = document.querySelector(
				`.interview-accordion-item.accordion-item-${company._id}`
			);
			if (COMPANY) {
				//If there are no students, delete all the company interview slots
				if (students.length === 0) {
					let STUDENT = COMPANY.querySelectorAll(".student");
					if (STUDENT && STUDENT.length > 0) {
						STUDENT.forEach((item) => item.remove());
					}
				}
				//If there are students, delete the interviews of the deleted student
				else {
					interviewIDs.forEach((id) => {
						let STUDENT = COMPANY.querySelector(
							`.student-interview-${id}`
						);
						if (STUDENT) STUDENT.remove();
					});
					//Updates the Selection Options of the Interview Section
					let selects = COMPANY.querySelectorAll(".form-group select");
					if (selects && selects.length > 0) {
						selects.forEach((select) => {
							let opts = select.querySelectorAll("option");
							if (opts && opts.length > 0) {
								opts.forEach((opt) => {
									if (opt && opt.value === studentID) opt.remove();
								});
							}
						});
					}
				}
			}
		});
	}

	//Delete the Student
	deleteStudent(btn) {
		let self = this;
		btn.addEventListener("click", async (e) => {
			e.preventDefault();
			e.stopPropagation();
			const id = e.target.getAttribute("data-id");
			//Send AJAX Request
			const response = await fetch(`/students/delete/${id}`, {
				method: "DELETE",
			});
			//Get Response Data
			const data = await response.json();
			//If Error
			if (data.status === "error") return self.notify(data.message, "error");
			//Success Message
			self.notify(data.message, "success");
			//Delete Interviews of Student from the Interviews Section
			self.deleteInterviews(data);
			//Delete Student from DOM
			e.target.closest(".student-accordion-item").remove();
		});
	}

	//Toggle Accordion
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

	//Notification Message
	notify(message, type) {
		new Noty({
			theme: type === "success" ? "relax" : "sunset",
			text: message,
			type: type,
			layout: "topRight",
			progressBar: true,
			closeWith: ["click", "button"],
			timeout: 6000,
		}).show();
	}

	//Converts all existing Students to AJAX on Page Load
	convertToAJAX() {
		let self = this;
		let accordion = document.querySelectorAll(".student-accordion-item");
		//For all existing Accordions
		accordion.forEach((item) => {
			let deleteBtn = item.querySelector(".delete-student-button");
			//Toggle Accordion on click
			self.toggleAccordion(item);
			//Delete Student on Click
			self.deleteStudent(deleteBtn);
		});
		//Add New Student
		self.addStudent(self.studentForm);
	}
}

{
	try {
		const studentForm = document.getElementsByClassName("student-form");
		//Instantiate the Students Class
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
