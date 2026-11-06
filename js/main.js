/* =================================================================
   main.js — all the effects & interactions ✨

   This file does NOT hold your content. It reads the lists from
   data.js (PROFILE, SOCIALS, ACHIEVEMENTS, SKILLS, PROJECTS) and turns
   them into HTML, then adds all the cute effects.

   CONTENTS
    0. Helpers & settings
    1. Dark mode toggle
    2. Loading screen
    3. Profile info (name, photo, bio, fun facts)
    4. Social links
    5. Achievements (cards, filters, modal)
    6. Skills (arch cards)
    7. Projects
    8. Navbar (hamburger + active link + click animations)
    9. Scroll progress bar & back-to-top
   10. Typing animation
   11. Hero bubbles
   12. Scroll reveal
   13. Card tilt
   14. Button ripple
   15. Click splash (hearts & sparkles)
   16. Cursor sparkle trail
   17. Contact form + toast
   18. Start everything!
   ================================================================= */


/* =================================================================
   0. HELPERS & SETTINGS
   ================================================================= */

// Shortcuts for finding elements
const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => Array.from(parent.querySelectorAll(selector));

// Does the visitor prefer less motion? (a setting in their OS)
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Is there a real mouse? (false on phones/tablets — we skip hover-only effects there)
const hasMouse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

// Layer where hearts/sparkles are added
const fxLayer = $("#fxLayer");

const random = (min, max) => Math.random() * (max - min) + min;
const randomItem = (list) => list[Math.floor(Math.random() * list.length)];

// Makes text safe to put inside HTML (so a "<" in your data can't break the page)
function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[char]));
}

// "2025-03-14" → "March 14, 2025",  "2024-08" → "August 2024",
// anything else (like "Summer 2024") is shown exactly as typed.
function formatDate(value) {
  const match = /^(\d{4})-(\d{1,2})(?:-(\d{1,2}))?$/.exec(String(value || "").trim());
  if (!match) return value || "";
  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day || 1));
  const options = day
    ? { year: "numeric", month: "long", day: "numeric" }
    : { year: "numeric", month: "long" };
  return date.toLocaleDateString("en-US", options);
}

// Check that data.js loaded correctly (a missing comma or quote stops it from loading)
const dataLoaded =
  typeof PROFILE !== "undefined" &&
  typeof SOCIALS !== "undefined" &&
  typeof ACHIEVEMENTS !== "undefined" &&
  typeof SKILLS !== "undefined" &&
  typeof PROJECTS !== "undefined";

function showDataError() {
  const box = document.createElement("div");
  box.className = "data-error";
  box.innerHTML =
    "<strong>Could not read js/data.js.</strong><br>" +
    "There is probably a missing comma, quote, or bracket. Press <kbd>F12</kbd> → <em>Console</em> " +
    "to see which line has the problem.";
  document.body.prepend(box);
}


/* =================================================================
   1. DARK MODE TOGGLE
   The saved theme is applied early by a small script in <head>.
   This just handles clicking the moon/sun button.
   ================================================================= */
function initThemeToggle() {
  const root = document.documentElement;
  const button = $("#themeToggle");

  function updateLabel() {
    const isDark = root.dataset.theme === "dark";
    button.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  }

  button.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);   // remember for next visit
    } catch (error) {
      /* localStorage can be blocked in private mode — that's okay */
    }
    updateLabel();
  });

  updateLabel();
}


/* =================================================================
   2. LOADING SCREEN
   Fades out once the page has loaded (shown for at least ~1 second
   so the bouncing heart can be seen).
   ================================================================= */
function initLoader() {
  const loader = $("#loader");
  let hidden = false;

  function hideLoader() {
    if (hidden) return;
    hidden = true;
    loader.classList.add("is-hidden");
    document.body.classList.remove("is-loading");   // lets the reveal animations play
    setTimeout(() => loader.remove(), 700);
  }

  const minimumTime = reduceMotion ? 0 : 500;
  const whenLoaded = () => {
    const waitMore = Math.max(0, minimumTime - performance.now());
    setTimeout(hideLoader, waitMore);
  };

  if (document.readyState === "complete") whenLoaded();
  else window.addEventListener("load", whenLoaded, { once: true });

  // Safety net: never keep the loader up longer than 4 seconds (slow internet)
  setTimeout(hideLoader, 4000);
}


