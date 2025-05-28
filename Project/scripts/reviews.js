// Reviews Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // No authentication check needed
    // Initialize star ratings
    initializeStarRatings();
    // Initialize file upload
    initializeFileUpload();
    // Initialize form submission
    initializeFormSubmission();
    // Load recent reviews
    loadRecentReviews();
});

// Star rating system
function initializeStarRatings() {
    const starRatings = document.querySelectorAll('.star-rating');
    
    starRatings.forEach(rating => {
        const stars = rating.querySelectorAll('i');
        const ratingType = rating.dataset.rating;
        const ratingText = rating.parentElement.querySelector('.rating-text');
        
        stars.forEach((star, index) => {
            star.addEventListener('click', function() {
                const value = parseInt(this.dataset.value);
                updateRating(rating, value, ratingText);
            });
            
            star.addEventListener('mouseenter', function() {
                highlightStars(rating, parseInt(this.dataset.value));
            });
        });
        
        rating.addEventListener('mouseleave', function() {
            const currentRating = parseInt(this.dataset.currentRating) || 0;
            highlightStars(this, currentRating);
        });
    });
}

function updateRating(ratingElement, value, textElement) {
    ratingElement.dataset.currentRating = value;
    highlightStars(ratingElement, value);
    
    const ratingTexts = {
        1: 'Poor',
        2: 'Fair',
        3: 'Good',
        4: 'Very Good',
        5: 'Excellent'
    };
    
    textElement.textContent = ratingTexts[value];
}

function highlightStars(ratingElement, value) {
    const stars = ratingElement.querySelectorAll('i');
    stars.forEach((star, index) => {
        if (index < value) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

// File upload functionality
function initializeFileUpload() {
    const fileInput = document.getElementById('photo');
    const fileLabel = document.querySelector('.file-upload-label span');
    const filePreview = document.getElementById('filePreview');
    
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            if (file.type.startsWith('image/')) {
                fileLabel.textContent = file.name;
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    filePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                };
                reader.readAsDataURL(file);
            } else {
                alert('Please select an image file.');
                fileInput.value = '';
                fileLabel.textContent = 'Choose Photo';
                filePreview.innerHTML = '';
            }
        }
    });
}

// Form submission
function initializeFormSubmission() {
    const form = document.getElementById('reviewForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            submitReview();
        }
    });
}

function validateForm() {
    const transportRoute = document.getElementById('transportRoute').value;
    
    if (!transportRoute) {
        showNotification('Please select a transport route.', 'error');
        return false;
    }
    
    // Check if at least one rating is provided
    const ratings = document.querySelectorAll('.star-rating');
    let hasRating = false;
    
    ratings.forEach(rating => {
        if (rating.dataset.currentRating) {
            hasRating = true;
        }
    });
    
    if (!hasRating) {
        showNotification('Please provide at least one rating.', 'error');
        return false;
    }
    
    return true;
}

function submitReview() {
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    showLoading(submitBtn);
    
    // Collect form data
    const formData = collectFormData();
    
    // Simulate API call
    setTimeout(() => {
        // Save to localStorage for demo purposes
        saveReview(formData);
        
        hideLoading(submitBtn, originalText);
        showNotification('Review submitted successfully! Thank you for your feedback.', 'success');
        
        // Reset form
        resetForm();
        
        // Reload recent reviews
        loadRecentReviews();
    }, 2000);
}

function collectFormData() {
    const ratings = {};
    document.querySelectorAll('.star-rating').forEach(rating => {
        const type = rating.dataset.rating;
        const value = parseInt(rating.dataset.currentRating) || 0;
        ratings[type] = value;
    });
    
    return {
        id: Date.now(),
        transportRoute: document.getElementById('transportRoute').value,
        ratings: ratings,
        feedback: document.getElementById('feedback').value,
        userName: document.getElementById('userName').value || 'Anonymous',
        timestamp: new Date().toISOString(),
        overallRating: calculateOverallRating(ratings)
    };
}

function calculateOverallRating(ratings) {
    const values = Object.values(ratings).filter(val => val > 0);
    if (values.length === 0) return 0;
    return (values.reduce((sum, val) => sum + val, 0) / values.length).toFixed(1);
}

function saveReview(reviewData) {
    let reviews = JSON.parse(localStorage.getItem('trusttrack_reviews') || '[]');
    reviews.unshift(reviewData);
    
    // Keep only the latest 50 reviews
    reviews = reviews.slice(0, 50);
    
    localStorage.setItem('trusttrack_reviews', JSON.stringify(reviews));
}

function resetForm() {
    document.getElementById('reviewForm').reset();
    
    // Reset star ratings
    document.querySelectorAll('.star-rating').forEach(rating => {
        delete rating.dataset.currentRating;
        rating.querySelectorAll('i').forEach(star => {
            star.classList.remove('active');
        });
    });
    
    // Reset rating texts
    document.querySelectorAll('.rating-text').forEach(text => {
        text.textContent = 'Not rated';
    });
    
    // Reset file upload
    document.querySelector('.file-upload-label span').textContent = 'Choose Photo';
    document.getElementById('filePreview').innerHTML = '';
}

// Load and display recent reviews
function loadRecentReviews() {
    const reviews = JSON.parse(localStorage.getItem('trusttrack_reviews') || '[]');
    const container = document.getElementById('recentReviews');
    
    if (reviews.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; color: #666; padding: 3rem;">
                <i class="fas fa-comments" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <p>No reviews yet. Be the first to share your experience!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = reviews.slice(0, 6).map(review => createReviewHTML(review)).join('');
}

function createReviewHTML(review) {
    const routeNames = {
        'dhaka-chittagong': 'Dhaka - Chittagong Highway',
        'mirpur-dhanmondi': 'Mirpur - Dhanmondi Route',
        'uttara-motijheel': 'Uttara - Motijheel Express',
        'gazipur-dhaka': 'Gazipur - Dhaka Route',
        'sylhet-dhaka': 'Sylhet - Dhaka Highway',
        'other': 'Other Route'
    };
    const timeAgo = getTimeAgo(review.timestamp);
    const stars = generateStars(review.overallRating);
    return `
        <div class="review-item">
            <div class="review-item-header">
                <h3>${routeNames[review.transportRoute] || review.transportRoute}</h3>
                <div class="overall-rating">
                    ${stars}
                </div>
            </div>
            <div class="review-feedback">"${review.feedback}"</div>
            <div class="review-meta">
                <span><i class="fas fa-user"></i> ${review.userName}</span>
                <span><i class="fas fa-clock"></i> ${timeAgo}</span>
            </div>
        </div>
    `;
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

function getTimeAgo(timestamp) {
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

// Utility function to show notifications (using the global function)
function showNotification(message, type = 'success') {
    if (window.TrustTrackUtils && window.TrustTrackUtils.showNotification) {
        window.TrustTrackUtils.showNotification(message, type);
    } else {
        alert(message); // Fallback
    }
}

function showLoading(element) {
    if (window.TrustTrackUtils && window.TrustTrackUtils.showLoading) {
        window.TrustTrackUtils.showLoading(element);
    }
}

function hideLoading(element, originalText) {
    if (window.TrustTrackUtils && window.TrustTrackUtils.hideLoading) {
        window.TrustTrackUtils.hideLoading(element, originalText);
    }
}
