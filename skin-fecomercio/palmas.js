(function () {
  'use strict';

  var title = 'Centro de Atividades Sesc Palmas | Tour 360°';
  var titleElement = document.querySelector('title');
  var movementTimer = 0;
  var tracking = null;

  function updateTitle() {
    if (document.title !== title) document.title = title;
  }

  function isMobile(root) {
    return window.matchMedia('(max-width: 900px)').matches || root.classList.contains('mg360-mobile-viewport-fix');
  }

  function showCategories(root) {
    window.clearTimeout(movementTimer);
    movementTimer = window.setTimeout(function () {
      root.classList.remove('mg360-panorama-moving');
    }, 420);
  }

  function installMovementRule() {
    var viewer = document.getElementById('viewer');
    var root = document.getElementById('mg360-ui');
    if (!viewer || !root || root.dataset.palmasMovementRule === 'ready') return Boolean(viewer && root);

    root.dataset.palmasMovementRule = 'ready';

    viewer.addEventListener('pointerdown', function (event) {
      if (!isMobile(root)) return;
      tracking = { id: event.pointerId, x: event.clientX, y: event.clientY, moved: false };
    }, { capture: true, passive: true });

    viewer.addEventListener('pointermove', function (event) {
      if (!tracking || tracking.id !== event.pointerId || !isMobile(root)) return;
      var distance = Math.abs(event.clientX - tracking.x) + Math.abs(event.clientY - tracking.y);
      if (distance < 7) return;
      tracking.moved = true;
      window.clearTimeout(movementTimer);
      root.classList.add('mg360-panorama-moving');
    }, { capture: true, passive: true });

    function finishMovement(event) {
      if (!tracking || tracking.id !== event.pointerId) return;
      if (tracking.moved) showCategories(root);
      tracking = null;
    }

    viewer.addEventListener('pointerup', finishMovement, { capture: true, passive: true });
    viewer.addEventListener('pointercancel', finishMovement, { capture: true, passive: true });
    return true;
  }

  function waitForSkin() {
    if (installMovementRule()) return;
    var observer = new MutationObserver(function () {
      if (installMovementRule()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  updateTitle();
  if (titleElement) new MutationObserver(updateTitle).observe(titleElement, { childList: true, characterData: true, subtree: true });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', waitForSkin, { once: true });
  else waitForSkin();
}());
