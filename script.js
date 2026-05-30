/**
 * SEBASTIAN CABALLERO - PORTFOLIO INTERACTIVITY
 * 2026 Premium Edition
 */

document.addEventListener('DOMContentLoaded', () => {

    // =============================================
    // 1. INTERSECTION OBSERVER — Scroll Reveal
    // =============================================
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.scroll-reveal').forEach(el => revealObserver.observe(el));

    // Staggered reveal for bento cards
    const bentoGrid = document.querySelector('.bento-grid');
    if (bentoGrid) {
        bentoGrid.classList.remove('scroll-reveal');
        bentoGrid.querySelectorAll('.bento-card').forEach((card, i) => {
            card.classList.add('scroll-reveal-stagger');
            card.style.setProperty('--reveal-delay', `${i * 115}ms`);
            revealObserver.observe(card);
        });
    }

    // Tag cloud pop-in
    const tagCloud = document.querySelector('.tag-cloud');
    if (tagCloud) {
        const tagObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.2 });
        tagObserver.observe(tagCloud);
    }

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
    // 3. HEADER + SCROLL PROGRESS
    // =============================================
    const header = document.querySelector('.header');
    const progressBar = document.getElementById('scrollProgress');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(5, 5, 7, 0.92)';
            header.style.boxShadow = '0 4px 30px rgba(0,0,0,0.5)';
        } else {
            header.style.background = 'rgba(5, 5, 7, 0.7)';
            header.style.boxShadow = 'none';
        }

        if (progressBar) {
            const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
            progressBar.style.width = (scrolled * 100) + '%';
        }
    }, { passive: true });

    // =============================================
    // 4. CUSTOM CURSOR
    // =============================================
    const cursorDot  = document.getElementById('cursorDot');
    const cursorRing = document.getElementById('cursorRing');

    if (cursorDot && cursorRing && window.matchMedia('(hover: hover)').matches) {
        document.body.classList.add('custom-cursor-active');

        let mouseX = -200, mouseY = -200;
        let ringX  = -200, ringY  = -200;

        // Dot follows exactly
        document.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top  = mouseY + 'px';
        });

        // Ring follows with lerp lag
        (function lerpRing() {
            ringX += (mouseX - ringX) * 0.1;
            ringY += (mouseY - ringY) * 0.1;
            cursorRing.style.left = ringX + 'px';
            cursorRing.style.top  = ringY + 'px';
            requestAnimationFrame(lerpRing);
        })();

        // Hover state on interactive elements
        document.querySelectorAll('a, button, .tag, .bento-card, .cert-card, .stat-card').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorDot.classList.add('is-hovering');
                cursorRing.classList.add('is-hovering');
            });
            el.addEventListener('mouseleave', () => {
                cursorDot.classList.remove('is-hovering');
                cursorRing.classList.remove('is-hovering');
            });
        });
    }

    // =============================================
    // 5. TYPEWRITER on Hero Badge
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
                if (cIdx === word.length) {
                    deleting = true;
                    setTimeout(typeBadge, 2400);
                    return;
                }
            } else {
                badge.textContent = word.slice(0, cIdx - 1);
                cIdx--;
                if (cIdx === 0) {
                    deleting = false;
                    rIdx = (rIdx + 1) % roles.length;
                    setTimeout(typeBadge, 420);
                    return;
                }
            }
            setTimeout(typeBadge, deleting ? 38 : 68);
        }

        setTimeout(typeBadge, 900);
    }

    // =============================================
    // 6. 3D TILT on Bento & Cert Cards
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
    // 7. MAGNETIC BUTTON
    // =============================================
    document.querySelectorAll('.btn-primary').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const rect = btn.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width  / 2) * 0.28;
            const y = (e.clientY - rect.top  - rect.height / 2) * 0.28;
            btn.style.transform = `translateY(-2px) translate(${x}px, ${y}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });

    // =============================================
    // 8. CANVAS PARTICLES (Hero)
    // =============================================
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');

        function resizeCanvas() {
            canvas.width  = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
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
                    const dx   = particles[i].x - particles[j].x;
                    const dy   = particles[i].y - particles[j].y;
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
    // 10. GLOW BACKGROUNDS FOLLOW MOUSE
    // =============================================
    const glow1 = document.querySelector('.glow-1');
    const glow2 = document.querySelector('.glow-2');
    if (glow1 && glow2) {
        document.addEventListener('mousemove', e => {
            const mx = e.clientX / window.innerWidth;
            const my = e.clientY / window.innerHeight;
            glow1.style.transform = `translate(${mx * 35}px, ${my * 25}px)`;
            glow2.style.transform = `translate(${-mx * 25}px, ${-my * 18}px)`;
        });
    }

    setTimeout(() => { document.body.style.opacity = '1'; }, 100);
});
