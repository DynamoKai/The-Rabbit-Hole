const saveBtn = document.getElementById("save-btn");
const clearAllBtn = document.getElementById("clear-all-btn");
const journalOutput = document.getElementById("journal-output");
const importInput = document.getElementById("import-input");

// Load existing entries from LocalStorage on startup
document.getElementById("tag-filter").addEventListener("input", (e) => {
  const searchTerm =
    document.getElementById("curiositySearch")?.value.toLowerCase() || "";
  displayEntries(e.target.value.toLowerCase(), searchTerm);
});

// The Global Terminal Search Listener
document.getElementById("curiositySearch")?.addEventListener("input", (e) => {
  const tagFilter = document.getElementById("tag-filter").value.toLowerCase();
  displayEntries(tagFilter, e.target.value.toLowerCase());
});

window.onload = () => displayEntries();

let sortNewestFirst = true;
let activeTimestamp = null;
let editingTimestamp = null;
let activeAnecdoteKey = null;
let activeAnecdoteContent = null; // added to prevent duplicate overwriting and ensure exact matches

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
