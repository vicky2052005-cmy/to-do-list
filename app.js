const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const errorMsg = document.getElementById('error-message');

let tasks = [];

function loadTasks() {
  const stored = localStorage.getItem('tasks');
  if (stored) {
    try {
      tasks = JSON.parse(stored);
    } catch {
      tasks = [];
    }
  }
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = '';

  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = 'task-item' + (task.completed ? ' completed' : '');
    li.dataset.index = index;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = task.completed;

    const span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = task.text;

    const delBtn = document.createElement('button');
    delBtn.className = 'delete-btn';
    delBtn.textContent = '\u00d7';
    delBtn.setAttribute('aria-label', 'Delete task');

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(delBtn);
    taskList.appendChild(li);
  });
}

function addTask(text) {
  tasks.push({ text: text.trim(), completed: false });
  saveTasks();
  renderTasks();
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function showError(message) {
  input.classList.add('error');
  errorMsg.textContent = message;
  errorMsg.classList.remove('hidden');
}

function clearError() {
  input.classList.remove('error');
  errorMsg.classList.add('hidden');
}

form.addEventListener('submit', function (e) {
  e.preventDefault();
  clearError();

  const text = input.value.trim();
  if (!text) {
    showError('Please enter a task.');
    input.focus();
    return;
  }

  addTask(text);
  input.value = '';
  input.focus();
});

input.addEventListener('input', function () {
  if (this.value.trim()) {
    clearError();
  }
});

taskList.addEventListener('click', function (e) {
  const li = e.target.closest('.task-item');
  if (!li) return;

  const index = parseInt(li.dataset.index, 10);

  if (e.target.classList.contains('delete-btn')) {
    deleteTask(index);
  }
});

taskList.addEventListener('change', function (e) {
  if (e.target.classList.contains('task-checkbox')) {
    const li = e.target.closest('.task-item');
    if (!li) return;
    const index = parseInt(li.dataset.index, 10);
    toggleTask(index);
  }
});

loadTasks();
renderTasks();
