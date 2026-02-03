/**
 * UI components and interactions
 * - PhotoScroll: Vertical scroll photo experience with quotes
 * - Evasive "No" button: Moves on hover/touch
 * - View state management
 */

/**
 * PhotoScroll component
 * Manages vertical scrolling photo experience with quotes
 */
export class PhotoScroll {
    constructor(photos, containerElement) {
        this.photos = photos; // Array of {filename, quote}
        this.userId = null;
        this.recipientName = '';
        this.container = containerElement;
        this.currentIndex = 0;
        this.observer = null;
    }

    /**
     * Set user ID for photo loading
     */
    setUserId(userId) {
        this.userId = userId;
    }

    /**
     * Set recipient name for final question
     */
    setRecipientName(name) {
        this.recipientName = name;
    }

    /**
     * Render the photo scroll experience
     */
    async render() {
        if (!this.userId) {
            console.error('User ID not set for PhotoScroll');
            return;
        }

        console.log(`Rendering ${this.photos.length} photos`);

        // Get parent scroll container and reset its position
        const scrollParent = this.container.closest('#photo-state');
        if (scrollParent) {
            scrollParent.scrollTop = 0;
        }

        this.container.innerHTML = '';

        // Add suspense intro section
        const suspenseSection = document.createElement('div');
        suspenseSection.className = 'photo-section visible';
        suspenseSection.dataset.index = 0;
        suspenseSection.innerHTML = `
            <div class="photo-wrapper" style="text-align: center;">
                <div class="photo-quote" style="font-size: 2.5rem; margin-bottom: 24px;">
                    There's this girl...
                </div>
            </div>
        `;
        this.container.appendChild(suspenseSection);

        // Create photo sections (start at index 1 because of suspense intro)
        for (let i = 0; i < this.photos.length; i++) {
            const photo = this.photos[i];
            const photoPath = `photos/${this.userId}/${encodeURIComponent(photo.filename)}`;

            const section = document.createElement('div');
            section.className = 'photo-section';
            section.dataset.index = i + 1;

            const wrapper = document.createElement('div');
            wrapper.className = 'photo-wrapper';

            // Photo container
            const imageContainer = document.createElement('div');
            imageContainer.className = 'photo-image-container';

            const img = document.createElement('img');
            img.src = photoPath;
            img.alt = `Photo ${i + 1}`;
            img.className = 'photo-image';
            img.loading = i === 0 ? 'eager' : 'lazy';

            imageContainer.appendChild(img);
            wrapper.appendChild(imageContainer);

            // Quote
            const quote = document.createElement('div');
            quote.className = 'photo-quote';
            quote.textContent = photo.quote;

            wrapper.appendChild(quote);
            section.appendChild(wrapper);
            this.container.appendChild(section);
        }

        // Add "But the real question is" section
        const transitionSection = document.createElement('div');
        transitionSection.className = 'photo-section';
        transitionSection.dataset.index = this.photos.length + 1;
        transitionSection.innerHTML = `
            <div class="photo-wrapper" style="text-align: center;">
                <div class="photo-quote" style="font-size: 2rem; margin-bottom: 24px;">
                    But the real question is
                </div>
            </div>
        `;
        this.container.appendChild(transitionSection);

        // Add "will she be my valentine?" section
        const questionSection = document.createElement('div');
        questionSection.className = 'photo-section';
        questionSection.dataset.index = this.photos.length + 2;
        questionSection.innerHTML = `
            <div class="photo-wrapper" style="text-align: center;">
                <div class="photo-quote" style="font-size: 2.5rem; margin-bottom: 24px;">
                    will she be my valentine?
                </div>
            </div>
        `;
        this.container.appendChild(questionSection);

        // Add final "So [Name], will you be my Valentine?" section
        const finalSection = document.createElement('div');
        finalSection.className = 'photo-section';
        finalSection.dataset.index = this.photos.length + 3;
        const displayName = this.recipientName || 'there';
        finalSection.innerHTML = `
            <div class="photo-wrapper" style="text-align: center;">
                <div class="photo-quote" style="font-size: 2.5rem; margin-bottom: 24px;">
                    So ${displayName}, will you be my Valentine?
                </div>
            </div>
        `;
        this.container.appendChild(finalSection);

        // Add answer section with Yes/No buttons
        const answerSection = document.createElement('div');
        answerSection.className = 'photo-section';
        answerSection.id = 'answer-section';
        answerSection.dataset.index = this.photos.length + 4;
        answerSection.innerHTML = `
            <div class="photo-wrapper" style="text-align: center; max-width: 500px;">
                <div class="button-container-scroll">
                    <button class="btn-yes-scroll" id="yes-btn-scroll">Yes! 💖</button>
                    <button class="btn-no-scroll" id="no-btn-scroll">No</button>
                    <div class="dare-text">I dare you to click "No" :)</div>
                </div>
                <div class="success-message-inline hidden" id="success-inline">
                    <div class="success-heart">💖</div>
                    <div class="success-text-inline">I knew you'd say yes!</div>
                    <div class="success-subtext">Can't wait to spend Valentine's Day with you, ${this.recipientName || 'you'} 💕</div>
                </div>
            </div>
        `;
        this.container.appendChild(answerSection);

        // Set up event listeners
        this.setupEventListeners();

        // Render progress dots first
        this.renderProgressDots();

        // Reset scroll position before setting up observer
        if (scrollParent) {
            scrollParent.scrollTop = 0;
        }

        // Set up intersection observer for progress dots (after scroll reset)
        setTimeout(() => {
            this.setupIntersectionObserver();
        }, 150);
    }

