document.addEventListener('DOMContentLoaded', function() {
    const viewport = document.getElementById('presentation-viewport');
    const slides = document.querySelectorAll('.slide');
    const sidebarItems = document.querySelectorAll('.sidebar-menu-item');
    const totalSlides = slides.length;
    let currentSlideIndex = 0;
    
    let autoplayInterval = null;
    let isAutoplayActive = false;
    const autoplayDuration = 20000; // 20 seconds per slide (fits 15-30s requirement)

    // DOM Controls
    const prevBtn = document.getElementById('slide-prev');
    const nextBtn = document.getElementById('slide-next');
    const playBtn = document.getElementById('slide-play');
    const playIcon = playBtn ? playBtn.querySelector('i') : null;
    const counterFill = document.getElementById('slide-counter-fill');
    const progressFill = document.getElementById('slide-progress-fill');
    const fullscreenBtn = document.getElementById('slide-fullscreen');
    const jumpSelect = document.getElementById('jump-to-slide');
    const slideSearch = document.getElementById('slide-search');
    
    // Top nav indicators
    const activeTitle = document.getElementById('active-slide-title');
    const activeBadge = document.getElementById('active-slide-badge');

    // 1. RESPONSIVE VIEWPORT ENGINE - Removed to support fluid 100vw/100vh CSS layout


    // 2. SLIDE NAVIGATION CONTROLLER
    function showSlide(index) {
        if (index < 0 || index >= totalSlides) return;
        currentSlideIndex = index;

        // Toggle slides active classes and animation
        slides.forEach((slide, idx) => {
            if (idx === currentSlideIndex) {
                slide.classList.add('active');
                // Alternating slide transitions for slides
                slide.className = 'slide active ' + (idx % 2 === 0 ? 'animate-fade' : 'animate-slide');
                
                // Update Top Navigation
                if (activeTitle) activeTitle.textContent = slide.getAttribute('data-title') || 'Overview';
                if (activeBadge) activeBadge.textContent = slide.getAttribute('data-badge') || 'Pro System';
            } else {
                slide.classList.remove('active');
                slide.className = 'slide';
            }
        });

        // Toggle Sidebar highlights
        sidebarItems.forEach((item, idx) => {
            if (idx === currentSlideIndex) {
                item.classList.add('active');
                // Scroll into sidebar view smoothly
                item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                item.classList.remove('active');
            }
        });

        // Update Bottom controls
        if (prevBtn) prevBtn.disabled = currentSlideIndex === 0;
        if (nextBtn) nextBtn.disabled = currentSlideIndex === totalSlides - 1;
        
        // Update Progress Bar
        if (progressFill) {
            const pct = ((currentSlideIndex + 1) / totalSlides) * 100;
            progressFill.style.width = `${pct}%`;
        }

        // Update Counter
        if (counterFill) {
            counterFill.textContent = `${currentSlideIndex + 1} / ${totalSlides}`;
        }

        // Sync Dropdown selector
        if (jumpSelect) {
            jumpSelect.value = currentSlideIndex.toString();
        }
    }

    function nextSlide() {
        if (currentSlideIndex < totalSlides - 1) {
            showSlide(currentSlideIndex + 1);
        } else if (isAutoplayActive) {
            showSlide(0); // Wrap around on autoplay
        }
    }

    function prevSlide() {
        if (currentSlideIndex > 0) {
            showSlide(currentSlideIndex - 1);
        }
    }

    // 3. AUTOPLAY SEQUENCE
    function toggleAutoplay() {
        if (isAutoplayActive) {
            clearInterval(autoplayInterval);
            isAutoplayActive = false;
            if (playIcon) playIcon.className = 'ri-play-fill';
            if (playBtn) playBtn.title = 'Start Autoplay';
        } else {
            isAutoplayActive = true;
            if (playIcon) playIcon.className = 'ri-pause-fill';
            if (playBtn) playBtn.title = 'Pause Autoplay';
            autoplayInterval = setInterval(nextSlide, autoplayDuration);
        }
    }

    // 4. SIDEBAR SEARCH FILTER
    if (slideSearch) {
        slideSearch.addEventListener('keyup', function() {
            const query = slideSearch.value.toLowerCase();
            sidebarItems.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (text.includes(query)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }

    // 5. SIDEBAR NAVIGATION CLICKS
    sidebarItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetSlide = parseInt(item.getAttribute('data-slide'));
            showSlide(targetSlide);
            // If autoplay is active, pause it to let user inspect
            if (isAutoplayActive) {
                toggleAutoplay();
            }
        });
    });

    // 6. BOTTOM CONTROL LISTENERS
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (playBtn) playBtn.addEventListener('click', toggleAutoplay);
    
    if (jumpSelect) {
        jumpSelect.addEventListener('change', function() {
            showSlide(parseInt(jumpSelect.value));
            if (isAutoplayActive) {
                toggleAutoplay();
            }
        });
    }

    // 7. KEYBOARD BINDINGS
    document.addEventListener('keydown', function(e) {
        // Prevent action if focused inside inputs or selects
        const activeNode = document.activeElement.tagName;
        if (activeNode === 'INPUT' || activeNode === 'TEXTAREA' || activeNode === 'SELECT') {
            return;
        }

        if (e.key === 'ArrowRight' || e.key === 'PageDown') {
            nextSlide();
        } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
            prevSlide();
        } else if (e.key === ' ') {
            e.preventDefault();
            toggleAutoplay();
        }
    });

    // 8. SWIPE GESTURES FOR MOBILE/IPAD
    let touchStartX = 0;
    let touchEndX = 0;
    
    viewport.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    viewport.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const threshold = 80;
        if (touchEndX < touchStartX - threshold) {
            nextSlide(); // swipe left
        } else if (touchEndX > touchStartX + threshold) {
            prevSlide(); // swipe right
        }
    }

    // 9. FULLSCREEN CONTROLLER
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', function() {
            if (!document.fullscreenElement) {
                // Request fullscreen on parent element to let scale adjustments work cleanly
                document.documentElement.requestFullscreen().catch(err => {
                    console.error(`Fullscreen request failed: ${err.message}`);
                });
            } else {
                document.exitFullscreen();
            }
        });

        document.addEventListener('fullscreenchange', function() {
            if (document.fullscreenElement) {
                fullscreenBtn.querySelector('i').className = 'ri-fullscreen-exit-fill';
            } else {
                fullscreenBtn.querySelector('i').className = 'ri-fullscreen-fill';
            }
        });
    }

    // Initialize slide deck state
    showSlide(0);
});
