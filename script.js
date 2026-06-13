/* ==========================================================================
   HamzaDevLog Custom JavaScript
   ========================================================================== */

$(document).ready(function() {
    
    // ==========================================
    // 1. Theme Toggle Management
    // ==========================================
    const themeBtn = $('#theme-btn');
    const darkIcon = $('.theme-icon-dark');
    const lightIcon = $('.theme-icon-light');

    // Retrieve saved theme preference or default to dark
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    
    if (savedTheme === 'light') {
        $('body').removeClass('dark-theme').addClass('light-theme');
        darkIcon.addClass('d-none');
        lightIcon.removeClass('d-none');
    } else {
        $('body').removeClass('light-theme').addClass('dark-theme');
        lightIcon.addClass('d-none');
        darkIcon.removeClass('d-none');
    }

    // Toggle theme on button click
    themeBtn.on('click', function() {
        if ($('body').hasClass('dark-theme')) {
            $('body').removeClass('dark-theme').addClass('light-theme');
            darkIcon.addClass('d-none');
            lightIcon.removeClass('d-none');
            localStorage.setItem('portfolio-theme', 'light');
        } else {
            $('body').removeClass('light-theme').addClass('dark-theme');
            lightIcon.addClass('d-none');
            darkIcon.removeClass('d-none');
            localStorage.setItem('portfolio-theme', 'dark');
        }
    });

    // ==========================================
    // 2. Interactive Canvas Antigravity 3D Particle Sphere Background
    // ==========================================
    const canvas = document.getElementById('interactive-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        
        let mouse = { x: null, y: null };
        let targetAngleX = 0;
        let targetAngleY = 0;
        let angleX = 0;
        let angleY = 0;
        let particles = [];
        const numParticles = 1800; // Ultra high density 3D globe

        // Track cursor coordinates - only interact on empty space (not over cards or controls)
        window.addEventListener('mousemove', function(event) {
            const $target = $(event.target);
            const isOnBox = $target.closest('.about-profile-card, .skill-card, .resume-info-card, .timeline-card-item, .cert-card, .portfolio-card, .service-card, .testimonial-card, .contact-info-wrapper-v2, .contact-form-wrapper-v2, .navbar-wrapper, footer, .modal').length > 0 || 
                            event.target.tagName === 'A' || 
                            event.target.tagName === 'BUTTON' || 
                            event.target.tagName === 'INPUT' || 
                            event.target.tagName === 'TEXTAREA' || 
                            event.target.tagName === 'I';

            if (isOnBox) {
                mouse.x = null;
                mouse.y = null;
                targetAngleX = 0;
                targetAngleY = 0;
            } else {
                mouse.x = event.clientX;
                mouse.y = event.clientY;
                
                // Set rotation angles based on cursor offset from screen center
                targetAngleY = (event.clientX - canvas.width / 2) * 0.0025;
                targetAngleX = -(event.clientY - canvas.height / 2) * 0.0025;
            }
        });

        window.addEventListener('mouseout', function() {
            mouse.x = null;
            mouse.y = null;
            // When mouse leaves, let it auto-rotate slowly
            targetAngleX = 0;
            targetAngleY = 0;
        });

        // Resize Canvas to fit screen
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        }
        window.addEventListener('resize', resizeCanvas);

        // Generate points uniformly on a 3D Sphere surface
        function initParticles() {
            particles = [];
            const radius = Math.min(canvas.width, canvas.height) * 0.38; // Radius of 3D globe

            for (let i = 0; i < numParticles; i++) {
                // Spherical coordinates distribution (Archimedes/Lambert method)
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos((Math.random() * 2) - 1);
                
                const x = radius * Math.sin(phi) * Math.cos(theta);
                const y = radius * Math.sin(phi) * Math.sin(theta);
                const z = radius * Math.cos(phi);

                particles.push({
                    x: x,
                    y: y,
                    z: z,
                    size: Math.random() * 0.8 + 0.5, // Tiny dust particles
                    opacity: Math.random() * 0.4 + 0.4
                });
            }
        }

        // Color interpolation cross width
        function getGlobeColor(x, isDark) {
            const ratio = Math.max(0, Math.min(1, x / canvas.width));
            let r, g, b;
            
            if (isDark) {
                // Dark theme: Vivid Pink -> Indigo -> Blue (rgba colors)
                if (ratio < 0.5) {
                    const localRatio = ratio * 2;
                    r = Math.floor(219 + (99 - 219) * localRatio);
                    g = Math.floor(39 + (102 - 39) * localRatio);
                    b = Math.floor(119 + (241 - 119) * localRatio);
                } else {
                    const localRatio = (ratio - 0.5) * 2;
                    r = Math.floor(99 + (37 - 99) * localRatio);
                    g = Math.floor(102 + (99 - 102) * localRatio);
                    b = Math.floor(241 + (235 - 241) * localRatio);
                }
                return `rgba(${r}, ${g}, ${b}, `;
            } else {
                // Light theme ("a bitter dark"): Deep Magenta -> Deep Violet -> Deep Blue
                if (ratio < 0.5) {
                    const localRatio = ratio * 2;
                    r = Math.floor(112 + (76 - 112) * localRatio);
                    g = Math.floor(26 + (29 - 26) * localRatio);
                    b = Math.floor(117 + (149 - 117) * localRatio);
                } else {
                    const localRatio = (ratio - 0.5) * 2;
                    r = Math.floor(76 + (30 - 76) * localRatio);
                    g = Math.floor(29 + (58 - 29) * localRatio);
                    b = Math.floor(149 + (138 - 149) * localRatio);
                }
                return `rgba(${r}, ${g}, ${b}, `;
            }
        }

        // Animation loop
        let autoAngleX = 0;
        let autoAngleY = 0;

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Auto-rotation increment for drift
            autoAngleY += 0.0015;
            autoAngleX += 0.0008;

            // Interpolate toward mouse rotation targets
            angleY += (targetAngleY - angleY) * 0.05;
            angleX += (targetAngleX - angleX) * 0.05;

            // Total rotation angle
            const totalAngleY = angleY + autoAngleY;
            const totalAngleX = angleX + autoAngleX;

            const isDark = $('body').hasClass('dark-theme');
            const fov = 400; // 3D perspective field of view

            // Loop and project particles
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                // 3D Rotations
                // Rotate around Y axis
                let x1 = p.x * Math.cos(totalAngleY) - p.z * Math.sin(totalAngleY);
                let z1 = p.x * Math.sin(totalAngleY) + p.z * Math.cos(totalAngleY);

                // Rotate around X axis
                let y2 = p.y * Math.cos(totalAngleX) - z1 * Math.sin(totalAngleX);
                let z2 = p.y * Math.sin(totalAngleX) + z1 * Math.cos(totalAngleX);

                // Perspective projection centering on screen
                const scale = fov / (fov + z2);
                let projX = (canvas.width / 2) + x1 * scale;
                let projY = (canvas.height / 2) + y2 * scale;

                // Mouse deflection: push particles away from cursor on screen space
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - projX;
                    const dy = mouse.y - projY;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const pushRadius = 130;

                    if (dist < pushRadius) {
                        const force = (pushRadius - dist) / pushRadius;
                        projX -= dx * force * 0.3;
                        projY -= dy * force * 0.3;
                    }
                }

                // Render particle with depth scaling (closer particles are larger/opaque)
                const opacity = ((fov - z2) / (fov * 2)) * p.opacity;
                
                // Color is mapped dynamically based on projected X coordinate
                const colorPrefix = getGlobeColor(projX, isDark);
                
                ctx.beginPath();
                ctx.arc(projX, projY, p.size * scale, 0, Math.PI * 2);
                ctx.fillStyle = colorPrefix + opacity + ')';
                ctx.fill();
            }

            requestAnimationFrame(animate);
        }

        resizeCanvas();
        animate();
    }

    // ==========================================
    // 3. Fallback Layout for Missing Images
    // ==========================================
    // If image loads successfully, hide its placeholder and show the image
    $('img').on('load', function() {
        const $el = $(this);
        $el.removeClass('d-none');
        $el.siblings('.project-image-placeholder').addClass('d-none');
        $el.siblings('.cert-placeholder').addClass('d-none');
        
        // Special check for profile fallback
        if ($el.hasClass('profile-fallback')) {
            $el.parent().removeClass('profile-fallback-failed');
            $el.parent().find('.profile-monogram').remove();
        }
        
        // Testimonial author image
        if ($el.parent().hasClass('author-avatar-wrapper')) {
            $el.siblings('.author-fallback').addClass('d-none');
        }
    });

    // Register failure callback to swap placeholders
    $('img').on('error', function() {
        const $el = $(this);
        
        // Mark as hidden
        $el.addClass('d-none');
        
        // Show relative text/icon fallback elements
        $el.siblings('.project-image-placeholder').removeClass('d-none');
        $el.siblings('.cert-placeholder').removeClass('d-none');
        
        // Hero image profile placeholder fallback (styled overlay gradient)
        if ($el.hasClass('profile-fallback')) {
            const parent = $el.parent();
            parent.addClass('profile-fallback-failed');
            // Write monogram of initials into container
            if (parent.find('.profile-monogram').length === 0) {
                parent.append('<span class="profile-monogram">HS</span>');
            }
        }
        
        // Testimonial author image placeholder fallback
        if ($el.parent().hasClass('author-avatar-wrapper')) {
            $el.siblings('.author-fallback').removeClass('d-none');
        }
    });

    // Check if images already loaded or failed before listener registered (caching edge cases)
    $('img').each(function() {
        if (this.complete) {
            if (typeof this.naturalWidth !== "undefined" && this.naturalWidth > 0) {
                $(this).trigger('load');
            } else {
                $(this).trigger('error');
            }
        }
    });

    // ==========================================
    // 4. Portfolio Filters Actions
    // ==========================================
    $('.filter-btn').on('click', function() {
        const filter = $(this).attr('data-filter');
        
        // Set active styling on button selector
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');
        
        // Handle filter animation hide/show transitions
        const items = $('.portfolio-item');
        
        if (filter === 'all') {
            items.each(function() {
                const item = $(this);
                item.removeClass('d-none').css('opacity', '0');
                setTimeout(() => {
                    item.css({
                        'opacity': '1',
                        'transform': 'scale(1)',
                        'transition': 'all 0.4s ease'
                    });
                }, 50);
            });
        } else {
            items.each(function() {
                const item = $(this);
                if (item.hasClass(filter)) {
                    item.removeClass('d-none').css('opacity', '0');
                    setTimeout(() => {
                        item.css({
                            'opacity': '1',
                            'transform': 'scale(1)',
                            'transition': 'all 0.4s ease'
                        });
                    }, 50);
                } else {
                    item.css({
                        'opacity': '0',
                        'transform': 'scale(0.85)',
                        'transition': 'all 0.4s ease'
                    });
                    setTimeout(() => {
                        item.addClass('d-none');
                    }, 350);
                }
            });
        }
    });

    // ==========================================
    // 5. Scroll Spy Navigation Highlight
    // ==========================================
    const navbarWrapper = $('.navbar-wrapper');
    const navLinks = $('.navbar-nav .nav-link');
    const sections = $('section');

    function checkScrollSpy() {
        const scrollPos = $(window).scrollTop();
        const navbarHeight = navbarWrapper.outerHeight();

        // 5a. Toggle sticky glass class on scroll
        if (scrollPos > 30) {
            navbarWrapper.addClass('scrolled');
        } else {
            navbarWrapper.removeClass('scrolled');
        }

        // 5b. Scrollspy highlight active route link
        let currentSectionId = '';
        sections.each(function() {
            const top = $(this).offset().top - navbarHeight - 30;
            const bottom = top + $(this).outerHeight();
            
            if (scrollPos >= top && scrollPos < bottom) {
                currentSectionId = $(this).attr('id');
            }
        });

        if (currentSectionId) {
            navLinks.removeClass('active');
            $('#nav-link-' + currentSectionId).addClass('active');
        }
    }

    $(window).on('scroll', checkScrollSpy);
    // Initial run in case page loaded scrolled down
    checkScrollSpy();

    // Smooth scroll offset adjustment for top menu
    navLinks.on('click', function(e) {
        // Toggle mobile collapse overlay on click
        const collapseMenu = $('#navbarContent');
        if (collapseMenu.hasClass('show')) {
            $('.navbar-toggler').click();
        }
    });

    // ==========================================
    // 6. Certificate Lightbox Modals
    // ==========================================
    $('.cert-img-wrapper').on('click', function() {
        const certPath = $(this).attr('data-cert');
        const modalImg = $('#modalCertImg');
        const modalFallback = $('#modalCertFallback');
        const modalTitle = $('#certModalLabel');
        
        // Try loading certificate image in background to check if it exists
        const testImg = new Image();
        testImg.src = certPath;

        testImg.onload = function() {
            // Success: show full image
            modalImg.attr('src', certPath).removeClass('d-none');
            modalFallback.addClass('d-none');
            modalTitle.text('Certification Certificate');
            $('#certModal').modal('show');
        };

        testImg.onerror = function() {
            // Failure: hide image, show stylized alert in modal
            modalImg.addClass('d-none');
            modalFallback.removeClass('d-none');
            modalTitle.text('Certification Details');
            $('#certModal').modal('show');
        };
    });

    // ==========================================
    // 7. Formspree Contact Validation
    // ==========================================
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    }

    // ==========================================
    // 8. Dynamic Scroll Reveal Animations
    // ==========================================
    // Dynamically inject classes to clean HTML tags and handle reveal triggers
    $('.hero-text, .section-title, .skills-heading, .services-intro-card, .section-desc').addClass('reveal-left');
    $('.hero-image-wrapper, .about-bio').addClass('reveal-right');
    $('.about-profile-card, .skill-card, .resume-info-card, .timeline-card-item, .cert-card, .portfolio-card, .service-card, .testimonial-card, .contact-info-wrapper-v2, .contact-form-wrapper-v2, .portfolio-tabs-wrapper').addClass('reveal');

    // Observe element viewport enter points
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.05,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });

        // ==========================================
        // 9. Skill Progress Bar Fill Observers
        // ==========================================
        const progressBars = document.querySelectorAll('.progress-fill, .progress-fill-sm');
        const progressObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const targetWidth = bar.getAttribute('data-width');
                    bar.style.width = targetWidth;
                    observer.unobserve(bar); // Fill up once
                }
            });
        }, {
            threshold: 0.05
        });

        progressBars.forEach(bar => {
            progressObserver.observe(bar);
        });
    } else {
        // Fallback for legacy browsers
        $('.reveal, .reveal-left, .reveal-right').addClass('active');
        $('.progress-fill, .progress-fill-sm').each(function() {
            $(this).css('width', $(this).attr('data-width'));
        });
    }
});