/* =================================================================
   3. PROFILE INFO
   Any element with data-profile="name" gets PROFILE.name, etc.
   ================================================================= */
function renderProfile() {
  $$("[data-profile]").forEach((el) => {
    const key = el.dataset.profile;
    if (!PROFILE[key]) return;
    el.textContent = PROFILE[key];
    if (key === "email" && el.tagName === "A") el.href = `mailto:${PROFILE.email}`;
  });

  const photo = $("#profilePhoto");
  photo.src = PROFILE.photo;
  photo.alt = `Photo of ${PROFILE.name}`;

  // About Me photo (only changed if aboutPhoto is set in data.js)
  const aboutPhoto = $("#aboutPhoto");
  if (aboutPhoto && PROFILE.aboutPhoto) {
    aboutPhoto.src = PROFILE.aboutPhoto;
    aboutPhoto.alt = `Photo of ${PROFILE.name}`;
  }

  // Bio paragraphs
  $("#aboutBio").innerHTML = (PROFILE.bio || [])
    .map((paragraph) => `<p>${escapeHTML(paragraph)}</p>`)
    .join("");

  // Fun fact pills
  $("#funFacts").innerHTML = (PROFILE.funFacts || [])
    .map((fact) => `<li class="pill">${escapeHTML(fact)}</li>`)
    .join("");

  // For screen readers: list the typing roles as normal text
  $("#rolesText").textContent = (PROFILE.roles || []).join(", ");

  document.title = `${PROFILE.name} | Portfolio`;
}


/* =================================================================
   4. SOCIAL LINKS
   ================================================================= */

// Simple outline icons (from the free "Feather" icon set)
const ICONS = {
  email: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
  github: '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>',
  linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
  facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
  instagram: '<rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>',
  website: '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
};

function renderSocials() {
  $("#socials").innerHTML = SOCIALS.map((social) => {
    const icon = ICONS[social.icon] || ICONS.website;
    const isMail = String(social.url).startsWith("mailto:");
    const newTab = isMail ? "" : 'target="_blank" rel="noopener noreferrer"';
    return `
      <a class="social-link" href="${escapeHTML(social.url)}" ${newTab}
         aria-label="${escapeHTML(social.name)}" data-label="${escapeHTML(social.name)}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
             stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icon}</svg>
      </a>`;
  }).join("");
}


/* =================================================================
   5. ACHIEVEMENTS — cards, category filters, and the modal
   ================================================================= */

// The categories (each one gets a filter button) and their emoji.
// To add a category, add a line here, e.g.  Organization: { emoji: "🤝" },
const CATEGORY_STYLE = {
  Competition:  { emoji: "" },
  Certificate:  { emoji: "" },
};

const FALLBACK_CATEGORY = "Other";
const FALLBACK_STYLE = { emoji: "" };

function categoryOf(achievement) {
  return CATEGORY_STYLE[achievement.category] ? achievement.category : FALLBACK_CATEGORY;
}

function emojiOf(category) {
  return (CATEGORY_STYLE[category] || FALLBACK_STYLE).emoji;
}

function renderAchievementFilters() {
  const container = $("#achievementFilters");
  const categories = ["All", ...Object.keys(CATEGORY_STYLE)];

  container.innerHTML = categories.map((category) => {
    const count = category === "All"
      ? ACHIEVEMENTS.length
      : ACHIEVEMENTS.filter((a) => categoryOf(a) === category).length;
      const isActive = category === "All";
      return `
      <button class="filter-btn ${isActive ? "is-active" : ""}" type="button"
              data-filter="${category}" aria-pressed="${isActive}">
        ${category}
        <span class="filter-btn__count">${count}</span>
      </button>`;
  }).join("");

  // One click listener for all the buttons ("event delegation")
  container.addEventListener("click", (event) => {
    const button = event.target.closest(".filter-btn");
    if (!button) return;
    $$(".filter-btn", container).forEach((btn) => {
      const active = btn === button;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active);
    });
    renderAchievements(button.dataset.filter);
  });
}

