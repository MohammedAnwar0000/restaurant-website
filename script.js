document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu elements
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links li');
    const navOverlay = document.createElement('div');
    navOverlay.className = 'nav-overlay';
    document.body.appendChild(navOverlay);
    let isMenuOpen = false;

    // Toggle menu function
    function toggleMenu(forceClose = false) {
        isMenuOpen = forceClose ? false : !isMenuOpen;
        
        // Toggle classes
        mobileMenuBtn.classList.toggle('active', isMenuOpen);
        navLinks.classList.toggle('active', isMenuOpen);
        navOverlay.classList.toggle('active', isMenuOpen);
        document.body.classList.toggle('menu-open', isMenuOpen);
        
        // Update aria attributes
        mobileMenuBtn.setAttribute('aria-expanded', isMenuOpen);
        
        // Animate menu items
        if (isMenuOpen) {
            navItems.forEach((item, index) => {
                item.style.animation = `fadeInRight 0.5s ease forwards ${index * 0.1}s`;
            });
        } else {
            navItems.forEach(item => {
                item.style.animation = 'none';
            });
        }
    }

    // Toggle menu on button click
    mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    // Close menu when clicking overlay
    navOverlay.addEventListener('click', () => toggleMenu(true));

    // Close menu when clicking a nav link
    navItems.forEach(link => {
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                toggleMenu(true);
            }
        });
    });

    // Handle window resize
    let resizeTimer;
    function handleResize() {
        if (window.innerWidth > 768 && isMenuOpen) {
            toggleMenu(true);
        }
    }
    
    // Throttle resize events
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(handleResize, 100);
    });

    // Close menu when pressing Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) {
            toggleMenu(true);
        }
    });

    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInRight {
            from {
                opacity: 0;
                transform: translateX(20px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
    `;
    document.head.appendChild(style);

    
    // Close mobile menu when clicking on a link
    navLinksItems.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
    
    // Sticky header on scroll
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        once: true,
        offset: 100,
        easing: 'ease-in-out',
    });
    
    // Add active class to current section in navigation
    const sections = document.querySelectorAll('section');
    
    function setActiveNavItem() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (window.pageYOffset >= sectionTop - 300) {
                current = section.getAttribute('id');
            }
        });
        
        navLinksItems.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', setActiveNavItem);
    
    // Form submission
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name')?.value.trim();
            const phone = document.getElementById('phone')?.value.trim();
            const pizzaType = document.getElementById('pizza-type')?.value;
            const size = document.querySelector('input[name="size"]:checked')?.value;
            const notes = document.getElementById('notes')?.value.trim();
            
            // Simple validation
            if (!name || !phone || !pizzaType || !size) {
                showAlert('الرجاء ملء جميع الحقول المطلوبة', 'error');
                return false;
            }
            
            // Phone number validation
            const phoneRegex = /^[0-9]{10,15}$/;
            if (!phoneRegex.test(phone)) {
                showAlert('الرجاء إدخال رقم هاتف صحيح', 'error');
                return false;
            }
            
            // If all validations pass, show success message
            showAlert('شكراً لطلبك! سنتواصل معك قريباً لتأكيد الطلب.', 'success');
            orderForm.reset();
        });
    }
    
    // Show alert message
    function showAlert(message, type = 'success') {
        // Remove any existing alerts
        const existingAlert = document.querySelector('.alert-message');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        // Create alert element
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert-message ${type}`;
        
        // Add icon based on type
        const icon = type === 'success' ? 'check-circle' : 'exclamation-circle';
        
        alertDiv.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
            <button class="close-btn">&times;</button>
        `;
        
        // Add to body
        document.body.appendChild(alertDiv);
        
        // Show alert
        setTimeout(() => {
            alertDiv.classList.add('show');
        }, 100);
        
        // Close button
        const closeBtn = alertDiv.querySelector('.close-btn');
        closeBtn.addEventListener('click', () => {
            alertDiv.classList.remove('show');
            setTimeout(() => {
                alertDiv.remove();
            }, 300);
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (alertDiv && alertDiv.parentNode) {
                alertDiv.classList.remove('show');
                setTimeout(() => {
                    if (alertDiv && alertDiv.parentNode) {
                        alertDiv.remove();
                    }
                }, 300);
            }
        }, 5000);
    }
    
    // Animate elements on scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('visible');
            }
        });
    };
    
    // Run once on page load
    animateOnScroll();
    
    // Run on scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Add to cart functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const pizzaName = this.getAttribute('data-name');
            const pizzaPrice = this.getAttribute('data-price');
            
            // In a real application, you would add the item to a shopping cart
            showAlert(`تمت إضافة ${pizzaName} إلى السلة`, 'success');
        });
    });
    
    // Initialize tooltips
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
    
    function showTooltip(e) {
        const tooltipText = this.getAttribute('data-tooltip');
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = tooltipText;
        
        document.body.appendChild(tooltip);
        
        const rect = this.getBoundingClientRect();
        const tooltipHeight = tooltip.offsetHeight;
        const tooltipWidth = tooltip.offsetWidth;
        
        // Position the tooltip above the element
        tooltip.style.top = `${rect.top - tooltipHeight - 10}px`;
        tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltipWidth / 2)}px`;
        
        // Add active class for animation
        setTimeout(() => {
            tooltip.classList.add('active');
        }, 10);
        
        // Store reference to remove later
        this.tooltip = tooltip;
    }
    
    function hideTooltip() {
        if (this.tooltip) {
            this.tooltip.remove();
            this.tooltip = null;
        }
    }
});
