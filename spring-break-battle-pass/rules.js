(() => {
  'use strict';

  const BASE_BEDTIME_MINUTES = 22 * 60; // 10:00 PM
  const tierValues = [2, 4, 6];

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

    const examples = [
      ['1 bronze challenge', tierValues[0]],
      ['1 silver challenge', tierValues[1]],
      ['1 gold challenge', tierValues[2]],
      ['2 silver challenges', tierValues[1] * 2],
      ['1 gold + 1 bronze', tierValues[2] + tierValues[0]],
      ['2 gold challenges', tierValues[2] * 2]
    ];

    for (const [label, minutes] of examples) {
      const row = document.createElement('div');
      row.className = 'time-row';
      const applied = minutes;
      row.innerHTML = `<span>${label} = +${minutes} min</span><strong>${formatBedtime(
        BASE_BEDTIME_MINUTES + applied
      )}</strong>`;
      table.appendChild(row);
    }
  }

  renderBedtimeTable();
})();
