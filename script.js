// ====================================================
// 2NDNATUR3 DOM ELEMENT SELECTION
// ====================================================
const landingPage = document.getElementById("landing-page");
const rabbitHoleApp = document.getElementById("rabbit-hole-app");
const drawers = document.querySelectorAll(".cabinet-drawer");
const terminalDisplay = document.getElementById("terminal-display");
const terminalTitle = document.getElementById("terminal-title");
const closeTerminal = document.getElementById("close-terminal");
const terminalBody = document.getElementById("terminal-content");
const drawerSound = document.getElementById("drawer-sound");

// / ===================================================
// / THE RABBIT HOLE DOM ELEMENT SELECTIONS
// / ===================================================
const journalOutput = document.getElementById("journal-output");

// ===========================================================================
// GLOBAL EVENT LISTENERS (Unified)
// ===========================================================================
document
  .getElementById("curiositySearch")
  ?.addEventListener("input", displayEntries);
document
  .getElementById("tag-filter")
  ?.addEventListener("input", displayEntries);

// listener for Depth Slider
document.getElementById("depth")?.addEventListener("input", (e) => {
  document.getElementById("depth-display").innerText = e.target.value;
  displayEntries();
});

// Sort listener
document.getElementById("sort-btn")?.addEventListener("click", (e) => {
  sortNewestFirst = !sortNewestFirst;
  e.target.innerText = sortNewestFirst
    ? "Sort: Newest First"
    : "Sort: Oldest First";
  displayEntries();
});

window.onload = () => {
  if (typeof displayEntries === "function") displayEntries();
};

let sortNewestFirst = true;
let activeTimestamp = null;
let editingTimestamp = null;
let activeAnecdoteKey = null;
let activeAnecdoteContent = null; // added to prevent duplicate overwriting and ensure exact matches

