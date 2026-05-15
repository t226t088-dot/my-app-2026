const monthYearElement = document.getElementById('monthYear');
const calendarDaysElement = document.getElementById('calendarDays');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');

let currentDate = new Date();

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // 月と年を表示
    monthYearElement.textContent = `${year}年 ${month + 1}月`;

    // 月の最初の日と最後の日を取得
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const lastDateOfMonth = new Date(year, month + 1, 0).getDate();

    calendarDaysElement.innerHTML = '';

    // 空のセル（前月の残り）を追加
    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.classList.add('empty');
        calendarDaysElement.appendChild(emptyDiv);
    }

    // 日付を追加
    const today = new Date();
    for (let i = 1; i <= lastDateOfMonth; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.textContent = i;

        // 今日かどうかを判定
        if (
            year === today.getFullYear() &&
            month === today.getMonth() &&
            i === today.getDate()
        ) {
            dayDiv.classList.add('today');
        }

        calendarDaysElement.appendChild(dayDiv);
    }
}

prevMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

nextMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

// 初回レンダリング
renderCalendar();
