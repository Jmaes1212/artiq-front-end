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

  const getProductPriceValue = (product) => {
    if (typeof PRODIGI_SIZE_OPTIONS !== 'undefined' && PRODIGI_SIZE_OPTIONS.length > 0) {
      const firstSize = PRODIGI_SIZE_OPTIONS[0];
      const mappedPrice =
        typeof PRODIGI_VARIANT_PRICE_MAP !== 'undefined'
          ? PRODIGI_VARIANT_PRICE_MAP[firstSize]
          : undefined;
      if (typeof mappedPrice === 'number' && !Number.isNaN(mappedPrice)) {
        return mappedPrice;
      }
    }
    if (typeof PRODIGI_MIN_VARIANT_PRICE === 'number') {
      return PRODIGI_MIN_VARIANT_PRICE;
    }
    if (typeof product?.price === 'number') {
      return product.price;
    }
    return typeof product?.basePrice === 'number' ? product.basePrice : 0;
  };

  function renderProducts(products) {
    if (!gridEl) return;
    gridEl.innerHTML = '';
    products.forEach((product) => {
      const priceValue = getProductPriceValue(product);
      const priceText =
        typeof priceValue === 'number' && !Number.isNaN(priceValue)
          ? `&pound;${priceValue.toFixed(2)}`
          : 'Price on request';
      const card = document.createElement('article');
      card.className = 'category-product image-placeholder';
      card.innerHTML = `
        <a href="product.html?id=${product.id}">
          <div class="category-product__media"></div>
          <div class="category-product__info">
            <h3>${product.title}</h3>
            <p class="category-product__price">${priceText}</p>
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
        return products.sort((a, b) => getProductPriceValue(a) - getProductPriceValue(b));
      case 'price-desc':
        return products.sort((a, b) => getProductPriceValue(b) - getProductPriceValue(a));
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



