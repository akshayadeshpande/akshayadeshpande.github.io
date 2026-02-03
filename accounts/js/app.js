/**
 * Main application logic
 * - URL parsing and user lookup
 * - Password authentication
 * - State management
 * - Flow orchestration
 */

import { getUserById } from './data.js';
import { deriveKey, decryptData, isWebCryptoSupported, base64ToArrayBuffer } from './crypto.js';
import {
    PhotoScroll,
    EvasiveButton,
    showState,
    showError,
    showPasswordError,
    clearPasswordError,
    loadPhotosAndQuotes
} from './ui.js';

// Application state
const AppState = {
    LOADING: 'LOADING',
    PASSWORD_PROMPT: 'PASSWORD_PROMPT',
    DECRYPTING: 'DECRYPTING',
    ERROR: 'ERROR',
    PHOTO_EXPERIENCE: 'PHOTO_EXPERIENCE',
    QUESTION: 'QUESTION',
    SUCCESS: 'SUCCESS',
    THANK_YOU: 'THANK_YOU'
};

// Global app data
let currentState = AppState.LOADING;
let currentUserId = null;
let userData = null;
let decryptedData = null;
let photoScroll = null;
let attemptsRemaining = 3;
let backgroundMusic = null;

/**
 * Initialize the application
 */
async function init() {
    // Check Web Crypto API support
    if (!isWebCryptoSupported()) {
        showError('Your browser does not support the required encryption features. Please use a modern browser like Chrome, Firefox, or Safari.');
        return;
    }

    // Parse user ID from URL hash
    const hash = window.location.hash;
    if (!hash || hash.length <= 1) {
        showError('Invalid URL. Please use the link provided to you.');
        return;
    }

    // Extract user ID (remove '#' from hash)
    currentUserId = hash.substring(1);

    // Lookup user data
    userData = getUserById(currentUserId);

    if (!userData) {
        showError('Invalid user ID. Please check your link and try again.');
        return;
    }

    // Transition to password prompt
    transitionTo(AppState.PASSWORD_PROMPT);
}

/**
 * Transition to a new state
 */
function transitionTo(newState) {
    currentState = newState;

    switch (newState) {
        case AppState.LOADING:
            showState('loading-state');
            break;

        case AppState.PASSWORD_PROMPT:
            showState('password-state');
            setupPasswordForm();
            break;

        case AppState.PHOTO_EXPERIENCE:
            showState('photo-state');
            setupPhotoExperience();
            break;

        case AppState.QUESTION:
            showState('question-state');
            setupQuestionScreen();
            break;

        case AppState.SUCCESS:
            showState('success-state');
            break;

        case AppState.THANK_YOU:
            showState('thankyou-state');
            setupThankYouScreen();
            break;

        case AppState.ERROR:
            showState('error-state');
            break;
    }
}

/**
 * Setup password form
 */
function setupPasswordForm() {
    const form = document.getElementById('password-form');
    const input = document.getElementById('password-input');
    const unlockBtn = document.getElementById('unlock-btn');

    if (!form || !input || !unlockBtn) return;

    // Clear any previous errors
    clearPasswordError();

    // Focus on input
    setTimeout(() => input.focus(), 100);

    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handlePasswordSubmit(input.value, unlockBtn);
    });
}

/**
 * Handle password submission
 */
async function handlePasswordSubmit(password, button) {
    // Validate password
    if (!password || password.length < 12) {
        showPasswordError('Password must be at least 12 characters long.');
        return;
    }

    // Disable form during processing
    button.disabled = true;
    button.innerHTML = '<span>Unlocking...</span>';
    clearPasswordError();

    try {
        // Derive key from password
        const salt = base64ToArrayBuffer(userData.salt);
        const key = await deriveKey(password, salt);

        // Decrypt data
        const decrypted = await decryptData(
            userData.encryptedData,
            userData.iv,
            key
        );

        // Store decrypted data
        decryptedData = decrypted;

        // Clear password from memory
        password = null;

        // Start background music
        startBackgroundMusic();

        // Transition to photo experience
        transitionTo(AppState.PHOTO_EXPERIENCE);

    } catch (error) {
        // Decryption failed - wrong password
        attemptsRemaining--;

        if (attemptsRemaining > 0) {
            showPasswordError(
                'Incorrect password. Please try again.',
                attemptsRemaining
            );

            // Re-enable form
            button.disabled = false;
            button.innerHTML = '<span>Unlock Message</span>';
        } else {
            // No attempts left
            showError('Too many failed attempts. Please contact the person who sent you this link.');
        }
    }
}

