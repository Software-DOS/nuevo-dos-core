// navbar.js

export function toggleDropdown() {
    const dropdown = document.querySelector('.profile-dropdown');
    const menu = dropdown.querySelector('.dropdown-menu');
    
    // Toggle the show class
    dropdown.classList.toggle('show');
    
    // Close dropdown when clicking outside
    if (dropdown.classList.contains('show')) {
        document.addEventListener('click', function closeDropdown(e) {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('show');
                document.removeEventListener('click', closeDropdown);
            }
        });
    }
}

// Cierra el menú si se hace clic fuera
window.addEventListener("click", function(event) {
    const dropdown = document.querySelector(".profile-dropdown");
    if (dropdown && !dropdown.contains(event.target)) {
        dropdown.classList.remove("show");
    }
});

// Auto-detect and set active navbar state
export function setActiveNavState() {
    const currentPath = window.location.pathname;
    const filename = currentPath.split('/').pop() || 'dashboard.html';
    
    // Map filenames to page data attributes
    const pageMap = {
        'dashboard.html': 'dashboard',
        'lista_empleados.html': 'profiles',
        'admin_cv.html': 'profiles',
        'empleado_cv.html': 'cv',
        'lista_capacitaciones.html': 'training',
        'empleado_capacitaciones.html': 'training',
        'lista_evaluaciones.html': 'evaluation',
        'evaluacion.html': 'evaluation',
        'lista_aplicantes.html': 'evaluation'
    };
    
    const currentPage = pageMap[filename] || 'dashboard';
    
    // Set page data attribute
    document.body.setAttribute('data-page', currentPage);
    
    // Update active nav link
    const navLinks = document.querySelectorAll('.nav-links a:not(.fas):not(.nav-button)');
    navLinks.forEach(link => {
        link.classList.remove('active');
        
        const href = link.getAttribute('href');
        if (href && href === filename) {
            link.classList.add('active');
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    setActiveNavState();
    
    // Add smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
