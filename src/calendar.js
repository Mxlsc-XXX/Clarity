// calendar.js
// Lógica da aba Calendar

document.addEventListener('DOMContentLoaded', () => {
    const calList = document.getElementById('calendar-list');
    const addEventBtn = document.getElementById('add-event');
    const calInput = document.getElementById('calendar-input');
    if (addEventBtn && calInput && calList) {
        addEventBtn.addEventListener('click', () => {
            const val = calInput.value.trim();
            if (val) {
                const li = document.createElement('li');
                li.innerHTML = `${val} <span class='text-xs text-gray-500'>Novo</span>`;
                calList.appendChild(li);
                calInput.value = '';
            }
        });
    }
});
