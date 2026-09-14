/* RV University Placements — shared interactivity (no dependencies) */
(function(){
  'use strict';

  var PERSONAS = {
    student: { label: 'Student', short: 'Student', page: 'students.html' },
    recruiter: { label: 'Recruiter', short: 'Recruiter', page: 'recruiters.html' },
    parent: { label: 'Parent', short: 'Parent', page: 'parents.html' }
  };

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var currentPage = (document.body.getAttribute('data-page') || '').toLowerCase();

  /* ---------------- header scroll state ---------------- */
  var header = document.querySelector('.site-header');
  function onScroll(){
    if(!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 12);
    var toTop = document.querySelector('.to-top');
    if(toTop) toTop.classList.toggle('is-visible', window.scrollY > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------- mobile nav ---------------- */
  var burger = document.querySelector('.burger');
  var sheet = document.querySelector('.mobile-sheet');
  if(burger && sheet){
    burger.addEventListener('click', function(){
      var open = burger.classList.toggle('is-open');
      sheet.classList.toggle('is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    sheet.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        burger.classList.remove('is-open');
        sheet.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------------- active nav link ---------------- */
  document.querySelectorAll('.main-nav a, .mobile-sheet a').forEach(function(a){
    var href = (a.getAttribute('href') || '').split('#')[0];
    if(href === (currentPage === 'home' ? 'index.html' : currentPage + '.html')){
      a.classList.add('is-active');
    }
  });

  /* ---------------- back to top ---------------- */
  var toTop = document.querySelector('.to-top');
  if(toTop){
    toTop.addEventListener('click', function(){
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------------- persona switcher ---------------- */
  var STORE_KEY = 'rvu_persona';
  function getPersona(){ try { return localStorage.getItem(STORE_KEY); } catch(e){ return null; } }
  function setPersona(key){ try { localStorage.setItem(STORE_KEY, key); } catch(e){} applyPersona(key); }

  function applyPersona(key){
    var data = PERSONAS[key];

    // header pill
    document.querySelectorAll('[data-persona-label]').forEach(function(el){
      el.textContent = data ? data.short : 'Choose your path';
    });

    // popover / hero tab active states
    document.querySelectorAll('[data-persona-opt]').forEach(function(el){
      el.classList.toggle('is-active', el.getAttribute('data-persona-opt') === key);
    });

    // hero dynamic copy (home page)
    document.querySelectorAll('[data-persona-copy]').forEach(function(el){
      var map = JSON.parse(el.getAttribute('data-persona-copy'));
      var fallback = el.getAttribute('data-default') || '';
      el.textContent = (data && map[key]) ? map[key] : fallback;
    });
    document.querySelectorAll('[data-persona-cta]').forEach(function(el){
      var map = JSON.parse(el.getAttribute('data-persona-cta'));
      var target = (data && map[key]) ? map[key] : null;
      if(target){ el.setAttribute('href', target.href); el.querySelector('[data-cta-text]').textContent = target.text; }
    });

    // audience card highlight
    document.querySelectorAll('[data-audience-card]').forEach(function(el){
      el.classList.toggle('is-recommended', el.getAttribute('data-audience-card') === key);
    });

    // cross-page banner
    var banner = document.querySelector('.audience-banner');
    if(banner){
      var currentFile = currentPage === 'home' ? 'index.html' : currentPage + '.html';
      var dismissed = sessionStorage.getItem('rvu_banner_dismissed_' + key) === '1';
      if(data && data.page !== currentFile && !dismissed && currentPage !== 'home'){
        banner.classList.add('is-visible');
        var strong = banner.querySelector('strong');
        var link = banner.querySelector('a.ab-link');
        if(strong) strong.textContent = data.label + ' Hub';
        if(link) link.setAttribute('href', data.page);
      } else {
        banner.classList.remove('is-visible');
      }
    }
  }

  document.querySelectorAll('[data-persona-opt]').forEach(function(el){
    el.addEventListener('click', function(){
      setPersona(el.getAttribute('data-persona-opt'));
      var pop = document.querySelector('.persona-pop');
      if(pop) pop.classList.remove('is-open');
    });
  });

  var pillBtn = document.querySelector('.persona-pill');
  var pop = document.querySelector('.persona-pop');
  if(pillBtn && pop){
    pillBtn.addEventListener('click', function(e){
      e.stopPropagation();
      pop.classList.toggle('is-open');
    });
    document.addEventListener('click', function(e){
      if(!pop.contains(e.target)) pop.classList.remove('is-open');
    });
  }

  var bannerClose = document.querySelector('.audience-banner .ab-close');
  if(bannerClose){
    bannerClose.addEventListener('click', function(){
      var p = getPersona();
      if(p) sessionStorage.setItem('rvu_banner_dismissed_' + p, '1');
      document.querySelector('.audience-banner').classList.remove('is-visible');
    });
  }

  var initial = getPersona();
  applyPersona(initial);

  /* ---------------- scroll reveal ---------------- */
  var revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
  if('IntersectionObserver' in window && !reduceMotion){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: .15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('in-view'); });
  }

  /* ---------------- animated counters ---------------- */
  var counters = document.querySelectorAll('[data-count]');
  function animateCount(el){
    var target = parseFloat(el.getAttribute('data-count'));
    var decimals = el.getAttribute('data-decimals') ? parseInt(el.getAttribute('data-decimals'), 10) : 0;
    var dur = 1400, start = null;
    if(reduceMotion){ el.textContent = target.toFixed(decimals); return; }
    function step(ts){
      if(!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals);
      if(p < 1) requestAnimationFrame(step);
      else el.textContent = target.toFixed(decimals);
    }
    requestAnimationFrame(step);
  }
  if('IntersectionObserver' in window){
    var cio = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){ animateCount(entry.target); cio.unobserve(entry.target); }
      });
    }, { threshold: .6 });
    counters.forEach(function(el){ cio.observe(el); });
  } else {
    counters.forEach(animateCount);
  }

  /* ---------------- bar chart fill on view ---------------- */
  var bars = document.querySelectorAll('.bar-col');
  if(bars.length){
    var bio = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          var col = entry.target;
          var pct = col.getAttribute('data-pct');
          var bar = col.querySelector('.bar');
          setTimeout(function(){
            bar.style.height = pct + '%';
            col.classList.add('is-in');
          }, 80);
          bio.unobserve(col);
        }
      });
    }, { threshold: .4 });
    bars.forEach(function(b){ bio.observe(b); });
  }

  /* ---------------- generic accordion (faq, timeline steps) ---------------- */
  document.querySelectorAll('[data-accordion]').forEach(function(group){
    var items = group.querySelectorAll('.faq-item, .school-item');
    var single = group.getAttribute('data-accordion') === 'single';
    items.forEach(function(item){
      var trigger = item.querySelector('.faq-q, .school-head');
      if(!trigger) return;
      trigger.addEventListener('click', function(){
        var isOpen = item.classList.contains('is-open');
        if(single){
          items.forEach(function(i){ i.classList.remove('is-open'); });
        }
        item.classList.toggle('is-open', !isOpen);
      });
    });
  });

  /* ---------------- schools search filter ---------------- */
  var schoolSearch = document.querySelector('#schoolSearch');
  if(schoolSearch){
    schoolSearch.addEventListener('input', function(){
      var q = schoolSearch.value.trim().toLowerCase();
      document.querySelectorAll('.school-item').forEach(function(item){
        var text = item.getAttribute('data-search') || '';
        var match = text.indexOf(q) !== -1;
        item.classList.toggle('hidden-row', !match);
      });
    });
  }

  /* ---------------- forms ---------------- */
  document.querySelectorAll('form[data-validate]').forEach(function(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var valid = true;
      form.querySelectorAll('[required]').forEach(function(input){
        var field = input.closest('.field');
        var ok = input.type === 'checkbox' ? input.checked : input.value.trim().length > 0;
        if(input.type === 'email' && ok){
          ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
        }
        if(field) field.classList.toggle('has-error', !ok);
        if(!ok) valid = false;
      });
      if(!valid) return;

      var successBox = form.parentElement.querySelector('.form-success');
      if(successBox){ successBox.classList.add('is-visible'); }
      form.reset();
      form.querySelectorAll('.field.has-error').forEach(function(f){ f.classList.remove('has-error'); });

      var subject = encodeURIComponent(form.getAttribute('data-subject') || 'Placement Website Enquiry');
      var nameField = form.querySelector('[name="name"]');
      var msgField = form.querySelector('[name="message"]');
      var body = encodeURIComponent((nameField ? 'Name: ' + nameField.value + '\n' : '') + (msgField ? msgField.value : ''));
      var mailBtn = form.querySelector('[data-mailto-fallback]');
      if(mailBtn){ mailBtn.setAttribute('href', 'mailto:placements@rvu.edu.in?subject=' + subject + '&body=' + body); }
    });
  });

  /* ---------------- current year ---------------- */
  document.querySelectorAll('[data-year]').forEach(function(el){ el.textContent = new Date().getFullYear(); });

})();