function renderAchievements(filter = "All") {
  const grid = $("#achievementGrid");

  // Keep each achievement's original position so the modal can find it
  const visible = ACHIEVEMENTS
    .map((achievement, index) => ({ ...achievement, index }))
    .filter((a) => filter === "All" || categoryOf(a) === filter);

  grid.innerHTML = visible.map((a, i) => {
    const category = categoryOf(a);
    const emoji = emojiOf(category);
    const image = a.image
      ? `<img src="${escapeHTML(a.image)}" alt="" loading="lazy">`
      : "";
    const photoCount = getPhotos(a).length;
    const photoBadge = photoCount > 1
      ? `<span class="ach-card__photos" aria-label="${photoCount} photos">${photoCount} photos</span>`
      : "";
    return `
      <article class="glow-card ach-card reveal" tabindex="0" role="button"
               data-index="${a.index}" style="--delay: ${i * 90}ms"
               aria-label="View details: ${escapeHTML(a.title)}">
        <div class="card-media ${a.image ? "" : "no-image"}" data-emoji="${emoji}">
          ${image}
          <span class="ach-card__badge">${category}</span>
          ${photoBadge}
        </div>
        <div class="card-body">
          <time class="ach-card__date">${escapeHTML(formatDate(a.date))}</time>
          <h3 class="card-title">${escapeHTML(a.title)}</h3>
          <p class="card-desc">${escapeHTML(a.description)}</p>
          <span class="ach-card__more">View details <span>→</span></span>
        </div>
      </article>`;
  }).join("");

  $("#achievementEmpty").hidden = visible.length > 0;

  handleBrokenImages(grid);
  observeReveal($$(".reveal", grid));
  $$(".glow-card", grid).forEach(addTilt);
}

// If an image path is wrong, show the emoji placeholder instead of a broken icon
function handleBrokenImages(container) {
  $$(".card-media img", container).forEach((img) => {
    img.addEventListener("error", () => {
      img.parentElement.classList.add("no-image");
      img.remove();
    });
  });
}

// All pictures of an achievement: the main image + any extra "gallery" images
function getPhotos(achievement) {
  return [achievement.image, ...(achievement.gallery || [])].filter(Boolean);
}

/* ---------- Modal (lightbox) ---------- */
let lastFocused = null;

function openModal(index) {
  const a = ACHIEVEMENTS[index];
  if (!a) return;
  openLightbox({
    title: a.title,
    description: a.description,
    photos: getPhotos(a),
    category: categoryOf(a),
    meta: formatDate(a.date),
    placeholder: emojiOf(categoryOf(a)),
  });
}

function openProjectLightbox(index) {
  const project = PROJECTS[index];
  if (!project) return;
  openLightbox({
    title: project.title,
    description: project.description,
    photos: getPhotos(project),
    category: "Project",
    meta: (project.tags || []).join(" · "),
    placeholder: "Project",
  });
}

