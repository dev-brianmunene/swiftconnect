/*-----------------------------------*\
  #SWIFTCONNECT LOGISTICS JAVASCRIPT
\*-----------------------------------*/

/**
 * SwiftConnect Logistics - Interactive Features
 * Kenya's trusted delivery and logistics website
 */

'use strict';

/**
 * Smooth scrolling for navigation links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

/**
 * Update active navigation link based on scroll position
 */
window.addEventListener('scroll', function() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar-link');
  
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (scrollY >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
});

/**
 * Header scroll effect
 */
window.addEventListener('scroll', function() {
  const header = document.querySelector('.header');
  if (window.scrollY > 100) {
    header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    header.style.backdropFilter = 'blur(10px)';
  } else {
    header.style.backgroundColor = 'var(--kenya-white)';
    header.style.backdropFilter = 'none';
  }
});

/**
 * Mobile menu toggle
 */
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navbar = document.querySelector('.navbar');

if (mobileMenuBtn && navbar) {
  mobileMenuBtn.addEventListener('click', function(e) {
    e.stopPropagation(); // Prevent event from bubbling up
    navbar.classList.toggle('show');
    this.textContent = navbar.classList.contains('show') ? '✕' : '☰';
    this.setAttribute('aria-expanded', navbar.classList.contains('show'));
  });

  // Close mobile menu when clicking on a link
  document.querySelectorAll('.navbar-link').forEach(link => {
    link.addEventListener('click', function() {
      navbar.classList.remove('show');
      mobileMenuBtn.textContent = '☰';
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', function(e) {
    if (navbar.classList.contains('show') && !navbar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
      navbar.classList.remove('show');
      mobileMenuBtn.textContent = '☰';
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // Close mobile menu on window resize (if screen becomes large)
  window.addEventListener('resize', function() {
    if (window.innerWidth > 767 && navbar.classList.contains('show')) {
      navbar.classList.remove('show');
      mobileMenuBtn.textContent = '☰';
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

/**
 * Form validation and submission
 */
document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form type
    const isBookingForm = form.querySelector('input[placeholder*="pickup"]');
    const isTrackingForm = form.querySelector('input[placeholder*="tracking"]');
    const isContactForm = form.querySelector('textarea');
    
    // Basic form validation
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    let errorMessages = [];
    
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        isValid = false;
        field.style.borderColor = 'var(--kenya-red)';
        field.style.backgroundColor = '#fee';
        errorMessages.push(`${field.previousElementSibling.textContent} is required`);
      } else {
        field.style.borderColor = 'var(--border-gray)';
        field.style.backgroundColor = 'var(--kenya-white)';
        
        // Validate email format
        if (field.type === 'email' && !isValidEmail(field.value)) {
          isValid = false;
          field.style.borderColor = 'var(--kenya-red)';
          field.style.backgroundColor = '#fee';
          errorMessages.push('Please enter a valid email address');
        }
        
        // Validate phone format (Kenyan numbers)
        if (field.type === 'tel' && !isValidKenyanPhone(field.value)) {
          isValid = false;
          field.style.borderColor = 'var(--kenya-red)';
          field.style.backgroundColor = '#fee';
          errorMessages.push('Please enter a valid Kenyan phone number (e.g., +254 700 000 000)');
        }
      }
    });
    
    if (isValid) {
      if (isBookingForm) {
        handleBookingSubmission(form);
      } else if (isTrackingForm) {
        handleTrackingSubmission(form);
      } else if (isContactForm) {
        handleContactSubmission(form);
      }
    } else {
      showNotification('Please correct the following errors:\n' + errorMessages.join('\n'), 'error');
    }
  });
});

/**
 * Handle booking form submission
 */
function handleBookingSubmission(form) {
  const formData = new FormData(form);
  const pickup = form.querySelector('input[placeholder*="pickup"]').value;
  const delivery = form.querySelector('input[placeholder*="delivery"]').value;
  const serviceType = form.querySelector('select').value;
  const weight = form.querySelector('input[type="number"]').value;
  
  // Calculate estimated price (simplified calculation)
  const estimatedPrice = calculateEstimatedPrice(pickup, delivery, serviceType, weight);
  
  showNotification(`Booking Request Submitted!
  
Route: ${pickup} → ${delivery}
Service: ${serviceType}
Weight: ${weight}kg
Estimated Cost: KES ${estimatedPrice.toLocaleString()}

Our team will contact you within 30 minutes to confirm pickup details.
Reference: SC${generateBookingReference()}`, 'success');
  
  form.reset();
}

/**
 * Handle tracking form submission
 */
function handleTrackingSubmission(form) {
  const trackingNumber = form.querySelector('input[placeholder*="tracking"]').value;
  const phoneNumber = form.querySelector('input[type="tel"]').value;
  
  // Simulate tracking lookup
  setTimeout(() => {
    const trackingResult = generateTrackingResult(trackingNumber);
    displayTrackingResult(trackingResult, form);
  }, 1000);
  
  showNotification('Looking up tracking information...', 'info');
}

/**
 * Handle contact form submission
 */
function handleContactSubmission(form) {
  showNotification(`Message Sent Successfully!

Thank you for contacting SwiftConnect Logistics. We have received your inquiry and will respond within 24 hours.

For urgent matters, please call:
+254 700 SWIFT (794338)`, 'success');
  
  form.reset();
}

/**
 * Calculate estimated price based on route and service
 */
function calculateEstimatedPrice(pickup, delivery, serviceType, weight) {
  let baseRate = 200; // Base rate in KES
  
  // Route-based pricing (simplified)
  const cityRoutes = {
    'nairobi': { 'mombasa': 250, 'kisumu': 200, 'eldoret': 220, 'nakuru': 180 },
    'mombasa': { 'nairobi': 250, 'other': 280 }
  };
  
  // Service type multiplier
  const serviceMultipliers = {
    'Standard Delivery': 1.0,
    'Express Delivery': 1.8,
    'Same-Day': 2.5,
    'Cargo Transport': 1.2
  };
  
  const multiplier = serviceMultipliers[serviceType] || 1.0;
  const weightMultiplier = Math.max(1, parseInt(weight) || 1);
  
  return Math.round(baseRate * multiplier * weightMultiplier);
}

/**
 * Generate booking reference number
 */
function generateBookingReference() {
  const date = new Date();
  const dateStr = date.toISOString().slice(2, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return dateStr + random;
}

/**
 * Generate mock tracking result
 */
function generateTrackingResult(trackingNumber) {
  const statuses = [
    { status: 'Package Received', location: 'Nairobi Hub', time: '2 hours ago' },
    { status: 'In Transit', location: 'Nakuru Sorting Center', time: '4 hours ago' },
    { status: 'Out for Delivery', location: 'Eldoret Hub', time: '30 minutes ago' }
  ];
  
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  
  return {
    trackingNumber: trackingNumber,
    status: randomStatus.status,
    location: randomStatus.location,
    lastUpdate: randomStatus.time,
    estimatedDelivery: 'Tomorrow, 2:00 PM'
  };
}

/**
 * Display tracking result
 */
function displayTrackingResult(result, form) {
  const resultDiv = form.parentElement.querySelector('.tracking-result') || 
                   form.parentElement.appendChild(document.createElement('div'));
  
  resultDiv.className = 'tracking-result';
  resultDiv.innerHTML = `
    <div style="margin-top: 24px; padding: 16px; background-color: var(--light-gray); border-radius: var(--radius-md); border-left: 4px solid var(--success-green);">
      <h4 style="font-size: var(--fs-8); margin-bottom: 12px; color: var(--kenya-black);">📦 Tracking Result:</h4>
      <p style="font-size: var(--fs-8); color: var(--text-gray); margin: 0;">
        <strong>${result.trackingNumber}</strong><br>
        Status: <span style="color: var(--success-green); font-weight: 600;">${result.status}</span><br>
        Location: ${result.location}<br>
        Last Update: ${result.lastUpdate}<br>
        Expected Delivery: <strong>${result.estimatedDelivery}</strong>
      </p>
    </div>
  `;
}

/**
 * Show notification messages
 */
function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    max-width: 400px;
    padding: 20px;
    border-radius: var(--radius-lg);
    color: var(--kenya-white);
    z-index: 2000;
    font-size: var(--fs-8);
    line-height: 1.5;
    white-space: pre-line;
    box-shadow: var(--shadow-lg);
    animation: slideInRight 0.3s ease;
  `;
  
  // Set background color based on type
  const colors = {
    success: 'var(--success-green)',
    error: 'var(--kenya-red)',
    info: 'var(--kenya-green)',
    warning: 'var(--warning-orange)'
  };
  
  notification.style.backgroundColor = colors[type] || colors.info;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Auto remove after 6 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }
  }, 6000);
  
  // Click to dismiss
  notification.addEventListener('click', () => {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  });
}

/**
 * Validate email format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate Kenyan phone number format
 */
function isValidKenyanPhone(phone) {
  // Accept formats: +254XXXXXXXXX, 254XXXXXXXXX, 07XXXXXXXX, 01XXXXXXXX
  const phoneRegex = /^(\+254|254|0)[17]\d{8}$/;
  const cleanPhone = phone.replace(/\s+/g, '');
  return phoneRegex.test(cleanPhone);
}

/**
 * Tracking number auto-suggestion
 */
document.addEventListener('DOMContentLoaded', function() {
  const trackingInputs = document.querySelectorAll('input[placeholder*="tracking"]');
  trackingInputs.forEach(input => {
    input.addEventListener('focus', function() {
      if (!this.value) {
        // Generate sample tracking number
        const prefix = 'SC';
        const date = new Date().toISOString().slice(2,10).replace(/-/g,'');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        this.placeholder = `e.g., ${prefix}${date}${random}`;
      }
    });
  });
});

/**
 * Service card hover effects
 */
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-8px)';
    this.style.boxShadow = 'var(--shadow-lg)';
  });
  
  card.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0)';
    this.style.boxShadow = 'var(--shadow-md)';
  });
});

/**
 * Pricing calculator
 */
function initializePricingCalculator() {
  const fromInput = document.querySelector('input[placeholder*="pickup"]');
  const toInput = document.querySelector('input[placeholder*="delivery"]');
  const serviceSelect = document.querySelector('select');
  const weightInput = document.querySelector('input[type="number"]');
  
  if (fromInput && toInput && serviceSelect && weightInput) {
    [fromInput, toInput, serviceSelect, weightInput].forEach(input => {
      input.addEventListener('input', updatePriceEstimate);
    });
  }
}

/**
 * Update price estimate in real-time
 */
function updatePriceEstimate() {
  const fromInput = document.querySelector('input[placeholder*="pickup"]');
  const toInput = document.querySelector('input[placeholder*="delivery"]');
  const serviceSelect = document.querySelector('select');
  const weightInput = document.querySelector('input[type="number"]');
  
  if (fromInput.value && toInput.value && weightInput.value) {
    const estimatedPrice = calculateEstimatedPrice(
      fromInput.value, 
      toInput.value, 
      serviceSelect.value, 
      weightInput.value
    );
    
    // Update button text with price estimate
    const submitBtn = document.querySelector('.btn-primary[style*="width: 100%"]');
    if (submitBtn && submitBtn.textContent.includes('Calculate')) {
      submitBtn.textContent = `Book Now - KES ${estimatedPrice.toLocaleString()}`;
    }
  }
}

/**
 * Initialize all interactive features
 */
document.addEventListener('DOMContentLoaded', function() {
  initializePricingCalculator();
  
  // Add loading states to buttons
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function() {
      if (this.type === 'submit') {
        const originalText = this.textContent;
        this.textContent = 'Processing...';
        this.disabled = true;
        
        setTimeout(() => {
          this.textContent = originalText;
          this.disabled = false;
        }, 2000);
      }
    });
  });
  
  // Animate statistics on scroll
  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const statsObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const statNumber = entry.target.querySelector('.stat-number');
        if (statNumber && !statNumber.hasAttribute('data-animated')) {
          animateNumber(statNumber);
          statNumber.setAttribute('data-animated', 'true');
        }
      }
    });
  }, observerOptions);
  
  document.querySelectorAll('.stat-item').forEach(item => {
    statsObserver.observe(item);
  });
  
  // Initialize testimonial rotation (if multiple testimonials)
  initializeTestimonialRotation();
  
  // Add scroll-to-top functionality
  addScrollToTop();
  
  // Initialize service area map interaction
  initializeServiceMap();
});

/**
 * Animate numbers counting up
 */
function animateNumber(element) {
  const finalNumber = element.textContent;
  const numericValue = parseInt(finalNumber.replace(/[^\d]/g, ''));
  const suffix = finalNumber.replace(/[\d]/g, '');
  
  if (!isNaN(numericValue)) {
    let currentNumber = 0;
    const increment = numericValue / 50;
    const timer = setInterval(() => {
      currentNumber += increment;
      if (currentNumber >= numericValue) {
        element.textContent = finalNumber;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(currentNumber) + suffix;
      }
    }, 30);
  }
}

/**
 * Initialize testimonial rotation
 */
function initializeTestimonialRotation() {
  const testimonials = document.querySelectorAll('.service-card p[style*="italic"]');
  if (testimonials.length > 3) {
    let currentIndex = 0;
    setInterval(() => {
      testimonials[currentIndex].parentElement.style.display = 'none';
      currentIndex = (currentIndex + 1) % testimonials.length;
      testimonials[currentIndex].parentElement.style.display = 'block';
    }, 5000);
  }
}

/**
 * Add scroll to top button
 */
function addScrollToTop() {
  const scrollButton = document.createElement('button');
  scrollButton.innerHTML = '↑';
  scrollButton.className = 'scroll-to-top';
  scrollButton.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: var(--kenya-red);
    color: var(--kenya-white);
    border: none;
    font-size: 20px;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: var(--transition-normal);
    z-index: 1000;
  `;
  
  document.body.appendChild(scrollButton);
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollButton.style.opacity = '1';
      scrollButton.style.visibility = 'visible';
    } else {
      scrollButton.style.opacity = '0';
      scrollButton.style.visibility = 'hidden';
    }
  });
  
  scrollButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/**
 * Initialize service area map interactions
 */
