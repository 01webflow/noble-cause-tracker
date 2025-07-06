
// Global State
let currentUser = null;
let isLoginMode = true;
let sidebarOpen = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeParticles();
    initializeEventListeners();
    animateCounters();
});

// Particle System
function initializeParticles() {
    const particlesContainer = document.querySelector('.particles');
    const particleCount = 50;

    // Clear existing particles
    particlesContainer.innerHTML = '';

    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesContainer);
    }

    // Continuously create new particles
    setInterval(() => {
        createParticle(particlesContainer);
    }, 400);
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random horizontal position
    particle.style.left = Math.random() * 100 + '%';
    
    // Random animation delay and duration
    particle.style.animationDelay = Math.random() * 20 + 's';
    particle.style.animationDuration = (15 + Math.random() * 15) + 's';
    
    container.appendChild(particle);
    
    // Remove particle after animation
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    }, 30000);
}

// Event Listeners
function initializeEventListeners() {
    // Auth form submission
    const authForm = document.getElementById('authForm');
    authForm.addEventListener('submit', handleAuthSubmit);
    
    // Menu button
    const menuBtn = document.getElementById('menuBtn');
    if (menuBtn) {
        menuBtn.addEventListener('click', toggleSidebar);
    }
    
    // Sidebar overlay (mobile)
    document.addEventListener('click', function(e) {
        const sidebar = document.getElementById('sidebar');
        const menuBtn = document.getElementById('menuBtn');
        
        if (sidebarOpen && !sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
            closeSidebar();
        }
    });
    
    // Prevent sidebar close when clicking inside
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
}

// Authentication Functions
function switchTab(mode) {
    isLoginMode = mode === 'login';
    
    // Update tab buttons
    const tabs = document.querySelectorAll('.auth-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    if (isLoginMode) {
        tabs[0].classList.add('active');
    } else {
        tabs[1].classList.add('active');
    }
    
    // Show/hide fields
    const nameFields = document.getElementById('nameFields');
    const confirmPasswordField = document.getElementById('confirmPasswordField');
    const buttonText = document.querySelector('.button-text');
    
    if (isLoginMode) {
        nameFields.style.display = 'none';
        confirmPasswordField.style.display = 'none';
        buttonText.textContent = 'Sign In';
    } else {
        nameFields.style.display = 'block';
        confirmPasswordField.style.display = 'block';
        buttonText.textContent = 'Create Account';
    }
    
    // Add animation
    const authForm = document.getElementById('authForm');
    authForm.classList.add('fade-in');
    setTimeout(() => authForm.classList.remove('fade-in'), 500);
}

function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const button = field.nextElementSibling;
    const icon = button.querySelector('i');
    
    if (field.type === 'password') {
        field.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        field.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

function handleAuthSubmit(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    
    // Basic validation
    if (!email || !password) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    if (!isLoginMode) {
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (!firstName || !lastName) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            showNotification('Passwords do not match', 'error');
            return;
        }
    }
    
    // Show loading state
    const button = document.querySelector('.auth-button');
    const buttonText = document.querySelector('.button-text');
    const loadingIcon = document.querySelector('.loading-icon');
    
    buttonText.style.display = 'none';
    loadingIcon.style.display = 'inline-block';
    button.disabled = true;
    
    // Simulate authentication
    setTimeout(() => {
        login(email, role);
    }, 1500);
}

function login(email, role) {
    currentUser = {
        email: email,
        name: email.split('@')[0],
        role: role
    };
    
    // Update UI with user info
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('userRole').textContent = role.replace('_', ' ');
    
    // Switch to dashboard
    document.getElementById('authSection').style.display = 'none';
    document.getElementById('dashboardSection').style.display = 'block';
    
    // Show success notification
    showNotification('Welcome to Noble Cause Tracker!', 'success');
    
    // Animate dashboard elements
    animateDashboardEntry();
    animateCounters();
}

