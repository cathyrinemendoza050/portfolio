# 💜 Cathyrine's Cute Portfolio

A pastel pink-and-purple personal portfolio made with plain **HTML, CSS, and JavaScript**. It doesn't use any frameworks and needs no installation.

## ▶️ How to open it

Double-click **`index.html`**. It opens in your browser.

> The fonts (Fredoka & Quicksand) load from Google Fonts, so they only show when you're online. Offline, the site still works but uses a normal font.

**Tip:** In VS Code, install the **Live Server** extension, right-click `index.html`, and choose **"Open with Live Server"**. The page then refreshes by itself every time you save.

---

## 📁 Files

```
Website/
├── index.html          ← page structure (sections, navbar, footer)
├── css/style.css       ← all colors, layout, and animations
├── js/data.js          ← ⭐ YOUR CONTENT (name, achievements, skills, projects)
├── js/main.js          ← effects & interactions (you usually don't need to edit this)
├── assets/images/      ← your photo, certificates, and project screenshots
└── README.md           ← this guide
```

**Most of your editing happens in `js/data.js`.**

---

## ✏️ How to edit your info

### 1. Your name, tagline, course, school, and email
Open **`js/data.js`** and edit the `PROFILE` section at the top:

```js
const PROFILE = {
  name: "Cathyrine R. Mendoza",
  firstName: "Cathyrine",
  tagline: "Aspiring web developer who loves cute designs ✨",
  course: "BS Computer Science, 4th Year",
  school: "Biliran Province State University",
  email: "cathyrinemendoza553@gmail.com",
  ...
```

The page updates your name everywhere: the navbar logo, hero, footer, and browser tab.

- **`roles`** are the 3 phrases the typing animation cycles through.
- **`bio`** holds your About Me paragraphs.
- **`funFacts`** are the pill badges.

### 2. Your photo
1. Copy your photo into **`assets/images/`**, for example `assets/images/me.jpg`.
2. In `js/data.js`, change:
   ```js
   photo: "assets/images/me.jpg",
   ```
A **square** photo looks best because it's cropped into a circle.

### 3. Add an achievement 🏆
1. Put the certificate photo or scan in **`assets/images/`**, for example `assets/images/quiz-bee.jpg`.
2. In `js/data.js`, find the line `// ADD NEW ACHIEVEMENTS HERE`.
3. Copy one whole block from `{` to `},`, paste it right under that line, and edit it:

```js
  {
    title: "Champion — Regional Quiz Bee",
    date: "2025-09-12",
    category: "Competition",
    description: "Represented our university and won first place!",
    image: "assets/images/quiz-bee.jpg",
  },
```

| Field | What to put |
|---|---|
| `title` | Name of the award |
| `date` | `"YYYY-MM-DD"` or `"YYYY-MM"`. It shows as "September 12, 2025". Any other text, like `"Summer 2024"`, is shown exactly as typed. |
| `category` | One of: `"Competition"`, `"Certificate"` (to add more, see `CATEGORY_STYLE` in `js/main.js`) |
| `description` | A sentence or two |
| `image` | Path to the picture, or `""` if you don't have one (a cute emoji appears instead) |
| `gallery` | *Optional.* Extra pictures of the same achievement, e.g. `["assets/images/photo-2.jpg"]`. They appear as clickable thumbnails in the pop-up. |

Achievements show in the same order as the list, so put the newest at the top. **Delete the 4 sample achievements** once you've added your real ones.

### 4. Skills
Edit `SKILLS` in `js/data.js`. `level` is a number from 0 to 100.
- `technical` skills appear as **progress bars**.
- `soft` skills appear as **circular rings**.

### 5. Projects
Edit `PROJECTS` in `js/data.js`. Put screenshots in `assets/images/`. Set `link: ""` if the project isn't online yet, and the card won't show a button. Add a link later and a "View project" button appears.

### 6. Social links
Edit `SOCIALS` in `js/data.js`. Replace `your-username` with your real usernames, and delete any lines you don't use.
Available icons: `email`, `github`, `linkedin`, `facebook`, `instagram`, `website`.

### 7. Colors
All colors are CSS variables at the top of **`css/style.css`** (`--pink`, `--purple`, and so on). If you change one there, it changes everywhere. Dark-mode colors are in the `[data-theme="dark"]` block right below.

---

## 🆘 Something broke?

- **A pink "Oops! js/data.js couldn't be read" box appears.** There's a typo in `data.js`. Usually it's a missing comma `,` after a `}` or a missing quote `"`. Press **F12 → Console** to see the line number.
- **An image doesn't show.** Check that the file name in `data.js` matches the real file exactly, including capital letters and the extension (`.jpg`, `.png`, `.jpeg`).
- **The page shows old content.** Press **Ctrl + F5** to hard-refresh.

---

## ✨ What each effect is (for your presentation)

| Effect | Where in the code | How it works |
|---|---|---|
| Loading screen | `main.js` §2, `style.css` §4 | Fades out on the `load` event |
| Typing animation | `main.js` §10 | `setTimeout` loop that adds and removes letters |
| Rotating photo ring | `style.css` §6 | `conic-gradient` + CSS `spin` animation, plus a blurred copy for the glow |
| Scroll reveal | `main.js` §12 | `IntersectionObserver` adds `.is-visible`, which plays a CSS animation |
| Skill bars & rings | `main.js` §6 | `IntersectionObserver` sets the width / `stroke-dashoffset`, and `requestAnimationFrame` counts the % up |
| Achievement filters & modal | `main.js` §5 | Cards are built from the `ACHIEVEMENTS` array; filtering re-renders the list |
| Click hearts & cursor sparkles | `main.js` §15–16 | Small `<span>`s get CSS animations and are removed on `animationend` |
| Card tilt | `main.js` §13 | Mouse position sets the `--rx`/`--ry` CSS variables used in `transform` |
| Button ripple | `main.js` §14 | A growing circle `<span>` is added at the click point |
| Scroll progress bar | `main.js` §9 | `scaleX(scrolled ÷ total)`, updated once per frame with `requestAnimationFrame` |
| Dark mode | `main.js` §1, `style.css` §1 | Toggles `data-theme="dark"` on `<html>` and saves it in `localStorage` |
| Reduced motion | `style.css` §17, `main.js` §0 | Respects the OS setting `prefers-reduced-motion` and turns off heavy animation |

---

## 📬 Contact form messages

The contact form sends messages through [Formspree](https://formspree.io). To read them, log in at formspree.io and open the form; each message is also emailed to the address on the Formspree account.

The form's address is the `action="https://formspree.io/f/..."` on `<form id="contactForm">` in `index.html`. To use a different Formspree form, change the ID at the end of that URL.
