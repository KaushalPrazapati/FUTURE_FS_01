// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functions
    initTheme();
    initNavigation();
    initProgressBars();
    initProjectAnimation();
    initContactForm();
    initSmoothScrolling();
    
    console.log('Portfolio loaded successfully! 🚀');
});

// Theme Toggle Functionality
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    
    const themeIcon = themeToggle.querySelector('i');
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        setTheme('dark', themeIcon);
    }
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme, themeIcon);
    });
}

function setTheme(theme, iconElement) {
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        iconElement.classList.replace('fa-moon', 'fa-sun');
    } else {
        document.documentElement.removeAttribute('data-theme');
        iconElement.classList.replace('fa-sun', 'fa-moon');
    }
    localStorage.setItem('theme', theme);
}

// Navigation
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (!hamburger || !navLinks) return;
    
    const toggleMenu = () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
    };
    
    hamburger.addEventListener('click', toggleMenu);
    
    // Close menu when clicking on links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-container') && navLinks.classList.contains('active')) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

// Progress bar animation
function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar');
    
    progressBars.forEach(bar => {
        const width = bar.getAttribute('data-width') || '0%';
        bar.style.width = width;
    });
}

// Project card animation on scroll
function initProjectAnimation() {
    const projectCards = document.querySelectorAll('.project-card');
    if (projectCards.length === 0) return;
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    projectCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Form validation and submission
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault(); 
        
        const name = this.querySelector('input[name="name"]').value.trim();
        const email = this.querySelector('input[name="email"]').value.trim();
        const subject = this.querySelector('input[name="subject"]').value.trim();
        const message = this.querySelector('textarea[name="message"]').value.trim();
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Validation
        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        try {
            // Send to backend
            const response = await fetch('http://localhost:5000/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, subject, message })
            });
            
            const result = await response.json();
            
            if (result.success) {
                showNotification('Message sent successfully!', 'success');
                this.reset();
            } else {
                showNotification('Failed to send message.', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('Network error. Please try again.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '#!') return;
            
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 100;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update URL without adding to history
                history.replaceState(null, null, targetId);
            }
        });
    });
}

// Notification system
function showNotification(message, type = 'success') {
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(notification => {
        notification.remove();
    });
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.setAttribute('role', 'alert');
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
        <button aria-label="Close notification">
            <i class="fas fa-times"></i>
        </button>
    `;
    

    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 10px;
                display: flex;
                align-items: center;
                gap: 10px;
                z-index: 10000;
                max-width: 400px;
                animation: slideIn 0.3s ease;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                font-weight: 500;
            }
            
            .notification.success {
                background: #4caf50;
                color: white;
            }
            
            .notification.error {
                background: #f44336;
                color: white;
            }
            
            .notification button {
                background: none;
                border: none;
                color: inherit;
                cursor: pointer;
                margin-left: 10px;
                display: flex;
                align-items: center;
            }
            
            @keyframes slideIn {
                from { 
                    transform: translateX(100px); 
                    opacity: 0; 
                }
                to { 
                    transform: translateX(0); 
                    opacity: 1; 
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add close functionality
    const closeBtn = notification.querySelector('button');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Initialize animations when page loads
window.addEventListener('load', function() {
    // Animate progress bars with delay
    const progressBars = document.querySelectorAll('.progress-bar');
    progressBars.forEach((bar, index) => {
        setTimeout(() => {
            bar.style.width = bar.getAttribute('data-width') || '0%';
        }, index * 200);
    });
    
    // Add loaded class for any post-load animations
    document.body.classList.add('loaded');
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        document.body.classList.add('loaded');
    }
});

// Error handling for images
document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        e.target.style.display = 'none';
        console.warn('Image failed to load:', e.target.src);
    }
}, true);

// Image loading handler
function handleImageLoading() {
    const projectImages = document.querySelectorAll('.project-image img');
    
    projectImages.forEach(img => {
        // Check if image loaded successfully
        if (img.complete && img.naturalHeight !== 0) {
            img.classList.add('loaded');
        } else {
            // If image fails to load
            img.style.display = 'none';
            const projectCard = img.closest('.project-image');
            const projectName = projectCard.closest('.project-card').querySelector('h3').textContent;
            
            projectCard.classList.add('fallback');
            projectCard.setAttribute('data-project-name', projectName);
            
            // Add icon based on project type
            const icon = document.createElement('i');
            if (projectName.includes('SkillCraft')) {
                icon.className = 'fas fa-graduation-cap';
            } else if (projectName.includes('TimeFlow')) {
                icon.className = 'fas fa-stopwatch';
            } else {
                icon.className = 'fas fa-briefcase';
            }
            
            projectCard.appendChild(icon);
        }
        
        // Load event listener
        img.addEventListener('load', function() {
            this.classList.add('loaded');
        });
        
        // Error event listener
        img.addEventListener('error', function() {
            this.style.display = 'none';
            const projectCard = this.closest('.project-image');
            const projectName = projectCard.closest('.project-card').querySelector('h3').textContent;
            
            projectCard.classList.add('fallback');
            projectCard.setAttribute('data-project-name', projectName);
            
            // Add appropriate icon
            const icon = document.createElement('i');
            if (projectName.includes('SkillCraft')) {
                icon.className = 'fas fa-graduation-cap';
            } else if (projectName.includes('TimeFlow')) {
                icon.className = 'fas fa-stopwatch';
            } else {
                icon.className = 'fas fa-briefcase';
            }
            
            projectCard.appendChild(icon);
        });
    });
}

// Initialize image loading
document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...
    handleImageLoading();
});