function openLightbox({ title, description, photos, category, meta, placeholder }) {
  const modal = $("#achievementModal");
  const media = $("#modalMedia");
  const emoji = placeholder || "";

  // Thumbnails (only when there's more than one picture)
  const thumbs = photos.length > 1
    ? `<div class="modal__thumbs">${photos.map((src, i) => `
        <button class="modal__thumb ${i === 0 ? "is-active" : ""}" type="button"
                data-src="${escapeHTML(src)}" aria-label="Show photo ${i + 1} of ${photos.length}">
          <img src="${escapeHTML(src)}" alt="">
        </button>`).join("")}</div>`
    : "";

  media.innerHTML = photos.length
    ? `<img class="modal__image" src="${escapeHTML(photos[0])}" alt="${escapeHTML(title)}">${thumbs}`
    : `<div class="modal__placeholder" aria-hidden="true">${emoji}</div>`;

  const modalImg = $(".modal__image", media);
  if (modalImg) {
    modalImg.addEventListener("error", () => {
      media.innerHTML = `<div class="modal__placeholder" aria-hidden="true">${emoji}</div>`;
    });
  }

  $("#modalCategory").textContent = category;
  $("#modalDate").textContent = meta || "";
  $("#modalTitle").textContent = title;
  $("#modalDesc").textContent = description;

  // "Open full size" link under the description when there's an image
  const oldLink = $(".modal__link", modal);
  if (oldLink) oldLink.remove();
  if (photos.length) {
    const link = document.createElement("a");
    link.className = "modal__link";
    link.href = photos[0];
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = "Open full-size image";
    $(".modal__body", modal).appendChild(link);
  }

  // Clicking a thumbnail swaps the big picture (and the full-size link)
  $$(".modal__thumb", media).forEach((thumb) => {
    thumb.addEventListener("click", () => {
      modalImg.src = thumb.dataset.src;
      $(".modal__link", modal).href = thumb.dataset.src;
      $$(".modal__thumb", media).forEach((t) => t.classList.toggle("is-active", t === thumb));
    });
  });

  lastFocused = document.activeElement;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
  $(".modal__close", modal).focus();
}

function closeModal() {
  const modal = $("#achievementModal");
  if (!modal.classList.contains("is-open")) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
  if (lastFocused) lastFocused.focus();   // put keyboard focus back on the card
}

function initModal() {
  const grid = $("#achievementGrid");
  const modal = $("#achievementModal");

  // Open on click, or Enter / Space for keyboard users
  grid.addEventListener("click", (event) => {
    const card = event.target.closest(".ach-card");
    if (card) openModal(Number(card.dataset.index));
  });
  grid.addEventListener("keydown", (event) => {
    const card = event.target.closest(".ach-card");
    if (card && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      openModal(Number(card.dataset.index));
    }
  });

  const projectGrid = $("#projectGrid");
  projectGrid.addEventListener("click", (event) => {
    if (event.target.closest("a")) return;
    const card = event.target.closest(".project-card");
    if (card) openProjectLightbox(Number(card.dataset.projectIndex));
  });
  projectGrid.addEventListener("keydown", (event) => {
    if (event.target.closest("a")) return;
    const card = event.target.closest(".project-card");
    if (card && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      openProjectLightbox(Number(card.dataset.projectIndex));
    }
  });

  // Close with the X button, by clicking the dark backdrop, or with Escape
  modal.addEventListener("click", (event) => {
    if (event.target.closest("[data-close-modal]")) closeModal();
  });

  document.addEventListener("keydown", (event) => {
    if (!modal.classList.contains("is-open")) return;
    if (event.key === "Escape") closeModal();

    // Keep Tab inside the modal while it's open
    if (event.key === "Tab") {
      const focusable = $$("button, a[href]", modal);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
}


/* =================================================================
   6. SKILLS — arch-shaped cards; the dark bar at the bottom of each
   card fills up to the skill level when it scrolls into view
   ================================================================= */
const clampLevel = (level) => Math.max(0, Math.min(100, Number(level) || 0));

function skillCardHTML(skill, i) {
  const level = clampLevel(skill.level);
  return `
    <article class="skill-card reveal" data-level="${level}" style="--delay: ${i * 90}ms">
      <div class="skill-card__inner">
        <h4 class="skill-card__name">${escapeHTML(skill.name)}</h4>
        <p class="skill-card__desc">${escapeHTML(skill.description || "")}</p>
      </div>
      <div class="skill-card__bar" role="progressbar" aria-label="${escapeHTML(skill.name)} level"
           aria-valuemin="0" aria-valuemax="100" aria-valuenow="${level}">
        <span class="skill-card__fill"></span>
      </div>
    </article>`;
}

function renderSkills() {
  $("#techSkills").innerHTML = (SKILLS.technical || []).map(skillCardHTML).join("");
  $("#softSkills").innerHTML = (SKILLS.soft || []).map(skillCardHTML).join("");

  observeReveal($$(".skill-card"));

  // Fill each card's bar when it scrolls into view, empty it when it leaves
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio >= 0.5) animateSkill(entry.target);
      else if (!entry.isIntersecting) resetSkill(entry.target);
    });
  }, { threshold: [0, 0.5] });

  $$(".skill-card").forEach((el) => skillObserver.observe(el));
}

