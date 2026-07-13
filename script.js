const animatedSections = document.querySelectorAll(".desktop-section");
const mobileViewport = window.matchMedia("(max-width: 767px)");

const getScrollTarget = (targetId) => {
  if (mobileViewport.matches) {
    const mobileTarget = document.querySelector(`[data-scroll-alias="${targetId}"]`);

    if (mobileTarget) {
      return mobileTarget;
    }
  }

  return document.getElementById(targetId);
};

document.querySelectorAll("[data-scroll-target]").forEach((control) => {
  control.addEventListener("click", () => {
    const target = getScrollTarget(control.dataset.scrollTarget);

    if (!target) {
      return;
    }

    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
});

const siteHeader = document.querySelector(".site-header");
const mobileMenuToggle = document.querySelector(".site-header__mobile-toggle");

if (siteHeader && mobileMenuToggle) {
  mobileMenuToggle.addEventListener("click", () => {
    const isOpen = siteHeader.classList.toggle("is-mobile-menu-open");
    mobileMenuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteHeader.querySelectorAll(".site-header__mobile-nav [data-scroll-target]").forEach((control) => {
    control.addEventListener("click", () => {
      siteHeader.classList.remove("is-mobile-menu-open");
      mobileMenuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const replaySectionAnimation = (section) => {
  section.classList.remove("is-visible");
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      section.classList.add("is-visible");
    });
  });
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        replaySectionAnimation(entry.target);
      }
    });
  },
  {
    threshold: 0.35,
  }
);

animatedSections.forEach((section) => observer.observe(section));

const desktop4Hotspots = [
  { id: "left-top", x: 38.05, y: 27.23 },
  { id: "left-middle", x: 38.05, y: 50.23 },
  { id: "left-bottom", x: 38.05, y: 59.15 },
  { id: "right-top", x: 59.61, y: 40.06 },
  { id: "right-bottom", x: 59.61, y: 53.99 },
];

document.querySelectorAll(".desktop4-icon-toggle").forEach((toggle) => {
  toggle.addEventListener("click", (event) => {
    const bounds = toggle.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    const hotspot = desktop4Hotspots.find((point) => Math.abs(point.x - x) <= 5.5 && Math.abs(point.y - y) <= 5.5);

    if (!hotspot) {
      return;
    }

    const item = toggle.querySelector(`.desktop4-icon-toggle__item--${hotspot.id}`);
    const isOpen = item.classList.toggle("is-open");
    const isMobileToggle = toggle.classList.contains("desktop4-icon-toggle--mobile");

    const visibleImageSelector = isMobileToggle
      ? ".desktop4-icon-toggle__image--active-button"
      : ".desktop4-icon-toggle__image--open, .desktop4-icon-toggle__image--active-button";

    item.querySelectorAll(visibleImageSelector).forEach((image) => {
      image.classList.toggle("is-visible", isOpen);
      image.style.opacity = isOpen ? "1" : "";
    });

    if (isMobileToggle) {
      item.querySelectorAll(".desktop4-icon-toggle__image--open").forEach((image) => {
        image.classList.remove("is-visible");
        image.style.display = "none";
        image.style.opacity = "0";
      });
    }

    const closedImage = item.querySelector(".desktop4-icon-toggle__image--closed");
    closedImage.classList.toggle("is-hidden", isOpen);
    closedImage.style.opacity = isOpen ? "0" : "";

    if (isMobileToggle) {
      const mobileInfo = toggle.closest(".desktop4-mobile-content")?.querySelector(`.desktop4-mobile-info__item--${hotspot.id}`);
      mobileInfo?.classList.toggle("is-open", isOpen);
    }
  });
});

document.querySelectorAll("[data-desktop4-mobile-hotspot]").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();

    const id = button.dataset.desktop4MobileHotspot;
    const content = button.closest(".desktop4-mobile-content");
    const mobileInfo = content?.querySelector(`.desktop4-mobile-info__item--${id}`);
    const item = content?.querySelector(`.desktop4-icon-toggle--mobile .desktop4-icon-toggle__item--${id}`);

    if (!mobileInfo || !item) {
      return;
    }

    const isOpen = !mobileInfo.classList.contains("is-open");
    mobileInfo.classList.toggle("is-open", isOpen);
    item.classList.toggle("is-open", isOpen);

    item.querySelectorAll(".desktop4-icon-toggle__image--active-button").forEach((image) => {
      image.classList.toggle("is-visible", isOpen);
      image.style.opacity = isOpen ? "1" : "";
    });

    item.querySelectorAll(".desktop4-icon-toggle__image--open").forEach((image) => {
      image.classList.remove("is-visible");
      image.style.display = "none";
      image.style.opacity = "0";
    });

    const closedImage = item.querySelector(".desktop4-icon-toggle__image--closed");
    closedImage.classList.toggle("is-hidden", isOpen);
    closedImage.style.opacity = isOpen ? "0" : "";
  });
});

