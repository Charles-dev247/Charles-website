document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. Dark/Light Theme Switcher
    // ==========================================
    const htmlElement = document.documentElement;
    const themeToggleBtn = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');

    // Load theme from localStorage or default to system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

    const setTheme = (theme) => {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        if (theme === 'dark') {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        } else {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        }
    };

    setTheme(initialTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });

    // ==========================================
    // 2. Mobile Navigation Toggle
    // ==========================================
    const mobileToggleBtn = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const line1 = document.getElementById('line1');
    const line2 = document.getElementById('line2');
    const line3 = document.getElementById('line3');

    const toggleMenu = () => {
        navMenu.classList.toggle('active');
        const isActive = navMenu.classList.contains('active');
        
        // Hamburger SVG transformation to close cross
        if (isActive) {
            line1.setAttribute('transform', 'rotate(45 12 12)');
            line1.setAttribute('y1', '12');
            line1.setAttribute('y2', '12');
            line2.style.opacity = '0';
            line3.setAttribute('transform', 'rotate(-45 12 12)');
            line3.setAttribute('y1', '12');
            line3.setAttribute('y2', '12');
        } else {
            line1.removeAttribute('transform');
            line1.setAttribute('y1', '6');
            line1.setAttribute('y2', '6');
            line2.style.opacity = '1';
            line3.removeAttribute('transform');
            line3.setAttribute('y1', '18');
            line3.setAttribute('y2', '18');
        }
    };

    mobileToggleBtn.addEventListener('click', toggleMenu);

    // Close menu when a navigation link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // Close menu when clicking outside of it
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !mobileToggleBtn.contains(e.target) && navMenu.classList.contains('active')) {
            toggleMenu();
        }
    });

    // ==========================================
    // 3. Project Filter System
    // ==========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from other buttons and add to this one
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                // Reset card inline styles before transition
                card.style.transition = 'opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1), transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)';
                
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    // Timeout to let browser register display state block before changing opacity
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 20);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    
                    // Match timeout to transitions
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 250);
                }
            });
        });
    });

    // ==========================================
    // 4. Scroll Active Section Observer
    // ==========================================
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.35 // Trigger when 35% of the section is visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                navLinks.forEach(link => {
                    if (link.getAttribute('data-sec') === id) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, options);

    sections.forEach(section => {
        observer.observe(section);
    });

    // ==========================================
    // 5. Back to Top Button
    // ==========================================
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ==========================================
    // 6. Contact Form Submission Handling (to charles247chinedu@gmail.com)
    // ==========================================
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            const senderName = document.getElementById('name').value;
            
            // Animation state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending Message...';
            submitBtn.style.opacity = '0.7';
            formStatus.style.display = 'none';

            try {
                const formData = new FormData(contactForm);
                const response = await fetch('https://formsubmit.co/ajax/charles247chinedu@gmail.com', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json'
                    },
                    body: formData
                });

                const result = await response.json().catch(() => ({}));

                if (response.ok && result.success !== 'false') {
                    // Display success response
                    formStatus.className = 'form-status success';
                    formStatus.textContent = `Thank you, ${senderName}! Your message was successfully sent to Charles's inbox.`;
                    formStatus.style.display = 'block';
                    
                    // Clear inputs
                    contactForm.reset();
                } else {
                    throw new Error(result.message || 'Submission failed');
                }
            } catch (error) {
                // Display error response
                formStatus.className = 'form-status error';
                formStatus.textContent = 'Something went wrong. Please try again or email directly at charles247chinedu@gmail.com';
                formStatus.style.display = 'block';
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                submitBtn.style.opacity = '1';

                // Clear feedback status after 6 seconds
                setTimeout(() => {
                    formStatus.style.display = 'none';
                }, 6000);
            }
        });
    }
});
