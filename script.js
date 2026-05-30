/**
 * SEBASTIAN CABALLERO — PORTFOLIO
 * 2026 WOW Edition
 */

document.addEventListener('DOMContentLoaded', () => {

    // =============================================
    // 0. PRELOADER
    // =============================================
    const preloader = document.getElementById('preloader');

    function revealSite() {
        if (!preloader || preloader.classList.contains('done')) return;
        preloader.classList.add('done');
        document.body.classList.remove('preloading');
    }

    // Primary timer: 2s (preloader animation lasts ~2s)
    setTimeout(revealSite, 2000);
    // Safety net on full load
    window.addEventListener('load', () => setTimeout(revealSite, 200));

    // =============================================
    // 1. OBSERVERS — started AFTER preloader
    //    so animations don't fire behind the loader
    // =============================================
    const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('active');
            obs.unobserve(entry.target);
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    const tagObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('revealed');
            obs.unobserve(entry.target);
            // Init constellation after tags finish their pop-in animation
            setTimeout(initConstellation, 1300);
        });
    }, { threshold: 0.2 });

    const counterObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseInt(el.dataset.target, 10);
            const start = performance.now();
            const duration = 1800;

            function update(now) {
                const p = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - p, 3);
                el.textContent = Math.floor(eased * target);
                if (p < 1) requestAnimationFrame(update);
                else el.textContent = target;
            }
            requestAnimationFrame(update);
            obs.unobserve(el);
        });
    }, { threshold: 0.5 });

    // Delay all observer activations until after preloader
    setTimeout(() => {
        document.querySelectorAll('.scroll-reveal').forEach(el => revealObserver.observe(el));

        // Staggered bento cards
        const bentoGrid = document.querySelector('.bento-grid');
        if (bentoGrid) {
            bentoGrid.classList.remove('scroll-reveal');
            bentoGrid.querySelectorAll('.bento-card').forEach((card, i) => {
                card.classList.add('scroll-reveal-stagger');
                card.style.setProperty('--reveal-delay', `${i * 115}ms`);
                revealObserver.observe(card);
            });
        }

        // Tag cloud
        const tagCloud = document.querySelector('.tag-cloud');
        if (tagCloud) tagObserver.observe(tagCloud);

        // Counters
        document.querySelectorAll('.counter').forEach(c => counterObserver.observe(c));

    }, 2200);

    // =============================================
    // 2. SMOOTH SCROLLING
    // =============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const id = this.getAttribute('href');
            if (id === '#') return;
            const target = document.querySelector(id);
            if (target) window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
        });
    });

    // =============================================
    // 3. HEADER + SCROLL PROGRESS BAR
    // =============================================
    const header      = document.querySelector('.header');
    const progressBar = document.getElementById('scrollProgress');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(5,5,7,0.92)';
            header.style.boxShadow  = '0 4px 30px rgba(0,0,0,0.5)';
        } else {
            header.style.background = 'rgba(5,5,7,0.7)';
            header.style.boxShadow  = 'none';
        }
        if (progressBar) {
            const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
            progressBar.style.width = (pct * 100) + '%';
        }
    }, { passive: true });

    // =============================================
    // 4. TYPEWRITER on Hero Badge (after preloader)
    // =============================================
    const badge = document.querySelector('.badge');
    if (badge) {
        const roles = [
            'Junior Solutions Engineer & AI Master',
            'Arquitecto de Software',
            'Data & AI Specialist',
            'Automatización Inteligente',
            'Machine Learning Engineer',
        ];
        badge.textContent = '';
        badge.classList.add('typewriter-cursor');

        let rIdx = 0, cIdx = 0, deleting = false;
        function typeBadge() {
            const word = roles[rIdx];
            if (!deleting) {
                badge.textContent = word.slice(0, cIdx + 1);
                cIdx++;
                if (cIdx === word.length) { deleting = true; setTimeout(typeBadge, 2400); return; }
            } else {
                badge.textContent = word.slice(0, cIdx - 1);
                cIdx--;
                if (cIdx === 0) { deleting = false; rIdx = (rIdx + 1) % roles.length; setTimeout(typeBadge, 420); return; }
            }
            setTimeout(typeBadge, deleting ? 38 : 68);
        }
        setTimeout(typeBadge, 2600);
    }

    // =============================================
    // 5. 3D TILT on Cards
    // =============================================
    document.querySelectorAll('.bento-card, .cert-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width  - 0.5;
            const y = (e.clientY - rect.top)  / rect.height - 0.5;
            card.style.transition = 'transform 0.12s ease-out, border-color 0.3s ease';
            card.style.transform  = `perspective(700px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg) translateZ(14px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.55s ease-out, border-color 0.3s ease';
            card.style.transform  = '';
        });
    });

    // =============================================
    // 6. MAGNETIC BUTTON
    // =============================================
    document.querySelectorAll('.btn-primary').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const rect = btn.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width  / 2) * 0.28;
            const y = (e.clientY - rect.top  - rect.height / 2) * 0.28;
            btn.style.transform = `translateY(-2px) translate(${x}px, ${y}px)`;
        });
        btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });

    // =============================================
    // 7. BUTTON CLICK RIPPLE
    // =============================================
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
        btn.addEventListener('click', e => {
            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height) * 2.2;
            const ripple = document.createElement('span');
            ripple.className = 'ripple-effect';
            ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px`;
            btn.appendChild(ripple);
            setTimeout(() => ripple.remove(), 700);
        });
    });

    // =============================================
    // 8. CANVAS PARTICLES (Full Page, Fixed)
    // =============================================
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');

        function resizeCanvas() {
            canvas.width  = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas, { passive: true });

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x  = Math.random() * canvas.width;
                this.y  = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.38;
                this.vy = (Math.random() - 0.5) * 0.38;
                this.r  = Math.random() * 1.4 + 0.4;
                this.a  = Math.random() * 0.45 + 0.15;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height)  this.vy *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0,240,255,${this.a})`;
                ctx.fill();
            }
        }

        const particles = Array.from({ length: 75 }, () => new Particle());

        function drawConnections() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 115) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(0,240,255,${0.13 * (1 - dist / 115)})`;
                        ctx.lineWidth   = 0.5;
                        ctx.stroke();
                    }
                }
            }
        }

        (function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            drawConnections();
            requestAnimationFrame(animate);
        })();
    }

    // =============================================
    // 9. MOUSE PARALLAX on Hero Image
    // =============================================
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        document.addEventListener('mousemove', e => {
            const x = (e.clientX / window.innerWidth  - 0.5) * 14;
            const y = (e.clientY / window.innerHeight - 0.5) * 14;
            heroImage.style.transform = `translate(${x * 0.38}px, ${y * 0.38}px)`;
        });
    }

    // =============================================
    // 9b. HOLOGRAPHIC EFFECT on Profile Photo
    // =============================================
    const imgWrapper = document.querySelector('.image-wrapper');
    if (imgWrapper) {
        imgWrapper.addEventListener('mousemove', e => {
            const rect = imgWrapper.getBoundingClientRect();
            const mx = (e.clientX - rect.left) / rect.width;
            const my = (e.clientY - rect.top)  / rect.height;
            imgWrapper.style.setProperty('--mx', mx);
            imgWrapper.style.setProperty('--my', my);
            imgWrapper.style.setProperty('--shine', 1);
            imgWrapper.style.transform = `perspective(600px) rotateX(${-(my - 0.5) * 10}deg) rotateY(${(mx - 0.5) * 10}deg) scale(1.03)`;
        });
        imgWrapper.addEventListener('mouseleave', () => {
            imgWrapper.style.setProperty('--shine', 0);
            imgWrapper.style.transition = 'transform 0.6s ease';
            imgWrapper.style.transform = '';
            setTimeout(() => { imgWrapper.style.transition = ''; }, 650);
        });
    }

    // =============================================
    // 10. NAV LOGO GLITCH
    // =============================================
    const logoEl = document.querySelector('.logo');
    if (logoEl) {
        logoEl.setAttribute('data-text', logoEl.textContent.trim());

        (function scheduleGlitch() {
            const delay = 5000 + Math.random() * 9000;
            setTimeout(() => {
                logoEl.classList.add('glitching');
                setTimeout(() => logoEl.classList.remove('glitching'), 400);
                scheduleGlitch();
            }, delay);
        })();
    }

    // =============================================
    // CONSTELLATION of SKILLS
    // =============================================
    function initConstellation() {
        const wrapper = document.getElementById('constellation-wrapper');
        const canvas  = document.getElementById('constellation-canvas');
        if (!wrapper || !canvas || canvas.dataset.init) return;
        canvas.dataset.init = '1';

        const ctx  = canvas.getContext('2d');
        const tags = Array.from(document.querySelectorAll('.tag-cloud .tag'));
        let positions = [];
        let mouseX = -999, mouseY = -999;
        let hoveredIdx = -1;

        function setupCanvas() {
            canvas.width  = wrapper.offsetWidth  + 48;
            canvas.height = wrapper.offsetHeight + 48;
        }
        setupCanvas();

        function updatePositions() {
            const wRect = wrapper.getBoundingClientRect();
            positions = tags.map(tag => {
                const r = tag.getBoundingClientRect();
                return {
                    x: r.left + r.width  / 2 - wRect.left + 24,
                    y: r.top  + r.height / 2 - wRect.top  + 24
                };
            });
        }
        updatePositions();

        window.addEventListener('resize', () => { setupCanvas(); updatePositions(); });

        wrapper.addEventListener('mousemove', e => {
            const r = wrapper.getBoundingClientRect();
            mouseX = e.clientX - r.left + 24;
            mouseY = e.clientY - r.top  + 24;
        });
        wrapper.addEventListener('mouseleave', () => {
            mouseX = -999; mouseY = -999;
            tags.forEach(t => { t.style.borderColor = ''; t.style.boxShadow = ''; t.style.color = ''; });
        });

        tags.forEach((tag, i) => {
            tag.addEventListener('mouseenter', () => { hoveredIdx = i; });
            tag.addEventListener('mouseleave', () => {
                hoveredIdx = -1;
                tag.style.borderColor = '';
                tag.style.boxShadow   = '';
                tag.style.color       = '';
            });
        });

        const MAX_DIST = 175;
        let t = 0;

        (function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            t += 0.007;

            // Mouse proximity glow on nearby tags
            if (mouseX > 0 && positions.length) {
                positions.forEach((pos, i) => {
                    const d = Math.hypot(pos.x - mouseX, pos.y - mouseY);
                    if (d < 95) {
                        const s = 1 - d / 95;
                        tags[i].style.borderColor = `rgba(0,240,255,${0.35 + s * 0.55})`;
                        tags[i].style.boxShadow   = `0 0 ${14 * s}px rgba(0,240,255,${0.28 * s}), inset 0 0 ${7 * s}px rgba(0,240,255,${0.1 * s})`;
                        tags[i].style.color       = `rgba(255,255,255,${0.75 + s * 0.25})`;
                    } else if (hoveredIdx !== i) {
                        tags[i].style.borderColor = '';
                        tags[i].style.boxShadow   = '';
                        tags[i].style.color       = '';
                    }
                });
            }

            // Connection lines between nearby tags
            for (let i = 0; i < positions.length; i++) {
                for (let j = i + 1; j < positions.length; j++) {
                    const a = positions[i], b = positions[j];
                    const dist = Math.hypot(a.x - b.x, a.y - b.y);
                    if (dist >= MAX_DIST) continue;

                    const active = hoveredIdx === i || hoveredIdx === j;
                    const pulse  = (Math.sin(t + i * 0.55 + j * 0.3) + 1) / 2;
                    const alpha  = active ? 0.55 : (1 - dist / MAX_DIST) * 0.11 + pulse * 0.03;

                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.strokeStyle = active
                        ? `rgba(0,240,255,${alpha})`
                        : `rgba(125,226,209,${alpha})`;
                    ctx.lineWidth = active ? 1.2 : 0.5;
                    ctx.stroke();
                }
            }

            // Node dots
            positions.forEach((pos, i) => {
                const active = hoveredIdx === i;
                const pulse  = (Math.sin(t + i * 0.85) + 1) / 2;
                const r      = active ? 5 : 1.8 + pulse * 0.7;
                const alpha  = active ? 1  : 0.32 + pulse * 0.28;

                if (active) {
                    ctx.beginPath();
                    ctx.arc(pos.x, pos.y, r + 7, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(0,240,255,0.07)';
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(pos.x, pos.y, r + 3, 0, Math.PI * 2);
                    ctx.strokeStyle = 'rgba(0,240,255,0.35)';
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }

                ctx.beginPath();
                ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0,240,255,${alpha})`;
                ctx.fill();
            });

            requestAnimationFrame(draw);
        })();
    }

    setTimeout(() => { document.body.style.opacity = '1'; }, 100);
});
