/* =================================================================
   data.js — ALL YOUR EDITABLE CONTENT LIVES HERE 💜

   This file holds the content for the website (your name, bio,
   achievements, skills, projects, and social links). main.js reads
   these lists and builds the cards on the page automatically, so you
   almost never need to touch index.html.

   ⚠️ Tips so nothing breaks:
   • Keep the quotes "..." around text.
   • Put a comma , after every } in a list (except the last one is optional).
   • If the page suddenly looks empty, you probably forgot a comma or a quote.
     A pink warning box will appear at the top of the page if that happens.
     Press F12 → Console in your browser to see the exact line.
   ================================================================= */


/* -----------------------------------------------------------------
   1) PROFILE — your name, photo, roles, and About Me info
   ----------------------------------------------------------------- */
const PROFILE = {
  name: "Cathyrine R. Mendoza",
  firstName: "Cathyrine",              // used for the logo in the navbar

  // Your photo. Put your picture in assets/images/ and change the file name here.
  // Example: "assets/images/me.jpg"
  photo: "assets/images/profile.jpg",

  // The picture shown in the About Me section
  aboutPhoto: "assets/images/about.jpg",

  // The typing animation in the hero cycles through these (keep 3 or more)
  roles: [
    "Aspiring Web Developer",
    "Computer Science Student",
    "UI Designer",
  ],

  tagline: "I like ideas that turn imagination into reality, creativity into possibilities, and dreams into something meaningful. I believe that every great achievement starts with a simple idea, a little courage, and the willingness to learn.",
  course: "BS Computer Science, 4th Year",
  school: "Biliran Province State University",
  email: "cathyrinemendoza553@gmail.com",

  // About Me paragraphs: each "..." becomes its own paragraph
  bio: [
    "Hi! I'm Cathyrine R. Mendoza, a fourth-year Bachelor of Science in Computer Science student at Biliran Province State University. I love reading books and listening to music because they help me relax and enjoy my free time. I also enjoy designing using Canva and Figma, where I can express my creativity by creating visual content, exploring different layouts, and bringing ideas to life. Although coding is not really my favorite thing to do, I'm willing to learn more about it and improve my skills as I continue my journey in Computer Science.",

    "I'm also interested in exploring new things, discovering new ideas, and learning from different experiences. I believe that learning is a continuous process, and I'm always open to improving myself, especially in areas where I still need to grow. As I continue my studies, I hope to gain more knowledge, develop my abilities, and become more confident in facing new challenges.",
  ],

  // Fun facts: these show up as cute pill badges
  funFacts: [
    "Music",
    "Quiet, focused work",
    "Continuous learning",
    "Nighttime reading",
    "Self-directed improvement",
    "I love designing",
  ],
};


/* -----------------------------------------------------------------
   2) SOCIAL LINKS (shown in the Contact section)
   icon can be: "email", "github", "linkedin", "facebook", "instagram", "website"
   Delete any line you don't need.
   ----------------------------------------------------------------- */
const SOCIALS = [
  { name: "Email",    icon: "email",    url: "mailto:cathyrinemendoza553@gmail.com" },
  { name: "GitHub",   icon: "github",   url: "https://github.com/your-username" },
  { name: "LinkedIn", icon: "linkedin", url: "https://www.linkedin.com/in/your-username" },
  { name: "Facebook", icon: "facebook", url: "https://www.facebook.com/your-username" },
];


/* -----------------------------------------------------------------
   3) ACHIEVEMENTS 🏆 (the most important part!)

   Each achievement is one { ... } block with these fields:
     title       → name of the award / certificate          (required)
     date        → "YYYY-MM-DD" (e.g. "2025-03-14") or "YYYY-MM"
                   Anything else (like "Summer 2024") is shown as-is.
     category    → must be ONE of these exact words:
                   "Competition", "Certificate"
     description → a sentence or two about it
     image       → path to a picture, e.g. "assets/images/my-cert.jpg"
                   Optional! Use "" (empty) if you have no picture and
                   a cute emoji will be shown instead.
     gallery     → OPTIONAL list of extra pictures for the same achievement,
                   e.g. ["assets/images/photo-2.jpg", "assets/images/photo-3.jpg"]
                   They show as clickable thumbnails in the pop-up.
                   Leave it out if you only have one picture.

   Achievements appear on the page in the same order as this list,
   so put your newest one at the top.
   ----------------------------------------------------------------- */
