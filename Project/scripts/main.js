// Main JavaScript file for TrustTrack

document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }

    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
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

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navLinks && navLinks.classList.contains('active') && 
            !navToggle.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');
        }
    });

    // Add scroll effect to navbar
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.backgroundColor = '#fff';
            navbar.style.backdropFilter = 'none';
        }
    });    // Initialize sample data on first load
    addSampleDataIfEmpty();
    
    // Initialize reviews carousel
    const reviewsCarousel = new ReviewsCarousel();
});

function addSampleDataIfEmpty() {
    // Check if sample data already exists
    if (localStorage.getItem('sampleDataInitialized') === 'true') {
        return;
    }

    // Add sample reviews
    const sampleReviews = [
        {
            id: Date.now() - 86400000,
            route: 'dhaka-chittagong',
            ratings: { safety: 4, hygiene: 3, punctuality: 5, overcrowding: 2 },
            comment: 'Good service overall, but gets crowded during peak hours. The driver was professional and the bus was clean.',
            userName: 'Ahmed Rahman',
            timestamp: new Date(Date.now() - 86400000).toISOString()
        },
        {
            id: Date.now() - 172800000,
            route: 'mirpur-dhanmondi',
            ratings: { safety: 5, hygiene: 4, punctuality: 4, overcrowding: 3 },
            comment: 'Clean and safe transport. Recommended for daily commute!',
            userName: 'Fatima Khan',
            timestamp: new Date(Date.now() - 172800000).toISOString()
        },
        {
            id: Date.now() - 259200000,
            route: 'uttara-motijheel',
            ratings: { safety: 5, hygiene: 5, punctuality: 5, overcrowding: 4 },
            comment: 'Excellent express service with AC. Worth the extra fare.',
            userName: 'Mohammad Hasan',
            timestamp: new Date(Date.now() - 259200000).toISOString()
        }
    ];

    // Add sample feedback
    const sampleFeedback = [
        {
            id: Date.now() - 345600000,
            name: 'Sarah Ahmed',
            email: 'sarah@example.com',
            subject: 'Great Platform',
            category: 'general',
            message: 'Love using TrustTrack for checking bus reviews before traveling!',
            rating: 5,
            timestamp: new Date(Date.now() - 345600000).toISOString()
        },
        {
            id: Date.now() - 432000000,
            name: 'Karim Rahman',
            email: 'karim@example.com',
            subject: 'Suggestion for improvement',
            category: 'feature-request',
            message: 'Please add night-time bus schedules as well.',
            rating: 4,
            timestamp: new Date(Date.now() - 432000000).toISOString()
        }
    ];

    // Add sample contacts
    const sampleContacts = [
        {
            id: Date.now() - 518400000,
            name: 'Rashida Begum',
            email: 'rashida@example.com',
            subject: 'Partnership Inquiry',
            message: 'We are interested in partnering with TrustTrack for our transport service.',
            timestamp: new Date(Date.now() - 518400000).toISOString(),
            status: 'pending'
        }
    ];

    // Save sample data
    localStorage.setItem('reviews', JSON.stringify(sampleReviews));
    localStorage.setItem('feedback', JSON.stringify(sampleFeedback));
    localStorage.setItem('contacts', JSON.stringify(sampleContacts));
    localStorage.setItem('sampleDataInitialized', 'true');

    console.log('Sample data initialized for TrustTrack demo');
}

// Dynamic Reviews Carousel
class ReviewsCarousel {
    constructor() {
        this.carousel = document.getElementById('reviewsCarousel');
        this.heroReview = document.getElementById('heroReview');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.currentIndex = 0;
        this.reviews = [];
        
        this.init();
    }

