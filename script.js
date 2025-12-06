// Navigation functionality
document.addEventListener("DOMContentLoaded", function () {
  // Scroll Progress Indicator
  const scrollProgress = document.querySelector(".scroll-progress");

  function updateScrollProgress() {
    const activeSection = document.querySelector(".section.active");
    if (activeSection) {
      const scrollTop = window.scrollY;
      const docHeight = activeSection.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      scrollProgress.style.width = Math.min(scrollPercent, 100) + "%";
    }
  }

  window.addEventListener("scroll", updateScrollProgress);

  // Back to Top Button
  const backToTopButton = document.getElementById("backToTop");

  window.addEventListener("scroll", function () {
    if (window.scrollY > 300) {
      backToTopButton.classList.add("visible");
    } else {
      backToTopButton.classList.remove("visible");
    }
  });

  backToTopButton.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // Get all navigation links and sections
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll(".section");
  const dropdownLinks = document.querySelectorAll(".dropdown-menu a");
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  // Footer quick links navigation
  document.querySelectorAll(".footer-nav a").forEach(function (link) {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        // Use the same navigation logic as main nav
        const targetSection = document.querySelector(href);
        if (targetSection) {
          document
            .querySelectorAll(".section")
            .forEach((section) => section.classList.remove("active"));
          targetSection.classList.add("active");
          window.scrollTo({ top: 0, behavior: "smooth" });
          // Update nav active state
          document
            .querySelectorAll(".nav-link")
            .forEach((nav) => nav.classList.remove("active"));
          const navLink = document.querySelector(
            '.nav-link[href="' + href + '"]'
          );
          if (navLink) navLink.classList.add("active");
        }
      }
    });
  });

  // Function to show a section
  function showSection(sectionId) {
    // Hide all sections
    sections.forEach((section) => {
      section.classList.remove("active");
    });

    // Remove active class from all nav links
    navLinks.forEach((link) => {
      link.classList.remove("active");
    });

    // Show the target section
    const targetSection = document.querySelector(sectionId);
    if (targetSection) {
      targetSection.classList.add("active");

      // Scroll to top
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      // Reset scroll progress
      scrollProgress.style.width = "0%";
      setTimeout(updateScrollProgress, 100);
    }

    // Close mobile menu if open
    navMenu.classList.remove("active");
  }

  // Handle main navigation clicks
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      // Only handle hash links
      if (href && href.startsWith("#")) {
        e.preventDefault();
        showSection(href);
        this.classList.add("active");
      }
    });
  });

  // Handle dropdown menu clicks
  dropdownLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const href = this.getAttribute("href");
      showSection(href);
    });
  });

  // Mobile menu toggle
  navToggle.addEventListener("click", function () {
    navMenu.classList.toggle("active");
  });

  // Handle dropdown on mobile
  const dropdown = document.querySelector(".dropdown > .nav-link");
  if (dropdown) {
    dropdown.addEventListener("click", function (e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        this.parentElement.classList.toggle("active");
      }
    });
  }

  // Close mobile menu when clicking outside
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".navbar")) {
      navMenu.classList.remove("active");
    }
  });

  // Handle browser back/forward buttons
  window.addEventListener("hashchange", function () {
    const hash = window.location.hash || "#home";
    showSection(hash);
  });

  // Initialize with the correct section on page load
  const initialHash = window.location.hash || "#home";
  showSection(initialHash);

  // Add smooth scrolling for any internal links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href !== "#") {
        e.preventDefault();
      }
    });
  });

  // Add fade-in effect on scroll for content boxes
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observe all content boxes
  document.querySelectorAll(".content-box").forEach((box) => {
    box.style.opacity = "0";
    box.style.transform = "translateY(20px)";
    box.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(box);
  });

  // Add active state to nav based on scroll position (alternative navigation method)
  let isNavigating = false;

  window.addEventListener("scroll", function () {
    if (isNavigating) return;

    const scrollPosition = window.scrollY;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      const sectionBottom = sectionTop + section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        const sectionId = section.getAttribute("id");
        const correspondingLink = document.querySelector(
          `.nav-link[href="#${sectionId}"]`
        );

        if (correspondingLink && !section.classList.contains("active")) {
          // Don't auto-switch sections on scroll, just update active nav link
          navLinks.forEach((link) => link.classList.remove("active"));
          correspondingLink.classList.add("active");
        }
      }
    });
  });

  // CAROUSEL FUNCTIONALITY

  function initCarousel(carouselId, dotsId) {
    const carousel = document.getElementById(carouselId);
    const dotsContainer = document.getElementById(dotsId);

    if (!carousel || !dotsContainer) return;

    const cards = carousel.querySelectorAll(".carousel-card");
    const prevBtn = document.querySelector(
      `[data-carousel="${carouselId}"].prev-btn`
    );
    const nextBtn = document.querySelector(
      `[data-carousel="${carouselId}"].next-btn`
    );

    if (cards.length === 0) return;

    // Create dots
    cards.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.classList.add("carousel-dot");
      if (index === 0) dot.classList.add("active");
      dot.setAttribute("aria-label", `Go to card ${index + 1}`);
      dot.addEventListener("click", () => scrollToCard(index));
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll(".carousel-dot");

    // Scroll to specific card
    function scrollToCard(index) {
      const card = cards[index];
      if (card) {
        const scrollLeft =
          card.offsetLeft - (carousel.offsetWidth - card.offsetWidth) / 2;
        carousel.scrollTo({ left: scrollLeft, behavior: "smooth" });
      }
    }

    // Update active dot based on scroll position
    function updateActiveDot() {
      const scrollLeft = carousel.scrollLeft;
      const containerWidth = carousel.offsetWidth;

      let closestIndex = 0;
      let closestDistance = Infinity;

      cards.forEach((card, index) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const containerCenter = scrollLeft + containerWidth / 2;
        const distance = Math.abs(cardCenter - containerCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === closestIndex);
      });

      return closestIndex;
    }

    // Navigation buttons
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        const currentIndex = updateActiveDot();
        const prevIndex = Math.max(0, currentIndex - 1);
        scrollToCard(prevIndex);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        const currentIndex = updateActiveDot();
        const nextIndex = Math.min(cards.length - 1, currentIndex + 1);
        scrollToCard(nextIndex);
      });
    }

    // Update dots on scroll
    carousel.addEventListener("scroll", updateActiveDot);

    // Initial update
    updateActiveDot();
  }
});
