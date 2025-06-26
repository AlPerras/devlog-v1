# 📘 DevLog V1 – Personal Developer Journal

DevLog is a lightweight journal application built with **HTML, CSS, and vanilla JavaScript**. It allows developers to track their daily learning progress, store notes persistently in the browser, and interact with the app through a polished UI.

This is the completed version of **Stage 1** in a multi-stage project roadmap from beginner to full-stack expert.

---

## 🚀 Features

- ✅ Add journal entries with auto date stamps
- 💾 Persist entries in `localStorage` (no backend required)
- 🗑️ Delete individual entries with confirmation
- 🔍 Live search to filter entries by keyword
- 📥 Download all entries as a `.txt` file
- 🧮 Entry counter updates live
- ⌨️ Ctrl+Enter or Cmd+Enter to submit form
- 🧘 Auto-focus on text input when the page loads
- ⚠️ Feedback for empty search result

---

## 🗂 File Structure

```
devlog-v1/
├── index.html       # HTML layout with form and entry display
├── style.css        # All styles: layout, buttons, responsive UI
└── script.js        # JavaScript logic: storage, events, DOM updates
```

---

## 🧠 How It Works

### `index.html`

- Contains:

  - A `<form>` with a `<textarea>` and submit button
  - A `<ul>` for listing entries
  - A search input
  - A message for empty search results
  - A counter to show how many entries are logged
  - A download button to export entries

---

## 🎨 `style.css`

- Uses Flexbox for layout
- Provides clean, readable UI
- Button styling with hover states
- Responsive spacing and alignment
- Highlighted delete buttons and input focus states

---

## 🧾 `script.js` – Full Breakdown

This is where all the logic lives. Below is a breakdown of how each part of the app functions in JavaScript.

### ✅ Global Variables:

```js
const form = document.getElementById("entry-form");
const textarea = document.getElementById("entry-text");
const list = document.getElementById("entries-list");
const searchInput = document.getElementById("search-input");
const downloadBtn = document.getElementById("download-btn");
const entryCount = document.getElementById("entry-count");
const noResults = document.getElementById("no-results");
```

- These are references to key DOM elements.
- They let us update or listen to changes in the form, list, search input, etc.

---

### ✅ `entriesArray` and LocalStorage

```js
let entriesArray = [];
const savedEntries = localStorage.getItem("devlogEntries");
```

- `entriesArray` is where we keep all the entries in memory.
- On load, we check if `localStorage` already has saved entries.

```js
if (savedEntries) {
  entriesArray = JSON.parse(savedEntries);
  entriesArray.forEach((entryObj) => {
    addEntry(entryObj, true); // skip saving again
  });
  updateEntryCount();
}
```

- This loads saved entries and displays them.

---

### ✅ `addEntry(entryObj, skipSave = false)`

```js
function addEntry(entryObj, skipSave = false) {
  if (!entryObj || !entryObj.text) return;
```

- Creates a new entry in the DOM.
- Accepts an object like `{ id, text, date }`
- `skipSave` is used when loading entries so we don't double-save.

```js
const li = document.createElement("li");
const content = document.createElement("div");
content.classList.add("entry-content");
content.textContent = `[${entryObj.date}] ${entryObj.text}`;
```

- Creates a `<li>` for the list.
- Formats the entry to show date and text.

```js
const deleteBtn = document.createElement("button");
deleteBtn.textContent = "🗑";
deleteBtn.classList.add("delete-btn");
```

- Adds a delete button to each entry.

```js
li.appendChild(content);
li.appendChild(deleteBtn);
list.appendChild(li);
```

- Appends everything to the list.

```js
if (!skipSave) {
  entriesArray.push(entryObj);
  saveEntriesToStorage();
}
```

- Only save to localStorage if this is a new entry.

```js
textarea.value = "";
updateEntryCount();
```

- Clears the form and updates the entry count.

```js
deleteBtn.addEventListener("click", () => {
  const confirmDelete = confirm("Are you sure?");
  if (!confirmDelete) return;
  list.removeChild(li);
  entriesArray = entriesArray.filter((entry) => entry.id !== entryObj.id);
  saveEntriesToStorage();
  updateEntryCount();
});
```

- Adds a click event to the 🗑 button to remove the entry.

---

### ✅ `saveEntriesToStorage()`

```js
function saveEntriesToStorage() {
  localStorage.setItem("devlogEntries", JSON.stringify(entriesArray));
}
```

- Converts the array to a string and saves it in the browser.

---

### ✅ `updateEntryCount()`

```js
function updateEntryCount() {
  entryCount.textContent = `You have ${entriesArray.length} entr${
    entriesArray.length === 1 ? "y" : "ies"
  } logged.`;
}
```

- Shows a count like: `You have 3 entries logged.`

---

### ✅ Form Submission Listener

```js
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const entryText = textarea.value.trim();
  if (!entryText) return;
  const today = new Date().toLocaleDateString("en-AU");
  const entryObj = { id: Date.now(), text: entryText, date: today };
  addEntry(entryObj);
});
```

- Listens for the submit event, creates a new entry object, and adds it.

---

### ✅ Ctrl+Enter Support

```js
textarea.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    form.requestSubmit();
  }
});
```

- Lets you submit the form using `Ctrl+Enter` or `Cmd+Enter`.

---

### ✅ Search Filter

```js
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
```

- Filters the entries live based on what's typed.
- Hides entries that don’t match and shows a "No results" message if needed.

---

### ✅ Download as Text File

```js
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
```

- Converts your entries into text
- Downloads them to your computer as `dev-journal.txt`

---

### ✅ Auto-focus

```js
window.addEventListener("DOMContentLoaded", () => {
  textarea.focus();
});
```

- Sets focus to the textarea automatically on page load

---

## 🛠 How to Use

1. Open `index.html` in a browser
2. Type a daily log and hit **Add Entry** or `Ctrl+Enter`
3. Use the **search bar** to filter past entries
4. Delete entries with the 🗑️ icon
5. Export your journal with **Download as .txt**

---

## 🧭 Next Steps: Stage 2

You’ll rebuild this app using **React**, with:

- Component-based UI
- Routing with React Router
- Global state (Context API or Redux)
- Responsive layout and theming

---

## 👨‍💻 Author

**Alexandre Perras**
Stage 1 complete ✅ — moving on to Stage 2!
