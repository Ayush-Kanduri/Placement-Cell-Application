{
	try {
		const card = document.getElementsByClassName("card")[0];
		const jobs = card.getAttribute("data-jobs");
		//Create Job Cards Dynamically
		for (let job of JSON.parse(jobs)) {
			let span1 = document.createElement("span");
			let span2 = document.createElement("span");
			const newCard = card.cloneNode(true);
			newCard.style.display = "inline-block";
			newCard.querySelector(".card-header").textContent =
				job.company_name + " 🚀";
			newCard.querySelector(".card-title").textContent = job.job_title;
			span1.textContent = `: ${job.interview_date}`;
			newCard.querySelectorAll(".card-text")[0].appendChild(span1);
			span2.textContent = `: ${job.location}`;
			newCard.querySelectorAll(".card-text")[1].appendChild(span2);
			newCard.querySelector("a").href = job.url;
			document.getElementsByClassName("jobPage")[0].appendChild(newCard);
		}
	} catch (error) {
		console.log("Error in Fetching the Jobs ❌", error);
	}
}
