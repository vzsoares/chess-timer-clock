import Alpine from "alpinejs";

declare global {
    interface Window {
        Alpine: any;
        chessTimer: () => any;
    }
}

window.Alpine = Alpine;

// Chess Timer Alpine Component
window.chessTimer = () => {
    return {
        isGameStarted: false,
        isGameRunning: false,
        activePlayer: null,
        initialMinutes: 5,
        increment: 2, // seconds
        player1Time: 0, // milliseconds
        player2Time: 0, // milliseconds
        timerInterval: null as number | null,
        isFullscreen: false,
        lastMoveTime: 0,

        init() {
            this.resetTimers();
            // Listen for keyboard shortcuts
            document.addEventListener("keydown", (e) => {
                if (!this.isGameStarted) return;

                // Space bar to pause/resume
                if (e.code === "Space") {
                    e.preventDefault();
                    this.pauseResumeGame();
                }

                // Up arrow for Player 1
                if (
                    e.code === "ArrowUp" &&
                    this.isGameRunning &&
                    this.activePlayer === 2
                ) {
                    this.toggleTurn(1);
                }

                // Down arrow for Player 2
                if (
                    e.code === "ArrowDown" &&
                    this.isGameRunning &&
                    this.activePlayer === 1
                ) {
                    this.toggleTurn(2);
                }

                // R key to reset
                if (e.code === "KeyR") {
                    this.resetGame();
                }

                // F key for fullscreen
                if (e.code === "KeyF") {
                    this.toggleFullscreen();
                }
            });
        },

        resetTimers() {
            this.player1Time = this.initialMinutes * 60 * 1000;
            this.player2Time = this.initialMinutes * 60 * 1000;
        },

        startGame() {
            this.resetTimers();
            this.isGameStarted = true;
            this.activePlayer = 1; // Start with player 1 (typically white in chess)
            this.isGameRunning = true;
            this.startTimer();
        },

        resetGame() {
            this.stopTimer();
            this.isGameRunning = false;
            this.activePlayer = null;
            this.resetTimers();
        },

        pauseResumeGame() {
            if (this.isGameRunning) {
                this.stopTimer();
                this.isGameRunning = false;
            } else if (this.activePlayer) {
                this.startTimer();
                this.isGameRunning = true;
            }
        },

        toggleTurn(player: number) {
            if (!this.isGameStarted) return;

            const now = Date.now();

            // If a player is already active, add increment to their time
            if (this.activePlayer && this.isGameRunning) {
                if (this.activePlayer === 1) {
                    this.player1Time += this.increment * 1000;
                } else {
                    this.player2Time += this.increment * 1000;
                }
            }

            // Switch active player
            this.activePlayer = player;

            // Start the timer if it's not running
            if (!this.isGameRunning) {
                this.isGameRunning = true;
            }

            this.stopTimer();
            this.startTimer();
            this.lastMoveTime = now;
        },

        startTimer() {
            this.timerInterval = window.setInterval(() => {
                if (!this.isGameRunning) return;

                if (this.activePlayer === 1) {
                    this.player1Time -= 10; // decrease by 10ms for smoother countdown
                    if (this.player1Time <= 0) {
                        this.player1Time = 0;
                        this.timeUp();
                    }
                } else {
                    this.player2Time -= 10; // decrease by 10ms for smoother countdown
                    if (this.player2Time <= 0) {
                        this.player2Time = 0;
                        this.timeUp();
                    }
                }
            }, 10);
        },

        stopTimer() {
            if (this.timerInterval) {
                clearInterval(this.timerInterval);
                this.timerInterval = null;
            }
        },

        timeUp() {
            this.stopTimer();
            this.isGameRunning = false;
            // Could add sound or visual indicator here
            alert(`Player ${this.activePlayer} time's up!`);
        },

        formatTime(milliseconds: number) {
            const totalSeconds = Math.floor(milliseconds / 1000);
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            const tenths = Math.floor((milliseconds % 1000) / 100);

            if (minutes >= 10) {
                // Just show minutes and seconds when more than 10 minutes
                return `${minutes}:${seconds.toString().padStart(2, "0")}`;
            } else {
                // Show tenths of a second when under 10 minutes
                return `${minutes}:${seconds.toString().padStart(2, "0")}.${tenths}`;
            }
        },

        increaseTime() {
            this.initialMinutes = Math.min(90, this.initialMinutes + 1);
            this.resetTimers();
        },

        decreaseTime() {
            this.initialMinutes = Math.max(1, this.initialMinutes - 1);
            this.resetTimers();
        },

        increaseIncrement() {
            this.increment = Math.min(30, this.increment + 1);
        },

        decreaseIncrement() {
            this.increment = Math.max(0, this.increment - 1);
        },

        toggleFullscreen() {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch((err) => {
                    console.error(
                        `Error attempting to enable full-screen mode: ${err.message}`,
                    );
                });
                this.isFullscreen = true;
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                    this.isFullscreen = false;
                }
            }
        },
    };
};

document.addEventListener("DOMContentLoaded", () => {
    Alpine.start();
});
