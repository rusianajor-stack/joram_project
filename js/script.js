/* =========================================
   Joram Rusiana — Personal Portfolio
   script.js

   This one file is loaded on every page.
   Each feature checks whether the elements it
   needs exist on the current page before doing
   anything, so nothing breaks on pages that
   don't have that feature.

   Features in this file:
   1. Mobile navigation toggle      (required)
   2. Contact form validation       (required)
   3. Dark / light mode + localStorage (chosen extra)
   4. Scroll-to-top button          (chosen extra)
   5. Typing effect on the Home page (chosen extra)
   ========================================= */

document.addEventListener("DOMContentLoaded", function () {
  highlightActiveNavLink();
  setUpMobileNav();
  setUpThemeToggle();
  setUpScrollToTop();
  setUpTypingEffect();
  setUpContactForm();
});

/* -----------------------------------------
   Highlight the current page in the nav bar
----------------------------------------- */
function highlightActiveNavLink() {
  var currentPage = window.location.pathname.split("/").pop() || "index.html";
  var links = document.querySelectorAll(".nav-link");

  links.forEach(function (link) {
    var linkPage = link.getAttribute("href");
    if (linkPage === currentPage) {
      link.classList.add("active");
    }
  });
}

/* -----------------------------------------
   1. Mobile navigation toggle
   Shows/hides the nav menu on small screens
----------------------------------------- */
function setUpMobileNav() {
  var navToggle = document.getElementById("nav-toggle");
  var mainNav = document.getElementById("main-nav");

  if (!navToggle || !mainNav) return;

  navToggle.addEventListener("click", function () {
    mainNav.classList.toggle("open");

    var isOpen = mainNav.classList.contains("open");
    navToggle.setAttribute("aria-expanded", isOpen);
  });

  // Close the mobile menu after a link is tapped
  mainNav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      mainNav.classList.remove("open");
    });
  });
}

/* -----------------------------------------
   3. Dark / light mode toggle
   Preference is saved in localStorage so it
   is remembered the next time the page loads
----------------------------------------- */
function setUpThemeToggle() {
  var themeToggle = document.getElementById("theme-toggle");
  if (!themeToggle) return;

  updateThemeButtonIcon();

  themeToggle.addEventListener("click", function () {
    var isDark = document.documentElement.getAttribute("data-theme") === "dark";
    var newTheme = isDark ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("portfolio-theme", newTheme);
    updateThemeButtonIcon();
  });
}

function updateThemeButtonIcon() {
  var themeToggle = document.getElementById("theme-toggle");
  if (!themeToggle) return;

  var isDark = document.documentElement.getAttribute("data-theme") === "dark";
  themeToggle.textContent = isDark ? "Light" : "Dark";
}

/* -----------------------------------------
   4. Scroll-to-top button
   Appears once the user scrolls down the page
   and smoothly scrolls back up when clicked
----------------------------------------- */
function setUpScrollToTop() {
  var scrollBtn = document.getElementById("scroll-top-btn");
  if (!scrollBtn) return;

  window.addEventListener("scroll", function () {
    if (window.scrollY > 300) {
      scrollBtn.classList.add("show");
    } else {
      scrollBtn.classList.remove("show");
    }
  });

  scrollBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* -----------------------------------------
   5. Typing effect
   Cycles through a list of roles on the
   Home page hero section
----------------------------------------- */
function setUpTypingEffect() {
  var typingEl = document.getElementById("typing-role");
  if (!typingEl) return;

  var roles = ["BSIT Student", "Web Developer", "Aspiring Software Engineer"];
  var roleIndex = 0;
  var charIndex = 0;
  var isDeleting = false;

  function tick() {
    var currentRole = roles[roleIndex];

    if (isDeleting) {
      charIndex--;
    } else {
      charIndex++;
    }

    typingEl.textContent = currentRole.substring(0, charIndex);

    var typingSpeed = isDeleting ? 45 : 90;

    if (!isDeleting && charIndex === currentRole.length) {
      typingSpeed = 1400; // pause at the end of a word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 400; // pause before typing the next word
    }

    setTimeout(tick, typingSpeed);
  }

  tick();
}

/* -----------------------------------------
   2. Contact form validation
   Checks each field, shows an inline error
   message, and blocks submission until the
   form is valid
----------------------------------------- */
function setUpContactForm() {
  var form = document.getElementById("contact-form");
  if (!form) return;

  var successMessage = document.getElementById("form-success");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var isNameValid = validateRequired("name", "Please enter your name.");
    var isEmailValid = validateEmail("email");
    var isMessageValid = validateRequired("message", "Please enter a message.");

    if (isNameValid && isEmailValid && isMessageValid) {
      form.reset();
      if (successMessage) {
        successMessage.classList.add("show");
        setTimeout(function () {
          successMessage.classList.remove("show");
        }, 4000);
      }
    }
  });

  // Re-check a field as soon as the user fixes it
  ["name", "email", "message"].forEach(function (fieldId) {
    var field = document.getElementById(fieldId);
    if (!field) return;

    field.addEventListener("input", function () {
      if (fieldId === "email") {
        validateEmail(fieldId);
      } else {
        validateRequired(fieldId, "This field is required.");
      }
    });
  });
}

function validateRequired(fieldId, message) {
  var field = document.getElementById(fieldId);
  var errorEl = document.getElementById(fieldId + "-error");
  var value = field.value.trim();

  if (value === "") {
    showFieldError(field, errorEl, message);
    return false;
  }

  clearFieldError(field, errorEl);
  return true;
}

function validateEmail(fieldId) {
  var field = document.getElementById(fieldId);
  var errorEl = document.getElementById(fieldId + "-error");
  var value = field.value.trim();
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (value === "") {
    showFieldError(field, errorEl, "Please enter your email.");
    return false;
  }

  if (!emailPattern.test(value)) {
    showFieldError(field, errorEl, "Please enter a valid email address.");
    return false;
  }

  clearFieldError(field, errorEl);
  return true;
}

function showFieldError(field, errorEl, message) {
  field.classList.add("invalid");
  if (errorEl) errorEl.textContent = message;
}

function clearFieldError(field, errorEl) {
  field.classList.remove("invalid");
  if (errorEl) errorEl.textContent = "";
}
