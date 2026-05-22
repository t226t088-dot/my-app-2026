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
let events = {};
try {
    const savedEvents = localStorage.getItem('calendarEvents');
    if (savedEvents) {
        events = JSON.parse(savedEvents);
    }
} catch (e) {
    console.error('Failed to parse events:', e);
    events = {};
}

const seasonalCharacters = [
    { emoji: '⛄', name: 'ゆきだるまくん' }, // 1月
    { emoji: '👹', name: 'おにくん' },     // 2月
    { emoji: '🐰', name: 'うさぎちゃん' }, // 3月
    { emoji: '🌸', name: 'さくらちゃん' }, // 4月
    { emoji: '🎏', name: 'こいのぼりくん' }, // 5月
    { emoji: '🐸', name: 'かえるくん' },   // 6月
    { emoji: '🎋', name: 'おりひめちゃん' }, // 7月
    { emoji: '🍦', name: 'ソフトくん' },   // 8月
    { emoji: '🎑', name: 'おつきみうさぎ' }, // 9月
    { emoji: '🎃', name: 'かぼちゃくん' }, // 10月
    { emoji: '🐿️', name: 'りすくん' },     // 11月
    { emoji: '🎅', name: 'サンタさん' }    // 12月
];

// キャラクターのセリフを更新する関数
function updateCharacter() {
    const today = new Date();
    const month = today.getMonth();
    const character = seasonalCharacters[month];
    
    const characterEmojiElement = document.getElementById('characterEmoji');
    const speechBubble = document.getElementById('speechBubble');
    const todayEventsText = document.getElementById('todayEventsText');

    if (!characterEmojiElement || !speechBubble || !todayEventsText) return;

    // テキストを即座に更新
    const year = today.getFullYear();
    const monthNum = today.getMonth() + 1;
    const dayNum = today.getDate();
    const dateKey = `${year}-${String(monthNum).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    
    let todayEvents = [];
    if (events && events[dateKey]) {
        todayEvents = events[dateKey];
    }

    let message = `<b>${character.name}</b><br>`;
    if (todayEvents.length === 0) {
        message += `やっほー！今日は特に予定はないみたい。のんびり過ごしてね🍵`;
    } else {
        message += `おつかれさま！今日は <b>${todayEvents.length}件</b> の予定があるよ。応援してるね✨`;
    }

    todayEventsText.innerHTML = message;
    characterEmojiElement.textContent = character.emoji;

    // 吹き出しを表示
    speechBubble.classList.add('show');
}

// キャラクタークリックで表示切替
document.getElementById('seasonalCharacterContainer').addEventListener('click', () => {
    document.getElementById('speechBubble').classList.toggle('show');
});

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    updateCharacter();

    const emojis = ['❄️', '🍫', '🌸', '🌱', '🎏', '☔', '🎋', '🌻', '🎑', '🎃', '🍂', '🎄'];
    const emoji = emojis[month] || '';
    monthYearElement.innerHTML = `${year}<span>年</span> ${month + 1}<span>月</span> <span class="header-emoji">${emoji}</span>`;

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const lastDateOfMonth = new Date(year, month + 1, 0).getDate();
    const lastDateOfPrevMonth = new Date(year, month, 0).getDate();

    calendarDaysElement.innerHTML = '';

    // 前月の日付
    for (let i = firstDayOfMonth; i > 0; i--) {
        const day = lastDateOfPrevMonth - i + 1;
        const prevYear = month === 0 ? year - 1 : year;
        const prevMonthNum = month === 0 ? 12 : month;
        const dateKey = `${prevYear}-${String(prevMonthNum).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        createDayElement(day, dateKey, prevYear, prevMonthNum, true);
    }

    // 当月の日付
    const today = new Date();
    for (let i = 1; i <= lastDateOfMonth; i++) {
        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        const isToday = year === today.getFullYear() && month === today.getMonth() && i === today.getDate();
        createDayElement(i, dateKey, year, month + 1, false, isToday);
    }

    // 次月の日付
    const totalDaysShown = calendarDaysElement.children.length;
    const remainingDays = 42 - totalDaysShown;
    for (let i = 1; i <= remainingDays; i++) {
        const nextYear = month === 11 ? year + 1 : year;
        const nextMonthNum = month === 11 ? 1 : month + 2;
        const dateKey = `${nextYear}-${String(nextMonthNum).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        createDayElement(i, dateKey, nextYear, nextMonthNum, true);
    }
}

function createDayElement(day, dateKey, year, month, isOtherMonth, isToday = false) {
    const dayDiv = document.createElement('div');
    
    const dayNumber = document.createElement('span');
    dayNumber.textContent = day;
    dayNumber.style.fontSize = '1.1rem';
    dayNumber.style.fontWeight = '500';
    dayDiv.appendChild(dayNumber);
    
    if (isOtherMonth) {
        dayDiv.style.opacity = '0.3';
    }
    
    if (isToday) {
        dayDiv.classList.add('today');
    }

    // 予定件数の表示（ここを強化）
    const dayEvents = events[dateKey] || [];
    if (dayEvents.length > 0) {
        const countBadge = document.createElement('span');
        countBadge.classList.add('event-count');
        countBadge.textContent = `${dayEvents.length}件`;
        dayDiv.appendChild(countBadge);
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
        eventList.innerHTML = '<p style="opacity:0.5; text-align:center; padding: 20px;">まだ予定はないよ 🕊️</p>';
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
    if (!events[selectedDateKey]) return;
    
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
        eventTitleInput.style.borderColor = '#ff4b5c';
        setTimeout(() => eventTitleInput.style.borderColor = 'rgba(255,255,255,0.3)', 1000);
        return;
    }

    if (!events[selectedDateKey]) {
        events[selectedDateKey] = [];
    }
    events[selectedDateKey].push({ title: title });
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