    /**
     * Render progress dots
     */
    renderProgressDots() {
        const dotsContainer = document.getElementById('progress-indicator');
        if (!dotsContainer) return;

        dotsContainer.innerHTML = '';

        // Include suspense intro + final 4 sections in count (suspense + transition + question + final + answer)
        const totalSections = this.photos.length + 5;

        for (let i = 0; i < totalSections; i++) {
            const dot = document.createElement('div');
            dot.className = 'progress-dot';
            if (i === 0) {
                dot.classList.add('active');
            }
            dot.dataset.index = i;

            dot.addEventListener('click', () => {
                const section = document.querySelector(`.photo-section[data-index="${i}"]`);
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth' });
                }
            });

            dotsContainer.appendChild(dot);
        }
    }

    /**
     * Setup intersection observer for progress tracking
     */
    setupIntersectionObserver() {
        // Use the photo-state as the root for observation
        const scrollRoot = document.getElementById('photo-state');

        const options = {
            root: scrollRoot,
            threshold: 0.2
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const index = parseInt(entry.target.dataset.index);
                    this.updateProgressDots(index);

                    // Add visible class for fade-in animation
                    entry.target.classList.add('visible');

                    // Hide scroll indicator after first photo
                    if (index > 0) {
                        const scrollIndicator = document.getElementById('scroll-indicator');
                        if (scrollIndicator) {
                            scrollIndicator.style.opacity = '0';
                        }
                    }
                }
            });
        }, options);

        // Observe all photo sections
        const sections = this.container.querySelectorAll('.photo-section');
        sections.forEach(section => {
            this.observer.observe(section);
        });
    }

    /**
     * Update progress dots
     */
    updateProgressDots(activeIndex) {
        const dots = document.querySelectorAll('.progress-dot');
        dots.forEach((dot, index) => {
            if (index === activeIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Yes button - show inline success message with confetti
        const yesBtn = document.getElementById('yes-btn-scroll');
        if (yesBtn) {
            yesBtn.addEventListener('click', () => {
                // Trigger confetti
                createConfetti();

                // Hide the buttons
                const buttonContainer = document.querySelector('.button-container-scroll');
                if (buttonContainer) {
                    buttonContainer.style.display = 'none';
                }
                // Show the success message
                const successInline = document.getElementById('success-inline');
                if (successInline) {
                    successInline.classList.remove('hidden');
                }
            });
        }

        // No button - evasive
        const noBtn = document.getElementById('no-btn-scroll');
        if (noBtn) {
            const evasiveButton = new EvasiveButton(noBtn);
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown' || e.key === ' ') {
                e.preventDefault();
                this.scrollToNext();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.scrollToPrevious();
            }
        });
    }

    /**
     * Scroll to next section
     */
    scrollToNext() {
        const currentSection = document.querySelector(`.photo-section[data-index="${this.currentIndex}"]`);
        const nextSection = currentSection?.nextElementSibling;

        if (nextSection && nextSection.classList.contains('photo-section')) {
            nextSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    /**
     * Scroll to previous section
     */
    scrollToPrevious() {
        const currentSection = document.querySelector(`.photo-section[data-index="${this.currentIndex}"]`);
        const prevSection = currentSection?.previousElementSibling;

        if (prevSection && prevSection.classList.contains('photo-section')) {
            prevSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    /**
     * Destroy the scroll experience and clean up
     */
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
        this.container.innerHTML = '';
    }
}

/**
 * Evasive "No" button
 * Moves randomly when user tries to interact with it
 */
export class EvasiveButton {
    constructor(buttonElement) {
        this.button = buttonElement;
        this.shrinkLevel = 1;
        this.setupEventListeners();
    }

    /**
     * Setup event listeners for evasive behavior
     */
    setupEventListeners() {
        // Desktop: move on mouseenter
        this.button.addEventListener('mouseenter', () => {
            this.moveButtonRandomly();
        });

        // Mobile: move on touchstart
        this.button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.moveButtonRandomly();
        });

        // Prevent clicking
        this.button.addEventListener('click', (e) => {
            e.preventDefault();
            this.moveButtonRandomly();
        });
    }

    /**
     * Move button to random position and shrink it
     */
    moveButtonRandomly() {
        const button = this.button;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        // Shrink the button each time
        this.shrinkLevel = Math.max(0.3, this.shrinkLevel - 0.1);
        button.style.transform = `scale(${this.shrinkLevel})`;

        // Get button dimensions
        const buttonRect = button.getBoundingClientRect();
        const buttonWidth = buttonRect.width;
        const buttonHeight = buttonRect.height;

        // Calculate safe bounds (keep button within viewport with margin)
        const margin = 20;
        const maxX = windowWidth - buttonWidth - margin;
        const maxY = windowHeight - buttonHeight - margin;

        // Generate random position
        const randomX = Math.random() * maxX + margin;
        const randomY = Math.random() * maxY + margin;

        // Apply position
        button.style.position = 'fixed';
        button.style.left = `${randomX}px`;
        button.style.top = `${randomY}px`;
        button.style.transition = 'all 0.3s ease';
    }
}

/**
 * Show a specific state and hide others
 */
export function showState(stateName) {
    const states = [
        'loading-state',
        'password-state',
        'photo-state',
        'question-state',
        'success-state',
        'error-state'
    ];

    states.forEach(state => {
        const element = document.getElementById(state);
        if (element) {
            if (state === stateName) {
                element.classList.remove('hidden');
                // Reset scroll position when showing photo state
                if (state === 'photo-state') {
                    element.scrollTop = 0;
                }
            } else {
                element.classList.add('hidden');
            }
        }
    });
}

/**
 * Show error message
 */
export function showError(message) {
    const errorText = document.getElementById('error-text');
    if (errorText) {
        errorText.textContent = message;
    }
    showState('error-state');
}

/**
 * Update password error message
 */
export function showPasswordError(message, attemptsLeft = null) {
    const errorElement = document.getElementById('password-error');
    const attemptsElement = document.getElementById('attempts-left');

    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
    }

    if (attemptsElement && attemptsLeft !== null) {
        attemptsElement.textContent = `Attempts remaining: ${attemptsLeft}`;
        attemptsElement.classList.remove('hidden');
    }
}