function animateSkill(card) {
  $(".skill-card__fill", card).style.width = `${card.dataset.level}%`;
}

function resetSkill(card) {
  $(".skill-card__fill", card).style.width = "0%";
}


/* =================================================================
   7. PROJECTS
   ================================================================= */
function renderProjects() {
  const grid = $("#projectGrid");

  grid.innerHTML = PROJECTS.map((project, i) => {
    const tags = (project.tags || [])
      .map((tag) => `<li class="tag">${escapeHTML(tag)}</li>`)
      .join("");
    // "View project" button only appears when the project has a link
    const button = project.link
      ? `<a class="btn btn--primary btn--small" href="${escapeHTML(project.link)}"
            target="_blank" rel="noopener noreferrer">View project</a>`
      : "";
    const photoCount = getPhotos(project).length;
    const photoBadge = photoCount > 1
      ? `<span class="ach-card__photos" aria-label="${photoCount} screenshots">${photoCount} photos</span>`
      : "";
    return `
      <article class="glow-card project-card reveal" tabindex="0" role="button"
               data-project-index="${i}" style="--delay: ${i * 110}ms"
               aria-label="View screenshots: ${escapeHTML(project.title)}">
        <div class="card-media">
          <img src="${escapeHTML(project.image)}" alt="Screenshot of ${escapeHTML(project.title)}" loading="lazy"
               ${project.coverPosition ? `style="object-position: ${escapeHTML(project.coverPosition)}"` : ""}>
          ${photoBadge}
        </div>
        <div class="card-body">
          <h3 class="card-title">${escapeHTML(project.title)}</h3>
          <p class="card-desc">${escapeHTML(project.description)}</p>
          <ul class="tags" aria-label="Technologies used">${tags}</ul>
          ${button}
        </div>
      </article>`;
  }).join("");

  handleBrokenImages(grid);
  observeReveal($$(".reveal", grid));
  $$(".glow-card", grid).forEach(addTilt);
}


/* =================================================================
   8. NAVBAR — hamburger menu + highlight the current section
   ================================================================= */
function initNavbar() {
  const toggle = $("#menuToggle");
  const links = $("#navLinks");

  function setMenu(open) {
    links.classList.toggle("is-open", open);
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open);
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  toggle.addEventListener("click", () => setMenu(!links.classList.contains("is-open")));

  // Close the menu after tapping a link, tapping outside, or pressing Escape
  $$(".nav__link", links).forEach((link) => link.addEventListener("click", () => setMenu(false)));
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".nav")) setMenu(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenu(false);
  });

  // Underline the nav link of the section currently in the middle of the screen
  const navLinks = $$(".nav__link");
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: "-45% 0px -50% 0px" });

  $$("main section[id]").forEach((section) => sectionObserver.observe(section));
}

/* ---------- Nav click animations ----------
   1. The clicked link "pops" and its underline sweeps in.
   2. When the page finishes scrolling, the section you jumped to
      plays an entrance animation (see "Nav click animations" in style.css). */
function initNavAnimations() {
  if (reduceMotion) return;

  $$(".nav__link, .nav__logo").forEach((link) => {
    link.addEventListener("click", () => {
      if (link.classList.contains("nav__link")) replayClass(link, "is-clicked");

      const target = document.querySelector(link.getAttribute("href"));
      if (target) whenScrollStops(() => replayClass(target, "section-arrive"));
    });
  });
}

