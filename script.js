const monthYearElement = document.getElementById('monthYear');
const calendarDaysElement = document.getElementById('calendarDays');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');

// モーダル関連の要素
const eventModal = document.getElementById('eventModal');
const selectedDateText = document.getElementById('selectedDateText');
const eventList = document.getElementById('eventList');
const eventTitleInput = document.getElementById('eventTitle');
const addEventBtn = document.getElementById('addEventBtn');
const closeBtn = document.querySelector('.close-btn');

let currentDate = new Date();
let selectedDateKey = ''; // "YYYY-MM-DD"形式
let events = JSON.parse(localStorage.getItem('calendarEvents')) || {};

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    monthYearElement.textContent = `${year}年 ${month + 1}月`;

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const lastDateOfMonth = new Date(year, month + 1, 0).getDate();

    calendarDaysElement.innerHTML = '';

    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.classList.add('empty');
        calendarDaysElement.appendChild(emptyDiv);
    }

    const today = new Date();
    for (let i = 1; i <= lastDateOfMonth; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.textContent = i;
        
        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;

        if (
            year === today.getFullYear() &&
            month === today.getMonth() &&
            i === today.getDate()
        ) {
            dayDiv.classList.add('today');
        }

        // イベントマーカーの追加
        if (events[dateKey] && events[dateKey].length > 0) {
            const dot = document.createElement('span');
            dot.classList.add('event-dot');
            dayDiv.appendChild(dot);
        }

        dayDiv.addEventListener('click', () => openModal(dateKey, year, month + 1, i));
        calendarDaysElement.appendChild(dayDiv);
    }
}

function openModal(dateKey, year, month, day) {
    selectedDateKey = dateKey;
    selectedDateText.textContent = `${year}年 ${month}月 ${day}日`;
    renderEvents();
    eventModal.style.display = 'flex';
}

function renderEvents() {
    eventList.innerHTML = '';
    const dayEvents = events[selectedDateKey] || [];
    
    if (dayEvents.length === 0) {
        eventList.innerHTML = '<p style="opacity:0.6; text-align:center;">予定はありません</p>';
        return;
    }

    dayEvents.forEach((event, index) => {
        const item = document.createElement('div');
        item.classList.add('event-item');
        item.innerHTML = `
            <span>${event.title}</span>
            <span class="delete-event" onclick="deleteEvent(${index})">&times;</span>
        `;
        eventList.appendChild(item);
    });
}

function deleteEvent(index) {
    events[selectedDateKey].splice(index, 1);
    if (events[selectedDateKey].length === 0) {
        delete events[selectedDateKey];
    }
    saveAndRefresh();
}

// グローバルスコープに公開（onclickで使用するため）
window.deleteEvent = deleteEvent;

addEventBtn.addEventListener('click', () => {
    const title = eventTitleInput.value.trim();
    if (!title) return;

    if (!events[selectedDateKey]) {
        events[selectedDateKey] = [];
    }
    events[selectedDateKey].push({ title });
    eventTitleInput.value = '';
    saveAndRefresh();
});

function saveAndRefresh() {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
    renderEvents();
    renderCalendar();
}

closeBtn.addEventListener('click', () => {
    eventModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === eventModal) {
        eventModal.style.display = 'none';
    }
});

prevMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

nextMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

renderCalendar();
