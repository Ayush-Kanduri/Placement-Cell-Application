class StudentsList {
	constructor(companyID) {
		this.companyID = companyID;
		this.companyContainer = document.querySelector(
			`.interview-accordion-item#accordion-item-${this.companyID}`
		);
		this.studentsListForm = this.companyContainer.querySelector(
			`#company-${this.companyID}-students-form`
		);
		let self = this;
		self.convertToAJAX();
	}

	//Updates the Student from the Persistent Student Interview List and the DOM
	editStudent(interview, btn) {}

	//Delete Student from the Persistent Student Interview List and the DOM
	deleteStudent(interview, btn) {}

	//Add New Student to the Persistent List in the DB
	addStudent(interviewID, addBtn) {
		let self = this;
		//Add Student Interview Button
		addBtn.addEventListener("click", async (e) => {
			e.preventDefault();
			e.stopPropagation();
			let sel1 = self.studentsListForm.querySelector(
				`#student-${interviewID}-select`
			);
			let sel2 = self.studentsListForm.querySelector(
				`#result-${interviewID}-select`
			);
			const formData = new FormData();
			formData.append("interviewID", interviewID);
			formData.append("name", sel1.value);
			formData.append("result", sel2.value);
			const Data = Object.fromEntries(formData.entries());
			let response = await fetch("/interviews/students/add", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(Data),
			});
			let data = await response.json();
			if (data.status === "error") return self.notify(data.message, "error");
			self.notify(data.message, "success");
			//Add New Student into the Interview in the DOM after the Selection is made
			let { student, interview, company, result } = data;
			let container = self.studentsListForm.querySelector(
				`.student-interview-${interview._id}`
			);
			let Name = container.querySelectorAll(".form-group")[0];
			let Result = container.querySelectorAll(".form-group")[1];
			Name.classList.add("hide");
			Result.classList.add("hide");
			let addBtn = container.querySelector(".add-student-interview");
			addBtn.classList.add("hide");
			let fixed = container.querySelector(".fixed");
			if (!fixed) {
				let template = document.querySelectorAll("template")[2];
				let clone = template.content.cloneNode(true);
				fixed = clone.querySelector(".student .fixed");
			}
			fixed.classList.remove("hide");
			fixed.querySelectorAll("p > span")[0].textContent = student.name;
			fixed.querySelectorAll("p > span")[1].textContent = result.result;
			let editBtn = container.querySelector(".edit-student-interview");
			editBtn.classList.remove("hide");
			let deleteBtn = container.querySelector(".delete-student-interview");
			deleteBtn.classList.remove("hide");
			//Add a New Row into the Student Interviews Table in the Student's Section
			let studSection = document.querySelector(
				`.student-accordion-item.accordion-item-${student._id}`
			);
			studSection.querySelectorAll(
				".student-data > p > span"
			)[6].textContent = student.status;
			let table = studSection.querySelector("table");
			let tbody = table.querySelector("tbody");
			let tr = document.createElement("tr");
			tr.setAttribute("id", `${company._id}`);
			let th = document.createElement("th");
			th.setAttribute("scope", "row");
			th.textContent = `${company.name}`;
			tr.appendChild(th);
			let td1 = document.createElement("td");
			td1.textContent = `${new Date(company.date).toLocaleDateString()}`;
			tr.appendChild(td1);
			let td2 = document.createElement("td");
			td2.textContent = `${result.result}`;
			tr.appendChild(td2);
			tbody.appendChild(tr);
			//Delete Student from the Persistent Student Interview List and the DOM
			self.deleteStudent(interview._id, deleteBtn);
			//Updates the Student from the Persistent Student Interview List and the DOM
			self.editStudent(interview._id, editBtn);
		});
	}

	//Create a New Student Selection in the Student's List in the DOM
	createStudentInTheListDOM(btn) {
		let self = this;
		//Add Student Button
		btn.addEventListener("click", async (e) => {
			e.preventDefault();
			e.stopPropagation();
			const id = btn.id.split("-")[2];
			const response = await fetch(`/interviews/create-interview`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id: id }),
			});
			const data = await response.json();
			if (data.status === "error") return self.notify(data.message, "error");
			//Create a New Student Selection in the Student's List in the DOM
			let { students, interview } = data;
			let template = document.querySelectorAll("template")[2];
			let clone = template.content.cloneNode(true);
			let Interview = clone.querySelector(".student");
			Interview.id = `${interview}`;
			Interview.classList.add(`student-interview-${interview}`);
			let formGroup = Interview.querySelectorAll(".form-group");
			formGroup[0].classList.remove("hide");
			formGroup[1].classList.remove("hide");
			let studentName = formGroup[0].querySelector("select");
			studentName.id = `student-${interview}-select`;
			let studentResult = formGroup[1].querySelector("select");
			studentResult.id = `result-${interview}-select`;
			for (let student of students) {
				let option = document.createElement("option");
				option.value = student._id;
				option.textContent = student.name;
				studentName.appendChild(option);
			}
			let addBtn = Interview.querySelector(".add-student-interview");
			addBtn.setAttribute("data-id", `${interview}`);
			addBtn.classList.remove("hide");
			self.studentsListForm.appendChild(Interview);
			//Add New Student to the Persistent List in the DB
			self.addStudent(interview, addBtn);
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
			sounds: {
				sources: ["/storage/sounds/Ting.mp3"],
				volume: 0.5,
				conditions: ["docHidden", "docVisible"],
			},
		}).show();
	}

	//Converts all existing Students List in the Interview to AJAX on Page Load
	convertToAJAX() {
		let self = this;
		//TODO: Create Table using AJAX
		//TODO: Edit/Delete Students List using AJAX
		//TODO: On Student edit, if table exists, update the table, else add a new row
		//TODO: On Student delete, delete student from the student's list in interviews
		//TODO: On Interview delete, delete the row from the table
		//TODO: On Company delete, delete the row from the table
		//TODO: If all students are added then remove the + ICON in students list
		//TODO: Check for single student with pass & fail + delete
		//TODO: Check for multiple students with pass & fail + delete
		//TODO: Check for multiple company single student with pass & fail + delete
		//TODO: Check for multiple company multiple student with pass & fail + delete

		//TODO: Continue from Refreshed Add Student Interview Button
		let addStudentListBtn = self.companyContainer.querySelectorAll(
			`#add-student-${self.companyID}`
		);
		let addStudentInterviewBtns = self.studentsListForm.querySelectorAll(
			".add-student-interview"
		);
		let deleteStudentInterviewBtns = self.studentsListForm?.querySelectorAll(
			".delete-student-interview"
		);
		let editStudentInterviewBtns = self.studentsListForm?.querySelectorAll(
			".edit-student-interview"
		);

		//Add Student Buttons
		addStudentListBtn.forEach((btn) => {
			self.createStudentInTheListDOM(btn);
		});
		//Add Student to Interview Buttons
		addStudentInterviewBtns.forEach((btn) => {
			let interview = btn.getAttribute("data-id");
			self.addStudent(interview, btn);
		});
		//Delete Student from Interview Buttons
		deleteStudentInterviewBtns.forEach((btn) => {
			let interview = btn.getAttribute("data-id");
			self.deleteStudent(interview, btn);
		});
		//Edit Student from Interview Buttons
		editStudentInterviewBtns.forEach((btn) => {
			let interview = btn.getAttribute("data-id");
			self.editStudent(interview, btn);
		});
	}
}

//Flow of Program//
//1. Convert to AJAX
//2. Create Student In The List DOM
//3. Add Student
//4. Create Student In DOM
//5. Remove Student
//6. Update Student

//For any Form Submission//
// const formData = new FormData(form);
// const Data = Object.fromEntries(formData.entries());
// body: JSON.stringify(Data),
