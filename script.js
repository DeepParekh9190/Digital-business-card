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

    /* 2. Drag & Flip Logic */
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    let isSwiping = false;

    // --- Touch (Mobile) ---
    card.addEventListener('touchstart', (e) => {
        if(e.target.closest('a') || e.target.closest('button')) return;
        startX = e.touches[0].clientX;
        isDragging = true;
        isSwiping = false;
    }, {passive: true});

    card.addEventListener('touchmove', (e) => {
        if(!isDragging) return;
        currentX = e.touches[0].clientX;
        const diffX = currentX - startX;
        
        // Treat as swipe if moved more than 10px
        if (Math.abs(diffX) > 10) {
            isSwiping = true;
        }
    }, {passive: true});

    card.addEventListener('touchend', (e) => {
        if(!isDragging) return;
        isDragging = false;
        
        if(isSwiping) {
            const diffX = currentX - startX;
            // If dragged distance is greater than 40px, trigger flip
            if (Math.abs(diffX) > 40) {
                flipCard();
            }
        }
        
        // Reset swiping flag after short delay so the click event doesn't trigger a double flip
        setTimeout(() => {
            isSwiping = false;
        }, 50);
    });

    // --- Mouse (Desktop) ---
    card.addEventListener('mousedown', (e) => {
        if(e.target.closest('a') || e.target.closest('button')) return;
        startX = e.clientX;
        isDragging = true;
        isSwiping = false;
    });

    card.addEventListener('mousemove', (e) => {
        if(!isDragging) return;
        currentX = e.clientX;
        const diffX = currentX - startX;
        
        if (Math.abs(diffX) > 10) {
            isSwiping = true;
        }
    });

    window.addEventListener('mouseup', (e) => {
        if(!isDragging) return;
        isDragging = false;
        
        if (isSwiping) {
            const diffX = currentX - startX;
            if (Math.abs(diffX) > 40) {
                flipCard();
            }
        }
        
        setTimeout(() => {
            isSwiping = false;
        }, 50);
    });

    // --- Tap / Click ---
    card.addEventListener('click', (e) => {
        if(e.target.closest('a') || e.target.closest('button')) return;
        
        // Block the click flip if the user was actually dragging
        if(isSwiping) return; 
        
        flipCard();
    });

    function flipCard() {
        isFlipped = !isFlipped;
        card.classList.toggle('is-flipped');
    }
});
