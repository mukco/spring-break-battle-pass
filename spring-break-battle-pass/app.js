(() => {
  'use strict';

  const STORAGE_KEY = 'spring-break-battle-pass-v1';
  const CHALLENGES_KEY = 'spring-break-battle-pass-challenges-v1';
  const BASE_BEDTIME_MINUTES = 22 * 60; // 10:00 PM

  const defaultChallenges = [
    {
      id: 'ai-superhero',
      title: 'AI Superhero Creator',
      description:
        'Design your own original superhero with AI: pick a cool hero name, describe at least 3 powers, and generate character art you can show to the family.',
      level: 'bronze'
    },
    {
      id: 'robot-story',
      title: 'Robot Story Time',
      description:
        'Co-write a short robot adventure with AI where you are the main character. Give your hero a mission, a challenge, and a happy ending.',
      level: 'bronze'
    },
    {
      id: 'animal-mashups',
      title: 'Animal Mashups',
      description:
        'Invent 3 brand-new mashup animals with AI. Each one needs a name, where it lives, and one funny or helpful power.',
      level: 'bronze'
    },
    {
      id: 'overwatch-hero',
      title: 'Overwatch Hero Pick',
      description:
        'Pick one Overwatch hero and explain their abilities like a mini coach. Share when to use each ability and one smart team combo.',
      level: 'bronze'
    },
    {
      id: 'kpop-trivia',
      title: 'K-Pop Trivia Lightning Round',
      description:
        'Create a 10-question K-pop trivia game (groups, songs, and fun facts) and run it with the family. Try to beat your own score in round 2.',
      level: 'bronze'
    },
    {
      id: 'hangout-addi-cameron',
      title: 'Friend Hangout Mission',
      description:
        'Plan and do a fun hangout with Addi or Cameron. Do one shared activity, be a great friend, and share your favorite part after.',
      level: 'bronze'
    },
    {
      id: 'oldies-dance-mom',
      title: 'Oldies Dance with Mom',
      description:
        'Pick an oldies song and do a full dance with Mom. Add at least one silly spin or signature move to make it memorable.',
      level: 'bronze'
    },
    {
      id: 'spiderman-reading',
      title: 'Spider-Man Comic Finish',
      description:
        'Finish reading a Spider-Man comic issue or chapter set. Share your favorite scene, favorite character moment, and one new thing you learned.',
      level: 'silver'
    },
    {
      id: 'muay-thai-twice',
      title: 'Muay Thai x2',
      description:
        'Attend Muay Thai practice at least twice during spring break and show one combo or technique you improved between sessions.',
      level: 'silver'
    },
    {
      id: 'overwatch-role',
      title: 'Try a New Role',
      description:
        'Play 3 Overwatch matches in a role you do not normally pick. Afterward, share what was hardest and one thing you got better at.',
      level: 'silver'
    },
    {
      id: 'kpop-dance',
      title: 'K-Pop Dance Practice',
      description:
        'Learn 20-30 seconds of a K-pop dance challenge and perform it for the family. Bonus points if you teach one move to someone else.',
      level: 'silver'
    },
    {
      id: 'dinner-picker',
      title: 'Random Dinner Picker',
      description:
        'Build a random dinner picker app with at least 8 meal options. Add a "re-spin" button so the family can reroll if needed.',
      level: 'silver'
    },
    {
      id: 'ai-comic',
      title: 'Make an AI Comic',
      description:
        'Use AI tools to create a 4-panel comic with a setup, a problem, and a funny ending. Add your own title and dialogue bubbles.',
      level: 'silver'
    },
    {
      id: 'family-dessert',
      title: 'Dessert Chef Challenge',
      description:
        'Cook or bake a dessert for the family from start to finish, with help for safety if needed. Plate it nicely and serve everyone first.',
      level: 'silver'
    },
    {
      id: 'hour-with-sister',
      title: 'One-Hour Sister Time',
      description:
        'Spend one full hour with your little sister doing activities she enjoys, with no rushing. Make her feel included and have fun together.',
      level: 'silver'
    },
    {
      id: 'ow-five-games-dad',
      title: 'Overwatch Squad with Dad',
      description:
        'Play 5 Overwatch games with Dad as a team. Focus on communication, teamwork, and celebrating one good play each game.',
      level: 'silver'
    },
    {
      id: 'outfit-picker',
      title: 'Outfit Picker App',
      description:
        'Build a simple app that suggests an outfit based on weather or activity. Include at least 3 outfit choices and one fun style mode.',
      level: 'gold'
    },
    {
      id: 'ai-dungeon',
      title: 'AI Dungeon Game',
      description:
        'Create a short text adventure with AI that has at least 3 choices and 2 different endings. Let someone in the family play your game.',
      level: 'gold'
    },
    {
      id: 'ow-stats',
      title: 'Win a Match with Top Stats',
      description:
        'Win an Overwatch match while earning top eliminations, top damage, or top healing on your team, then explain what helped you get there.',
      level: 'gold'
    },
    {
      id: 'ow-team-coach',
      title: 'Coach a Team Strategy',
      description:
        'Watch an Overwatch replay and act like a coach: point out 3 team strategy improvements and 1 thing the team already did well.',
      level: 'gold'
    },
    {
      id: 'ai-family-game',
      title: 'Invent an AI Family Game',
      description:
        'Use AI to invent a brand-new family game with clear rules, scoring, and a win condition. Play one full round together and improve one rule.',
      level: 'gold'
    },
    {
      id: 'book-powerpoint',
      title: 'Book to PowerPoint Project',
      description:
        'Finish reading a book and create a short PowerPoint presentation about it with characters, plot, favorite scene, and your final rating.',
      level: 'gold'
    }
  ];

  const legacyIdMap = {
    'family-website': 'ai-family-game'
  };

  function isValidChallenge(item) {
    return (
      item &&
      typeof item === 'object' &&
      typeof item.id === 'string' &&
      typeof item.title === 'string' &&
      typeof item.description === 'string' &&
      typeof item.level === 'string' &&
      ['bronze', 'silver', 'gold'].includes(item.level)
    );
  }

  function mergeChallengesWithDefaults(stored) {
    const byId = new Map();

    for (const raw of stored) {
      if (!isValidChallenge(raw)) continue;
      const mappedId = legacyIdMap[raw.id] || raw.id;
      if (!mappedId || byId.has(mappedId)) continue;
      byId.set(mappedId, { ...raw, id: mappedId });
    }

    const merged = [];
    for (const def of defaultChallenges) {
      merged.push(byId.get(def.id) || def);
      byId.delete(def.id);
    }

    for (const extra of byId.values()) {
      merged.push(extra);
    }

    return merged;
  }

  function loadChallenges() {
    try {
      const raw = localStorage.getItem(CHALLENGES_KEY);
      if (!raw) return defaultChallenges;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return defaultChallenges;
      return mergeChallengesWithDefaults(parsed);
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

  const levelRewardValues = {
    bronze: 2,
    silver: 4,
    gold: 6
  };

  const challengeArt = {
    'ai-superhero': './assets/challenge-ai-superhero.svg',
    'robot-story': './assets/challenge-robot-story.svg',
    'animal-mashups': './assets/challenge-animal-mashups.svg',
    'overwatch-hero': './assets/challenge-overwatch-hero.svg',
    'kpop-trivia': './assets/challenge-kpop-trivia.svg',
    'hangout-addi-cameron': './assets/challenge-hangout-addi-cameron.svg',
    'oldies-dance-mom': './assets/challenge-oldies-dance-mom.svg',
    'outfit-picker': './assets/challenge-outfit-picker.svg',
    'overwatch-role': './assets/challenge-overwatch-role.svg',
    'ai-dungeon': './assets/challenge-ai-dungeon.svg',
    'dinner-picker': './assets/challenge-dinner-picker.svg',
    'kpop-dance': './assets/challenge-kpop-dance.svg',
    'spiderman-reading': './assets/challenge-spiderman-reading.svg',
    'family-dessert': './assets/challenge-family-dessert.svg',
    'hour-with-sister': './assets/challenge-hour-with-sister.svg',
    'ow-five-games-dad': './assets/challenge-ow-five-games-dad.svg',
    'ow-stats': './assets/challenge-ow-stats.svg',
    'ai-comic': './assets/challenge-ai-comic.svg',
    'ow-team-coach': './assets/challenge-ow-team-coach.svg',
    'ai-family-game': './assets/challenge-ai-family-game.svg',
    'book-powerpoint': './assets/challenge-book-powerpoint.svg',
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

  function getChallengeValue(challenge) {
    return levelRewardValues[challenge.level] || 0;
  }

  function getSummary() {
    let completedCount = 0;
    let bedtimeChoices = 0;
    let cashChoices = 0;

    for (const c of challenges) {
      if (!state.completed[c.id]) continue;
      const value = getChallengeValue(c);
      completedCount += 1;
      if (state.rewards[c.id] === 'bedtime') bedtimeChoices += value;
      if (state.rewards[c.id] === 'cash') cashChoices += value;
    }

    const bedtimeMinutes = bedtimeChoices;
    const bedtimeMinutesApplied = bedtimeMinutes;
    const cashTotal = cashChoices;
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
    const challenge = getChallengeById(id);
    const value = challenge ? getChallengeValue(challenge) : 0;
    return `
      <div class="reward-buttons" role="group" aria-label="Choose reward">
        <button type="button" class="reward-btn bedtime ${current === 'bedtime' ? 'active' : ''}" data-reward-id="${id}" data-reward="bedtime">Bedtime +${value}</button>
        <button type="button" class="reward-btn cash ${current === 'cash' ? 'active' : ''}" data-reward-id="${id}" data-reward="cash">Cash $${value}</button>
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
