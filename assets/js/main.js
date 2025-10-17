function renderCategories(container, categories) {
  if (!container) return;
  categories.forEach((category) => {
    const card = document.createElement('a');
    card.className = 'category-card image-placeholder';
    card.href = `category.html?category=${category.key}`;
    card.innerHTML = `<span>${category.title}</span>`;
    applyPlaceholderImage(card, category.image);
    container.appendChild(card);
  });
}

function initHomepage() {
  const popularCarousel = document.querySelector('[data-carousel="popular"]');
  const newCarousel = document.querySelector('[data-carousel="new"]');
  const mainCategories = document.getElementById('main-categories');
  const nicheCategories = document.getElementById('niche-categories');

  const popularProducts = siteConfig.products.slice(0, 6);
  const newProducts = siteConfig.products.slice(6, 12);

  initialiseCarousel(popularCarousel, popularProducts);
  initialiseCarousel(newCarousel, newProducts);

  renderCategories(mainCategories, siteConfig.categories.main);
  renderCategories(nicheCategories, siteConfig.categories.niche);

  document.querySelectorAll('.category-card').forEach((card) => {
    card.addEventListener('mouseenter', () => card.classList.add('category-card--hover'));
    card.addEventListener('mouseleave', () => card.classList.remove('category-card--hover'));
  });

  setupDiscountForms();
}

document.addEventListener('DOMContentLoaded', initHomepage);
