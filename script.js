console.log("Devlog is running...");

const form = document.getElementById("entry-form");
const textarea = document.getElementById("entry-text");
const list = document.getElementById("entries-list");
const searchInput = document.getElementById("search-input");
const downloadBtn = document.getElementById("download-btn");
const entryCount = document.getElementById("entry-count");
const noResults = document.getElementById("no-results");

let entriesArray = [];
const savedEntries = localStorage.getItem("devlogEntries");

if (savedEntries) {
  const parsed = JSON.parse(savedEntries);
  if (Array.isArray(parsed)) {
    entriesArray = parsed;
    parsed.forEach((entryObj) => {
      addEntry(entryObj, true); // skipSave prevents re-adding
    });
  }
  updateEntryCount();
}

function updateEntryCount() {
  entryCount.textContent = `You have ${entriesArray.length} entr${
    entriesArray.length === 1 ? "y" : "ies"
  } logged.`;
}

function saveEntriesToStorage() {
  localStorage.setItem("devlogEntries", JSON.stringify(entriesArray));
}

function addEntry(entryObj, skipSave = false) {
  if (!entryObj || !entryObj.text) return;

  const li = document.createElement("li");

  const content = document.createElement("div");
  content.classList.add("entry-content");
  content.textContent = `[${entryObj.date}] ${entryObj.text}`;

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "🗑";
  deleteBtn.classList.add("delete-btn");

  li.appendChild(content);
  li.appendChild(deleteBtn);
  list.appendChild(li);

  if (!skipSave) {
    entriesArray.push(entryObj);
    saveEntriesToStorage();
  }

  textarea.value = "";
  updateEntryCount();

  deleteBtn.addEventListener("click", () => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this entry?"
    );
    if (!confirmDelete) return;
    list.removeChild(li);
    entriesArray = entriesArray.filter((entry) => entry.id !== entryObj.id);
    saveEntriesToStorage();
    updateEntryCount();
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const entryText = textarea.value.trim();
  if (!entryText) return;

  const today = new Date().toLocaleDateString("en-AU");
  const entryObj = { id: Date.now(), text: entryText, date: today };
  addEntry(entryObj);
});

textarea.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    form.requestSubmit();
  }
});

searchInput.addEventListener("input", (e) => {
  const keyword = e.target.value.toLowerCase();
  const listItems = list.getElementsByTagName("li");

  let anyVisible = false;

  Array.from(listItems).forEach((li) => {
    const text = li.querySelector(".entry-content").textContent.toLowerCase();
    const isVisible = text.includes(keyword);
    li.style.display = isVisible ? "block" : "none";
    if (isVisible) anyVisible = true;
  });

  noResults.style.display = anyVisible ? "none" : "block";
});

downloadBtn.addEventListener("click", () => {
  if (entriesArray.length === 0) {
    alert("No entries to download.");
    return;
  }

  const text = entriesArray
    .filter((entry) => entry && entry.text && entry.date)
    .map((entry) => `[${entry.date}] ${entry.text}`)
    .join("\n");

  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "dev-journal.txt";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
});

window.addEventListener("DOMContentLoaded", () => {
  textarea.focus();
});
