const saveBtn = document.getElementById("save-btn");
const clearAllBtn = document.getElementById("clear-all-btn");
const journalOutput = document.getElementById("journal-output");
const importInput = document.getElementById("import-input");

// Load existing entries from LocalStorage on startup
document.getElementById("tag-filter").addEventListener("input", (e) => {
  displayEntries(e.target.value.toLowerCase());
});

window.onload = displayEntries;

let sortNewestFirst = true;
let activeTimestamp = null;
let activeAnecdoteKey = null;

// LOGIC FOR PROCESS TAGS AND SAVING
saveBtn.addEventListener("click", () => {
  const topic = document.getElementById("topic").value;
  const notes = document.getElementById("notes").value;
  const tagsRaw = document.getElementById("tags").value;
  const date = new Date().toLocaleDateString();
  const timestamp = Date.now(); // for accurate sorting

  if (topic && notes) {
    // Convert comma-separated string into a clean array
    // Const entry = { topic, notes, date };
    const tags = tagsRaw
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t !== "");

    // Get old entries. add new one, and save back to local storage
    const entries = JSON.parse(localStorage.getItem("rabbitHoles")) || [];

    // Added timestamp for record
    entries.unshift({ topic, notes, tags, date, timestamp });
    localStorage.setItem("rabbitHoles", JSON.stringify(entries));

    displayEntries();
    // Reset fields
    document.getElementById("topic").value = "";
    document.getElementById("notes").value = "";
    document.getElementById("tags").value = "";
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

  // Find the specific entry and replace the old anecdote syntax with new content
  const entryIndex = entries.findIndex((e) => e.timestamp === activeTimestamp);
  if (entryIndex !== -1) {
    entries[entryIndex].notes = entries[entryIndex].notes.replace(
      /\[(.*?)\]\{(.*?)\}/g,
      (match, p1, p2) => {
        return p1 === activeAnecdoteKey ? `[${p1}]{${newContent}}` : match;
      },
    );

    localStorage.setItem("rabbitHoles", JSON.stringify(entries));
    displayEntries(document.getElementById("tag-filter").value.toLowerCase());
    closeSidebar();
  }
});

// DISPLAY LOGIC UPDATED with REGEX PARSER
function displayEntries(filter = "") {
  const entries = JSON.parse(localStorage.getItem("rabbitHoles")) || [];
  const journalOutput = document.getElementById("journal-output");

  // The filter logic should check if any tag in the entry includes the search term
  let filteredEntries = entries.filter((entry) => {
    if (!filter) return true; // Show all if filter is empty
    return entry.tags.some((tag) => tag.toLowerCase().includes(filter));
  });

  // SORT
  filteredEntries.sort((a, b) => {
    return sortNewestFirst
      ? b.timestamp - a.timestamp
      : a.timestamp - b.timestamp;
  });

  journalOutput.innerHTML = filteredEntries
    .map((e) => {
      // PARSER: This finds [words]{content} and turns it into a clickable span
      const parsedNotes = e.notes.replace(
        /\[(.*?)\]\{(.*?)\}/g,
        (match, phrase, content) => {
          const safeContent = content
            .replace(/'/g, "&apos;")
            .replace(/"/g, "&quot;");
          // Removed broken space in function signature call
          return `<span class="anecdote-link" onclick="openAnecdote('${phrase}', '${safeContent}', ${e.timestamp})">${phrase}</span>`;
        },
      );
      return `
    <div class="journal-entry">
      <button class="delete-btn" onclick="deleteEntry(${e.timestamp})">✕ Delete</button>
      <small>${e.date}</small>
      <h3>${e.topic}</h3>
      <div class="tag-container">
        ${e.tags
          .map((tag) => {
            // Visually highlight the matching tag
            const isMatch =
              filter && tag.toLowerCase().includes(filter) ? " match" : "";
            return `<span class='tag-pill${isMatch}'>${tag}</span>`;
          })
          .join("")}
      </div>
      <p>${parsedNotes}</p>
    </div>
    `;
    })
    .join("");
}
