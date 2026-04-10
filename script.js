document.addEventListener('DOMContentLoaded', () => {
    const card = document.getElementById('businessCard');
    const cardWrapper = document.getElementById('cardWrapper');
    let isFlipped = false;

    // Handle Tap to Flip
    card.addEventListener('click', () => {
        flipCard();
    });

    function flipCard() {
        isFlipped = !isFlipped;
        card.classList.toggle('is-flipped');
        
        // Haptic feedback (if supported)
        if (window.navigator.vibrate) {
            window.navigator.vibrate(10);
        }
    }

    // Optional: Subtle Parallax Effect on Touch
    cardWrapper.addEventListener('mousemove', (e) => {
        if (!isFlipped) {
            handleMove(e.clientX, e.clientY);
        }
    });

    // Touch events for mobile
    cardWrapper.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        handleMove(touch.clientX, touch.clientY);
    }, { passive: true });

    cardWrapper.addEventListener('mouseleave', resetCard);
    cardWrapper.addEventListener('touchend', resetCard);

    function handleMove(x, y) {
        if (isFlipped) return;

        const rect = cardWrapper.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const mouseX = x - centerX;
        const mouseY = y - centerY;

        const rotateX = (mouseY / (rect.height / 2)) * -10; // Max 10 degrees
        const rotateY = (mouseX / (rect.width / 2)) * 10;

        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }

    function resetCard() {
        if (!isFlipped) {
            card.style.transform = `rotateX(0deg) rotateY(0deg)`;
        } else {
            card.style.transform = `rotateY(180deg)`;
        }
    }

    // Prevent double tap zoom on mobile
    let lastTouchTime = 0;
    document.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - lastTouchTime < 300) {
            e.preventDefault();
        }
        lastTouchTime = now;
    }, { passive: false });
});
