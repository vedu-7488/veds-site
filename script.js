document.addEventListener("DOMContentLoaded", () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    /* ==========================================================================
       THEME SYSTEM (LIGHT/DARK MODE)
       ========================================================================== */
    const themeToggle = document.getElementById("theme-toggle");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)");

    function applyTheme(theme) {
        const isDark = theme === "dark";
        document.body.classList.toggle("dark", isDark);
        localStorage.setItem("theme", theme);
    }

    function getPreferredTheme() {
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme === "light" || storedTheme === "dark") {
            return storedTheme;
        }
        return systemPrefersDark.matches ? "dark" : "light";
    }

    // Apply preferred theme on startup
    applyTheme(getPreferredTheme());

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const nextTheme = document.body.classList.contains("dark") ? "light" : "dark";
            applyTheme(nextTheme);
        });
    }

    // Listen for OS theme updates
    systemPrefersDark.addEventListener("change", (e) => {
        if (!localStorage.getItem("theme")) {
            applyTheme(e.matches ? "dark" : "light");
        }
    });

    /* ==========================================================================
       MOUSE GLOW SPOTLIGHT
       ========================================================================== */
    const spotlight = document.getElementById("glow-spotlight");
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    const friction = 0.12; // Lower value = smoother interpolation

    document.addEventListener("mousemove", (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
    });

    function updateSpotlight() {
        // Linear interpolation to make movement fluid
        currentX += (targetX - currentX) * friction;
        currentY += (targetY - currentY) * friction;

        if (spotlight) {
            spotlight.style.left = `${currentX + window.scrollX}px`;
            spotlight.style.top = `${currentY + window.scrollY}px`;
        }
        requestAnimationFrame(updateSpotlight);
    }
    updateSpotlight();

    /* ==========================================================================
       SCROLL REVEAL ANIMATIONS
       ========================================================================== */
    const revealElements = document.querySelectorAll(".reveal");

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                // Trigger stats counter if this element contains one
                const stats = entry.target.querySelectorAll(".stat-number");
                if (stats.length > 0) {
                    stats.forEach(stat => animateCounter(stat));
                }
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });

    revealElements.forEach(el => revealObserver.observe(el));

    /* ==========================================================================
       DYNAMIC STATS COUNTER ANIMATION
       ========================================================================== */
    function animateCounter(counterEl) {
        const target = parseInt(counterEl.getAttribute("data-target"), 10);
        const suffix = counterEl.getAttribute("data-suffix") || "";
        let current = 0;
        const duration = 1200; // ms
        const steps = 60;
        const increment = target / steps;
        const stepTime = duration / steps;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counterEl.textContent = target + suffix;
                clearInterval(timer);
            } else {
                counterEl.textContent = Math.floor(current) + suffix;
            }
        }, stepTime);
    }

    /* ==========================================================================
       3D CARD TILT EFFECT (DEVICES & TILT CARDS)
       ========================================================================== */
    const tiltContainers = [
        document.getElementById("hero-device"),
        document.getElementById("device-superapp"),
        document.getElementById("device-godide"),
        document.getElementById("device-mindvault")
    ];

    tiltContainers.forEach(container => {
        if (!container) return;

        container.addEventListener("mousemove", (e) => {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left; // x coordinate inside the element
            const y = e.clientY - rect.top;  // y coordinate inside the element
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate tilt degrees (max 10 degrees)
            const rotateY = ((x - centerX) / centerX) * 10;
            const rotateX = -((y - centerY) / centerY) * 10;

            container.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });

        container.addEventListener("mouseleave", () => {
            container.style.transform = "rotateX(0deg) rotateY(0deg) translateY(0)";
        });
    });

    /* ==========================================================================
       GITHUB CONTRIBUTION GRID SIMULATION
       ========================================================================== */
    const gitContainer = document.getElementById("github-pixels-container");
    if (gitContainer) {
        const numBlocks = 36 * 7; // 36 columns, 7 rows
        let html = "";
        
        for (let i = 0; i < numBlocks; i++) {
            // Determine density class (d-0 to d-4) randomly but weighted to look natural
            const rand = Math.random();
            let density = "d-0";
            if (rand > 0.85) density = "d-4";
            else if (rand > 0.70) density = "d-3";
            else if (rand > 0.50) density = "d-2";
            else if (rand > 0.25) density = "d-1";

            html += `<span class="git-pixel ${density}" title="Contributions on index ${i}"></span>`;
        }
        gitContainer.innerHTML = html;
    }

    /* ==========================================================================
       INTERACTIVE MINDVAULT MOOD SELECTOR
       ========================================================================== */
    const moodEmojis = document.querySelectorAll(".mood-emoji");
    moodEmojis.forEach(emoji => {
        emoji.addEventListener("click", () => {
            moodEmojis.forEach(e => e.style.transform = "scale(1)");
            emoji.style.transform = "scale(1.4) translateY(-4px)";
            
            // Simulate changing reflection prompt
            const promptText = document.querySelector(".prompt-text");
            if (promptText) {
                if (emoji.textContent === "🤩") {
                    promptText.textContent = "Awesome! What inspired you today?";
                } else if (emoji.textContent === "😊") {
                    promptText.textContent = "Glad you are feeling good. What's on your mind?";
                } else if (emoji.textContent === "😐") {
                    promptText.textContent = "A balanced day. Anything you want to log?";
                } else {
                    promptText.textContent = "Hope you feel better. Write your thoughts here.";
                }
            }
        });
    });

    /* ==========================================================================
       CONTACT FORM SUBMIT ACTION
       ========================================================================== */
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector("button[type='submit']");
            const originalHTML = submitBtn.innerHTML;

            const name = document.getElementById("form-name").value;
            const email = document.getElementById("form-email").value;
            const msg = document.getElementById("form-msg").value;

            const subject = encodeURIComponent(`iOS Developer Inquiry from ${name}`);
            const body = encodeURIComponent(`Hello Ved,\n\nI visited your portfolio and wanted to reach out.\n\nSender Name: ${name}\nSender Email: ${email}\n\nMessage Details:\n${msg}`);

            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i data-lucide="loader-2" class="spin"></i> Preparing Email...`;
            lucide.createIcons();

            // Simulating API loading then opening native mail application
            setTimeout(() => {
                submitBtn.style.background = "#30d158";
                submitBtn.innerHTML = `<i data-lucide="check"></i> Opening Mail Client...`;
                lucide.createIcons();

                // Direct redirect to default client
                window.location.href = `mailto:vedmishra773@gmail.com?subject=${subject}&body=${body}`;

                contactForm.reset();

                setTimeout(() => {
                    submitBtn.style.background = "";
                    submitBtn.innerHTML = originalHTML;
                    submitBtn.disabled = false;
                    lucide.createIcons();
                }, 3000);
            }, 1200);
        });
    }

    /* ==========================================================================
       ACTIVE LINK ON SCROLL INDICATOR
       ========================================================================== */
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    window.addEventListener("scroll", () => {
        let currentSectionId = "";
        const scrollPosition = window.scrollY + 120;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${currentSectionId}`) {
                link.classList.add("active");
            }
        });

        // Add class to header when scrolled
        const header = document.querySelector("header");
        if (header) {
            header.classList.toggle("scrolled", window.scrollY > 20);
        }
    });

    // Update footer year dynamically
    const footerYear = document.getElementById("footer-year");
    if (footerYear) {
        footerYear.textContent = new Date().getFullYear();
    }
});
