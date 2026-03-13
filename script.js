/**
 * ARCADE HUB - Core Logic
 * Handles Search, Category Filtering, and Navigation.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. SELECT ELEMENTS
    const gameSearch = document.getElementById('gameSearch');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const gameCards = document.querySelectorAll('.game-card');

    // 2. SEARCH FUNCTIONALITY
    gameSearch.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        gameCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const category = card.dataset.category.toLowerCase();
            
            // If the search term matches title or category, show it
            if (title.includes(searchTerm) || category.includes(searchTerm)) {
                card.style.display = 'block';
                // Trigger a small animation
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            } else {
                card.style.display = 'none';
                card.style.opacity = '0';
            }
        });
    });

    // 3. CATEGORY FILTERING
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update Active Class on Buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            gameCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');

                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.style.display = 'block';
                    // Optional: Fade in effect
                    setTimeout(() => {
                        card.style.opacity = '1';
                    }, 10);
                } else {
                    card.style.display = 'none';
                    card.style.opacity = '0';
                }
            });
        });
    });

    // 4. DYNAMIC TAG COLORS (Visual Polish)
    // Automatically colors tags based on the game's category
    gameCards.forEach(card => {
        const tag = card.querySelector('.tag');
        const category = card.dataset.category;

        if (category === 'multi') {
            tag.style.color = '#4ade80'; // Neon Green for Multiplayer
        } else if (category === 'action') {
            tag.style.color = '#ff006e'; // Neon Pink for Action
        } else {
            tag.style.color = '#00f2ff'; // Default Neon Blue
        }
    });
});

/**
 * UTILITY: Console Log for Debugging
 * Ensures the hub is correctly initialized on GitHub Pages.
 */
console.log("🕹️ Arcade Hub Initialized. Relative paths ready for GitHub Pages.");
