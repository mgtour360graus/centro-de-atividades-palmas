(function () {
  'use strict';
  var tracking = null;
  var timer = null;
  function root() { return document.getElementById('mg360-ui'); }
  function mobile() { var ui=root(); return window.matchMedia('(max-width:900px)').matches || !!(ui && ui.classList.contains('mg360-mobile-viewport-fix')); }
  function restore() { var ui=root(); if(ui) ui.classList.remove('mg360-panorama-dragging'); }
  function start(event) {
    if (!mobile() || event.button > 0 || !event.target.closest('#viewer') || event.target.closest('#mg360-ui,a,button,input,select,textarea,[role="button"]')) return;
    tracking={id:event.pointerId,x:event.clientX,y:event.clientY,moved:false};
    clearTimeout(timer);
  }
  function move(event) {
    if (!tracking || event.pointerId!==tracking.id || !mobile()) return;
    if (Math.hypot(event.clientX-tracking.x,event.clientY-tracking.y)<6 && !tracking.moved) return;
    tracking.moved=true;
    var ui=root(); if(ui) ui.classList.add('mg360-panorama-dragging');
  }
  function end(event) {
    if(!tracking || event.pointerId!==tracking.id) return;
    var moved=tracking.moved; tracking=null;
    if(moved) timer=setTimeout(restore,420); else restore();
  }
  document.addEventListener('pointerdown',start,{capture:true,passive:true});
  document.addEventListener('pointermove',move,{capture:true,passive:true});
  document.addEventListener('pointerup',end,{capture:true,passive:true});
  document.addEventListener('pointercancel',end,{capture:true,passive:true});
  window.addEventListener('blur',function(){tracking=null;clearTimeout(timer);restore();});
  window.addEventListener('resize',function(){if(!mobile()){tracking=null;clearTimeout(timer);restore();}});
}());