    init() {
        this.loadReviews();
        this.setupEventListeners();
    }    loadReviews() {
        // Try to load from both possible keys and standardize on trusttrack_reviews
        const trustTrackReviews = JSON.parse(localStorage.getItem('trusttrack_reviews') || '[]');
        const legacyReviews = JSON.parse(localStorage.getItem('trustTrackReviews') || '[]');
        console.log('Loaded trusttrack_reviews:', trustTrackReviews);
        console.log('Loaded legacy trustTrackReviews:', legacyReviews);
        
        if (trustTrackReviews.length > 0) {
            this.reviews = trustTrackReviews;
            console.log('Using trusttrack_reviews');
        } else if (legacyReviews.length > 0) {
            // Map legacy reviews to the expected format and migrate to new key
            this.reviews = legacyReviews.map(r => ({
                userName: r.userName || r.name,
                transportRoute: r.transportRoute || r.route,
                ratings: r.ratings,
                overallRating: r.overallRating || (r.ratings ? (
                    (r.ratings.safety + r.ratings.hygiene + r.ratings.punctuality + r.ratings.overcrowding) / 4
                ).toFixed(1) : undefined),
                feedback: r.feedback || r.comment,
                timestamp: r.timestamp
            }));
            localStorage.setItem('trusttrack_reviews', JSON.stringify(this.reviews));
            console.log('Migrated legacy reviews to trusttrack_reviews');
        } else {
            // Fallback to sample reviews if no stored reviews
            this.reviews = this.generateSampleReviews();
            console.log('Using sample reviews');
        }
        // Force fallback if reviews is still empty
        if (!this.reviews || this.reviews.length === 0) {
            this.reviews = this.generateSampleReviews();
            console.log('Forced fallback to sample reviews');
        }
        this.updateHeroReview();
        this.updateCarousel();
    }

    updateHeroReview() {
        if (this.reviews.length === 0) return;
        
        const latestReview = this.reviews[0];
        const stars = this.generateStars(latestReview.overallRating || latestReview.rating);
        
        this.heroReview.innerHTML = `
            <div class="card-header">
                <div class="user-info">
                    <h4>${latestReview.userName || latestReview.name}</h4>
                    <p class="route-label">${latestReview.transportRoute || latestReview.transport}</p>
                    <p class="transport-name-sober">Ena Paribahan</p>
                </div>
            </div>
            <div class="card-rating">
                ${stars}
            </div>
            <p>"${latestReview.feedback || ''}"</p>
        `;
    }

    updateCarousel() {
        if (!this.carousel) return;
        // Clear existing cards without removing the track element itself
        while (this.carousel.firstChild) {
            this.carousel.removeChild(this.carousel.firstChild);
        }
        const displayReviews = this.reviews.slice(0, 5);
        displayReviews.forEach((review, idx) => {
            const card = this.createReviewCard(review);
            if (idx === this.currentIndex) {
                card.classList.add('active');
            }
            this.carousel.appendChild(card);
        });
        // Animate cards in - removed animation for now to simplify and focus on core functionality
        // setTimeout(() => {
        //     const cards = this.carousel.querySelectorAll('.carousel-review');
        //     cards.forEach((card, idx) => {
        //         setTimeout(() => card.classList.add('active'), 100 + idx * 100);
        //     });
        // }, 10);

        // Add delay before centering to allow CSS transitions
        setTimeout(() => {
            this.centerActiveCard();
        }, 50);
    }

    createReviewCard(review) {
        const card = document.createElement('div');
        card.className = 'carousel-review review-item';

        const routeNames = {
            'dhaka-chittagong': 'Dhaka - Chittagong Highway',
            'mirpur-dhanmondi': 'Mirpur - Dhanmondi Route',
            'uttara-motijheel': 'Uttara - Motijheel Express',
            'gazipur-dhaka': 'Gazipur - Dhaka Route',
            'sylhet-dhaka': 'Sylhet - Dhaka Highway',
            'other': 'Other Route'
        };
        const routeLabel = routeNames[review.transportRoute] || review.transportRoute || 'Unknown Route';
        const transportName = review.transportName || review.transport || this.guessTransportName(routeLabel) || 'Transport Service';
        const stars = this.generateStars(review.overallRating || review.rating || 0);
        const feedback = review.feedback || 'No feedback provided.';
        const userName = review.userName || review.name || 'Anonymous';
        const timeAgo = this.getTimeAgo(review.timestamp);

        card.innerHTML = `
            <div class="review-item-header">
                <div>
                    <h3>${routeLabel}</h3>
                    <div class="transport-service">${transportName}</div>
                </div>
                <div class="overall-rating">
                    ${stars}
                </div>
            </div>
            <div class="review-feedback">"${feedback}"</div>
            <div class="review-meta">
                <span><i class="fas fa-user"></i> ${userName}</span>
                <span><i class="fas fa-clock"></i> ${timeAgo}</span>
            </div>
        `;
        return card;
    }

