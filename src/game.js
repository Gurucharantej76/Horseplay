import { Scene, PerspectiveCamera, WebGLRenderer, Clock, AmbientLight, DirectionalLight, 
         PlaneGeometry, MeshStandardMaterial, Mesh, Color } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { setupControls } from './controls.js';

let scene, camera, renderer, clock;
let horse = null;
let updateControls = null;

function initScene() {
    // Create scene
    scene = new Scene();
    scene.background = new Color(0x87CEEB); // Sky blue background

    // Setup camera
    camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);

    // Setup renderer
    renderer = new WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    // Add lights
    const ambientLight = new AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Create ground
    const groundGeometry = new PlaneGeometry(100, 100);
    const groundMaterial = new MeshStandardMaterial({ 
        color: 0x3a7d44,
        roughness: 0.8,
        metalness: 0.2
    });
    const ground = new Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Initialize clock for animations
    clock = new Clock();
}

async function loadHorse() {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        loader.load(
            '/models/horse.glb',
            (gltf) => {
                horse = gltf.scene;
                
                // Enable shadows for all meshes in the model
                horse.traverse((node) => {
                    if (node.isMesh) {
                        node.castShadow = true;
                        node.receiveShadow = true;
                    }
                });

                // Position and scale the horse
                horse.position.set(0, 0, 0);
                horse.scale.set(0.5, 0.5, 0.5);
                horse.rotation.y = Math.PI; // Rotate to face forward
                
                scene.add(horse);
                resolve(horse);
            },
            undefined,
            (error) => reject(error)
        );
    });
}

function gameLoop() {
    requestAnimationFrame(gameLoop);

    const delta = clock.getDelta();

    if (updateControls) {
        updateControls(delta);
    }

    renderer.render(scene, camera);
}

export async function startGame() {
    try {
        initScene();
        await loadHorse();
        updateControls = setupControls(horse);
        gameLoop();
    } catch (error) {
        console.error('Failed to start game:', error);
        // You might want to show an error message to the user here
    }
} 