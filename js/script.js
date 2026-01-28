// Custom JavaScript for Sultan Ipinmisho Portfolio

document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link.smooth-scroll, .btn.smooth-scroll, a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const navbarHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = targetElement.offsetTop - navbarHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    const navbarCollapse = document.querySelector('.navbar-collapse');
                    if (navbarCollapse.classList.contains('show')) {
                        const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                        bsCollapse.hide();
                    }
                }
            }
        });
    });
    
    // Navbar background change on scroll
    const navbar = document.querySelector('.custom-navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.backgroundColor = 'rgba(10, 25, 47, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.backgroundColor = 'rgba(10, 25, 47, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
    
    // Active navigation link highlighting
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', function() {
        let current = '';
        const scrollPos = window.scrollY + 200;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Add animation classes based on element type
                if (element.classList.contains('skills-card')) {
                    element.style.animationDelay = `${Math.random() * 0.5}s`;
                    element.classList.add('fade-in');
                } else if (element.classList.contains('service-card')) {
                    element.style.animationDelay = `${Math.random() * 0.3}s`;
                    element.classList.add('fade-in');
                } else if (element.classList.contains('project-card')) {
                    element.style.animationDelay = `${Math.random() * 0.2}s`;
                    element.classList.add('fade-in');
                } else {
                    element.classList.add('fade-in');
                }
                
                observer.unobserve(element);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.skills-card, .service-card, .project-card, .contact-info');
    animateElements.forEach(element => {
        observer.observe(element);
    });
    
    // Image loading animation
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.classList.add('loaded');
        });
        
        // If image is already loaded
        if (img.complete) {
            img.classList.add('loaded');
        }
    });
    
    // Typing animation for hero section
    const heroTitle = document.querySelector('.hero-section h1');
    const heroSubtitle = document.querySelector('.hero-section h2');
    
    if (heroTitle && heroSubtitle) {
        // Add typing effect classes
        heroTitle.style.overflow = 'hidden';
        heroTitle.style.whiteSpace = 'nowrap';
        heroTitle.style.borderRight = '3px solid var(--accent-color)';
        heroTitle.style.animation = 'typing 3s steps(40, end), blink-caret 0.75s step-end infinite';
        
        // Add CSS for typing animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes typing {
                from { width: 0 }
                to { width: 100% }
            }
            
            @keyframes blink-caret {
                from, to { border-color: transparent }
                50% { border-color: var(--accent-color) }
            }
        `;
        document.head.appendChild(style);
        
        // Remove cursor after animation
        setTimeout(() => {
            heroTitle.style.borderRight = 'none';
        }, 4000);
    }
    
    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroSection = document.querySelector('.hero-section');
        
        if (heroSection) {
            const rate = scrolled * -0.5;
            heroSection.style.transform = `translateY(${rate}px)`;
        }
    });
    
    // Project modal enhancements
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Modal image gallery functionality
    const modals = document.querySelectorAll('.modal');
    
    modals.forEach(modal => {
        modal.addEventListener('shown.bs.modal', function() {
            // Add fade-in animation to modal content
            const modalContent = this.querySelector('.modal-content');
            modalContent.style.animation = 'fadeIn 0.5s ease-out';
        });
    });
    
    // Contact section hover effects
    const contactCards = document.querySelectorAll('.contact-info');
    
    contactCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.contact-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.contact-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
    
    // Social media hover effects
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.1)';
            this.style.boxShadow = '0 10px 20px rgba(100, 255, 218, 0.3)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = 'none';
        });
    });
    
    // Skills card animation on scroll
    const skillsCard = document.querySelector('.skills-card');
    
    if (skillsCard) {
        const skillsObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    
                    // Animate all skill bars within the card
                    const skillProgresses = entry.target.querySelectorAll('.skill-progress');
                    skillProgresses.forEach((skillProgress, index) => {
                        const targetWidth = skillProgress.getAttribute('data-width');
                        setTimeout(() => {
                            skillProgress.style.width = targetWidth;
                        }, 300 + (index * 200));
                    });
                }
            });
        }, { threshold: 0.1 });
        
        skillsCard.style.opacity = '0';
        skillsCard.style.transform = 'translateY(30px)';
        skillsCard.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        skillsObserver.observe(skillsCard);
    }
    
    // Service cards staggered animation
    const serviceCards = document.querySelectorAll('.service-card');
    
    const serviceObserver = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 150);
            }
        });
    }, { threshold: 0.1 });
    
    serviceCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(40px)';
        card.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        serviceObserver.observe(card);
    });
    
    // Preloader (if needed)
    window.addEventListener('load', function() {
        // Hide any loading animations
        document.body.classList.add('loaded');
        
        // Initialize any final animations
        setTimeout(() => {
            const heroElements = document.querySelectorAll('.hero-section .fade-in');
            heroElements.forEach((element, index) => {
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, index * 200);
            });
        }, 500);
    });
    
    // Error handling for external links
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    
    externalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Add click tracking or analytics here if needed
            console.log(`External link clicked: ${this.href}`);
        });
    });
    
    // Keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // Escape key to close modals
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal.show');
            if (openModal) {
                const modal = bootstrap.Modal.getInstance(openModal);
                if (modal) {
                    modal.hide();
                }
            }
        }
    });
    
    // Mobile menu improvements
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', function() {
            // Add animation class to mobile menu
            setTimeout(() => {
                if (navbarCollapse.classList.contains('show')) {
                    navbarCollapse.style.animation = 'slideInRight 0.3s ease-out';
                }
            }, 10);
        });
    }
});

// Additional utility functions
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Optimized scroll handler
const optimizedScrollHandler = debounce(function() {
    // Add any performance-sensitive scroll operations here
}, 10);

window.addEventListener('scroll', optimizedScrollHandler);

// Browser compatibility checks
function checkBrowserSupport() {
    // Check for modern features
    const hasIntersectionObserver = 'IntersectionObserver' in window;
    const hasCustomProperties = CSS.supports('color', 'var(--test)');
    
    if (!hasIntersectionObserver) {
        console.warn('IntersectionObserver not supported, falling back to scroll events');
        // Implement fallback for scroll animations
    }
    
    if (!hasCustomProperties) {
        console.warn('CSS custom properties not fully supported');
        // Implement fallback styles
    }
}

checkBrowserSupport();
