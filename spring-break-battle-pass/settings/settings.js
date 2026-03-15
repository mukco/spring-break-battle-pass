(() => {
  'use strict';

  const CHALLENGES_KEY = 'spring-break-battle-pass-challenges-v1';

  const DEFAULT_CHALLENGES = [
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
      return parsed;
    } catch {
      return null;
    }
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
