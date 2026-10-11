// ===== NAV: scroll + hamburger =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const mobileMenu = document.getElementById('mobile-menu');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

navToggle.addEventListener('click', () => {
  const open = navToggle.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
  mobileMenu.classList.toggle('open');
  mobileMenu.setAttribute('aria-hidden', !open);
});

// Close mobile menu on link click
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
  });
});

// ===== REVEAL ON SCROLL =====
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        // Stagger children in grid containers
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

// Add staggered delay to grid items
document.querySelectorAll('.gallery-item').forEach((el, i) => {
  el.dataset.delay = (i % 3) * 80;
});
document.querySelectorAll('.pricing-card').forEach((el, i) => {
  el.dataset.delay = i * 100;
});

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ===== GALLERY FILTER =====
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active state
    filterBtns.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');

    const filter = btn.dataset.filter;

    galleryItems.forEach(item => {
      const match = filter === 'all' || item.dataset.category === filter;
      if (match) {
        item.classList.remove('hidden');
        // Re-trigger reveal
        item.classList.remove('visible');
        requestAnimationFrame(() => {
          setTimeout(() => item.classList.add('visible'), 60);
        });
      } else {
        item.classList.add('hidden');
      }
    });
  });
});

// Make all gallery items visible on first load
setTimeout(() => {
  document.querySelectorAll('.gallery-item').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), i * 80);
  });
}, 300);

// ===== ORDER FORM VALIDATION =====
const form = document.getElementById('order-form');
const formSuccess = document.getElementById('form-success');
const submitBtn = document.getElementById('form-submit');

function showError(id, msg) {
  const el = document.getElementById('error-' + id);
  if (el) el.textContent = msg;
}
function clearErrors() {
  document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
}

function validateForm() {
  let valid = true;
  clearErrors();

  const name = document.getElementById('form-name').value.trim();
  const phone = document.getElementById('form-phone').value.trim();
  const email = document.getElementById('form-email').value.trim();
  const message = document.getElementById('form-message').value.trim();

  if (!name) { showError('name', 'Please enter your name.'); valid = false; }
  if (!phone) { showError('phone', 'Please enter your phone number.'); valid = false; }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError('email', 'Please enter a valid email address.'); valid = false;
  }
  if (!message || message.length < 10) {
    showError('message', 'Please describe your vision (at least 10 characters).'); valid = false;
  }

  return valid;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  // Simulate submission
  submitBtn.classList.add('loading');
  submitBtn.disabled = true;

  setTimeout(() => {
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
    formSuccess.classList.add('visible');
    form.reset();
    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 1800);
});

// Real-time validation
['form-name', 'form-phone', 'form-email', 'form-message'].forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('blur', () => {
      const field = id.replace('form-', '');
      const val = el.value.trim();
      if (!val) {
        showError(field, 'This field is required.');
      } else if (field === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        showError(field, 'Please enter a valid email address.');
      } else {
        showError(field, '');
      }
    });
  }
});

// ===== SMOOTH SCROLL OFFSET FOR FIXED NAV =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===== SET MIN DATE ON DATEPICKER =====
const dateInput = document.getElementById('form-date');
if (dateInput) {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  dateInput.min = `${yyyy}-${mm}-${dd}`;
}

// Trigger initial nav scroll check
window.dispatchEvent(new Event('scroll'));
