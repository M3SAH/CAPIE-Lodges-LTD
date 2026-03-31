document.addEventListener('DOMContentLoaded', () => {
    // 1) Navigation Logic
    const navbar = document.querySelector('.navbar');
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const navOverlay = document.getElementById('nav-overlay');

    const openMenu = () => {
        if (!navbar || !navLinks || !navOverlay) return;
        navLinks.classList.add('active');
        navOverlay.classList.add('active');
        navbar.classList.add('menu-open');
        document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
        if (!navbar || !navLinks || !navOverlay) return;
        navLinks.classList.remove('active');
        navOverlay.classList.remove('active');
        navbar.classList.remove('menu-open');
        document.body.style.overflow = '';
    };

    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    if (menuToggle && navLinks && navOverlay) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.contains('active') ? closeMenu() : openMenu();
        });
    }

    if (navOverlay) navOverlay.addEventListener('click', closeMenu);

    // 2) Reveal animation
    const revealElements = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        revealElements.forEach((el) => {
            if (el.getBoundingClientRect().top < windowHeight - 90) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger on load

    // CONTACT SETTING: update this WhatsApp number when business number changes
    const waNumber = '260979476307';

    // 4) Room Details Modal Logic (rooms page)
    const roomModal = document.getElementById('room-modal');
    let closeRoomModal = null;

    if (roomModal) {
        roomModal.setAttribute('aria-hidden', 'true');

        const closeModal = document.querySelector('.close-modal');
        const viewDetailsBtns = document.querySelectorAll('.btn-view-details');

        const modalTitle = document.getElementById('modal-title');
        const modalPrice = document.getElementById('modal-price');
        const modalDesc = document.getElementById('modal-desc');
        const modalFeatures = document.getElementById('modal-features');

        const modalImg = document.getElementById('modal-img');
        const modalImgFallback = document.getElementById('modal-img-fallback');
        const modalImgFallbackText = document.getElementById('modal-img-fallback-text');

        closeRoomModal = () => {
            roomModal.style.display = 'none';
            roomModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';

            if (modalImg) {
                modalImg.hidden = true;
                modalImg.src = '';
            }
            if (modalImgFallback) modalImgFallback.hidden = true;
        };

        viewDetailsBtns.forEach((btn) => {
            btn.addEventListener('click', () => {
                if (btn.disabled) return;

                const title = btn.getAttribute('data-title') || '';
                const price = btn.getAttribute('data-price') || '';
                const desc = btn.getAttribute('data-desc') || '';
                const featuresStr = btn.getAttribute('data-features') || '';

                const img = (btn.getAttribute('data-img') || '').trim();
                const imgLabel = btn.getAttribute('data-img-label') || 'No image available';

                if (modalTitle) modalTitle.textContent = title;
                if (modalPrice) modalPrice.textContent = price;
                if (modalDesc) modalDesc.textContent = desc;

                // Image / fallback
                if (modalImg && modalImgFallback) {
                    if (img) {
                        modalImg.src = img;
                        modalImg.hidden = false;
                        modalImgFallback.hidden = true;
                    } else {
                        modalImg.hidden = true;
                        modalImg.src = '';
                        if (modalImgFallbackText) modalImgFallbackText.textContent = imgLabel;
                        modalImgFallback.hidden = false;
                    }
                }

                // Features
                if (modalFeatures) {
                    modalFeatures.innerHTML = '';
                    const features = featuresStr
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean);

                    if (features.length === 0) {
                        const li = document.createElement('li');
                        li.textContent = 'No features listed yet.';
                        modalFeatures.appendChild(li);
                    } else {
                        features.forEach((feature) => {
                            const li = document.createElement('li');
                            li.textContent = feature;
                            modalFeatures.appendChild(li);
                        });
                    }
                }

                roomModal.style.display = 'flex';
                roomModal.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
            });
        });

        if (closeModal) closeModal.addEventListener('click', closeRoomModal);
        roomModal.addEventListener('click', (e) => {
            if (e.target === roomModal && closeRoomModal) closeRoomModal();
        });
    }

    // 5) Booking Form WhatsApp Logic (if present on page)
    const bookingForm = document.getElementById('whatsapp-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const checkin = document.getElementById('checkin').value;
            const checkout = document.getElementById('checkout').value;
            const roomType = document.getElementById('room-type').value;

            // BOOKING MESSAGE TEMPLATE: edit this text if you want a different WhatsApp message format
            const fullMessage = `Hello, I would like to book a room at CAPIE Lodges.\nName: ${name}\nCheck-in: ${checkin}\nCheck-out: ${checkout}\nRoom Type: ${roomType}`;
            window.open(
                `https://wa.me/${waNumber}?text=${encodeURIComponent(fullMessage)}`,
                '_blank',
                'noopener'
            );
        });
    }

    // Global Escape key: close modal and menu
    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        if (typeof closeRoomModal === 'function') closeRoomModal();
        closeMenu();
    });
});