const ACHIEVEMENTS = [

  // ADD NEW ACHIEVEMENTS HERE — copy one block (from { to },) and edit it
  {
    title: "Introduction to AI Literacy and Responsible Use",
    date: "2026-09-14",
    category: "Certificate",
    description: "Completed the micro-credentials course \"Introduction to AI Literacy and Responsible Use\" by Mapúa University in collaboration with Arizona State University, under CHED's ACHIEVE program.",
    image: "assets/images/cert-ai-literacy.png",
  },
  {
    title: "Networking Basics — Cisco Networking Academy",
    date: "2026-05-15",
    category: "Certificate",
    description: "Completed the Networking Basics course through the Cisco Networking Academy and earned a verified student-level credential. Topics included network communication, IPv4 and IPv6 addressing, how routers connect networks, troubleshooting connectivity, and setting up a secure wireless router.",
    image: "assets/images/cert-cisco-networking-basics.png",
    gallery: ["assets/images/cert-cisco-networking-basics-credential.png"],
  },
  {
    title: "Integrated OS — Be More Digi-TALINO Webinar",
    date: "2025-09-05",
    category: "Certificate",
    description: "Participated in the webinar \"Integrated OS – Be More Digi-TALINO\" by Integrated Office Solutions, Inc. via Zoom. The session focused on digital literacy: productivity apps, digital communication, smart research, and data safety and security.",
    image: "assets/images/cert-integrated-os-digitalino.jpg",
  },
  {
    title: "Most Informative Video — STS Environmental Awareness Video Showing",
    date: "2025-05-02",
    category: "Competition",
    description: "Received a Certificate of Recognition for Most Informative Video at \"Pagpakabana ha Kinaiyahan: A Science, Technology, and Society Environmental Awareness Video Showing\" held at the CSS Laboratory, Biliran Province State University.\nTheme: \"Promoting Environmental Awareness, Understanding Social Impact, and Fostering Sustainable Action.\"",
    image: "assets/images/award-most-informative-video.jpg",
    gallery: ["assets/images/award-most-informative-video-group.jpg"],
  },
  {
    title: "The Basics of Power BI Webinar",
    date: "2024-11-26",
    category: "Certificate",
    description: "Attended Koenig's webinar on The Basics of Power BI and received a Confirmation of Participation.",
    image: "assets/images/cert-power-bi-basics.jpg",
  },

];


/* -----------------------------------------------------------------
   4) SKILLS 💪
   Each skill is shown as an arch-shaped card.
     name        → the skill (shown in capital letters)
     description → one short sentence about it
     level       → a number from 0 to 100; the dark bar at the bottom
                   of the card fills up to this amount
   summary → the sentence shown under all the cards
   ----------------------------------------------------------------- */
const SKILLS = {
  technical: [
    // ADD NEW TECHNICAL SKILLS HERE — copy one line and edit it
    { name: "HTML",       level: 90, description: "I structure web pages with clean, meaningful markup." },
    { name: "CSS",        level: 85, description: "I style layouts that look good and adapt to any screen size." },
    { name: "JavaScript", level: 75, description: "I add interactivity and simple logic to make pages feel alive." },
    { name: "Python",     level: 70, description: "I use Python for programming tasks and machine learning projects." },
    { name: "Java",       level: 65, description: "I have basic knowledge of Java, including the fundamentals of object-oriented programming." },
    { name: "UI/UX Design (Figma)", level: 80, description: "I design friendly, easy-to-use interfaces in Figma." },
    { name: "Canva",      level: 85, description: "I enjoy using Canva to create creative and visually appealing designs, presentations, posters, and other visual content." },
  ],
  soft: [
    // ADD NEW SOFT SKILLS HERE — copy one line and edit it
    { name: "Teamwork",        level: 90, description: "I work well with groupmates to finish projects together." },
    { name: "Creativity",      level: 95, description: "I enjoy bringing fresh ideas and thoughtful details to every design." },
    { name: "Communication",   level: 85, description: "I share ideas clearly and listen openly to feedback." },
    { name: "Problem Solving", level: 80, description: "I break problems into small steps and work through them patiently." },
  ],
  summary: "Clean and responsive web pages, friendly interface design, and reliable teamwork that turns ideas into meaningful projects.",
};


/* -----------------------------------------------------------------
   5) PROJECTS 🚀
     title       → project name
     description → 1–2 sentences
     image       → screenshot path, e.g. "assets/images/my-app.png"
     coverPosition → OPTIONAL: which part of the image the card shows,
                   e.g. "center 50%" for the middle (default is the top)
     gallery     → OPTIONAL list of extra screenshots shown in the pop-up
     tags        → list of technologies used
     link        → URL to the live site / GitHub repo. Use "" if none yet
                   (then no button is shown).
   ----------------------------------------------------------------- */
const PROJECTS = [

  // ADD NEW PROJECTS HERE — copy one block (from { to },) and edit it
  {
    title: "Uncle Brew's Coffee and Milk Tea Website",
    description: "A web-based marketing system for displaying products and helping customers explore coffee and milk tea offerings.",
    image: "assets/images/project-uncle-brew-home.png",
    gallery: [
      "assets/images/project-uncle-brew-login.png",
      "assets/images/project-uncle-brew-products.png",
      "assets/images/project-uncle-brew-order.png",
    ],
    tags: ["Website", "Marketing System"],
    link: "",
  },
  {
    title: "CRABLENS",
    description: "A mobile application that uses YOLOv8 and MobileNetV2 to detect crabs and classify their species. This is our thesis project, and I served as the Team Leader.",
    image: "assets/images/crablens-1-splash.jpg",
    coverPosition: "center 50%",   // show the middle of this tall screenshot (where the logo is) on the card
    gallery: [
      "assets/images/crablens-2-home.jpg",
      "assets/images/crablens-3-about.jpg",
      "assets/images/crablens-4-detection-method.jpg",
      "assets/images/crablens-5-identifying.jpg",
      "assets/images/crablens-6-result.jpg",
      "assets/images/crablens-7-crab-info.jpg",
    ],
    tags: ["Mobile App", "YOLOv8", "MobileNetV2", "Machine Learning"],
    link: "",
  },
  {
    title: "SK Voting System",
    description: "A desktop voting system for the Sangguniang Kabataan (SK) election. An admin logs in, voters choose their SK Chairman and SK Kagawad candidates, and the system counts and shows the votes for each candidate. This was a group project.",
    image: "assets/images/sk-voting-2-ballot.jpg",
    gallery: [
      "assets/images/sk-voting-1-login.jpg",
    ],
    tags: ["Desktop App", "Windows Forms", "Voting System"],
    link: "",
  },

];
