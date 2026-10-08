/**
 * Restorant Vishnja Fredi & Fiqo - Main Interactive Script
 * Features: Live Opening Status, Authentic Photo Lightbox Gallery,
 * Bilingual Toggle (AL/EN), Navigation & GPS Coordinates Copy.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Current Year
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 2. Live Opening Hours Status Calculator
  function checkRestaurantStatus() {
    const now = new Date();
    const day = now.getDay(); // 0 is Sunday, 1 is Monday, ... 6 is Saturday
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    // Schedule:
    // Wednesday (3): 07:00 (420 min) - 23:00 (1380 min)
    // Other days: 10:00 (600 min) - 23:00 (1380 min)
    const openTimeInMinutes = (day === 3) ? (7 * 60) : (10 * 60);
    const closeTimeInMinutes = 23 * 60; // 23:00

    const isOpen = (currentTimeInMinutes >= openTimeInMinutes && currentTimeInMinutes < closeTimeInMinutes);

    const liveStatusBadge = document.getElementById('liveStatusBadge');
    const liveStatusText = document.getElementById('liveStatusText');
    const contactStatusPill = document.getElementById('contactStatusPill');
    const contactStatusText = document.getElementById('contactStatusText');

    const currentLang = document.documentElement.lang || 'sq';

    let statusLabel = '';
    let detailLabel = '';

    if (isOpen) {
      statusLabel = currentLang === 'sq' ? 'Hapur Tani' : 'Open Now';
      detailLabel = currentLang === 'sq' ? 'Hapur Tani (Mbyllet në 23:00)' : 'Open Now (Closes at 23:00)';

      if (liveStatusBadge) {
        liveStatusBadge.className = 'status-badge status-open';
        liveStatusText.textContent = statusLabel;
      }
      if (contactStatusPill) {
        contactStatusPill.className = 'status-pill status-open';
        contactStatusText.textContent = detailLabel;
      }
    } else {
      const nextOpenHour = (day === 2 && currentTimeInMinutes >= closeTimeInMinutes) || (day === 3 && currentTimeInMinutes < openTimeInMinutes) ? '07:00' : '10:00';
      statusLabel = currentLang === 'sq' ? 'Mbyllur Tani' : 'Closed Now';
      detailLabel = currentLang === 'sq' ? `Mbyllur Tani (Hapet në ${nextOpenHour})` : `Closed Now (Opens at ${nextOpenHour})`;

      if (liveStatusBadge) {
        liveStatusBadge.className = 'status-badge status-closed';
        liveStatusText.textContent = statusLabel;
      }
      if (contactStatusPill) {
        contactStatusPill.className = 'status-pill status-closed';
        contactStatusText.textContent = detailLabel;
      }
    }

    // Highlight today's row in opening hours list
    const dayRows = document.querySelectorAll('.day-row');
    dayRows.forEach(row => {
      if (parseInt(row.getAttribute('data-day'), 10) === day) {
        row.classList.add('active-day');
      } else {
        row.classList.remove('active-day');
      }
    });
  }

  checkRestaurantStatus();
  setInterval(checkRestaurantStatus, 60000); // refresh every minute

  // 3. Header Scroll Effect & Back-to-Top
  const siteHeader = document.getElementById('siteHeader');
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }

    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 4. Mobile Menu Navigation
  const mobileToggle = document.getElementById('mobileToggle');
  const mainNav = document.getElementById('mainNav');

  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', () => {
      mainNav.classList.toggle('open');
    });

    const navLinks = mainNav.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
      });
    });

    document.addEventListener('click', (e) => {
      if (!mainNav.contains(e.target) && !mobileToggle.contains(e.target) && mainNav.classList.contains('open')) {
        mainNav.classList.remove('open');
      }
    });
  }

  // Active navigation highlight on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset + 120;
    sections.forEach(sec => {
      const sectionHeight = sec.offsetHeight;
      const sectionTop = sec.offsetTop;
      const sectionId = sec.getAttribute('id');
      const navLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);
      if (navLink) {
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          document.querySelectorAll('.nav-link').forEach(nl => nl.classList.remove('active'));
          navLink.classList.add('active');
        }
      }
    });
  });

  // 5. Gallery Category Filters
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCat = item.getAttribute('data-category');
        if (filterVal === 'all' || itemCat === filterVal) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // 6. Interactive Lightbox Modal Gallery with Zoom & Pan
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxZoomIn = document.getElementById('lightboxZoomIn');
  const lightboxZoomOut = document.getElementById('lightboxZoomOut');
  const lightboxZoomReset = document.getElementById('lightboxZoomReset');
  const lightboxZoomLevel = document.getElementById('lightboxZoomLevel');
  const lightboxViewport = document.getElementById('lightboxViewport');
  const lightboxStage = document.getElementById('lightboxStage');

  let currentImgIndex = 0;
  let zoomScale = 1.0;
  let panX = 0;
  let panY = 0;
  let isPanning = false;
  let startX = 0;
  let startY = 0;
  let initialPanX = 0;
  let initialPanY = 0;
  let initialPinchDistance = 0;
  let initialPinchScale = 1.0;
  let lastTapTime = 0;

  const MIN_ZOOM = 1.0;
  const MAX_ZOOM = 3.0;
  const ZOOM_STEP = 0.25;

  function getVisibleGalleryWraps() {
    return Array.from(document.querySelectorAll('.gallery-card'))
      .filter(card => card.style.display !== 'none')
      .map(card => card.querySelector('.gallery-img-wrap'))
      .filter(Boolean);
  }

  function updateTransform(animate = true) {
    if (!lightboxStage) return;

    if (animate) {
      lightboxStage.classList.remove('no-transition');
    } else {
      lightboxStage.classList.add('no-transition');
    }

    // Boundary constraint when zoomed
    if (zoomScale <= 1.0) {
      panX = 0;
      panY = 0;
      if (lightboxViewport) {
        lightboxViewport.classList.remove('is-zoomed', 'is-panning');
      }
    } else {
      const maxPanX = (window.innerWidth * (zoomScale - 1)) / 1.5;
      const maxPanY = (window.innerHeight * (zoomScale - 1)) / 1.5;
      panX = Math.max(-maxPanX, Math.min(maxPanX, panX));
      panY = Math.max(-maxPanY, Math.min(maxPanY, panY));
      if (lightboxViewport) {
        lightboxViewport.classList.add('is-zoomed');
      }
    }

    lightboxStage.style.transform = `translate(${panX}px, ${panY}px) scale(${zoomScale})`;
    if (lightboxZoomLevel) {
      lightboxZoomLevel.textContent = `${Math.round(zoomScale * 100)}%`;
    }
  }

  function setZoom(newScale, animate = true) {
    zoomScale = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, parseFloat(newScale.toFixed(2))));
    updateTransform(animate);
  }

  function zoomIn() {
    setZoom(zoomScale + ZOOM_STEP);
  }

  function zoomOut() {
    setZoom(zoomScale - ZOOM_STEP);
  }

  function resetZoom() {
    panX = 0;
    panY = 0;
    setZoom(1.0);
  }

  function openLightbox(index) {
    const visibleWraps = getVisibleGalleryWraps();
    if (!visibleWraps.length) return;

    currentImgIndex = ((index % visibleWraps.length) + visibleWraps.length) % visibleWraps.length;
    const targetWrap = visibleWraps[currentImgIndex];
    const imgSrc = targetWrap.getAttribute('data-img');
    const caption = targetWrap.getAttribute('data-caption') || '';

    if (lightboxImg) {
      lightboxImg.src = imgSrc;
      lightboxImg.alt = caption;
    }
    if (lightboxCaption) {
      lightboxCaption.textContent = caption;
    }

    resetZoom();

    if (lightboxModal) {
      lightboxModal.classList.add('active');
    }
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
    }
    document.body.style.overflow = '';
    resetZoom();
  }

  function nextImage() {
    const visibleWraps = getVisibleGalleryWraps();
    currentImgIndex = (currentImgIndex + 1) % visibleWraps.length;
    openLightbox(currentImgIndex);
  }

  function prevImage() {
    const visibleWraps = getVisibleGalleryWraps();
    currentImgIndex = (currentImgIndex - 1 + visibleWraps.length) % visibleWraps.length;
    openLightbox(currentImgIndex);
  }

  // Gallery Click Listeners
  const allGalleryWraps = document.querySelectorAll('.gallery-img-wrap');
  allGalleryWraps.forEach(wrap => {
    wrap.addEventListener('click', () => {
      const visibleWraps = getVisibleGalleryWraps();
      const idx = visibleWraps.indexOf(wrap);
      if (idx !== -1) {
        openLightbox(idx);
      }
    });
  });

  // Buttons
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', nextImage);
  if (lightboxPrev) lightboxPrev.addEventListener('click', prevImage);
  if (lightboxZoomIn) lightboxZoomIn.addEventListener('click', zoomIn);
  if (lightboxZoomOut) lightboxZoomOut.addEventListener('click', zoomOut);
  if (lightboxZoomReset) lightboxZoomReset.addEventListener('click', resetZoom);

  // Close on Backdrop Click (only if not zooming/panning)
  if (lightboxViewport) {
    lightboxViewport.addEventListener('click', (e) => {
      if (e.target === lightboxViewport && zoomScale === 1.0) {
        closeLightbox();
      }
    });
  }

  // Double Click / Double Tap to Toggle Zoom
  if (lightboxStage) {
    lightboxStage.addEventListener('dblclick', (e) => {
      e.preventDefault();
      if (zoomScale > 1.0) {
        resetZoom();
      } else {
        setZoom(2.0);
      }
    });
  }

  // Mouse Wheel Zoom
  if (lightboxViewport) {
    lightboxViewport.addEventListener('wheel', (e) => {
      e.preventDefault();
      if (e.deltaY < 0) {
        setZoom(zoomScale + 0.2);
      } else {
        setZoom(zoomScale - 0.2);
      }
    }, { passive: false });

    // Mouse Pan / Drag
    lightboxViewport.addEventListener('mousedown', (e) => {
      if (zoomScale <= 1.0) return;
      isPanning = true;
      startX = e.clientX;
      startY = e.clientY;
      initialPanX = panX;
      initialPanY = panY;
      lightboxViewport.classList.add('is-panning');
      e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
      if (!isPanning) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      panX = initialPanX + dx;
      panY = initialPanY + dy;
      updateTransform(false);
    });

    window.addEventListener('mouseup', () => {
      if (isPanning) {
        isPanning = false;
        if (lightboxViewport) {
          lightboxViewport.classList.remove('is-panning');
        }
        updateTransform(true);
      }
    });

    // Touch Support: Double Tap, Pinch-to-Zoom, and 1-Finger Pan
    lightboxViewport.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        // Double tap check
        const now = Date.now();
        if (now - lastTapTime < 300) {
          e.preventDefault();
          if (zoomScale > 1.0) {
            resetZoom();
          } else {
            setZoom(2.0);
          }
          lastTapTime = 0;
          return;
        }
        lastTapTime = now;

        if (zoomScale > 1.0) {
          isPanning = true;
          startX = e.touches[0].clientX;
          startY = e.touches[0].clientY;
          initialPanX = panX;
          initialPanY = panY;
        }
      } else if (e.touches.length === 2) {
        // Pinch start
        isPanning = false;
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        initialPinchDistance = Math.hypot(dx, dy);
        initialPinchScale = zoomScale;
      }
    }, { passive: false });

    lightboxViewport.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1 && isPanning && zoomScale > 1.0) {
        e.preventDefault();
        const dx = e.touches[0].clientX - startX;
        const dy = e.touches[0].clientY - startY;
        panX = initialPanX + dx;
        panY = initialPanY + dy;
        updateTransform(false);
      } else if (e.touches.length === 2) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const currentDistance = Math.hypot(dx, dy);
        if (initialPinchDistance > 0) {
          const factor = currentDistance / initialPinchDistance;
          setZoom(initialPinchScale * factor, false);
        }
      }
    }, { passive: false });

    lightboxViewport.addEventListener('touchend', (e) => {
      if (e.touches.length === 0) {
        isPanning = false;
        updateTransform(true);
      }
    });
  }

  // Keyboard Shortcuts (Esc, Arrows, + / -, 0)
  document.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === '+' || e.key === '=') zoomIn();
    if (e.key === '-' || e.key === '_') zoomOut();
    if (e.key === '0') resetZoom();
  });

  // 6b. Location Loop Video (Muted, Audio-Free Autoplay Guarantee)
  const loopVideo = document.getElementById('restaurantLoopVideo');
  if (loopVideo) {
    loopVideo.muted = true;
    const tryPlayVideo = () => {
      if (loopVideo.paused) {
        loopVideo.play().catch(() => {});
      }
    };
    tryPlayVideo();
    document.addEventListener('touchstart', tryPlayVideo, { once: true });
    document.addEventListener('click', tryPlayVideo, { once: true });
  }

  // 7. Copy GPS Coordinates Button
  const copyCoordsBtn = document.getElementById('copyCoordsBtn');
  const copyBtnText = document.getElementById('copyBtnText');
  if (copyCoordsBtn) {
    copyCoordsBtn.addEventListener('click', () => {
      const coords = '41.265416, 19.814886';
      const currentLang = document.documentElement.lang || 'sq';
      navigator.clipboard.writeText(coords).then(() => {
        if (copyBtnText) copyBtnText.textContent = currentLang === 'sq' ? 'Kopjuar! ✓' : 'Copied! ✓';
        setTimeout(() => {
          if (copyBtnText) copyBtnText.textContent = currentLang === 'sq' ? 'Kopjo GPS' : 'Copy GPS';
        }, 2500);
      }).catch(err => {
        console.error('Clipboard copy failed:', err);
      });
    });
  }

  // 8. Language Switcher (Albanian / English)
  const langBtns = document.querySelectorAll('.lang-btn');

  function setLanguage(lang) {
    document.documentElement.lang = lang;
    localStorage.setItem('vishnja_lang', lang);

    langBtns.forEach(btn => {
      if (btn.getAttribute('data-lang') === lang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    const translatableElements = document.querySelectorAll('[data-sq][data-en]');
    translatableElements.forEach(el => {
      const translation = el.getAttribute(`data-${lang}`);
      if (translation) {
        el.textContent = translation;
      }
    });

    // Re-run status check for translated labels
    checkRestaurantStatus();
  }

  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const chosenLang = btn.getAttribute('data-lang');
      setLanguage(chosenLang);
    });
  });

  const savedLang = localStorage.getItem('vishnja_lang');
  if (savedLang && (savedLang === 'sq' || savedLang === 'en')) {
    setLanguage(savedLang);
  }
});
