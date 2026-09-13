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
const stickyWhatsApp = document.querySelector(".sticky-whatsapp");

if (navToggle && siteNav) {
  function setNavOpen(isOpen) {
    siteNav.classList.toggle("is-open", isOpen);
    document.body.classList.toggle("nav-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  }

  navToggle.addEventListener("click", () => {
    setNavOpen(!siteNav.classList.contains("is-open"));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setNavOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setNavOpen(false);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) setNavOpen(false);
  });
}

if (stickyWhatsApp) {
  function syncStickyWhatsApp() {
    const revealPoint = Math.min(420, window.innerHeight * 0.45);
    stickyWhatsApp.classList.toggle("is-visible", window.scrollY > revealPoint);
  }

  syncStickyWhatsApp();
  window.addEventListener("scroll", syncStickyWhatsApp, { passive: true });
  window.addEventListener("resize", syncStickyWhatsApp);

  const stickySuppressTargets = Array.from(document.querySelectorAll(".catalog-grid, .founder-video-frame, .site-footer"));

  if (stickySuppressTargets.length && "IntersectionObserver" in window) {
    const activeSuppressors = new Set();
    const stickyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activeSuppressors.add(entry.target);
          } else {
            activeSuppressors.delete(entry.target);
          }
        });

        stickyWhatsApp.classList.toggle("is-suppressed", activeSuppressors.size > 0);
      },
      { threshold: 0.18 }
    );

    stickySuppressTargets.forEach((target) => stickyObserver.observe(target));
  }
}

const founderVideo = document.querySelector(".founder-video");
const videoMuteToggle = document.querySelector(".video-mute-toggle");

if (founderVideo && videoMuteToggle) {
  function setFounderVideoMuted(isMuted) {
    founderVideo.controls = false;
    founderVideo.muted = isMuted;
    founderVideo.defaultMuted = isMuted;
    if (isMuted) {
      founderVideo.setAttribute("muted", "");
    } else {
      founderVideo.removeAttribute("muted");
      founderVideo.volume = 1;
    }
  }

  function syncVideoMuteButton() {
    videoMuteToggle.textContent = founderVideo.muted ? "Unmute" : "Mute";
    videoMuteToggle.setAttribute("aria-label", founderVideo.muted ? "Unmute founder video" : "Mute founder video");
    videoMuteToggle.setAttribute("aria-pressed", String(!founderVideo.muted));
  }

  videoMuteToggle.addEventListener("click", () => {
    const shouldMute = !founderVideo.muted;
    setFounderVideoMuted(shouldMute);
    syncVideoMuteButton();
    founderVideo.play().catch(() => syncVideoMuteButton());
  });

  founderVideo.addEventListener("volumechange", syncVideoMuteButton);
  setFounderVideoMuted(true);
  founderVideo.play().catch(() => {});
  syncVideoMuteButton();
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
