/**
 * VAZKON - Premium Engineering Website
 * JavaScript Principal
 */

(function() {
    'use strict';

    // ==========================================
    // LOADER
    // ==========================================
    const loader = document.getElementById('loader');

    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.classList.remove('no-scroll');
            initAnimations();
        }, 400);
    });

    // ==========================================
    // CUSTOM CURSOR
    // ==========================================
    const cursor = document.getElementById('cursor');
    const cursorFollower = document.getElementById('cursorFollower');

    if (cursor && cursorFollower && window.matchMedia('(hover: hover)').matches) {
        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;
        let followerX = 0;
        let followerY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            // Cursor principal - movimiento directo
            cursorX += (mouseX - cursorX) * 0.2;
            cursorY += (mouseY - cursorY) * 0.2;
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';

            // Follower - movimiento con delay
            followerX += (mouseX - followerX) * 0.1;
            followerY += (mouseY - followerY) * 0.1;
            cursorFollower.style.left = followerX + 'px';
            cursorFollower.style.top = followerY + 'px';

            requestAnimationFrame(animateCursor);
        }

        animateCursor();

        // Hover effects
        const hoverElements = document.querySelectorAll('a, button, .btn, .project, .solution, .capability');

        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
                cursorFollower.classList.add('hover');
            });

            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
                cursorFollower.classList.remove('hover');
            });
        });

        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
            cursorFollower.style.opacity = '0';
        });

        document.addEventListener('mouseenter', () => {
            cursor.style.opacity = '1';
            cursorFollower.style.opacity = '1';
        });
    }

    // ==========================================
    // HEADER
    // ==========================================
    const header = document.getElementById('header');
    let lastScroll = 0;

    function handleScroll() {
        const currentScroll = window.scrollY;

        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    // ==========================================
    // MOBILE MENU
    // ==========================================
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-menu__link');

    if (navToggle && mobileMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });

        // Close with Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                navToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    }

    // ==========================================
    // SMOOTH SCROLL
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();

            const headerHeight = header ? header.offsetHeight : 0;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });

    // ==========================================
    // REVEAL ANIMATIONS
    // ==========================================
    function initAnimations() {
        const revealElements = document.querySelectorAll('.reveal-up, .reveal-scale, .reveal-text');

        if (!revealElements.length) return;

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -80px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, delay * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        revealElements.forEach(el => observer.observe(el));
    }

    // ==========================================
    // METRICS COUNTER
    // ==========================================
    function initCounters() {
        const metrics = document.querySelectorAll('.metric__value');

        if (!metrics.length) return;

        const observerOptions = {
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateValue(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        metrics.forEach(metric => observer.observe(metric));
    }

    function animateValue(element) {
        const text = element.textContent;
        const hasPlus = text.includes('+');
        const hasK = text.includes('K');

        let target = parseInt(text.replace(/[^0-9]/g, ''));

        if (hasK) {
            // Para valores como "150K", animamos hasta 150
            target = parseInt(text.replace('K', '').replace('+', ''));
        }

        const duration = 2000;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(target * easeOut);

            let displayValue = current.toString();
            if (hasK) displayValue += 'K';
            if (hasPlus) displayValue = '+' + displayValue;

            element.textContent = displayValue;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    // ==========================================
    // PARALLAX EFFECTS
    // ==========================================
    function initParallax() {
        const heroGrid = document.querySelector('.hero__grid');

        if (!heroGrid || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                heroGrid.style.transform = `translateY(${scrolled * 0.3}px)`;
            }
        }, { passive: true });
    }

    // ==========================================
    // CONTACT FORM
    // ==========================================
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('.form-submit');
            const originalText = submitBtn.querySelector('.submit__text').textContent;

            // Disable and show loading
            submitBtn.disabled = true;
            submitBtn.querySelector('.submit__text').textContent = 'Enviando...';

            try {
                // Simulate form submission
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Show success
                showNotification('Mensaje enviado correctamente. Nos pondremos en contacto pronto.', 'success');
                contactForm.reset();

            } catch (error) {
                showNotification('Error al enviar el mensaje. Por favor intente de nuevo.', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.querySelector('.submit__text').textContent = originalText;
            }
        });
    }

    function showNotification(message, type) {
        // Remove existing notification
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <span class="notification__text">${message}</span>
            <button class="notification__close" aria-label="Cerrar">
                <svg viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="1.5"/>
                </svg>
            </button>
        `;

        // Styles
        Object.assign(notification.style, {
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            padding: '1rem 1.5rem',
            background: type === 'success' ? '#1a1a1a' : '#8b0000',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            fontSize: '0.875rem',
            zIndex: '9999',
            transform: 'translateY(100px)',
            opacity: '0',
            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
        });

        const closeBtn = notification.querySelector('.notification__close');
        Object.assign(closeBtn.style, {
            background: 'none',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            padding: '0.25rem'
        });
        closeBtn.querySelector('svg').style.width = '16px';
        closeBtn.querySelector('svg').style.height = '16px';

        document.body.appendChild(notification);

        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateY(0)';
            notification.style.opacity = '1';
        });

        // Close handlers
        closeBtn.addEventListener('click', () => removeNotification(notification));
        setTimeout(() => removeNotification(notification), 5000);
    }

    function removeNotification(notification) {
        notification.style.transform = 'translateY(100px)';
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 400);
    }

    // ==========================================
    // SOLUTION CARDS HOVER
    // ==========================================
    function initSolutionHover() {
        const solutions = document.querySelectorAll('.solution');

        solutions.forEach(solution => {
            const image = solution.querySelector('.solution__image');

            if (!image) return;

            solution.addEventListener('mouseenter', () => {
                image.style.transform = 'scale(1.05)';
            });

            solution.addEventListener('mouseleave', () => {
                image.style.transform = 'scale(1)';
            });
        });
    }

    // ==========================================
    // PROJECT CARDS
    // ==========================================
    function initProjectCards() {
        const projects = document.querySelectorAll('.project');

        projects.forEach(project => {
            const image = project.querySelector('.project__image');

            if (!image) return;

            project.addEventListener('mouseenter', () => {
                const placeholder = image.querySelector('.project__placeholder');
                if (placeholder) {
                    placeholder.style.transform = 'scale(1.1)';
                    placeholder.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
                }
            });

            project.addEventListener('mouseleave', () => {
                const placeholder = image.querySelector('.project__placeholder');
                if (placeholder) {
                    placeholder.style.transform = 'scale(1)';
                }
            });
        });
    }

    // ==========================================
    // MAGNETIC BUTTONS
    // ==========================================
    function initMagneticButtons() {
        if (window.matchMedia('(hover: none)').matches) return;

        const buttons = document.querySelectorAll('.btn, .header__cta, .form-submit');

        buttons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0)';
            });
        });
    }

    // ==========================================
    // TEXT SPLIT ANIMATION
    // ==========================================
    function initTextSplit() {
        const titles = document.querySelectorAll('.hero__title .title__word');

        titles.forEach((word, index) => {
            word.style.animationDelay = `${0.3 + index * 0.15}s`;
        });
    }

    // ==========================================
    // LAZY LOAD IMAGES (preparado para imágenes reales)
    // ==========================================
    function initLazyLoad() {
        const images = document.querySelectorAll('img[data-src]');

        if (!images.length) return;

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });

        images.forEach(img => imageObserver.observe(img));
    }

    // ==========================================
    // SMOOTH SECTION TRANSITIONS
    // ==========================================
    function initSectionTransitions() {
        const sections = document.querySelectorAll('section');

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('section--visible');
                }
            });
        }, {
            threshold: 0.1
        });

        sections.forEach(section => sectionObserver.observe(section));
    }

    // ==========================================
    // KEYBOARD NAVIGATION
    // ==========================================
    function initKeyboardNav() {
        document.addEventListener('keydown', (e) => {
            // Focus visible styles
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-nav');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-nav');
        });
    }

    // ==========================================
    // INIT ALL
    // ==========================================
    function init() {
        initCounters();
        initParallax();
        initSolutionHover();
        initProjectCards();
        initMagneticButtons();
        initTextSplit();
        initLazyLoad();
        initSectionTransitions();
        initKeyboardNav();
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ==========================================
    // EXPERTISE SLIDESHOW
    // ==========================================
    function initExpertiseSlideshow() {
        const slideshow = document.querySelector('.expertise__slideshow');
        if (!slideshow) return;

        const slides = slideshow.querySelectorAll('.expertise__slide');
        if (slides.length <= 1) return;

        let current = 0;

        setInterval(() => {
            slides[current].classList.remove('expertise__slide--active');
            current = (current + 1) % slides.length;
            slides[current].classList.add('expertise__slide--active');
        }, 3500);
    }

    initExpertiseSlideshow();

    // ==========================================
    // PROJECT SLIDESHOW
    // ==========================================
    function initSlideshows() {
        document.querySelectorAll('.project__slideshow').forEach(slideshow => {
            const slides = slideshow.querySelectorAll('.project__slide');
            if (slides.length <= 1) return;

            let current = 0;

            setInterval(() => {
                slides[current].classList.remove('project__slide--active');
                current = (current + 1) % slides.length;
                slides[current].classList.add('project__slide--active');
            }, 4000);
        });
    }

    initSlideshows();

    // ==========================================
    // PERFORMANCE MONITORING (Development)
    // ==========================================
    if (process?.env?.NODE_ENV === 'development') {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page Load Time:', perfData.loadEventEnd - perfData.startTime, 'ms');
            }, 0);
        });
    }

})();
