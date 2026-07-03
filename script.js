const yearLabel = document.getElementById("year");
if (yearLabel) {
  yearLabel.textContent = String(new Date().getFullYear());
}

document.querySelectorAll("img.product-image").forEach((img) => {
  const applyFallback = () => {
    const fallback = document.createElement("div");
    fallback.className = "product-image product-image-fallback";
    fallback.setAttribute("role", "img");
    fallback.setAttribute("aria-label", img.alt || "Imagen no disponible");
    fallback.innerHTML = `
      <span class="material-symbols-rounded" aria-hidden="true">image</span>
      <span>${img.alt || "Imagen no disponible"}</span>
    `;
    img.replaceWith(fallback);
  };

  if (img.complete && img.naturalWidth === 0) {
    applyFallback();
  } else {
    img.addEventListener("error", applyFallback, { once: true });
  }
});

const menuBtn = document.getElementById("menuBtn");
const menu = document.getElementById("menu");
const navShell = document.querySelector("[data-site-nav-shell]");
if (menuBtn && menu) {
  const setMenuState = (isOpen) => {
    menu.classList.toggle("is-open", isOpen);
    menuBtn.classList.toggle("is-open", isOpen);
    navShell?.classList.toggle("menu-open", isOpen);
    menuBtn.setAttribute("aria-expanded", String(isOpen));
    menuBtn.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
  };

  const syncMenuState = () => {
    if (window.innerWidth >= 768) {
      setMenuState(false);
    } else {
      setMenuState(false);
    }
  };

  menuBtn.addEventListener("click", () => {
    const isOpen = !menu.classList.contains("is-open");
    setMenuState(isOpen);
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth < 768) {
        setMenuState(false);
      }
    });
  });

  document.addEventListener("click", (event) => {
    if (window.innerWidth >= 768 || !menu.classList.contains("is-open")) return;
    if (navShell?.contains(event.target)) return;
    setMenuState(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu.classList.contains("is-open")) {
      setMenuState(false);
    }
  });

  window.addEventListener("resize", () => {
    syncMenuState();
  });

  syncMenuState();
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReducedMotion) {
  const observer = new IntersectionObserver((entries, io) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
} else {
  document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in-view"));
}

const nav = document.querySelector("nav");
if (nav) {
  const handleShadow = () => {
    nav.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  window.addEventListener("scroll", handleShadow, { passive: true });
  handleShadow();
}

const detailCards = document.querySelectorAll("[data-detail-card]");
if (detailCards.length) {
  const mobileDetailLayout = window.matchMedia("(max-width: 767px)");
  const detailLayouts = Array.from(detailCards).map((card) => ({
    card,
    visual: card.querySelector(".product-detail-visual"),
    content: card.querySelector(".product-detail-content"),
    imageShell: card.querySelector(".product-detail-image-shell"),
    facts: card.querySelector(".product-detail-facts"),
    price: card.querySelector(".product-detail-price"),
    chips: card.querySelector(".sp-chips-bar"),
    copy: card.querySelector(".product-detail-copy"),
    list: card.querySelector(".product-detail-list"),
    note: card.querySelector(".product-detail-note"),
    actions: card.querySelector(".product-detail-actions")
  }));

  const applyDetailLayout = () => {
    const isMobile = mobileDetailLayout.matches;

    detailLayouts.forEach((layout) => {
      const { visual, content, imageShell, facts, price, chips, copy, list, note, actions } = layout;
      if (!visual || !content || !imageShell || !facts || !price) return;

      if (isMobile) {
        content.insertBefore(imageShell, copy || list || note || actions || null);
        content.insertBefore(price, imageShell);
        content.insertBefore(facts, copy || list || note || actions || null);
        if (chips) {
          content.insertBefore(chips, facts);
        }
        visual.classList.add("is-empty");
      } else {
        visual.prepend(imageShell);
        visual.append(facts);
        visual.classList.remove("is-empty");
      }
    });
  };

  if (typeof mobileDetailLayout.addEventListener === "function") {
    mobileDetailLayout.addEventListener("change", applyDetailLayout);
  } else if (typeof mobileDetailLayout.addListener === "function") {
    mobileDetailLayout.addListener(applyDetailLayout);
  }

  window.addEventListener("resize", () => {
    applyDetailLayout();
  }, { passive: true });

  applyDetailLayout();
}

const productCards = document.querySelectorAll("[data-product-card], [data-detail-card]");
if (productCards.length && window.gsap) {
  productCards.forEach((card) => {
    const media = card.querySelector("[data-product-media]");
    const content = card.querySelector("[data-product-content]");
    const stats = card.querySelectorAll("[data-product-stat]");
    const enableTilt = card.hasAttribute("data-product-card");

    if (!prefersReducedMotion) {
      window.gsap.set(card, { transformPerspective: 1400, transformOrigin: "center center" });
      if (media) {
        window.gsap.set(media, { transformOrigin: "center center" });
      }

      const intro = window.gsap.timeline({ defaults: { ease: "power3.out" } });

      intro
        .from(card, { opacity: 0, y: 36, scale: 0.98, duration: 0.8 })
        .from(media, { opacity: 0, x: -38, rotate: -2, duration: 0.75 }, "-=0.45")
        .from(content ? Array.from(content.children) : [], { opacity: 0, y: 20, stagger: 0.08, duration: 0.5 }, "-=0.45")
        .from(stats, { opacity: 0, y: 14, stagger: 0.06, duration: 0.35 }, "-=0.35");

      if (enableTilt) {
        const rotateXTo = window.gsap.quickTo(card, "rotationX", { duration: 0.35, ease: "power3.out" });
        const rotateYTo = window.gsap.quickTo(card, "rotationY", { duration: 0.35, ease: "power3.out" });
        const liftTo = window.gsap.quickTo(card, "y", { duration: 0.35, ease: "power3.out" });
        const mediaXTo = media ? window.gsap.quickTo(media, "x", { duration: 0.4, ease: "power3.out" }) : null;
        const mediaYTo = media ? window.gsap.quickTo(media, "y", { duration: 0.4, ease: "power3.out" }) : null;

        const handleMove = (event) => {
          const bounds = card.getBoundingClientRect();
          const offsetX = (event.clientX - bounds.left) / bounds.width - 0.5;
          const offsetY = (event.clientY - bounds.top) / bounds.height - 0.5;

          rotateXTo(offsetY * -8);
          rotateYTo(offsetX * 10);
          liftTo(-6);

          if (mediaXTo && mediaYTo) {
            mediaXTo(offsetX * 10);
            mediaYTo(offsetY * 10);
          }
        };

        const resetCard = () => {
          rotateXTo(0);
          rotateYTo(0);
          liftTo(0);

          if (mediaXTo && mediaYTo) {
            mediaXTo(0);
            mediaYTo(0);
          }
        };

        card.addEventListener("pointermove", handleMove);
        card.addEventListener("pointerleave", resetCard);
        card.addEventListener("pointercancel", resetCard);
      }
    } else {
      card.style.opacity = "1";
      card.style.transform = "none";
    }
  });
}

/* WhatsApp popup: auto-show after 3s, dismiss on close */
(function () {
  const popup = document.getElementById("waPopup");
  const closeBtn = document.getElementById("waPopupClose");
  if (!popup || !closeBtn) return;

  const dismissed = sessionStorage.getItem("waPopupDismissed");
  if (dismissed) {
    popup.classList.add("hidden");
    return;
  }

  popup.classList.add("hidden");

  setTimeout(function () {
    popup.classList.remove("hidden");
  }, 3000);

  closeBtn.addEventListener("click", function () {
    popup.classList.add("hidden");
    sessionStorage.setItem("waPopupDismissed", "1");
  });
})();

const benefitsSlider = document.querySelector("[data-benefits-slider]");
if (benefitsSlider) {
  const track = benefitsSlider.querySelector("[data-benefits-track]");
  const cards = Array.from(benefitsSlider.querySelectorAll("[data-benefit-card]"));
  const prevBtn = benefitsSlider.querySelector("[data-benefits-prev]");
  const nextBtn = benefitsSlider.querySelector("[data-benefits-next]");
  const dots = benefitsSlider.querySelector("[data-benefits-dots]");

  let currentPage = 0;
  let cardsPerView = 3;
  let totalPages = 1;

  const getCardsPerView = () => {
    if (window.innerWidth <= 640) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  };

  const renderDots = () => {
    if (!dots) return;
    dots.innerHTML = "";

    for (let page = 0; page < totalPages; page += 1) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = `benefits-dot${page === currentPage ? " is-active" : ""}`;
      dot.setAttribute("aria-label", `Ir al grupo ${page + 1}`);
      dot.addEventListener("click", () => {
        currentPage = page;
        updateSlider();
      });
      dots.appendChild(dot);
    }
  };

  const updateSlider = (animate = true) => {
    if (!track || !cards.length) return;

    cardsPerView = getCardsPerView();
    totalPages = Math.max(1, Math.ceil(cards.length / cardsPerView));
    currentPage = Math.min(currentPage, totalPages - 1);

    const gap = parseFloat(window.getComputedStyle(track).gap || "0");
    const cardWidth = cards[0].getBoundingClientRect().width;
    const offset = currentPage * (cardWidth + gap) * cardsPerView;

    if (window.gsap && !prefersReducedMotion && animate) {
      window.gsap.to(track, {
        x: -offset,
        duration: 0.72,
        ease: "power3.out",
        overwrite: true
      });
    } else if (window.gsap) {
      window.gsap.set(track, { x: -offset });
    } else {
      track.style.transform = `translate3d(-${offset}px, 0, 0)`;
    }

    renderDots();
  };

  prevBtn?.addEventListener("click", () => {
    currentPage = (currentPage - 1 + totalPages) % totalPages;
    updateSlider();
  });

  nextBtn?.addEventListener("click", () => {
    currentPage = (currentPage + 1) % totalPages;
    updateSlider();
  });

  let resizeFrame = 0;
  window.addEventListener("resize", () => {
    window.cancelAnimationFrame(resizeFrame);
    resizeFrame = window.requestAnimationFrame(() => updateSlider(false));
  });

  updateSlider(false);
}

/* --- PREMIUM GSAP ANIMATIONS FOR CTA & FOOTER --- */
if (window.gsap && window.ScrollTrigger && !prefersReducedMotion) {
  gsap.registerPlugin(ScrollTrigger);

  const benefitCards = document.querySelectorAll(".pet-benefit-card");
  if (benefitCards.length) {
    gsap.fromTo(
      benefitCards,
      { opacity: 0, y: 42, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.85,
        ease: "power3.out",
        stagger: 0.14,
        scrollTrigger: {
          trigger: "#beneficios",
          start: "top 78%"
        }
      }
    );

    benefitCards.forEach((card, index) => {
      const image = card.querySelector(".pet-benefit-image");
      const halo = card.querySelector(".pet-benefit-halo");
      if (!image || !halo) return;

      gsap.to(image, {
        y: index % 2 === 0 ? -10 : -14,
        rotate: index === 1 ? 1.6 : -1.2,
        duration: 2.8 + index * 0.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true
      });

      gsap.to(halo, {
        scale: 1.08,
        opacity: 0.72,
        duration: 2.4 + index * 0.25,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true
      });
    });
  }

  // Animar elementos del CTA final
  const ctaElements = document.querySelectorAll(".gs-reveal-up");
  if (ctaElements.length) {
    gsap.fromTo(ctaElements, 
      { opacity: 0, y: 30, autoAlpha: 0 },
      {
        opacity: 1, 
        y: 0, 
        autoAlpha: 1,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: ".sp-final-cta",
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }

  // Animar columnas del footer
  const footerElements = document.querySelectorAll(".gs-footer-item");
  if (footerElements.length) {
    gsap.fromTo(footerElements,
      { opacity: 0, y: 20, autoAlpha: 0 },
      {
        opacity: 1,
        y: 0,
        autoAlpha: 1,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: ".sp-footer",
          start: "top 90%",
          toggleActions: "play none none none"
        }
      }
    );
  }
} else if (window.gsap) {
  // Fallback si prefieren movimiento reducido o si falló ScrollTrigger
  gsap.set(".gs-reveal-up, .gs-footer-item", { autoAlpha: 1, opacity: 1, visibility: 'visible' });
}

/* --- PRODUCT CARD DUAL-IMAGE AUTO-ROTATE & HOVER --- */
(function () {
  const wrappers = document.querySelectorAll(".product-image-wrapper");
  const AUTO_INTERVAL = 5000; // 5 seconds
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  wrappers.forEach((wrapper) => {
    const altImg = wrapper.querySelector(".product-image--alt");
    if (!altImg) return;
    const isDetailCard = Boolean(wrapper.closest("[data-detail-card]"));

    let timer = null;
    let isHovered = false;

    const startAutoRotate = () => {
      if (!canHover || isDetailCard) return;
      clearInterval(timer);
      timer = setInterval(() => {
        if (!isHovered) {
          wrapper.classList.toggle("show-alt");
        }
      }, AUTO_INTERVAL);
    };

    if (canHover) {
      wrapper.addEventListener("mouseenter", () => {
        isHovered = true;
        wrapper.classList.add("show-alt");
        clearInterval(timer);
      });

      wrapper.addEventListener("mouseleave", () => {
        isHovered = false;
        wrapper.classList.remove("show-alt");
        startAutoRotate();
      });

      if (!isDetailCard) {
        // Start the auto-rotate only for catalogue cards.
        startAutoRotate();
      }
    } else {
      wrapper.classList.remove("show-alt");
    }
  });
})();

/* --- HERO MINI SLIDERS --- */
(function () {
  const sliders = document.querySelectorAll("[data-hero-slider]");
  if (!sliders.length || prefersReducedMotion) return;

  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  sliders.forEach((slider) => {
    const slides = Array.from(slider.querySelectorAll("[data-hero-slide]"));
    if (slides.length < 2) return;

    const delay = Number.parseInt(slider.getAttribute("data-slider-delay") || "3400", 10);
    let activeIndex = slides.findIndex((slide) => !slide.classList.contains("opacity-0"));
    let timer = null;

    if (activeIndex < 0) activeIndex = 0;

    const showSlide = (nextIndex) => {
      slides.forEach((slide, index) => {
        const isActive = index === nextIndex;
        slide.classList.toggle("opacity-0", !isActive);
        slide.classList.toggle("opacity-100", isActive);
        slide.setAttribute("aria-hidden", String(!isActive));
      });

      activeIndex = nextIndex;
    };

    const start = () => {
      clearInterval(timer);
      timer = setInterval(() => {
        const nextIndex = (activeIndex + 1) % slides.length;
        showSlide(nextIndex);
      }, delay);
    };

    if (canHover) {
      slider.addEventListener("mouseenter", () => clearInterval(timer));
      slider.addEventListener("mouseleave", start);
    }

    showSlide(activeIndex);
    start();
  });
})();
