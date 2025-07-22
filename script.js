// Initialize Lucide icons
document.addEventListener('DOMContentLoaded', function() {
    lucide.createIcons();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize form validation
    initFormValidation();
    
    // Initialize smooth scrolling
    initSmoothScrolling();
    
    // Add loading state management
    initLoadingStates();
});

// Modal functionality
function openModal() {
    const modal = document.getElementById('modalOverlay');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus on first input for accessibility
    const firstInput = modal.querySelector('input');
    if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
    }
}

function closeModal() {
    const modal = document.getElementById('modalOverlay');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Reset form
    const form = document.getElementById('registrationForm');
    form.reset();
    clearValidationErrors();
}

// Mobile menu functionality
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const isVisible = mobileMenu.style.display === 'flex';
    
    if (isVisible) {
        closeMobileMenu();
    } else {
        mobileMenu.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// FAQ functionality
function toggleFAQ(element) {
    const answer = element.nextElementSibling;
    const isActive = element.classList.contains('active');
    
    // Close all other FAQs
    document.querySelectorAll('.faq-question.active').forEach(faq => {
        if (faq !== element) {
            faq.classList.remove('active');
            faq.nextElementSibling.classList.remove('active');
        }
    });
    
    // Toggle current FAQ
    if (isActive) {
        element.classList.remove('active');
        answer.classList.remove('active');
    } else {
        element.classList.add('active');
        answer.classList.add('active');
    }
}

// Form validation
function initFormValidation() {
    const form = document.getElementById('registrationForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            submitForm();
        }
    });
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

function validateForm() {
    const form = document.getElementById('registrationForm');
    const inputs = form.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    // Additional validations
    const email = form.querySelector('#email');
    if (email.value && !isValidEmail(email.value)) {
        showFieldError(email, 'Por favor ingresa un email válido');
        isValid = false;
    }
    
    const edad = form.querySelector('#edad');
    if (edad.value && (edad.value < 18 || edad.value > 35)) {
        showFieldError(edad, 'La edad debe estar entre 18 y 35 años');
        isValid = false;
    }
    
    const celular = form.querySelector('#celular');
    if (celular.value && !isValidPhone(celular.value)) {
        showFieldError(celular, 'Por favor ingresa un número de celular válido');
        isValid = false;
    }
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'Este campo es obligatorio');
        return false;
    }
    
    // Type-specific validation
    if (field.type === 'email' && value && !isValidEmail(value)) {
        showFieldError(field, 'Por favor ingresa un email válido');
        return false;
    }
    
    clearFieldError(field);
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    // Basic phone validation - accepts various formats
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    return phoneRegex.test(cleanPhone) && cleanPhone.length >= 8;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.style.borderColor = '#EF4444';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#EF4444';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
    field.style.borderColor = '#E5E7EB';
}

function clearValidationErrors() {
    const errorDivs = document.querySelectorAll('.field-error');
    errorDivs.forEach(div => div.remove());
    
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.style.borderColor = '#E5E7EB';
    });
}

// Form submission
async function submitForm() {
    const form = document.getElementById('registrationForm');
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.innerHTML = 'Enviando...';
    submitBtn.disabled = true;
    
    try {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Simulate API call (replace with actual endpoint)
        await simulateAPICall(data);
        
        // Success state
        showSuccessMessage();
        closeModal();
        
        // Track conversion (add your analytics code here)
        trackConversion('form_submission', data);
        
    } catch (error) {
        console.error('Error submitting form:', error);
        showErrorMessage('Hubo un error al enviar tu solicitud. Por favor intenta nuevamente.');
    } finally {
        // Reset button state
        submitBtn.classList.remove('loading');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

async function simulateAPICall(data) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Log the data (in production, send to your backend)
    console.log('Form data:', data);
    
    // You can replace this with actual API call:
    /*
    const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    
    return await response.json();
    */
}

function showSuccessMessage() {
    const message = document.createElement('div');
    message.className = 'success-toast';
    message.innerHTML = `
        <div style="background: #10B981; color: white; padding: 1rem 2rem; border-radius: 8px; position: fixed; top: 2rem; right: 2rem; z-index: 4000; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <strong>¡Solicitud enviada exitosamente!</strong><br>
            Te contactaremos pronto con más información.
        </div>
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        document.body.removeChild(message);
    }, 5000);
}

function showErrorMessage(errorMsg) {
    const message = document.createElement('div');
    message.className = 'error-toast';
    message.innerHTML = `
        <div style="background: #EF4444; color: white; padding: 1rem 2rem; border-radius: 8px; position: fixed; top: 2rem; right: 2rem; z-index: 4000; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <strong>Error:</strong> ${errorMsg}
        </div>
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        document.body.removeChild(message);
    }, 5000);
}

// Scroll animations
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.benefit-card, .week-card, .mentor-card, .testimonial-card');
    animateElements.forEach(el => observer.observe(el));
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                closeMobileMenu();
            }
        });
    });
}

// Loading states management
function initLoadingStates() {
    // Add loading states to buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.getAttribute('onclick') || this.type === 'submit') {
                return; // Let the specific handlers manage loading
            }
            
            this.classList.add('loading');
            setTimeout(() => {
                this.classList.remove('loading');
            }, 1000);
        });
    });
}

// Analytics tracking (implement with your analytics provider)
function trackConversion(eventName, data) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
            'custom_parameter': data,
            'value': 1
        });
    }
    
    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead', {
            content_name: 'Makers Fellowship Registration'
        });
    }
    
    // Console log for development
    console.log('Conversion tracked:', eventName, data);
}

// Keyboard accessibility
document.addEventListener('keydown', function(e) {
    // Close modal with Escape key
    if (e.key === 'Escape') {
        closeModal();
        closeMobileMenu();
    }
    
    // FAQ keyboard navigation
    if (e.target.classList.contains('faq-question')) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleFAQ(e.target);
        }
    }
});

// Performance monitoring
function initPerformanceMonitoring() {
    // Track page load performance
    window.addEventListener('load', function() {
        setTimeout(function() {
            const perfData = performance.timing;
            const loadTime = perfData.loadEventEnd - perfData.navigationStart;
            
            console.log('Page load time:', loadTime + 'ms');
            
            // Send to analytics if needed
            if (typeof gtag !== 'undefined') {
                gtag('event', 'page_load_time', {
                    'value': loadTime,
                    'custom_parameter': 'landing_page'
                });
            }
        }, 0);
    });
}

// Initialize performance monitoring
initPerformanceMonitoring();

// Progressive Web App features
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Register service worker for caching (optional)
        // navigator.serviceWorker.register('/sw.js');
    });
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e);
    
    // Optional: Send error reports to monitoring service
    // if (typeof gtag !== 'undefined') {
    //     gtag('event', 'exception', {
    //         'description': e.message,
    //         'fatal': false
    //     });
    // }
});

// Touch enhancements for mobile
if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
    
    // Add touch feedback for buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        btn.addEventListener('touchend', function() {
            this.style.transform = '';
        });
    });
}

// Auto-focus management for accessibility
function manageFocus() {
    let lastFocusedElement = null;
    
    // Store last focused element before opening modal
    document.querySelectorAll('[onclick*="openModal"]').forEach(btn => {
        btn.addEventListener('click', function() {
            lastFocusedElement = this;
        });
    });
    
    // Restore focus when closing modal
    const originalCloseModal = closeModal;
    closeModal = function() {
        originalCloseModal();
        if (lastFocusedElement) {
            lastFocusedElement.focus();
            lastFocusedElement = null;
        }
    };
}

// Initialize focus management
manageFocus();

// Lazy loading for images (if you add images later)
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initLazyLoading);