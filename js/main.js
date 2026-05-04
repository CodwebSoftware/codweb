document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Hamburger Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const overlay = document.querySelector('.overlay');
    const body = document.body;

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            overlay.classList.toggle('active');
            body.classList.toggle('no-scroll');
            
            // Animate hamburger
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = mobileMenu.classList.contains('active') ? 'rotate(45deg) translate(6px, 6px)' : 'none';
            spans[1].style.opacity = mobileMenu.classList.contains('active') ? '0' : '1';
            spans[2].style.transform = mobileMenu.classList.contains('active') ? 'rotate(-45deg) translate(6px, -6px)' : 'none';
        });
    }

    if (overlay) {
        overlay.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            overlay.classList.remove('active');
            body.classList.remove('no-scroll');
            
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    }

    // 2. Header Scroll Effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 3. Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 4. Scroll-triggered Animations (IntersectionObserver)
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // 5. Services Tab Switcher
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.dataset.tab;
                
                tabBtns.forEach(b => b.classList.remove('active'));
                tabPanes.forEach(p => p.classList.remove('active'));
                
                btn.classList.add('active');
                document.getElementById(target).classList.add('active');
            });
        });
    }

    // 6. Pricing Toggle
    const priceToggle = document.getElementById('price-toggle');
    if (priceToggle) {
        priceToggle.addEventListener('change', () => {
            const isAnnual = priceToggle.checked;
            const amounts = document.querySelectorAll('.amount');
            const periods = document.querySelectorAll('.period');
            
            amounts.forEach(amount => {
                const monthly = parseInt(amount.dataset.monthly);
                const annual = parseInt(amount.dataset.annual);
                
                if (isAnnual) {
                    // Start count animation
                    animateValue(amount, monthly, annual, 500);
                } else {
                    animateValue(amount, annual, monthly, 500);
                }
            });
            
            periods.forEach(period => {
                period.textContent = isAnnual ? '/year' : '/month';
            });
        });
    }

    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // 7. Portfolio Filter
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                portfolioItems.forEach(item => {
                    if (filter === 'all' || item.dataset.category === filter) {
                        item.style.display = 'block';
                        setTimeout(() => item.style.opacity = '1', 10);
                    } else {
                        item.style.opacity = '0';
                        setTimeout(() => item.style.display = 'none', 300);
                    }
                });
            });
        });
    }

    // 8. FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other items
                faqItems.forEach(i => i.classList.remove('active'));
                
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    }

    // 9. Contact Form Validation
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simple validation
            let isValid = true;
            const inputs = contactForm.querySelectorAll('input[required], select[required], textarea[required]');
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = 'red';
                } else {
                    input.style.borderColor = 'var(--border)';
                }
            });
            
            if (isValid) {
                const btn = contactForm.querySelector('button');
                const originalText = btn.innerHTML;
                btn.innerHTML = 'Sending...';
                btn.disabled = true;
                
                setTimeout(() => {
                    btn.innerHTML = 'Message Sent!';
                    btn.style.backgroundColor = 'var(--accent)';
                    contactForm.reset();
                    
                    setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.style.backgroundColor = 'var(--primary)';
                        btn.disabled = false;
                    }, 3000);
                }, 1500);
            }
        });
    }


    // 10. WhatsApp Chat Link
    // Handled via standard <a> tag with wa.me link

    // 11. Google Maps Store Locator Initialization
    if (document.querySelector('gmpx-store-locator')) {
        (async () => {
            await customElements.whenDefined('gmpx-store-locator');
            const locator = document.querySelector('gmpx-store-locator');
            if (typeof CONFIGURATION !== 'undefined') {
                locator.configureFromQuickBuilder(CONFIGURATION);
            }
        })();
    }
});
