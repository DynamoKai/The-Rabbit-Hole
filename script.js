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
const saveBtn = document.getElementById("save-btn");
const clearAllBtn = document.getElementById("clear-all-btn");
const journalOutput = document.getElementById("journal-output");
const importInput = document.getElementById("import-input");

// The Global Terminal Search Listener
document.getElementById("tag-filter")?.addEventListener("input", (e) => {
  const searchTerm =
    document.getElementById("curiositySearch")?.value.toLowerCase() || "";
  if (typeof displayEntries === "function")
    displayEntries(e.target.value.toLowerCase(), searchTerm);
});

document.getElementById("curiositySearch")?.addEventListener("input", (e) => {
  const tagFilter =
    document.getElementById("tag-filter")?.value.toLowerCase() || "";
  if (typeof displayEntries === "function")
    displayEntries(tagFilter, e.target.value.toLowerCase());
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
    timestamp: 1724131200000, // Unix timestamp for August 20, 2026
    tags: ["Database Architecture", "E-commerce", "Technical SEO"],
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
          clean. I write custom Javascript to parse the data, strip out formatting
          anomalies, and standardize the product schemas. This ensures that when
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
    <p><strong>> USER: Ruth B</strong></p>
    <p>Welcome to 2nd Natur3 Studios. I am a multidisciplinary builder specializing in<strong>
    Web Design, Product Management, and Game Testing</strong>.</p>
    <p>My approach is rooted in the belief that great digital experiances require both chaotic creativity and
    strict structural logic. Whether I am architecting a customized front-end UI, mapping out a product
    lifecycle, or stress-testing game mechanics, I treat the process like an endurance run focused on pacing,
    resilience, and crossing the finish line.</p>
    <p>When the screen goes dark, you'll usually find me testing my endurance strength on the trails, playing
    records, star-gazing, or spending time with my partner and our dog, Calypso.</p>
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
    <p>Deep mechanical analysis and QA. I dissect game loops, balance curves, and edge cases. (Ask me about optimal
    orb-channeling strategies for The Defect).</p>

    <h4>> CURRENT RESEARCH</h4>
    <p>Actively studying Machine Learning theories(specifically Generative AI), Game Theory, Bevy, and Fyrox.</p>
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
// =================================AUTO-SAVE LOGIC====================================

function saveDraft() {
  if (!editingTimestamp) {
    const draft = {
      topic: document.getElementById("topic").value,
      tags: document.getElementById("tags").value,
      depth: document.getElementById("depth").value,
      notes: document.getElementById("notes").value,
    };
    localStorage.setItem("rabbitHoleDraft", JSON.stringify(draft));
  }
}

function loadDraft() {
  const draftData = localStorage.getItem("rabbitHoleDraft");
  if (draftData) {
    const draft = JSON.parse(draftData);
    document.getElementById("topic").value = draft.topic || "";
    document.getElementById("tags").value = draft.tags || "";

    if (draft.depth) {
      document.getElementById("depth").value = draft.depth;
      document.getElementById("depth-display").innerText = draft.depth;
    }
    document.getElementById("notes").value = draft.notes || "";
  }
}

// Attach the saveDraft function to listen for every keystrokes of slider movement
["topic", "tags", "notes", "depth"].forEach((id) => {
  document.getElementById(id).addEventListener("input", saveDraft);
});

// LOGIC FOR PROCESS TAGS AND SAVING
saveBtn.addEventListener("click", () => {
  const topic = document.getElementById("topic").value;
  const notes = document.getElementById("notes").value;
  const tagsRaw = document.getElementById("tags").value;
  const depth = document.getElementById("depth").value; // Capture depth
  // const date = new Date().toLocaleDateString();
  // const timestamp = Date.now(); // for accurate sorting

  if (topic && notes) {
    // Convert comma-separated string into a clean array
    // Const entry = { topic, notes, date };
    const tags = tagsRaw
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t !== "");

    // Get old entries. add new one, and save back to local storage
    let entries = JSON.parse(localStorage.getItem("rabbitHoles")) || [];

    if (editingTimestamp) {
      const index = entries.findIndex((e) => e.timestamp === editingTimestamp);
      if (index !== -1) {
        entries[index].topic = topic;
        entries[index].notes = notes;
        entries[index].tags = tags;
        entries[index].depth = depth;
        // Note: I will keep the original date and timestamp intact
      }
      // reset the edit mode
      editingTimestamp = null;
      document.getElementById("save-btn").innerText = "Log Entry";
    } else {
      // Create a new entry
      const date = new Date().toLocaleDateString();
      const timestamp = Date.now();
      entries.unshift({ topic, notes, tags, date, timestamp, depth });
    }

    localStorage.setItem("rabbitHoles", JSON.stringify(entries));
    displayEntries(document.getElementById("tag-filter").value.toLowerCase());

    // CLEAR THE TEMP DRAFT ON SUCCESSFUL SAVE
    localStorage.removeItem("rabbitHoleDraft");

    // Reset fields
    document.getElementById("topic").value = "";
    document.getElementById("notes").value = "";
    document.getElementById("tags").value = "";
    document.getElementById("depth").value = "1"; //RESET SLIDER
    document.getElementById("depth-display").innerText = "1";
  }
});

// SORT BUTTON LOGIC
document.getElementById("sort-btn").addEventListener("click", (e) => {
  sortNewestFirst = !sortNewestFirst;
  e.target.innerText = sortNewestFirst
    ? "Sort: Newest First"
    : "Sort: Oldest First";
  displayEntries(document.getElementById("tag-filter").value.toLowerCase());
});

// EXPORT TO JSON FILE
document.getElementById("export-btn").addEventListener("click", () => {
  const data = localStorage.getItem("rabbitHoles");
  if (!data) return alert("Curiouser and curiouser");

  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `rabbit-holes-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
});

// IMPORT FROM JSON FILE
document
  .getElementById("import-btn")
  .addEventListener("click", () => importInput.click());

importInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = (event) => {
    localStorage.setItem("rabbitHoles", event.target.result);
    displayEntries();
  };
  reader.readAsText(file);
});

// CLEAR ALL LOGIC
clearAllBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete all entries?")) {
    localStorage.removeItem("rabbitHoles");
    displayEntries();
  }
});

// EDIT ENTRY LOGIC
function editEntry(timestamp) {
  const entries = JSON.parse(localStorage.getItem("rabbitHoles")) || [];
  const entryToEdit = entries.find((e) => e.timestamp === timestamp);

  if (entryToEdit) {
    // Populate the form fields with the entry data
    document.getElementById("topic").value = entryToEdit.topic;
    document.getElementById("tags").value = entryToEdit.tags.join(", ");
    document.getElementById("depth").value = entryToEdit.depth || 1;
    document.getElementById("depth-display").innerText = entryToEdit.depth || 1;
    document.getElementById("notes").value = entryToEdit.notes;

    // setting the global editing flag and change the button text
    editingTimestamp = timestamp;
    document.getElementById("save-btn").innerText = "Update Entry";

    // Scroll user back to the top to see the form
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

// INDIVIDUAL DELETE LOGIC
function deleteEntry(timestamp) {
  let entries = JSON.parse(localStorage.getItem("rabbitHoles")) || [];
  entries = entries.filter((e) => e.timestamp !== timestamp);
  localStorage.setItem("rabbitHoles", JSON.stringify(entries));
  displayEntries();
}

// Sidebar Control Functions
function openAnecdote(phrase, content, timestamp) {
  activeTimestamp = timestamp;
  activeAnecdoteKey = phrase;
  activeAnecdoteContent = content; // Store exact content to match correctly when saving

  document.getElementById("sidebar-title").innerText = phrase;
  document.getElementById("sidebar-content").value = content;

  document.getElementById("anecdote-sidebar").classList.add("active");
  document.getElementById("sidebar-overlay").classList.add("active");
}

function closeSidebar() {
  document.getElementById("anecdote-sidebar").classList.remove("active");
  document.getElementById("sidebar-overlay").classList.remove("active");
}

// SAVE EDITED ANECDOTE BACK TO LOCALSTORAGE
document.getElementById("save-anecdote-btn").addEventListener("click", () => {
  const newContent = document.getElementById("sidebar-content").value;
  let entries = JSON.parse(localStorage.getItem("rabbitHoles")) || [];

  const entryIndex = entries.findIndex((e) => e.timestamp === activeTimestamp);
  if (entryIndex !== -1) {
    let hasReplaced = false; // Prevents overwriting multiple identical anecdotes

    entries[entryIndex].notes = entries[entryIndex].notes.replace(
      /\[(.*?)\]\{((?:[^{}]|\{\{[\s\S]*?\}\})*)\}/g,
      (match, p1, p2) => {
        // Now checks BOTH phrase and exact content to prevent saving issues
        if (
          !hasReplaced &&
          p1 === activeAnecdoteKey &&
          p2 === activeAnecdoteContent
        ) {
          hasReplaced = true;
          activeAnecdoteContent = newContent; // Update so you can click save multiple times in a row
          return `[${p1}]{${newContent}}`;
        }
        return match;
      },
    );

    localStorage.setItem("rabbitHoles", JSON.stringify(entries));
    displayEntries(document.getElementById("tag-filter").value.toLowerCase());
    closeSidebar();
  }
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

// DISPLAY LOGIC UPDATED with REGEX PARSER
function displayEntries(filter = "", searchQuery = "") {
  updateTopTags();

  const entries = JSON.parse(localStorage.getItem("rabbitHoles")) || [];
  const journalOutput = document.getElementById("journal-output");

  // The filter logic should check if any tag in the entry includes the search term
  let filteredEntries = entries.filter((entry) => {
    // 1. Check if it matches the specific tag filter
    const matchesTag =
      !filter || entry.tags.some((tag) => tag.toLowerCase().includes(filter));
    // if (!filter) return true; // Show all if filter is empty
    // return entry.tags.some((tag) => tag.toLowerCase().includes(filter)); MIGHT

    // 2. check if it matches the global terminal search
    const matchesSearch =
      !searchQuery ||
      entry.topic.toLowerCase().includes(searchQuery) ||
      entry.notes.toLowerCase().includes(searchQuery) ||
      entry.tags.some((tag) => tag.toLowerCase().includes(searchQuery));

    return matchesTag && matchesSearch;
  });

  // SORT
  filteredEntries.sort((a, b) => {
    return sortNewestFirst
      ? b.timestamp - a.timestamp
      : a.timestamp - b.timestamp;
  });

  journalOutput.innerHTML = filteredEntries
    .map((e) => {
      // spotlight highlight text search
      const parsedNotes = e.notes
        // 1. MARKDOWN: Bold (**text**)
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

        // 2. MARKDOWN: Italics (*text*)
        .replace(/\*(.*?)\*/g, "<em>$1</em>")

        // 3. MARKDOWN: Blockquotes/Margins (> text)
        .replace(/^>\s?(.*$)/gm, '<blockquote class="md-quote">$1</blockquote>')

        // 4. ANECDOTES
        .replace(
          /\[(.*?)\]\{((?:[^{}]|\{\{[\s\S]*?\}\})*)\}/g,
          (match, phrase, content) => {
            // FIXED ESCAPING: Safe generation for inline JS onclick handlers
            const safePhrase = phrase
              .replace(/&/g, "&amp;")
              .replace(/\\/g, "\\\\")
              .replace(/'/g, "\\'") // Using \' prevents JS syntax errors
              .replace(/"/g, "&quot;")
              .replace(/\n/g, "\\n")
              .replace(/\r/g, "");

            const safeContent = content
              .replace(/&/g, "&amp;") // Prevents string desync during saving
              .replace(/\\/g, "\\\\")
              .replace(/'/g, "\\'") // Using \' prevents JS syntax errors
              .replace(/"/g, "&quot;")
              .replace(/\{/g, "&#123;")
              .replace(/\}/g, "&#125;")
              .replace(/\n/g, "\\n")
              .replace(/\r/g, "");

            return `<span class="anecdote-link" onclick="openAnecdote('${safePhrase}', '${safeContent}', ${e.timestamp})">${phrase}</span>`;
          },
        )
        // The Second Pass: Cheshire Encryption
        .replace(
          /\{\{([\s\S]*?)\}\}/g,
          '<span class="cheshire-text">$1</span>',
        );

      // DEPTH INDICATOR CALCULATION
      // THE `|| 1` ensures it defaults to 1 hole if old entries don't have a depth saved.
      const depthIndicator = "🕳️".repeat(e.depth || 1);

      // 2. Applied spotligh highlights AFTER parsing
      const displayTopic = highlightText(e.topic, searchQuery);
      const displayNotes = highlightText(parsedNotes, searchQuery);

      // RETURN SETTING UPDATE
      return `
    <div class="journal-entry">
        <div class="entry-actions">
          <button class="edit-btn" onclick="editEntry(${e.timestamp})">✎ Edit</button>
          <button class="delete-btn" onclick="deleteEntry(${e.timestamp})">✕ Delete</button>
          </div>
      <small>${e.date} | DESCENT: ${depthIndicator}</small>

      <div class="tag-container">
        ${e.tags
          .slice(0, 3) // restricts the placement to top 3 tags
          .map((tag) => {
            const isMatch =
              filter && tag.toLowerCase().includes(filter) ? " match" : "";
            const displayTag = highlightText(tag, searchQuery);
            return `<span class='tag-pill${isMatch}'>${displayTag}</span>`;
          })
          .join("")}
      </div>

      <h3>${displayTopic}</h3>
      <p>${displayNotes}</p>
    </div>
    `;
    })
    .join("");
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
// THE RABBIT HOLE: RENDERING ENGINE
// ===========================================================================
function displayEntries(tagFilter = "", searchTerm = "") {
  const journalOutpost = document.getElementById("journal-output");
  if (!journalOutput) return; // Failsafe if the HTML is missing

  const currentData = publicJournalData;

  journalOutput.innerHTML = "";

  // Convert my data object into an array so I can sort and filter
  let entriesArray = Object.entries(currentData);

  // A. Apply Search Keyword Filter
  if (searchTerm) {
    entriesArray = entriesArray.filter(([key, entry]) => {
      const textMatch =
        entry.text && entry.text.toLowerCase().includes(searchTerm);
      const tagMatch =
        entry.tags &&
        entry.tags.some((tag) => tag.toLowerCase().includes(searchTerm));
      return textMatch || tagMatch;
    });
  }

  // B. Apply Sidebar Tag Filter
  if (tagFilter) {
    entriesArray = entriesArray.filter(
      ([key, entry]) =>
        entry.tags && entry.tags.some((tag) => tag.toLowerCase() === tagFilter),
    );
  }

  // C. Apply Descent Sorting (Newest vs Oldest)
  entriesArray.sort((a, b) => {
    return sortNewestFirst
      ? b[1].timestamp - a[1].timestamp
      : a[1].timestamp - b[1].timestamp;
  });

  // D. Empty State of Search
  if (entriesArray.length === 0) {
    journalOutput.innerHTML = `<p class="empty-state" style="color: var(--accent); opacity:0.7;">No transmissions match this frequency, try something else.</p>`;
    return;
  }

  // E. Construct and Render the Posts
  entriesArray.forEach(([key, entry]) => {
    const entryDiv = document.createElement("div");
    entryDiv.className = "journal-entry"; //should catch existing CSS

    // dynamic tag building
    let tagsHTML = "";
    if (entry.tags && entry.tags.length > 0) {
      tahsHTML =
        `<div class="entry-tags" style="margin-bottom: 1rem; color:
      var(--accent);">` +
        entry.tags
          .map(
            (tag) =>
              `<span class="tag" style="margin-right: 10px; cursor: pointer;">[${tag}]</span>`,
          )
          .join("") +
        `</div>`;
    }

    // Format the UNIX timestamp
    const dateStr = new Date(entry.timestamp).toLocaleDateString();

    // Final HTML block assembly for transmission
    entryDiv.innerHTML = `
    <div class="entry-meta" style="margin-bottom: 0.5rem; opacity: 0.7;">
      <small>> LOG_DATE: ${dateStr}</small>
      </div>
      ${tagsHTML}
      <div class="entry-text cheshire-text" style="line-height: 1.6;">
        ${entry.text}
        </div>
        <hr style="border: 0; border-bottom: 1px dashed rgba(74, 222, 128, 0.3); margin: 3rem
        0;">
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
