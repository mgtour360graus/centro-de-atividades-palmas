(function () {
  'use strict';

  var title = 'Centro de Atividades Sesc Palmas | Tour 360°';
  var titleElement = document.querySelector('title');
  var moving = false;
  var revealTimer = 0;

  function updateTitle() {
    if (document.title !== title) document.title = title;
  }

  function getRoot() {
    return document.getElementById('mg360-ui');
  }

  function isMobile(root) {
    return window.matchMedia('(max-width: 900px)').matches ||
      Boolean(root && root.classList.contains('mg360-mobile-viewport-fix'));
  }

  function isTourInterface(target) {
    return Boolean(target && target.closest && target.closest('#mg360-ui'));
  }

  function hideCategories(event) {
    var root = getRoot();
    if (!root || !isMobile(root) || isTourInterface(event.target)) return;
    window.clearTimeout(revealTimer);
    moving = true;
    root.classList.add('mg360-panorama-moving');
  }

  function keepCategoriesHidden(event) {
    if (!moving) return;
    hideCategories(event);
  }

  function revealCategoriesSoon() {
    if (!moving) return;
    moving = false;
    window.clearTimeout(revealTimer);
    revealTimer = window.setTimeout(function () {
      var root = getRoot();
      if (root) root.classList.remove('mg360-panorama-moving');
    }, 650);
  }

  updateTitle();
  if (titleElement) {
    new MutationObserver(updateTitle).observe(titleElement, {
      childList: true,
      characterData: true,
      subtree: true,
    });
  }

  document.addEventListener('pointerdown', hideCategories, true);
  document.addEventListener('pointermove', keepCategoriesHidden, true);
  document.addEventListener('pointerup', revealCategoriesSoon, true);
  document.addEventListener('pointercancel', revealCategoriesSoon, true);
  document.addEventListener('wheel', function (event) {
    hideCategories(event);
    revealCategoriesSoon();
  }, { capture: true, passive: true });
  window.addEventListener('blur', revealCategoriesSoon);
}());