/**
 * Reset scroll position to top
 */
function resetScrollToTop(element) {
    if (!element) return;
    element.scrollTop = 0;
    element.scrollLeft = 0;
}

/**
 * Setup photo experience
 */
async function setupPhotoExperience() {
    const photoContainer = document.getElementById('photo-scroll-container');
    const photoState = document.getElementById('photo-state');

    if (!photoContainer || !photoState) return;

    // Clear container first
    photoContainer.innerHTML = '';

    // Reset scroll position immediately and aggressively
    resetScrollToTop(photoState);

    // Check if this is a "thank you" user (already said yes)
    if (userData.showThankYou) {
        transitionTo(AppState.THANK_YOU);
        return;
    }

    // Check if user has photos
    if (!userData.hasPhotos) {
        // Skip to question if no photos
        transitionTo(AppState.QUESTION);
        return;
    }

    // Load photos and quotes
    const photos = await loadPhotosAndQuotes(currentUserId);

    if (!photos || photos.length === 0) {
        // Skip to question if no photos
        transitionTo(AppState.QUESTION);
        return;
    }

    // Reset again before render
    resetScrollToTop(photoState);

    // Create photo scroll
    photoScroll = new PhotoScroll(photos, photoContainer);
    photoScroll.setUserId(currentUserId);
    photoScroll.setRecipientName(decryptedData.name);
    await photoScroll.render();

    // Force scroll to top after render - multiple attempts with different timings
    resetScrollToTop(photoState);

    // Immediate next frame
    requestAnimationFrame(() => {
        resetScrollToTop(photoState);
    });

    // After short delay
    setTimeout(() => {
        resetScrollToTop(photoState);
    }, 50);

    // After render completes
    setTimeout(() => {
        resetScrollToTop(photoState);
        // Scroll the first section into view as a fallback
        const firstSection = photoContainer.querySelector('.photo-section[data-index="0"]');
        if (firstSection) {
            firstSection.scrollIntoView({ behavior: 'instant', block: 'start' });
        }
    }, 200);

    // Listen for custom event to transition to success
    window.addEventListener('showSuccess', () => {
        if (photoScroll) {
            photoScroll.destroy();
        }
        transitionTo(AppState.SUCCESS);
    }, { once: true });
}

/**
 * Setup question screen
 */
function setupQuestionScreen() {
    const recipientName = document.getElementById('recipient-name');
    const personalMessage = document.getElementById('personal-message');
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');

    if (!recipientName || !personalMessage || !yesBtn || !noBtn) return;

    // Set recipient name
    recipientName.textContent = decryptedData.name || 'there';

    // Set personal message
    if (decryptedData.message) {
        personalMessage.textContent = decryptedData.message;
    } else {
        personalMessage.style.display = 'none';
    }

    // Setup "Yes" button
    yesBtn.addEventListener('click', () => {
        transitionTo(AppState.SUCCESS);
    });

    // Setup evasive "No" button
    const evasiveButton = new EvasiveButton(noBtn);
}

/**
 * Setup thank you screen with timer
 */
function setupThankYouScreen() {
    // Valentine's Day 2025 - the day she said yes
    const startDate = new Date('2025-02-14T00:00:00');

    function updateTimer() {
        const now = new Date();
        const diff = now - startDate;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('timer-days').textContent = days;
        document.getElementById('timer-hours').textContent = hours;
        document.getElementById('timer-minutes').textContent = minutes;
        document.getElementById('timer-seconds').textContent = seconds;
    }

    // Update immediately and then every second
    updateTimer();
    setInterval(updateTimer, 1000);
}

/**
 * Start background music
 */
function startBackgroundMusic() {
    try {
        backgroundMusic = document.getElementById('background-music');
        if (backgroundMusic) {
            backgroundMusic.volume = 0.3; // Set volume to 30%
            backgroundMusic.play().catch(err => {
                console.log('Music autoplay prevented:', err);
            });
        }
    } catch (error) {
        console.log('Error starting music:', error);
    }
}


// Initialize app when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
