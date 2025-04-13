import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

export async function loadHorseModel() {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        
        // Configure DRACO loader
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('/draco/');
        loader.setDRACOLoader(dracoLoader);

        loader.load(
            '/models/horse.glb',
            (gltf) => {
                const model = gltf.scene;
                
                // Enable shadows for all meshes
                model.traverse((node) => {
                    if (node.isMesh) {
                        node.castShadow = true;
                        node.receiveShadow = true;
                    }
                });

                // Position and scale the horse
                model.position.set(0, 0, 0);
                model.scale.set(0.5, 0.5, 0.5);
                model.rotation.y = Math.PI; // Rotate to face forward
                
                resolve(model);
            },
            undefined,
            (error) => reject(error)
        );
    });
}

export async function loadAudio() {
    const audioLoader = new THREE.AudioLoader();
    const sounds = {
        gallop: new THREE.Audio(new THREE.AudioListener()),
        win: new THREE.Audio(new THREE.AudioListener()),
        lose: new THREE.Audio(new THREE.AudioListener()),
        obstacle: new THREE.Audio(new THREE.AudioListener())
    };

    try {
        await Promise.all([
            audioLoader.loadAsync('/sounds/gallop.mp3').then(buffer => sounds.gallop.setBuffer(buffer)),
            audioLoader.loadAsync('/sounds/win.mp3').then(buffer => sounds.win.setBuffer(buffer)),
            audioLoader.loadAsync('/sounds/lose.mp3').then(buffer => sounds.lose.setBuffer(buffer)),
            audioLoader.loadAsync('/sounds/obstacle.mp3').then(buffer => sounds.obstacle.setBuffer(buffer))
        ]);
        return sounds;
    } catch (error) {
        console.error('Failed to load audio:', error);
        return sounds;
    }
}

export function createHorse() {
    // Create a simple horse shape using basic geometries
    const horse = new THREE.Group();

    // Body (main box)
    const bodyGeometry = new THREE.BoxGeometry(2, 1, 3);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 1;
    horse.add(body);

    // Head (smaller box)
    const headGeometry = new THREE.BoxGeometry(1, 1, 1.5);
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.set(0, 1.5, 1.5);
    horse.add(head);

    // Legs (cylinders)
    const legGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1, 8);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    
    // Front legs
    const frontLeftLeg = new THREE.Mesh(legGeometry, legMaterial);
    frontLeftLeg.position.set(-0.8, 0.5, 0.8);
    horse.add(frontLeftLeg);

    const frontRightLeg = new THREE.Mesh(legGeometry, legMaterial);
    frontRightLeg.position.set(0.8, 0.5, 0.8);
    horse.add(frontRightLeg);

    // Back legs
    const backLeftLeg = new THREE.Mesh(legGeometry, legMaterial);
    backLeftLeg.position.set(-0.8, 0.5, -0.8);
    horse.add(backLeftLeg);

    const backRightLeg = new THREE.Mesh(legGeometry, legMaterial);
    backRightLeg.position.set(0.8, 0.5, -0.8);
    horse.add(backRightLeg);

    // Tail (cylinder)
    const tailGeometry = new THREE.CylinderGeometry(0.1, 0.2, 1, 8);
    const tailMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const tail = new THREE.Mesh(tailGeometry, tailMaterial);
    tail.position.set(0, 1, -1.5);
    tail.rotation.x = Math.PI / 4;
    horse.add(tail);

    // Enable shadows
    horse.traverse((node) => {
        if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
        }
    });

    return horse;
} 