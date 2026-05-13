const saveBtn = document.getElementById("save-btn");
const clearAllBtn = document.getElementById("clear-all-btn");
const journalOutput = document.getElementById("journal-output");
const importInput = document.getElementById("import-input");

// Load existing entries from LocalStorage on startup
document.getElementById("tag-filter").addEventListener("input", (e) => {
  displayEntries(e.target.value.toLowerCase());
});

window.onload = displayEntries;

// 1. Logic for Processing Tags and Saving
saveBtn.addEventListener("click", () => {
  const topic = document.getElementById("topic").value;
  const notes = document.getElementById("notes").value;
  const tagsRaw = document.getElementById("tags").value;
  const date = new Date().toLocaleDateString();

  if (topic && notes) {
    // Convert comma-separated string into a clean array
    // const entry = { topic, notes, date };
    const tags = tagsRaw
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t !== "");

    // Get old entries. add new one, and save back to local storage
    const entries = JSON.parse(localStorage.getItem("rabbitHoles")) || [];
    entries.unshift({ topic, notes, tags, date }); //Add newst to the top
    localStorage.setItem("rabbitHoles", JSON.stringify(entries));

    displayEntries();
    // Reset fields
    document.getElementById("topic").value = "";
    document.getElementById("notes").value = "";
    document.getElementById("tags").value = "";
  }
});

// 2. Export to JSON File
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

// 3. Import from JSON File
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

// 4. Clear All Logic
clearAllBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete all entries?")) {
    localStorage.removeItem("rabbitHoles");
    displayEntries();
  }
});

// 3. Individual Delete Logic
function deleteEntry(index) {
  const entries = JSON.parse(localStorage.getItem("rabbitHoles")) || [];
  entries.splice(index, 1); // Remove 1 item at the specific index
  localStorage.setItem("rabbitHoles", JSON.stringify(entries));
  displayEntries();
}

function displayEntries(filter = "") {
  const entries = JSON.parse(localStorage.getItem("rabbitHoles")) || [];

  // I am using the index (i) to tell the delete button which entry to remove
  const journalOutput = document.getElementById("journal-output");

  // The filter logic should check if any tag in the entry includes the search term
  const filteredEntries = entries.filter((entry) => {
    if (!filter) return true; // Show all if filter is empty
    return entry.tags.some((tag) => tag.toLowerCase().includes(filter));
  });

  journalOutput.innerHTML = filteredEntries
    .map(
      (e, i) => `
    <div class="journal-entry">
      <button class="delete-btn" onclick="deleteEntry(${i})">✕ Delete</button>
      <small>${e.date}</small>
      <h3>${e.topic}</h3>
      <div class="tag-container">
        ${e.tags
          .map((tag) => {
            // Visually highlight the matching tag
            const isMatch =
              filter && tag.toLowerCase().includes(filter) ? " match" : "";
            `<span class='tag-pill${isMatch}'
          >${tag}</span>`;
            return;
          })
          .join(``)}
          </div>
      <p>${e.notes}</p>
    </div>
    `,
    )
    .join("");
}
