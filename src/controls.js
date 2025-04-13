// Track which keys are currently pressed
const keysPressed = {};

// Movement constants
const MOVEMENT_SPEED = 5; // units per second
const TURN_SPEED = 2; // radians per second

/**
 * Sets up keyboard controls for the horse
 * @param {THREE.Group} horse - The horse 3D model
 * @returns {Function} updateControls function to be called in the game loop
 */
export function setupControls(horse) {
    // Add event listeners for keyboard input
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Handle key press
    function handleKeyDown(event) {
        keysPressed[event.key.toLowerCase()] = true;
    }

    // Handle key release
    function handleKeyUp(event) {
        keysPressed[event.key.toLowerCase()] = false;
    }

    /**
     * Updates the horse's position and rotation based on keyboard input
     * @param {number} deltaTime - Time since last frame in seconds
     */
    function updateControls(deltaTime) {
        // Forward/backward movement
        if (keysPressed['w'] || keysPressed['arrowup']) {
            horse.position.x += Math.sin(horse.rotation.y) * MOVEMENT_SPEED * deltaTime;
            horse.position.z += Math.cos(horse.rotation.y) * MOVEMENT_SPEED * deltaTime;
        }
        if (keysPressed['s'] || keysPressed['arrowdown']) {
            horse.position.x -= Math.sin(horse.rotation.y) * MOVEMENT_SPEED * deltaTime;
            horse.position.z -= Math.cos(horse.rotation.y) * MOVEMENT_SPEED * deltaTime;
        }

        // Left/right turning
        if (keysPressed['a'] || keysPressed['arrowleft']) {
            horse.rotation.y += TURN_SPEED * deltaTime;
        }
        if (keysPressed['d'] || keysPressed['arrowright']) {
            horse.rotation.y -= TURN_SPEED * deltaTime;
        }
    }

    // Return the update function
    return updateControls;
} 