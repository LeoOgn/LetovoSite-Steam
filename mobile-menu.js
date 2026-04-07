(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var hamburger = document.getElementById('hamburgerBtn');
    var menu = document.getElementById('mobileMenu');
    var backdrop = document.getElementById('mobileBackdrop');
    var closeBtn = document.getElementById('mobileMenuClose');

    if (!hamburger || !menu) return;

    function openMenu() {
      menu.classList.add('mobile-menu--open');
      if (backdrop) backdrop.classList.add('mobile-menu__backdrop--visible');
      hamburger.classList.add('hamburger-btn--open');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      menu.classList.remove('mobile-menu--open');
      if (backdrop) backdrop.classList.remove('mobile-menu__backdrop--visible');
      hamburger.classList.remove('hamburger-btn--open');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', function () {
      menu.classList.contains('mobile-menu--open') ? closeMenu() : openMenu();
    });

    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (backdrop) backdrop.addEventListener('click', closeMenu);

    // Sub-menu accordion
    document.querySelectorAll('.mobile-nav__btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var subId = this.dataset.sub;
        var sub = document.getElementById(subId);
        if (!sub) return;
        var isOpen = sub.classList.contains('mobile-nav__sub--open');
        document.querySelectorAll('.mobile-nav__sub').forEach(function (s) {
          s.classList.remove('mobile-nav__sub--open');
        });
        document.querySelectorAll('.mobile-nav__btn').forEach(function (b) {
          b.classList.remove('mobile-nav__btn--open');
        });
        if (!isOpen) {
          sub.classList.add('mobile-nav__sub--open');
          this.classList.add('mobile-nav__btn--open');
        }
      });
    });
  });
})();
