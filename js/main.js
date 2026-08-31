'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initNavbarScroll();
  initTestimonialCarousel();
  initPricingToggle();
  initAuthTabs();
  initFaqAccordion();
  initBlogFilter();
  initDocsSidebar();
  initContactForm();
  highlightActiveNav();
});

/* ── Mobile Menu ── */
function initMobileMenu() {
  const btn  = document.getElementById('mobileMenuBtn');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    menu.classList.toggle('hidden');
  });

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => menu.classList.add('hidden'));
  });
}

/* ── Navbar scroll shadow ── */
function initNavbarScroll() {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('shadow-sm', window.scrollY > 10);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ── Active nav link highlight ── */
function highlightActiveNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('#navbar a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page) {
      a.classList.add('text-dark', 'font-semibold');
      a.classList.remove('text-gray-500');
    }
  });
}

/* ── Testimonial Carousel ── */
function initTestimonialCarousel() {
  const track = document.getElementById('testimonialTrack');
  const prevBtn = document.getElementById('testimonialPrev');
  const nextBtn = document.getElementById('testimonialNext');
  const dotsContainer = document.getElementById('testimonialDots');
  if (!track || !prevBtn || !nextBtn || !dotsContainer) return;

  const cards = track.children;
  const totalCards = cards.length;
  let currentIndex = 0;

  function getVisibleCount() {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
  }

  const maxIndex = () => Math.max(0, totalCards - getVisibleCount());

  function buildDots() {
    dotsContainer.innerHTML = '';
    const count = maxIndex() + 1;
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('button');
      dot.className = 'w-2.5 h-2.5 rounded-full transition-colors ' + (i === 0 ? 'bg-dark' : 'bg-gray-300');
      dot.setAttribute('aria-label', 'Slide ' + (i + 1));
      dot.addEventListener('click', () => scrollTo(i));
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    const dots = dotsContainer.children;
    for (let i = 0; i < dots.length; i++) {
      dots[i].className = 'w-2.5 h-2.5 rounded-full transition-colors ' + (i === currentIndex ? 'bg-dark' : 'bg-gray-300');
    }
  }

  function scrollTo(index) {
    currentIndex = Math.max(0, Math.min(index, maxIndex()));
    const card = cards[currentIndex];
    if (card) {
      track.scrollTo({ left: card.offsetLeft - 16, behavior: 'smooth' });
    }
    updateDots();
  }

  prevBtn.addEventListener('click', () => scrollTo(currentIndex - 1));
  nextBtn.addEventListener('click', () => scrollTo(currentIndex + 1));

  track.addEventListener('scroll', () => {
    const scrollLeft = track.scrollLeft;
    let closest = 0;
    let minDist = Infinity;
    for (let i = 0; i < totalCards; i++) {
      const dist = Math.abs(cards[i].offsetLeft - 16 - scrollLeft);
      if (dist < minDist) { minDist = dist; closest = i; }
    }
    currentIndex = Math.min(closest, maxIndex());
    updateDots();
  }, { passive: true });

  buildDots();
  window.addEventListener('resize', () => {
    if (currentIndex > maxIndex()) currentIndex = maxIndex();
    buildDots();
    scrollTo(currentIndex);
  });
}

/* ── Pricing Toggle ── */
function initPricingToggle() {
  const monthlyBtn = document.getElementById('billingMonthly');
  const yearlyBtn = document.getElementById('billingYearly');
  const prices = document.querySelectorAll('.pricing-price');
  if (!monthlyBtn || !yearlyBtn || !prices.length) return;

  function setBilling(yearly) {
    prices.forEach(el => {
      const val = yearly ? el.dataset.yearly : el.dataset.monthly;
      el.textContent = '$' + val;
    });
    if (yearly) {
      yearlyBtn.classList.add('active');
      yearlyBtn.classList.remove('text-gray-400');
      monthlyBtn.classList.remove('active');
      monthlyBtn.classList.add('text-gray-400');
    } else {
      monthlyBtn.classList.add('active');
      monthlyBtn.classList.remove('text-gray-400');
      yearlyBtn.classList.remove('active');
      yearlyBtn.classList.add('text-gray-400');
    }
  }

  monthlyBtn.addEventListener('click', () => setBilling(false));
  yearlyBtn.addEventListener('click', () => setBilling(true));
}

/* ── Auth Tabs (Login / Sign Up) ── */
function initAuthTabs() {
  const tabs = document.querySelectorAll('.auth-tab');
  const panels = document.querySelectorAll('.auth-panel');
  if (!tabs.length || !panels.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.target;
      panels.forEach(p => {
        p.classList.toggle('hidden', p.id !== target);
      });
    });
  });
}

/* ── FAQ Accordion ── */
function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const answer = item.querySelector('.faq-answer');
    const icon = item.querySelector('.faq-icon');
    if (!trigger || !answer) return;

    trigger.addEventListener('click', () => {
      const isOpen = answer.classList.contains('open');
      // close all
      document.querySelectorAll('.faq-answer').forEach(a => a.classList.remove('open'));
      document.querySelectorAll('.faq-icon').forEach(i => {
        i.style.transform = 'rotate(0deg)';
      });
      // open clicked if it was closed
      if (!isOpen) {
        answer.classList.add('open');
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });
}

/* ── Blog Category Filter ── */
function initBlogFilter() {
  const filters = document.querySelectorAll('.blog-filter');
  const cards = document.querySelectorAll('.blog-card');
  if (!filters.length || !cards.length) return;

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(f => f.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.category;
      cards.forEach(card => {
        if (cat === 'all' || card.dataset.category === cat) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ── Docs Sidebar Toggle (mobile) ── */
function initDocsSidebar() {
  const toggle = document.getElementById('docsSidebarToggle');
  const sidebar = document.getElementById('docsSidebar');
  if (!toggle || !sidebar) return;

  toggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });

  // Close when clicking a link
  sidebar.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => sidebar.classList.remove('open'));
  });
}

/* ── Contact Form Validation ── */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('[name="name"]');
    const email = form.querySelector('[name="email"]');
    const message = form.querySelector('[name="message"]');
    let valid = true;

    [name, email, message].forEach(field => {
      if (!field) return;
      if (!field.value.trim()) {
        field.style.borderColor = '#EF4444';
        valid = false;
      } else {
        field.style.borderColor = '';
      }
    });

    if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      email.style.borderColor = '#EF4444';
      valid = false;
    }

    if (valid) {
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.textContent = 'Sent!';
        btn.classList.add('bg-green-500');
        setTimeout(() => {
          btn.textContent = 'Send Message';
          btn.classList.remove('bg-green-500');
          form.reset();
        }, 2000);
      }
    }
  });
}
