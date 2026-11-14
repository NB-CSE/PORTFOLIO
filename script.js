/**
 * Naresh Behra - Portfolio Scripts
 * Handles navigation, mobile menu, image fallbacks, clipboard, and interactive components.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. MOBILE NAVIGATION MENU
       ========================================================================== */
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = navLinks.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', String(isOpen));
            menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
            menuToggle.innerHTML = isOpen ? '✕' : '☰';
        });

        // Close on clicking any link inside menu
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.setAttribute('aria-label', 'Open navigation');
                menuToggle.innerHTML = '☰';
            });
        });

        // Close menu on clicking outside
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && e.target !== menuToggle) {
                navLinks.classList.remove('open');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.setAttribute('aria-label', 'Open navigation');
                menuToggle.innerHTML = '☰';
            }
        });

        // Close menu on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('open')) {
                navLinks.classList.remove('open');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.setAttribute('aria-label', 'Open navigation');
                menuToggle.innerHTML = '☰';
            }
        });
    }

    /* ==========================================================================
       2. ACTIVE PAGE LINK HIGHLIGHTING
       ========================================================================== */
    try {
        const path = window.location.pathname;
        let currentFile = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
        if (currentFile.endsWith('/')) currentFile = 'index.html';

        const links = document.querySelectorAll('.nav-links a');
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentFile || (currentFile === '' && href === 'index.html')) {
                link.classList.add('active');
            }
        });
    } catch (e) {
        // Fallback gracefully
    }

    /* ==========================================================================
       3. PROFILE PHOTO FALLBACK HANDLER
       ========================================================================== */
    const profileImg = document.querySelector('.profile-photo');
    const avatarFallback = document.querySelector('.avatar-fallback');

    if (profileImg && avatarFallback) {
        profileImg.addEventListener('error', () => {
            profileImg.classList.add('img-fallback');
            avatarFallback.classList.add('show');
        });

        // Check if image is already broken (e.g. cached 404)
        if (profileImg.complete && profileImg.naturalHeight === 0) {
            profileImg.classList.add('img-fallback');
            avatarFallback.classList.add('show');
        }
    }

    /* ==========================================================================
       4. AUTO COPYRIGHT YEAR
       ========================================================================== */
    const yearElements = document.querySelectorAll('.current-year');
    const currentYear = new Date().getFullYear();
    yearElements.forEach(el => {
        el.textContent = currentYear;
    });

    /* ==========================================================================
       5. CONTACT FORM MAILER
       ========================================================================== */
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('formName')?.value.trim() || 'Visitor';
            const email = document.getElementById('formEmail')?.value.trim() || '';
            const subject = document.getElementById('formSubject')?.value.trim() || 'Portfolio Inquiry';
            const message = document.getElementById('formMessage')?.value.trim() || '';

            const bodyContent = `Hi Naresh,\n\n${message}\n\n---\nFrom: ${name}\nEmail: ${email}`;
            const mailtoUri = `mailto:nareshbehra911@gmail.com?subject=${encodeURIComponent(subject + ' - via Portfolio')}&body=${encodeURIComponent(bodyContent)}`;

            window.location.href = mailtoUri;
            showToast('Opening your email client to send message...');
        });
    }

});

/* ==========================================================================
   6. GLOBAL TOAST NOTIFICATION & COPY HELPER
   ========================================================================== */
function showToast(message) {
    let toast = document.getElementById('toastNotification');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toastNotification';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.innerHTML = `<span style="color: var(--accent-2); font-weight: bold;">✓</span> ${message}`;
    toast.classList.add('show');

    clearTimeout(window.__toastTimeout);
    window.__toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3200);
}

window.copyEmail = function(email, event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(() => {
            showToast('Copied to clipboard: ' + email);
        }).catch(() => {
            fallbackCopy(email);
        });
    } else {
        fallbackCopy(email);
    }
};

function fallbackCopy(text) {
    const input = document.createElement('input');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    try {
        document.execCommand('copy');
        showToast('Copied to clipboard: ' + text);
    } catch (err) {
        showToast('Email: ' + text);
    }
    document.body.removeChild(input);
}

