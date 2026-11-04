// WebGrow360 site footer: reveal, dithered wordmark spotlight, studio clock, copy email, magnetic CTA, back-to-top
(function(){
  var f=document.querySelector('.wf'); if(!f) return;
  f.classList.add('js');
  var still=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine=window.matchMedia('(hover:hover) and (pointer:fine)').matches;

  // staggered reveal
  var rv=f.querySelectorAll('.wf-rv');
  if('IntersectionObserver' in window && !still){
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } }); },{threshold:.15});
    rv.forEach(function(el){ io.observe(el); });
  } else rv.forEach(function(el){ el.classList.add('in'); });

  // wordmark: fit the word to the container width, light up the dots under the cursor
  var mark=f.querySelector('.wf-mark'), word=mark&&mark.querySelector('.wf-m-base');
  function fit(){ if(!word) return; mark.style.setProperty('--wf-fs','100px');
    var w=word.scrollWidth; if(w) mark.style.setProperty('--wf-fs',(100*mark.clientWidth/w).toFixed(2)+'px'); }
  fit(); window.addEventListener('resize',fit);
  if(document.fonts&&document.fonts.ready) document.fonts.ready.then(fit);
  // web fonts load without blocking render, so re-fit whenever another font finishes loading
  if(document.fonts&&document.fonts.addEventListener) document.fonts.addEventListener('loadingdone',fit);
  if(mark){
    mark.addEventListener('pointermove',function(e){ var r=mark.getBoundingClientRect();
      mark.style.setProperty('--mx',(e.clientX-r.left)+'px'); mark.style.setProperty('--my',(e.clientY-r.top)+'px'); });
    mark.addEventListener('pointerleave',function(){ mark.style.setProperty('--mx','-999px'); mark.style.setProperty('--my','-999px'); });
  }

  // live Kolkata studio clock (Mon–Sat, 10:00–19:00 IST)
  var clk=f.querySelector('.wf-clock');
  function tick(){ if(!clk) return;
    var now=new Date(), ist=new Date(now.getTime()+(now.getTimezoneOffset()+330)*60000);
    var h=ist.getHours(), m=ist.getMinutes(), d=ist.getDay(), open=d!==0 && h>=10 && h<19;
    clk.querySelector('b').textContent=((h%12)||12)+':'+(m<10?'0':'')+m+(h<12?' AM':' PM')+' IST';
    clk.querySelector('.wf-clock-s').textContent=open?'Studio open — we reply today':'After hours — we reply next working day';
    clk.classList.toggle('open',open);
  }
  tick(); setInterval(tick,30000);

  // copy email
  var cp=f.querySelector('.wf-copy');
  if(cp) cp.addEventListener('click',function(){
    var t=cp.querySelector('span'), done=function(){ cp.classList.add('ok'); t.textContent='Copied'; setTimeout(function(){ cp.classList.remove('ok'); t.textContent='Copy'; },1800); };
    if(navigator.clipboard) navigator.clipboard.writeText(cp.dataset.copy).then(done,function(){});
  });

  // magnetic CTA
  var cta=f.querySelector('.wf-cta');
  if(cta && fine && !still){
    cta.addEventListener('pointermove',function(e){ var r=cta.getBoundingClientRect();
      cta.style.setProperty('--mx',((e.clientX-r.left-r.width/2)*.18)+'px'); cta.style.setProperty('--my',((e.clientY-r.top-r.height/2)*.3)+'px'); });
    cta.addEventListener('pointerleave',function(){ cta.style.setProperty('--mx','0px'); cta.style.setProperty('--my','0px'); });
  }

  // back to top with scroll-progress ring
  var top=f.querySelector('.wf-top-btn'), raf=0;
  function prog(){ raf=0; var h=document.documentElement, max=h.scrollHeight-h.clientHeight; top.style.setProperty('--p',max>0?(h.scrollTop/max).toFixed(3):0); }
  if(top){
    window.addEventListener('scroll',function(){ if(!raf) raf=requestAnimationFrame(prog); },{passive:true}); prog();
    top.addEventListener('click',function(){
      if(window.lenis&&window.lenis.scrollTo) window.lenis.scrollTo(0); else window.scrollTo({top:0,behavior:still?'auto':'smooth'}); });
  }

  var y=f.querySelector('.wf-year'); if(y) y.textContent=new Date().getFullYear();
})();