function logout() {
    currentUser = null;
    
    // Reset form
    document.getElementById('authForm').reset();
    const button = document.querySelector('.auth-button');
    const buttonText = document.querySelector('.button-text');
    const loadingIcon = document.querySelector('.loading-icon');
    
    buttonText.style.display = 'inline-block';
    loadingIcon.style.display = 'none';
    button.disabled = false;
    
    // Switch back to auth
    document.getElementById('dashboardSection').style.display = 'none';
    document.getElementById('authSection').style.display = 'flex';
    
    showNotification('Logged out successfully', 'info');
}

// Dashboard Functions
function switchSection(sectionId) {
    // Update active menu item
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => item.classList.remove('active'));
    
    // Find and activate the correct menu item
    const activeItem = Array.from(menuItems).find(item => 
        item.getAttribute('onclick').includes(sectionId)
    );
    if (activeItem) {
        activeItem.classList.add('active');
    }
    
    // Close sidebar on mobile
    if (window.innerWidth <= 1024) {
        closeSidebar();
    }
    
    // Here you would typically load different content based on the section
    showNotification(`Switched to ${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}`, 'info');
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebarOpen = !sidebarOpen;
    
    if (sidebarOpen) {
        sidebar.classList.add('open');
    } else {
        sidebar.classList.remove('open');
    }
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.remove('open');
    sidebarOpen = false;
}

// Animation Functions
function animateDashboardEntry() {
    const elements = document.querySelectorAll('.stat-card, .chart-card, .activities-card');
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(50px) rotateX(-20deg)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.6s ease-out';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0) rotateX(0)';
        }, index * 100);
    });
}

function animateCounters() {
    const counters = document.querySelectorAll('.stat-value');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const startTime = Date.now();
        const startValue = 0;
        
        function updateCounter() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(startValue + (target - startValue) * easeOutQuart);
            
            // Format the value based on the counter type
            if (counter.textContent.includes('$')) {
                counter.textContent = '$' + currentValue.toLocaleString();
            } else if (counter.textContent.includes('%')) {
                counter.textContent = currentValue + '%';
            } else {
                counter.textContent = currentValue.toLocaleString();
            }
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }
        
        // Start animation after a delay for each counter
        const delay = Array.from(counters).indexOf(counter) * 200;
        setTimeout(() => {
            requestAnimationFrame(updateCounter);
        }, delay);
    });
}

// Utility Functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
    `;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '2rem',
        right: '2rem',
        padding: '1rem 1.5rem',
        borderRadius: '1rem',
        color: 'white',
        fontWeight: '500',
        zIndex: '1000',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        minWidth: '300px',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease-out'
    });
    
    // Set background based on type
    const backgrounds = {
        success: 'linear-gradient(135deg, rgba(16, 185, 129, 0.9), rgba(5, 150, 105, 0.9))',
        error: 'linear-gradient(135deg, rgba(239, 68, 68, 0.9), rgba(220, 38, 38, 0.9))',
        info: 'linear-gradient(135deg, rgba(59, 130, 246, 0.9), rgba(37, 99, 235, 0.9))',
        warning: 'linear-gradient(135deg, rgba(245, 158, 11, 0.9), rgba(217, 119, 6, 0.9))'
    };
    
    notification.style.background = backgrounds[type] || backgrounds.info;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        info: 'info-circle',
        warning: 'exclamation-triangle'
    };
    return icons[type] || icons.info;
}

// Responsive handling
window.addEventListener('resize', function() {
    if (window.innerWidth > 1024) {
        closeSidebar();
    }
});

// Add smooth scrolling
document.documentElement.style.scrollBehavior = 'smooth';

// Add intersection observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observe elements when dashboard loads
function observeElements() {
    const elements = document.querySelectorAll('.stat-card, .chart-card, .activity-item');
    elements.forEach(el => observer.observe(el));
}

// Call this when dashboard is shown
setTimeout(observeElements, 100);
