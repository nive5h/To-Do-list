const inp = document.getElementById("inp");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const emptyMsg = document.getElementById("emptyMsg");

function loadTasks() {
  const saved = JSON.parse(localStorage.getItem("tasksData") || "[]");
  taskList.innerHTML = "";
  saved.forEach(task => createTaskElement(task));
  updateEmptyMsg();
}

function saveTasks() {
  const tasks = [];
  taskList.querySelectorAll("li").forEach(li => {
    tasks.push(li.querySelector(".task-text").textContent);
  });
  localStorage.setItem("tasksData", JSON.stringify(tasks));
}

function createTaskElement(taskText) {
  const li = document.createElement("li");
  li.innerHTML = `
    <span class="task-text">${taskText}</span>
    <div class="btn-group">
      <button class="edit-btn" title="Edit">✏️</button>
      <button class="delete-btn" title="Delete">🗑️</button>
    </div>
  `;

  li.querySelector(".edit-btn").onclick = () => enterEditMode(li);
  li.querySelector(".delete-btn").onclick = () => {
    if (confirm("Delete this task?")) {
      li.remove();
      saveTasks();
      updateEmptyMsg();
    }
  };

  taskList.appendChild(li);
}

function enterEditMode(li) {
  const taskText = li.querySelector(".task-text");
  const currentText = taskText.textContent;

  li.innerHTML = `
    <input class="edit-input" type="text" value="${currentText}">
    <div class="btn-group">
      <button class="save-btn" title="Save">✅</button>
      <button class="cancel-btn" title="Cancel">❌</button>
    </div>
  `;

  const editInput = li.querySelector(".edit-input");
  editInput.focus();
  editInput.setSelectionRange(editInput.value.length, editInput.value.length);

  li.querySelector(".save-btn").onclick = () => saveEdit(li, editInput, currentText);
  li.querySelector(".cancel-btn").onclick = () => cancelEdit(li, currentText);

  editInput.addEventListener("keydown", e => {
    if (e.key === "Enter") saveEdit(li, editInput, currentText);
    if (e.key === "Escape") cancelEdit(li, currentText);
  });
}

function saveEdit(li, editInput, originalText) {
  const newText = editInput.value.trim();
  if (newText === "") {
    alert("Task cannot be empty.");
    return;
  }
  li.innerHTML = `
    <span class="task-text">${newText}</span>
    <div class="btn-group">
      <button class="edit-btn" title="Edit">✏️</button>
      <button class="delete-btn" title="Delete">🗑️</button>
    </div>
  `;
  li.querySelector(".edit-btn").onclick = () => enterEditMode(li);
  li.querySelector(".delete-btn").onclick = () => {
    if (confirm("Delete this task?")) {
      li.remove();
      saveTasks();
      updateEmptyMsg();
    }
  };
  saveTasks();
}

function cancelEdit(li, originalText) {
  li.innerHTML = `
    <span class="task-text">${originalText}</span>
    <div class="btn-group">
      <button class="edit-btn" title="Edit">✏️</button>
      <button class="delete-btn" title="Delete">🗑️</button>
    </div>
  `;
  li.querySelector(".edit-btn").onclick = () => enterEditMode(li);
  li.querySelector(".delete-btn").onclick = () => {
    if (confirm("Delete this task?")) {
      li.remove();
      saveTasks();
      updateEmptyMsg();
    }
  };
}

function addTask() {
  const task = inp.value.trim();
  if (task === "") {
    alert("Please enter a task");
    return;
  }
  createTaskElement(task);
  inp.value = "";
  saveTasks();
  updateEmptyMsg();
}

function updateEmptyMsg() {
  emptyMsg.style.display = taskList.children.length === 0 ? "block" : "none";
}

addBtn.onclick = addTask;
inp.addEventListener("keypress", e => {
  if (e.key === "Enter") addTask();
});

loadTasks();
