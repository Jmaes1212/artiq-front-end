function createDropdown(label, links) {
  const dropdown = document.createElement('div');
  dropdown.className = 'nav__item nav__item--dropdown';

  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'nav__link';
  trigger.innerHTML = `${label} <span aria-hidden="true">▾</span>`;

  const menu = document.createElement('div');
  menu.className = 'nav__dropdown';

  links.forEach((link) => {
    const item = document.createElement('a');
    item.href = `category.html?category=${encodeURIComponent(link.toLowerCase())}`;
    item.textContent = link;
    menu.appendChild(item);
  });

  trigger.addEventListener('click', () => {
    menu.classList.toggle('nav__dropdown--open');
  });

  dropdown.appendChild(trigger);
  dropdown.appendChild(menu);
  return dropdown;
}

function buildHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'header';
  wrapper.innerHTML = `
    <div class="header__logo">
      <a href="index.html" aria-label="Artiq Prints home">
        <span>Artiq Prints</span>
      </a>
    </div>
    <nav class="nav" aria-label="Primary">
    </nav>
    <div class="header__actions">
      <button class="header__cart" aria-label="View cart">🛒</button>
    </div>
  `;

  header.appendChild(wrapper);

  const nav = wrapper.querySelector('.nav');
  Object.values(siteConfig.navigation).forEach(({ label, links }) => {
    nav.appendChild(createDropdown(label, links));
  });

  document.addEventListener('click', (event) => {
    const openMenus = document.querySelectorAll('.nav__dropdown--open');
    openMenus.forEach((menu) => {
      if (!menu.contains(event.target) && !menu.previousElementSibling.contains(event.target)) {
        menu.classList.remove('nav__dropdown--open');
      }
    });
  });
}

function buildFooter() {
  const footer = document.getElementById('site-footer');
  if (!footer) return;

  footer.innerHTML = `
    <div class="footer">
      <div class="footer__sitemap">
        <h3>Site Map</h3>
        <ul>
          <li><a href="index.html">Home</a></li>
          <li><a href="category.html?category=abstract">Shop</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Contact</a></li>
          <li><a href="#">Privacy Policy</a></li>
          <li><a href="#">Terms of Service</a></li>
        </ul>
      </div>
      <div class="footer__social">
        <h3>Follow Us</h3>
        <ul>
          <li><a href="https://www.instagram.com" target="_blank" rel="noopener">Instagram</a></li>
          <li><a href="https://www.pinterest.com" target="_blank" rel="noopener">Pinterest</a></li>
          <li><a href="https://www.facebook.com" target="_blank" rel="noopener">Facebook</a></li>
        </ul>
      </div>
      <div class="footer__note">
        <p>© ${new Date().getFullYear()} Artiq Prints. All rights reserved.</p>
        <p class="footer__integrations">Shopify + Printify ready with integrations for reviews, language, and currency switching.</p>
      </div>
    </div>
  `;
}

function buildRotatingBanner() {
  const banner = document.getElementById('rotating-banner');
  if (!banner) return;

  let currentIndex = 0;
  banner.textContent = siteConfig.bannerMessages[currentIndex];

  setInterval(() => {
    currentIndex = (currentIndex + 1) % siteConfig.bannerMessages.length;
    banner.textContent = siteConfig.bannerMessages[currentIndex];
  }, 4000);
}

function buildTestimonials(containerId = 'testimonials') {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="testimonials__wrapper">
      <h2 class="section__title">Testimonials</h2>
      <div class="testimonials__content">
        <blockquote class="testimonial" data-testimonial>
          <p class="testimonial__quote"></p>
          <cite class="testimonial__author"></cite>
        </blockquote>
        <div class="testimonial__dots" data-testimonial-dots></div>
      </div>
    </div>
  `;

  const quoteEl = container.querySelector('.testimonial__quote');
  const authorEl = container.querySelector('.testimonial__author');
  const dotsEl = container.querySelector('[data-testimonial-dots]');
  let index = 0;

  siteConfig.testimonials.forEach((_, dotIndex) => {
    const dot = document.createElement('button');
    dot.className = 'testimonial__dot';
    dot.type = 'button';
    dot.setAttribute('aria-label', `Show testimonial ${dotIndex + 1}`);
    dot.addEventListener('click', () => {
      index = dotIndex;
      updateTestimonial();
    });
    dotsEl.appendChild(dot);
  });

  function updateTestimonial() {
    const testimonial = siteConfig.testimonials[index];
    quoteEl.textContent = testimonial.quote;
    authorEl.textContent = `${testimonial.name} — ${testimonial.location}`;
    dotsEl.querySelectorAll('.testimonial__dot').forEach((dot, dotIdx) => {
      dot.classList.toggle('testimonial__dot--active', dotIdx === index);
    });
  }

  updateTestimonial();
  setInterval(() => {
    index = (index + 1) % siteConfig.testimonials.length;
    updateTestimonial();
  }, 6000);
}

document.addEventListener('DOMContentLoaded', () => {
  buildRotatingBanner();
  buildHeader();
  buildFooter();
  buildTestimonials();
});