document.querySelectorAll(".desktop5-carousel").forEach((carousel) => {
  const slides = Array.from(carousel.querySelectorAll(".desktop5-carousel__slide"));
  const previousButton = carousel.querySelector(".desktop5-carousel__button--prev");
  const nextButton = carousel.querySelector(".desktop5-carousel__button--next");
  let activeIndex = 0;
  let transitionTimeout;

  const showSlide = (nextIndex, direction) => {
    const currentSlide = slides[activeIndex];
    const newIndex = (nextIndex + slides.length) % slides.length;

    if (newIndex === activeIndex) {
      return;
    }

    window.clearTimeout(transitionTimeout);
    carousel.classList.remove("is-moving-prev", "is-moving-next");
    slides.forEach((slide) => slide.classList.remove("is-leaving"));
    currentSlide.classList.add("is-leaving");
    currentSlide.classList.remove("is-active");
    activeIndex = newIndex;
    carousel.classList.add(direction === "prev" ? "is-moving-prev" : "is-moving-next");
    slides[activeIndex].classList.add("is-active");

    transitionTimeout = window.setTimeout(() => {
      currentSlide.classList.remove("is-leaving");
      carousel.classList.remove("is-moving-prev", "is-moving-next");
    }, 540);
  };

  previousButton.addEventListener("click", () => {
    showSlide(activeIndex - 1, "prev");
  });

  nextButton.addEventListener("click", () => {
    showSlide(activeIndex + 1, "next");
  });

  previousButton.addEventListener("mouseenter", () => {
    carousel.classList.add("is-prev-hovered");
  });

  previousButton.addEventListener("mouseleave", () => {
    carousel.classList.remove("is-prev-hovered");
  });

  nextButton.addEventListener("mouseenter", () => {
    carousel.classList.add("is-next-hovered");
  });

  nextButton.addEventListener("mouseleave", () => {
    carousel.classList.remove("is-next-hovered");
  });
});

document.querySelectorAll(".desktop5-hover-card").forEach((card) => {
  card.addEventListener("click", (event) => {
    if (!mobileViewport.matches) {
      return;
    }

    event.stopPropagation();
    card.classList.toggle("is-open");
  });
});

const desktop8Hotspots = [
  { id: "left", x: 21.8, y: 25.8 },
  { id: "middle", x: 50, y: 25.8 },
  { id: "right", x: 78.2, y: 25.8 },
];

document.querySelectorAll(".desktop8-image-toggle").forEach((toggle) => {
  toggle.addEventListener("click", (event) => {
    const bounds = toggle.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    const hotspot = desktop8Hotspots.find((point) => Math.abs(point.x - x) <= 12.2 && Math.abs(point.y - y) <= 16.9);

    if (!hotspot) {
      return;
    }

    const item = toggle.querySelector(`.desktop8-image-toggle__item--${hotspot.id}`);
    item.classList.toggle("is-open");
  });
});

document.querySelectorAll(".desktop8-image-toggle__item").forEach((item) => {
  item.addEventListener("click", (event) => {
    if (!mobileViewport.matches) {
      return;
    }

    event.stopPropagation();
    item.classList.toggle("is-open");
  });
});

document.querySelectorAll(".desktop8-carousel").forEach((carousel) => {
  const slides = Array.from(carousel.querySelectorAll(".desktop8-carousel__slide"));
  const buttons = Array.from(carousel.querySelectorAll(".desktop8-carousel__button"));
  let activeIndex = 0;
  let transitionTimeout;
  const slideTargets = [0, 2, 1];

  const setActiveButton = (slideIndex) => {
    carousel.dataset.activeSlide = String(slideIndex);

    buttons.forEach((button, index) => {
      const isActive = slideTargets[index] === slideIndex;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  };

  const showSlide = (newIndex) => {
    if (newIndex === activeIndex) {
      setActiveButton(newIndex);
      return;
    }

    const currentSlide = slides[activeIndex];

    window.clearTimeout(transitionTimeout);
    slides.forEach((slide) => slide.classList.remove("is-leaving"));
    currentSlide.classList.add("is-leaving");
    currentSlide.classList.remove("is-active");
    activeIndex = newIndex;
    slides[activeIndex].classList.add("is-active");
    setActiveButton(activeIndex);

    transitionTimeout = window.setTimeout(() => {
      currentSlide.classList.remove("is-leaving");
    }, 180);
  };

  buttons.forEach((button, index) => {
    button.setAttribute("aria-pressed", "false");
    button.addEventListener("click", () => {
      showSlide(slideTargets[index]);
    });
  });

  setActiveButton(activeIndex);
});
