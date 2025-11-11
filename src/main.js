const init = () => {
  // Mobile Menu Toggle
  const mobileMenuToggle = document.getElementById("mobileMenuToggle");
  const navMenu = document.getElementById("navMenu");

  // Mobile Menu Toggle
  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
    });

    document.addEventListener("click", (event) => {
      if (
        !navMenu.contains(event.target) &&
        !mobileMenuToggle.contains(event.target) &&
        !event.target.closest(".faq-item")
      ) {
        navMenu.classList.remove("active");
      }
    });
  }

  // Experience Section
  const arrowUp = document.getElementById("arrow_up");
  const arrowDown = document.getElementById("arrow_down");
  const experienceFeature = document.querySelector(".experience-feature");
  const stepNumbers = document.querySelectorAll(".step-number");

  let experienceIndex = 0;
  const experienceContent = [
    {
      title: "Affordable Rates",
      description:
        "Enjoy competitive pricing without compromising quality get where you need to go, affordably",
    },
    {
      title: "Reliable Service",
      description:
        "Our drivers are punctual and professional, ensuring you reach your destination on time",
    },
    {
      title: "Comfortable Rides",
      description:
        "Experience a smooth and comfortable journey with our well-maintained vehicles",
    },
  ];

  const updateExperienceContent = () => {
    if (!experienceFeature) return;

    const currentContent = experienceContent[experienceIndex];
    experienceFeature.innerHTML = `
      <div style="width: 264px">
        <h4 style="font-size: 22px; font-weight: 500">${currentContent.title}</h4>
        <p>${currentContent.description}</p>
      </div>
    `;

    stepNumbers.forEach((step, index) => {
      step.style.background =
        index === experienceIndex ? "#FFC107" : "transparent";
    });
  };

  if (stepNumbers.length > 0) {
    stepNumbers.forEach((step) => {
      step.addEventListener("click", () => {
        experienceIndex = Number.parseInt(step.dataset.index ?? "0", 10);
        updateExperienceContent();
      });
    });
  }

  const increaseExperienceIndex = () => {
    experienceIndex = experienceIndex >= 2 ? 0 : experienceIndex + 1;
    updateExperienceContent();
  };

  const decreaseExperienceIndex = () => {
    experienceIndex = experienceIndex <= 0 ? 2 : experienceIndex - 1;
    updateExperienceContent();
  };

  if (arrowUp) {
    arrowUp.addEventListener("click", increaseExperienceIndex);
  }
  if (arrowDown) {
    arrowDown.addEventListener("click", decreaseExperienceIndex);
  }

  // FAQ Accordion
  const faqItems = document.querySelectorAll(".faq-item");

  if (faqItems.length > 0) {
    faqItems.forEach((item) => {
      item.addEventListener("click", () => {
        const isActive = item.classList.contains("active");
        const icon = item.querySelector(".faq-icon");
        const answer = item.querySelector(".faq-answer");

        if (!icon || !answer) {
          return;
        }

        faqItems.forEach((otherItem) => {
          if (otherItem !== item) {
            otherItem.classList.remove("active");
            const otherIcon = otherItem.querySelector(".faq-icon");
            const otherAnswer = otherItem.querySelector(".faq-answer");
            if (otherIcon && otherAnswer) {
              otherIcon.src = "./assets/images/add.svg";
              otherAnswer.style.maxHeight = "0";
            }
          }
        });

        item.classList.toggle("active");
        icon.src = isActive
          ? "./assets/images/add.svg"
          : "./assets/images/minus.svg";
        answer.style.maxHeight = isActive ? "0" : `${answer.scrollHeight}px`;
      });
    });
  }

  // Booking Form Submission
  let selectedDriverType = "Single Trip";
  const bookingEndpoint =
    import.meta.env.VITE_BOOKING_API_URL || "/api/booking";

  const toggleSingleTripFields = () => {
    const fields = document.querySelectorAll(".single-trip-fields");

    fields.forEach((field) => {
      const inputs = field.querySelectorAll("input");

      if (
        selectedDriverType === "Single Trip" ||
        selectedDriverType === "Corporate Driver"
      ) {
        field.style.display = "flex";
        inputs.forEach((input) => {
          input.required = true;
        });
      } else {
        field.style.display = "none";
        inputs.forEach((input) => {
          input.required = false;
        });
      }
    });
  };

  document.querySelectorAll('input[name="driver_type"]').forEach((radio) => {
    radio.addEventListener("change", (event) => {
      selectedDriverType = event.target.value;
      toggleSingleTripFields();
    });
  });

  const handleBookingSubmit = (form) => {
    if (!form) return;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      if (!submitBtn) return;

      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span class="loader"></span>`;

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      if (!data.name || !data.phone || !data.driver_type) {
        alert(
          "Please fill in all required fields (Name, Phone, and Driver Type)."
        );
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        return;
      }

      if (
        data.driver_type === "Single Trip" ||
        data.driver_type === "Corporate Driver"
      ) {
        if (
          !data.pickup_date ||
          !data.pickup_time ||
          !data.pickup_location ||
          !data.dropoff_location
        ) {
          alert(
            "Please fill in all required fields for a single trip (Pickup Date, Time, Location, and Dropoff Location)."
          );
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
          return;
        }
      }

      try {
        const response = await fetch(bookingEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          alert(
            "Thank you for your booking request! We will contact you shortly."
          );
          form.reset();
          selectedDriverType = "Single Trip";
          toggleSingleTripFields();
        } else {
          alert(
            "There was an error submitting your booking. Please try again."
          );
        }
      } catch (error) {
        console.error("API error:", error);
        alert("There was a network error. Please try again.");
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  };

  const bookingForm = document.getElementById("bookingForm");
  const bookingFormMobile = document.getElementById("bookingFormMobile");

  handleBookingSubmit(bookingForm);
  handleBookingSubmit(bookingFormMobile);

  toggleSingleTripFields();

  // Smooth Scrolling
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      event.preventDefault();
      const target = document.querySelector(anchor.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Header Scroll Effect
  window.addEventListener("scroll", () => {
    const header = document.querySelector(".header");
    if (!header) {
      return;
    }
    if (window.scrollY > 100) {
      header.style.background = "rgba(255, 255, 255, 0.95)";
      header.style.backdropFilter = "blur(10px)";
    } else {
      header.style.background = "var(--bg-white)";
      header.style.backdropFilter = "none";
    }
  });

  // Intersection Observer for Animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in-up");
      }
    });
  }, observerOptions);

  document
    .querySelectorAll(".feature-card, .service-card, .faq-item")
    .forEach((element) => observer.observe(element));

  // Set minimum date for booking forms
  const today = new Date().toISOString().split("T")[0];
  document.querySelectorAll("#pickup_date").forEach((dateInput) => {
    dateInput.setAttribute("min", today);
  });

  // Newsletter form submission
  const newsletterForm = document.querySelector(".newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      if (emailInput && emailInput.value) {
        alert("Thank you for subscribing to our newsletter!");
        emailInput.value = "";
      } else {
        alert("Please enter a valid email address.");
      }
    });
  }

  // Profile Modal Functionality
  const modal = document.getElementById("profile-modal");
  const modalOverlay = document.getElementById("modalOverlay");
  const modalClose = document.getElementById("modalClose");
  const modalBody = document.getElementById("modalBody");

  if (modal && modalOverlay && modalClose && modalBody) {
    const profileData = {
      "michael-akpan": {
        name: "Michael Akpan",
        position: "Founder and CEO",
        image: "./assets/images/michael_akpan.png",
        bio: `As the Founder and CEO of A Plus Drivers (RAD Transport Services), Michael Akpan brings a wealth of experience in strategy development and execution, leadership and sales expertise.<br><br> With a proven track record across various leadership roles, including Head of Strategy and Customer Lifecycle Management at Keeon Oil, Michael excels in driving business growth and addressing complex challenges.<br><br> Michael holds a Bachelor of Science degree in Political Science from the University of Lagos (Unilag).<br><br> His passion lies in developing future leaders with strong strategic thinking and sales sector expertise.<br><br> Under Michael’s leadership, A Plus Drivers (RAD Transport Services) is poised for continued growth and success, driven by innovative strategies and a commitment to excellence.`,
      },
      "tobi-amida": {
        name: "Tobi Amida",
        position: "Board Chairman",
        image: "./assets/images/tobi_amida.png",
        bio: `Tobi Amida is an experienced strategist, transformation leader, and educator specializing in Strategy, Leadership, and Banking. He has demonstrated success in strategy development and execution across various leadership roles.<br><br> His roles include Director at Aella Financial Solution with oversight over the Microfinance Bank, Head of Strategy/Customer Lifecycle Management at Smartcash PSB/Airtel Subsidiary, and Head, Strategy and Research at Nigeria Inter-Bank Settlement Systems PLC.<br><br> With a background in consulting with the Management Consulting arm of KPMG Professional Services, Tobi combines academic knowledge with practical experience to address complex business challenges with actionable strategies.<br><br> Tobi is proficient in strategy formulation, project execution,financial analysis, and product management. He is passionate about developing future leaders with strong strategic thinking and banking sector expertise.<br><br> He has delivered lectures for Talstack, a leading education platform on topics ranging from Design and Execute Corporate and Functional Strategies and Manage Cross-functional Teams.<br><br> He holds a B.Sc. in Agricultural Engineering from Obafemi Awolowo University.`,
      },
    };

    const openModal = (profileId) => {
      const profile = profileData[profileId];
      if (!profile) return;

      modalBody.innerHTML = `
        <img src="${profile.image}" alt="${profile.name}" />
        <h2>${profile.name}</h2>
        <div class="position">${profile.position}</div>
        <div class="profile-text">${
          profile.bio || "Profile coming soon..."
        }</div>
        <div style='display: flex; align-items: center; margin-top: 20px; gap: 6px;'> 
          <button style="background: transparent; border: 1px solid black; font-size: 18px; font-weight:700; padding: 13px 40.5px; border-radius: 52px; cursor: pointer;">Find out more</button>
          <button style="background: #004A97; border: none; font-size: 18px; font-weight:700; padding: 13px 40.5px; border-radius: 52px; color: #fff; cursor: pointer; display: flex; gap: 12px; align-items: center;">
            <div style="width: 24px; height: 24px;">
              <img src="./assets/images/linkedin_icon.png" style="width: 100%;"/>
            </div>
            <p>Find me on LinkedIn</p>
          </button>
        </div>
      `;

      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    };

    const closeModal = () => {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    };

    document.querySelectorAll("[data-modal]").forEach((card) => {
      card.addEventListener("click", (event) => {
        event.stopPropagation();
        const profileId = card.getAttribute("data-modal");
        openModal(profileId);
      });
    });

    modalClose.addEventListener("click", closeModal);
    modalOverlay.addEventListener("click", closeModal);

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && modal.classList.contains("active")) {
        closeModal();
      }
    });

    document.addEventListener("click", (event) => {
      if (
        modal.classList.contains("active") &&
        !event.target.closest(".team-leader-card") &&
        !event.target.closest(".modal-content")
      ) {
        closeModal();
      }
    });
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
