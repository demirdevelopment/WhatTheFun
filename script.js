document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Mobile Menu Toggle ---
    const mobileToggle = document.querySelector('.mobile-toggle');
    const nav = document.querySelector('.nav');

    if (mobileToggle && nav) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            nav.classList.toggle('active');
        });

        // Close menu when clicking a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                nav.classList.remove('active');
            });
        });
    }

    // --- 2. Sticky Header on Scroll ---
    const header = document.getElementById('header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- 3. Scroll Reveal Animations (Safari-compatible) ---
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    function isInViewport(el) {
        const rect = el.getBoundingClientRect();
        return rect.top < window.innerHeight * 0.95 && rect.bottom > 0;
    }

    function revealVisible() {
        revealElements.forEach(el => {
            if (isInViewport(el)) {
                el.classList.add('active');
            }
        });
    }

    // Run on scroll
    window.addEventListener('scroll', revealVisible, { passive: true });

    // Run immediately for elements already visible
    revealVisible();

    // Safety net: force-reveal all remaining hidden elements after 1.5s
    // (handles Safari IntersectionObserver edge cases)
    setTimeout(() => {
        revealElements.forEach(el => el.classList.add('active'));
    }, 1500);

    // --- 4. Counter Animation for Stats ---
    const stats = document.querySelectorAll('.stat-number');
    let hasCounted = false;

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasCounted) {
                hasCounted = true;

                stats.forEach(stat => {
                    const target = +stat.getAttribute('data-target');
                    const duration = 2000; // 2 seconds
                    const increment = target / (duration / 16); // 60fps

                    let current = 0;

                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            // Format the number to locale string (e.g., 500.000 instead of 500000)
                            stat.innerText = Math.ceil(current).toLocaleString('tr-TR');
                            requestAnimationFrame(updateCounter);
                        } else {
                            stat.innerText = target.toLocaleString('tr-TR');
                        }
                    };

                    updateCounter();
                });
            }
        });
    }, { threshold: 0.5 });

    // Find the section containing stats to observe
    const visionSection = document.querySelector('.vision-stats');
    if (visionSection) {
        statsObserver.observe(visionSection);
    }

    // --- 5. Form Submission via EmailJS ---
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('.submit-btn');
            const originalHTML = btn.innerHTML;

            // Loading state
            btn.innerHTML = 'Gönderiliyor...';
            btn.disabled = true;

            emailjs.sendForm(
                'service_b23g1bd',
                'template_xfnkmgt',
                form
            ).then(() => {
                btn.innerHTML = 'Gönderildi ✓';
                btn.style.background = '#10B981'; // Success green
                form.reset();
                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 3000);
            }).catch((error) => {
                console.error('EmailJS error:', error);
                btn.innerHTML = 'Hata! Tekrar deneyin.';
                btn.style.background = '#EF4444'; // Error red
                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 3000);
            });
        });
    }

    // --- 6. Image Rotators ---
    const rotators = document.querySelectorAll('.image-rotator');

    rotators.forEach(rotator => {
        const slides = rotator.querySelectorAll('.rotator-slide');
        const dots = rotator.querySelectorAll('.rotator-dot');
        let currentSlide = 0;
        const slideCount = slides.length;
        let intervalId;

        const showSlide = (index) => {
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));

            slides[index].classList.add('active');
            dots[index].classList.add('active');
            currentSlide = index;
        };

        const nextSlide = () => {
            let nextIndex = (currentSlide + 1) % slideCount;
            showSlide(nextIndex);
        };

        const startRotation = () => {
            if (intervalId) clearInterval(intervalId);
            // Stagger the start time slightly for each rotator if desired, but 4s is fine
            intervalId = setInterval(nextSlide, 4000);
        };

        // Manual navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                startRotation(); // Reset timer on manual click
            });
        });

        // Pause on hover
        rotator.addEventListener('mouseenter', () => clearInterval(intervalId));
        rotator.addEventListener('mouseleave', startRotation);

        // Start initial rotation
        startRotation();
    });
});
