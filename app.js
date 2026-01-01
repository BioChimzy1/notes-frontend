const API_URL = "https://notes-api-1-jylm.onrender.com/notes";
const notesList = document.getElementById("notes");

// Load notes on page load
fetch(API_URL)
  .then(res => res.json())
  .then(notes => {
    notes.forEach(addNoteToUI);
  });

// Add new note
function addNote() {
  const title = document.getElementById("title").value;
  const body = document.getElementById("body").value;

  if (!title || !body) {
    alert("Fill all fields");
    return;
  }

  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, body })
  })
    .then(res => res.json())
    .then(note => {
      addNoteToUI(note);
      document.getElementById("title").value = "";
      document.getElementById("body").value = "";
    });
}

// Show note on UI
function addNoteToUI(note) {
  const li = document.createElement("li");
  li.innerHTML = `<strong>${note.title}</strong><br>${note.body}`;
  notesList.prepend(li);
}