// ===========================================================================
// THE RABBIT HOLE: BACKEND DATA LEDGER
// ===========================================================================
const publicJournalData = {
  entry_001: {
    timestamp: 1787227200000, // Unix timestamp for August 20, 2026
    tags: [
      "Database Architecture",
      "E-commerce",
      "Technical SEO",
      "APCCC",
      "Wix",
      "Animals As Leaders",
    ],
    depth: 2,
    text: `
      <h3>Down the Rabbit Hole: Finding Sand for a Box in a Wonderland of E-commerce Data</h3>

      <p>I always understood what a domino effect was, but it never hit me like the
      domino V scene in <em>V for Vendetta</em>. Maybe it was the placement of
      the scene, or the sequence of events being told alongside the inspector's
      monologue. I'm not sure what it was, but the concept of the domino effect
      hit differently after that. The same is true here. I know that a single
      punctuation mark can throw off the entire logic of a code sequence, but it
      feels different knowing the same applies to an e-commerce database. One
      wrong move can bring a digital storefront crashing down with a glaring 404.</p>

      <p>Recently, I tackled a massive product catalog restructuring and technical
      SEO overhaul, and it reinforced my golden rules for data migration: never
      test in production. Just giving myself some good advice I suppose. When
      you are restructuring hundreds of product SKUs, rewriting schema data, and
      connecting with legacy code, you have to build a Wonderland of your own,
      an isolated environment to test everything they may or may not work. Its
      incredibly frustrating and absolutely invigorating at the same time.
      Testing in static, line by line, code logic be damned, digging your toes
      in foreign land.</p>

      <p>Here is a blueprint for myself later (a lifetime curi wanderer) and others
      with a fascination for maps people like to make for what they feel are
      landmarks.</p>

      <h4>DOT - Dynamic Optimization Table</h4>
      <ul>
        <li>
          <strong>Build a "Sandbox" that mirrors the world you want to add to:</strong>
          Before touching a single row of CSV data, duplicate the entire
          production environment. Building an isolated staging site allows me to
          map out complex database restructuring and run deep technical SEO audits
          without risking live customer traffic.
        </li>
        <li>
          <strong>Embrace the madness:</strong> Raw database exports are rarely
          clean. [I write custom Javascript to parse the data, strip out formatting
          anomalies, and standardize the product schemas]{By creating a CMS from a CSV spreadsheet
          and working with Wix's editor I worked directly in the Wix Studio Editor
          as I wasn't to familiar with the Wix IDE yet. Much like learning a new
          instrument, takes time to know where the chords live in a different
          orientation.} This ensures that when
          the data is finally mapped back into the new system, the import is seamless.
        </li>
        <li>
          <strong>Steel approach to deployment:</strong> Once the data is mapped
          and the technical SEO roadmap is applied within the sandbox, I use a
          staggered deployment strat. Routing the updated architecture through
          custom DNS configurations ensure the transition is seamless and more
          importantly, invisible to the end-user.
        </li>
      </ul>

      <p><em>Listen, data is valuable but useless if not properly read. Remember to
      embrace a little chaos, when you find structure within it, you're seeing
      the stars as constellations and now you can navigate better than you did
      before.</em></p>
    `,
  },
  entry_002: {
    timestamp: 1787527020000,
    tags: [
      "Doored",
      "Bikes",
      "Portland",
      "Accidents",
      "Coding Health",
      "Nick Drake",
    ],
    depth: 1,
    text: `
      <h3>Swinging Past The River Man</h3>
      <p>I got doored for the first time in my life in a bike friendly city.</p>

      <p>It's strange to say the door came out of nowhere, but it did. Almost in slow motion, but so were my movements even though I was going maybe 13 mph. A few cuts on my right pinky and ring finger that just started healing today. [Shaken]{at least until the bruises fade} up and I still haven't checked to see if my bike still rides right. Glad I was wearing a helmet, because it could have been way worse.</p>

      <p>The guy that doored me was considerate enough to give my a ride. [He]{and his family who kind of saw the whole thing occur or rather the after math} was pretty insistent. Thinking about shooting him a text to let him know I'm healing well. It wasn't intentional thats for sure. A bit of bad timing in a very stressful week.</p>

	    <p>This accident brought me to an interesting intersection of thought on coding and how we have to be in the right state of mind to get things right. The day after the accident, I was making mistakes that I would classify as [trivial]{Your standard punctuation errors, string misspellings, etc} to say the least. I ended up just stepping away from the computer for the rest of the day after the maybe 8th mistake. It wasn't like me and I know for a fact now my body was telling me to stop. <strong>Remember to be kind to yourself and know when you need to physically heal, else you remain in a healing state longer than you need to be.</strong></p>
    `,
  },
};

// Bypass local storage and force the app to use your public ledger
let journalData = publicJournalData;