// Removes and re-adds a class so its CSS animation plays again from the start
function replayClass(el, className) {
  el.classList.remove(className);
  void el.offsetWidth;   // forces the browser to notice the removal
  el.classList.add(className);
}

// Runs callback once the smooth scroll has finished
// (or right away if the page didn't need to scroll at all)
function whenScrollStops(callback) {
  let done = false;
  let scrolled = false;
  let fallback = null;

  function finish() {
    if (done) return;
    done = true;
    clearTimeout(fallback);
    window.removeEventListener("scrollend", finish);
    callback();
  }

  window.addEventListener("scroll", () => { scrolled = true; }, { once: true, passive: true });
  window.addEventListener("scrollend", finish, { once: true });
  setTimeout(() => { if (!scrolled) finish(); }, 120);   // already at that section
  fallback = setTimeout(finish, 1200);                   // browsers without "scrollend"
}


/* =================================================================
   9. SCROLL PROGRESS BAR & BACK-TO-TOP
   Uses requestAnimationFrame so we update at most once per frame.
   ================================================================= */
function initScrollEffects() {
  const progressBar = $("#scrollProgress");
  const navbar = $("#navbar");
  const backToTop = $("#backToTop");
  let ticking = false;

  function update() {
    const scrollTop = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? scrollTop / maxScroll : 0;

    progressBar.style.transform = `scaleX(${progress})`;
    navbar.classList.toggle("is-scrolled", scrollTop > 10);
    backToTop.classList.toggle("is-visible", scrollTop > 500);
    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  update();

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });
}


/* =================================================================
   10. TYPING ANIMATION — types and deletes each role in PROFILE.roles
   ================================================================= */
function initTyping() {
  const el = $("#typing");
  const roles = PROFILE.roles && PROFILE.roles.length ? PROFILE.roles : ["Welcome!"];
  let roleIndex = 0;

  // Reduced motion: just swap the words every few seconds, no typing
  if (reduceMotion) {
    el.textContent = roles[0];
    setInterval(() => {
      roleIndex = (roleIndex + 1) % roles.length;
      el.textContent = roles[roleIndex];
    }, 3000);
    return;
  }

  let charIndex = 0;
  let deleting = false;

  function tick() {
    // Array.from splits emojis correctly (they're 2 "characters" in JS)
    const letters = Array.from(roles[roleIndex]);

    if (!deleting) {
      charIndex++;
      el.textContent = letters.slice(0, charIndex).join("");
      if (charIndex === letters.length) {
        deleting = true;
        setTimeout(tick, 1800);           // pause on the full word
        return;
      }
      setTimeout(tick, 85);               // typing speed
    } else {
      charIndex--;
      el.textContent = letters.slice(0, charIndex).join("");
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(tick, 400);            // short pause before the next word
        return;
      }
      setTimeout(tick, 40);               // deleting speed
    }
  }

  setTimeout(tick, 900);
}


/* =================================================================
   11. HERO BUBBLES — floating bubbles & hearts (pure CSS animation)
   ================================================================= */
function initHeroBubbles() {
  /* Decorative bubbles are disabled for a calmer layout. */
}


/* =================================================================
   12. SCROLL REVEAL — adds .is-visible when an element scrolls into view
   (the CSS then plays a fade/slide animation)
   ================================================================= */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("is-visible");
  });
}, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

// Reset once an element is fully off-screen, so it animates again next time.
// (A separate observer with no margin, so the slide-in can't flicker it off.)
const hideObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) entry.target.classList.remove("is-visible");
  });
});

function observeReveal(elements) {
  elements.forEach((el) => {
    revealObserver.observe(el);
    hideObserver.observe(el);
  });
}


/* =================================================================
   13. CARD TILT — cards lean toward the mouse (desktop only)
   ================================================================= */
