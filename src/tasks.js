// tasks.js
// Lógica da aba Tasks

document.addEventListener('DOMContentLoaded', () => {
    const tasksList = document.getElementById('tasks-list');
    const addTaskBtn = document.getElementById('add-task');
    const taskInput = document.getElementById('task-input');
    if (addTaskBtn && taskInput && tasksList) {
        addTaskBtn.addEventListener('click', () => {
            const val = taskInput.value.trim();
            if (val) {
                const li = document.createElement('li');
                li.innerHTML = `<input type='checkbox' class='mr-2 align-middle'>${val}`;
                tasksList.appendChild(li);
                taskInput.value = '';
            }
        });
        tasksList.addEventListener('click', e => {
            if (e.target.tagName === 'INPUT' && e.target.type === 'checkbox') {
                const li = e.target.closest('li');
                if (li) li.remove();
            }
        });
    }
});