// ===========================================================================
// SITE CONTENT & DIRECTORIES
// ===========================================================================
const siteContent = {
  "> about.exe": `
  <h3>[ SYSTEM PROCESS: ABOUT ]</h3>
  <div class="about-container">
    <img src="Images/Whiterabbit.watch-copy.webp" class="rabbit-glitch" alt="The White Rabbit">
    <p><strong>> USER: AR Bly</strong></p>
    <p>Welcome to 2nd Natur3 Studios. I am a multidisciplinary builder, systems architect, and game tester.</strong>.</p>
    <p>Great digital environments demand both chaotic creativity and absolute structural logic. Whether I am building a custom UI from the ground up, directing a product lifecycle, or breaking game mechanics to see how they tick, my process mirrors an endurance run. It is about establishing the pace, adapting to the terrain, and executing until the final mile.</p>
    <p>When I log off, I am usually testing my own physical limits on the trails, dropping a needle on a record, stargazing, or off-grid with my partner and our dog, Calypso.</p>
    </div>
  `,

  "> capabilities.sys": `
  <h3>[ DIRECTORY: CAPABILITIES & SKILLS ]</h3>
  <div class="skills-container">
    <h4>> WEB DEVELOPMENT & DESIGN</h4>
    <p>Building responsive, highly-customized front-end experiences using HTML, CSS, JavaScript, PHP,
    and Ruby on Rails. Strong focus on thematic UI and immersive digital environments.</p>

    <h4>> PRODUCT MANAGMENT</h4>
    <p>Shepherding concepts from ideation to deployment. Translating complex technical requirements into
    actionable roadmaps, ensuring alignment between design, engineering, and user needs.</p>

    <h4>> GAME TESTING & QA</h4>
    <p>Deep mechanical analysis and QA. I dissect game loops, balance curves, and edge cases.</p>

    <h4>> CURRENT RESEARCH</h4>
    <p>Actively studying Machine Learning theories(specifically Generative AI), Game Theory, Bevy, Rust, and Fyrox.</p>
    </div>
  `,

  "> projects.dir": `
  <h3>[ DIRECTORY: ACTIVE PROJECTS ]</h3>
  <ul class="project-list">
    <li>
      <strong><span class="search-highlight">2nd Natur3 Studios</span></strong><br>
      <em>Role: Sole Developer / Designer</em><br>
      This very domain. A single-page application built with JavaScript and CSS, designed to mimic a
      retro-futuristic operating system.
    </li>
    <br>
    <li>
      <strong><span class="search-highlight">The Rabbit Hole</span></strong><br>
      <em>Role: Architect</em><br>
      A customized, terminal-themed research journal and database system utilizing local storage for data
      persistance, custom tagging, and markdown parsing. (See how far the rabbit hole goes? > the-rabbit-hole.exe).
    </li>
    <br>
    <li>
      <strong><span class="search-highlight">A Precocious Child Candle Company</span></strong><br>
      <em>Role: SEO & Product Management</em><br>
      Directing SEO strategy and product integration for A Precocious Child Candle Co.
      Executing baseline site crawls, building a scalable SEO framework for new inventory,
      and optimizing ingredient-specific keywords to drive competitive search volume.
    </li>
    <br>
    <li>
      <strong><span class="search-highlight">The Homegrown Way</span></strong><br>
      <em>Role: Full-Stack Development & UI Design</em><br>
      Engineering a custom web application for The Homegrown Way anchored by a distinct, Studio Ghibli-inspired aesthetic. Integrating Cal.com and Stripe to build a seamless automated scheduling and payment pipeline, translating highly creative design into a lightweight, responsive, and friction-free user experience.
    </li>
  </ul>
  <p><em>[ ADDITONAL SOURCE CODE ARCHIVES PENDING DECLASSIFICATION ]</em></p>
  `,

  "> contact.bat": `
  <h3>[ EXECUTING: CONTACT PROTOCOL ]</h3>
  <p>Open for freelance web design, product management consultations, and QA contracting.</p>

  <ul class="contact-links" style="list-style: none; padding: 0;">
    <li><strong>Email:</strong> <a href="mailto:hello@2ndnatur3studios.com"
    class="anecdote-link">hello@2ndnatur3studios.com</a></li>
    <li><strong>Github:</strong> <a href="https://github.com/DynamoKai"
    class="anecdote-link">github.com/DynamoKai</a></li>
    <li><strong>Instagram:</strong> <a href="https://www.instagram.com/2ndnatur3studios/"
    class="anecdote-link">instagram.com/2ndnatur3studios</a></li>
  </ul>
 `,
};

// ====================================================
// DRAWER INTERACTION & SCRAMBLE LOGIC
// ====================================================
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";

