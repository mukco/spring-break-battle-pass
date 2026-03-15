(() => {
  'use strict';

  const SETTINGS_KEY = 'spring-break-battle-pass-settings-v1';

  const defaults = {
    celebrations: true,
    sound: false
  };

  function loadSettings() {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (!raw) return { ...defaults };
      const parsed = JSON.parse(raw);
      return {
        celebrations: typeof parsed.celebrations === 'boolean' ? parsed.celebrations : defaults.celebrations,
        sound: typeof parsed.sound === 'boolean' ? parsed.sound : defaults.sound
      };
    } catch {
      return { ...defaults };
    }
  }

  function saveSettings(s) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  }

  let settings = loadSettings();

  function set(name, value) {
    settings = { ...settings, [name]: value };
    saveSettings(settings);
  }

  function get() {
    return settings;
  }

  function vibrate(ms = 18) {
    try {
      if (navigator && 'vibrate' in navigator) navigator.vibrate(ms);
    } catch {
      // ignore
    }
  }

  function beep() {
    if (!settings.sound) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'triangle';
      o.frequency.value = 660;
      g.gain.value = 0.0001;
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      const now = ctx.currentTime;
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(0.14, now + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
      o.stop(now + 0.13);
      o.onended = () => {
        try {
          ctx.close();
        } catch {
          // ignore
        }
      };
    } catch {
      // ignore
    }
  }

  function burstConfetti(originEl) {
    if (!settings.celebrations) return;
    const rect = originEl ? originEl.getBoundingClientRect() : null;
    const x = rect ? (rect.left + rect.width / 2) / window.innerWidth : 0.5;
    const y = rect ? (rect.top + rect.height / 2) / window.innerHeight : 0.25;
    window.dispatchEvent(
      new CustomEvent('sb:confetti', {
        detail: { x, y }
      })
    );
  }

  window.SB = window.SB || {};
  window.SB.settings = {
    key: SETTINGS_KEY,
    get,
    set,
    defaults
  };
  window.SB.fx = {
    vibrate,
    beep,
    burstConfetti
  };
})();
