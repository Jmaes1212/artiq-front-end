function getQueryParam(param) {
  const params = new URLSearchParams(window.location.search);
  return params.get(param);
}

function initProductPage() {
  const productId = getQueryParam('id') || siteConfig.productDetail.id;
  const productEntry = siteConfig.products.find((product) => product.id === productId);
  const productData = { ...siteConfig.productDetail, ...productEntry };

  const titleEl = document.querySelector('[data-product-title]');
  const priceEl = document.querySelector('[data-product-price]');
  const descriptionEl = document.querySelector('[data-product-description] ul');
  const frameSelect = document.querySelector('[data-frame-select]');
  const sizeSelect = document.querySelector('[data-size-select]');
  const gallery = document.querySelector('[data-product-gallery]');
  const mainImage = document.querySelector('[data-main-image]');
  const thumbnails = document.querySelector('[data-thumbnails]');
  const relatedCarousel = document.querySelector('[data-carousel="related"]');
  const recentCarousel = document.querySelector('[data-carousel="recent"]');

  if (titleEl) titleEl.textContent = productData.title || siteConfig.productDetail.title;
  if (priceEl) priceEl.textContent = siteConfig.productDetail.priceRange;
  if (descriptionEl) {
    descriptionEl.innerHTML = '';
    productData.description.forEach((line) => {
      const li = document.createElement('li');
      li.textContent = line;
      descriptionEl.appendChild(li);
    });
  }

  if (frameSelect) {
    frameSelect.innerHTML = '';
    productData.frames.forEach((frame) => {
      const option = document.createElement('option');
      option.value = frame.value;
      option.textContent = frame.label;
      frameSelect.appendChild(option);
    });
  }

  if (sizeSelect) {
    sizeSelect.innerHTML = '';
    productData.sizes.forEach((size) => {
      const option = document.createElement('option');
      option.value = size;
      option.textContent = size;
      sizeSelect.appendChild(option);
    });
  }

  function updateMainImage(key, altText) {
    if (!mainImage) return;
    mainImage.setAttribute('aria-label', altText);
    applyPlaceholderImage(mainImage, key);
  }

  if (thumbnails) {
    thumbnails.innerHTML = '';
    productData.gallery.forEach((image, index) => {
      const thumb = document.createElement('button');
      thumb.type = 'button';
      thumb.className = 'product__thumbnail image-placeholder';
      applyPlaceholderImage(thumb, image.src);
      thumb.setAttribute('aria-label', image.alt);
      thumb.addEventListener('click', () => {
        updateMainImage(image.src, image.alt);
        currentIndex = index;
      });
      thumbnails.appendChild(thumb);
    });
  }

  let currentIndex = 0;
  updateMainImage(productData.gallery[currentIndex].src, productData.gallery[currentIndex].alt);

  const prevBtn = document.querySelector('[data-gallery-prev]');
  const nextBtn = document.querySelector('[data-gallery-next]');
  const zoomToggle = document.querySelector('[data-zoom-toggle]');

  function goToIndex(index) {
    currentIndex = (index + productData.gallery.length) % productData.gallery.length;
    const image = productData.gallery[currentIndex];
    updateMainImage(image.src, image.alt);
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => goToIndex(currentIndex - 1));
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => goToIndex(currentIndex + 1));
  }

  if (frameSelect) {
    frameSelect.addEventListener('change', (event) => {
      const selectedFrame = event.target.value;
      const frameImage = productData.gallery.find((image) => image.src.includes(selectedFrame));
      if (frameImage) {
        const index = productData.gallery.indexOf(frameImage);
        goToIndex(index);
      }
    });
  }

  if (zoomToggle && gallery) {
    zoomToggle.addEventListener('click', () => {
      gallery.classList.toggle('product__gallery--zoomed');
      zoomToggle.textContent = gallery.classList.contains('product__gallery--zoomed') ? '➖' : '🔍';
    });
  }

  if (relatedCarousel) {
    initialiseCarousel(relatedCarousel, siteConfig.products.slice(0, 6));
  }

  if (recentCarousel) {
    const recentProducts = siteConfig.products.slice(6, 12);
    initialiseCarousel(recentCarousel, recentProducts, { hidePrice: true });
  }

  setupDiscountForms();
}

document.addEventListener('DOMContentLoaded', initProductPage);
