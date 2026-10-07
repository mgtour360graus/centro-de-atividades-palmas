(function () {
  'use strict';

  var scriptElement = document.currentScript;
  var configUrl = scriptElement && scriptElement.getAttribute('data-config-url') || './skin-fecomercio/config.json';

  if (window.__MG360_FECOMERCIO_SKIN__) return;
  window.__MG360_FECOMERCIO_SKIN__ = true;

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function icon(name) {
    var icons = {
      help: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.6 8.7a2.7 2.7 0 1 1 4.3 2.2c-1.2.8-1.9 1.3-1.9 2.8M12 17.4h.01"/></svg>',
      menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
      rotate: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.2 7.5A8 8 0 1 0 20 15M19.2 7.5V3m0 4.5h-4.5"/></svg>',
      share: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.6-4.5m-7.6 6.9 7.6 4.5"/></svg>',
      map: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3.5 6 5-2 7 2 5-2v14l-5 2-7-2-5 2V6Zm5-2v14m7-12v14"/><path d="M12 9.1a2.1 2.1 0 1 1 4.2 0c0 1.8-2.1 4.2-2.1 4.2S12 11 12 9.1Z"/></svg>',
      grid: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="5" height="5" rx="1"/><rect x="15" y="4" width="5" height="5" rx="1"/><rect x="4" y="15" width="5" height="5" rx="1"/><rect x="15" y="15" width="5" height="5" rx="1"/></svg>',
      sound: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 10v4h3l4 3V7L8 10H5Zm11.2-.8a4 4 0 0 1 0 5.6m2.3-8a7.3 7.3 0 0 1 0 10.4"/></svg>',
      mute: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 10v4h3l4 3V7L8 10H5Zm11-1 5 6m0-6-5 6"/></svg>',
      fullscreen: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4H4v4m12-4h4v4M8 20H4v-4m12 4h4v-4"/></svg>',
      vr: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 8h15l1.5 3.4V15a2 2 0 0 1-2 2h-1.2a2.4 2.4 0 0 1-2.1-1.2L14.8 14h-5.6l-.9 1.8A2.4 2.4 0 0 1 6.2 17H5a2 2 0 0 1-2-2v-3.6L4.5 8Z"/><circle cx="7.2" cy="12.2" r="1.8"/><circle cx="16.8" cy="12.2" r="1.8"/><path d="m6 8 .8-2h10.4l.8 2"/></svg>',
      close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>',
      arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-5-5 5 5-5 5"/></svg>',
      phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.2 3.8 10 7.3 8.5 9.5c1.4 2.8 3.2 4.6 6 6l2.2-1.5 3.5 2.8-.7 3c-.2.7-.9 1.2-1.6 1.2C9.7 20.5 3.5 14.3 3 6.1c0-.7.5-1.4 1.2-1.6l3-.7Z"/></svg>',
      external: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 5h5v5m0-5-8 8M19 14v5H5V5h5"/></svg>',
      mouse: '<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="18" y="7" width="28" height="44" rx="14"/><path d="M32 7v14m-8 36 8-6 8 6"/></svg>',
      touch: '<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="7" y="11" width="24" height="40" rx="3"/><path d="M19 17v13m0 0-6-6m6 6 6-6M45 16v22m0-22c0-5 8-5 8 0v15m-8-5c-5-3-8 3-5 7l7 12"/></svg>'
    };
    return icons[name] || '';
  }

  function loadConfig() {
    return fetch(configUrl, { cache: 'no-store' }).then(function (response) {
      if (!response.ok) throw new Error('Não foi possível carregar a configuração da skin.');
      return response.json();
    });
  }

  function applyMobileViewportFix(root) {
    if (!root) return;

    var screenWidth = window.screen && Number(window.screen.width) || 0;
    var screenHeight = window.screen && Number(window.screen.height) || 0;
    var shortSide = Math.min(screenWidth, screenHeight);
    var isLandscape = window.innerWidth > window.innerHeight;
    var referenceWidth = isLandscape ? Math.max(screenWidth, screenHeight) : shortSide;
    var ratio = referenceWidth > 0 ? window.innerWidth / referenceWidth : 1;
    var touchDevice = (navigator.maxTouchPoints || 0) > 0 && shortSide > 0 && shortSide <= 1024;

    if (!touchDevice || ratio < 1.35) {
      root.classList.remove('mg360-mobile-viewport-fix');
      root.classList.remove('mg360-phone-small');
      root.classList.remove('mg360-phone-landscape');
      root.classList.remove('mg360-tablet');
      root.style.removeProperty('--mg-phone-brand-width');
      root.style.removeProperty('--mg-phone-logo-width');
      root.style.removeProperty('--mg-phone-location-min');
      root.style.removeProperty('--mg-phone-location-max');
      root.style.removeProperty('width');
      root.style.removeProperty('height');
      root.style.removeProperty('right');
      root.style.removeProperty('bottom');
      root.style.removeProperty('transform');
      root.style.removeProperty('transform-origin');
      return;
    }

    var scale = Math.min(2.2, Math.max(1, ratio));
    var logicalWidth = window.innerWidth / scale;
    var logicalHeight = window.innerHeight / scale;
    var brandWidth = Math.max(96, Math.min(133, referenceWidth * 0.31));
    var logoWidth = Math.max(64, Math.min(82, referenceWidth * 0.19));
    var locationMin = Math.max(96, Math.min(112, referenceWidth * 0.26));
    var locationMax = Math.max(96, Math.min(133, referenceWidth * 0.31));

    root.classList.add('mg360-mobile-viewport-fix');
    root.classList.toggle('mg360-phone-small', referenceWidth <= 380);
    root.classList.toggle('mg360-phone-landscape', isLandscape);
    root.classList.toggle('mg360-tablet', shortSide > 500);
    root.style.setProperty('--mg-phone-brand-width', brandWidth + 'px');
    root.style.setProperty('--mg-phone-logo-width', logoWidth + 'px');
    root.style.setProperty('--mg-phone-location-min', locationMin + 'px');
    root.style.setProperty('--mg-phone-location-max', locationMax + 'px');
    root.style.width = logicalWidth + 'px';
    root.style.height = logicalHeight + 'px';
    root.style.right = 'auto';
    root.style.bottom = 'auto';
    root.style.transformOrigin = '0 0';
    root.style.transform = 'scale(' + scale + ')';
  }

  function mount(config) {
    var colors = config.brand.colors;
    var style = document.createElement('style');
    style.id = 'mg360-fecomercio-style';
    style.textContent = '\
:root{--mg-blue:' + colors.blue + ';--mg-deep:' + colors.blueDark + ';--mg-sky:' + colors.blueLight + ';--mg-yellow:' + colors.yellow + ';--mg-gray:' + colors.gray + ';--mg-white:' + colors.white + ';--mg-safe-bottom:env(safe-area-inset-bottom,0px);--mg-safe-top:env(safe-area-inset-top,0px)}\
html,body{height:100%;height:-webkit-fill-available}body.mg360-modal-open{overscroll-behavior:none}body.mg360-modal-open #viewer{pointer-events:none!important}\
#mg360-ui,#mg360-ui *{box-sizing:border-box}#mg360-ui{position:fixed;inset:0;z-index:2147482000;overflow:hidden;pointer-events:none;color:#fff;font-family:"Libre Franklin",Arial,Helvetica,sans-serif;-webkit-font-smoothing:antialiased}\
#mg360-ui button,#mg360-ui a,#mg360-ui input,#mg360-ui iframe{pointer-events:auto;font:inherit}#mg360-ui button{border:0;cursor:pointer}#mg360-ui svg{display:block;width:1.35rem;height:1.35rem;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}\
.mg360-top{position:absolute;top:calc(14px + var(--mg-safe-top));left:24px;right:24px;height:58px;display:flex;align-items:flex-start;justify-content:space-between;gap:16px;z-index:20}\
.mg360-brand-area{display:flex;flex-direction:column;align-items:flex-start;gap:10px;pointer-events:none}.mg360-brand{height:58px;min-width:340px;padding:8px 16px 8px 10px;background:rgba(3,82,153,.88);border:1px solid rgba(255,255,255,.38)!important;border-radius:12px;color:#fff;display:flex;align-items:center;gap:13px;box-shadow:0 10px 30px rgba(0,54,108,.22);text-align:left;cursor:default}.mg360-corner-logo{display:block;width:118px;height:auto;max-height:114px;object-fit:contain;filter:drop-shadow(0 8px 14px rgba(0,34,65,.2));pointer-events:none}\
.mg360-brand-mark{position:relative;width:32px;height:28px;flex:0 0 32px}.mg360-brand-mark i{position:absolute;width:21px;height:9px;border-radius:999px;transform:rotate(-17deg)}.mg360-brand-mark i:nth-child(1){left:0;top:2px;background:#13b4d1}.mg360-brand-mark i:nth-child(2){right:0;top:10px;background:#f6be00}.mg360-brand-mark i:nth-child(3){left:1px;bottom:0;background:#f08a19}\
.mg360-brand-copy strong{display:block;font-size:12px;line-height:1.1;letter-spacing:.11em}.mg360-brand-copy span{display:block;margin-top:5px;font-size:7px;letter-spacing:.08em;opacity:.82}\
.mg360-location{position:absolute;top:2px;left:50%;transform:translateX(-50%);width:max-content;min-width:145px;max-width:min(280px,32vw);height:54px;padding:8px 20px 8px 58px;border-radius:12px;background:rgba(3,82,153,.88);border:1px solid rgba(255,255,255,.38);box-shadow:0 10px 30px rgba(0,54,108,.2)}.mg360-location:before{content:"";position:absolute;box-sizing:border-box;left:12px;top:50%;width:34px;height:34px;transform:translateY(-50%);border:7px solid #fff;border-radius:50%;box-shadow:0 0 0 5px rgba(255,255,255,.14),inset 0 0 0 1px rgba(0,56,101,.16)}.mg360-location small{display:block;font-size:7px;letter-spacing:.18em;opacity:.72;white-space:nowrap}.mg360-location strong{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px;margin-top:2px}\
.mg360-actions{display:flex;gap:8px;align-items:flex-start;margin:2px 0 0 auto}.mg360-action{height:48px;min-width:48px;padding:0 17px;border-radius:12px;background:rgba(3,82,153,.88);border:1px solid rgba(255,255,255,.38)!important;color:#fff;display:flex;align-items:center;justify-content:center;gap:10px;text-transform:uppercase;font-size:9px;font-weight:800;letter-spacing:.12em;box-shadow:none;transition:transform .2s ease,filter .2s ease}.mg360-action-help{padding:0}.mg360-action-social{padding-left:13px;padding-right:13px}.mg360-action:hover{filter:brightness(1.08);transform:translateY(2px)}.mg360-action-social .mg360-social-dots{width:28px;height:28px;position:relative}.mg360-social-dots i{position:absolute;width:10px;height:10px;border:2px solid #fff;border-radius:50%}.mg360-social-dots i:nth-child(1){left:1px;top:9px;background:#12afc2}.mg360-social-dots i:nth-child(2){left:9px;top:1px;background:#f6be00}.mg360-social-dots i:nth-child(3){right:1px;top:9px;background:#f08a19}.mg360-social-dots i:nth-child(4){left:9px;bottom:1px;background:#49a942}\
.mg360-nuclei{position:absolute;left:3.7vw;bottom:38px;display:flex;gap:22px;z-index:12}.mg360-nucleus{position:relative;padding:0 0 16px;background:transparent!important;color:rgba(255,255,255,.72);font-size:8px;font-weight:900;text-transform:uppercase;letter-spacing:.08em;white-space:nowrap;text-shadow:0 2px 8px rgba(0,0,0,.65)}.mg360-nucleus:after{content:"";position:absolute;width:8px;height:8px;left:50%;bottom:0;transform:translateX(-50%);border:2px solid rgba(255,255,255,.45);border-radius:50%;transition:all .25s ease}.mg360-nucleus:not(:last-child):before{content:"";position:absolute;left:calc(50% + 8px);right:calc(-50% - 15px);bottom:4px;height:1px;background:rgba(255,255,255,.26)}.mg360-nucleus.is-active{color:#fff}.mg360-nucleus.is-active:after{background:var(--mg-sky);border-color:#fff;box-shadow:0 0 0 4px rgba(0,120,191,.26)}\
.mg360-stepper{position:absolute;right:23px;top:37%;z-index:11;display:flex;flex-direction:column;border:1px solid rgba(255,255,255,.28);border-radius:13px;overflow:hidden;box-shadow:0 12px 28px rgba(0,35,68,.24)}.mg360-stepper button{width:50px;height:48px;color:#fff;background:linear-gradient(145deg,var(--mg-sky),var(--mg-blue));font-size:25px;font-weight:300}.mg360-stepper button+button{border-top:1px solid rgba(255,255,255,.32)}\
.mg360-dock{position:absolute;left:50%;bottom:22px;transform:translateX(-50%);display:flex;align-items:stretch;padding:5px;border-radius:12px;background:linear-gradient(145deg,var(--mg-sky),var(--mg-blue));border:1px solid rgba(255,255,255,.35);box-shadow:0 14px 30px rgba(0,34,65,.3);z-index:18}.mg360-dock-button{position:relative;min-width:66px;height:58px;padding:7px 10px;border-radius:9px;background:transparent;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;font-size:8px;font-weight:800;transition:background .2s ease,color .2s ease}.mg360-dock-button svg{width:22px!important;height:22px!important}.mg360-dock-button:hover,.mg360-dock-button.is-active{background:rgba(255,255,255,.14)}.mg360-dock-button.mg360-primary{min-width:84px;background:#fff;color:var(--mg-deep);box-shadow:0 6px 18px rgba(0,35,68,.16)}\
.mg360-overlay{position:absolute;inset:0;z-index:100;display:grid;place-items:center;pointer-events:auto;background:rgba(0,25,48,.76);backdrop-filter:blur(7px);-webkit-backdrop-filter:blur(7px);animation:mgFade .28s ease}.mg360-overlay-backdrop{position:absolute;inset:0;background:transparent}.mg360-panel{position:relative;width:min(740px,92vw);max-height:90vh;max-height:90dvh;overflow:auto;background:#fff;color:#092b49;border-radius:23px;box-shadow:0 28px 80px rgba(0,20,40,.45);animation:mgSlide .42s cubic-bezier(.2,.8,.2,1)}.mg360-panel-wide{width:min(740px,92vw);margin-left:auto;margin-right:2.5vw;border-radius:24px 0 0 24px}.mg360-panel-head{position:sticky;top:0;z-index:2;display:flex;align-items:flex-start;justify-content:space-between;gap:24px;padding:28px 28px 22px;background:rgba(255,255,255,.96);border-bottom:1px solid #e6eef4}.mg360-panel-kicker{display:block;color:var(--mg-sky);font-size:9px;font-weight:900;letter-spacing:.18em;text-transform:uppercase}.mg360-panel h2{margin:8px 0 0;font-size:28px;font-weight:400;letter-spacing:-.03em}.mg360-close{position:relative;isolation:isolate;flex:0 0 54px;width:54px;height:54px;border-radius:13px;background:var(--mg-sky);color:#fff;display:grid;place-items:center;box-shadow:0 10px 24px rgba(0,120,191,.22);animation:mgCloseFloat 1.8s ease-in-out infinite;transition:transform .25s ease,filter .25s ease;will-change:transform}.mg360-close:before{content:"";position:absolute;z-index:-1;inset:-1px;border:2px solid rgba(11,120,191,.52);border-radius:inherit;animation:mgCloseRing 1.8s ease-out infinite;pointer-events:none}.mg360-close svg{width:24px!important;height:24px!important;transition:transform .35s cubic-bezier(.2,.8,.2,1)}.mg360-close:hover{animation:none;transform:scale(1.08) rotate(3deg);filter:brightness(1.12)}.mg360-close:hover:before{animation:none;opacity:.82;transform:scale(1.16)}.mg360-close:hover svg{transform:rotate(90deg)}.mg360-close:active{animation:none;transform:scale(.92)}.mg360-panel-body{padding:20px 28px 30px}\
.mg360-environment-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.mg360-environment-card{position:relative;min-height:190px;padding:22px 18px 18px;border-radius:18px;background:var(--card-surface);border-top:4px solid var(--card-accent);overflow:hidden}.mg360-environment-card:after{content:"";position:absolute;width:110px;height:110px;right:-52px;top:-52px;border-radius:50%;border:18px solid rgba(0,120,191,.08);border:18px solid color-mix(in srgb,var(--card-accent) 13%,transparent)}.mg360-card-title{position:relative;z-index:1;display:flex;align-items:center;width:100%;background:transparent!important;color:#092b49;text-align:left;font-size:15px;font-weight:800}.mg360-card-title b{display:grid;place-items:center;width:28px;height:28px;margin-right:10px;border-radius:50%;background:var(--card-accent);color:#fff;font-size:9px}.mg360-card-title span:last-child{margin-left:auto;color:var(--card-accent);font-size:20px}.mg360-destinations{position:relative;z-index:1;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:5px 12px;margin-top:18px}.mg360-destination{position:relative;padding:7px 4px 7px 15px;background:transparent!important;color:#375367;text-align:left;font-size:10px;line-height:1.2}.mg360-destination:before{content:"";position:absolute;left:1px;top:12px;width:5px;height:5px;border-radius:50%;background:var(--card-accent)}.mg360-destination:hover{color:#092b49;text-decoration:underline}\
.mg360-scene-browser{margin-top:20px;border-top:1px solid #e6eef4;padding-top:18px}.mg360-scene-browser summary{cursor:pointer;color:var(--mg-blue);font-size:11px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}.mg360-scene-tools{display:flex;gap:10px;align-items:center;margin:16px 0}.mg360-scene-search{width:100%;height:46px;border:1px solid #c9d8e5;border-radius:12px;padding:0 15px;color:#092b49;outline:none}.mg360-scene-search:focus{border-color:var(--mg-sky);box-shadow:0 0 0 3px rgba(11,120,191,.12)}.mg360-scene-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.mg360-scene-card{position:relative;min-height:90px;border-radius:12px;overflow:hidden;background:#0b3557;color:#fff;text-align:left;padding:0}.mg360-scene-card img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.66;transition:transform .3s ease}.mg360-scene-card:hover img{transform:scale(1.08)}.mg360-scene-card span{position:absolute;left:10px;right:10px;bottom:9px;z-index:1;font-size:9px;font-weight:800;text-shadow:0 2px 5px #000}.mg360-scene-card:after{content:"";position:absolute;inset:0;background:linear-gradient(transparent,rgba(0,31,57,.88))}\
.mg360-map-panel{position:relative;width:90vw;height:90vh;height:90dvh;max-height:90vh;max-height:90svh;border-radius:22px;overflow:hidden;background:#fff;box-shadow:0 28px 90px rgba(0,20,40,.55);animation:mgZoom .34s ease}.mg360-map-panel iframe{display:block;width:100%;height:100%;border:0}.mg360-map-title{position:absolute;left:18px;top:18px;z-index:3;max-width:calc(100% - 100px);padding:10px 15px;border-radius:10px;background:var(--mg-blue);color:#fff;font-size:10px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;box-shadow:0 8px 22px rgba(0,35,68,.3)}.mg360-map-panel .mg360-close{position:absolute;right:18px;top:18px;z-index:4}\
.mg360-info-copy{font-size:14px;line-height:1.7;color:#375367}.mg360-info-lead{margin:0 0 18px;font-size:21px;line-height:1.35;color:#092b49}.mg360-info-actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:24px}.mg360-link-card{min-height:78px;padding:15px;border:1px solid #d7e2eb;border-radius:13px;color:#092b49;text-decoration:none;display:flex;align-items:center;gap:12px;transition:border-color .2s ease,transform .2s ease}.mg360-link-card:hover{border-color:var(--mg-sky);transform:translateY(-2px)}.mg360-link-icon{width:38px;height:38px;border-radius:10px;background:var(--mg-sky);color:#fff;display:grid;place-items:center}.mg360-link-card small{display:block;color:#6f8393;font-size:9px;text-transform:uppercase;letter-spacing:.1em}.mg360-link-card strong{display:block;margin-top:4px;font-size:12px}.mg360-social-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.mg360-social-link{height:60px;border:1px solid #d7e2eb;border-radius:13px;padding:0 15px;color:#092b49;text-decoration:none;display:flex;align-items:center;gap:11px;font-size:12px;font-weight:800}.mg360-social-link i{width:12px;height:12px;border-radius:50%;background:var(--social-accent);box-shadow:0 0 0 5px rgba(11,120,191,.12);box-shadow:0 0 0 5px color-mix(in srgb,var(--social-accent) 12%,transparent)}.mg360-social-link svg{margin-left:auto;width:17px!important;height:17px!important;color:#7790a3}\
.mg360-intro{position:absolute;inset:0;z-index:200;pointer-events:auto;display:grid;place-items:center;padding:4vh 4vw;background-position:center;background-size:cover;isolation:isolate;overflow:auto}.mg360-intro:before{content:"";position:absolute;inset:-20px;z-index:-2;background:inherit;filter:blur(9px);transform:scale(1.04)}.mg360-intro:after{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(135deg,rgba(0,56,101,.78),rgba(0,76,153,.5))}.mg360-intro.is-leaving{animation:mgIntroOut .65s ease forwards}.mg360-intro-card{position:relative;width:min(920px,92vw);max-height:92vh;max-height:92dvh;overflow:auto;border-radius:28px;background:#fff;color:#092b49;padding:28px 34px 24px;box-shadow:0 30px 90px rgba(0,22,43,.45);animation:mgIntroIn .7s cubic-bezier(.2,.8,.2,1)}.mg360-intro-skip{position:absolute;right:22px;top:18px;background:transparent!important;color:#7e8e99;font-size:10px}.mg360-intro-head{display:grid;grid-template-columns:150px 1fr;gap:28px;align-items:start}.mg360-intro-logo{width:145px;height:125px;object-fit:contain;transform:scale(1.26)}.mg360-intro-badge{display:flex;align-items:center;gap:10px;color:var(--mg-blue);font-size:9px;font-weight:900;letter-spacing:.17em}.mg360-intro-badge b{display:grid;place-items:center;width:42px;height:36px;border-radius:9px;background:var(--mg-sky);color:#fff;font-size:10px}.mg360-intro h1{margin:6px 0 7px;font-size:45px;line-height:1;font-weight:400;letter-spacing:-.045em}.mg360-intro-description{max-width:650px;margin:0;color:#607684;font-size:12px;line-height:1.55}.mg360-instructions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin-top:22px}.mg360-instruction{position:relative;height:280px;border-radius:18px;overflow:hidden;background:linear-gradient(145deg,#075fae,#034d91);color:#fff;padding:15px 18px 17px;display:grid;grid-template-rows:184px 60px;text-align:center;border-bottom:4px solid #f5b600}.mg360-instruction:nth-child(2){border-bottom-color:#f07d13}.mg360-instruction:after{content:"";position:absolute;width:110px;height:110px;right:-42px;top:-42px;border-radius:50%;border:17px solid rgba(255,255,255,.07)}.mg360-gesture-stage{position:relative;z-index:1;height:184px;display:grid;place-items:center}.mg360-guide-media{display:block;object-fit:contain;pointer-events:none;-webkit-user-drag:none}.mg360-guide-desktop{width:min(340px,100%);height:204px}.mg360-guide-mobile{width:min(350px,100%);height:auto}.mg360-instruction-copy{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}.mg360-instruction small{font-size:8px;line-height:12px;font-weight:900;letter-spacing:.16em;text-transform:uppercase}.mg360-instruction strong{margin-top:5px;font-size:16px;line-height:24px}.mg360-instruction span{margin-top:4px;font-size:10px;line-height:1.35;opacity:.82}.mg360-hotspot-tip{margin-top:14px;min-height:48px;border-radius:12px;background:#edf5f8;display:flex;align-items:center;justify-content:center;gap:12px;color:#5b7282;font-size:10px}.mg360-hotspot-tip b{display:grid;place-items:center;width:32px;height:32px;border-radius:9px;background:var(--mg-sky);color:#fff;font-size:19px}.mg360-hotspot-tip strong{color:#092b49}.mg360-start{width:100%;height:56px;margin-top:12px;border-radius:11px;background:linear-gradient(90deg,var(--mg-sky),var(--mg-blue));color:#fff;text-transform:uppercase;font-size:9px;font-weight:900;letter-spacing:.16em;display:flex;align-items:center;justify-content:center;gap:18px;box-shadow:0 12px 25px rgba(0,76,153,.23)}.mg360-start svg{width:19px!important;height:19px!important}.mg360-optimized{display:block;margin-top:10px;text-align:center;color:#a3b0b8;font-size:7px}\
.mg360-toast{position:absolute;left:50%;bottom:110px;transform:translate(-50%,12px);z-index:230;padding:10px 15px;border-radius:999px;background:#082f50;color:#fff;font-size:10px;opacity:0;visibility:hidden;transition:all .25s ease;box-shadow:0 10px 30px rgba(0,20,40,.35)}.mg360-toast.is-visible{opacity:1;visibility:visible;transform:translate(-50%,0)}\
@keyframes mgFade{from{opacity:0}to{opacity:1}}@keyframes mgSlide{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:none}}@keyframes mgZoom{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}@keyframes mgIntroIn{from{opacity:0;transform:translateY(18px) scale(.97)}to{opacity:1;transform:none}}@keyframes mgIntroOut{to{opacity:0;transform:scale(1.03);visibility:hidden}}@keyframes mgCloseFloat{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-4px) scale(1.04)}}@keyframes mgCloseRing{0%{opacity:.7;transform:scale(.92)}70%,100%{opacity:0;transform:scale(1.35)}}\
@media(max-width:900px){.mg360-top{left:12px;right:12px;top:calc(10px + var(--mg-safe-top));height:50px}.mg360-brand{min-width:190px;height:50px;padding:0 12px;border-radius:11px}.mg360-brand-copy strong{font-size:9px}.mg360-brand-copy span{font-size:6px}.mg360-brand-mark{transform:scale(.8)}.mg360-location{top:60px;width:max-content;min-width:138px;max-width:min(220px,56vw);height:44px;padding:6px 12px 6px 44px;border-radius:11px}.mg360-location:before{left:9px;top:50%;width:28px;height:28px;border-width:6px}.mg360-location small{font-size:6px}.mg360-location strong{font-size:11px}.mg360-action{height:50px;min-width:50px;padding:0 12px;border-radius:11px}.mg360-action-help{display:none}.mg360-action-social span:last-child,.mg360-action-menu span:first-child{display:none}.mg360-action-social .mg360-social-dots{transform:scale(.85)}.mg360-hero,.mg360-nuclei{display:none}.mg360-stepper{display:none}.mg360-dock{left:10px;right:10px;bottom:calc(10px + var(--mg-safe-bottom));transform:none;justify-content:space-between;padding:4px;border-radius:12px}.mg360-dock-button{min-width:0;flex:1;height:56px;padding:5px 3px;font-size:7px}.mg360-dock-button.mg360-primary{min-width:0}.mg360-panel-wide{margin:0;width:94vw;border-radius:20px}.mg360-environment-grid{grid-template-columns:1fr}.mg360-scene-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.mg360-panel-head{padding:22px 20px 18px}.mg360-panel-body{padding:16px 20px 24px}.mg360-map-panel{width:90vw;height:90dvh;border-radius:18px}.mg360-intro{padding:3vh 3vw}.mg360-intro-card{padding:22px 20px 18px;border-radius:20px}.mg360-intro-head{grid-template-columns:86px 1fr;gap:15px;padding-top:12px}.mg360-intro-logo{width:84px;height:85px}.mg360-intro h1{font-size:29px;margin-top:8px}.mg360-intro-description{font-size:10px}.mg360-instructions{gap:9px;margin-top:16px}.mg360-instruction{height:190px;grid-template-rows:118px 54px;padding:8px 10px 10px}.mg360-gesture-stage{height:118px}.mg360-guide-desktop{width:min(150px,100%);height:120px}.mg360-guide-mobile{width:min(175px,112%);max-width:none}.mg360-instruction small{font-size:7px;line-height:10px}.mg360-instruction strong{font-size:12px;line-height:17px}.mg360-instruction span{font-size:8px;line-height:1.25}.mg360-hotspot-tip{font-size:8px;padding:6px 8px}.mg360-optimized{display:none}}\
@media(max-width:900px){.mg360-overlay{backdrop-filter:none;-webkit-backdrop-filter:none}}\
@media(max-width:520px){.mg360-brand{min-width:0;width:192px}.mg360-actions{gap:5px}.mg360-action{padding:0 10px}.mg360-location{top:60px}.mg360-intro-card{max-height:94vh;max-height:94dvh}.mg360-intro-head{grid-template-columns:74px 1fr}.mg360-intro-logo{width:72px}.mg360-intro-badge{font-size:7px;letter-spacing:.1em}.mg360-intro-badge b{width:34px;height:30px}.mg360-intro h1{font-size:26px}.mg360-instruction{height:178px;grid-template-rows:108px 52px}.mg360-gesture-stage{height:108px}.mg360-guide-desktop{height:110px}.mg360-guide-mobile{width:min(165px,116%)}.mg360-panel h2{font-size:24px}.mg360-info-actions,.mg360-social-list{grid-template-columns:1fr}}\
@media(max-height:700px){.mg360-intro-card{padding-top:18px}.mg360-instruction{height:170px;grid-template-rows:102px 50px}.mg360-gesture-stage{height:102px}.mg360-guide-desktop{height:104px}.mg360-guide-mobile{width:155px}.mg360-hotspot-tip{display:none}}\
@media(max-width:900px){.mg360-top{height:56px}.mg360-brand{width:auto;min-width:210px;height:56px;padding:7px 14px 7px 10px}.mg360-brand-mark{transform:scale(.9)}.mg360-brand-copy strong{font-size:11px}.mg360-brand-copy span{font-size:7px}.mg360-actions{margin-top:0}.mg360-action{height:56px;min-width:56px;padding:0 14px}.mg360-action-social .mg360-social-dots{transform:scale(1)}.mg360-location{top:66px;min-width:160px;max-width:min(240px,62vw);height:50px;padding:7px 14px 7px 52px}.mg360-location:before{left:10px;width:32px;height:32px;border-width:7px}.mg360-location small{font-size:7px}.mg360-location strong{font-size:13px}.mg360-share,.mg360-fullscreen{display:none!important}.mg360-dock{left:8px;right:8px;bottom:calc(8px + var(--mg-safe-bottom));padding:5px}.mg360-dock-button{height:66px;min-width:0;padding:6px 4px;gap:5px;font-size:11px}.mg360-dock-button svg{width:26px!important;height:26px!important}.mg360-dock-button.mg360-primary{min-width:0}.mg360-overlay{padding:8px}.mg360-panel,.mg360-panel-wide{width:calc(100vw - 16px);max-width:none;max-height:calc(100vh - 16px);max-height:calc(100dvh - 16px);margin:0;border-radius:18px}.mg360-panel-head{padding:24px 20px 20px}.mg360-panel-kicker{font-size:10px}.mg360-panel h2{font-size:30px}.mg360-close{width:56px;height:56px;flex-basis:56px}.mg360-panel-body{padding:18px 20px 26px}.mg360-environment-card{min-height:0;padding:20px 16px}.mg360-card-title{font-size:15px}.mg360-card-title b{width:32px;height:32px;font-size:10px}.mg360-destinations{gap:5px 10px;margin-top:16px}.mg360-destination{padding:9px 3px 9px 15px;font-size:12px;line-height:1.35}.mg360-destination:before{top:15px}.mg360-scene-browser summary{font-size:12px}.mg360-scene-search{height:52px;font-size:14px}.mg360-scene-card{min-height:110px}.mg360-scene-card span{font-size:11px}.mg360-info-lead{font-size:24px}.mg360-info-copy{font-size:15px}.mg360-link-card{min-height:86px}.mg360-link-card small{font-size:10px}.mg360-link-card strong{font-size:14px}.mg360-social-link{height:68px;font-size:14px}.mg360-map-panel{width:90vw;height:90vh;height:90dvh;max-height:90vh;max-height:90svh;border-radius:18px}.mg360-intro{padding:8px}.mg360-intro-card{width:calc(100vw - 16px);max-width:none;max-height:calc(100vh - 16px);max-height:calc(100dvh - 16px);padding:26px 20px 20px;border-radius:22px}.mg360-intro-skip{right:18px;top:14px;font-size:12px}.mg360-intro-head{grid-template-columns:92px 1fr;gap:16px;padding-top:14px}.mg360-intro-logo{width:92px;height:96px;transform:scale(1.08)}.mg360-intro-badge{font-size:8px}.mg360-intro-badge b{width:38px;height:34px;font-size:9px}.mg360-intro h1{margin-top:9px;font-size:30px;line-height:1.05}.mg360-intro-description{font-size:12px;line-height:1.45}.mg360-instructions{gap:10px;margin-top:18px}.mg360-instruction{height:220px;grid-template-rows:145px 58px;padding:8px 10px 12px}.mg360-gesture-stage{height:145px}.mg360-guide-desktop{width:min(160px,100%);height:142px}.mg360-guide-mobile{width:min(190px,118%);max-width:none}.mg360-instruction small{font-size:9px;line-height:12px}.mg360-instruction strong{font-size:14px;line-height:20px}.mg360-instruction span{font-size:9px;line-height:1.35}.mg360-hotspot-tip{min-height:52px;margin-top:12px;padding:7px 10px;font-size:10px}.mg360-hotspot-tip b{width:36px;height:36px}.mg360-start{height:60px;font-size:12px}.mg360-optimized{display:none}}\
@media(max-width:900px){.mg360-brand-area{gap:7px}.mg360-brand{width:clamp(122px,31vw,210px);min-width:0;gap:7px;padding:7px 8px}.mg360-corner-logo{width:clamp(72px,18vw,105px);max-height:102px}.mg360-brand-mark{width:26px;flex-basis:26px;transform:scale(.78)}.mg360-brand-copy{min-width:0;overflow:hidden}.mg360-brand-copy strong,.mg360-brand-copy span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.mg360-brand-copy strong{font-size:clamp(8px,1.65vw,11px)}.mg360-brand-copy span{font-size:clamp(5px,1.05vw,7px)}.mg360-location{top:3px;min-width:clamp(104px,26vw,160px);max-width:clamp(112px,31vw,240px);height:50px;padding:7px 10px 7px 44px}.mg360-location:before{left:7px;width:28px;height:28px;border-width:6px}.mg360-location small{font-size:clamp(5px,1.1vw,7px)}.mg360-location strong{font-size:clamp(9px,1.9vw,13px)}}\
@media(min-width:901px) and (max-width:1100px){.mg360-location{min-width:145px;max-width:170px}.mg360-action{min-width:48px;padding-left:12px;padding-right:12px}.mg360-action-help{padding:0}.mg360-action-social span:last-child,.mg360-action-menu span:first-child{display:none}.mg360-action-social .mg360-social-dots{transform:scale(.86)}}\
@media(max-width:380px){.mg360-top{height:50px}.mg360-brand-area{gap:6px}.mg360-brand{width:96px;height:50px;gap:3px;padding:5px}.mg360-brand-mark{width:20px;flex-basis:20px;transform:scale(.62)}.mg360-brand-copy strong{font-size:7px}.mg360-brand-copy span{margin-top:3px;font-size:4.5px}.mg360-corner-logo{width:64px;max-height:64px}.mg360-location{top:0;width:96px;min-width:96px;max-width:96px;height:50px;padding:6px 5px 6px 32px}.mg360-location:before{left:5px;width:21px;height:21px;border-width:4px;box-shadow:0 0 0 3px rgba(255,255,255,.14)}.mg360-location small{font-size:4.5px;letter-spacing:.1em}.mg360-location strong{font-size:8px}.mg360-actions{gap:5px}.mg360-action{width:44px;min-width:44px;height:50px;padding:0}.mg360-action-social .mg360-social-dots{transform:scale(.78)}}\
@media(max-height:700px){.mg360-intro-card{padding-top:18px}.mg360-instruction{height:170px;grid-template-rows:102px 50px}.mg360-gesture-stage{height:102px}.mg360-guide-desktop{height:104px}.mg360-guide-mobile{width:155px}.mg360-hotspot-tip{display:none}}\
@media(max-height:500px) and (orientation:landscape){.mg360-intro{padding:6px}.mg360-intro-card{width:calc(100vw - 12px);max-height:calc(100vh - 12px);max-height:calc(100dvh - 12px);padding:12px 14px;border-radius:16px}.mg360-intro-skip{right:12px;top:8px;font-size:10px}.mg360-intro-head{grid-template-columns:64px 1fr;gap:10px;padding-top:0}.mg360-intro-logo{width:60px;height:58px;transform:scale(1)}.mg360-intro-badge{gap:6px;font-size:7px}.mg360-intro-badge b{width:31px;height:26px}.mg360-intro h1{margin:3px 0 0;font-size:22px}.mg360-intro-description{display:none}.mg360-instructions{gap:8px;margin-top:8px}.mg360-instruction{height:120px;grid-template-rows:72px 36px;padding:4px 8px 8px}.mg360-gesture-stage{height:72px}.mg360-guide-desktop{height:72px}.mg360-guide-mobile{width:110px}.mg360-instruction small{font-size:6px;line-height:8px}.mg360-instruction strong{margin-top:2px;font-size:10px;line-height:13px}.mg360-instruction span{display:none}.mg360-start{height:48px;margin-top:8px;font-size:10px}.mg360-optimized{display:none}}\
@media(max-width:900px){.mg360-dock-button{height:72px;font-size:13px}.mg360-dock-button svg{width:30px!important;height:30px!important}.mg360-panel-kicker{font-size:12px}.mg360-panel h2{font-size:32px}.mg360-close{width:62px;height:62px;flex-basis:62px}.mg360-close svg{width:28px!important;height:28px!important}.mg360-card-title{font-size:17px}.mg360-card-title b{width:34px;height:34px;font-size:11px}.mg360-destination{font-size:14px}.mg360-scene-browser summary{font-size:14px}.mg360-scene-search{font-size:16px}.mg360-scene-card{min-height:120px}.mg360-scene-card span{font-size:13px}.mg360-info-copy{font-size:17px}.mg360-link-card small{font-size:11px}.mg360-link-card strong{font-size:16px}.mg360-social-link{font-size:16px}.mg360-intro-skip{font-size:14px}.mg360-intro h1{font-size:32px}.mg360-intro-description{font-size:14px}.mg360-instruction{height:256px;grid-template-rows:142px 90px}.mg360-gesture-stage{height:142px}.mg360-instruction small{font-size:10px}.mg360-instruction strong{font-size:16px;line-height:21px}.mg360-instruction span{font-size:11px}.mg360-hotspot-tip{font-size:12px}.mg360-start{height:64px;font-size:14px}}\
#mg360-ui.mg360-mobile-viewport-fix{right:auto;bottom:auto;transform-origin:0 0}#mg360-ui.mg360-mobile-viewport-fix .mg360-top{left:12px;right:12px;top:calc(10px + var(--mg-safe-top));height:56px}#mg360-ui.mg360-mobile-viewport-fix .mg360-brand-area{gap:7px}#mg360-ui.mg360-mobile-viewport-fix .mg360-brand{width:var(--mg-phone-brand-width);min-width:0;height:56px;gap:7px;padding:7px 8px}#mg360-ui.mg360-mobile-viewport-fix .mg360-brand-mark{width:26px;flex-basis:26px;transform:scale(.78)}#mg360-ui.mg360-mobile-viewport-fix .mg360-brand-copy{min-width:0;overflow:hidden}#mg360-ui.mg360-mobile-viewport-fix .mg360-brand-copy strong,#mg360-ui.mg360-mobile-viewport-fix .mg360-brand-copy span{overflow:hidden;text-overflow:clip;white-space:normal;display:-webkit-box;-webkit-box-orient:vertical}#mg360-ui.mg360-mobile-viewport-fix .mg360-brand-copy strong{font-size:10px;line-height:1.05;letter-spacing:.06em;-webkit-line-clamp:2}#mg360-ui.mg360-mobile-viewport-fix .mg360-brand-copy span{margin-top:2px;font-size:6.5px;line-height:1.1;-webkit-line-clamp:2}#mg360-ui.mg360-mobile-viewport-fix .mg360-corner-logo{width:var(--mg-phone-logo-width);max-height:82px}#mg360-ui.mg360-mobile-viewport-fix .mg360-location{top:3px;min-width:var(--mg-phone-location-min);max-width:var(--mg-phone-location-max);height:50px;padding:6px 8px 6px 42px;overflow:hidden}#mg360-ui.mg360-mobile-viewport-fix .mg360-location:before{left:7px;width:28px;height:28px;border-width:6px}#mg360-ui.mg360-mobile-viewport-fix .mg360-location small{font-size:7px;letter-spacing:.1em}#mg360-ui.mg360-mobile-viewport-fix .mg360-location strong{font-size:12px;line-height:1.05;white-space:normal;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2}#mg360-ui.mg360-mobile-viewport-fix .mg360-actions{gap:5px;margin-top:0}#mg360-ui.mg360-mobile-viewport-fix .mg360-action{height:56px;min-width:56px;padding:0 10px}#mg360-ui.mg360-mobile-viewport-fix .mg360-action-help{display:none}#mg360-ui.mg360-mobile-viewport-fix .mg360-action-social span:last-child,#mg360-ui.mg360-mobile-viewport-fix .mg360-action-menu span:first-child{display:none}#mg360-ui.mg360-mobile-viewport-fix .mg360-hero,#mg360-ui.mg360-mobile-viewport-fix .mg360-nuclei,#mg360-ui.mg360-mobile-viewport-fix .mg360-stepper{display:none}#mg360-ui.mg360-mobile-viewport-fix .mg360-share,#mg360-ui.mg360-mobile-viewport-fix .mg360-fullscreen{display:none!important}#mg360-ui.mg360-mobile-viewport-fix .mg360-dock{left:8px;right:8px;bottom:calc(8px + var(--mg-safe-bottom));transform:none;justify-content:space-between;padding:5px}#mg360-ui.mg360-mobile-viewport-fix .mg360-dock-button{min-width:0;flex:1;height:72px;padding:6px 4px;gap:5px;font-size:13px}#mg360-ui.mg360-mobile-viewport-fix .mg360-dock-button svg{width:30px!important;height:30px!important}#mg360-ui.mg360-mobile-viewport-fix .mg360-overlay{padding:8px;backdrop-filter:none;-webkit-backdrop-filter:none}#mg360-ui.mg360-mobile-viewport-fix .mg360-panel,#mg360-ui.mg360-mobile-viewport-fix .mg360-panel-wide{width:calc(100% - 16px);max-width:none;max-height:calc(100% - 16px);margin:0;border-radius:18px}#mg360-ui.mg360-mobile-viewport-fix .mg360-panel-wide{margin-left:auto;margin-right:auto}#mg360-ui.mg360-mobile-viewport-fix .mg360-environment-grid{grid-template-columns:1fr}#mg360-ui.mg360-mobile-viewport-fix .mg360-scene-grid{grid-template-columns:repeat(2,minmax(0,1fr))}#mg360-ui.mg360-mobile-viewport-fix .mg360-info-actions,#mg360-ui.mg360-mobile-viewport-fix .mg360-social-list{grid-template-columns:1fr}#mg360-ui.mg360-mobile-viewport-fix .mg360-map-panel{width:90%;height:90%;max-height:90%;border-radius:18px}#mg360-ui.mg360-mobile-viewport-fix .mg360-intro{padding:8px}#mg360-ui.mg360-mobile-viewport-fix .mg360-intro-card{width:calc(100% - 16px);max-width:none;max-height:calc(100% - 16px);padding:26px 20px 20px;border-radius:22px}#mg360-ui.mg360-phone-small .mg360-top{height:50px}#mg360-ui.mg360-phone-small .mg360-brand{width:96px;height:50px;gap:3px;padding:5px}#mg360-ui.mg360-phone-small .mg360-brand-mark{width:20px;flex-basis:20px;transform:scale(.62)}#mg360-ui.mg360-phone-small .mg360-brand-copy strong{font-size:9px}#mg360-ui.mg360-phone-small .mg360-brand-copy span{margin-top:2px;font-size:5.5px}#mg360-ui.mg360-phone-small .mg360-corner-logo{width:64px;max-height:64px}#mg360-ui.mg360-phone-small .mg360-location{top:0;width:96px;min-width:96px;max-width:96px;height:50px;padding:6px 5px 6px 32px}#mg360-ui.mg360-phone-small .mg360-location:before{left:5px;width:21px;height:21px;border-width:4px}#mg360-ui.mg360-phone-small .mg360-location small{font-size:6px;letter-spacing:.06em}#mg360-ui.mg360-phone-small .mg360-location strong{font-size:9px}#mg360-ui.mg360-phone-small .mg360-action{width:44px;min-width:44px;height:50px;padding:0}#mg360-ui.mg360-phone-landscape .mg360-intro{padding:6px}#mg360-ui.mg360-phone-landscape .mg360-intro-card{width:calc(100% - 12px);max-height:calc(100% - 12px);padding:12px 14px;border-radius:16px}#mg360-ui.mg360-phone-landscape .mg360-intro-skip{right:12px;top:8px;font-size:11px}#mg360-ui.mg360-phone-landscape .mg360-intro-head{grid-template-columns:64px 1fr;gap:10px;padding-top:0}#mg360-ui.mg360-phone-landscape .mg360-intro-logo{width:60px;height:58px;transform:scale(1)}#mg360-ui.mg360-phone-landscape .mg360-intro-badge{gap:6px;font-size:8px}#mg360-ui.mg360-phone-landscape .mg360-intro-badge b{width:31px;height:26px}#mg360-ui.mg360-phone-landscape .mg360-intro h1{margin:3px 0 0;font-size:23px}#mg360-ui.mg360-phone-landscape .mg360-intro-description{display:none}#mg360-ui.mg360-phone-landscape .mg360-instructions{gap:8px;margin-top:8px}#mg360-ui.mg360-phone-landscape .mg360-instruction{height:132px;grid-template-rows:76px 40px;padding:4px 8px 8px}#mg360-ui.mg360-phone-landscape .mg360-gesture-stage{height:76px}#mg360-ui.mg360-phone-landscape .mg360-guide-desktop{height:76px}#mg360-ui.mg360-phone-landscape .mg360-guide-mobile{width:116px}#mg360-ui.mg360-phone-landscape .mg360-instruction small{font-size:7px;line-height:9px}#mg360-ui.mg360-phone-landscape .mg360-instruction strong{margin-top:2px;font-size:12px;line-height:15px}#mg360-ui.mg360-phone-landscape .mg360-instruction span,#mg360-ui.mg360-phone-landscape .mg360-hotspot-tip{display:none}#mg360-ui.mg360-phone-landscape .mg360-start{height:50px;margin-top:8px;font-size:12px}\
@media(max-width:900px){.mg360-top{height:64px}.mg360-brand{width:240px;min-width:0;height:64px;gap:9px;padding:8px 12px}.mg360-brand-mark{width:30px;flex-basis:30px;transform:scale(.9)}.mg360-brand-copy strong{font-size:13px;line-height:1.05;letter-spacing:.07em;white-space:nowrap}.mg360-brand-copy span{margin-top:4px;font-size:8px;line-height:1.15;white-space:normal}.mg360-location{position:fixed;top:auto;bottom:calc(96px + var(--mg-safe-bottom));left:50%;width:max-content;min-width:0;max-width:calc(100% - 32px);height:auto;padding:0;transform:translateX(-50%);overflow:visible;border:0;background:transparent;box-shadow:none;pointer-events:none;text-align:center}.mg360-location:before,.mg360-location small{display:none}.mg360-location strong{display:block;margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#fff;font-size:16px;line-height:1.25;font-weight:900;letter-spacing:.02em;text-shadow:0 2px 8px rgba(0,20,40,.95),0 0 2px rgba(0,20,40,.95)}}\
@media(max-width:380px){.mg360-brand{width:180px;height:58px;gap:5px;padding:6px 7px}.mg360-brand-mark{width:24px;flex-basis:24px;transform:scale(.72)}.mg360-brand-copy strong{font-size:10px}.mg360-brand-copy span{font-size:6.5px}.mg360-location{bottom:calc(94px + var(--mg-safe-bottom))}.mg360-location strong{font-size:15px}}\
#mg360-ui.mg360-mobile-viewport-fix .mg360-top{height:64px}#mg360-ui.mg360-mobile-viewport-fix .mg360-brand{width:240px;height:64px;gap:9px;padding:8px 12px}#mg360-ui.mg360-mobile-viewport-fix .mg360-brand-mark{width:30px;flex-basis:30px;transform:scale(.9)}#mg360-ui.mg360-mobile-viewport-fix .mg360-brand-copy strong{display:block;font-size:13px;line-height:1.05;letter-spacing:.07em;white-space:nowrap;-webkit-line-clamp:unset}#mg360-ui.mg360-mobile-viewport-fix .mg360-brand-copy span{display:-webkit-box;margin-top:4px;font-size:8px;line-height:1.15;white-space:normal;-webkit-box-orient:vertical;-webkit-line-clamp:2}#mg360-ui.mg360-mobile-viewport-fix .mg360-location{position:fixed;top:auto;bottom:calc(96px + var(--mg-safe-bottom));left:50%;width:max-content;min-width:0;max-width:calc(100% - 32px);height:auto;padding:0;transform:translateX(-50%);overflow:visible;border:0;background:transparent;box-shadow:none;pointer-events:none;text-align:center}#mg360-ui.mg360-mobile-viewport-fix .mg360-location:before,#mg360-ui.mg360-mobile-viewport-fix .mg360-location small{display:none}#mg360-ui.mg360-mobile-viewport-fix .mg360-location strong{display:block;margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#fff;font-size:16px;line-height:1.25;font-weight:900;letter-spacing:.02em;text-shadow:0 2px 8px rgba(0,20,40,.95),0 0 2px rgba(0,20,40,.95);-webkit-line-clamp:unset}#mg360-ui.mg360-mobile-viewport-fix.mg360-phone-small .mg360-brand{width:180px;height:58px;gap:5px;padding:6px 7px}#mg360-ui.mg360-mobile-viewport-fix.mg360-phone-small .mg360-brand-mark{width:24px;flex-basis:24px;transform:scale(.72)}#mg360-ui.mg360-mobile-viewport-fix.mg360-phone-small .mg360-brand-copy strong{font-size:10px}#mg360-ui.mg360-mobile-viewport-fix.mg360-phone-small .mg360-brand-copy span{font-size:6.5px}#mg360-ui.mg360-mobile-viewport-fix.mg360-phone-small .mg360-location{bottom:calc(94px + var(--mg-safe-bottom))}#mg360-ui.mg360-mobile-viewport-fix.mg360-phone-small .mg360-location strong{font-size:15px}\
@media(max-width:380px){.mg360-instructions{grid-template-columns:1fr}.mg360-instruction{height:234px;grid-template-rows:140px 70px}.mg360-gesture-stage{height:140px}}\
@media(min-width:381px) and (max-width:400px){.mg360-brand{width:220px}}\
#mg360-ui.mg360-mobile-viewport-fix.mg360-phone-small .mg360-instructions{grid-template-columns:1fr}#mg360-ui.mg360-mobile-viewport-fix.mg360-phone-small .mg360-instruction{height:234px;grid-template-rows:140px 70px}#mg360-ui.mg360-mobile-viewport-fix.mg360-phone-small .mg360-gesture-stage{height:140px}\
#mg360-ui.mg360-mobile-viewport-fix.mg360-phone-landscape .mg360-dock{left:50%;right:auto;width:calc(100% - 32px);max-width:620px;transform:translateX(-50%)}#mg360-ui.mg360-mobile-viewport-fix.mg360-tablet .mg360-top{left:24px;right:24px}#mg360-ui.mg360-mobile-viewport-fix.mg360-tablet .mg360-brand{width:320px}#mg360-ui.mg360-mobile-viewport-fix.mg360-tablet .mg360-brand-copy strong{font-size:14px}#mg360-ui.mg360-mobile-viewport-fix.mg360-tablet .mg360-brand-copy span{font-size:9px}#mg360-ui.mg360-mobile-viewport-fix.mg360-tablet .mg360-dock{left:50%;right:auto;width:calc(100% - 32px);max-width:620px;transform:translateX(-50%)}#mg360-ui.mg360-mobile-viewport-fix.mg360-tablet .mg360-panel,#mg360-ui.mg360-mobile-viewport-fix.mg360-tablet .mg360-panel-wide{width:calc(100% - 32px);max-width:740px}#mg360-ui.mg360-mobile-viewport-fix.mg360-tablet .mg360-environment-grid{grid-template-columns:repeat(2,minmax(0,1fr))}#mg360-ui.mg360-mobile-viewport-fix.mg360-tablet .mg360-scene-grid{grid-template-columns:repeat(3,minmax(0,1fr))}#mg360-ui.mg360-mobile-viewport-fix.mg360-tablet .mg360-info-actions,#mg360-ui.mg360-mobile-viewport-fix.mg360-tablet .mg360-social-list{grid-template-columns:repeat(2,minmax(0,1fr))}#mg360-ui.mg360-mobile-viewport-fix.mg360-tablet .mg360-intro-card{width:calc(100% - 32px);max-width:720px}\
.mg360-vr{position:absolute;right:24px;top:76px;z-index:20;width:48px;height:48px;border-radius:12px;background:rgba(3,82,153,.88);border:1px solid rgba(255,255,255,.38)!important;color:#fff;display:grid;place-items:center;box-shadow:0 10px 30px rgba(0,54,108,.22);transition:transform .2s ease,filter .2s ease}.mg360-vr svg{width:27px!important;height:27px!important}.mg360-vr:hover{filter:brightness(1.08);transform:translateY(2px)}\
@media(max-width:900px){.mg360-share{display:flex!important}.mg360-fullscreen{display:none!important}.mg360-location{left:61.7%}.mg360-vr{right:12px;top:calc(76px + var(--mg-safe-top));width:56px;height:56px;border-radius:11px}.mg360-vr svg{width:31px!important;height:31px!important}}\
@media(max-width:380px){.mg360-dock-button{font-size:11px}.mg360-share span{font-size:10px}.mg360-vr{top:calc(70px + var(--mg-safe-top));width:44px;height:50px}.mg360-vr svg{width:27px!important;height:27px!important}}\
#mg360-ui.mg360-mobile-viewport-fix .mg360-share{display:flex!important}#mg360-ui.mg360-mobile-viewport-fix .mg360-fullscreen{display:none!important}#mg360-ui.mg360-mobile-viewport-fix .mg360-location{left:61.7%}#mg360-ui.mg360-mobile-viewport-fix .mg360-vr{right:12px;top:calc(76px + var(--mg-safe-top));width:56px;height:56px;border-radius:11px}#mg360-ui.mg360-mobile-viewport-fix .mg360-vr svg{width:31px!important;height:31px!important}#mg360-ui.mg360-mobile-viewport-fix.mg360-phone-small .mg360-dock-button{font-size:11px}#mg360-ui.mg360-mobile-viewport-fix.mg360-phone-small .mg360-share span{font-size:10px}#mg360-ui.mg360-mobile-viewport-fix.mg360-phone-small .mg360-vr{top:calc(70px + var(--mg-safe-top));width:44px;height:50px}#mg360-ui.mg360-mobile-viewport-fix.mg360-phone-small .mg360-vr svg{width:27px!important;height:27px!important}#mg360-ui.mg360-mobile-viewport-fix.mg360-phone-landscape .mg360-location,#mg360-ui.mg360-mobile-viewport-fix.mg360-tablet .mg360-location{left:calc(50% + 76px)}\
.mg360-vr-icon{display:block;width:27px;height:23px;background:#f08a19;-webkit-mask:url("./skin-fecomercio/assets/vr-oculos-modelo.png") center/contain no-repeat;mask:url("./skin-fecomercio/assets/vr-oculos-modelo.png") center/contain no-repeat;transition:transform .2s ease,background-color .2s ease}.mg360-vr:hover .mg360-vr-icon{background:#f6be00}.mg360-vr:active .mg360-vr-icon{transform:scale(.9)}\
@media(max-width:900px){.mg360-dock{padding:4px;border-radius:13px}.mg360-dock-button{height:58px;padding:4px 3px;gap:3px;font-size:11px}.mg360-dock-button svg{width:24px!important;height:24px!important}.mg360-location{left:50%;bottom:calc(80px + var(--mg-safe-bottom))}.mg360-vr-icon{width:30px;height:26px}}\
@media(max-width:380px){.mg360-dock-button{height:56px;font-size:10px}.mg360-dock-button svg{width:23px!important;height:23px!important}.mg360-share span{font-size:9.5px}.mg360-location{left:50%;bottom:calc(78px + var(--mg-safe-bottom))}.mg360-vr-icon{width:27px;height:23px}}\
#mg360-ui.mg360-mobile-viewport-fix .mg360-dock{padding:4px;border-radius:13px}#mg360-ui.mg360-mobile-viewport-fix .mg360-dock-button{height:58px;padding:4px 3px;gap:3px;font-size:11px}#mg360-ui.mg360-mobile-viewport-fix .mg360-dock-button svg{width:24px!important;height:24px!important}#mg360-ui.mg360-mobile-viewport-fix .mg360-location,#mg360-ui.mg360-mobile-viewport-fix.mg360-phone-landscape .mg360-location,#mg360-ui.mg360-mobile-viewport-fix.mg360-tablet .mg360-location{left:50%;bottom:calc(80px + var(--mg-safe-bottom))}#mg360-ui.mg360-mobile-viewport-fix.mg360-phone-small .mg360-dock-button{height:56px;font-size:10px}#mg360-ui.mg360-mobile-viewport-fix.mg360-phone-small .mg360-dock-button svg{width:23px!important;height:23px!important}#mg360-ui.mg360-mobile-viewport-fix.mg360-phone-small .mg360-share span{font-size:9.5px}#mg360-ui.mg360-mobile-viewport-fix.mg360-phone-small .mg360-location{left:50%;bottom:calc(78px + var(--mg-safe-bottom))}#mg360-ui.mg360-mobile-viewport-fix.mg360-tablet .mg360-vr{right:24px}\
@media(prefers-reduced-motion:reduce){#mg360-ui *,#mg360-ui *:before,#mg360-ui *:after{animation-duration:.01ms!important;transition-duration:.01ms!important;animation-iteration-count:1!important}}';
    document.head.appendChild(style);

    var root = document.createElement('div');
    root.id = 'mg360-ui';
    root.setAttribute('data-version', config.version || '4');
    root.innerHTML = '\
      <header class="mg360-top">\
        <div class="mg360-brand-area">\
          <div class="mg360-brand">\
            <span class="mg360-brand-mark" aria-hidden="true"><i></i><i></i><i></i></span>\
            <span class="mg360-brand-copy"><strong>' + escapeHtml(config.brand.systemName) + '</strong><span>' + escapeHtml(config.brand.tourName) + '</span></span>\
          </div>\
          <img class="mg360-corner-logo" src="' + escapeHtml(config.brand.cornerLogo) + '" alt="Sesc Fecomércio Senac">\
        </div>\
        <div class="mg360-location" aria-live="polite"><small>VOCÊ ESTÁ EM</small><strong>Carregando...</strong></div>\
        <nav class="mg360-actions" aria-label="Ações principais">\
          <button class="mg360-action mg360-action-help" type="button" aria-label="Como navegar">' + icon('help') + '</button>\
          <button class="mg360-action mg360-action-social" type="button" aria-label="Abrir redes sociais"><span class="mg360-social-dots" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span>Redes</span></button>\
          <button class="mg360-action mg360-action-menu" type="button" aria-label="Explorar"><span>Explorar</span>' + icon('menu') + '</button>\
        </nav>\
      </header>\
      <button class="mg360-vr" type="button" aria-label="Ativar visualização em realidade virtual"><span class="mg360-vr-icon" aria-hidden="true"></span></button>\
      <nav class="mg360-nuclei" aria-label="Núcleos do tour"></nav>\
      <div class="mg360-stepper" aria-label="Trocar panorâmica"><button type="button" data-step="1" aria-label="Próxima panorâmica">+</button><button type="button" data-step="-1" aria-label="Panorâmica anterior">−</button></div>\
      <nav class="mg360-dock" aria-label="Controles do tour">\
        <button class="mg360-dock-button mg360-share" type="button" aria-label="Compartilhar tour">' + icon('share') + '<span>Compartilhar</span></button>\
        <button class="mg360-dock-button mg360-map" type="button" aria-label="Abrir mapa">' + icon('map') + '<span>Mapa</span></button>\
        <button class="mg360-dock-button mg360-primary mg360-environments" type="button" aria-label="Abrir ambientes">' + icon('grid') + '<span>Ambientes</span></button>\
        <button class="mg360-dock-button mg360-sound" type="button" aria-label="Ligar ou desligar som">' + icon('sound') + '<span>Som</span></button>\
        <button class="mg360-dock-button mg360-fullscreen" type="button" aria-label="Tela cheia">' + icon('fullscreen') + '<span>Tela cheia</span></button>\
      </nav>\
      <div class="mg360-toast" role="status" aria-live="polite"></div>';

    document.body.appendChild(root);

    var viewportFixFrame = 0;
    function refreshMobileViewportFix() {
      if (viewportFixFrame) window.cancelAnimationFrame(viewportFixFrame);
      viewportFixFrame = window.requestAnimationFrame(function () {
        viewportFixFrame = 0;
        applyMobileViewportFix(root);
      });
    }
    applyMobileViewportFix(root);
    window.addEventListener('resize', refreshMobileViewportFix, { passive: true });
    window.addEventListener('orientationchange', refreshMobileViewportFix);
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', refreshMobileViewportFix, { passive: true });
    }

    var state = {
      index: Number(config.homeIndex) || 0,
      spinning: true,
      soundOn: true,
      modal: null,
      toastTimer: null
    };

    var refs = {
      location: root.querySelector('.mg360-location strong'),
      nuclei: root.querySelector('.mg360-nuclei'),
      share: root.querySelector('.mg360-share'),
      sound: root.querySelector('.mg360-sound'),
      vr: root.querySelector('.mg360-vr'),
      toast: root.querySelector('.mg360-toast')
    };

    function groupById(id) {
      for (var i = 0; i < config.groups.length; i += 1) {
        if (config.groups[i].id === id) return config.groups[i];
      }
      return config.groups[0];
    }

    function sceneAt(index) {
      return config.scenes[index] || config.scenes[0];
    }

    function getPlaylist() {
      try {
        return window.tour && window.tour.player && window.tour.player.getById('mainPlayList');
      } catch (error) {
        return null;
      }
    }

    function getRootPlayer() {
      try {
        return window.tour && window.tour.player && window.tour.player.getById('rootPlayer');
      } catch (error) {
        return null;
      }
    }

    function showToast(message) {
      clearTimeout(state.toastTimer);
      refs.toast.textContent = message;
      refs.toast.classList.add('is-visible');
      state.toastTimer = setTimeout(function () {
        refs.toast.classList.remove('is-visible');
      }, 2200);
    }

    function applyRotation() {
      try {
        var playlist = getPlaylist();
        if (!playlist) return;
        var items = playlist.get('items');
        var item = items && items[state.index];
        var camera = item && item.get('camera');
        if (camera && camera.set) camera.set('automaticRotationSpeed', state.spinning ? 2 : 0);
      } catch (error) {
        /* O player pode ainda estar trocando de câmera. */
      }
    }

    function updateUi(index) {
      var scene = sceneAt(index);
      var group = groupById(scene.group);
      state.index = scene.index;
      refs.location.textContent = scene.name;
      var buttons = refs.nuclei.querySelectorAll('button');
      for (var i = 0; i < buttons.length; i += 1) {
        buttons[i].classList.toggle('is-active', buttons[i].getAttribute('data-group') === group.id);
      }
      setTimeout(applyRotation, 220);
    }

    function goTo(index) {
      var total = config.scenes.length;
      var target = ((Number(index) % total) + total) % total;
      closeModal();
      if (window.tour && typeof window.tour.setMediaByIndex === 'function') {
        window.tour.setMediaByIndex(target);
        updateUi(target);
      } else {
        showToast('O tour ainda está carregando. Tente novamente.');
      }
    }

    function step(amount) {
      goTo(state.index + Number(amount));
    }

    function closeModal() {
      if (!state.modal) return;
      var iframe = state.modal.querySelector('iframe');
      if (iframe) iframe.src = 'about:blank';
      state.modal.remove();
      state.modal = null;
      document.body.classList.remove('mg360-modal-open');
    }

    function makeOverlay(panelClass, label) {
      closeModal();
      var overlay = document.createElement('div');
      overlay.className = 'mg360-overlay';
      overlay.innerHTML = '<button class="mg360-overlay-backdrop" type="button" aria-label="Fechar janela"></button><section class="' + panelClass + '" role="dialog" aria-modal="true" aria-label="' + escapeHtml(label) + '"></section>';
      overlay.querySelector('.mg360-overlay-backdrop').addEventListener('click', closeModal);
      root.appendChild(overlay);
      state.modal = overlay;
      document.body.classList.add('mg360-modal-open');
      return overlay.querySelector('section');
    }

    function panelHeader(kicker, title) {
      return '<header class="mg360-panel-head"><div><span class="mg360-panel-kicker">' + escapeHtml(kicker) + '</span><h2>' + escapeHtml(title) + '</h2></div><button class="mg360-close" type="button" aria-label="Fechar">' + icon('close') + '</button></header>';
    }

    function wirePanelClose(panel) {
      panel.querySelector('.mg360-close').addEventListener('click', closeModal);
    }

    function openEnvironments() {
      var panel = makeOverlay('mg360-panel mg360-panel-wide', 'Atalhos para ambientes');
      var cards = config.groups.map(function (group) {
        var destinations = group.destinations.map(function (destination) {
          return '<button class="mg360-destination" type="button" data-index="' + destination.index + '">' + escapeHtml(destination.label) + '</button>';
        }).join('');
        return '<article class="mg360-environment-card" style="--card-accent:' + group.accent + ';--card-surface:' + group.surface + '"><button class="mg360-card-title" type="button" data-index="' + group.destinations[0].index + '"><b>' + escapeHtml(group.number) + '</b><span>' + escapeHtml(group.title) + '</span><span>→</span></button><div class="mg360-destinations">' + destinations + '</div></article>';
      }).join('');
      var sceneCards = config.scenes.map(function (scene) {
        return '<button class="mg360-scene-card" type="button" data-index="' + scene.index + '" data-search="' + escapeHtml(scene.name.toLowerCase()) + '"><img src="' + escapeHtml(scene.thumb) + '" alt="" loading="lazy"><span>' + escapeHtml(scene.name) + '</span></button>';
      }).join('');
      panel.innerHTML = panelHeader('Navegação rápida', 'Para onde vamos?') + '<div class="mg360-panel-body"><div class="mg360-environment-grid">' + cards + '</div><details class="mg360-scene-browser"><summary>Ver todas as ' + config.scenes.length + ' panorâmicas</summary><div class="mg360-scene-tools"><input class="mg360-scene-search" type="search" placeholder="Buscar uma panorâmica" aria-label="Buscar panorâmica"></div><div class="mg360-scene-grid">' + sceneCards + '</div></details></div>';
      wirePanelClose(panel);
      var navigationButtons = panel.querySelectorAll('[data-index]');
      for (var i = 0; i < navigationButtons.length; i += 1) {
        navigationButtons[i].addEventListener('click', function () { goTo(Number(this.getAttribute('data-index'))); });
      }
      var search = panel.querySelector('.mg360-scene-search');
      search.addEventListener('input', function () {
        var query = this.value.toLowerCase().trim();
        var sceneButtons = panel.querySelectorAll('.mg360-scene-card');
        for (var j = 0; j < sceneButtons.length; j += 1) {
          sceneButtons[j].hidden = sceneButtons[j].getAttribute('data-search').indexOf(query) === -1;
        }
      });
    }

    function openInfo() {
      var scene = sceneAt(state.index);
      var group = groupById(scene.group);
      var panel = makeOverlay('mg360-panel', 'Informações do ambiente');
      panel.innerHTML = panelHeader(group.number + ' · ' + group.short, scene.name) + '<div class="mg360-panel-body mg360-info-copy"><p class="mg360-info-lead">' + escapeHtml(group.description) + '</p><p>' + escapeHtml(config.brand.tagline) + '</p><div class="mg360-info-actions"><a class="mg360-link-card" href="' + escapeHtml(config.contact.website) + '" target="_blank" rel="noopener"><span class="mg360-link-icon">' + icon('external') + '</span><span><small>Site oficial</small><strong>Sesc Tocantins</strong></span></a><a class="mg360-link-card" href="' + escapeHtml(config.contact.phoneUrl) + '"><span class="mg360-link-icon">' + icon('phone') + '</span><span><small>Telefone geral</small><strong>' + escapeHtml(config.contact.phoneLabel) + '</strong></span></a></div></div>';
      wirePanelClose(panel);
    }

    function openSocial() {
      var panel = makeOverlay('mg360-panel', 'Redes sociais do Sesc Tocantins');
      var links = config.social.map(function (social) {
        return '<a class="mg360-social-link" href="' + escapeHtml(social.url) + '" target="_blank" rel="noopener" style="--social-accent:' + social.accent + '"><i></i><span>' + escapeHtml(social.name) + '</span>' + icon('external') + '</a>';
      }).join('');
      panel.innerHTML = panelHeader('Sesc Tocantins', 'Acompanhe nossas redes') + '<div class="mg360-panel-body"><div class="mg360-social-list">' + links + '</div><div class="mg360-info-actions"><a class="mg360-link-card" href="' + escapeHtml(config.contact.website) + '" target="_blank" rel="noopener"><span class="mg360-link-icon">' + icon('external') + '</span><span><small>Mais informações</small><strong>Site oficial</strong></span></a><a class="mg360-link-card" href="' + escapeHtml(config.contact.phoneUrl) + '"><span class="mg360-link-icon">' + icon('phone') + '</span><span><small>Fale conosco</small><strong>' + escapeHtml(config.contact.phoneLabel) + '</strong></span></a></div></div>';
      wirePanelClose(panel);
    }

    function openMap() {
      var panel = makeOverlay('mg360-map-panel', config.map.title);
      panel.innerHTML = '<span class="mg360-map-title">' + escapeHtml(config.map.title) + '</span><button class="mg360-close" type="button" aria-label="Fechar mapa">' + icon('close') + '</button><iframe title="Mapa do Sesc" src="' + escapeHtml(config.map.embedUrl) + '" allowfullscreen loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>';
      panel.querySelector('.mg360-close').addEventListener('click', closeModal);
    }

    function shareTour() {
      var shareData = {
        title: document.title || 'Tour virtual Sesc Tocantins',
        text: 'Conheça o tour virtual do Sesc Tocantins.',
        url: window.location.href
      };
      if (navigator.share) {
        navigator.share(shareData).catch(function (error) {
          if (error && error.name !== 'AbortError') copyTourLink(shareData.url);
        });
        return;
      }
      copyTourLink(shareData.url);
    }

    function copyTourLink(url) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(function () {
          showToast('Link do tour copiado.');
        }).catch(function () { fallbackCopy(url); });
        return;
      }
      fallbackCopy(url);
    }

    function fallbackCopy(url) {
      var field = document.createElement('textarea');
      field.value = url;
      field.setAttribute('readonly', '');
      field.style.position = 'fixed';
      field.style.opacity = '0';
      document.body.appendChild(field);
      field.select();
      try {
        document.execCommand('copy');
        showToast('Link do tour copiado.');
      } catch (error) {
        showToast('Não foi possível copiar o link.');
      }
      field.remove();
    }

    function toggleSound() {
      var player = getRootPlayer();
      if (!player) {
        showToast('O áudio ainda está carregando.');
        return;
      }
      try {
        var muted = Boolean(player.get('mute'));
        player.set('mute', !muted);
        state.soundOn = muted;
        refs.sound.classList.toggle('is-active', state.soundOn);
        refs.sound.innerHTML = (state.soundOn ? icon('sound') : icon('mute')) + '<span>Som</span>';
        showToast(state.soundOn ? 'Som ativado' : 'Som desativado');
      } catch (error) {
        showToast('Não foi possível alterar o som agora.');
      }
    }

    function toggleFullscreen() {
      var doc = document;
      var docEl = document.documentElement;
      if (doc.fullscreenElement || doc.webkitFullscreenElement) {
        var exit = doc.exitFullscreen || doc.webkitExitFullscreen;
        if (exit) exit.call(doc);
      } else {
        var request = docEl.requestFullscreen || docEl.webkitRequestFullscreen;
        if (request) request.call(docEl);
      }
    }

    function toggleVr() {
      var player = getRootPlayer();
      if (!player || typeof player.toggleVR !== 'function') {
        showToast('A visualização em VR ainda não está disponível.');
        return;
      }
      try {
        player.toggleVR();
        setTimeout(function () {
          try {
            var viewer = player.getMainViewer && player.getMainViewer();
            var active = viewer && viewer.get('viewMode') === 'vr';
            showToast(active ? 'Modo de realidade virtual ativado.' : 'O modo VR requer um dispositivo e navegador compatíveis.');
          } catch (error) {
            showToast('O modo VR requer um dispositivo e navegador compatíveis.');
          }
        }, 250);
      } catch (error) {
        showToast('Não foi possível iniciar o modo VR neste dispositivo.');
      }
    }

    function buildNuclei() {
      refs.nuclei.innerHTML = config.groups.map(function (group) {
        return '<button class="mg360-nucleus" type="button" data-group="' + escapeHtml(group.id) + '" data-index="' + group.destinations[0].index + '">' + escapeHtml(group.short) + '</button>';
      }).join('');
      var buttons = refs.nuclei.querySelectorAll('button');
      for (var i = 0; i < buttons.length; i += 1) {
        buttons[i].addEventListener('click', function () { goTo(Number(this.getAttribute('data-index'))); });
      }
    }

    function showIntro() {
      var intro = document.createElement('section');
      intro.className = 'mg360-intro';
      intro.setAttribute('role', 'dialog');
      intro.setAttribute('aria-modal', 'true');
      intro.setAttribute('aria-label', config.intro.title);
      intro.style.backgroundImage = 'url("' + config.intro.background.replace(/"/g, '') + '")';
      var desktopGuide = config.intro.desktopGuide || 'skin-fecomercio/assets/mouse-desktop.apng.png';
      var mobileGuide = config.intro.mobileGuide || 'skin-fecomercio/assets/gestos-mobile.apng.png';
      intro.innerHTML = '<div class="mg360-intro-card"><button class="mg360-intro-skip" type="button">Pular</button><div class="mg360-intro-head"><img class="mg360-intro-logo" src="' + escapeHtml(config.brand.logo) + '" alt="Sesc Fecomércio Senac"><div><div class="mg360-intro-badge"><b>360°</b><span>VISITA VIRTUAL</span></div><h1>' + escapeHtml(config.intro.title) + '</h1><p class="mg360-intro-description">' + escapeHtml(config.intro.description) + '</p></div></div><div class="mg360-instructions" aria-label="Como navegar no tour"><article class="mg360-instruction"><div class="mg360-gesture-stage"><img class="mg360-guide-media mg360-guide-desktop" src="' + escapeHtml(desktopGuide) + '" alt="Movimento do mouse para navegar no tour"></div><div class="mg360-instruction-copy"><small>No computador</small><strong>Arraste para explorar</strong><span>Segure o mouse e mova para olhar ao redor.</span></div></article><article class="mg360-instruction"><div class="mg360-gesture-stage"><img class="mg360-guide-media mg360-guide-mobile" src="' + escapeHtml(mobileGuide) + '" alt="Gesto de pinça para navegar no celular"></div><div class="mg360-instruction-copy"><small>No celular</small><strong>Use os dedos</strong><span>Arraste para girar e faça a pinça para aproximar.</span></div></article></div><div class="mg360-hotspot-tip"><b>+</b><span><strong>Toque nos pontos interativos</strong> para avançar e abrir informações.</span></div><button class="mg360-start" type="button">Começar a visita ' + icon('arrow') + '</button><small class="mg360-optimized">Experiência otimizada para computador, celular e tablet</small></div>';
      root.appendChild(intro);
      document.body.classList.add('mg360-modal-open');
      function dismissIntro() {
        intro.classList.add('is-leaving');
        document.body.classList.remove('mg360-modal-open');
        root.scrollTop = 0;
        root.scrollLeft = 0;
        setTimeout(function () { intro.remove(); }, 650);
      }
      intro.querySelector('.mg360-intro-skip').addEventListener('click', dismissIntro);
      intro.querySelector('.mg360-start').addEventListener('click', dismissIntro);
    }

    buildNuclei();
    updateUi(state.index);
    showIntro();

    root.querySelector('.mg360-action-help').addEventListener('click', showIntro);
    root.querySelector('.mg360-action-social').addEventListener('click', openSocial);
    root.querySelector('.mg360-action-menu').addEventListener('click', openEnvironments);
    root.querySelector('.mg360-map').addEventListener('click', openMap);
    root.querySelector('.mg360-environments').addEventListener('click', openEnvironments);
    refs.share.addEventListener('click', shareTour);
    refs.sound.addEventListener('click', toggleSound);
    refs.vr.addEventListener('click', toggleVr);
    root.querySelector('.mg360-fullscreen').addEventListener('click', toggleFullscreen);
    var stepButtons = root.querySelectorAll('.mg360-stepper button');
    for (var s = 0; s < stepButtons.length; s += 1) {
      stepButtons[s].addEventListener('click', function () { step(Number(this.getAttribute('data-step'))); });
    }

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeModal();
    });

    var lastEngineIndex = -1;
    setInterval(function () {
      var playlist = getPlaylist();
      if (!playlist) return;
      try {
        var selected = Number(playlist.get('selectedIndex'));
        if (selected >= 0 && selected < config.scenes.length && selected !== lastEngineIndex) {
          lastEngineIndex = selected;
          updateUi(selected);
        }
      } catch (error) {
        /* Mantém a interface funcionando durante a inicialização do player. */
      }
    }, 420);
  }

  loadConfig().then(mount).catch(function (error) {
    console.error('[MG TOUR 360] Skin Fecomércio:', error);
  });
}());
