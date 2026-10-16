/* ===== ACTIVE NAV LINK (multi-page) ===== */
(function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  const page = path === '' || path === '/' ? 'index.html' : path;

  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href') || '';
    if (href === page || (page === 'index.html' && (href === 'index.html' || href === './' || href === '/'))) {
      link.classList.add('active');
    }
  });
})();

/* ===== FADE-IN ON SCROLL ===== */
const fadeElements = document.querySelectorAll('.fade-in');

const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 40);
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  }
);

fadeElements.forEach(el => fadeObserver.observe(el));

/* ===== COUNTER ANIMATION ===== */
const counters = document.querySelectorAll('.counter');
let countersAnimated = false;

function animateCounters() {
  if (countersAnimated) return;

  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'), 10);
    const duration = 1600;
    const step = target / (duration / 16);
    let current = 0;

    const update = () => {
      current += step;
      if (current < target) {
        counter.textContent = Math.floor(current) + (target >= 20 ? '+' : '');
        requestAnimationFrame(update);
      } else {
        counter.textContent = target + (target >= 20 ? '+' : '');
      }
    };

    update();
  });

  countersAnimated = true;
}

const aboutSection = document.querySelector('#about');
if (aboutSection) {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        animateCounters();
        counterObserver.unobserve(aboutSection);
      }
    },
    { threshold: 0.35 }
  );
  counterObserver.observe(aboutSection);
}

/* ===== GALLERY LIGHTBOX ===== */
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');

let currentIndex = 0;
const galleryData = [];

if (galleryItems.length && lightbox) {
  galleryItems.forEach((item, index) => {
    const img = item.querySelector('img');
    const title = item.querySelector('.gallery-caption h4')?.textContent || '';
    const location = item.querySelector('.gallery-caption span')?.textContent || '';
    galleryData.push({
      src: img.src,
      alt: img.alt,
      caption: title + (location ? ' · ' + location : '')
    });

    item.addEventListener('click', () => {
      openLightbox(index);
    });
  });

  function openLightbox(index) {
    currentIndex = index;
    updateLightbox();
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function updateLightbox() {
    const data = galleryData[currentIndex];
    lightboxImg.src = data.src;
    lightboxImg.alt = data.alt;
    lightboxCaption.textContent = data.caption;
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % galleryData.length;
    updateLightbox();
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + galleryData.length) % galleryData.length;
    updateLightbox();
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', showNext);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrev);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });
}

/* ===== IMAGE ERROR FALLBACK ===== */
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('error', function () {
    this.style.background = '#e8e2d9';
    this.style.minHeight = '200px';
    this.alt = 'Image unavailable';
  });
});

/* ===== CONTACT FORM ===== */
const form = document.getElementById('consultation-form');
const formSuccess = document.getElementById('form-success');
const formSubmitBtn = document.getElementById('form-submit-btn');
const formResetBtn = document.getElementById('form-reset-btn');

function showError(fieldId, message) {
  const input = document.getElementById(fieldId);
  const errEl = document.querySelector(`.error-msg[data-for="${fieldId}"]`);
  if (input) input.classList.add('error');
  if (errEl) errEl.textContent = message;
}

function clearErrors() {
  document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(el => {
    el.classList.remove('error');
  });
  document.querySelectorAll('.error-msg').forEach(el => {
    el.textContent = '';
  });
}

function validateForm() {
  clearErrors();
  let valid = true;

  const name = document.getElementById('full-name');
  const email = document.getElementById('email');
  const projectType = document.getElementById('project-type');
  const message = document.getElementById('message');

  if (!name || !name.value.trim()) {
    showError('full-name', 'Please enter your full name.');
    valid = false;
  }

  const emailVal = email ? email.value.trim() : '';
  if (!emailVal) {
    showError('email', 'Please enter your email.');
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
    showError('email', 'Please enter a valid email address.');
    valid = false;
  }

  if (!projectType || !projectType.value) {
    showError('project-type', 'Please select a project type.');
    valid = false;
  }

  if (!message || !message.value.trim()) {
    showError('message', 'Please tell us about your project.');
    valid = false;
  } else if (message.value.trim().length < 15) {
    showError('message', 'Please add a bit more detail (at least 15 characters).');
    valid = false;
  }

  return valid;
}

if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!validateForm()) return;

    const btnText = formSubmitBtn.querySelector('.btn-text');
    const btnLoading = formSubmitBtn.querySelector('.btn-loading');
    formSubmitBtn.disabled = true;
    if (btnText) btnText.hidden = true;
    if (btnLoading) btnLoading.hidden = false;

    const formData = {
      fullName: document.getElementById('full-name').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      location: document.getElementById('location').value,
      projectType: document.getElementById('project-type').value,
      message: document.getElementById('message').value.trim(),
      submittedAt: new Date().toISOString()
    };

    console.log('Consultation request:', formData);

    setTimeout(() => {
      form.hidden = true;
      if (formSuccess) formSuccess.hidden = false;
      formSubmitBtn.disabled = false;
      if (btnText) btnText.hidden = false;
      if (btnLoading) btnLoading.hidden = true;
    }, 900);
  });
}

if (formResetBtn) {
  formResetBtn.addEventListener('click', () => {
    form.reset();
    clearErrors();
    form.hidden = false;
    if (formSuccess) formSuccess.hidden = true;
    document.getElementById('full-name')?.focus();
  });
}