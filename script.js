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
    
    // 前月の最後の日を取得（空きスペースを埋めるため）
    const lastDateOfPrevMonth = new Date(year, month, 0).getDate();

    calendarDaysElement.innerHTML = '';

    // 前月の日付を表示
    for (let i = firstDayOfMonth; i > 0; i--) {
        const prevMonthDate = lastDateOfPrevMonth - i + 1;
        const prevYear = month === 0 ? year - 1 : year;
        const prevMonth = month === 0 ? 12 : month;
        const dateKey = `${prevYear}-${String(prevMonth).padStart(2, '0')}-${String(prevMonthDate).padStart(2, '0')}`;
        
        createDayElement(prevMonthDate, dateKey, prevYear, prevMonth, true);
    }

    // 当月の日付を表示
    const today = new Date();
    for (let i = 1; i <= lastDateOfMonth; i++) {
        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        const isToday = year === today.getFullYear() && month === today.getMonth() && i === today.getDate();
        
        createDayElement(i, dateKey, year, month + 1, false, isToday);
    }

    // 次月の日付を表示（グリッドを埋める）
    const totalDaysShown = calendarDaysElement.children.length;
    const remainingDays = 42 - totalDaysShown; // 6行分(7x6=42)を常に表示
    for (let i = 1; i <= remainingDays; i++) {
        const nextYear = month === 11 ? year + 1 : year;
        const nextMonth = month === 11 ? 1 : month + 2;
        const dateKey = `${nextYear}-${String(nextMonth).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        
        createDayElement(i, dateKey, nextYear, nextMonth, true);
    }
}

function createDayElement(day, dateKey, year, month, isOtherMonth, isToday = false) {
    const dayDiv = document.createElement('div');
    dayDiv.textContent = day;
    
    if (isOtherMonth) {
        dayDiv.style.opacity = '0.4'; // 他の月は薄く表示
    }
    
    if (isToday) {
        dayDiv.classList.add('today');
    }

    // イベントマーカーの追加
    if (events[dateKey] && events[dateKey].length > 0) {
        const dot = document.createElement('span');
        dot.classList.add('event-dot');
        dayDiv.appendChild(dot);
    }

    dayDiv.addEventListener('click', () => openModal(dateKey, year, month, day));
    calendarDaysElement.appendChild(dayDiv);
}

function openModal(dateKey, year, month, day) {
    selectedDateKey = dateKey;
    selectedDateText.textContent = `${year}年 ${month}月 ${day}日`;
    renderEvents();
    eventModal.style.display = 'flex';
    setTimeout(() => eventTitleInput.focus(), 100);
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
            <span class="delete-event" onclick="deleteEvent(event, ${index})">&times;</span>
        `;
        eventList.appendChild(item);
    });
}

function deleteEvent(e, index) {
    if (e) e.stopPropagation();
    events[selectedDateKey].splice(index, 1);
    if (events[selectedDateKey].length === 0) {
        delete events[selectedDateKey];
    }
    saveAndRefresh();
}

window.deleteEvent = deleteEvent;

function handleAddEvent() {
    const title = eventTitleInput.value.trim();
    if (!title) {
        eventTitleInput.style.border = '1px solid #ff4b5c';
        setTimeout(() => eventTitleInput.style.border = '1px solid var(--glass-border)', 1000);
        return;
    }

    if (!events[selectedDateKey]) {
        events[selectedDateKey] = [];
    }
    events[selectedDateKey].push({ title });
    eventTitleInput.value = '';
    saveAndRefresh();
}

addEventBtn.addEventListener('click', handleAddEvent);

eventTitleInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        handleAddEvent();
    }
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
