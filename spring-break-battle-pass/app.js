(() => {
  'use strict';

  const STORAGE_KEY = 'spring-break-battle-pass-v1';
  const CHALLENGES_KEY = 'spring-break-battle-pass-challenges-v1';
  const BASE_BEDTIME_MINUTES = 22 * 60; // 10:00 PM

  const defaultChallenges = [
    {
      id: 'ai-superhero',
      title: 'AI Superhero Creator',
      description: 'Use AI to create a superhero with a name, powers, and a picture.',
      level: 'bronze'
    },
    {
      id: 'robot-story',
      title: 'Robot Story Time',
      description: 'Ask AI to write a story where you are the hero.',
      level: 'bronze'
    },
    {
      id: 'animal-mashups',
      title: 'Animal Mashups',
      description: 'Use AI to invent 3 new animals.',
      level: 'bronze'
    },
    {
      id: 'overwatch-hero',
      title: 'Overwatch Hero Pick',
      description: 'Pick an Overwatch hero and explain their powers.',
      level: 'bronze'
    },
    {
      id: 'outfit-picker',
      title: 'Outfit Picker App',
      description: 'Build an app that suggests outfits.',
      level: 'silver'
    },
    {
      id: 'overwatch-role',
      title: 'Try a New Role',
      description: 'Play 3 matches in a role you do not normally use.',
      level: 'silver'
    },
    {
      id: 'ai-dungeon',
      title: 'AI Dungeon Game',
      description: 'Create a text adventure game using AI.',
      level: 'silver'
    },
    {
      id: 'dinner-picker',
      title: 'Random Dinner Picker',
      description: 'Build an app that picks dinner randomly.',
      level: 'silver'
    },
    {
      id: 'ow-stats',
      title: 'Win a Match with Top Stats',
      description: 'Win an Overwatch match while getting top eliminations, damage, or healing.',
      level: 'gold'
    },
    {
      id: 'ai-comic',
      title: 'Make an AI Comic',
      description: 'Use AI to make a 4-panel comic strip.',
      level: 'gold'
    },
    {
      id: 'ow-team-coach',
      title: 'Coach a Team Strategy',
      description: 'Watch a replay and explain how to play better.',
      level: 'gold'
    },
    {
      id: 'family-website',
      title: 'Make a Family Website',
      description: 'Use AI to build a website about the family.',
      level: 'gold'
    },
    {
      id: 'muay-thai-twice',
      title: 'Muay Thai x2',
      description: 'Go to muay thai twice during spring break.',
      level: 'gold'
    }
  ];

  function loadChallenges() {
    try {
      const raw = localStorage.getItem(CHALLENGES_KEY);
      if (!raw) return defaultChallenges;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return defaultChallenges;
      return parsed;
    } catch {
      return defaultChallenges;
    }
  }

  const challenges = loadChallenges();

  const levelOrder = ['bronze', 'silver', 'gold'];
  const levelTitles = {
    bronze: 'Bronze',
    silver: 'Silver',
    gold: 'Gold'
  };

  const challengeArt = {
    'ai-superhero': './assets/challenge-ai-superhero.svg',
    'robot-story': './assets/challenge-robot-story.svg',
    'animal-mashups': './assets/challenge-animal-mashups.svg',
    'overwatch-hero': './assets/challenge-overwatch-hero.svg',
    'outfit-picker': './assets/challenge-outfit-picker.svg',
    'overwatch-role': './assets/challenge-overwatch-role.svg',
    'ai-dungeon': './assets/challenge-ai-dungeon.svg',
    'dinner-picker': './assets/challenge-dinner-picker.svg',
    'ow-stats': './assets/challenge-ow-stats.svg',
    'ai-comic': './assets/challenge-ai-comic.svg',
    'ow-team-coach': './assets/challenge-ow-team-coach.svg',
    'family-website': './assets/challenge-family-website.svg',
    'muay-thai-twice': './assets/challenge-muay-thai-twice.svg'
  };

  const defaultArt = './assets/challenge-ai-superhero.svg';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const els = {
    challengeCount: () => $('#challengeCount'),
    progressTrack: () => $('#progressTrack'),
    bedtimeTable: () => $('#bedtimeTable'),
    bedtimeMinutes: () => $('#bedtimeMinutes'),
    cashTotal: () => $('#cashTotal'),
    newBedtime: () => $('#newBedtime'),
    doneCount: () => $('#doneCount'),
    challengeGroups: () => $('#challengeGroups'),
    saveBtn: () => $('#saveBtn'),
    resetBtn: () => $('#resetBtn')
  };

  const storage = {
    load() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return { rewards: {}, completed: {} };
        const parsed = JSON.parse(raw);
        return {
          rewards: parsed && parsed.rewards ? parsed.rewards : {},
          completed: parsed && parsed.completed ? parsed.completed : {}
        };
      } catch {
        return { rewards: {}, completed: {} };
      }
    },
    save(state) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  };

  let state = storage.load();
  let spotlightChallengeId = null;

  function formatBedtime(totalMinutes) {
    const mins = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60);
    let hour = Math.floor(mins / 60);
    const minute = mins % 60;
    const suffix = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    if (hour === 0) hour = 12;
    return `${hour}:${String(minute).padStart(2, '0')} ${suffix}`;
  }

  function getSummary() {
    let completedCount = 0;
    let bedtimeChoices = 0;
    let cashChoices = 0;

    for (const c of challenges) {
      if (!state.completed[c.id]) continue;
      completedCount += 1;
      if (state.rewards[c.id] === 'bedtime') bedtimeChoices += 1;
      if (state.rewards[c.id] === 'cash') cashChoices += 1;
    }

    const bedtimeMinutes = bedtimeChoices * 5;
    const bedtimeMinutesApplied = bedtimeMinutes;
    const cashTotal = cashChoices * 5;
    const bedtime = formatBedtime(BASE_BEDTIME_MINUTES + bedtimeMinutesApplied);

    return {
      completedCount,
      bedtimeChoices,
      bedtimeMinutes,
      bedtimeMinutesApplied,
      cashChoices,
      cashTotal,
      bedtime
    };
  }

  function getChallengeById(id) {
    return challenges.find(c => c.id === id) || null;
  }

  function rewardButtonsMarkup(id) {
    const current = state.rewards[id] || 'bedtime';
    return `
      <div class="reward-buttons" role="group" aria-label="Choose reward">
        <button type="button" class="reward-btn bedtime ${current === 'bedtime' ? 'active' : ''}" data-reward-id="${id}" data-reward="bedtime">Bedtime +5</button>
        <button type="button" class="reward-btn cash ${current === 'cash' ? 'active' : ''}" data-reward-id="${id}" data-reward="cash">Cash $5</button>
      </div>
    `;
  }

  function challengeArtMarkup(id, title) {
    const src = challengeArt[id] || defaultArt;
    return `<div class="challenge-art" aria-hidden="true"><img src="${src}" alt="${title} art" loading="lazy" decoding="async" /></div>`;
  }

  function renderProgressTrack() {
    const container = els.progressTrack();
    if (!container) return;
    container.innerHTML = '';

    for (let i = 0; i < challenges.length; i += 1) {
      const challenge = challenges[i];
      const done = !!state.completed[challenge.id];
      const slot = document.createElement('button');
      slot.type = 'button';
      slot.className = 'slot' + (done ? ' done' : '');
      if (challenge.id === spotlightChallengeId) {
        slot.className += ' active-target';
      }
      slot.dataset.challengeId = challenge.id;
      slot.setAttribute('aria-label', `Jump to ${challenge.title}`);
      slot.innerHTML = `<span class="slot-number">${i + 1}</span><span class="stamp">Done</span>`;
      container.appendChild(slot);
    }
  }

  function renderBedtimeTable() {
    const table = els.bedtimeTable();
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

  function renderStats() {
    const summary = getSummary();
    els.challengeCount().textContent = `${summary.completedCount} / ${challenges.length}`;
    els.doneCount().textContent = String(summary.completedCount);
    els.bedtimeMinutes().textContent = `${summary.bedtimeMinutesApplied} min`;
    els.cashTotal().textContent = `$${summary.cashTotal}`;
    els.newBedtime().textContent = summary.bedtime;
  }

  function focusChallenge(id) {
    const card = document.querySelector(`[data-challenge-card="${id}"]`);
    if (!card) return;
    spotlightChallengeId = id;
    renderProgressTrack();
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    card.classList.add('spotlight');
    setTimeout(() => card.classList.remove('spotlight'), 1400);
  }

  function renderChallenges() {
    const host = els.challengeGroups();
    host.innerHTML = '';

    for (const level of levelOrder) {
      const wrapper = document.createElement('div');
      wrapper.className = `challenge-group ${level}`;
      wrapper.innerHTML = `<h3>${levelTitles[level]} Challenges</h3>`;

      const list = document.createElement('div');
      list.className = 'challenge-list';

      for (const c of challenges.filter(ch => ch.level === level)) {
        const item = document.createElement('div');
        item.className = 'challenge';
        item.dataset.challengeCard = c.id;
        if (state.completed[c.id]) item.classList.add('done-card');
        const checked = !!state.completed[c.id];

        item.innerHTML = `
          <input class="challenge-toggle" type="checkbox" data-id="${c.id}" ${checked ? 'checked' : ''} />
          ${challengeArtMarkup(c.id, c.title)}
          <div class="challenge-main">
            <div class="challenge-top">
              <div class="challenge-title">${c.title}</div>
              <span class="level-chip ${c.level}">${levelTitles[c.level]}</span>
            </div>
            <div class="challenge-desc">${c.description}</div>
            ${rewardButtonsMarkup(c.id)}
          </div>
        `;

        list.appendChild(item);
      }

      wrapper.appendChild(list);
      host.appendChild(wrapper);
    }
  }

  function bindEvents() {
    document.addEventListener('change', (event) => {
      const t = event.target;
      if (!(t instanceof HTMLElement)) return;

      if (t.matches('input[type="checkbox"][data-id]')) {
        const id = t.getAttribute('data-id');
        if (!id) return;
        const before = !!state.completed[id];
        state.completed[id] = t.checked;
        if (t.checked && !state.rewards[id]) state.rewards[id] = 'bedtime';
        storage.save(state);
        spotlightChallengeId = id;
        render();

        if (!before && t.checked) {
          try {
            window.SB && window.SB.fx && window.SB.fx.vibrate(22);
            window.SB && window.SB.fx && window.SB.fx.beep();
            const card = t.closest('.challenge') || t;
            window.SB && window.SB.fx && window.SB.fx.burstConfetti(card);
          } catch {
            // ignore
          }
        }
        return;
      }
    });

    document.addEventListener('click', (event) => {
      const t = event.target;
      if (!(t instanceof HTMLElement)) return;

      if (t.matches('.slot[data-challenge-id]')) {
        const id = t.getAttribute('data-challenge-id');
        if (id) focusChallenge(id);
        return;
      }

      if (t.matches('button.reward-btn[data-reward-id][data-reward]')) {
        const id = t.getAttribute('data-reward-id');
        const reward = t.getAttribute('data-reward');
        if (!id || !reward) return;
        state.rewards[id] = reward;
        storage.save(state);
        renderStats();

        const group = t.closest('.reward-buttons');
        if (group) {
          for (const btn of group.querySelectorAll('button.reward-btn')) {
            btn.classList.toggle('active', btn.getAttribute('data-reward') === reward);
          }
        }

        try {
          window.SB && window.SB.fx && window.SB.fx.vibrate(10);
        } catch {
          // ignore
        }
        return;
      }

    });

    els.saveBtn().addEventListener('click', () => {
      storage.save(state);
      const btn = els.saveBtn();
      const original = btn.textContent;
      btn.textContent = 'Saved';
      setTimeout(() => {
        btn.textContent = original;
      }, 1200);
    });

    els.resetBtn().addEventListener('click', () => {
      const ok = window.confirm('Reset all challenge progress and rewards?');
      if (!ok) return;
      state = { rewards: {}, completed: {} };
      storage.save(state);
      render();
    });
  }

  function render() {
    if (!spotlightChallengeId && challenges[0]) spotlightChallengeId = challenges[0].id;
    renderChallenges();
    renderProgressTrack();
    renderStats();
    renderBedtimeTable();
  }

  render();
  bindEvents();
})();
