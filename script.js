const slides = Array.from(document.querySelectorAll(".slide"));
const dots = Array.from(document.querySelectorAll(".slide-dot"));
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let activeSlide = 0;
let slideTimer;

function showSlide(index) {
  if (!slides.length) return;
  activeSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === activeSlide);
  });
  dots.forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === activeSlide);
  });
}

function startSlider() {
  if (slides.length < 2 || document.hidden || reduceMotion.matches) return;
  clearInterval(slideTimer);
  slideTimer = setInterval(() => showSlide(activeSlide + 1), 5200);
}

function stopSlider() {
  clearInterval(slideTimer);
}

dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    showSlide(index);
    startSlider();
  });
});

startSlider();

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopSlider();
  } else {
    startSlider();
  }
});

reduceMotion.addEventListener("change", () => {
  if (reduceMotion.matches) {
    stopSlider();
  } else {
    startSlider();
  }
});

const morphWord = document.querySelector(".morph-word");
const morphWords = ["Growth.", "Returns.", "Legacy.", "Wealth."];
let morphIndex = 0;
const morphDuration = 450;

if (morphWord && !reduceMotion.matches) {
  setInterval(() => {
    morphWord.classList.add("is-exiting");

    setTimeout(() => {
      morphIndex = (morphIndex + 1) % morphWords.length;
      morphWord.textContent = morphWords[morphIndex];
      morphWord.classList.remove("is-exiting");
      morphWord.classList.add("is-entering");

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          morphWord.classList.remove("is-entering");
        });
      });
    }, morphDuration);
  }, 2500);
}

const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const contactForm = document.querySelector(".contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const button = contactForm.querySelector("button");
    const formData = new FormData(contactForm);
    const message = [
      "Hi Realtywize, I want to discuss land options.",
      `Name: ${formData.get("name") || ""}`,
      `Phone: ${formData.get("phone") || ""}`,
      `Requirement: ${formData.get("requirement") || ""}`,
      `Message: ${formData.get("message") || ""}`,
    ]
      .filter((line) => !line.endsWith(": "))
      .join("\n");

    window.open(`https://wa.me/919891900500?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    if (!button) return;
    button.textContent = "Opening WhatsApp";
    setTimeout(() => {
      button.textContent = "Send on WhatsApp";
      contactForm.reset();
    }, 1800);
  });
}
