import * as THREE from 'three';

export class Race {
    constructor(scene) {
        this.scene = scene;
        this.segments = [];
        this.obstacles = [];
        this.raceState = {
            isStarted: false,
            isFinished: false,
            winner: null,
            playerProgress: 0,
            aiProgress: 0,
            playerSpeed: 0,
            aiSpeed: 0
        };
        this.trackLength = 100; // Total length of the race track
        this.segmentLength = this.trackLength / 8; // Length of each segment
    }

    // Initialize the race track and segments
    init() {
        this.createTrack();
        this.createSegments();
        this.placeObstacles();
    }

    // Create the main race track
    createTrack() {
        const trackGeometry = new THREE.PlaneGeometry(this.trackLength, 10);
        const trackMaterial = new THREE.MeshStandardMaterial({
            color: 0x3a7d44,
            roughness: 0.8,
            metalness: 0.2
        });
        const track = new THREE.Mesh(trackGeometry, trackMaterial);
        track.rotation.x = -Math.PI / 2;
        track.position.y = -0.1;
        this.scene.add(track);
    }

    // Create eight distinct segments with different themes
    createSegments() {
        const segmentThemes = [
            { color: 0x3a7d44, name: 'Grassland' },
            { color: 0x8B4513, name: 'Mud Path' },
            { color: 0x808080, name: 'Rocky Terrain' },
            { color: 0x556B2F, name: 'Forest Trail' },
            { color: 0x8B4513, name: 'Mud Path' },
            { color: 0x808080, name: 'Rocky Terrain' },
            { color: 0x3a7d44, name: 'Grassland' },
            { color: 0x556B2F, name: 'Forest Trail' }
        ];

        for (let i = 0; i < 8; i++) {
            const segmentGeometry = new THREE.PlaneGeometry(this.segmentLength, 10);
            const segmentMaterial = new THREE.MeshStandardMaterial({
                color: segmentThemes[i].color,
                roughness: 0.8,
                metalness: 0.2
            });
            const segment = new THREE.Mesh(segmentGeometry, segmentMaterial);
            segment.rotation.x = -Math.PI / 2;
            segment.position.z = i * this.segmentLength - this.trackLength / 2;
            segment.position.y = -0.05;
            this.scene.add(segment);
            this.segments.push({
                mesh: segment,
                theme: segmentThemes[i],
                obstacles: []
            });
        }
    }

    // Place obstacles randomly in segments
    placeObstacles() {
        const obstacleTypes = [
            { type: 'rock', size: 1, speedPenalty: 0.5 },
            { type: 'pit', size: 2, speedPenalty: 0.7 },
            { type: 'mud', size: 3, speedPenalty: 0.3 }
        ];

        this.segments.forEach((segment, index) => {
            // Skip first and last segments
            if (index === 0 || index === 7) return;

            // 50% chance to place an obstacle in each segment
            if (Math.random() > 0.5) {
                const obstacleType = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
                const obstacleGeometry = new THREE.BoxGeometry(obstacleType.size, 0.5, obstacleType.size);
                const obstacleMaterial = new THREE.MeshStandardMaterial({
                    color: 0x808080,
                    roughness: 0.9
                });
                const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
                
                // Position obstacle randomly within the segment
                obstacle.position.x = (Math.random() - 0.5) * 8;
                obstacle.position.z = segment.mesh.position.z;
                obstacle.position.y = 0.25;
                
                this.scene.add(obstacle);
                segment.obstacles.push({
                    mesh: obstacle,
                    type: obstacleType.type,
                    speedPenalty: obstacleType.speedPenalty
                });
            }
        });
    }

    // Start the race
    startRace() {
        this.raceState.isStarted = true;
        this.raceState.isFinished = false;
        this.raceState.winner = null;
        this.raceState.playerProgress = 0;
        this.raceState.aiProgress = 0;
        this.raceState.playerSpeed = 5; // Base speed
        this.raceState.aiSpeed = 4.5; // Slightly slower than player
    }

    // Update race progress
    update(deltaTime, playerHorse, aiHorse) {
        if (!this.raceState.isStarted || this.raceState.isFinished) return;

        // Update player progress
        this.raceState.playerProgress += this.raceState.playerSpeed * deltaTime;
        playerHorse.position.z = -this.trackLength / 2 + this.raceState.playerProgress;

        // Update AI progress
        this.raceState.aiProgress += this.raceState.aiSpeed * deltaTime;
        aiHorse.position.z = -this.trackLength / 2 + this.raceState.aiProgress;

        // Check for finish line
        if (this.raceState.playerProgress >= this.trackLength) {
            this.raceState.isFinished = true;
            this.raceState.winner = 'player';
        } else if (this.raceState.aiProgress >= this.trackLength) {
            this.raceState.isFinished = true;
            this.raceState.winner = 'ai';
        }

        // Check for obstacles
        this.checkObstacles(playerHorse);
    }

    // Check if horse hits any obstacles
    checkObstacles(horse) {
        const currentSegment = Math.floor(this.raceState.playerProgress / this.segmentLength);
        if (currentSegment >= 0 && currentSegment < this.segments.length) {
            const segment = this.segments[currentSegment];
            segment.obstacles.forEach(obstacle => {
                const distance = Math.sqrt(
                    Math.pow(horse.position.x - obstacle.mesh.position.x, 2) +
                    Math.pow(horse.position.z - obstacle.mesh.position.z, 2)
                );
                if (distance < 2) {
                    // Apply speed penalty
                    this.raceState.playerSpeed *= obstacle.speedPenalty;
                    // Reset speed after 2 seconds
                    setTimeout(() => {
                        this.raceState.playerSpeed = 5;
                    }, 2000);
                }
            });
        }
    }

    // Get current race state
    getRaceState() {
        return this.raceState;
    }
} 