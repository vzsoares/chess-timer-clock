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
        wakeLock: null,

        init() {
            this.resetTimers();

            // Add viewport meta tag for mobile responsiveness if not already present
            if (!document.querySelector('meta[name="viewport"]')) {
                const meta = document.createElement("meta");
                meta.name = "viewport";
                meta.content =
                    "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
                document.head.appendChild(meta);
            }

            // Prevent screen dimming/sleep during active games
            this.setupWakeLock();

            // Handle orientation changes
            window.addEventListener("orientationchange", () => {
                // Optional: You could adjust layout based on orientation
                this.checkOrientation();
            });

            // Check orientation on init
            this.checkOrientation();

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
            // Add touch event handling to prevent double-tap zoom on mobile
            document.addEventListener(
                "touchstart",
                (e) => {
                    if (this.isGameStarted) {
                        // Prevent default behavior (zooming) when game is active
                        if (e.touches.length > 1) {
                            e.preventDefault();
                        }
                    }
                },
                { passive: false },
            );
        },

        // New method to check and handle orientation
        checkOrientation() {
            // Optional: You could show a message if in portrait mode on phones
            // or adjust layout based on orientation
        },

        // New method to prevent screen from sleeping during game
        setupWakeLock() {
            // Use the Screen Wake Lock API if available
            if ("wakeLock" in navigator) {
                // Request a wake lock when game starts
                this.$watch("isGameRunning", (isRunning: boolean) => {
                    if (isRunning) {
                        this.requestWakeLock();
                    } else {
                        this.releaseWakeLock();
                    }
                });
            }
        },

        async requestWakeLock() {
            try {
                if ("wakeLock" in navigator) {
                    // @ts-ignore - TypeScript might not know about this API yet
                    this.wakeLock = await navigator.wakeLock.request("screen");
                }
            } catch (err) {
                if (err instanceof Error) {
                    console.log(`Wake Lock error: ${err.name}, ${err.message}`);
                }
            }
        },

        releaseWakeLock() {
            if (this.wakeLock) {
                this.wakeLock.release().then(() => {
                    this.wakeLock = null;
                });
            }
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

            // Return if the player is not the active player (can't press opponent's button)
            if (this.activePlayer !== player) {
                return;
            }

            const now = Date.now();
            // Add debounce to prevent accidental double taps on mobile
            // Only process taps that are at least 300ms apart
            if (now - this.lastMoveTime < 300) {
                return;
            }

            // Add increment to the current player's time before switching
            if (this.isGameRunning) {
                if (this.activePlayer === 1) {
                    this.player1Time += this.increment * 1000;
                    // Switch to player 2
                    this.activePlayer = 2;
                } else {
                    this.player2Time += this.increment * 1000;
                    // Switch to player 1
                    this.activePlayer = 1;
                }
            }

            // Start the timer if it's not running
            if (!this.isGameRunning) {
                this.isGameRunning = true;
            }

            this.stopTimer();
            this.startTimer();

            // Add haptic feedback if available
            if (navigator.vibrate) {
                navigator.vibrate(10); // Short vibration feedback on move
            }
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
                const element = document.documentElement;

                // First try the standard fullscreen API
                if (element.requestFullscreen) {
                    element.requestFullscreen().catch((err) => {
                        console.error(
                            `Error attempting to enable full-screen mode: ${err.message}`,
                        );
                    });
                }
                // Fallbacks for various browsers
                // @ts-ignore - Vendor prefixed APIs
                else if (element.webkitRequestFullscreen) {
                    // @ts-ignore
                    element.webkitRequestFullscreen();
                    // @ts-ignore
                } else if (element.mozRequestFullScreen) {
                    // @ts-ignore
                    element.mozRequestFullScreen();
                    // @ts-ignore
                } else if (element.msRequestFullscreen) {
                    // @ts-ignore
                    element.msRequestFullscreen();
                }

                this.isFullscreen = true;

                // Lock to landscape if possible (for better mobile experience)
                this.lockOrientation();
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                    // @ts-ignore - Vendor prefixed APIs
                } else if (document.webkitExitFullscreen) {
                    // @ts-ignore
                    document.webkitExitFullscreen();
                    // @ts-ignore
                } else if (document.mozCancelFullScreen) {
                    // @ts-ignore
                    document.mozCancelFullScreen();
                    // @ts-ignore
                } else if (document.msExitFullscreen) {
                    // @ts-ignore
                    document.msExitFullscreen();
                }

                this.isFullscreen = false;
            }
        },

        // New method to lock screen orientation on mobile (if supported)
        lockOrientation() {
            // Try to lock to landscape for better chess timer experience on mobile
            try {
                // @ts-ignore - Screen orientation API
                if (screen.orientation && screen.orientation.lock) {
                    // @ts-ignore
                    screen.orientation.lock("landscape").catch(() => {
                        // Silently fail if not supported or permitted
                    });
                }
            } catch (e) {
                // Silently fail if not supported
            }
        },
    };
};

document.addEventListener("DOMContentLoaded", () => {
    Alpine.start();
});
