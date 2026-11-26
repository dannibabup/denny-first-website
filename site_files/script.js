(function () {
  'use strict';

  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealEls = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window) || reduceMotion) {
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  } else {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.site-header nav a'));
  var sections = navLinks
    .map(function (link) {
      return document.querySelector(link.getAttribute('href'));
    })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var setActive = function (id) {
      navLinks.forEach(function (link) {
        var isActive = link.getAttribute('href') === '#' + id;
        link.classList.toggle('is-active', isActive);
        if (isActive) {
          link.setAttribute('aria-current', 'true');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    };

    var spyObserver = new IntersectionObserver(function (entries) {
      var visible = entries
        .filter(function (entry) {
          return entry.isIntersecting;
        })
        .sort(function (a, b) {
          return b.intersectionRatio - a.intersectionRatio;
        })[0];

      if (visible) {
        setActive(visible.target.id);
      }
    }, { rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.25, 0.6] });

    sections.forEach(function (section) {
      spyObserver.observe(section);
    });
  }

  var dialog = document.getElementById('lightbox');
  if (dialog && typeof dialog.showModal === 'function') {
    var dialogImg = dialog.querySelector('img');
    var dialogCaption = dialog.querySelector('figcaption');
    var closeBtn = dialog.querySelector('.lightbox-close');
    var lastTrigger = null;

    document.querySelectorAll('.zoom').forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        var img = trigger.querySelector('img');
        if (!img) {
          return;
        }
        lastTrigger = trigger;
        dialogImg.src = trigger.getAttribute('data-full') || img.currentSrc || img.src;
        dialogImg.alt = img.alt;
        dialogCaption.textContent = trigger.getAttribute('data-caption') || '';
        dialog.showModal();
        closeBtn.focus();
      });
    });

    closeBtn.addEventListener('click', function () {
      dialog.close();
    });

    dialog.addEventListener('click', function (event) {
      if (event.target === dialog) {
        dialog.close();
      }
    });

    dialog.addEventListener('close', function () {
      dialogImg.removeAttribute('src');
      if (lastTrigger) {
        lastTrigger.focus();
      }
    });
  }
})();
