document.addEventListener('DOMContentLoaded', () => {
    // Futuristic Envelope Animation Logic
    const envelope = document.getElementById('envelope');
    const envelopeOverlay = document.getElementById('envelope-overlay');
    
    // Background Particle Animation - Futuristic yet Wedding Elegant
    const canvas = document.getElementById('particle-canvas');
    let animationFrameId;
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        function resize() {
            width = window.innerWidth;
            height = window.innerHeight;
            const dpr = window.devicePixelRatio || 1;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
        }
        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.3;
                this.vy = (Math.random() - 0.5) * 0.3 - 0.3; // Gracefully drifting upwards
                this.radius = Math.random() * 3 + 1.5;
                this.baseAlpha = Math.random() * 0.35 + 0.15;
                // Magical colors for light background: Gold, Soft Burgundy, Blush Pink
                const colors = ['212, 175, 55', '114, 47, 55', '230, 168, 174'];
                this.colorRGB = colors[Math.floor(Math.random() * colors.length)];
                this.pulseSpeed = Math.random() * 0.02 + 0.01;
                this.pulse = Math.random() * Math.PI * 2;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.pulse += this.pulseSpeed;

                // Wrap around edges for infinite upward float
                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = 0;
            }

            draw() {
                const currentAlpha = this.baseAlpha + Math.sin(this.pulse) * 0.2;
                
                // Draw glowing bokeh effect
                const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 2);
                gradient.addColorStop(0, `rgba(${this.colorRGB}, ${currentAlpha})`);
                gradient.addColorStop(1, `rgba(${this.colorRGB}, 0)`);
                
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius * 2, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            // Many soft glowing orbs instead of few connected dots
            const numParticles = Math.min(Math.floor(window.innerWidth / 8), 150);
            for (let i = 0; i < numParticles; i++) {
                particles.push(new Particle());
            }
        }
        initParticles();

        function animate() {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            
            animationFrameId = requestAnimationFrame(animate);
        }
        animate();
    }

    if (envelope && envelopeOverlay) {
        envelope.addEventListener('click', () => {
            envelope.classList.add('open');
            
            // Trigger background music IMMEDIATELY on click to bypass browser safety block
            const bgMusic = document.getElementById('bg-music');
            const musicToggle = document.getElementById('music-toggle');
            if (bgMusic && musicToggle) {
                bgMusic.volume = 0.6; // Gentle volume
                bgMusic.play().then(() => {
                    musicToggle.querySelector('.icon-pause').style.display = 'block';
                    musicToggle.querySelector('.icon-play').style.display = 'none';
                }).catch(e => console.log('Audio autoplay requires gesture: ', e));
                
                // Bring the music button into view smoothly
                setTimeout(() => {
                    musicToggle.classList.add('visible');
                }, 1000);
            }

            
            // 1. Let envelope finish its internal open animation (2s total)
            setTimeout(() => {
                envelopeOverlay.classList.add('hide');
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId); // stop original bokeh
                }
            }, 2000);

            // 2. As the envelope finishes fading, swing the massive 3D church doors open
            setTimeout(() => {
                const churchDoors = document.getElementById('church-doors-overlay');
                if (churchDoors) churchDoors.classList.add('open');
            }, 2800); 

            // 3. Doors take 3.5s to swing open. At completion, hide doors, reveal page and trigger swirls
            setTimeout(() => {
                document.body.classList.remove('locked');
                
                const churchDoors = document.getElementById('church-doors-overlay');
                if (churchDoors) churchDoors.style.display = 'none';
                
                const heroContent = document.querySelector('.hero-content');
                if (heroContent) {
                    heroContent.style.animation = 'none';
                    heroContent.offsetHeight; 
                    heroContent.style.animation = null; 
                }

                triggerMemoriesAnimation();

                // 4. Reveal floating menu and watermark once on main page
                const quickOptions = document.querySelector('.quick-options');
                const watermark = document.querySelector('.rnk-watermark');
                if (quickOptions) quickOptions.classList.add('visible');
                if (watermark) watermark.classList.add('visible');
            }, 6400);
        });
    }

    // Music Control Logic
    const musicToggleBtn = document.getElementById('music-toggle');
    const bgMusicEl = document.getElementById('bg-music');
    if (musicToggleBtn && bgMusicEl) {
        musicToggleBtn.addEventListener('click', () => {
            if (bgMusicEl.paused) {
                bgMusicEl.play();
                musicToggleBtn.querySelector('.icon-pause').style.display = 'block';
                musicToggleBtn.querySelector('.icon-play').style.display = 'none';
            } else {
                bgMusicEl.pause();
                musicToggleBtn.querySelector('.icon-pause').style.display = 'none';
                musicToggleBtn.querySelector('.icon-play').style.display = 'block';
            }
        });
    }

    // Scroll Reveal Intersection Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target); // only reveal once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.hidden-reveal').forEach(el => {
        observer.observe(el);
    });

    // Countdown Timer logic target Oct 14 2026 16:00:00
    const weddingDate = new Date("October 14, 2026 16:00:00").getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance < 0) {
            document.getElementById("countdown").innerHTML = "The wedding has begun!";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const dEl = document.getElementById("cd-days");
        if(dEl) dEl.innerText = days.toString().padStart(2, '0');
        
        const hEl = document.getElementById("cd-hours");
        if(hEl) hEl.innerText = hours.toString().padStart(2, '0');

        const mEl = document.getElementById("cd-mins");
        if(mEl) mEl.innerText = minutes.toString().padStart(2, '0');

        const sEl = document.getElementById("cd-secs");
        if(sEl) sEl.innerText = seconds.toString().padStart(2, '0');
    }

    // initialize and tick
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // Gold Dust Cursor Trail Logic
    const trailCanvas = document.getElementById('trail-canvas');
    if (trailCanvas) {
        const ctx = trailCanvas.getContext('2d');
        const particles = [];
        
        function resizeTrailCanvas() {
            trailCanvas.width = window.innerWidth;
            trailCanvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeTrailCanvas);
        resizeTrailCanvas();

        function addParticle(x, y) {
            particles.push({
                x: x,
                y: y,
                size: Math.random() * 3 + 1,
                dx: (Math.random() - 0.5) * 2,
                dy: (Math.random() - 0.5) * 2 + 1.5, /* drift slightly downwards naturally */
                life: 1, // Full opacity
                decay: Math.random() * 0.02 + 0.015,
                color: `rgba(212, 175, 55, ` // Base gold rgba string
            });
        }

        window.addEventListener('mousemove', (e) => {
            if(!document.body.classList.contains('locked')){
                if(Math.random() > 0.4) addParticle(e.clientX, e.clientY);
            }
        });
        window.addEventListener('touchmove', (e) => {
            if(!document.body.classList.contains('locked')){
                const touch = e.touches[0];
                if(Math.random() > 0.4) addParticle(touch.clientX, touch.clientY);
            }
        });

        function animateTrail() {
            ctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.x += p.dx;
                p.y += p.dy;
                p.life -= p.decay;

                if (p.life <= 0) {
                    particles.splice(i, 1);
                    i--;
                    continue;
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color + p.life + ')';
                ctx.fill();
            }
            requestAnimationFrame(animateTrail);
        }
        animateTrail();
    }

    // Micro-Parallax Scrolling Logic for Gallery Items
    window.addEventListener('scroll', () => {
        if(document.body.classList.contains('locked')) return;
        
        const wraps = document.querySelectorAll('.parallax-wrap');
        wraps.forEach(wrap => {
            const speed = parseFloat(wrap.dataset.speed);
            const rect = wrap.getBoundingClientRect();
            // check if in view bounds
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const centerOffset = window.innerHeight / 2 - (rect.top + rect.height/2);
                wrap.style.transform = `translateY(${centerOffset * speed * -1}px)`;
            }
        });
    });

    // ----------------------------------------------------
    // Lenis Smooth Scroll Framework
    // ----------------------------------------------------
    let lenis;
    if(typeof window.Lenis !== 'undefined') {
        lenis = new window.Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth acceleration
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            smoothTouch: false,
            touchMultiplier: 2
        });
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    // ----------------------------------------------------
    // Premium Interactivity Upgrades
    // ----------------------------------------------------
    
    // 1. Ambient Glow Cursor tracking
    const cursorLight = document.createElement('div');
    cursorLight.className = 'cursor-light';
    const ambientBg = document.querySelector('.ambient-bg');
    if(ambientBg) ambientBg.appendChild(cursorLight);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let lightX = mouseX;
    let lightY = mouseY;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // 2. Subtle Hero Text Floating Parallax
        if(!document.body.classList.contains('locked')) {
            const heroContent = document.querySelector('.hero-content');
            if(heroContent) {
                const moveX = (window.innerWidth / 2 - e.clientX) * 0.015;
                const moveY = (window.innerHeight / 2 - e.clientY) * 0.015;
                heroContent.style.transform = `translate(${moveX}px, ${moveY}px)`;
            }

            // Background Blobs Parallax
            const blobs = document.querySelectorAll('.blob');
            blobs.forEach((blob, i) => {
                const shiftX = (window.innerWidth / 2 - e.clientX) * (0.01 + i * 0.005);
                const shiftY = (window.innerHeight / 2 - e.clientY) * (0.01 + i * 0.005);
                // Keep the original animation but add the mouse offset
                blob.style.marginLeft = `${shiftX}px`;
                blob.style.marginTop = `${shiftY}px`;
            });
        }
    });

    function animateInteractiveLight() {
        lightX += (mouseX - lightX) * 0.08;
        lightY += (mouseY - lightY) * 0.08;
        cursorLight.style.transform = `translate(${lightX - 400}px, ${lightY - 400}px)`; /* 800px width/height offset */
        requestAnimationFrame(animateInteractiveLight);
    }
    animateInteractiveLight();

    // 3. 3D Tilt interaction on RSVP Card
    const rsvpCard = document.querySelector('.rsvp-card');
    if (rsvpCard) {
        rsvpCard.addEventListener('mousemove', (e) => {
            const rect = rsvpCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate rotation max 4 degrees
            const rotateX = ((y - centerY) / centerY) * -4;
            const rotateY = ((x - centerX) / centerX) * 4;
            
            rsvpCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        rsvpCard.addEventListener('mouseleave', () => {
            rsvpCard.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    }

    // ----------------------------------------------------

    function triggerMemoriesAnimation() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        if (galleryItems.length === 0) return;

        const clones = [];

        galleryItems.forEach((item, index) => {
            const img = item.querySelector('img');
            
            // Hide original image but preserve Layout space
            img.style.opacity = '0';
            
            const clone = document.createElement('img');
            clone.src = img.src;
            clone.style.position = 'absolute';
            
            // Mobile responsive floating size so it doesn't overwhelm phones
            const size = Math.min(200, window.innerWidth * 0.4); 
            // Start near center of the hero viewport
            const startX = window.innerWidth / 2 - size/2; 
            const startY = window.scrollY + window.innerHeight / 2 - size/2; 
            
            clone.style.left = startX + 'px';
            clone.style.top = startY + 'px';
            clone.style.width = size + 'px';
            clone.style.height = size + 'px';
            clone.style.objectFit = 'cover';
            clone.style.borderRadius = '8px';
            clone.style.boxShadow = '0 15px 40px rgba(74, 20, 32, 0.4)';
            clone.style.zIndex = '1000';
            clone.style.opacity = '0';
            clone.style.transform = 'translate(0, 0) scale(0)';
            
            document.body.appendChild(clone);
            
            // Force reflow
            clone.offsetHeight;
            
            // Random float targets around the hero section
            // Keep them somewhat bounded so they don't go off screen
            const randomX = (Math.random() - 0.5) * window.innerWidth * 0.7;
            const randomY = (Math.random() - 0.5) * window.innerHeight * 0.6;
            const randomRot = (Math.random() - 0.5) * 40; // -20 to 20 deg
            
            // Emerge and float (with a slight stagger)
            setTimeout(() => {
                clone.style.transition = 'all 2s cubic-bezier(0.25, 1, 0.5, 1)';
                clone.style.opacity = '1';
                clone.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRot}deg) scale(1.1)`;
            }, Math.random() * 500);

            clones.push({ clone, item, img });
        });

        // Animate to their actual positions in the gallery
        setTimeout(() => {
            clones.forEach((obj, index) => {
                const { clone, item } = obj;
                
                // Get actual position on page (absolute)
                const rect = item.getBoundingClientRect();
                const targetLeft = rect.left + window.scrollX;
                const targetTop = rect.top + window.scrollY;
                
                // Overwrite transition for the journey home
                clone.style.transition = `all 1.5s cubic-bezier(0.77, 0, 0.175, 1) ${index * 0.1}s`;
                
                // Reset transform and apply exact coordinates
                clone.style.transform = 'translate(0, 0) rotate(0deg) scale(1)';
                clone.style.left = targetLeft + 'px';
                clone.style.top = targetTop + 'px';
                clone.style.width = rect.width + 'px';
                clone.style.height = rect.height + 'px';
                clone.style.boxShadow = '0 10px 30px rgba(74, 20, 32, 0.08)';
            });
        }, 3200); // Let them float for 3.2s

        // Remove clones and reveal originals
        setTimeout(() => {
            clones.forEach((obj) => {
                obj.img.style.transition = 'opacity 0.4s ease';
                obj.img.style.opacity = '1';
                obj.clone.remove();
                
                // Clear inline transition after fade-in so CSS hover works again
                setTimeout(() => {
                    obj.img.style.transition = '';
                }, 400);
            });
        }, 3200 + 1500 + 1000); // float time + anim time + stagger buffer
    }

    const form = document.getElementById('rsvp-form');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = document.querySelector('.btn-text');
    const loader = document.querySelector('.loader');
    const formStatus = document.getElementById('form-status');
    const attendingSelect = document.getElementById('attending');
    const guestsGroup = document.getElementById('guests-group');
    const guestsInput = document.getElementById('guests');

    // Toggle guests input based on attendance
    attendingSelect.addEventListener('change', (e) => {
        if (e.target.value.includes('No')) {
            guestsGroup.style.display = 'none';
            guestsInput.removeAttribute('required');
            guestsInput.value = '0';
        } else {
            guestsGroup.style.display = 'block';
            guestsInput.setAttribute('required', 'required');
            if (guestsInput.value === '0' || !guestsInput.value) {
                guestsInput.value = '1';
            }
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // IMPORTANT: Replace this URL with your Google Apps Script Web App URL
        const scriptURL = 'https://script.google.com/macros/s/AKfycbxIDal7N_8trk2V0HsdFndFqdVqfAxSkEiKbx54UmOxXX9rzfu2wvqq8wM-8eWRguRDzA/exec';
        
        if (scriptURL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL') {
            showStatus('Please configure your Google Apps Script URL in script.js first.', 'error');
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        loader.style.display = 'block';
        formStatus.style.display = 'none';

        const formData = new FormData(form);

        try {
            const response = await fetch(scriptURL, { 
                method: 'POST', 
                body: formData 
            });
            
            if (response.ok) {
                showStatus('Thank you! Your RSVP has been confirmed.', 'success');
                form.reset();
                guestsGroup.style.display = 'block'; // Reset to default
            } else {
                throw new Error('Network response was not ok.');
            }
        } catch (error) {
            console.error('Error!', error.message);
            showStatus('Oops! Something went wrong. Please check your internet connection or try again later.', 'error');
        } finally {
            // Restore button state
            submitBtn.disabled = false;
            btnText.style.display = 'block';
            loader.style.display = 'none';
        }
    });

    function showStatus(message, type) {
        formStatus.textContent = message;
        formStatus.className = `form-status status-${type}`;
        formStatus.style.display = 'block';
    }

    // Modal System Logic
    const openSponsorsBtn = document.getElementById('open-sponsors');
    const openEntourageBtn = document.getElementById('open-entourage');
    const openDressBtn = document.getElementById('open-dress');
    const modalSponsors = document.getElementById('modal-sponsors');
    const modalEntourage = document.getElementById('modal-entourage');
    const modalDress = document.getElementById('modal-dress');
    const closeBtns = document.querySelectorAll('.modal-close');
    const modalOverlays = document.querySelectorAll('.modal-overlay');

    function openModal(modal) {
        if (!modal) return;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Stop background scrolling
        if (lenis) lenis.stop();
    }

    function closeModal() {
        modalOverlays.forEach(modal => modal.classList.remove('active'));
        document.body.style.overflow = ''; // Restore scrolling
        if (lenis) lenis.start();
    }

    if (openSponsorsBtn) {
        openSponsorsBtn.addEventListener('click', () => openModal(modalSponsors));
    }

    if (openEntourageBtn) {
        openEntourageBtn.addEventListener('click', () => openModal(modalEntourage));
    }

    if (openDressBtn) {
        openDressBtn.addEventListener('click', () => openModal(modalDress));
    }

    closeBtns.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    modalOverlays.forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });
    });

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // Map Toggle Logic
    const mapToggleBtns = document.querySelectorAll('.map-toggle-btn');
    mapToggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const targetMap = document.getElementById(targetId);
            if (targetMap) {
                targetMap.classList.toggle('active');
                btn.textContent = targetMap.classList.contains('active') ? 'Hide Map' : 'View Map';
            }
        });
    });
});
