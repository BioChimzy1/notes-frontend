const API = "https://notes-api-1-jylm.onrender.com/notes";

let currentCourse = null;
let currentTopic = null;

/* LOAD ACTIVE COURSE */
fetch(API + "/course")
  .then(r => r.json())
  .then(c => {
    if (!c) return;
    currentCourse = c;
    courseName.innerText = c.title;
    loadTopics();
  });

function createCourse() {
  fetch(API + "/course", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: courseTitle.value })
  }).then(() => location.reload());
}

function loadTopics() {
  fetch(API + "/topics/" + currentCourse._id)
    .then(r => r.json())
    .then(ts => {
      topics.innerHTML = "";
      const done = ts.filter(t => t.completed).length;
      progress.innerText = `Progress: ${done}/${ts.length}`;
      ts.forEach(t => showTopic(t));
    });
}

function addTopic() {
  fetch(API + "/topics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: topicTitle.value, courseId: currentCourse._id })
  }).then(loadTopics);
}

function showTopic(t) {
  const li = document.createElement("li");
  li.textContent = t.title;
  if (t.completed) li.classList.add("completed");

  li.onclick = () => {
    currentTopic = t;
    fetch(API + "/note/" + t._id)
      .then(r => r.json())
      .then(n => note.value = n ? n.content : "");
  };

  const btn = document.createElement("button");
  btn.textContent = "✓";
  btn.onclick = e => {
    e.stopPropagation();
    fetch(API + "/topics/" + t._id + "/complete", { method: "PUT" })
      .then(loadTopics);
  };

  li.appendChild(btn);
  topics.appendChild(li);
}

function saveNote() {
  if (!currentTopic) return alert("Select a topic");
  fetch(API + "/note", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topicId: currentTopic._id, content: note.value })
  });
          }
    
