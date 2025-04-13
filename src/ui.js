export class UI {
    constructor() {
        this.createUIElements();
    }

    createUIElements() {
        // Create UI container
        this.container = document.createElement('div');
        this.container.style.position = 'absolute';
        this.container.style.top = '10px';
        this.container.style.left = '10px';
        this.container.style.color = 'white';
        this.container.style.fontFamily = 'Arial, sans-serif';
        document.body.appendChild(this.container);

        // Create speed meter
        this.speedMeter = document.createElement('div');
        this.speedMeter.style.marginBottom = '10px';
        this.container.appendChild(this.speedMeter);

        // Create progress bar
        this.progressBar = document.createElement('div');
        this.progressBar.style.width = '200px';
        this.progressBar.style.height = '20px';
        this.progressBar.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        this.progressBar.style.borderRadius = '10px';
        this.progressBar.style.overflow = 'hidden';
        this.container.appendChild(this.progressBar);

        this.progressFill = document.createElement('div');
        this.progressFill.style.width = '0%';
        this.progressFill.style.height = '100%';
        this.progressFill.style.backgroundColor = '#4CAF50';
        this.progressFill.style.transition = 'width 0.3s';
        this.progressBar.appendChild(this.progressFill);

        // Create race status
        this.raceStatus = document.createElement('div');
        this.raceStatus.style.marginTop = '10px';
        this.container.appendChild(this.raceStatus);

        // Create controls info
        this.controlsInfo = document.createElement('div');
        this.controlsInfo.style.position = 'absolute';
        this.controlsInfo.style.bottom = '10px';
        this.controlsInfo.style.left = '10px';
        this.controlsInfo.innerHTML = 'Controls: W/↑ - Forward, S/↓ - Backward, A/← - Left, D/→ - Right';
        document.body.appendChild(this.controlsInfo);
    }

    updateSpeed(speed) {
        this.speedMeter.textContent = `Speed: ${speed.toFixed(1)} m/s`;
    }

    updateProgress(progress, total) {
        const percentage = (progress / total) * 100;
        this.progressFill.style.width = `${percentage}%`;
    }

    updateRaceStatus(status) {
        this.raceStatus.textContent = status;
    }

    showWinMessage() {
        const winMessage = document.createElement('div');
        winMessage.style.position = 'absolute';
        winMessage.style.top = '50%';
        winMessage.style.left = '50%';
        winMessage.style.transform = 'translate(-50%, -50%)';
        winMessage.style.fontSize = '48px';
        winMessage.style.color = '#ffd700';
        winMessage.style.textShadow = '0 0 10px rgba(255, 215, 0, 0.5)';
        winMessage.textContent = 'You Win!';
        document.body.appendChild(winMessage);
    }

    showLoseMessage() {
        const loseMessage = document.createElement('div');
        loseMessage.style.position = 'absolute';
        loseMessage.style.top = '50%';
        loseMessage.style.left = '50%';
        loseMessage.style.transform = 'translate(-50%, -50%)';
        loseMessage.style.fontSize = '48px';
        loseMessage.style.color = '#ff0000';
        loseMessage.style.textShadow = '0 0 10px rgba(255, 0, 0, 0.5)';
        loseMessage.textContent = 'You Lose!';
        document.body.appendChild(loseMessage);
    }
} 