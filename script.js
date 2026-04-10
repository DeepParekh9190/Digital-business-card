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
