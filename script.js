document.addEventListener('DOMContentLoaded', () => {
    /* 1. Cinematic Preloader Logic */
    const preloader = document.getElementById('preloader');
    const appContainer = document.getElementById('appContainer');

    // Remove preloader after 2.5s (simulate loading/entrance)
    setTimeout(() => {
        preloader.classList.add('hidden');
        appContainer.classList.add('ready');
    }, 2800);

    /* --- Constants & Elements --- */
    const card = document.getElementById('businessCard');
    const cardWrapper = document.getElementById('cardWrapper');
    const glares = document.querySelectorAll('.glare');
    let isFlipped = false;

    /* 2. Flip Logic */
    // Only flip if the click hits the card face (not a button/link)
    card.addEventListener('click', (e) => {
        if(e.target.closest('a') || e.target.closest('button')) return;
        flipCard();
    });

    function flipCard() {
        isFlipped = !isFlipped;
        card.classList.toggle('is-flipped');
        
        if (window.navigator.vibrate) {
            window.navigator.vibrate(10);
        }
        
        // Temporarily reset rotation so flip happens cleanly
        card.style.transform = isFlipped ? `rotateY(180deg)` : `rotateX(0deg) rotateY(0deg)`;
    }

    /* 3. 3D Tilt & Glare Engine */
    function applyTiltAndGlare(xRatio, yRatio) {
        // xRatio and yRatio are typically between -1 and 1
        
        // Cap ratios to prevent extreme flips
        const cappedX = Math.max(-1, Math.min(1, xRatio));
        const cappedY = Math.max(-1, Math.min(1, yRatio));

        // Tilt effect (max 15 degrees)
        // Note: if flipped, we need to invert Y rotation mentally or just apply it properly
        let rotateX = cappedY * -15; 
        let rotateY = cappedX * 15;

        if (isFlipped) {
            // When flipped, base is 180deg
            card.style.transform = `rotateY(${180 + rotateY}deg) rotateX(${-rotateX}deg)`;
        } else {
            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        }

        // Glare shift (move the gradient based on angle)
        // Gradient width is 200%, so shifting translate by +/- 50% moves the shine
        const translateX = -50 + (cappedX * -30);
        const translateY = -50 + (cappedY * -30);
        
        glares.forEach(glare => {
            glare.style.transform = `translate(${translateX}%, ${translateY}%) rotate(0deg)`;
            glare.style.opacity = '1';
        });
    }

    function resetCard() {
        card.style.transform = isFlipped ? `rotateY(180deg)` : `rotateX(0deg) rotateY(0deg)`;
        cardWrapper.classList.remove('active');
        glares.forEach(glare => {
            glare.style.opacity = '0';
        });
    }

    /* --- Mouse Tracking --- */
    cardWrapper.addEventListener('mousemove', (e) => {
        cardWrapper.classList.add('active');
        const rect = cardWrapper.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const xRatio = (e.clientX - centerX) / (rect.width / 2);
        const yRatio = (e.clientY - centerY) / (rect.height / 2);

        applyTiltAndGlare(xRatio, yRatio);
    });

    cardWrapper.addEventListener('mouseleave', resetCard);

    /* --- Touch Tracking (Mobile) --- */
    cardWrapper.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        const rect = cardWrapper.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const xRatio = (touch.clientX - centerX) / (rect.width / 2);
        const yRatio = (touch.clientY - centerY) / (rect.height / 2);

        applyTiltAndGlare(xRatio, yRatio);
    }, { passive: true });

    cardWrapper.addEventListener('touchend', resetCard);

    /* --- Device Gyroscope Tracking (Mobile native feel) --- */
    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', (e) => {
            // e.gamma = left/right tilt [-90, 90]
            // e.beta = front/back tilt [-180, 180]
            
            if (e.gamma !== null && e.beta !== null) {
                // Normalize roughly to [-1, 1] range for gentle tilts
                let xRatio = e.gamma / 45; 
                let yRatio = (e.beta - 45) / 45; // Assumes holding phone at 45deg angle

                applyTiltAndGlare(xRatio, yRatio);
            }
        });
    }

    // Prevent double tap zoom on mobile
    let lastTouchTime = 0;
    document.addEventListener('touchend', (e) => {
        if(e.target.closest('a') || e.target.closest('button')) return; // Allow link taps
        const now = Date.now();
        if (now - lastTouchTime < 300) {
            e.preventDefault();
        }
        lastTouchTime = now;
    }, { passive: false });
});