function initializeServiceMap() {
  const mapContainer = document.querySelector('div[style*="height: 300px"]');
  if (mapContainer) {
    mapContainer.style.cursor = 'pointer';
    mapContainer.addEventListener('click', function() {
      showNotification('Interactive map feature coming soon! Currently serving all 47 Kenyan counties with reliable delivery services.', 'info');
    });
  }
}

/**
 * Add CSS animations
 */
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
  
  @keyframes fadeInUp {
    from {
      transform: translateY(30px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  .service-card {
    animation: fadeInUp 0.6s ease-out;
  }
  
  .service-card:nth-child(2) {
    animation-delay: 0.1s;
  }
  
  .service-card:nth-child(3) {
    animation-delay: 0.2s;
  }
  
  .service-card:nth-child(4) {
    animation-delay: 0.3s;
  }
  
  .scroll-to-top:hover {
    background-color: var(--kenya-green) !important;
    transform: translateY(-2px);
  }
  
  .notification {
    cursor: pointer;
  }
  
  .notification::before {
    content: "✕";
    position: absolute;
    top: 8px;
    right: 12px;
    font-size: 12px;
    opacity: 0.7;
  }
  
  .form-input:invalid,
  .form-select:invalid,
  .form-textarea:invalid {
    border-color: var(--kenya-red);
  }
  
  .form-input:valid,
  .form-select:valid,
  .form-textarea:valid {
    border-color: var(--success-green);
  }
`;

document.head.appendChild(style);

/**
 * Add keyboard navigation support
 */
document.addEventListener('keydown', function(e) {
  // Escape key closes notifications and mobile menu
  if (e.key === 'Escape') {
    const notification = document.querySelector('.notification');
    if (notification) {
      notification.click();
    }
    
    const navbar = document.querySelector('.navbar');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (navbar && navbar.style.display === 'block') {
      navbar.style.display = 'none';
      if (mobileMenuBtn) mobileMenuBtn.textContent = '☰';
    }
  }
});

/**
 * Performance optimization - Lazy load images when they come into view
 */
const imageObserver = new IntersectionObserver(function(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    }
  });
});

// Observe all images with data-src attribute
document.querySelectorAll('img[data-src]').forEach(img => {
  imageObserver.observe(img);
});

console.log('SwiftConnect Logistics website loaded successfully! 🚛📦')
;
