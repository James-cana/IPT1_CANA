// Smooth scrolling and active nav highlighting
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        this.classList.add('active');

        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Enhanced parallax and section transitions
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');

// Intersection Observer for section reveals with enhanced transitions
const revealOptions = {
    root: null,
    threshold: new Array(11).fill(0).map((_, i) => i / 10), // More threshold points for smoother transitions
    rootMargin: '-10%'
};

const revealSection = (entries, observer) => {
    entries.forEach(entry => {
        const section = entry.target;
        const sectionContent = Array.from(section.children);

        // Calculate opacity based on intersection ratio
        const opacity = Math.min(entry.intersectionRatio * 1.5, 1);
        const translateY = 50 * (1 - entry.intersectionRatio);

        // Apply smooth transitions to section content
        sectionContent.forEach((element, index) => {
            const delay = index * 100;
            element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            element.style.opacity = opacity;
            element.style.transform = `translateY(${translateY}px)`;
        });

        // Update navigation
        if (entry.intersectionRatio > 0.5) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('section') === section.id) {
                    link.classList.add('active');
                }
            });
        }
    });
};

const sectionObserver = new IntersectionObserver(revealSection, revealOptions);

// Initialize sections
sections.forEach(section => {
    if (!section.classList.contains('hero')) {
        Array.from(section.children).forEach(child => {
            child.style.opacity = '0';
            child.style.transform = 'translateY(50px)';
        });
    }
    sectionObserver.observe(section);
});

// Enhanced parallax effect with smooth transitions
let ticking = false;
let lastScrollY = window.pageYOffset;

const updateParallax = () => {
    const scrolled = window.pageYOffset;
    const scrollDirection = scrolled > lastScrollY ? 'down' : 'up';

    // Enhanced parallax for background elements
    requestAnimationFrame(() => {
        const background = document.querySelector('.background');
        const grid = document.querySelector('.grid');

        // Smoother parallax movement with easing
        const parallaxY = scrolled * 0.05;
        const gridY = scrolled * 0.03;

        background.style.transform = `translateZ(-10px) scale(2) translateY(${parallaxY}px)`;
        grid.style.transform = `translateZ(-5px) scale(1.5) translateY(${gridY}px)`;

        // Dynamic section transitions
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const sectionCenter = rect.top + rect.height / 2;
            const viewportCenter = viewportHeight / 2;
            const distance = Math.abs(sectionCenter - viewportCenter);
            const maxDistance = viewportHeight;

            // Calculate parallax factor based on distance from viewport center
            const parallaxFactor = Math.max(0, 1 - distance / maxDistance);

            // Apply transform to section content
            const content = section.querySelector('.section-content');
            if (content && !section.classList.contains('hero')) {
                const translateY = (scrollDirection === 'down' ? 30 : -30) * (1 - parallaxFactor);
                const scale = 0.95 + (0.05 * parallaxFactor);
                const opacity = 0.3 + (0.7 * parallaxFactor);

                content.style.transform = `translateY(${translateY}px) scale(${scale})`;
                content.style.opacity = opacity;
            }
        });

        lastScrollY = scrolled;
        ticking = false;
    });
};

// Optimized scroll handler
window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            updateParallax();
            ticking = false;
        });
        ticking = true;
    }

    // Sticky nav styling
    const nav = document.querySelector('nav');
    if (window.pageYOffset > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Enhanced card animations
const cardOptions = {
    threshold: 0.2,
    rootMargin: '0px'
};

const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            const card = entry.target;
            const delay = index * 100;

            // Enhanced card animation with scale and transform
            card.style.transition = `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`;
            card.style.transform = 'translateY(0) scale(1)';
            card.style.opacity = '1';
        }
    });
}, cardOptions);

// Initialize cards with enhanced starting position
document.querySelectorAll('.project-card, .skill-card').forEach((card) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px) scale(0.95)';
    cardObserver.observe(card);
});

// Update scroll-linked animations smoothly
const updateScrollAnimations = () => {
    requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;
        const windowHeight = window.innerHeight;

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const sectionTop = rect.top;
            const sectionHeight = rect.height;

            // Calculate section visibility
            const visiblePercent = Math.max(0, Math.min(1,
                (windowHeight - sectionTop) / (windowHeight + sectionHeight)
            ));

            // Apply smooth transitions based on scroll position
            if (!section.classList.contains('hero')) {
                const content = section.querySelector('.section-content');
                if (content) {
                    content.style.transform = `translateY(${20 * (1 - visiblePercent)}px)`;
                    content.style.opacity = visiblePercent;
                }
            }
        });
    });
};

// Add styles for enhanced transitions
const style = document.createElement('style');
style.textContent = `
    .section {
        transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1),
                    opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .section-content {
        transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1),
                    opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .skill-card, .project-card {
        transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1),
                    opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1),
                    box-shadow 0.3s ease;
    }
`;
document.head.appendChild(style);

// Initialize
updateScrollAnimations();
window.addEventListener('scroll', updateScrollAnimations);
window.addEventListener('resize', updateScrollAnimations);

// Handle form submission with JavaScript
document.getElementById('contactForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Perform actions after submission
    alert('Email sent.');

    // Optionally reload the page or navigate back
    window.location.reload(); // Reload the current page
    // Or use: window.history.back(); // To go back to the previous page
});