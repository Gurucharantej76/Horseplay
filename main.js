import * as THREE from 'three';
import { loadGLTFModel } from './utils/loader.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB); // Sky blue background

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);

// Renderer setup
const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('gameCanvas'),
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
scene.add(directionalLight);

// Create race track (ground)
const groundGeometry = new THREE.PlaneGeometry(100, 100);
const groundMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x3a7d44, // Green grass color
    roughness: 0.8,
    metalness: 0.2
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// Horse model and animation variables
let horse = null;
let horsePosition = 0;
const horseSpeed = 0.05;

// Initialize the scene and load models
async function init() {
    try {
        // Load the horse model
        horse = await loadGLTFModel('/models/horse.glb');
        
        // Position and scale the horse
        horse.position.set(0, 0, 0);
        horse.scale.set(0.5, 0.5, 0.5);
        horse.rotation.y = Math.PI; // Rotate to face forward
        
        // Add the horse to the scene
        scene.add(horse);
        
        // Hide loading screen and start animation
        document.getElementById('loadingScreen').classList.add('hidden');
        animate();
    } catch (error) {
        console.error('Failed to initialize scene:', error);
        // You might want to show an error message to the user here
    }
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    if (horse) {
        // Move horse forward
        horsePosition += horseSpeed;
        horse.position.z = horsePosition;

        // Reset position when horse goes too far
        if (horse.position.z > 20) {
            horse.position.z = 0;
        }
    }

    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start the initialization when the window loads
window.addEventListener('load', init); 