    // Helper to guess a transport name based on route (for sample data)
    guessTransportName(routeLabel) {
        if (!routeLabel) return '';
        if (routeLabel.toLowerCase().includes('chittagong')) return 'Ena Paribahan';
        if (routeLabel.toLowerCase().includes('dhanmondi')) return 'Shohag Paribahan';
        if (routeLabel.toLowerCase().includes('motijheel')) return 'Projapoti Paribahan';
        if (routeLabel.toLowerCase().includes('sylhet')) return 'Hanif Enterprise';
        if (routeLabel.toLowerCase().includes('gazipur')) return 'Desh Travels';
        if (routeLabel.toLowerCase().includes('uttara')) return 'Projapoti Paribahan';
        if (routeLabel.toLowerCase().includes('airport')) return 'Airport Avenue';
        return 'Local Bus';
    }

    generateStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<i class="fas fa-star"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }
        return stars;
    }

    getTimeAgo(timestamp) {
        if (!timestamp) return 'Recently';
        
        const now = new Date();
        const time = new Date(timestamp);
        const diffInMinutes = Math.floor((now - time) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
        
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
        
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }

    setupEventListeners() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.navigate(-1));
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.navigate(1));
        }

        // Optional: Add swipe functionality for touch devices
        // This would require additional event listeners and logic
    }

    navigate(direction) {
        this.currentIndex += direction;
        if (this.currentIndex < 0) {
            this.currentIndex = this.reviews.slice(0, 5).length - 1;
        } else if (this.currentIndex >= this.reviews.slice(0, 5).length) {
            this.currentIndex = 0;
        }
        this.updateCarousel();
    }

    centerActiveCard() {
        const activeCard = this.carousel.querySelector('.carousel-review.active');
        if (!activeCard) return;

        const carouselTrack = this.carousel; // The track is the carousel element itself
        const trackWidth = carouselTrack.offsetWidth;
        const cardWidth = activeCard.offsetWidth;
        const cardLeft = activeCard.offsetLeft;

        // Calculate the scroll position needed to center the active card
        // ScrollLeft = card's left position - ( (track width - card width) / 2 )
        const scrollTo = cardLeft - (trackWidth - cardWidth) / 2;

        carouselTrack.scrollTo({
            left: scrollTo,
            behavior: 'smooth'
        });
    }

    generateSampleReviews() {
        return [
            {
                userName: "Ahmed Rahman",
                transportRoute: "Dhaka - Chittagong",
                overallRating: 5,
                feedback: "Excellent service with clean buses and punctual schedule. Highly recommend for long distance travel.",
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                transportName: "Ena Paribahan"
            },
            {
                userName: "Fatima Khan",
                transportRoute: "Mirpur - Dhanmondi",
                overallRating: 4,
                feedback: "Good service overall but overcrowding during peak hours needs attention.",
                timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
                transportName: "Shohag Paribahan"
            },
            {
                userName: "Mohammad Hasan",
                transportRoute: "Uttara - Motijheel",
                overallRating: 5,
                feedback: "Outstanding air-conditioned service with comfortable seating and professional staff.",
                timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                transportName: "Projapoti Paribahan"
            },
            {
                userName: "Rashida Begum",
                transportRoute: "Dhaka - Sylhet",
                overallRating: 4,
                feedback: "Reliable service with good safety measures. Journey was comfortable and on time.",
                timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                transportName: "Hanif Enterprise"
            },
            {
                userName: "Karim Ahmed",
                transportRoute: "Gulshan - Motijheel",
                overallRating: 3,
                feedback: "Average service. Could improve hygiene standards and reduce waiting times.",
                timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                transportName: "Bhuiyan Paribahan"
            }
        ];
    }
}

// Utility functions
function showLoading(element) {
    element.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    element.disabled = true;
}

function hideLoading(element, originalText) {
    element.innerHTML = originalText;
    element.disabled = false;
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Form validation utilities
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^(\+880|880|0)?[1-9]\d{8,9}$/;
    return re.test(phone);
}

// Theme Management
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('trusttrack_theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.bindEvents();
    }

    bindEvents() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        localStorage.setItem('trusttrack_theme', this.currentTheme);
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        }

        // Update navbar background for theme
        const navbar = document.querySelector('.navbar');
        if (navbar && theme === 'dark') {
            navbar.style.background = 'rgba(26, 26, 26, 0.95)';
        } else if (navbar) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    }

    getCurrentTheme() {
        return this.currentTheme;
    }
}

// Initialize theme manager
const themeManager = new ThemeManager();

// Export functions for use in other files
window.TrustTrackUtils = {
    showLoading,
    hideLoading,
    showNotification,
    validateEmail,
    validatePhone
};


