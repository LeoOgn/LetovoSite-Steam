(function () {
  function getMoscowHour() {
    var now = new Date();
    var utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
    return new Date(utcMs + 3 * 3600000).getHours();
  }

  function resolveTheme(pref) {
    if (pref === 'dark') return 'dark';
    if (pref === 'light') return 'light';
    var h = getMoscowHour();
    return (h >= 21 || h < 9) ? 'dark' : 'light';
  }

  function applyTheme(pref) {
    var theme = resolveTheme(pref);
    document.documentElement.setAttribute('data-theme', theme);
    document.querySelectorAll('.theme-option').forEach(function (btn) {
      btn.classList.toggle('theme-option--active', btn.dataset.theme === pref);
    });
  }

  // Apply immediately to avoid flash
  var saved = localStorage.getItem('theme') || 'auto';
  applyTheme(saved);

  document.addEventListener('DOMContentLoaded', function () {
    var settingsBtn = document.getElementById('settingsBtn');
    var settingsPopup = document.getElementById('settingsPopup');

    if (!settingsBtn || !settingsPopup) return;

    settingsBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      settingsPopup.classList.toggle('settings-popup--visible');
    });

    document.addEventListener('click', function () {
      settingsPopup.classList.remove('settings-popup--visible');
    });

    settingsPopup.addEventListener('click', function (e) {
      e.stopPropagation();
    });

    document.querySelectorAll('.theme-option').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var pref = this.dataset.theme;
        localStorage.setItem('theme', pref);
        applyTheme(pref);
      });
    });

    // Re-highlight on open
    var current = localStorage.getItem('theme') || 'auto';
    applyTheme(current);
  });
})();
