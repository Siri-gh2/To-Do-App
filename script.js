const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const filters = document.querySelectorAll('.filters button');
const clearCompletedBtn = document.getElementById('clearCompleted');
const taskCount = document.getElementById('taskCount');
const themeToggle = document.getElementById('themeToggle');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// 🌓 Theme toggle
themeToggle.onclick = () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
};

// 🌓 Load theme
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark');
}

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Render tasks
function renderTasks() {
  taskList.innerHTML = '';
  let filtered = tasks.filter(task => {
    if (currentFilter === 'active') return !task.completed;
    if (currentFilter === 'completed') return task.completed;
    return true;
  });

  filtered.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = task.completed ? 'completed' : '';

    const taskText = document.createElement('span');
    taskText.innerHTML = `${task.text} <div class="date">${task.date}</div>`;
    taskText.onclick = () => {
      tasks[index].completed = !tasks[index].completed;
      saveTasks();
      renderTasks();
    };

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '❌';
    deleteBtn.className = 'delete';
    deleteBtn.onclick = () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    };

    li.appendChild(taskText);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });

  // Task count
  const activeCount = tasks.filter(t => !t.completed).length;
  taskCount.textContent = `${activeCount} of ${tasks.length} tasks remaining`;
}

// Add new task
addBtn.onclick = () => {
  const text = taskInput.value.trim();
  if (text) {
    tasks.push({
      text,
      completed: false,
      date: new Date().toLocaleString()
    });
    saveTasks();
    renderTasks();
    taskInput.value = '';
  }
};

// Filter buttons
filters.forEach(btn => {
  btn.onclick = () => {
    filters.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderTasks();
  };
});

// Clear completed
clearCompletedBtn.onclick = () => {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderTasks();
};

renderTasks();
