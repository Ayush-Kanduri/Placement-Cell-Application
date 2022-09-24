//Interviews Class
class Interviews {
	//Constructor
	constructor(element) {
		this.interviewForm = element;
		let self = this;
		self.convertToAJAX();
	}

	//Creates a new Interview using AJAX
	addInterview(form) {
		let self = this;
		//On Form Submit
		form.addEventListener("submit", async (e) => {
			e.preventDefault();
			e.stopPropagation();
			const formData = new FormData(form);
			const Data = Object.fromEntries(formData.entries());

			//If name is empty
			if (Data.name === "") {
				self.notify("Please Enter Company Name 🤷‍♂️", "error");
				return;
			}
			//If date is empty
			if (Data.date === "") {
				self.notify("Please Enter a Date 🤷‍♂️", "error");
				return;
			}
			//If date is invalid
			if (new Date(Data.date) < new Date()) {
				self.notify("Please Enter a Valid Date 🤷‍♂️", "error");
				return;
			}

			//Send AJAX Request
			const response = await fetch("/interviews/add", {
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
			//Create Interview in DOM using AJAX
			let accordion = self.createInterviewInDOM(data.company);
			let deleteBtn = accordion.querySelector(".delete-interview-button");
			//Toggle Accordion on click using AJAX
			self.toggleAccordion(accordion);
			//Delete Interview on Click using AJAX
			self.deleteInterview(deleteBtn);
			//Instantiate Students List Class
			new StudentsList(data.company.id);
		});
	}

	//Creates a new Interview in DOM
	createInterviewInDOM(company) {
		//Use Accordion Template
		let template = document.querySelectorAll("template")[1];
		let clone = template.content.cloneNode(true);
		let accordion = clone.querySelector(".interview-accordion-item");
		accordion.classList.add(`accordion-item-${company.id}`);
		accordion.id = `accordion-item-${company.id}`;
		let h2 = accordion.querySelector(".accordion-header");
		h2.id = `interview-heading-${company.id}`;
		let button = accordion.querySelector(".accordion-button");
		button.textContent = company.name + " 🚀";
		button.setAttribute("data-bs-target", `#interview-${company.id}`);
		button.setAttribute("aria-controls", `interview-${company.id}`);
		let body = accordion.querySelector(".accordion-collapse");
		body.id = `interview-${company.id}`;
		body.setAttribute("aria-labelledby", `interview-heading-${company.id}`);
		company.date = new Date(company.date).toLocaleDateString();
		let form = body.querySelector("form");
		form.setAttribute("id", `company-${company.id}-students-form`);
		let p = body.querySelector(".interview-data p");
		p.appendChild(document.createTextNode(company.date));
		body
			.querySelector(".delete-interview-button")
			.setAttribute("data-id", company.id);
		body.querySelector(
			".fa-circle-plus.add-student-BTN"
		).id = `add-student-${company.id}`;

		document.getElementById("interviews").appendChild(accordion);
		return accordion;
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

	//Delete Interview Information from the Student's Table Section in the DOM
	deleteTableRow(data) {
		let { students, id } = data;
		for (let student of students) {
			let item = document.querySelector(
				`.student-accordion-item.accordion-item-${student._id}`
			);
			item.querySelectorAll(".student-data > p > span")[6].textContent =
				student.status;
			let table = item.querySelector("table");
			let tbody = table.querySelector("tbody");
			let tr = tbody.querySelectorAll("tr");
			if (tr.length !== 0) {
				tr.forEach((item) => {
					if (item.id === `${id}`) item.remove();
				});
			}
		}
	}

	//Delete the Interview
	deleteInterview(btn) {
		let self = this;
		btn.addEventListener("click", async (e) => {
			e.preventDefault();
			e.stopPropagation();
			const id = e.target.getAttribute("data-id");
			//Send AJAX Request
			const response = await fetch(`/interviews/delete/${id}`, {
				method: "DELETE",
			});
			//Get Response Data
			const data = await response.json();
			//If Error
			if (data.status === "error") return self.notify(data.message, "error");
			//Success Message
			self.notify(data.message, "success");
			//Delete Interview Information from the Student's Section in DOM
			self.deleteTableRow(data);
			//Delete Interview from DOM
			e.target.closest(".interview-accordion-item").remove();
		});
	}

	//Converts all existing Interviews to AJAX on Page Load
	convertToAJAX() {
		let self = this;
		let accordion = document.querySelectorAll(".interview-accordion-item");
		//For all existing Accordions
		accordion.forEach((item) => {
			let deleteBtn = item.querySelector(".delete-interview-button");
			//Toggle Accordion on click
			self.toggleAccordion(item);
			//Delete Interview on Click
			self.deleteInterview(deleteBtn);
			//Get the Company's ID by Splitting the ID attribute into an array
			let companyID = item.id.split("-")[2];
			//Instantiate Students List Class
			new StudentsList(companyID);
		});
		//Add New Interview
		self.addInterview(self.interviewForm);
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
}

{
	try {
		const interviewForm = document.getElementsByClassName("interview-form");
		//Instantiate the Interviews Class
		Array.from(interviewForm).forEach((item) => {
			let self = item;
			new Interviews(self);
		});
	} catch (e) {
		console.log(e);
	}
}
