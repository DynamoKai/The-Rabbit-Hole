const saveBtn = document.getElementById("save-btn");
const clearAllBtn = document.getElementById("clear-all-btn");
const journalOutput = document.getElementById("journal-output");

// Load existing entries from LocalStorage on startup

window.onload = displayEntries;

// 1. Save entry logic
saveBtn.addEventListener("click", () => {
  const topic = document.getElementById("topic").value;
  const notes = document.getElementById("notes").value;
  const date = new Date().toLocaleDateString();

  if (topic && notes) {
    const entry = { topic, notes, date };

    // Get old entries. add new one, and save back to local storage

    const entries = JSON.parse(localStorage.getItem("rabbitHoles")) || [];
    entries.unshift({ topic, notes, date }); //Add newst to the top
    localStorage.setItem("rabbitHoles", JSON.stringify(entries));

    displayEntries();

    // Clear inputs
    document.getElementById("topic").value = "";
    document.getElementById("notes").value = "";
  }
});

// 2. Clear All Logic
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

function displayEntries() {
  const entries = JSON.parse(localStorage.getItem("rabbitHoles")) || [];
  // We use the index (i) to tell the delete button which entry to remove
  journalOutput.innerHTML = entries
    .map(
      (e, i) => `
    <div class="journal-entry">
      <button class="delete-btn" onclick="deleteEntry(${i})">✕ Delete</button>
      <small>${e.date}</small>
      <h3>${e.topic}</h3>
      <p>${e.notes}</p>
    </div>
    `,
    )
    .join("");
}
