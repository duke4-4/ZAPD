/**
 * Returns the current calendar year for copyright notices.
 */
function getCopyrightYear() {
  return new Date().getFullYear();
}

/**
 * Updates every element with [data-copyright-year] to show the current year.
 */
function updateCopyrightYear() {
  const year = getCopyrightYear();
  document.querySelectorAll('[data-copyright-year]').forEach((el) => {
    el.textContent = year;
  });
}

/** Scroll progress bar under navbar (visible after hero) */
function updateHeaderScrollBar() {
  const track = document.querySelector('.header-scroll-track');
  const fill = document.getElementById('headerScrollFill');
  if (!track || !fill) return;

  const hero = document.querySelector('.hero, .page-hero');
  const heroEnd = hero ? hero.offsetTop + hero.offsetHeight : 0;
  const scrollY = window.scrollY;

  if (!hero || scrollY < heroEnd) {
    track.classList.remove('is-visible');
    fill.style.width = '0%';
    return;
  }

  track.classList.add('is-visible');
  const doc = document.documentElement;
  const maxScroll = doc.scrollHeight - window.innerHeight;
  const range = Math.max(maxScroll - heroEnd, 1);
  const progress = Math.min(100, Math.max(0, ((scrollY - heroEnd) / range) * 100));
  fill.style.width = `${progress}%`;
}

/** Navbar: hide when scrolling down, show when scrolling up */
function initNavbarScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  let lastScrollY = window.scrollY;
  let ticking = false;
  const threshold = 80;

  const onScroll = () => {
    const currentY = window.scrollY;
    const delta = currentY - lastScrollY;

    if (currentY <= threshold) {
      header.classList.remove('site-header--hidden');
    } else if (delta > 8) {
      header.classList.add('site-header--hidden');
    } else if (delta < -8) {
      header.classList.remove('site-header--hidden');
    }

    updateHeaderScrollBar();
    setHeaderHeight();
    lastScrollY = currentY;
    ticking = false;
  };

  header.addEventListener('transitionend', (e) => {
    if (e.propertyName === 'transform') setHeaderHeight();
  });

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        window.requestAnimationFrame(onScroll);
        ticking = true;
      }
    },
    { passive: true }
  );

  window.addEventListener('resize', updateHeaderScrollBar);
  updateHeaderScrollBar();
}

/** Scroll-to-top button visibility */
function initScrollTop() {
  const scrollTopBtn = document.getElementById('scrollTop');
  if (!scrollTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/** FAQ accordion — grid-based height avoids close lag */
function initFaqAccordion() {
  document.querySelectorAll('.faq-question').forEach((question) => {
    question.addEventListener('click', () => {
      const item = question.closest('.faq-item');
      if (!item) return;
      const isOpen = item.classList.contains('active');
      document.querySelectorAll('.faq-item.active').forEach((openItem) => {
        if (openItem !== item) openItem.classList.remove('active');
      });
      item.classList.toggle('active', !isOpen);
    });
  });
}

/** Home hero image slideshow */
function initHeroSlideshow() {
  const slideshow = document.querySelector('.hero-slideshow');
  if (!slideshow) return;

  const slides = slideshow.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-slide-dot');
  if (slides.length === 0) return;

  let index = 0;
  const intervalMs = 5500;

  const goTo = (i) => {
    index = (i + slides.length) % slides.length;
    slides.forEach((slide, idx) => slide.classList.toggle('active', idx === index));
    dots.forEach((dot, idx) => dot.classList.toggle('active', idx === index));
  };

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => goTo(i));
  });

  setInterval(() => goTo(index + 1), intervalMs);
}

/** Sync --header-height with actual navbar size */
function setHeaderHeight() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  document.documentElement.style.setProperty('--header-height', `${header.offsetHeight}px`);
}

const TEAM_MEMBERS = {
  jane: {
    name: 'Dr. Jane Doe',
    role: 'President',
    image: 'assets/sections/team-1.jpg',
    bio: 'Dr. Jane Doe leads ZAPD with over 15 years of experience in pediatric dentistry. She advocates for preventive care programs in schools and mentors young dentists across Zimbabwe.',
  },
  john: {
    name: 'Dr. John Smith',
    role: 'Vice President',
    image: 'assets/sections/team-2.jpg',
    bio: 'Dr. John Smith coordinates member engagement and continuing education. His focus is on advancing clinical standards and building partnerships with regional health authorities.',
  },
  alice: {
    name: 'Dr. Alice Johnson',
    role: 'Secretary',
    image: 'assets/sections/team-3.jpg',
    bio: 'Dr. Alice Johnson manages association communications and event planning. She is passionate about community outreach and expanding access to pediatric dental services.',
  },
};

/** Open a dedicated modal per leadership team member */
function initTeamModals() {
  const modal = document.getElementById('teamModal');
  if (!modal) return;

  const photo = document.getElementById('teamModalPhoto');
  const nameEl = document.getElementById('teamModalName');
  const roleEl = document.getElementById('teamModalRole');
  const bioEl = document.getElementById('teamModalBio');

  const openModal = (memberId) => {
    const member = TEAM_MEMBERS[memberId];
    if (!member) return;
    photo.src = member.image;
    photo.alt = member.name;
    nameEl.textContent = member.name;
    roleEl.textContent = member.role;
    bioEl.textContent = member.bio;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('[data-team-member]').forEach((btn) => {
    btn.addEventListener('click', () => openModal(btn.dataset.teamMember));
  });

  modal.querySelectorAll('[data-modal-close]').forEach((el) => {
    el.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });
}

/** Tab switching for About page resources section */
function initTabSwitching() {
  const tabButtons = document.querySelectorAll('.tab-button');
  if (tabButtons.length === 0) return;

  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const tabName = button.getAttribute('data-tab');

      // Remove active class from all buttons and contents
      document.querySelectorAll('.tab-button').forEach((btn) => btn.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach((content) => content.classList.remove('active'));

      // Add active class to clicked button and corresponding content
      button.classList.add('active');
      const tabContent = document.getElementById(tabName);
      if (tabContent) tabContent.classList.add('active');
    });
  });
}

/** Event filtering on Events page */
function initEventFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const eventCards = document.querySelectorAll('.event-card');

  if (filterButtons.length === 0 || eventCards.length === 0) return;

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.getAttribute('data-filter');

      // Update active button
      filterButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');

      // Filter events
      eventCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = '';
          card.style.animation = 'fadeIn 0.3s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setHeaderHeight();
  updateCopyrightYear();
  initNavbarScroll();
  initScrollTop();
  initHeroSlideshow();
  initFaqAccordion();
  initTeamModals();
  initTabSwitching();
  initEventFilters();

  const headerEl = document.querySelector('.site-header');
  if (headerEl && window.ResizeObserver) {
    new ResizeObserver(setHeaderHeight).observe(headerEl);
  }
});

window.addEventListener('resize', setHeaderHeight);
