document.addEventListener('DOMContentLoaded', () => {
    const pageLoader = document.getElementById('page-loader');
    if (pageLoader) {
        window.addEventListener('load', () => {
            pageLoader.classList.add('hidden');
        });
    }

    const scrollProgress = document.getElementById('scroll-progress');
    if (scrollProgress) {
        const updateScrollProgress = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            scrollProgress.style.width = `${Math.min(100, Math.max(0, progress))}%`;
        };
        window.addEventListener('scroll', updateScrollProgress, { passive: true });
        updateScrollProgress();
    }

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
        if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
    };

    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    if (menuToggle && navLinks && navOverlay) {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-controls', 'primary-navigation');
        menuToggle.addEventListener('click', () => {
            navLinks.classList.contains('active') ? closeMenu() : openMenu();
            menuToggle.setAttribute(
                'aria-expanded',
                navLinks.classList.contains('active') ? 'true' : 'false'
            );
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
        roomModal.setAttribute('role', 'dialog');
        roomModal.setAttribute('aria-modal', 'true');

        const closeModal = document.querySelector('.close-modal');
        const viewDetailsBtns = document.querySelectorAll('.btn-view-details');

        const modalTitle = document.getElementById('modal-title');
        const modalPrice = document.getElementById('modal-price');
        const modalDesc = document.getElementById('modal-desc');
        const modalFeatures = document.getElementById('modal-features');

        const modalImg = document.getElementById('modal-img');
        const modalImgFallback = document.getElementById('modal-img-fallback');
        const modalImgFallbackText = document.getElementById('modal-img-fallback-text');
        let modalImageToken = 0;

        const resetModalImageState = () => {
            modalImageToken += 1;
            if (modalImg) {
                modalImg.hidden = true;
                modalImg.style.display = 'none';
                modalImg.src = '';
                modalImg.alt = '';
                modalImg.onload = null;
                modalImg.onerror = null;
            }
            if (modalImgFallback) {
                modalImgFallback.hidden = true;
                modalImgFallback.style.display = 'none';
            }
        };

        const showImageFallback = (label) => {
            if (modalImg) {
                modalImg.hidden = true;
                modalImg.style.display = 'none';
                modalImg.src = '';
                modalImg.onload = null;
                modalImg.onerror = null;
            }
            if (modalImgFallbackText) modalImgFallbackText.textContent = label || 'No image available';
            if (modalImgFallback) {
                modalImgFallback.hidden = false;
                modalImgFallback.style.display = 'flex';
            }
        };

        closeRoomModal = () => {
            roomModal.style.display = 'none';
            roomModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            resetModalImageState();
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

                // Image / fallback (never render both, prevent flicker/race)
                resetModalImageState();
                if (modalImg && modalImgFallback) {
                    if (!img) {
                        showImageFallback(imgLabel);
                    } else {
                        const thisToken = modalImageToken;
                        modalImg.alt = `${title} at CAPIE Lodges LTD`;
                        modalImg.onload = () => {
                            if (thisToken !== modalImageToken) return;
                            modalImg.hidden = false;
                            modalImg.style.display = 'block';
                            modalImgFallback.hidden = true;
                            modalImgFallback.style.display = 'none';
                        };
                        modalImg.onerror = () => {
                            if (thisToken !== modalImageToken) return;
                            showImageFallback(`${imgLabel} (coming soon)`);
                        };
                        modalImg.src = img;
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

    // 6) Gallery Lightbox
    const galleryModal = document.getElementById('gallery-lightbox');
    if (galleryModal) {
        const galleryImage = document.getElementById('gallery-lightbox-image');
        const galleryCaption = document.getElementById('gallery-lightbox-caption');
        const galleryCloseBtn = galleryModal.querySelector('.gallery-lightbox-close');
        const galleryTriggers = document.querySelectorAll('.gallery-tile');

        const closeGalleryModal = () => {
            galleryModal.style.display = 'none';
            galleryModal.setAttribute('aria-hidden', 'true');
            if (galleryImage) {
                galleryImage.src = '';
                galleryImage.alt = '';
            }
            if (galleryCaption) galleryCaption.textContent = '';
            document.body.style.overflow = '';
        };

        galleryTriggers.forEach((trigger) => {
            trigger.addEventListener('click', () => {
                const img = trigger.querySelector('img');
                if (!img || !galleryImage) return;

                galleryImage.src = img.currentSrc || img.src;
                galleryImage.alt = img.alt || 'Gallery image';
                if (galleryCaption) galleryCaption.textContent = img.alt || 'CAPIE Lodges Gallery';
                galleryModal.style.display = 'flex';
                galleryModal.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
            });
        });

        if (galleryCloseBtn) {
            galleryCloseBtn.addEventListener('click', closeGalleryModal);
        }

        galleryModal.addEventListener('click', (event) => {
            if (event.target === galleryModal) closeGalleryModal();
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') closeGalleryModal();
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