/**
 * Clear password error
 */
export function clearPasswordError() {
    const errorElement = document.getElementById('password-error');
    const attemptsElement = document.getElementById('attempts-left');

    if (errorElement) {
        errorElement.classList.add('hidden');
    }

    if (attemptsElement) {
        attemptsElement.classList.add('hidden');
    }
}

/**
 * Load photos and quotes for a user
 */
export async function loadPhotosAndQuotes(userId) {
    try {
        const response = await fetch(`photos/${userId}/quotes.json`);
        if (!response.ok) {
            throw new Error('Photos not found');
        }
        const data = await response.json();
        return data.photos;
    } catch (error) {
        console.error('Error loading photos:', error);
        return null;
    }
}

/**
 * Create confetti explosion
 */
function createConfetti() {
    const container = document.createElement('div');
    container.className = 'confetti-container';
    document.body.appendChild(container);

    const colors = ['#FF385C', '#FF6B9D', '#FFD700', '#FF69B4', '#FFC0CB', '#FF1493'];
    const shapes = ['square', 'circle'];

    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';

        const color = colors[Math.floor(Math.random() * colors.length)];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];

        confetti.style.backgroundColor = color;
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-10px';
        confetti.style.borderRadius = shape === 'circle' ? '50%' : '0';
        confetti.style.animationDelay = Math.random() * 2 + 's';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';

        container.appendChild(confetti);
    }

    // Remove container after animation
    setTimeout(() => {
        container.remove();
    }, 5000);
}
