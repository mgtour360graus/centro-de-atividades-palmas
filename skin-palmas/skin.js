(function () {
  'use strict';
  if (window.PalmasSkin) return;
  var version = '1.0.0-palmas-20261006';
  var diagnostics = { version: version, contextLost: 0, contextRestored: 0, navigationErrors: 0 };
  var root, config, playlist, player, bound = false, readyTimer, resizeTimer, toastTimer;
  var sceneById = new Map(), groupById = new Map(), runtimeIndex = new Map();
  var activeIndex = -1, returnFocus, introDismissed = false;
  var iconPaths = {
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    home: '<path d="m3 10 9-7 9 7M5 9v12h14V9M9 21v-8h6v8"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    sound: '<path d="M3 9v6h4l5 4V5L7 9H3m13-1a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>',
    mute: '<path d="M3 9v6h4l5 4V5L7 9H3m13 0 6 6m0-6-6 6"/>',
    expand: '<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>',
    share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m9 10 6-4m-6 8 6 4"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9 8a3 3 0 0 1 6 0c0 3-3 2-3 5m0 4h.01"/>',
    left: '<path d="m15 5-7 7 7 7"/>', right: '<path d="m9 5 7 7-7 7"/>',
    vr: '<path d="M3 7h18v10h-6l-3-3-3 3H3V7Z"/><circle cx="7" cy="11" r="2"/><circle cx="17" cy="11" r="2"/>'
  };
  function icon(name) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + (iconPaths[name] || '') + '</svg>'; }
  function esc(value) { return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function button(action, name, label, extra) {
    return '<button type="button" data-action="' + action + '" aria-label="' + esc(label) + '" ' + (extra || '') + '>' + icon(name) + '<span>' + esc(label) + '</span></button>';
  }
  function toast(message) {
    if (!root) return;
    var node = root.querySelector('.palmas-toast');
    node.textContent = message; node.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { node.hidden = true; }, 3500);
  }
  function viewport() {
    if (!root) return;
    var v = window.visualViewport;
    root.style.setProperty('--palmas-height', (v ? v.height : window.innerHeight) + 'px');
    root.style.setProperty('--palmas-width', (v ? v.width : window.innerWidth) + 'px');
    root.style.setProperty('--palmas-top', (v ? v.offsetTop : 0) + 'px');
    root.style.setProperty('--palmas-left', (v ? v.offsetLeft : 0) + 'px');
  }
  function queueViewport() { clearTimeout(resizeTimer); resizeTimer = setTimeout(viewport, 100); }
  function closePanel() {
    if (!root) return;
    root.querySelector('.palmas-overlay').hidden = true;
    root.querySelector('.palmas-content').replaceChildren();
    root.querySelector('[data-action="menu"]').setAttribute('aria-expanded', 'false');
    if (returnFocus && returnFocus.isConnected) returnFocus.focus({ preventScroll: true });
    returnFocus = null;
  }
  function openPanel(title, html) {
    if (!root) return;
    if (root.querySelector('.palmas-overlay').hidden) returnFocus = document.activeElement;
    root.querySelector('.palmas-panel-title').textContent = title;
    root.querySelector('.palmas-content').innerHTML = html;
    root.querySelector('.palmas-overlay').hidden = false;
    root.querySelector('[data-action="menu"]').setAttribute('aria-expanded', 'true');
    root.querySelector('[data-action="close"]').focus({ preventScroll: true });
  }
  function groupForCurrent() {
    var scene = config.scenes.find(function (s) { return runtimeIndex.get(s.id) === activeIndex; });
    return scene && groupById.get(scene.group);
  }
  function syncCurrent() {
    if (!bound) return;
    try {
      activeIndex = Number(playlist.get('selectedIndex'));
      var scene = config.scenes.find(function (s) { return runtimeIndex.get(s.id) === activeIndex; });
      if (!scene) return;
      var group = groupById.get(scene.group), point = group.scenes.indexOf(scene.id) + 1;
      root.querySelector('.palmas-current-title').textContent = scene.label;
      root.querySelector('.palmas-current-detail').textContent = 'Ponto ' + point + ' de ' + group.scenes.length;
      root.querySelector('.palmas-step-count').textContent = point + ' / ' + group.scenes.length;
      root.querySelector('[data-action="previous"]').disabled = point <= 1;
      root.querySelector('[data-action="next"]').disabled = point >= group.scenes.length;
      root.querySelector('[data-action="points"]').disabled = group.scenes.length < 2;
      root.querySelectorAll('[data-scene]').forEach(function (b) { b.classList.toggle('is-active', b.dataset.scene === scene.id); });
    } catch (error) { console.warn('[Palmas skin] Estado da cena:', error); }
  }
  function syncSound() {
    if (!bound) return;
    var muted = !!player.get('mute'), b = root.querySelector('[data-action="sound"]');
    b.innerHTML = icon(muted ? 'mute' : 'sound') + '<span>' + (muted ? 'Som desligado' : 'Som ligado') + '</span>';
    b.setAttribute('aria-label', muted ? 'Ativar som' : 'Desativar som');
    b.setAttribute('aria-pressed', String(!muted));
  }
  function go(id) {
    if (!bound || !runtimeIndex.has(id)) { toast('O tour ainda está carregando. Tente novamente.'); return false; }
    try {
      window.tour.setMediaByIndex(runtimeIndex.get(id));
      closePanel(); syncCurrent(); return true;
    } catch (error) {
      diagnostics.navigationErrors++; console.warn('[Palmas skin] Navegação:', error);
      toast('Não foi possível abrir esse ambiente agora. Tente novamente.'); return false;
    }
  }
  function showPoints(groupId) {
    var group = groupById.get(groupId);
    if (!group) return;
    openPanel(group.label, '<p class="palmas-panel-note">Escolha um ponto deste ambiente.</p><div class="palmas-scene-grid">' + group.scenes.map(function (id, i) {
      var s = sceneById.get(id);
      return '<button type="button" class="palmas-scene" data-scene="' + esc(id) + '" aria-label="' + esc(group.label + ', ponto ' + (i + 1)) + '"><img loading="lazy" decoding="async" src="' + esc(s.thumbnail) + '" alt=""><span>Ponto ' + String(i + 1).padStart(2, '0') + '</span></button>';
    }).join('') + '</div>'); syncCurrent();
  }
  function environmentRow(group) {
    return '<div class="palmas-environment"><button type="button" class="palmas-destination" data-scene="' + esc(group.entry) + '" aria-label="Abrir ' + esc(group.label) + '"><span>' + esc(group.label) + '</span>' + icon('right') + '</button><button type="button" class="palmas-point-link" data-group="' + esc(group.id) + '" aria-label="Ver os ' + group.scenes.length + ' pontos de ' + esc(group.label) + '">' + group.scenes.length + (group.scenes.length === 1 ? ' ponto' : ' pontos') + '</button></div>';
  }
  function showMenu() {
    openPanel('Escolha um ambiente', '<label class="palmas-search-label">Buscar por ambiente ou sala<input type="search" class="palmas-search" placeholder="Ex.: Escola Sesc, Sala 01, Teatro" autocomplete="off"></label><div class="palmas-menu-groups">' + config.categories.map(function (category, i) {
      var groups = config.groups.filter(function (g) { return g.category === category; });
      return '<details class="palmas-category"' + (i === 0 ? ' open' : '') + '><summary><span class="palmas-category-number">' + String(i + 1).padStart(2, '0') + '</span><span>' + esc(category) + '</span><small>' + groups.length + '</small></summary><div class="palmas-category-items">' + groups.map(environmentRow).join('') + '</div></details>';
    }).join('') + '</div><p class="palmas-empty" hidden>Nenhum ambiente encontrado.</p><a class="palmas-public-link" href="https://maps.app.goo.gl/e9sJdEfdpwXB4cMj7?g_st=aw" target="_blank" rel="noopener noreferrer">Como chegar · Abrir no Google Maps</a>');
  }
  function showGallery() {
    openPanel('Explore os ambientes', '<p class="palmas-panel-note">45 destinos para conhecer o Centro de Atividades Sesc Palmas.</p><div class="palmas-scene-grid palmas-gallery">' + config.groups.map(function (g) {
      return '<button type="button" class="palmas-scene" data-scene="' + esc(g.entry) + '" aria-label="Abrir ' + esc(g.label) + '"><img loading="lazy" decoding="async" src="' + esc(g.thumbnail) + '" alt=""><span>' + esc(g.label) + '</span><small>' + g.scenes.length + ' pontos</small></button>';
    }).join('') + '</div>');
  }
  function showHelp() {
    openPanel('Como explorar o tour', '<div class="palmas-help"><p><b>Olhe ao redor</b><br>Arraste a panorâmica com o mouse ou com um dedo na tela.</p><p><b>Aproxime os detalhes</b><br>Use a roda do mouse ou o gesto de pinça, quando disponível.</p><p><b>Escolha seu caminho</b><br>Toque nas setas da panorâmica ou abra Ambientes. Os botões anterior e próximo percorrem os pontos do ambiente atual.</p><p><b>Salas diferentes</b><br>Educação Infantil e Escola Sesc têm menus próprios. O número da sala aparece junto ao nome de cada bloco.</p><p><b>Som e tela cheia</b><br>O som é opcional. Os controles de tela cheia e VR aparecem quando o navegador oferece suporte.</p></div>');
  }
  function dismissIntro() {
    if (!bound) return;
    introDismissed = true;
    root.querySelector('.palmas-intro').hidden = true;
    if (root.querySelector('.palmas-intro-sound').checked) player.set('mute', false);
    syncSound(); root.querySelector('[data-action="menu"]').focus({ preventScroll: true });
  }
  function searchMenu(value) {
    var query = value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim(), visible = 0;
    root.querySelectorAll('.palmas-category').forEach(function (category) {
      var count = 0;
      category.querySelectorAll('.palmas-environment').forEach(function (row) {
        var text = row.textContent.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
        row.hidden = !text.includes(query); if (!row.hidden) count++;
      }); category.hidden = !count; if (query && count) category.open = true; visible += count;
    }); root.querySelector('.palmas-empty').hidden = !!visible;
  }
  function activate(event) {
    var b = event.target.closest('button'); if (!b || !root.contains(b) || b.disabled) return;
    if (b.dataset.scene) { go(b.dataset.scene); return; }
    if (b.dataset.group) { showPoints(b.dataset.group); return; }
    var action = b.dataset.action, group;
    try {
      if (action === 'start') dismissIntro();
      else if (action === 'menu') showMenu();
      else if (action === 'close' || action === 'backdrop') closePanel();
      else if (action === 'gallery') showGallery();
      else if (action === 'help') showHelp();
      else if (action === 'home') go(config.scenes[0].id);
      else if (action === 'points') { group = groupForCurrent(); if (group) showPoints(group.id); }
      else if (action === 'previous' || action === 'next') {
        group = groupForCurrent(); var current = config.scenes.find(function (s) { return runtimeIndex.get(s.id) === activeIndex; });
        if (group && current) { var offset = group.scenes.indexOf(current.id) + (action === 'next' ? 1 : -1); if (offset >= 0 && offset < group.scenes.length) go(group.scenes[offset]); }
      } else if (action === 'sound' && bound) { player.set('mute', !player.get('mute')); syncSound(); }
      else if (action === 'fullscreen') {
        var fn = document.fullscreenElement ? document.exitFullscreen.bind(document) : document.documentElement.requestFullscreen.bind(document.documentElement);
        Promise.resolve(fn()).catch(function () { toast('Tela cheia indisponível neste navegador.'); });
      } else if (action === 'share') {
        if (navigator.share) navigator.share({ title: config.title, url: config.publicUrl }).catch(function (e) { if (e.name !== 'AbortError') toast('Não foi possível compartilhar agora.'); });
        else if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(config.publicUrl).then(function () { toast('Link copiado.'); }).catch(function () { openPanel('Compartilhar tour', '<a class="palmas-public-link" href="' + config.publicUrl + '">' + config.publicUrl + '</a>'); });
        else openPanel('Compartilhar tour', '<a class="palmas-public-link" href="' + config.publicUrl + '">' + config.publicUrl + '</a>');
      } else if (action === 'vr' && bound && typeof player.toggleVR === 'function') { closePanel(); player.toggleVR(); }
    } catch (error) { console.warn('[Palmas skin] Controle:', error); toast('Este recurso não está disponível agora.'); }
  }
  function keydown(event) {
    if (!root) return;
    var overlay = root.querySelector('.palmas-overlay'), intro = root.querySelector('.palmas-intro');
    if (event.key === 'Escape') { if (!overlay.hidden) closePanel(); else if (!intro.hidden && bound) dismissIntro(); return; }
    var panel = !overlay.hidden ? overlay : (!intro.hidden ? intro : null);
    if (event.key !== 'Tab' || !panel) return;
    var focusable = Array.from(panel.querySelectorAll('button:not(:disabled),input,a,summary')).filter(function (el) { return el.getClientRects().length; });
    if (!focusable.length) return;
    var first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && (document.activeElement === first || !panel.contains(document.activeElement))) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && (document.activeElement === last || !panel.contains(document.activeElement))) { event.preventDefault(); first.focus(); }
  }
  function syncVr() {
    if (!bound) return;
    var viewer = player.getMainViewer && player.getMainViewer();
    var active = viewer && viewer.get('viewMode') !== 'standard';
    root.classList.toggle('is-vr', !!active);
    root.querySelector('[data-action="vr"]').setAttribute('aria-pressed', String(!!active));
  }
  function attachPlayer() {
    if (bound) return true;
    if (!window.tour || !window.tour.player || !window.tour.isInitialized) return false;
    try {
      player = window.tour.player.getById('rootPlayer');
      playlist = window.tour.player.getById('mainPlayList');
      if (!player || !playlist) return false;
      playlist.get('items').forEach(function (item, index) { runtimeIndex.set(item.get('media').get('id'), index); });
      if (config.scenes.some(function (s) { return !runtimeIndex.has(s.id); })) throw new Error('A lista de cenas mudou. A skin precisa ser reconciliada com a exportação.');
      bound = true; playlist.bind('selectedIndex_changed', syncCurrent); player.bind('mute_changed', syncSound);
      player.set('mute', true); syncSound(); syncCurrent();
      var viewer = player.getMainViewer && player.getMainViewer();
      if (viewer && viewer.bind) viewer.bind('viewMode_changed', syncVr);
      root.querySelectorAll('[data-ready]').forEach(function (b) { b.disabled = false; });
      root.querySelector('.palmas-intro-status').textContent = 'Tudo pronto. Explore no seu ritmo.';
      root.querySelector('[data-action="vr"]').hidden = true;
      if (navigator.xr && window.isSecureContext && typeof navigator.xr.isSessionSupported === 'function' && typeof player.toggleVR === 'function') {
        navigator.xr.isSessionSupported('immersive-vr').then(function (supported) { if (root) root.querySelector('[data-action="vr"]').hidden = !supported; }).catch(function () {});
      }
      document.querySelectorAll('#viewer canvas').forEach(function (canvas) {
        canvas.addEventListener('webglcontextlost', function () { diagnostics.contextLost++; toast('A panorâmica está recuperando a renderização.'); }, { passive: true });
        canvas.addEventListener('webglcontextrestored', function () { diagnostics.contextRestored++; syncCurrent(); }, { passive: true });
      });
      return true;
    } catch (error) { console.warn('[Palmas skin] Integração:', error); if (bound) bound = false; return false; }
  }
  function mount(data) {
    config = data; config.scenes.forEach(function (s) { sceneById.set(s.id, s); }); config.groups.forEach(function (g) { groupById.set(g.id, g); });
    root = document.createElement('div'); root.id = 'palmas-skin';
    root.innerHTML = '<header class="palmas-header"><div class="palmas-brand"><img src="' + esc(config.logo) + '" alt="Sesc Fecomércio Senac Tocantins"><div><strong>Centro de Atividades</strong><span>Palmas · Tocantins</span></div></div><div class="palmas-current" aria-live="polite"><strong class="palmas-current-title">Vista Aérea</strong><span class="palmas-current-detail">Carregando panorâmica</span></div><div class="palmas-top-actions">' + button('help', 'help', 'Como navegar') + button('menu', 'menu', 'Ambientes', 'aria-expanded="false" aria-controls="palmas-panel"') + '</div></header>' +
      '<nav class="palmas-dock" aria-label="Controles do tour">' + button('home', 'home', 'Início', 'data-ready disabled') + button('gallery', 'grid', 'Galeria') + button('points', 'grid', 'Pontos', 'data-ready disabled') + button('sound', 'mute', 'Som desligado', 'data-ready disabled aria-pressed="false"') + button('share', 'share', 'Compartilhar') + button('fullscreen', 'expand', 'Tela cheia', 'hidden') + button('vr', 'vr', 'VR', 'hidden aria-pressed="false"') + '</nav>' +
      '<div class="palmas-stepper" aria-label="Pontos do ambiente atual">' + button('previous', 'left', 'Ponto anterior', 'data-ready disabled') + '<span class="palmas-step-count">1 / 4</span>' + button('next', 'right', 'Próximo ponto', 'data-ready disabled') + '</div>' +
      '<div class="palmas-overlay" hidden><button class="palmas-backdrop" data-action="backdrop" aria-label="Fechar janela" tabindex="-1"></button><section id="palmas-panel" class="palmas-panel" role="dialog" aria-modal="true" aria-labelledby="palmas-panel-title"><div class="palmas-panel-head"><div><small>TOUR VIRTUAL 360°</small><h2 id="palmas-panel-title" class="palmas-panel-title"></h2></div>' + button('close', 'close', 'Fechar') + '</div><div class="palmas-content"></div></section></div>' +
      '<section class="palmas-intro" role="dialog" aria-modal="true" aria-label="Bem-vindo ao Centro de Atividades Sesc Palmas"><div class="palmas-cover-wrap"><img class="palmas-cover" src="' + esc(config.cover) + '" alt="Tour Virtual 360° — Centro de Atividades Sesc Palmas, Tocantins"></div><div class="palmas-intro-controls"><p class="palmas-intro-status" role="status">Preparando sua visita virtual…</p><label><input class="palmas-intro-sound" type="checkbox"> Ouvir apresentação</label><button class="palmas-start" data-action="start" data-ready disabled>Iniciar visita ' + icon('right') + '</button><p>Arraste para olhar ao redor. Toque nas setas ou escolha um ambiente.</p></div></section><div class="palmas-toast" role="status" hidden></div>';
    document.body.appendChild(root); viewport();
    root.addEventListener('click', activate);
    root.addEventListener('input', function (e) { if (e.target.matches('.palmas-search')) searchMenu(e.target.value); });
    document.addEventListener('keydown', keydown);
    window.addEventListener('resize', queueViewport, { passive: true });
    window.addEventListener('orientationchange', queueViewport, { passive: true });
    if (window.visualViewport) { window.visualViewport.addEventListener('resize', queueViewport, { passive: true }); window.visualViewport.addEventListener('scroll', queueViewport, { passive: true }); }
    window.addEventListener('pageshow', function () { viewport(); if (bound) { syncCurrent(); syncSound(); syncVr(); } });
    document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') { viewport(); if (bound) { syncCurrent(); syncSound(); } } });
    if (document.fullscreenEnabled && document.documentElement.requestFullscreen) root.querySelector('[data-action="fullscreen"]').hidden = false;
    var attempts = 0;
    function waitForPlayer() {
      if (attachPlayer()) return;
      if (++attempts > 120) { root.remove(); root = null; console.warn('[Palmas skin] Player indisponível: interface adicional removida para preservar o tour original.'); return; }
      readyTimer = setTimeout(waitForPlayer, 250);
    }
    waitForPlayer();
  }
  window.PalmasSkin = { version: version, diagnostics: diagnostics, goToScene: go, getState: function () { return { ready: bound, index: activeIndex, group: groupForCurrent() && groupForCurrent().id, introDismissed: introDismissed, panelOpen: !!root && !root.querySelector('.palmas-overlay').hidden, sceneCount: runtimeIndex.size }; } };
  function start() {
    var controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timeout = controller ? setTimeout(function () { controller.abort(); }, 12000) : null;
    fetch('skin-palmas/config.json?v=' + version, controller ? { signal: controller.signal } : {}).then(function (r) { if (!r.ok) throw new Error('Configuração indisponível: ' + r.status); return r.json(); }).then(mount).catch(function (e) { if (root) { root.remove(); root = null; } console.warn('[Palmas skin] O tour original foi preservado:', e); }).finally(function () { clearTimeout(timeout); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true }); else start();
}());
