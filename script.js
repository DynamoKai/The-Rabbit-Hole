const saveBtn = document.getElementById("save-btn");
const journalOutput = document.getElementById("journal-output");

// Load existing entries from LocalStorage on startup
window.onload = displayEntries;

saveBtn.addEventListener("click", () => {
  const topic = document.getElementById("topic").value;
  const notes = document.getElementById("notes").value;
  const date = new Date().toLocaleDateString();

  if (topic && notes) {
    const entry = { topic, notes, date };

    // Get old entries. add new one, and save back to local storage
    const entries = JSON.parse(localStorage.getItem("rabbitHoles")) || [];
    entries.unshift(entry); //Add newst to the top
    localStorage.setItem("rabbitHoles", JSON.stringify(entries));

    displayEntries();

    // Clear inputs
    document.getElementById("topic").value = "";
    document.getElementById("notes").value = "";
  }
});

function displayEntries() {
  const entries = JSON.parse(localStorage.getItem("rabbitHoles")) || [];
  journalOutput.innerHTML = entries
    .map(
      (e) => `
    <div class="journal-entry">
      <small>${e.date}</small>
      <h3>${e.topic}</h3>
      <p>${e.notes}</p>
    </div>

    `,
    )
    .join("");
}
