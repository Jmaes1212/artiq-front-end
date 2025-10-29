function applyPlaceholderImage(element, key) {
  if (!element) return;
  if (typeof key === 'string') {
    const normalisedKey = key.trim();
    const isDirectAsset =
      normalisedKey.startsWith('http://') ||
      normalisedKey.startsWith('https://') ||
      normalisedKey.startsWith('/') ||
      normalisedKey.startsWith('./') ||
      normalisedKey.startsWith('../') ||
      normalisedKey.startsWith('assets/');

    if (isDirectAsset) {
      element.style.backgroundImage = `url(${normalisedKey})`;
      element.style.backgroundSize = 'cover';
      element.style.backgroundPosition = 'center';
      element.style.backgroundRepeat = 'no-repeat';
      return;
    }
  }
  const placeholder = placeholderImages[key] || placeholderImages.abstract;
  if (placeholder.startsWith('linear-gradient') || placeholder.startsWith('radial-gradient')) {
    element.style.backgroundImage = placeholder;
  } else {
    element.style.backgroundImage = `url(${placeholder})`;
  }
}

function renderProductCard(product, { hidePrice = false } = {}) {
  const card = document.createElement('article');
  card.className = 'product-card';

  const resolveStartingPrice = () => {
    if (product.priceOverrides && typeof product.priceOverrides === 'object') {
      const overrideValues = Object.values(product.priceOverrides).filter(
        (value) => typeof value === 'number' && !Number.isNaN(value)
      );
      if (overrideValues.length) {
        return Math.min(...overrideValues);
      }
    }
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
    if (typeof product.price === 'number') {
      return product.price;
    }
    if (typeof product.basePrice === 'number') {
      return product.basePrice;
    }
    return undefined;
  };

  const startingPrice = resolveStartingPrice();
  const priceHtml =
    hidePrice || typeof startingPrice !== 'number' || Number.isNaN(startingPrice)
      ? ''
      : `<p class="product-card__price">From &pound;${startingPrice.toFixed(2)}</p>`;

  card.innerHTML = `
    <a href="product.html?id=${product.id}" class="product-card__link">
      <div class="product-card__media image-placeholder"></div>
      <div class="product-card__info">
        <h3>${product.title}</h3>
        ${priceHtml}
      </div>
    </a>
  `;

  const media = card.querySelector('.product-card__media');
  applyPlaceholderImage(media, product.imageKey);
  return card;
}

function initialiseCarousel(carouselEl, products, options = {}) {
  if (!carouselEl) return;

  carouselEl.innerHTML = '';
  const wrapper = document.createElement('div');
  wrapper.className = 'carousel__track';

  products.forEach((product) => {
    wrapper.appendChild(renderProductCard(product, options));
  });

  const viewport = document.createElement('div');
  viewport.className = 'carousel__viewport';
  viewport.appendChild(wrapper);

  const prev = document.createElement('button');
  prev.className = 'carousel__control carousel__control--prev';
  prev.innerHTML = '&lsaquo;';
  prev.setAttribute('aria-label', 'Previous items');

  const next = document.createElement('button');
  next.className = 'carousel__control carousel__control--next';
  next.innerHTML = '&rsaquo;';
  next.setAttribute('aria-label', 'Next items');

  carouselEl.appendChild(prev);
  carouselEl.appendChild(viewport);
  carouselEl.appendChild(next);

  let scrollIndex = 0;
  const visibleCount = 3;

  function update() {
    const offset = scrollIndex * (100 / visibleCount);
    wrapper.style.transform = `translateX(-${offset}%)`;
  }

  prev.addEventListener('click', () => {
    scrollIndex = Math.max(scrollIndex - 1, 0);
    update();
  });

  next.addEventListener('click', () => {
    const maxIndex = Math.max(products.length - visibleCount, 0);
    scrollIndex = Math.min(scrollIndex + 1, maxIndex);
    update();
  });

  update();
}

function setupDiscountForms(context = document) {
  context.querySelectorAll('[data-discount-form]').forEach((form) => {
    const feedback = form.parentElement.querySelector('[data-feedback]');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const email = new FormData(form).get('email');
      if (feedback) {
        feedback.hidden = false;
        feedback.textContent = `Thanks, ${email}! Your 10% code has been emailed.`;
      }
      form.reset();
    });
  });
}