function addTilt(card) {
  if (!hasMouse || reduceMotion) return;
  const maxTilt = 2;

  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;   // -0.5 (left) → 0.5 (right)
    const y = (event.clientY - rect.top) / rect.height - 0.5;   // -0.5 (top)  → 0.5 (bottom)
    card.style.setProperty("--ry", `${(x * maxTilt * 2).toFixed(2)}deg`);
    card.style.setProperty("--rx", `${(-y * maxTilt * 2).toFixed(2)}deg`);
  });

  card.addEventListener("pointerleave", () => {
    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");
  });
}


/* =================================================================
   14. BUTTON RIPPLE — a circle grows from where you clicked
   ================================================================= */
function initRipple() {
  document.addEventListener("click", (event) => {
    const button = event.target.closest(".btn, .filter-btn, .icon-btn");
    if (!button || button.classList.contains("btn--disabled")) return;

    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    // Keyboard "clicks" have no mouse position → start from the center
    const x = event.detail === 0 ? rect.width / 2 : event.clientX - rect.left;
    const y = event.detail === 0 ? rect.height / 2 : event.clientY - rect.top;

    const ripple = document.createElement("span");
    ripple.className = "ripple";
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x - size / 2}px`;
    ripple.style.top = `${y - size / 2}px`;
    button.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove());
  });
}


/* =================================================================
   15. CLICK SPLASH — hearts & sparkles burst out wherever you click
   ================================================================= */
const PARTICLE_SYMBOLS = ["♥", "✦", "✧", "♥", "★"];
const PARTICLE_COLORS = ["#FF8FC7", "#F25CA2", "#B388FF", "#7C4DFF", "#FFB3D9"];

function createBurst(x, y, count = 10) {
  for (let i = 0; i < count; i++) {
    const particle = document.createElement("span");
    particle.className = "particle particle--burst";
    particle.textContent = randomItem(PARTICLE_SYMBOLS);

    // Spread the particles evenly in a circle, with a little randomness
    const angle = (Math.PI * 2 * i) / count + random(-0.3, 0.3);
    const distance = random(40, 85);
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.color = randomItem(PARTICLE_COLORS);
    particle.style.fontSize = `${random(10, 20)}px`;
    particle.style.setProperty("--tx", `${Math.cos(angle) * distance}px`);
    particle.style.setProperty("--ty", `${Math.sin(angle) * distance}px`);
    particle.style.setProperty("--rot", `${random(-180, 180)}deg`);

    fxLayer.appendChild(particle);
    particle.addEventListener("animationend", () => particle.remove());
  }
}

function initClickSplash() {
  /* Click particles are disabled. */
}


/* =================================================================
   16. CURSOR SPARKLE TRAIL — tiny stars & hearts follow the mouse
   (turned off on touch devices and for reduced motion)
   ================================================================= */
function initCursorTrail() {
  /* Cursor trail is disabled. */
}


/* =================================================================
   17. CONTACT FORM + TOAST
   Frontend only: the message isn't really emailed anywhere.
   (See README.md for how to connect a free service like Formspree.)
   ================================================================= */
let toastTimer;

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 3500);
}

function initContactForm() {
  const form = $("#contactForm");
  const button = $("button[type='submit']", form);

  // "submit" only fires once all required fields are filled in correctly
  form.addEventListener("submit", (event) => {
    event.preventDefault();   // stop the page from reloading

    const name = form.elements.name.value.trim();
    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = "Sending…";

    setTimeout(() => {
      showToast(`Thank you, ${name || "there"}. Your message has been recorded.`);
      form.reset();
      button.disabled = false;
      button.textContent = originalText;
    }, 900);
  });
}


/* =================================================================
   18. START EVERYTHING!
   ================================================================= */
initThemeToggle();
initNavbar();
initNavAnimations();
initScrollEffects();
initRipple();
initClickSplash();
initCursorTrail();
initHeroBubbles();
initContactForm();

if (dataLoaded) {
  renderProfile();
  renderSocials();
  renderAchievementFilters();
  renderAchievements();
  initModal();
  renderSkills();
  renderProjects();
  initTyping();
} else {
  showDataError();
}

observeReveal($$(".reveal"));   // reveal all the static sections too
initLoader();
