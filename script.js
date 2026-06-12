// ================= THEME TOGGLE LOGIC =================
const themeBtn = document.getElementById('theme-btn');
const body = document.body;
const icon = themeBtn.querySelector('i');


if (localStorage.getItem('theme') === 'light') {
    body.classList.add('light-mode');
    icon.classList.replace('bi-brightness-high', 'bi-moon-stars');
}


themeBtn.addEventListener('click', () => {
    body.classList.toggle('light-mode');

    if (body.classList.contains('light-mode')) {
        icon.classList.replace('bi-brightness-high', 'bi-moon-stars');
        localStorage.setItem('theme', 'light');
    } else {
        icon.classList.replace('bi-moon-stars', 'bi-brightness-high');
        localStorage.setItem('theme', 'dark');
    }
});

// ================= SCROLL ANIMATIONS =================
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
});

const hiddenElements = document.querySelectorAll('.fade-in');
hiddenElements.forEach((el) => observer.observe(el));







// ================= PORTFOLIO FILTERING =================
const filterButtons = document.querySelectorAll('.portfolio-filters li');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // 1. Remove active class from all buttons, add to clicked one
        filterButtons.forEach(btn => btn.classList.remove('filter-active'));
        button.classList.add('filter-active');

        // 2. Get the filter category (e.g., 'web', 'cpp', 'all')
        const filterValue = button.getAttribute('data-filter');

        // 3. Loop through all items and show/hide them
        portfolioItems.forEach(item => {
            if (filterValue === 'all' || item.classList.contains(filterValue)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
});