drawers.forEach((drawer) => {
  let interval = null;

  drawer.addEventListener("mouseenter", (event) => {
    let iteration = 0;
    const label = event.target.querySelector(".terminal-label");
    const originalText = event.target.dataset.originalText;

    clearInterval(interval);

    interval = setInterval(() => {
      label.innerText = originalText
        .split("")
        .map((letter, index) => {
          if (index < iteration) {
            return originalText[index];
          }
          return letters[Math.floor(Math.random() * letters.length)];
        })
        .join("");

      if (iteration >= originalText.length) {
        clearInterval(interval);
      }
      iteration += 1 / 3;
    }, 30);
  });

  drawer.addEventListener("click", (event) => {
    const action = event.currentTarget.dataset.action;
    const drawerName = event.currentTarget.dataset.originalText;

    if (action === "enter-hole") {
      landingPage.classList.add("hidden");
      rabbitHoleApp.classList.remove("hidden");
    } else if (action === "terminal") {
      terminalTitle.innerText = `Executing: ${drawerName}`;
      terminalBody.innerHTML =
        siteContent[drawerName] || "<p>Error: File corrupted.</p>";
      terminalDisplay.classList.remove("hidden");
      terminalDisplay.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// ===========================================================================
// CLOSE TERMINAL LOGIC (The "X" Button)
// ===========================================================================
closeTerminal?.addEventListener("click", () => {
  // 1. Hide the terminal display
  terminalDisplay.classList.add("hidden");

  // 2. Pull all the cabinet drawers back to the center
  drawers.forEach((d) => {
    d.classList.remove("is-shifted-right");
    d.classList.remove("is-shifted-left");
  });

  // 3. Play the satisfying mechanical click
  if (typeof drawerSound !== "undefined" && drawerSound) {
    drawerSound.currentTime = 0;
    drawerSound.play();
  }
});

// ===========================================================================
// RABBIT HOLE RETURN TO NATURE BUTTON LOGIC
// ===========================================================================

const exitHoleBtn = document.getElementById("exit-hole-btn");

if (exitHoleBtn) {
  exitHoleBtn.addEventListener("click", () => {
    // 1. Hide the Rabbit Hole interface
    if (typeof rabbitHoleApp !== "undefined")
      rabbitHoleApp.classList.add("hidden");

    // 2. Bring the main landing page back
    if (typeof landingPage !== "undefined")
      landingPage.classList.remove("hidden");

    // 3. Pull the cabinet drawers back to the center
    drawers.forEach((d) => {
      d.classList.remove("is-shifted-right");
      d.classList.remove("is-shifted-left");
    });

    // 4. Scroll back to the cabinet
    const cabinet = document.getElementById("main-cabinet");
    if (cabinet) cabinet.scrollIntoView({ behavior: "smooth" });

    // 5. Play the drawer sound
    if (typeof drawerSound !== "undefined" && drawerSound) {
      drawerSound.currentTime = 0;
      drawerSound.play();
    }
  });
}

// ===========================================================================
// CABINET INTERACTION LOGIC (Click Events)
// ===========================================================================
drawers.forEach((drawer) => {
  // STRICTLY SINGULAR "drawer" TO PREVENT CRASHES!
  drawer.addEventListener("click", (event) => {
    // 1. KINETIC MOVEMENT LOGIC
    // Send the clicked drawer to the right, and all others to the left
    drawers.forEach((d) => {
      if (d === event.currentTarget) {
        d.classList.add("is-shifted-right");
        d.classList.remove("is-shifted-left");
      } else {
        d.classList.add("is-shifted-left");
        d.classList.remove("is-shifted-right");
      }
    });

    // 2. AUDIO TRIGGER
    if (typeof drawerSound !== "undefined" && drawerSound) {
      drawerSound.currentTime = 0;
      drawerSound.play();
    }

    const action = event.currentTarget.dataset.action;
    const drawerName = event.currentTarget.dataset.originalText;

    // 3. TERMINAL ACTION PROTOCOL
    if (action === "terminal") {
      terminalTitle.innerText = `Executing: ${drawerName}`;

      // Inject the portfolio content PLUS a permanent return button at the bottom
      terminalBody.innerHTML =
        (siteContent[drawerName] || "<p>Error: File corrupted.</p>") +
        `
        <div style="margin-top: 3rem; border-top: 1px solid rgba(74, 222, 128, 0.3); padding-top: 1.5rem;">
          <button class="util-btn" id="return-main-btn"><< Close Connection & Return</button>
        </div>
      `;

      terminalDisplay.classList.remove("hidden");
      terminalDisplay.scrollIntoView({ behavior: "smooth" });

      // 4. THE RETURN LOGIC
      // Listen for the return button to reverse the animation
      const returnBtn = document.getElementById("return-main-btn");
      if (returnBtn) {
        returnBtn.addEventListener("click", () => {
          // Bring all drawers smoothly back to the center
          drawers.forEach((d) => {
            d.classList.remove("is-shifted-right");
            d.classList.remove("is-shifted-left");
          });

          // Hide the terminal
          terminalDisplay.classList.add("hidden");

          // Smooth scroll back to the top of the cabinet
          const cabinet = document.getElementById("main-cabinet");
          if (cabinet) cabinet.scrollIntoView({ behavior: "smooth" });
        });
      }
    } else if (action === "enter-hole") {
      // (Your existing Rabbit Hole logic)
      if (typeof landingPage !== "undefined")
        landingPage.classList.add("hidden");
      if (typeof rabbitHoleApp !== "undefined")
        rabbitHoleApp.classList.remove("hidden");
    }
  });
});

// ===========================================================================
// ANECDOTE SIDEBAR (SCRATCHPAD LOGIC)
// ===========================================================================
function openAnecdote(phrase, content, timestamp) {
  activeTimestamp = timestamp;
  activeAnecdoteKey = phrase;
  activeAnecdoteContent = content;

  document.getElementById("sidebar-title").innerText = phrase;
  document.getElementById("sidebar-content").value = content;

  document.getElementById("anecdote-sidebar").classList.add("active");
  document.getElementById("sidebar-overlay").classList.add("active");
}

function closeSidebar() {
  document.getElementById("anecdote-sidebar").classList.remove("active");
  document.getElementById("sidebar-overlay").classList.remove("active");
}

// Transforms the "Save" button into a scratchpad closer for the read-only ledger
document.getElementById("save-anecdote-btn")?.addEventListener("click", () => {
  // Add any future addendum logic here! For now, it simply closes the pad.
  closeSidebar();
});
// HELPER FUNCTION TO HIGHLIGHT TEXT
function highlightText(text, query) {
  // If there's no search query, return the normal text
  if (!query) return text;

  // Create a regex that finds the query (case-insensitive)
  const regex = new RegExp(` (${query})`, "gi");

  // Replace the matched text with the highlighted span
  return text.replace(regex, '<span class="search-highlight">$1</span>');
}

// HELPER FUNCTION TO PARSE MARKDOWN & ANECDOTES
function parseMarkdown(text, timestamp) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/^>\s?(.*$)/gm, '<blockquote class="md-quote">$1</blockquote>')
    .replace(/\[([\s\S]*?)\]\{([\s\S]*?)\}/g, (match, phrase, content) => {
      // Use standard JS escaping (\\') instead of HTML entities for single quotes
      const safePhrase = phrase
        .replace(/\s+/g, " ")
        .replace(/'/g, "\\'")
        .replace(/"/g, "&quot;");

      const safeContent = content
        .replace(/\s+/g, " ")
        .replace(/'/g, "\\'")
        .replace(/"/g, "&quot;");

      return `<span class="anecdote-link" onclick="openAnecdote('${safePhrase}', '${safeContent}', ${timestamp})">${phrase}</span>`;
    })
    .replace(/\{\{([\s\S]*?)\}\}/g, '<span class="cheshire-text">$1</span>');
}

// TOP TAGS LOGIC
function updateTopTags() {
  const entries = JSON.parse(localStorage.getItem("rabbitHoles")) || [];
  const tagCounts = {};

  // Loop through all entries and count the tags
  entries.forEach((entry) => {
    if (entry.tags && Array.isArray(entry.tags)) {
      entry.tags.forEach((tag) => {
        // Normalize tags to prevent duplicates like "Physics" and "physics"
        const cleanTag = tag.toLowerCase().trim();
        tagCounts[cleanTag] = (tagCounts[cleanTag] || 0) + 1;
      });
    }
  });

  // Sort by frequency and slice the top 3
  const top3Tags = Object.keys(tagCounts)
    .sort((a, b) => tagCounts[b] - tagCounts[a])
    .slice(0, 3);

  // Render to the container
  const container = document.getElementById("top-tags-container");
  if (!container) return; // Safety check

  if (top3Tags.length === 0) {
    container.innerHTML = ""; // Clear if no tags exist
    return;
  }

  // mapping the tags into the HTML and adding click feature to auto search
  container.innerHTML = top3Tags
    .map(
      (tag) =>
        `<span class="tag-pill top-tag" onclick="
          const search = document.getElementById('curiositySearch');
          search.value = '${tag}';
          search.dispatchEvent(new Event('input'));
          ">#${tag}</span>`,
    )
    .join("");
}

console.log(
  '%c[SYSTEM INITIALIZED] > public class Defect { public static void main(String[] args) { System.out.println("Follow the white rabbit."); } }',
  "color:#00ff00; font-family: monospace; font-size: 14px;",
);

// ===========================================================================
// THE RABBIT HOLE: RENDERING ENGINE (AUGUST 2026)
// ===========================================================================
function displayEntries() {
  updateTopTags(); //keep tags updating

  const journalOutput = document.getElementById("journal-output");
  if (!journalOutput) return;

  const currentData = publicJournalData;
  journalOutput.innerHTML = "";

  // 1. Capture current filter state
  const searchTerm =
    document.getElementById("curiositySearch")?.value.toLowerCase() || "";
  const tagFilter =
    document.getElementById("tag-filter")?.value.toLowerCase() || "";

  const selectedDepth = parseInt(
    document.getElementById("depth")?.value || "1",
    10,
  );

  let entriesArray = Object.entries(currentData);

  // 2. Depth Filter Application
  entriesArray = entriesArray.filter(([key, entry]) => {
    const postDepth = entry.depth || 1;
    return postDepth <= selectedDepth;
  });

  // 3. Search Keyword Filter Application
  if (searchTerm) {
    entriesArray = entriesArray.filter(([key, entry]) => {
      const textMatch =
        entry.text && entry.text.toLowerCase().includes(searchTerm);
      const tagMatch =
        entry.tags &&
        entry.tags.some((tag) => tag.toLowerCase().includes(searchTerm));
      const topicMatch = key.toLowerCase().includes(searchTerm);
      return textMatch || tagMatch || topicMatch;
    });
  }

  // 4. Sidebar Tag Filter Application
  if (tagFilter) {
    entriesArray = entriesArray.filter(
      ([key, entry]) =>
        entry.tags && entry.tags.some((tag) => tag.toLowerCase() === tagFilter),
    );
  }

  // 5. Descent Sorting Application
  entriesArray.sort((a, b) => {
    return sortNewestFirst
      ? b[1].timestamp - a[1].timestamp
      : a[1].timestamp - b[1].timestamp;
  });

  // 6. Empty Space
  if (entriesArray.length === 0) {
    journalOutput.innerHTML = `<p class="empty-state" style="color: var(--accent); opacity: 0.7;">[404] The rabbit hole is empty. No transmissions found for that query...curiouser and curiouser.</p>`;
    return;
  }

  // 7. Render Posts with Highlighting & Parsing
  entriesArray.forEach(([key, entry]) => {
    const entryDiv = document.createElement("div");
    entryDiv.className = "journal-entry";

    // Tag Hightlighting
    let tagsHTML = "";
    if (entry.tags && entry.tags.length > 0) {
      tagsHTML =
        `<div class="tag-container" style="margin-bottom: 1rem; color: var(--accent);">` +
        entry.tags
          .map((tag) => {
            const displayTag = highlightText(tag, searchTerm);
            return `<span class='tag-pill'>[${displayTag}]</span>`;
          })
          .join("") +
        `</div>`;
    }

    const dateStr = new Date(entry.timestamp).toLocaleDateString();

    // Parse the markdown/anecdotes FIRST, then highlight search terms
    const parsedText = parseMarkdown(entry.text, entry.timestamp);
    const displayNotes = highlightText(parsedText, searchTerm);

    entryDiv.innerHTML = `
      <div class="entry-meta" style="margin-bottom: 0.5rem; opacity: 0.7;">
        <small>> LOG_DATE: ${dateStr} | DEPTH: ${entry.depth || 1}</small>
      </div>
        ${tagsHTML}
      <div class="entry-text cheshire-text" style="line-height: 1.6;">
        ${displayNotes}
      </div>
    <hr style="border: 0; border-bottom: 1px dashed rgba(74, 222, 128, 0.3); margin: 3rem 0;">
    `;
    journalOutput.appendChild(entryDiv);
  });
}

// ===========================================================================
// INTERACTIVE STAR MATRIX BACKGROUND
// ===========================================================================
const canvas = document.getElementById("star-matrix");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;

// Get mouse position
let mouse = {
  x: null,
  y: null,
  radius: 150, // this is how close the mouse needs to be to connect with a star
};

window.addEventListener("mousemove", function (event) {
  mouse.x = event.x;
  mouse.y = event.y;
});

// Create Particle (Star) Class
class Particle {
  constructor(x, y, directionX, directionY, size, color) {
    this.x = x;
    this.y = y;
    this.directionX = directionX;
    this.directionY = directionY;
    this.size = size;
    this.color = color;
  }

  // Draw individual star
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = "#4ade80"; // Phosphor green :)
    ctx.fill();
  }

  // Move star
  update() {
    // Bounce off edges
    if (this.x > canvas.width || this.x < 0) {
      this.directionX = -this.directionX;
    }
    if (this.y > canvas.height || this.y < 0) {
      this.directionY = -this.directionY;
    }
    this.x += this.directionX;
    this.y += this.directionY;

    this.draw();
  }
}

// Initialization of the Matrix
function init() {
  particlesArray = [];
  //cal how many stars to spawn based on screen size
  let numberOfParticles = (canvas.height * canvas.width) / 9000;

  for (let i = 0; i < numberOfParticles; i++) {
    let size = Math.random() * 2 + 1; // little variation
    let x = Math.random() * (innerWidth - size * 2 - size * 2) + size * 2;
    let y = Math.random() * (innerHeight - size * 2 - size * 2) + size * 2;
    let directionX = Math.random() * 0.8 - 0.4; // Tokyo drifttttt
    let directionY = Math.random() * 0.8 - 0.4;
    let color = "#4ade80";

    particlesArray.push(
      new Particle(x, y, directionX, directionY, size, color),
    );
  }
}

// Check distances and draw connecting lines
function connect() {
  let opacityValue = 1;
  for (let a = 0; a < particlesArray.length; a++) {
    for (let b = a; b < particlesArray.length; b++) {
      let distance =
        (particlesArray[a].x - particlesArray[b].x) *
          (particlesArray[a].x - particlesArray[b].x) +
        (particlesArray[a].y - particlesArray[b].y) *
          (particlesArray[a].y - particlesArray[b].y);

      // Connect starts to each other
      if (distance < (canvas.width / 7) * (canvas.height / 7)) {
        opacityValue = 1 - distance / 20000;
        ctx.strokeStyle = "rgba(74, 222, 128," + opacityValue + ")";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
        ctx.stroke();
      }
    }

    // Connect stars to mouse
    if (mouse.x && mouse.y) {
      let dx = particlesArray[a].x - mouse.x;
      let dy = particlesArray[a].y - mouse.y;
      let mouseDistance = Math.sqrt(dx * dx + dy * dy);

      if (mouseDistance < mouse.radius) {
        // The closer the mouse, the brighter the line
        opacityValue = 1 - mouseDistance / mouse.radius;
        ctx.strokeStyle = "rgba(74, 222, 128," + opacityValue + ")";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    }
  }
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, innerWidth, innerHeight);

  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
  }
  connect();
}

// Ensure the matrix adapts if the browser window is resized
window.addEventListener("resize", function () {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  init();
});

// Clear mouse coordinates when leaving the window so the web doesn't get stuck
window.addEventListener("mouseout", function () {
  mouse.x = undefined;
  mouse.y = undefined;
});

// Boot Matrix
init();
animate();
