(() => {
  'use strict';

  const CHALLENGES_KEY = 'spring-break-battle-pass-challenges-v1';

  const DEFAULT_CHALLENGES = [
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

  const LEGACY_ID_MAP = {
    'family-website': 'ai-family-game'
  };

  const $ = (sel, root = document) => root.querySelector(sel);

  const els = {
    celebrateToggle: () => /** @type {HTMLInputElement} */ ($('#celebrateToggle')),
    soundToggle: () => /** @type {HTMLInputElement} */ ($('#soundToggle')),
    testSoundBtn: () => /** @type {HTMLButtonElement} */ ($('#testSoundBtn')),
    testConfettiBtn: () => /** @type {HTMLButtonElement} */ ($('#testConfettiBtn')),
    settingsStatus: () => $('#settingsStatus'),
    editor: () => /** @type {HTMLTextAreaElement} */ ($('#editor')),
    reloadBtn: () => /** @type {HTMLButtonElement} */ ($('#reloadBtn')),
    saveBtn: () => /** @type {HTMLButtonElement} */ ($('#saveBtn')),
    resetDefaultBtn: () => /** @type {HTMLButtonElement} */ ($('#resetDefaultBtn')),
    adminStatus: () => $('#adminStatus')
  };

  function setSettingsStatus(text) {
    const el = els.settingsStatus();
    if (el) el.textContent = text;
  }

  function setAdminStatus(msg, kind = 'info') {
    const el = els.adminStatus();
    if (!el) return;
    el.textContent = msg;
    const colors = {
      info: 'rgba(11,16,32,.78)',
      good: '#0f766e',
      bad: '#b91c1c'
    };
    el.style.color = colors[kind] || colors.info;
  }

  function readStoredChallenges() {
    try {
      const raw = localStorage.getItem(CHALLENGES_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return null;
      return mergeChallengesWithDefaults(parsed);
    } catch {
      return null;
    }
  }

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
      const mappedId = LEGACY_ID_MAP[raw.id] || raw.id;
      if (!mappedId || byId.has(mappedId)) continue;
      byId.set(mappedId, { ...raw, id: mappedId });
    }

    const merged = [];
    for (const def of DEFAULT_CHALLENGES) {
      merged.push(byId.get(def.id) || def);
      byId.delete(def.id);
    }

    for (const extra of byId.values()) {
      merged.push(extra);
    }

    return merged;
  }

  function validateChallenges(arr) {
    const errors = [];
    if (!Array.isArray(arr)) {
      errors.push('Root must be a JSON array.');
      return errors;
    }
    if (arr.length < 12) errors.push('Must include at least 12 challenges.');

    const allowedLevels = new Set(['bronze', 'silver', 'gold']);
    const ids = new Set();

    for (let i = 0; i < arr.length; i += 1) {
      const c = arr[i];
      const prefix = `Item ${i + 1}:`;
      if (!c || typeof c !== 'object') {
        errors.push(`${prefix} must be an object.`);
        continue;
      }

      for (const k of ['id', 'title', 'description', 'level']) {
        if (!(k in c)) errors.push(`${prefix} missing ${k}.`);
      }

      if (typeof c.id !== 'string' || c.id.trim().length < 2) {
        errors.push(`${prefix} id must be a non-empty string.`);
      } else {
        const id = c.id.trim();
        if (ids.has(id)) errors.push(`${prefix} duplicate id '${id}'.`);
        ids.add(id);
        if (!/^[a-z0-9-]+$/.test(id)) {
          errors.push(`${prefix} id '${id}' must be lowercase a-z/0-9 with dashes.`);
        }
      }

      if (typeof c.title !== 'string' || c.title.trim().length < 2) {
        errors.push(`${prefix} title must be a non-empty string.`);
      }
      if (typeof c.description !== 'string' || c.description.trim().length < 2) {
        errors.push(`${prefix} description must be a non-empty string.`);
      }
      if (typeof c.level !== 'string' || !allowedLevels.has(c.level)) {
        errors.push(`${prefix} level must be one of bronze/silver/gold.`);
      }
    }

    return errors;
  }

  function pretty(obj) {
    return JSON.stringify(obj, null, 2) + '\n';
  }

  function loadIntoEditor() {
    const stored = readStoredChallenges();
    const data = stored || DEFAULT_CHALLENGES;
    els.editor().value = pretty(data);
    setAdminStatus(stored ? 'Loaded saved challenges.' : 'Loaded default challenges.', 'info');
  }

  function saveFromEditor() {
    let parsed;
    try {
      parsed = JSON.parse(els.editor().value);
    } catch {
      setAdminStatus('Invalid JSON (cannot parse).', 'bad');
      return;
    }

    const errs = validateChallenges(parsed);
    if (errs.length) {
      setAdminStatus(`Cannot save: ${errs[0]}`, 'bad');
      return;
    }

    localStorage.setItem(CHALLENGES_KEY, JSON.stringify(parsed));
    setAdminStatus('Saved.', 'good');
  }

  function resetToDefaults() {
    const ok = window.confirm('Reset challenge list to defaults?');
    if (!ok) return;
    localStorage.removeItem(CHALLENGES_KEY);
    loadIntoEditor();
    setAdminStatus('Reset to defaults.', 'good');
  }

  function bindSettings() {
    if (!window.SB || !window.SB.settings) return;
    const settings = window.SB.settings.get();
    els.celebrateToggle().checked = !!settings.celebrations;
    els.soundToggle().checked = !!settings.sound;

    els.celebrateToggle().addEventListener('change', () => {
      window.SB.settings.set('celebrations', els.celebrateToggle().checked);
      setSettingsStatus(`Celebrations ${els.celebrateToggle().checked ? 'enabled' : 'disabled'}.`);
    });

    els.soundToggle().addEventListener('change', () => {
      window.SB.settings.set('sound', els.soundToggle().checked);
      setSettingsStatus(`Sound ${els.soundToggle().checked ? 'enabled' : 'disabled'}.`);
      if (els.soundToggle().checked && window.SB.fx) {
        window.SB.fx.beep();
      }
    });

    els.testSoundBtn().addEventListener('click', () => {
      if (window.SB && window.SB.fx) {
        window.SB.fx.beep();
        setSettingsStatus('Played test sound.');
      }
    });

    els.testConfettiBtn().addEventListener('click', () => {
      if (window.SB && window.SB.fx) {
        window.SB.fx.burstConfetti(document.body);
        setSettingsStatus('Celebration test fired.');
      }
    });
  }

  function bindEditor() {
    els.reloadBtn().addEventListener('click', loadIntoEditor);
    els.saveBtn().addEventListener('click', saveFromEditor);
    els.resetDefaultBtn().addEventListener('click', resetToDefaults);
  }

  bindSettings();
  loadIntoEditor();
  bindEditor();
})();
