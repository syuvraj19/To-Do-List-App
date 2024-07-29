// Select DOM elements
const todoInput = document.querySelector('.todo-input');
const dueDateInput = document.querySelector('.due-date-input');
const prioritySelect = document.querySelector('.priority-select');
const todoButton = document.querySelector('.todo-button');
const todoList = document.querySelector('.todo-list');
const filterSelect = document.querySelector('.filter-select');
const searchInput = document.querySelector('.search-input');
const darkModeToggle = document.querySelector('#dark-mode-switch');
const tabs = document.querySelectorAll('.tab');
let currentTab = 'personal';

// Event listeners
todoButton.addEventListener('click', addTodo);
todoList.addEventListener('click', handleTodo);
document.addEventListener('DOMContentLoaded', getTodos);
filterSelect.addEventListener('change', filterTodos);
searchInput.addEventListener('input', searchTasks);
darkModeToggle.addEventListener('change', toggleDarkMode);
tabs.forEach(tab => tab.addEventListener('click', switchTab));

// Functions
function addTodo() {
    if (todoInput.value.trim() === '') {
        return;
    }

    const todoDiv = document.createElement('div');
    todoDiv.classList.add('todo-item');
    todoDiv.setAttribute('data-tab', currentTab);

    const newTodo = document.createElement('div');
    newTodo.innerText = todoInput.value;
    todoDiv.appendChild(newTodo);

    const priority = prioritySelect.value;
    const prioritySpan = document.createElement('div');
    prioritySpan.innerText = priority;
    prioritySpan.classList.add('priority', priority);
    todoDiv.appendChild(prioritySpan);

    const dueDate = dueDateInput.value;
    const dueDateSpan = document.createElement('div');
    dueDateSpan.innerText = dueDate;
    dueDateSpan.classList.add('due-date');
    todoDiv.appendChild(dueDateSpan);

    const actionsDiv = document.createElement('div');
    
    const completedButton = document.createElement('button');
    completedButton.innerText = 'Completed';
    completedButton.classList.add('task-btn', 'complete-btn');
    actionsDiv.appendChild(completedButton);

    const trashButton = document.createElement('button');
    trashButton.innerText = 'Remove Task';
    trashButton.classList.add('task-btn', 'remove-btn');
    actionsDiv.appendChild(trashButton);

    todoDiv.appendChild(actionsDiv);

    todoList.appendChild(todoDiv);

    saveLocalTodos(todoInput.value, currentTab, priority, dueDate);

    todoInput.value = '';
    dueDateInput.value = '';
    prioritySelect.value = 'low';
    filterTodos();
}

function handleTodo(e) {
    const item = e.target;

    if (item.classList.contains('remove-btn')) {
        const todo = item.parentElement.parentElement;
        removeLocalTodos(todo);
        todo.remove();
    }

    if (item.classList.contains('complete-btn')) {
        const todo = item.parentElement.parentElement;
        todo.classList.toggle('completed');
    }
}

function saveLocalTodos(todo, tab, priority, dueDate) {
    let todos = localStorage.getItem('todos') ? JSON.parse(localStorage.getItem('todos')) : [];
    todos.push({ text: todo, tab: tab, priority: priority, dueDate: dueDate });
    localStorage.setItem('todos', JSON.stringify(todos));
}

function getTodos() {
    let todos = localStorage.getItem('todos') ? JSON.parse(localStorage.getItem('todos')) : [];
    todos.forEach(todo => {
        const todoDiv = document.createElement('div');
        todoDiv.classList.add('todo-item');
        todoDiv.setAttribute('data-tab', todo.tab);

        const newTodo = document.createElement('div');
        newTodo.innerText = todo.text;
        todoDiv.appendChild(newTodo);

        const prioritySpan = document.createElement('div');
        prioritySpan.innerText = todo.priority;
        prioritySpan.classList.add('priority', todo.priority);
        todoDiv.appendChild(prioritySpan);

        const dueDateSpan = document.createElement('div');
        dueDateSpan.innerText = todo.dueDate;
        dueDateSpan.classList.add('due-date');
        todoDiv.appendChild(dueDateSpan);

        const actionsDiv = document.createElement('div');
        
        const completedButton = document.createElement('button');
        completedButton.innerText = 'Completed';
        completedButton.classList.add('task-btn', 'complete-btn');
        actionsDiv.appendChild(completedButton);

        const trashButton = document.createElement('button');
        trashButton.innerText = 'Remove Task';
        trashButton.classList.add('task-btn', 'remove-btn');
        actionsDiv.appendChild(trashButton);

        todoDiv.appendChild(actionsDiv);

        todoList.appendChild(todoDiv);
    });
    filterTodos();
}

function removeLocalTodos(todo) {
    let todos = localStorage.getItem('todos') ? JSON.parse(localStorage.getItem('todos')) : [];
    const todoText = todo.children[0].innerText;
    todos = todos.filter(t => t.text !== todoText);
    localStorage.setItem('todos', JSON.stringify(todos));
}

function switchTab(e) {
    tabs.forEach(tab => tab.classList.remove('active'));
    e.target.classList.add('active');
    currentTab = e.target.getAttribute('data-tab');
    filterTodos();
}

function filterTodos() {
    const todos = document.querySelectorAll('.todo-item');
    const filter = filterSelect.value;
    todos.forEach(todo => {
        if (todo.getAttribute('data-tab') === currentTab && (filter === 'all' || todo.querySelector('.priority').innerText === filter)) {
            todo.style.display = 'grid';
        } else {
            todo.style.display = 'none';
        }
    });
}

function searchTasks() {
    const searchText = searchInput.value.toLowerCase();
    const todos = document.querySelectorAll('.todo-item');
    todos.forEach(todo => {
        if (todo.querySelector('div').innerText.toLowerCase().includes(searchText) && todo.getAttribute('data-tab') === currentTab) {
            todo.style.display = 'grid';
        } else {
            todo.style.display = 'none';
        }
    });
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('dark-mode', document.body.classList.contains('dark-mode'));
}

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('dark-mode') === 'true') {
        document.body.classList.add('dark-mode');
        darkModeToggle.checked = true;
    }
});

function checkDeadlines() {
    const todos = document.querySelectorAll('.todo-item');
    const now = new Date();
    todos.forEach(todo => {
        const dueDate = new Date(todo.querySelector('.due-date').innerText);
        if (dueDate <= now && !todo.classList.contains('completed')) {
            alert(`Task "${todo.querySelector('div').innerText}" is due!`);
        }
    });
}

setInterval(checkDeadlines, 60000); // Check every minute
