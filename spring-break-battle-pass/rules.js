(() => {
  'use strict';

  const BASE_BEDTIME_MINUTES = 22 * 60; // 10:00 PM

  const $ = (sel, root = document) => root.querySelector(sel);

  function formatBedtime(totalMinutes) {
    const mins = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60);
    let hour = Math.floor(mins / 60);
    const minute = mins % 60;
    const suffix = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    if (hour === 0) hour = 12;
    return `${hour}:${String(minute).padStart(2, '0')} ${suffix}`;
  }

  function renderBedtimeTable() {
    const table = $('#bedtimeTable');
    if (!table) return;
    table.innerHTML = '';

    for (const count of [1, 2, 3, 4, 5, 6]) {
      const row = document.createElement('div');
      row.className = 'time-row';
      const minutes = count * 5;
      const applied = minutes;
      row.innerHTML = `<span>${count} challenge${count > 1 ? 's' : ''} = +${minutes} min</span><strong>${formatBedtime(
        BASE_BEDTIME_MINUTES + applied
      )}</strong>`;
      table.appendChild(row);
    }
  }

  renderBedtimeTable();
})();
