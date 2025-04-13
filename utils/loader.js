import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

/**
 * Loads a GLTF model with optional DRACO compression support
 * @param {string} path - Path to the .glb or .gltf model file
 * @param {Object} options - Optional configuration
 * @param {boolean} options.useDraco - Whether to use DRACO compression (default: true)
 * @param {string} options.dracoPath - Path to DRACO decoder (default: '/draco/')
 * @returns {Promise<THREE.Group>} - Promise that resolves with the loaded model
 */
export function loadGLTFModel(path, options = {}) {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        
        // Configure DRACO loader if enabled
        if (options.useDraco !== false) {
            const dracoLoader = new DRACOLoader();
            dracoLoader.setDecoderPath(options.dracoPath || '/draco/');
            loader.setDRACOLoader(dracoLoader);
        }

        loader.load(
            path,
            (gltf) => {
                // Success callback
                const model = gltf.scene;
                
                // Enable shadows for all meshes in the model
                model.traverse((node) => {
                    if (node.isMesh) {
                        node.castShadow = true;
                        node.receiveShadow = true;
                    }
                });

                resolve(model);
            },
            (xhr) => {
                // Progress callback
                const percentLoaded = Math.round((xhr.loaded / xhr.total) * 100);
                console.log(`Loading model: ${percentLoaded}%`);
            },
            (error) => {
                // Error callback
                console.error('Error loading model:', error);
                reject(new Error(`Failed to load model: ${error.message}`));
            }
        );
    });
} 