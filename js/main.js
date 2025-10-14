/**
 * Modern Product Page JavaScript
 * Handles all interactive functionality for the Shopify-style product page
 */

class ProductPage {
    constructor() {
        this.selectedColor = 'Royal Blue';
        this.selectedSize = 'Medium';
        this.quantity = 1;
        this.cartCount = 0;
        
        this.init();
    }

    /**
     * Initialize all functionality
     */
    init() {
        this.initImageGallery();
        this.initProductVariants();
        this.initQuantityControls();
        this.initModals();
        this.initTabs();
        this.initScrollableProducts();
        this.initLocalStorage();
        this.initAccessibility();
        
        // Load saved preferences
        this.loadSavedPreferences();
        
        console.log('Product page initialized successfully');
    }

    /**
     * Image Gallery Functionality
     */
    initImageGallery() {
        const mainImage = document.getElementById('mainImage');
        const thumbnails = document.querySelectorAll('.thumbnail');

        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', (e) => {
                // Remove active class from all thumbnails
                thumbnails.forEach(thumb => thumb.classList.remove('active'));
                
                // Add active class to clicked thumbnail
                e.target.classList.add('active');
                
                // Update main image
                const newImageSrc = e.target.dataset.main;
                if (newImageSrc) {
                    mainImage.src = newImageSrc;
                    mainImage.alt = e.target.alt;
                }
            });

            // Add keyboard support for thumbnails
            thumbnail.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    thumbnail.click();
                }
            });
        });

        // Add image zoom effect on hover
        const mainImageContainer = document.querySelector('.main-image-container');
        if (mainImageContainer) {
            mainImageContainer.addEventListener('mousemove', this.handleImageZoom.bind(this));
            mainImageContainer.addEventListener('mouseleave', this.resetImageZoom.bind(this));
        }
    }

    /**
     * Handle image zoom on hover
     */
    handleImageZoom(e) {
        const container = e.currentTarget;
        const image = container.querySelector('.main-image');
        const rect = container.getBoundingClientRect();
        
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        image.style.transformOrigin = `${x}% ${y}%`;
        image.style.transform = 'scale(1.2)';
    }

    /**
     * Reset image zoom
     */
    resetImageZoom(e) {
        const image = e.currentTarget.querySelector('.main-image');
        image.style.transform = 'scale(1)';
        image.style.transformOrigin = 'center center';
    }

    /**
     * Product Variants Functionality
     */
    initProductVariants() {
        this.initColorSwatches();
        this.initSizeOptions();
    }

    /**
     * Initialize color swatch functionality
     */
    initColorSwatches() {
        const colorSwatches = document.querySelectorAll('.color-swatch');
        const selectedColorSpan = document.getElementById('selectedColor');

        colorSwatches.forEach(swatch => {
            swatch.addEventListener('click', (e) => {
                // Remove active class from all swatches
                colorSwatches.forEach(s => s.classList.remove('active'));
                
                // Add active class to clicked swatch
                e.target.classList.add('active');
                
                // Update selected color
                const colorName = e.target.dataset.color;
                this.selectedColor = colorName;
                if (selectedColorSpan) {
                    selectedColorSpan.textContent = colorName;
                }
                
                // Save to localStorage
                this.savePreferences();
                
                // Trigger color change event (could update product images)
                this.onColorChange(colorName);
            });

            // Add keyboard support
            swatch.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    swatch.click();
                }
            });
        });
    }

    /**
     * Initialize size option functionality
     */
    initSizeOptions() {
        const sizeOptions = document.querySelectorAll('.size-option');
        const selectedSizeSpan = document.getElementById('selectedSize');

        sizeOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                // Remove active class from all options
                sizeOptions.forEach(opt => opt.classList.remove('active'));
                
                // Add active class to clicked option
                e.target.classList.add('active');
                
                // Update selected size
                const sizeName = e.target.dataset.size;
                this.selectedSize = this.getSizeFullName(sizeName);
                if (selectedSizeSpan) {
                    selectedSizeSpan.textContent = this.selectedSize;
                }
                
                // Save to localStorage
                this.savePreferences();
                
                // Trigger size change event
                this.onSizeChange(sizeName);
            });

            // Add keyboard support
            option.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    option.click();
                }
            });
        });
    }

    /**
     * Convert size abbreviation to full name
     */
    getSizeFullName(size) {
        const sizeMap = {
            'XS': 'Extra Small',
            'S': 'Small',
            'M': 'Medium',
            'L': 'Large',
            'XL': 'Extra Large',
            'XXL': 'Extra Extra Large'
        };
        return sizeMap[size] || size;
    }

    /**
     * Handle color change
     */
    onColorChange(colorName) {
        // Could update product images based on color
        // For now, just log the change
        console.log(`Color changed to: ${colorName}`);
        
        // Add visual feedback
        this.showNotification(`Selected color: ${colorName}`);
    }

    /**
     * Handle size change
     */
    onSizeChange(sizeName) {
        console.log(`Size changed to: ${sizeName}`);
        
        // Add visual feedback
        this.showNotification(`Selected size: ${this.getSizeFullName(sizeName)}`);
    }

    /**
     * Quantity Controls
     */
    initQuantityControls() {
        const quantityInput = document.getElementById('quantity');
        const quantityBtns = document.querySelectorAll('.quantity-btn');

        quantityBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                let currentValue = parseInt(quantityInput.value) || 1;
                
                if (action === 'increase' && currentValue < 10) {
                    currentValue++;
                } else if (action === 'decrease' && currentValue > 1) {
                    currentValue--;
                }
                
                quantityInput.value = currentValue;
                this.quantity = currentValue;
            });
        });

        // Handle direct input
        quantityInput.addEventListener('change', (e) => {
            let value = parseInt(e.target.value) || 1;
            value = Math.max(1, Math.min(10, value));
            e.target.value = value;
            this.quantity = value;
        });

        // Add to cart functionality
        const addToCartBtn = document.querySelector('.add-to-cart-btn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', this.addToCart.bind(this));
        }

        // Wishlist functionality
        const wishlistBtn = document.querySelector('.wishlist-btn');
        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', this.addToWishlist.bind(this));
        }

        // Bundle add to cart
        const addBundleBtn = document.querySelector('.add-bundle-btn');
        if (addBundleBtn) {
            addBundleBtn.addEventListener('click', this.addBundleToCart.bind(this));
        }
    }

    /**
     * Add product to cart
     */
    addToCart() {
        this.cartCount += this.quantity;
        this.updateCartDisplay();
        
        this.showNotification(`Added ${this.quantity} item(s) to cart!`, 'success');
        
        // Add visual feedback to button
        const btn = document.querySelector('.add-to-cart-btn');
        const originalText = btn.textContent;
        btn.textContent = 'Added!';
        btn.style.background = '#059669';
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 1500);
    }

    /**
     * Add product to wishlist
     */
    addToWishlist() {
        this.showNotification('Added to wishlist!', 'success');
        
        // Update wishlist button
        const btn = document.querySelector('.wishlist-btn');
        const originalText = btn.textContent;
        btn.textContent = '♥ Added to Wishlist';
        btn.style.color = '#dc2626';
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.color = '';
        }, 2000);
    }

    /**
     * Add bundle to cart
     */
    addBundleToCart() {
        this.cartCount += 3; // Bundle contains 3 items
        this.updateCartDisplay();
        
        this.showNotification('Bundle added to cart!', 'success');
        
        // Add visual feedback
        const btn = document.querySelector('.add-bundle-btn');
        const originalText = btn.textContent;
        btn.textContent = 'Bundle Added!';
        btn.style.background = '#059669';
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 1500);
    }

    /**
     * Update cart display
     */
    updateCartDisplay() {
        const cartBtn = document.querySelector('.cart-btn');
        if (cartBtn) {
            cartBtn.textContent = `Cart (${this.cartCount})`;
        }
    }

    /**
     * Modal Functionality
     */
    initModals() {
        this.initSizeChartModal();
        this.initCompareColorsModal();
        this.initModalAccessibility();
    }

    /**
     * Initialize size chart modal
     */
    initSizeChartModal() {
        const sizeChartBtn = document.querySelector('.size-chart-btn');
        const modal = document.getElementById('sizeChartModal');
        
        if (sizeChartBtn && modal) {
            sizeChartBtn.addEventListener('click', () => {
                this.openModal(modal);
            });
        }
    }

    /**
     * Initialize compare colors modal
     */
    initCompareColorsModal() {
        const compareBtn = document.querySelector('.compare-colors-btn');
        const modal = document.getElementById('compareColorsModal');
        
        if (compareBtn && modal) {
            compareBtn.addEventListener('click', () => {
                this.openModal(modal);
            });
            
            // Handle color comparison checkboxes
            const checkboxes = modal.querySelectorAll('.compare-checkbox');
            const selectedDisplay = document.getElementById('selectedColorsDisplay');
            
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', () => {
                    this.updateSelectedColors(checkboxes, selectedDisplay);
                });
            });
        }
    }

    /**
     * Update selected colors display
     */
    updateSelectedColors(checkboxes, displayElement) {
        const selected = Array.from(checkboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);
        
        if (selected.length === 0) {
            displayElement.innerHTML = '<p>No colors selected</p>';
        } else {
            const colorItems = selected.map(color => {
                const colorMap = {
                    'Royal Blue': '#1e3a8a',
                    'Saffron Orange': '#ff9933',
                    'Forest Green': '#166534',
                    'Maroon': '#800000',
                    'Cream White': '#f5f5dc'
                };
                
                return `
                    <div class="selected-color-item">
                        <div class="selected-color-swatch" style="background-color: ${colorMap[color]}; ${color === 'Cream White' ? 'border: 1px solid #e5e7eb;' : ''}"></div>
                        <span>${color}</span>
                    </div>
                `;
            }).join('');
            
            displayElement.innerHTML = colorItems;
        }
    }

    /**
     * Initialize modal accessibility
     */
    initModalAccessibility() {
        const modals = document.querySelectorAll('.modal');
        
        modals.forEach(modal => {
            // Close button functionality
            const closeBtn = modal.querySelector('.modal-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    this.closeModal(modal);
                });
            }
            
            // Close on overlay click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal);
                }
            });
            
            // Close on Escape key
            modal.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeModal(modal);
                }
            });
        });
    }

    /**
     * Open modal
     */
    openModal(modal) {
        modal.classList.add('active');
        modal.style.display = 'flex';
        
        // Focus management
        const firstFocusable = modal.querySelector('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) {
            firstFocusable.focus();
        }
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    /**
     * Close modal
     */
    closeModal(modal) {
        modal.classList.remove('active');
        
        // Animate out
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Return focus to trigger element
        const triggerBtn = modal.id === 'sizeChartModal' 
            ? document.querySelector('.size-chart-btn')
            : document.querySelector('.compare-colors-btn');
        
        if (triggerBtn) {
            triggerBtn.focus();
        }
    }

    /**
     * Tab Functionality
     */
    initTabs() {
        const tabHeaders = document.querySelectorAll('.tab-header');
        const tabContents = document.querySelectorAll('.tab-content');

        tabHeaders.forEach(header => {
            header.addEventListener('click', (e) => {
                const targetTab = e.target.dataset.tab;
                
                // Remove active class from all headers and contents
                tabHeaders.forEach(h => h.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked header and corresponding content
                e.target.classList.add('active');
                const targetContent = document.getElementById(targetTab);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });

            // Add keyboard support
            header.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    header.click();
                }
            });
        });
    }

    /**
     * Scrollable Products Functionality
     */
    initScrollableProducts() {
        const scrollContainers = document.querySelectorAll('.products-scroll-container');
        
        scrollContainers.forEach(container => {
            const scrollArea = container.querySelector('.products-scroll');
            const leftBtn = container.querySelector('.scroll-left');
            const rightBtn = container.querySelector('.scroll-right');
            
            if (leftBtn && rightBtn && scrollArea) {
                leftBtn.addEventListener('click', () => {
                    scrollArea.scrollBy({ left: -200, behavior: 'smooth' });
                });
                
                rightBtn.addEventListener('click', () => {
                    scrollArea.scrollBy({ left: 200, behavior: 'smooth' });
                });
                
                // Update button visibility based on scroll position
                this.updateScrollButtons(scrollArea, leftBtn, rightBtn);
                
                scrollArea.addEventListener('scroll', () => {
                    this.updateScrollButtons(scrollArea, leftBtn, rightBtn);
                });
            }
        });

        // Quick add functionality for product cards
        const quickAddBtns = document.querySelectorAll('.quick-add-btn');
        quickAddBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.cartCount++;
                this.updateCartDisplay();
                
                const originalText = btn.textContent;
                btn.textContent = 'Added!';
                btn.style.background = '#059669';
                
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                }, 1500);
                
                this.showNotification('Product added to cart!', 'success');
            });
        });
    }

    /**
     * Update scroll button visibility
     */
    updateScrollButtons(scrollArea, leftBtn, rightBtn) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollArea;
        
        leftBtn.style.opacity = scrollLeft > 0 ? '1' : '0.5';
        rightBtn.style.opacity = scrollLeft < scrollWidth - clientWidth ? '1' : '0.5';
        
        leftBtn.disabled = scrollLeft <= 0;
        rightBtn.disabled = scrollLeft >= scrollWidth - clientWidth;
    }

    /**
     * Local Storage Functionality
     */
    initLocalStorage() {
        // Save preferences when page unloads
        window.addEventListener('beforeunload', () => {
            this.savePreferences();
        });
    }

    /**
     * Save user preferences to localStorage
     */
    savePreferences() {
        const preferences = {
            selectedColor: this.selectedColor,
            selectedSize: this.selectedSize,
            quantity: this.quantity,
            cartCount: this.cartCount
        };
        
        try {
            localStorage.setItem('productPreferences', JSON.stringify(preferences));
        } catch (error) {
            console.warn('Could not save preferences to localStorage:', error);
        }
    }

    /**
     * Load saved preferences from localStorage
     */
    loadSavedPreferences() {
        try {
            const saved = localStorage.getItem('productPreferences');
            if (saved) {
                const preferences = JSON.parse(saved);
                
                // Restore color selection
                if (preferences.selectedColor) {
                    const colorSwatch = document.querySelector(`[data-color="${preferences.selectedColor}"]`);
                    if (colorSwatch) {
                        colorSwatch.click();
                    }
                }
                
                // Restore size selection
                if (preferences.selectedSize) {
                    const sizeMap = {
                        'Extra Small': 'XS',
                        'Small': 'S',
                        'Medium': 'M',
                        'Large': 'L',
                        'Extra Large': 'XL',
                        'Extra Extra Large': 'XXL'
                    };
                    const sizeCode = sizeMap[preferences.selectedSize];
                    if (sizeCode) {
                        const sizeOption = document.querySelector(`[data-size="${sizeCode}"]`);
                        if (sizeOption) {
                            sizeOption.click();
                        }
                    }
                }
                
                // Restore quantity
                if (preferences.quantity) {
                    const quantityInput = document.getElementById('quantity');
                    if (quantityInput) {
                        quantityInput.value = preferences.quantity;
                        this.quantity = preferences.quantity;
                    }
                }
                
                // Restore cart count
                if (preferences.cartCount) {
                    this.cartCount = preferences.cartCount;
                    this.updateCartDisplay();
                }
            }
        } catch (error) {
            console.warn('Could not load preferences from localStorage:', error);
        }
    }

    /**
     * Accessibility Enhancements
     */
    initAccessibility() {
        // Add ARIA labels and roles where needed
        this.enhanceARIA();
        
        // Add keyboard navigation for product cards
        this.addKeyboardNavigation();
        
        // Add screen reader announcements
        this.addScreenReaderSupport();
    }

    /**
     * Enhance ARIA attributes
     */
    enhanceARIA() {
        // Add role to product gallery
        const gallery = document.querySelector('.product-gallery');
        if (gallery) {
            gallery.setAttribute('role', 'region');
            gallery.setAttribute('aria-label', 'Product images');
        }
        
        // Add role to tabs
        const tabHeaders = document.querySelector('.tab-headers');
        if (tabHeaders) {
            tabHeaders.setAttribute('role', 'tablist');
        }
        
        document.querySelectorAll('.tab-header').forEach((tab, index) => {
            tab.setAttribute('role', 'tab');
            tab.setAttribute('aria-selected', tab.classList.contains('active'));
            tab.setAttribute('tabindex', tab.classList.contains('active') ? '0' : '-1');
        });
        
        document.querySelectorAll('.tab-content').forEach((content, index) => {
            content.setAttribute('role', 'tabpanel');
            content.setAttribute('aria-hidden', !content.classList.contains('active'));
        });
    }

    /**
     * Add keyboard navigation
     */
    addKeyboardNavigation() {
        // Arrow key navigation for color swatches
        const colorSwatches = document.querySelectorAll('.color-swatch');
        this.addArrowKeyNavigation(colorSwatches);
        
        // Arrow key navigation for size options
        const sizeOptions = document.querySelectorAll('.size-option');
        this.addArrowKeyNavigation(sizeOptions);
        
        // Arrow key navigation for tabs
        const tabHeaders = document.querySelectorAll('.tab-header');
        this.addArrowKeyNavigation(tabHeaders);
    }

    /**
     * Add arrow key navigation to a group of elements
     */
    addArrowKeyNavigation(elements) {
        elements.forEach((element, index) => {
            element.addEventListener('keydown', (e) => {
                let targetIndex = index;
                
                switch (e.key) {
                    case 'ArrowRight':
                    case 'ArrowDown':
                        e.preventDefault();
                        targetIndex = (index + 1) % elements.length;
                        break;
                    case 'ArrowLeft':
                    case 'ArrowUp':
                        e.preventDefault();
                        targetIndex = (index - 1 + elements.length) % elements.length;
                        break;
                    case 'Home':
                        e.preventDefault();
                        targetIndex = 0;
                        break;
                    case 'End':
                        e.preventDefault();
                        targetIndex = elements.length - 1;
                        break;
                    default:
                        return;
                }
                
                elements[targetIndex].focus();
            });
        });
    }

    /**
     * Add screen reader support
     */
    addScreenReaderSupport() {
        // Create live region for announcements
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
        document.body.appendChild(liveRegion);
        
        this.liveRegion = liveRegion;
    }

    /**
     * Show notification to user
     */
    showNotification(message, type = 'info') {
        // Visual notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#059669' : '#1f2937'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1001;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
        
        // Screen reader announcement
        if (this.liveRegion) {
            this.liveRegion.textContent = message;
        }
    }
}

// Initialize the product page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProductPage();
});

// Handle page visibility changes to save preferences
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
        // Save preferences when page becomes hidden
        const productPage = window.productPageInstance;
        if (productPage && productPage.savePreferences) {
            productPage.savePreferences();
        }
    }
});
