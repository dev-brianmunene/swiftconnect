// Simple menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navbar = document.querySelector('.navbar');
    
    if (menuBtn && navbar) {
        menuBtn.addEventListener('click', function() {
            navbar.classList.toggle('show');
            this.textContent = navbar.classList.contains('show') ? '✕' : '☰';
        });

        // Close menu when clicking links
        document.querySelectorAll('.navbar-link').forEach(link => {
            link.addEventListener('click', function() {
                navbar.classList.remove('show');
                menuBtn.textContent = '☰';
            });
        });
    }
});
