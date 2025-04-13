import * as THREE from 'three';
import { setupScene } from './scene.js';
import { createHorse } from './loader.js';
import { setupControls } from './controls.js';
import { Race } from './race.js';
import { UI } from './ui.js';

// Game state
let scene, camera, renderer;
let horse = null;
let aiHorse = null;
let updateControls = null;
let race = null;
let ui = null;
let clock = new THREE.Clock();

// Initialize the game
async function init() {
    try {
        // Setup scene and get references
        const sceneSetup = setupScene();
        scene = sceneSetup.scene;
        camera = sceneSetup.camera;
        renderer = sceneSetup.renderer;

        // Create horses using basic shapes
        horse = createHorse();
        aiHorse = createHorse();

        // Position AI horse
        aiHorse.position.x = 3;
        aiHorse.scale.set(0.5, 0.5, 0.5);
        aiHorse.rotation.y = Math.PI;

        // Add horses to scene
        scene.add(horse);
        scene.add(aiHorse);

        // Setup race
        race = new Race(scene);
        race.init();

        // Setup controls
        updateControls = setupControls(horse);

        // Setup UI
        ui = new UI();

        // Hide loading screen
        document.getElementById('loadingScreen').classList.add('hidden');

        // Start race
        race.startRace();

        // Start animation loop
        animate();
    } catch (error) {
        console.error('Failed to initialize game:', error);
        document.getElementById('loadingScreen').textContent = 'Failed to load game. Please refresh.';
    }
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    const deltaTime = clock.getDelta();

    if (updateControls) {
        updateControls(deltaTime);
    }

    if (race) {
        race.update(deltaTime, horse, aiHorse);
        const raceState = race.getRaceState();
        
        // Update UI
        ui.updateSpeed(raceState.playerSpeed);
        ui.updateProgress(raceState.playerProgress, race.trackLength);
        ui.updateRaceStatus(`Race Progress: ${Math.floor((raceState.playerProgress / race.trackLength) * 100)}%`);

        // Check for race end
        if (raceState.isFinished) {
            if (raceState.winner === 'player') {
                ui.showWinMessage();
            } else {
                ui.showLoseMessage();
            }
        }
    }

    renderer.render(scene, camera);
}

// Handle window resize
function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Add event listeners
window.addEventListener('resize', handleResize);
window.addEventListener('load', init); 