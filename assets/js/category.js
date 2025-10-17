function getQueryParam(param) {
  const params = new URLSearchParams(window.location.search);
  return params.get(param);
}

function normaliseCategoryKey(value) {
  return value ? value.toLowerCase().replace(/\s+/g, '-') : 'featured';
}

function buildCategoryPage() {
  const categoryParam = normaliseCategoryKey(getQueryParam('category'));
  const titleEl = document.querySelector('[data-category-title]');
  const descriptionEl = document.querySelector('[data-category-description]');
  const gridEl = document.querySelector('[data-category-grid]');
  const sortSelect = document.querySelector('[data-sort-select]');

  const category = siteConfig.categories.main.find((cat) => cat.key === categoryParam)
    || siteConfig.categories.niche.find((cat) => cat.key === categoryParam);

  if (category && titleEl) {
    titleEl.textContent = category.title;
  } else if (titleEl) {
    titleEl.textContent = 'Featured Collection';
  }

  if (descriptionEl) {
    descriptionEl.textContent = category
      ? `Discover curated ${category.title.toLowerCase()} prints produced on demand in partnership with Printify.`
      : 'Our featured collection showcases the latest releases and community favourites.';
  }

  function renderProducts(products) {
    if (!gridEl) return;
    gridEl.innerHTML = '';
    products.forEach((product) => {
      const card = document.createElement('article');
      card.className = 'category-product image-placeholder';
      card.innerHTML = `
        <a href="product.html?id=${product.id}">
          <div class="category-product__media"></div>
          <div class="category-product__info">
            <h3>${product.title}</h3>
            <p class="category-product__price">£${product.price.toFixed(2)}</p>
          </div>
        </a>
      `;
      const media = card.querySelector('.category-product__media');
      applyPlaceholderImage(media, product.imageKey);
      gridEl.appendChild(card);
    });
  }

  const filteredProducts = categoryParam === 'featured'
    ? siteConfig.products
    : siteConfig.products.filter((product) => product.category.replace(/\s+/g, '-') === categoryParam);

  function sortProducts(sortKey) {
    const products = [...filteredProducts];
    switch (sortKey) {
      case 'bestselling':
        return products.reverse();
      case 'price-asc':
        return products.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return products.sort((a, b) => b.price - a.price);
      case 'newest':
      default:
        return products;
    }
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', (event) => {
      renderProducts(sortProducts(event.target.value));
    });
  }

  renderProducts(sortProducts(sortSelect ? sortSelect.value : 'newest'));
}

document.addEventListener('DOMContentLoaded', () => {
  buildCategoryPage();
  setupDiscountForms();
});
