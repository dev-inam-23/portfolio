document.addEventListener("DOMContentLoaded", () => {
	const sections = [...document.querySelectorAll("main section, body > section")];
	const navLinks = [...document.querySelectorAll('nav a[href^="#"]')];
	const header = document.querySelector("header");
	const navigation = document.querySelector("nav");
	const revealItems = document.querySelectorAll("section, .edu-card, .cardx, .contact-info, .contact-form");
	const skillBars = document.querySelectorAll(".progress-bar");
	const contactForm = document.querySelector(".contact-form");

	if (header && navigation) {
		const menuButton = document.createElement("button");
		menuButton.className = "mobile-menu-toggle";
		menuButton.type = "button";
		menuButton.setAttribute("aria-label", "Open navigation menu");
		menuButton.setAttribute("aria-expanded", "false");
		menuButton.innerHTML = "<span></span><span></span><span></span>";
		header.insertBefore(menuButton, header.firstElementChild);

		const closeMenu = () => {
			navigation.classList.remove("is-open");
			menuButton.classList.remove("is-open");
			menuButton.setAttribute("aria-expanded", "false");
			menuButton.setAttribute("aria-label", "Open navigation menu");
		};

		menuButton.addEventListener("click", () => {
			const isOpen = navigation.classList.toggle("is-open");
			menuButton.classList.toggle("is-open", isOpen);
			menuButton.setAttribute("aria-expanded", String(isOpen));
			menuButton.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
		});

		navLinks.forEach((link) => link.addEventListener("click", closeMenu));
		document.addEventListener("click", (event) => {
			if (!header.contains(event.target)) closeMenu();
		});
		window.addEventListener("resize", () => {
			if (window.innerWidth > 768) closeMenu();
		});
	}

	revealItems.forEach((item) => item.classList.add("js-reveal"));

	const revealObserver = new IntersectionObserver((entries, observer) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.add("is-visible");
				observer.unobserve(entry.target);
			}
		});
	}, { threshold: 0.12 });

	revealItems.forEach((item) => revealObserver.observe(item));

	const sectionObserver = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (!entry.isIntersecting) return;

			navLinks.forEach((link) => {
				link.classList.toggle("is-active", link.hash === `#${entry.target.id}`);
			});
		});
	}, { rootMargin: "-35% 0px -55%", threshold: 0 });

	sections.filter((section) => section.id).forEach((section) => sectionObserver.observe(section));

	const skillObserver = new IntersectionObserver((entries, observer) => {
		entries.forEach((entry) => {
			if (!entry.isIntersecting) return;

			entry.target.style.width = entry.target.closest(".skill").querySelector("h3 span").textContent;
			observer.unobserve(entry.target);
		});
	}, { threshold: 0.5 });

	skillBars.forEach((bar) => {
		bar.style.width = "0";
		skillObserver.observe(bar);
	});

	contactForm?.addEventListener("submit", (event) => {
		event.preventDefault();
		const button = contactForm.querySelector("button[type='submit']");
		let status = contactForm.querySelector(".form-status");

		if (!status) {
			status = document.createElement("p");
			status.className = "form-status";
			contactForm.append(status);
		}

		button.disabled = true;
		button.textContent = "Message ready to send";
		status.textContent = "Thanks! Your message has been prepared. I will get back to you soon.";
		contactForm.reset();

		window.setTimeout(() => {
			button.disabled = false;
			button.textContent = "Send Message";
		}, 3000);
	});

	const backToTop = document.createElement("button");
	backToTop.className = "back-to-top";
	backToTop.type = "button";
	backToTop.setAttribute("aria-label", "Back to top");
	backToTop.textContent = "Top";
	document.body.append(backToTop);

	window.addEventListener("scroll", () => {
		backToTop.classList.toggle("is-visible", window.scrollY > 500);
	}, { passive: true });

	backToTop.addEventListener("click", () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	});
});
