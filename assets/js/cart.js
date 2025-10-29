const SHIPPING_PRICE_GBP = 8.99;

const SHIPPING_OPTIONS = [
  {
    id: 'standard-tracked-uk',
    label: 'Standard Tracked (UK)',
    countries: ['GB'],
    price: SHIPPING_PRICE_GBP,
    methodCode: 'Budget'
  },
  {
    id: 'standard-tracked-eu',
    label: 'Standard Tracked (Europe)',
    countries: ['DE', 'FR', 'ES', 'IT', 'IE', 'NL', 'BE', 'SE', 'NO', 'DK', 'FI', 'PT', 'AT', 'CH'],
    price: SHIPPING_PRICE_GBP,
    methodCode: 'Budget'
  },
  {
    id: 'standard-tracked-us',
    label: 'Standard Tracked (US)',
    countries: ['US'],
    price: SHIPPING_PRICE_GBP,
    methodCode: 'Budget'
  }
];

// Shopping Cart Management
class ShoppingCart {
  constructor() {
    this.items = this.loadFromStorage();
    this.selectedShippingOption = this.loadShippingPreference() || null;
    this.stripePromise = null;
    this.stripe = null;
    this.stripeElements = null;
    this.cardElement = null;
    this.paymentIntent = null;
    this.currentTotalCents = 0;
    this.isCreatingPaymentIntent = false;
    this.paymentIntentPromise = null;
    this.refreshStoredItemImages();
    this.ensureShippingOption('GB');
    this.updateCartUI();
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem('artiq-cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  saveToStorage() {
    localStorage.setItem('artiq-cart', JSON.stringify(this.items));
  }

  resolveImageKey(product, frame) {
    if (!product) return null;
    const frameImages = product.frameImages || {};
    const frameSpecific = frameImages && frame && frameImages[frame];
    return (
      frameSpecific ||
      frameImages.default ||
      product.imageKey ||
      product.artworkUrl ||
      product.assetUrl ||
      null
    );
  }

  refreshStoredItemImages() {
    let mutated = false;
    this.items = (Array.isArray(this.items) ? this.items : []).map((item) => {
      const product = siteConfig.products.find((p) => p.id === item.productId);
      if (!product) return item;
      let next = item;
      let localMutated = false;

      const resolved = this.resolveImageKey(product, item.frame);
      if (resolved && resolved !== item.imageKey) {
        next = { ...next, imageKey: resolved };
        localMutated = true;
      }

      const productBasePrice = typeof product.price === 'number' ? product.price : product.basePrice;
      const updatedPrice = this.calculatePrice(productBasePrice, item.size, product.priceOverrides);
      if (typeof updatedPrice === 'number' && !Number.isNaN(updatedPrice) && updatedPrice !== item.price) {
        next = next === item ? { ...next } : next;
        next.price = updatedPrice;
        localMutated = true;
      }

      if (localMutated) {
        mutated = true;
        return next;
      }
      return item;
    });
    if (mutated) {
      this.saveToStorage();
    }
  }

  resetPaymentState() {
    this.paymentIntent = null;
    this.paymentIntentPromise = null;
    this.currentTotalCents = 0;
    this.isCreatingPaymentIntent = false;
  }

  async ensureStripeInstance() {
    if (this.stripe) return this.stripe;

    if (!this.stripePromise) {
      this.stripePromise = (async () => {
        if (typeof Stripe === 'undefined') {
          throw new Error('Stripe.js failed to load. Please refresh the page.');
        }
        const response = await fetch('/api/stripe/config');
        if (!response.ok) {
          let message = 'Stripe configuration is unavailable.';
          try {
            const body = await response.json();
            if (body?.error) message = body.error;
          } catch {
            // ignore json errors
          }
          throw new Error(message);
        }
        const config = await response.json();
        if (!config?.publishableKey) {
          throw new Error('Stripe publishable key is missing on the server.');
        }
        this.stripe = Stripe(config.publishableKey);
        return this.stripe;
      })();
    }

    return this.stripePromise;
  }

  async ensurePaymentIntent(amountCents, metadata = {}) {
    if (!amountCents || amountCents <= 0) {
      this.resetPaymentState();
      return null;
    }
    if (this.paymentIntent && this.paymentIntent.amount === amountCents) {
      return this.paymentIntent;
    }

    if (this.isCreatingPaymentIntent && this.paymentIntentPromise) {
      try {
        await this.paymentIntentPromise;
      } catch {
        // ignore previous failure
      }
    }

    this.isCreatingPaymentIntent = true;
    this.paymentIntentPromise = (async () => {
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountCents,
          currency: 'gbp',
          metadata
        })
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.error || 'Unable to initialise payment.');
      }
      return data;
    })();

    try {
      const intent = await this.paymentIntentPromise;
      this.paymentIntent = intent;
      this.currentTotalCents = intent.amount;
      return intent;
    } finally {
      this.isCreatingPaymentIntent = false;
      this.paymentIntentPromise = null;
    }
  }

  clearPaymentErrors(form) {
    const errorEl = form?.querySelector('[data-card-errors]');
    if (errorEl) errorEl.textContent = '';
  }

  reportPaymentError(form, error) {
    console.error('Payment error:', error);
    const errorEl = form?.querySelector('[data-card-errors]');
    if (errorEl) {
      errorEl.textContent = error?.message || 'Payment could not be completed. Please try again.';
    }
  }

  async initialiseStripeCheckout(form) {
    try {
      const stripe = await this.ensureStripeInstance();
      const elements = this.stripeElements || stripe.elements();
      this.stripeElements = elements;

      const cardContainer = form.querySelector('#card-element');
      if (!cardContainer) {
        throw new Error('Payment form is missing the card container.');
      }

      if (this.cardElement) {
        try {
          this.cardElement.unmount();
        } catch {
          // ignore unable to unmount
        }
      } else {
        this.cardElement = elements.create('card', {
          hidePostalCode: true
        });
        this.cardElement.on('change', (event) => {
          if (event.error) {
            this.reportPaymentError(form, event.error);
          } else {
            this.clearPaymentErrors(form);
          }
        });
      }

      this.cardElement.mount(cardContainer);

      await this.updateCheckoutSummary(form);
    } catch (error) {
      this.reportPaymentError(form, error);
    }
  }

  async handleCheckoutSubmission(form) {
    const total = this.getTotal();
    const totalCents = Math.round(total * 100);
    if (totalCents <= 0) {
      this.reportPaymentError(form, new Error('Your basket is empty.'));
      return;
    }

    const formData = new FormData(form);
    const name = formData.get('customerName');
    const email = formData.get('customerEmail');
    const address1 = formData.get('address1');
    const address2 = formData.get('address2');
    const city = formData.get('city');
    const postcode = formData.get('postcode');
    const country = formData.get('country') || 'GB';

    const submitBtn = form.querySelector('.checkout-submit');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Processing...';
    }

    try {
      this.clearPaymentErrors(form);
      const stripe = await this.ensureStripeInstance();
      if (!stripe || !this.cardElement) {
        throw new Error('Payment form is not ready. Please refresh and try again.');
      }

      await this.ensurePaymentIntent(totalCents, {
        customerEmail: email || undefined,
        customerName: name || undefined
      });
      if (!this.paymentIntent?.clientSecret) {
        throw new Error('Unable to initiate payment. Please try again.');
      }

      const confirmation = await stripe.confirmCardPayment(this.paymentIntent.clientSecret, {
        payment_method: {
          card: this.cardElement,
          billing_details: {
            name,
            email,
            address: {
              line1: address1,
              line2: address2 || undefined,
              city,
              postal_code: postcode,
              country
            }
          }
        }
      });

      if (confirmation.error) {
        throw new Error(confirmation.error.message || 'Payment could not be completed.');
      }

      const confirmedIntentId = confirmation.paymentIntent?.id || this.paymentIntent.paymentIntentId;
      await this.submitOrder(form, formData, confirmedIntentId);
      this.resetPaymentState();
    } catch (error) {
      this.reportPaymentError(form, error);
    } finally {
      const submitBtnFinal = form.querySelector('.checkout-submit');
      if (submitBtnFinal) {
        submitBtnFinal.disabled = false;
        submitBtnFinal.textContent = 'Place Order';
      }
    }
  }

  addItem(productId, size, frame, quantity = 1) {
    const product = siteConfig.products.find(p => p.id === productId);
    if (!product || !product.prodigiSkus) {
      console.error('Product not found or missing Prodigi SKUs:', productId);
      return false;
    }

    const prodigiSku = product.prodigiSkus[size]?.[frame];
    if (!prodigiSku) {
      console.error('Prodigi SKU not found for:', { productId, size, frame });
      return false;
    }

    const basePrice = typeof product.price === 'number' ? product.price : product.basePrice;
    const rawAssetUrl = product.assetUrl || product.artworkUrl;
    let assetUrl = rawAssetUrl;
    if (rawAssetUrl) {
      try {
        assetUrl = new URL(rawAssetUrl, window.location.origin).href;
      } catch {
        assetUrl = rawAssetUrl;
      }
    }

    const frameImage = this.resolveImageKey(product, frame);

    const cartItem = {
      id: `${productId}-${size}-${frame}`,
      productId,
      title: product.title,
      size,
      frame,
      quantity,
      price: this.calculatePrice(basePrice, size, product.priceOverrides),
      prodigiSku,
      assetUrl,
      imageKey: frameImage
    };

    const existingIndex = this.items.findIndex(item => item.id === cartItem.id);
    if (existingIndex >= 0) {
      this.items[existingIndex].quantity += quantity;
    } else {
      this.items.push(cartItem);
    }

    this.saveToStorage();
    this.updateCartUI();
    return true;
  }

  removeItem(itemId) {
    this.items = this.items.filter(item => item.id !== itemId);
    this.saveToStorage();
    this.updateCartUI();
  }

  updateQuantity(itemId, quantity) {
    const item = this.items.find(item => item.id === itemId);
    if (item) {
      if (quantity <= 0) {
        this.removeItem(itemId);
      } else {
        item.quantity = quantity;
        this.saveToStorage();
        this.updateCartUI();
      }
    }
  }

  clear() {
    this.items = [];
    this.saveToStorage();
    this.updateCartUI();
    this.resetPaymentState();
  }

  getSubtotal() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getShippingCost() {
    if (!this.items.length) return 0;
    return this.selectedShippingOption ? this.selectedShippingOption.price : 0;
  }

  getTotal() {
    return this.getSubtotal() + this.getShippingCost();
  }

  getItemCount() {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  loadShippingPreference() {
    try {
      const storedId = localStorage.getItem('artiq-shipping-option');
      if (storedId) {
        const option = SHIPPING_OPTIONS.find((entry) => entry.id === storedId);
        if (option) return option;
      }
    } catch {
      // ignore preference errors
    }
    return null;
  }

  selectShippingOption(optionId, { persist = true } = {}) {
    const option = SHIPPING_OPTIONS.find((entry) => entry.id === optionId);
    if (!option) return null;
    this.selectedShippingOption = option;
    if (persist) {
      try {
        localStorage.setItem('artiq-shipping-option', option.id);
      } catch {
        // ignore storage failures
      }
    }
    return option;
  }

  ensureShippingOption(countryCode) {
    if (this.selectedShippingOption && SHIPPING_OPTIONS.some((opt) => opt.id === this.selectedShippingOption.id)) {
      return this.selectedShippingOption;
    }
    const fallback = this.getShippingOptionForCountry(countryCode) || SHIPPING_OPTIONS[0] || null;
    if (fallback) {
      this.selectShippingOption(fallback.id, { persist: false });
      return fallback;
    }
    this.selectedShippingOption = null;
    return null;
  }

  getShippingOptionForCountry(countryCode) {
    if (!countryCode) return SHIPPING_OPTIONS[0] || null;
    const normalised = String(countryCode).toUpperCase();
    const match = SHIPPING_OPTIONS.find((option) => Array.isArray(option.countries) && option.countries.includes(normalised));
    return match || (SHIPPING_OPTIONS[0] || null);
  }

  formatCurrency(value) {
    const amount = Number.isFinite(value) ? value : 0;
    return `\u00a3${amount.toFixed(2)}`;
  }

  renderShippingOptionsHtml(selectedId) {
    if (!SHIPPING_OPTIONS.length) return '<p>No shipping options available.</p>';
    return SHIPPING_OPTIONS.map((option) => {
      const checked = option.id === selectedId ? 'checked' : '';
      return `
        <label class="shipping-option">
          <input type="radio" name="shippingOption" value="${option.id}" ${checked} required>
          <span>
            ${option.label}
            <small>${this.formatCurrency(option.price)}</small>
          </span>
        </label>
      `;
    }).join('');
  }

  async updateCheckoutSummary(form) {
    if (!form) return;
    const subtotalEl = form.querySelector('[data-order-subtotal]');
    const shippingEl = form.querySelector('[data-order-shipping]');
    const totalEl = form.querySelector('[data-order-total]');
    const subtotal = this.getSubtotal();
    const shipping = this.getShippingCost();
    const total = this.getTotal();
    if (subtotalEl) subtotalEl.textContent = this.formatCurrency(subtotal);
    if (shippingEl) shippingEl.textContent = this.formatCurrency(shipping);
    if (totalEl) totalEl.textContent = this.formatCurrency(total);

    const totalCents = Math.round(total * 100);
    try {
      if (totalCents > 0) {
        await this.ensurePaymentIntent(totalCents, {
          subtotal: Math.round(subtotal * 100),
          shipping: Math.round(shipping * 100)
        });
      } else {
        this.resetPaymentState();
      }
      this.clearPaymentErrors(form);
    } catch (error) {
      this.reportPaymentError(form, error);
    }
  }

  bindShippingControls(form) {
    if (!form) return;
    const shippingContainer = form.querySelector('[data-shipping-options]');
    const countrySelect = form.querySelector('#country');
    if (!shippingContainer) return;

    const syncSelection = (optionId) => {
      shippingContainer.querySelectorAll('input[name="shippingOption"]').forEach((input) => {
        input.checked = input.value === optionId;
      });
    };

    shippingContainer.querySelectorAll('input[name="shippingOption"]').forEach((input) => {
      input.addEventListener('change', () => {
        this.selectShippingOption(input.value);
        this.updateCheckoutSummary(form);
      });
    });

    if (countrySelect) {
      countrySelect.addEventListener('change', (event) => {
        const option = this.getShippingOptionForCountry(event.target.value);
        if (option && (!this.selectedShippingOption || option.id !== this.selectedShippingOption.id)) {
          this.selectShippingOption(option.id);
          syncSelection(option.id);
          this.updateCheckoutSummary(form);
        }
      });
    }

    const activeOption = this.selectedShippingOption || this.ensureShippingOption(countrySelect?.value);
    if (activeOption) {
      syncSelection(activeOption.id);
    }
    this.updateCheckoutSummary(form);
  }

  calculatePrice(basePrice, size, overrides) {
    if (overrides && typeof overrides === 'object') {
      const overrideValue = overrides[size];
      if (typeof overrideValue === 'number' && !Number.isNaN(overrideValue)) {
        return overrideValue;
      }
    }
    if (typeof PRODIGI_VARIANT_PRICE_MAP !== 'undefined') {
      const variantPrice = PRODIGI_VARIANT_PRICE_MAP[size];
      if (typeof variantPrice === 'number' && !Number.isNaN(variantPrice)) {
        return variantPrice;
      }
    }
    if (typeof basePrice === 'number' && !Number.isNaN(basePrice)) {
      return basePrice;
    }
    if (typeof PRODIGI_MIN_VARIANT_PRICE === 'number') {
      return PRODIGI_MIN_VARIANT_PRICE;
    }
    return 0;
  }

  updateCartUI() {
    const cartButton = document.querySelector('.header__cart');
    if (cartButton) {
      const count = this.getItemCount();
      cartButton.textContent = count > 0 ? `🛒 (${count})` : '🛒';
    }
  }

  renderCartModal() {
    const modal = document.createElement('div');
    modal.className = 'cart-modal';
    modal.innerHTML = `
      <div class="cart-modal__overlay">
        <div class="cart-modal__content">
          <div class="cart-modal__header">
            <h2>Shopping Cart</h2>
            <button class="cart-modal__close" aria-label="Close cart">&times;</button>
          </div>
          <div class="cart-modal__body">
            ${this.items.length === 0 ? 
              '<p class="cart-empty">Your cart is empty</p>' : 
              this.renderCartItems()
            }
          </div>
          ${this.items.length > 0 ? `
            <div class="cart-modal__footer">
              <div class="cart-total">
                <strong>Subtotal: ${this.formatCurrency(this.getSubtotal())}</strong>
              </div>
              <button class="btn btn--primary cart-checkout">Proceed to Checkout</button>
            </div>
          ` : ''}
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    this.applyCartItemImages(modal);

    // Close modal handlers
    modal.querySelector('.cart-modal__close').addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    modal.querySelector('.cart-modal__overlay').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) {
        document.body.removeChild(modal);
      }
    });

    // Checkout handler
    const checkoutBtn = modal.querySelector('.cart-checkout');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
        this.showCheckoutForm();
      });
    }

    // Cart item controls
    modal.addEventListener('click', (e) => {
      const item = e.target.closest('.cart-item');
      if (!item) return;
      
      const itemId = item.dataset.itemId;
      const action = e.target.dataset.action;
      
      if (action === 'increase') {
        const currentQty = parseInt(item.querySelector('.cart-item__quantity').textContent);
        this.updateQuantity(itemId, currentQty + 1);
        this.updateCartModal(modal);
      } else if (action === 'decrease') {
        const currentQty = parseInt(item.querySelector('.cart-item__quantity').textContent);
        this.updateQuantity(itemId, currentQty - 1);
        this.updateCartModal(modal);
      } else if (action === 'remove') {
        this.removeItem(itemId);
        this.updateCartModal(modal);
      }
    });

    return modal;
  }

  updateCartModal(modal) {
    const body = modal.querySelector('.cart-modal__body');
    const footer = modal.querySelector('.cart-modal__footer');
    
    if (this.items.length === 0) {
      body.innerHTML = '<p class="cart-empty">Your cart is empty</p>';
      if (footer) footer.style.display = 'none';
    } else {
      body.innerHTML = this.renderCartItems();
      if (footer) {
        footer.style.display = 'flex';
        footer.querySelector('.cart-total strong').textContent = `Subtotal: ${this.formatCurrency(this.getSubtotal())}`;
      }
    }
    this.applyCartItemImages(body);
  }

  renderCartItems() {
    return this.items.map(item => `
      <div class="cart-item" data-item-id="${item.id}">
        <img class="cart-item__image" alt="${item.title} preview" loading="lazy" />
        <div class="cart-item__details">
          <h3>${item.title}</h3>
          <p>${item.size} • ${item.frame}</p>
          <div class="cart-item__controls">
            <button class="cart-item__decrease" data-action="decrease">-</button>
            <span class="cart-item__quantity">${item.quantity}</span>
            <button class="cart-item__increase" data-action="increase">+</button>
            <button class="cart-item__remove" data-action="remove">Remove</button>
          </div>
        </div>
        <div class="cart-item__price">${this.formatCurrency(item.price * item.quantity)}</div>
      </div>
    `).join('');
  }

  applyCartItemImages(container) {
    if (!container) return;
    const itemsById = new Map(this.items.map((item) => [item.id, item]));
    let mutated = false;
    container.querySelectorAll('.cart-item').forEach((row) => {
      const itemData = itemsById.get(row.dataset.itemId);
      if (!itemData) return;
      const imageEl = row.querySelector('.cart-item__image');
      if (imageEl) {
        const product =
          itemData.productId && siteConfig?.products
            ? siteConfig.products.find((p) => p.id === itemData.productId)
            : null;
        const imageKey = itemData.imageKey || this.resolveImageKey(product, itemData.frame);
        if (imageKey) {
          if (imageEl.tagName === 'IMG') {
            imageEl.src = imageKey;
            imageEl.alt = `${itemData.title || 'Artwork preview'}`;
          } else {
            applyPlaceholderImage(imageEl, imageKey);
          }
          if (!itemData.imageKey) {
            itemData.imageKey = imageKey;
            mutated = true;
          }
        }
      }
    });
    if (mutated) {
      this.saveToStorage();
    }
  }

  showCheckoutForm() {
    const modal = document.createElement('div');
    modal.className = 'checkout-modal';
    const activeShipping = this.ensureShippingOption('GB');
    const shippingOptionsHtml = this.renderShippingOptionsHtml(activeShipping ? activeShipping.id : null);
    const orderItemsHtml = this.items.map((item) => `
                  <div class="order-item">
                    <span>${item.title} (${item.size}, ${item.frame}) &times; ${item.quantity}</span>
                    <span>${this.formatCurrency(item.price * item.quantity)}</span>
                  </div>
                `).join('');
    modal.innerHTML = `
      <div class="checkout-modal__overlay">
        <div class="checkout-modal__content">
          <div class="checkout-modal__header">
            <h2>Checkout</h2>
            <button class="checkout-modal__close" aria-label="Close checkout">&times;</button>
          </div>
          <form class="checkout-form" data-checkout-form>
            <div class="checkout-section">
              <h3>Customer Information</h3>
              <div class="form-group">
                <label for="customer-name">Full Name *</label>
                <input type="text" id="customer-name" name="customerName" required>
              </div>
              <div class="form-group">
                <label for="customer-email">Email Address *</label>
                <input type="email" id="customer-email" name="customerEmail" required>
              </div>
            </div>

            <div class="checkout-section">
              <h3>Shipping Address</h3>
              <div class="form-group">
                <label for="address1">Address Line 1 *</label>
                <input type="text" id="address1" name="address1" required>
              </div>
              <div class="form-group">
                <label for="address2">Address Line 2</label>
                <input type="text" id="address2" name="address2">
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label for="city">City *</label>
                  <input type="text" id="city" name="city" required>
                </div>
                <div class="form-group">
                  <label for="postcode">Postcode *</label>
                  <input type="text" id="postcode" name="postcode" required>
                </div>
              </div>
              <div class="form-group">
                <label for="country">Country *</label>
                <select id="country" name="country" required>
                  <option value="GB">United Kingdom</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="ES">Spain</option>
                  <option value="IT">Italy</option>
                </select>
              </div>
            </div>

            <div class="checkout-section">
              <h3>Shipping Method</h3>
              <div class="shipping-options" data-shipping-options>
                ${shippingOptionsHtml}
              </div>
            </div>

            <div class="checkout-section">
              <h3>Order Summary</h3>
              <div class="order-items">
                ${orderItemsHtml}
              </div>
              <div class="order-summary">
                <div class="order-summary__line">
                  <span>Subtotal</span>
                  <span data-order-subtotal>${this.formatCurrency(this.getSubtotal())}</span>
                </div>
                <div class="order-summary__line">
                  <span>Shipping</span>
                  <span data-order-shipping>${this.formatCurrency(this.getShippingCost())}</span>
                </div>
                <div class="order-summary__total">
                  <strong>Total</strong>
                  <strong data-order-total>${this.formatCurrency(this.getTotal())}</strong>
                </div>
              </div>
            </div>

            <div class="checkout-section">
              <h3>Payment</h3>
              <div class="form-group">
                <label for="card-element">Card details *</label>
                <div id="card-element" class="card-element"></div>
                <div class="checkout-errors" data-card-errors role="alert"></div>
              </div>
            </div>

            <div class="checkout-section">
              <h3>Notes (Optional)</h3>
              <textarea name="notes" placeholder="Any special instructions for your order..."></textarea>
            </div>

            <button type="submit" class="btn btn--primary checkout-submit">Place Order</button>
          </form>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Close modal handlers
    modal.querySelector('.checkout-modal__close').addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    modal.querySelector('.checkout-modal__overlay').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) {
        document.body.removeChild(modal);
      }
    });

    const form = modal.querySelector('[data-checkout-form]');
    this.bindShippingControls(form);
    this.initialiseStripeCheckout(form);

    // Form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleCheckoutSubmission(form);
    });

    return modal;
  }
  async submitOrder(form, formData, paymentIntentId) {
    const submissionData = formData instanceof FormData ? formData : new FormData(form);
    const activeShipping = this.selectedShippingOption || this.ensureShippingOption(formData.get('country'));
    const orderData = {
      customer: {
        name: submissionData.get('customerName'),
        email: submissionData.get('customerEmail')
      },
      shipping: {
        address1: submissionData.get('address1'),
        address2: submissionData.get('address2'),
        city: submissionData.get('city'),
        postcode: submissionData.get('postcode'),
        countryCode: submissionData.get('country'),
        method: activeShipping ? activeShipping.label : null,
        methodCode: activeShipping ? activeShipping.methodCode : 'Budget',
        price: this.getShippingCost()
      },
      items: this.items.map(item => ({
        productId: item.productId,
        prodigiSku: item.prodigiSku,
        assetUrl: item.assetUrl,
        quantity: item.quantity,
        price: item.price,
        frame: item.frame,
        attributes: { color: item.frame }
      })),
      shippingOption: activeShipping
        ? {
            id: activeShipping.id,
            label: activeShipping.label,
            price: activeShipping.price,
            methodCode: activeShipping.methodCode
          }
        : null,
      totals: {
        subtotal: this.getSubtotal(),
        shipping: this.getShippingCost(),
        grandTotal: this.getTotal()
      },
      paymentIntentId,
      notes: submissionData.get('notes') || ''
    };

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();

      if (response.ok) {
        // Success - show confirmation
        this.showOrderConfirmation(result);
        this.clear(); // Clear cart after successful order
      } else {
        // Error - show error message
        this.showError(result.error || 'Order submission failed');
      }
    } catch (error) {
      console.error('Order submission error:', error);
      this.showError('Network error. Please try again.');
    }
  }

  showOrderConfirmation(orderResult) {
    const modal = document.createElement('div');
    modal.className = 'confirmation-modal';
    modal.innerHTML = `
      <div class="confirmation-modal__overlay">
        <div class="confirmation-modal__content">
          <div class="confirmation-modal__header">
            <h2>Order Confirmed!</h2>
          </div>
          <div class="confirmation-modal__body">
            <p>Thank you for your order! Your order has been submitted to Prodigi for fulfillment.</p>
            <div class="order-details">
              <p><strong>Order ID:</strong> ${orderResult.orderId}</p>
              <p><strong>Status:</strong> ${orderResult.status}</p>
            </div>
            <p>You will receive an email confirmation shortly with tracking information.</p>
          </div>
          <div class="confirmation-modal__footer">
            <button class="btn btn--primary" onclick="location.reload()">Continue Shopping</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Close modal after 5 seconds or on click
    setTimeout(() => {
      if (document.body.contains(modal)) {
        document.body.removeChild(modal);
      }
    }, 5000);

    modal.querySelector('.confirmation-modal__overlay').addEventListener('click', () => {
      if (document.body.contains(modal)) {
        document.body.removeChild(modal);
      }
    });
  }

  showError(message) {
    const modal = document.createElement('div');
    modal.className = 'error-modal';
    modal.innerHTML = `
      <div class="error-modal__overlay">
        <div class="error-modal__content">
          <div class="error-modal__header">
            <h2>Order Error</h2>
          </div>
          <div class="error-modal__body">
            <p>${message}</p>
          </div>
          <div class="error-modal__footer">
            <button class="btn btn--primary" onclick="this.closest('.error-modal').remove()">OK</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  }
}

// Initialize cart
const cart = new ShoppingCart();

// Add cart event listeners
document.addEventListener('DOMContentLoaded', () => {
  const cartButton = document.querySelector('.header__cart');
  if (cartButton) {
    cartButton.addEventListener('click', () => {
      cart.renderCartModal();
    });
  }
});

// Export for use in other files
window.cart = cart;




