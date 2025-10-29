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
  const framePreviewCanvas = document.getElementById('framePreview');
  const frameGalleryEl = document.getElementById('frameGallery');
  const relatedCarousel = document.querySelector('[data-carousel="related"]');
  const recentCarousel = document.querySelector('[data-carousel="recent"]');
  let frameShowcase = null;

  if (titleEl) titleEl.textContent = productData.title || siteConfig.productDetail.title;

  const getAvailableFramesForSize = (size) => {
    if (!productData?.prodigiSkus || !productData.frames) return [];
    const frameMap = productData.prodigiSkus[size] || {};
    return productData.frames.filter((frame) => frameMap[frame.value]);
  };

  function populateFrameOptions(size) {
    if (!frameSelect) return;
    const previousValue = frameSelect.value;
    const availableFrames = size ? getAvailableFramesForSize(size) : (productData.frames || []);

    frameSelect.innerHTML = '';
    availableFrames.forEach((frame) => {
      const option = document.createElement('option');
      option.value = frame.value;
      option.textContent = frame.label;
      frameSelect.appendChild(option);
    });

    if (availableFrames.length) {
      const hasPrevious = availableFrames.some((frame) => frame.value === previousValue);
      frameSelect.value = hasPrevious ? previousValue : availableFrames[0].value;
      frameShowcase?.setFrame(frameSelect.value || 'black');
    }
  }

  // Update price display to show dynamic pricing
  function updatePrice() {
    if (!priceEl || !productData.basePrice) return;

    const size = sizeSelect?.value;
    const frame = frameSelect?.value;

    if (size && frame && productData.prodigiSkus?.[size]?.[frame]) {
      const price = cart.calculatePrice(productData.basePrice, size, productData.priceOverrides);
      priceEl.textContent = `\u00a3${price.toFixed(2)}`;
      return;
    }

    let minPrice = Number.POSITIVE_INFINITY;
    let maxPrice = 0;

    Object.entries(productData.prodigiSkus || {}).forEach(([sizeKey, frameMap]) => {
      Object.keys(frameMap || {}).forEach((frameKey) => {
        const computed = cart.calculatePrice(productData.basePrice, sizeKey, productData.priceOverrides);
        if (!Number.isNaN(computed)) {
          minPrice = Math.min(minPrice, computed);
          maxPrice = Math.max(maxPrice, computed);
        }
      });
    });

    if (minPrice !== Number.POSITIVE_INFINITY && maxPrice !== 0) {
      if (Math.abs(maxPrice - minPrice) < 0.01) {
        priceEl.textContent = `\u00a3${minPrice.toFixed(2)}`;
      } else {
        priceEl.textContent = `\u00a3${minPrice.toFixed(2)} - \u00a3${maxPrice.toFixed(2)}`;
      }
    } else {
      priceEl.textContent = '';
    }
  }

  if (descriptionEl) {
    descriptionEl.innerHTML = '';
    const description = productData.description || siteConfig.productDetail.description;
    description.forEach((line) => {
      const li = document.createElement('li');
      li.textContent = line;
      descriptionEl.appendChild(li);
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

    if (productData.sizes.length) {
      sizeSelect.value = productData.sizes[0];
      populateFrameOptions(sizeSelect.value);
    } else {
      populateFrameOptions();
    }
  } else {
    populateFrameOptions();
  }

  const availableFrameKeys = (productData.frames || []).map((frame) => frame.value);
  frameShowcase = createFrameShowcase({
    canvas: framePreviewCanvas,
    galleryEl: frameGalleryEl,
    frameSelect,
    artUrl: productData.artworkUrl || productData.assetUrl,
    availableKeys: availableFrameKeys,
    frameImages: productData.frameImages,
    imageLibrary: typeof placeholderImages !== 'undefined' ? placeholderImages : undefined
  });
  frameShowcase?.setFrame(frameSelect?.value || availableFrameKeys[0] || 'black', { skipSelect: true });

  if (frameSelect) {
    frameSelect.addEventListener('change', (event) => {
      const selectedFrame = event.target.value;
      updatePrice();
      frameShowcase?.setFrame(selectedFrame);
    });
  }

  if (sizeSelect) {
    sizeSelect.addEventListener('change', (event) => {
      populateFrameOptions(event.target.value);
      updatePrice(); // Update price when size changes
      frameShowcase?.setFrame(frameSelect?.value || 'black');
    });
  }

  // Initial price update
  updatePrice();

  // Add to cart functionality
  const productForm = document.querySelector('[data-product-form]');
  if (productForm) {
    productForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(productForm);
      const size = formData.get('size');
      const frame = formData.get('frame');
      
      if (!size || !frame) {
        alert('Please select both size and frame options');
        return;
      }

      const success = cart.addItem(productId, size, frame, 1);
      if (success) {
        // Show success feedback
        const addBtn = productForm.querySelector('.product__add');
        const originalText = addBtn.textContent;
        addBtn.textContent = 'Added to Cart!';
        addBtn.classList.add('btn--success');
        
        setTimeout(() => {
          addBtn.textContent = originalText;
          addBtn.classList.remove('btn--success');
        }, 2000);
      } else {
        alert('Failed to add item to cart. Please try again.');
      }
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

const PREMIUM_FRAME_MAP = {
  black: "black",
  white: "white",
  natural: "oak",
  oak: "oak",
  walnut: "walnut",
  gold: "gold"
};

const PREMIUM_FRAME_STYLES = {
  black: { base: "#0f1012", highlight: "#44474f", lowlight: "#000000", grain: "none", fillet: "#cfcfcf", metalBand: 0, label: "Black" },
  white: { base: "#f5f5f6", highlight: "#ffffff", lowlight: "#d9d9df", grain: "none", fillet: "#b5b5b5", metalBand: 0, label: "White" },
  oak: { base: "#c99b52", highlight: "#efcf93", lowlight: "#8b5f2c", grain: "oak", fillet: "#e9e2d3", metalBand: 0, label: "Natural Oak" },
  walnut: { base: "#5a3a22", highlight: "#8d6243", lowlight: "#2f1b10", grain: "walnut", fillet: "#d9c9ae", metalBand: 0, label: "Walnut" },
  gold: { base: "#c8ad5a", highlight: "#f7eaa8", lowlight: "#8a7840", grain: "metal", fillet: "#f3eedc", metalBand: 1, label: "Brushed Gold" }
};

const FRAME_SWATCHES = [
  { key: "black", label: "Black", styleKey: "black" },
  { key: "white", label: "White", styleKey: "white" },
  { key: "natural", label: "Natural Oak", styleKey: "oak" },
  { key: "oak", label: "Oak", styleKey: "oak" },
  { key: "walnut", label: "Walnut", styleKey: "walnut" },
  { key: "gold", label: "Brushed Gold", styleKey: "gold" }
];

function createFrameShowcase({
  canvas,
  galleryEl,
  frameSelect,
  artUrl,
  availableKeys = [],
  frameImages,
  imageLibrary
}) {
  if (!canvas || !artUrl) return null;

  const frameImageMap = frameImages && Object.keys(frameImages || {}).length ? frameImages : null;
  const library =
    imageLibrary && typeof imageLibrary === "object"
      ? imageLibrary
      : typeof placeholderImages !== "undefined"
        ? placeholderImages
        : {};
  const framesToRender = deriveFrames(
    availableKeys && availableKeys.length
      ? availableKeys
      : frameImageMap
        ? Object.keys(frameImageMap)
        : undefined
  );

  if (frameImageMap) {
    const usableFrames = framesToRender.filter((frame) => frameImageMap[frame.key]);
    if (!usableFrames.length) return null;

    const previewImg = document.createElement("img");
    previewImg.className = "frame-preview__image";
    previewImg.alt = "Framed artwork preview";
    previewImg.decoding = "async";
    previewImg.loading = "lazy";

    const parent = canvas.parentElement;
    if (parent) {
      parent.insertBefore(previewImg, canvas);
    }
    canvas.style.display = "none";
    canvas.setAttribute("aria-hidden", "true");

    const initialFrame =
      (frameSelect && frameSelect.value && frameImageMap[frameSelect.value] && frameSelect.value) ||
      usableFrames[0].key;

    const state = {
      currentFrame: initialFrame,
      buttons: new Map()
    };

    if (frameSelect && frameSelect.value !== state.currentFrame) {
      frameSelect.value = state.currentFrame;
    }

    function resolveImageKey(frameKey) {
      if (!frameKey) return frameImageMap.default || null;
      return frameImageMap[frameKey] ?? frameImageMap.default ?? null;
    }

    function resolveImageSrc(imageKey) {
      if (!imageKey) return artUrl;
      if (typeof imageKey === "string") {
        const trimmed = imageKey.trim();
        if (
          /^data:image\//.test(trimmed) ||
          /^https?:\/\//.test(trimmed) ||
          trimmed.startsWith("/") ||
          trimmed.startsWith("./") ||
          trimmed.startsWith("../") ||
          trimmed.startsWith("assets/")
        ) {
          return trimmed;
        }
        if (library[trimmed]) return library[trimmed];
      }
      return artUrl;
    }

    function updatePreview(frameKey) {
      const imageKey = resolveImageKey(frameKey) || resolveImageKey(usableFrames[0]?.key);
      const src = resolveImageSrc(imageKey);
      previewImg.src = src;
    }

    function highlightActive() {
      state.buttons.forEach((button, key) => {
        const active = key === state.currentFrame;
        button.classList.toggle("thumb--active", active);
        button.setAttribute("aria-pressed", active ? "true" : "false");
      });
    }

    function buildGallery() {
      if (!galleryEl) return;
      galleryEl.innerHTML = "";
      state.buttons.clear();

      usableFrames.forEach((frame) => {
        const thumb = document.createElement("button");
        thumb.type = "button";
        thumb.className = "thumb";
        thumb.setAttribute("data-frame-key", frame.key);
        thumb.setAttribute("aria-label", `${frame.label} frame`);

        const img = document.createElement("img");
        img.alt = `${frame.label} frame preview`;
        img.src = resolveImageSrc(resolveImageKey(frame.key));

        const caption = document.createElement("span");
        caption.className = "label";
        caption.textContent = frame.label;

        thumb.appendChild(img);
        thumb.appendChild(caption);
        galleryEl.appendChild(thumb);
        state.buttons.set(frame.key, thumb);

        thumb.addEventListener("click", () => {
          if (frameSelect) frameSelect.value = frame.key;
          setFrame(frame.key, { skipSelect: true });
        });
      });

      highlightActive();
    }

    function setFrame(frameKey, { skipSelect = false } = {}) {
      const nextFrame = usableFrames.find((item) => item.key === frameKey) || usableFrames[0];
      if (!nextFrame) return;
      state.currentFrame = nextFrame.key;
      updatePreview(nextFrame.key);
      highlightActive();
      if (frameSelect && !skipSelect) {
        frameSelect.value = nextFrame.key;
      }
    }

    buildGallery();
    updatePreview(state.currentFrame);
    highlightActive();

    return {
      setFrame,
      destroy() {}
    };
  }

  const MAT_RATIO = 0.095;
  const FRAME_RATIO = 0.08;
  const FILLET_RATIO = 0.02;
  const CORNER_RADIUS = 9;
  const GLASS_INTENSITY = 0.05;
  const WALL_SHADOW = { spread: 56, opacity: 0.3 };
  const MAT_COLOR = "#ffffff";
  const DPR_CAP = 2;

  const ctx = canvas.getContext("2d", { alpha: true });
  const artImg = new Image();
  if (/^https?:/.test(artUrl)) artImg.crossOrigin = "anonymous";
  artImg.decoding = "async";
  artImg.src = artUrl;

  const state = {
    ready: false,
    currentFrame: frameSelect?.value && resolveFrameStyle(frameSelect.value)
      ? frameSelect.value
      : framesToRender[0]?.key || "black",
    imgRatio: 3 / 4,
    buttons: new Map(),
    resizeHandler: null
  };

  artImg.onload = () => {
    state.ready = true;
    if (artImg.width && artImg.height) {
      state.imgRatio = artImg.width / artImg.height;
    }
    resizeCanvas();
    renderCurrentFrame();
    buildGallery();
    state.resizeHandler = () => {
      if (!state.ready) return;
      resizeCanvas();
      renderCurrentFrame();
    };
    window.addEventListener("resize", state.resizeHandler, { passive: true });
  };

  artImg.onerror = () => {
    canvas.classList.add("frame-preview--error");
  };

  function deriveFrames(keys) {
    const sourceKeys = (keys && keys.length ? keys : FRAME_SWATCHES.map((frame) => frame.key)).map(String);
    const unique = [...new Set(sourceKeys)];
    const frames = unique
      .map((key) => {
        const swatch = FRAME_SWATCHES.find((item) => item.key === key);
        const styleKey = swatch?.styleKey || PREMIUM_FRAME_MAP[key] || key;
        const style = PREMIUM_FRAME_STYLES[styleKey];
        if (!style) return null;
        return { key, label: swatch?.label || style.label || key, styleKey, style };
      })
      .filter(Boolean);
    return frames.length ? frames : [{ key: "black", label: "Black", styleKey: "black", style: PREMIUM_FRAME_STYLES.black }];
  }

  function resizeCanvas() {
    const cssWidth = canvas.clientWidth || 900;
    const frameMultiplier = 1 + 2 * FRAME_RATIO + 2 * MAT_RATIO + 2 * FILLET_RATIO;
    const innerWidth = cssWidth / frameMultiplier;
    const innerHeight = innerWidth / state.imgRatio;
    const matPadding = innerWidth * MAT_RATIO;
    const frameWidth = innerWidth * FRAME_RATIO;
    const cssHeight = Math.round(innerHeight + 2 * (frameWidth + matPadding + innerWidth * FILLET_RATIO) + frameWidth * 2.6);
    const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
    canvas.width = Math.floor(cssWidth * dpr);
    canvas.height = Math.floor(cssHeight * dpr);
    canvas.style.height = `${cssHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function renderCurrentFrame() {
    if (!state.ready) return;
    const frame = framesToRender.find((item) => item.key === state.currentFrame) || framesToRender[0];
    if (!frame) return;
    drawFrame(ctx, canvas, frame);
  }

  function buildGallery() {
    if (!galleryEl) return;
    galleryEl.innerHTML = "";
    state.buttons.clear();

    framesToRender.forEach((frame) => {
      const thumb = document.createElement("button");
      thumb.type = "button";
      thumb.className = "thumb";
      thumb.setAttribute("data-frame-key", frame.key);
      thumb.setAttribute("aria-label", `${frame.label} frame`);

      const img = document.createElement("img");
      img.alt = `${frame.label} frame preview`;
      const caption = document.createElement("span");
      caption.className = "label";
      caption.textContent = frame.label;

      img.src = renderFrameThumbnail(frame);

      thumb.appendChild(img);
      thumb.appendChild(caption);
      galleryEl.appendChild(thumb);
      state.buttons.set(frame.key, thumb);

      thumb.addEventListener("click", () => {
        if (frameSelect) frameSelect.value = frame.key;
        setFrame(frame.key, { skipSelect: true });
      });
    });

    highlightActive();
  }

  function renderFrameThumbnail(frame) {
    const ratio = state.imgRatio || 0.8;
    const cssWidth = 420;
    const cssHeight = Math.round((cssWidth / ratio) * (1 + 2 * FRAME_RATIO + 2 * MAT_RATIO + 2 * FILLET_RATIO));
    const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
    const offCanvas = document.createElement('canvas');
    const offCtx = offCanvas.getContext('2d', { alpha: true });
    offCanvas.width = Math.floor(cssWidth * dpr);
    offCanvas.height = Math.floor(cssHeight * dpr);
    Object.defineProperty(offCanvas, 'clientWidth', { value: cssWidth });
    Object.defineProperty(offCanvas, 'clientHeight', { value: cssHeight });
    offCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawFrame(offCtx, offCanvas, frame);
    return offCanvas.toDataURL('image/jpeg', 0.92);
  }

  function drawFrame(targetCtx, targetCanvas, frame) {
    const style = frame.style || PREMIUM_FRAME_STYLES[frame.styleKey] || PREMIUM_FRAME_STYLES.black;
    const width = targetCanvas.clientWidth || targetCanvas.width;
    const height = targetCanvas.clientHeight || targetCanvas.height;
    const artRatio = state.imgRatio;

    targetCtx.clearRect(0, 0, targetCanvas.width, targetCanvas.height);
    targetCtx.save();

    const artWidth = width / (1 + 2 * FRAME_RATIO + 2 * MAT_RATIO + 2 * FILLET_RATIO);
    const artHeight = artWidth / artRatio;
    const filletWidth = artWidth * FILLET_RATIO;
    const matWidth = artWidth * MAT_RATIO;
    const frameWidth = artWidth * FRAME_RATIO;

    const outerWidth = artWidth + 2 * (filletWidth + matWidth + frameWidth);
    const outerHeight = artHeight + 2 * (filletWidth + matWidth + frameWidth);
    const offsetX = (width - outerWidth) / 2;
    const offsetY = (height - outerHeight) / 2;

    const outerRect = rect(offsetX, offsetY, outerWidth, outerHeight);
    const innerFrame = shrink(outerRect, frameWidth);
    const matRect = shrink(innerFrame, 0);
    const filletRect = shrink(matRect, matWidth);
    const artRect = shrink(filletRect, filletWidth);

    targetCtx.filter = `drop-shadow(${Math.max(4, width * 0.006)}px ${Math.max(12, height * 0.018)}px ${WALL_SHADOW.spread}px rgba(0,0,0,${WALL_SHADOW.opacity}))`;

    roundRect(targetCtx, outerRect, CORNER_RADIUS);
    targetCtx.fillStyle = style.base;
    targetCtx.fill();

    paintBevels(targetCtx, innerFrame, outerRect, style.highlight, style.lowlight, frameWidth);

    if (style.metalBand) {
      brushedBand(targetCtx, innerFrame, outerRect, style.metalBand === 1 ? '#fff5c2' : '#ececec', frameWidth * 0.45);
    }

    addTexture(targetCtx, outerRect, frameWidth, style.grain);
    cornerVignette(targetCtx, outerRect, frameWidth);
    innerLip(targetCtx, innerFrame);

    roundRect(targetCtx, matRect, CORNER_RADIUS - 2);
    targetCtx.fillStyle = MAT_COLOR;
    targetCtx.fill();

    const matShade = targetCtx.createLinearGradient(matRect.x, matRect.y, matRect.x, matRect.y + 16);
    matShade.addColorStop(0, 'rgba(0,0,0,0.16)');
    matShade.addColorStop(1, 'rgba(0,0,0,0)');
    targetCtx.fillStyle = matShade;
    targetCtx.fillRect(matRect.x + 6, matRect.y + 6, matRect.w - 12, 10);

    roundRect(targetCtx, filletRect, CORNER_RADIUS - 4);
    targetCtx.fillStyle = style.fillet;
    targetCtx.fill();

    const filletHighlight = targetCtx.createLinearGradient(filletRect.x, filletRect.y, filletRect.x, filletRect.y + filletWidth);
    filletHighlight.addColorStop(0, 'rgba(255,255,255,0.55)');
    filletHighlight.addColorStop(1, 'rgba(255,255,255,0)');
    targetCtx.fillStyle = filletHighlight;
    targetCtx.fillRect(filletRect.x, filletRect.y, filletRect.w, Math.max(1, filletWidth * 0.55));

    const src = cover(artImg.width, artImg.height, artRect.w, artRect.h);
    targetCtx.save();
    roundRect(targetCtx, artRect, CORNER_RADIUS - 5);
    targetCtx.clip();
    targetCtx.drawImage(artImg, src.sx, src.sy, src.sw, src.sh, artRect.x, artRect.y, artRect.w, artRect.h);

    const glass = targetCtx.createLinearGradient(artRect.x, artRect.y, artRect.x + artRect.w * 0.9, artRect.y + artRect.h * 0.7);
    glass.addColorStop(0.0, `rgba(255,255,255,${GLASS_INTENSITY})`);
    glass.addColorStop(0.3, `rgba(255,255,255,${GLASS_INTENSITY * 0.45})`);
    glass.addColorStop(0.4, 'rgba(255,255,255,0)');
    targetCtx.globalCompositeOperation = 'lighter';
    targetCtx.fillStyle = glass;
    targetCtx.fillRect(artRect.x, artRect.y, artRect.w, artRect.h);
    targetCtx.restore();

    targetCtx.restore();
  }

  function highlightActive() {
    state.buttons.forEach((button, key) => {
      const active = key === state.currentFrame;
      button.classList.toggle('thumb--active', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function resolveFrameStyle(key) {
    if (!key) return PREMIUM_FRAME_STYLES.black;
    const styleKey = PREMIUM_FRAME_MAP[key] || key;
    return PREMIUM_FRAME_STYLES[styleKey];
  }

  function setFrame(frameKey, { skipSelect = false } = {}) {
    const availableFrame = framesToRender.find((item) => item.key === frameKey) || framesToRender[0];
    if (!availableFrame) return;
    state.currentFrame = availableFrame.key;
    if (state.ready) {
      renderCurrentFrame();
      highlightActive();
    }
    if (frameSelect && !skipSelect) {
      frameSelect.value = availableFrame.key;
    }
  }

  function destroy() {
    if (state.resizeHandler) {
      window.removeEventListener('resize', state.resizeHandler);
    }
  }

  return {
    setFrame,
    destroy
  };
}

function roundRect(ctx, rect, radius) {
  const r = Math.max(0, Math.min(radius, Math.min(rect.w, rect.h) / 2));
  ctx.beginPath();
  ctx.moveTo(rect.x + r, rect.y);
  ctx.arcTo(rect.x + rect.w, rect.y, rect.x + rect.w, rect.y + rect.h, r);
  ctx.arcTo(rect.x + rect.w, rect.y + rect.h, rect.x, rect.y + rect.h, r);
  ctx.arcTo(rect.x, rect.y + rect.h, rect.x, rect.y, r);
  ctx.arcTo(rect.x, rect.y, rect.x + rect.w, rect.y, r);
  ctx.closePath();
}

function shrink(rect, amount) {
  return {
    x: rect.x + amount,
    y: rect.y + amount,
    w: rect.w - 2 * amount,
    h: rect.h - 2 * amount
  };
}

function rect(x, y, w, h) {
  return { x, y, w, h };
}

function paintBevels(ctx, inner, outer, highlight, lowlight, frameWidth) {
  let gradient = ctx.createLinearGradient(inner.x, outer.y, inner.x, outer.y + frameWidth);
  gradient.addColorStop(0, rgba(highlight, 0.55));
  gradient.addColorStop(1, rgba(highlight, 0));
  ctx.fillStyle = gradient;
  ctx.fillRect(outer.x, outer.y, outer.w, frameWidth);

  gradient = ctx.createLinearGradient(outer.x, inner.y, outer.x + frameWidth, inner.y);
  gradient.addColorStop(0, rgba(highlight, 0.45));
  gradient.addColorStop(1, rgba(highlight, 0));
  ctx.fillStyle = gradient;
  ctx.fillRect(outer.x, outer.y, frameWidth, outer.h);

  gradient = ctx.createLinearGradient(inner.x, inner.y + inner.h, inner.x, outer.y + outer.h);
  gradient.addColorStop(0, rgba(lowlight, 0.45));
  gradient.addColorStop(1, rgba(lowlight, 0));
  ctx.fillStyle = gradient;
  ctx.fillRect(outer.x, outer.y + outer.h - frameWidth, outer.w, frameWidth);

  gradient = ctx.createLinearGradient(inner.x + inner.w, inner.y, outer.x + outer.w, inner.y);
  gradient.addColorStop(0, rgba(lowlight, 0.45));
  gradient.addColorStop(1, rgba(lowlight, 0));
  ctx.fillStyle = gradient;
  ctx.fillRect(outer.x + outer.w - frameWidth, outer.y, frameWidth, outer.h);
}

function brushedBand(ctx, inner, outer, tint, thickness) {
  const inset = thickness * 1.2;
  const ring = {
    x: inner.x - inset,
    y: inner.y - inset,
    w: inner.w + inset * 2,
    h: inner.h + inset * 2
  };

  const gradientTop = ctx.createLinearGradient(ring.x, ring.y, ring.x, ring.y + thickness);
  gradientTop.addColorStop(0, rgba(tint, 0.55));
  gradientTop.addColorStop(1, rgba(tint, 0));
  ctx.fillStyle = gradientTop;
  ctx.fillRect(ring.x, ring.y, ring.w, thickness);

  const gradientLeft = ctx.createLinearGradient(ring.x, ring.y, ring.x + thickness, ring.y);
  gradientLeft.addColorStop(0, rgba(tint, 0.45));
  gradientLeft.addColorStop(1, rgba(tint, 0));
  ctx.fillStyle = gradientLeft;
  ctx.fillRect(ring.x, ring.y, thickness, ring.h);
}

function innerLip(ctx, inner) {
  const edge = 2;
  ctx.fillStyle = 'rgba(255,255,255,0.27)';
  ctx.fillRect(inner.x - edge, inner.y - edge, inner.w + 2 * edge, edge);
  ctx.fillRect(inner.x - edge, inner.y + inner.h, inner.w + 2 * edge, edge);
  ctx.fillRect(inner.x - edge, inner.y, edge, inner.h);
  ctx.fillRect(inner.x + inner.w, inner.y, edge, inner.h);
}

function cornerVignette(ctx, outer, frameWidth) {
  const radius = 18;
  const corners = [
    [outer.x + frameWidth, outer.y + frameWidth],
    [outer.x + outer.w - frameWidth, outer.y + frameWidth],
    [outer.x + frameWidth, outer.y + outer.h - frameWidth],
    [outer.x + outer.w - frameWidth, outer.y + outer.h - frameWidth]
  ];

  corners.forEach(([cx, cy]) => {
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    gradient.addColorStop(0, 'rgba(0,0,0,0.12)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
  });
}

function addTexture(ctx, outer, frameWidth, grainType) {
  if (!grainType || grainType === 'none') return;
  ctx.save();
  if (grainType === 'metal') {
    ctx.globalAlpha = 0.12;
    ctx.lineWidth = 0.8;
    ctx.strokeStyle = '#ffffff';
    const lines = Math.max(40, Math.floor((outer.w + outer.h) / 18));
    ctx.beginPath();
    for (let i = 0; i < lines; i += 1) {
      const y = outer.y + (outer.h * i) / lines;
      ctx.moveTo(outer.x + frameWidth * 0.35, y);
      ctx.lineTo(outer.x + outer.w - frameWidth * 0.35, y + Math.sin(i * 0.7) * 1.5);
    }
    ctx.stroke();
  } else {
    const passes = 3;
    const alphas = [0.06, 0.045, 0.035];
    const widths = [1.4, 1.0, 0.7];
    const colours = ['#2a1a0e', '#3a2717', '#563a24'];
    for (let pass = 0; pass < passes; pass += 1) {
      ctx.globalAlpha = alphas[pass];
      ctx.lineWidth = widths[pass];
      ctx.strokeStyle = colours[pass];
      const lines = Math.max(24, Math.floor((outer.w + outer.h) / 24) + pass * 6);
      ctx.beginPath();
      for (let i = 0; i < lines; i += 1) {
        const y = outer.y + (outer.h * i) / lines;
        const wobble = Math.sin(i * 0.55 + pass) * 2 + Math.cos(i * 0.18 + pass) * 1.5;
        ctx.moveTo(outer.x + frameWidth * 0.28, y);
        ctx.lineTo(outer.x + outer.w - frameWidth * 0.28, y + wobble);
      }
      ctx.stroke();
    }
  }
  ctx.restore();
}

function rgba(hex, alpha) {
  if (hex.startsWith('rgba') || hex.startsWith('rgb')) return hex;
  if (hex.length === 4) {
    const r = parseInt(hex[1] + hex[1], 16);
    const g = parseInt(hex[2] + hex[2], 16);
    const b = parseInt(hex[3] + hex[3], 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }
  if (hex.length >= 7) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }
  return hex;
}

function cover(sw, sh, dw, dh) {
  const sourceRatio = sw / sh;
  const destRatio = dw / dh;
  let sx = 0;
  let sy = 0;
  let sw2 = sw;
  let sh2 = sh;
  if (sourceRatio > destRatio) {
    sw2 = sh * destRatio;
    sx = (sw - sw2) / 2;
  } else {
    sh2 = sw / destRatio;
    sy = (sh - sh2) / 2;
  }
  return { sx, sy, sw: sw2, sh: sh2 };
}
