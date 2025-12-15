if (!window.AppCalculators.category_4) window.AppCalculators.category_4 = {};

window.AppCalculators.category_4.stopwatch_tool = {
    name: "Stopwatch & Timer",
    id: "stopwatch_tool",

    state: {
        mode: 'stopwatch', // 'stopwatch' or 'timer'
        
        // Stopwatch State
        swStartTime: 0,
        swElapsedTime: 0,
        swRunning: false,
        swInterval: null,
        laps: [],

        // Timer State
        tmDuration: 0, // Total duration in ms
        tmRemaining: 0,
        tmRunning: false,
        tmInterval: null,
        tmEndTime: 0,
        tmSoundEnabled: true
    },

    // Audio Context for beeps
    audioCtx: null,

    getHtml: function() {
        return `
        <div class="time-tool-wrapper">
            <div class="time-header">
                <div class="time-modes">
                    <button class="tm-mode-btn active" data-mode="stopwatch">
                        <i class="fas fa-stopwatch"></i> Stopwatch
                    </button>
                    <button class="tm-mode-btn" data-mode="timer">
                        <i class="fas fa-hourglass-half"></i> Timer
                    </button>
                </div>
            </div>

            <div id="view-stopwatch" class="time-view active">
                <div class="digital-display-card">
                    <div class="main-time" id="sw-display">00:00:00<span class="ms">.00</span></div>
                    <div class="time-controls">
                        <button id="sw-btn-start" class="ctrl-btn start"><i class="fas fa-play"></i> Start</button>
                        <button id="sw-btn-lap" class="ctrl-btn lap" disabled>Lap</button>
                        <button id="sw-btn-reset" class="ctrl-btn reset" disabled>Reset</button>
                    </div>
                </div>

                <div class="lap-container" id="lap-list-container" style="display:none;">
                    <div class="lap-header">
                        <span>Laps</span>
                        <button id="btn-clear-laps" class="text-btn">Clear</button>
                    </div>
                    <div class="lap-list" id="sw-laps-list"></div>
                </div>
            </div>

            <div id="view-timer" class="time-view">
                <div class="timer-visual">
                    <svg class="timer-ring" viewBox="0 0 120 120">
                        <circle class="ring-bg" cx="60" cy="60" r="54"></circle>
                        <circle class="ring-fill" id="tm-ring-fill" cx="60" cy="60" r="54" pathLength="100"></circle>
                    </svg>
                    <div class="timer-text-overlay">
                        <div id="tm-display" class="tm-digits">00:00:00</div>
                        <div id="tm-label" class="tm-status">Set Timer</div>
                    </div>
                </div>

                <div id="tm-setup-panel" class="timer-setup">
                    <div class="time-inputs">
                        <div class="ti-group">
                            <input type="number" id="tm-in-hr" placeholder="00" min="0" max="99">
                            <label>hr</label>
                        </div>
                        <div class="ti-group">
                            <input type="number" id="tm-in-min" placeholder="00" min="0" max="59">
                            <label>min</label>
                        </div>
                        <div class="ti-group">
                            <input type="number" id="tm-in-sec" placeholder="00" min="0" max="59">
                            <label>sec</label>
                        </div>
                    </div>
                    
                    <div class="quick-presets">
                        <button class="preset-btn" data-sec="60">1m</button>
                        <button class="preset-btn" data-sec="300">5m</button>
                        <button class="preset-btn" data-sec="600">10m</button>
                        <button class="preset-btn" data-sec="1500">25m (Pomodoro)</button>
                    </div>
                </div>

                <div class="time-controls">
                    <button id="tm-btn-start" class="ctrl-btn start"><i class="fas fa-play"></i> Start</button>
                    <button id="tm-btn-reset" class="ctrl-btn reset" disabled>Reset</button>
                </div>
                
                <div class="tm-options">
                    <label class="toggle-switch">
                        <input type="checkbox" id="tm-check-sound" checked>
                        <span class="slider"></span>
                        <span class="label-text">Sound Alarm</span>
                    </label>
                </div>
            </div>
        </div>
        `;
    },

    init: function() {
        this.cacheDOM();
        this.bindEvents();
        this.updateDisplay(0, 'sw'); // Init display
        
        // Initialize Audio Context on user interaction (browser policy)
        document.body.addEventListener('click', () => {
            if (!this.audioCtx) {
                this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
        }, { once: true });
    },

    cacheDOM: function() {
        this.dom = {
            views: {
                stopwatch: document.getElementById('view-stopwatch'),
                timer: document.getElementById('view-timer')
            },
            modeBtns: document.querySelectorAll('.tm-mode-btn'),
            
            // Stopwatch
            swDisplay: document.getElementById('sw-display'),
            swBtnStart: document.getElementById('sw-btn-start'),
            swBtnLap: document.getElementById('sw-btn-lap'),
            swBtnReset: document.getElementById('sw-btn-reset'),
            swLapList: document.getElementById('sw-laps-list'),
            swLapContainer: document.getElementById('lap-list-container'),
            swClearLaps: document.getElementById('btn-clear-laps'),

            // Timer
            tmDisplay: document.getElementById('tm-display'),
            tmRing: document.getElementById('tm-ring-fill'),
            tmLabel: document.getElementById('tm-label'),
            tmSetup: document.getElementById('tm-setup-panel'),
            tmInputs: {
                hr: document.getElementById('tm-in-hr'),
                min: document.getElementById('tm-in-min'),
                sec: document.getElementById('tm-in-sec')
            },
            tmBtnStart: document.getElementById('tm-btn-start'),
            tmBtnReset: document.getElementById('tm-btn-reset'),
            tmPresets: document.querySelectorAll('.preset-btn'),
            tmSoundCheck: document.getElementById('tm-check-sound')
        };
    },

    bindEvents: function() {
        // Mode Switching
        this.dom.modeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchMode(e.currentTarget.dataset.mode);
            });
        });

        // --- STOPWATCH EVENTS ---
        this.dom.swBtnStart.addEventListener('click', () => this.toggleStopwatch());
        this.dom.swBtnReset.addEventListener('click', () => this.resetStopwatch());
        this.dom.swBtnLap.addEventListener('click', () => this.recordLap());
        this.dom.swClearLaps.addEventListener('click', () => {
            this.state.laps = [];
            this.renderLaps();
        });

        // --- TIMER EVENTS ---
        this.dom.tmBtnStart.addEventListener('click', () => this.toggleTimer());
        this.dom.tmBtnReset.addEventListener('click', () => this.resetTimer());
        
        // Timer Inputs
        Object.values(this.dom.tmInputs).forEach(input => {
            input.addEventListener('input', () => this.updateTimerDisplayFromInput());
        });

        // Presets
        this.dom.tmPresets.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const sec = parseInt(e.target.dataset.sec);
                this.setTimerInput(sec);
            });
        });

        this.dom.tmSoundCheck.addEventListener('change', (e) => {
            this.state.tmSoundEnabled = e.target.checked;
        });
    },

    switchMode: function(mode) {
        this.state.mode = mode;
        
        // Update UI Tabs
        this.dom.modeBtns.forEach(b => b.classList.remove('active'));
        document.querySelector(`.tm-mode-btn[data-mode="${mode}"]`).classList.add('active');

        // Toggle Views
        this.dom.views.stopwatch.style.display = mode === 'stopwatch' ? 'block' : 'none';
        this.dom.views.timer.style.display = mode === 'timer' ? 'block' : 'none';
    },

    // ================= STOPWATCH LOGIC =================

    toggleStopwatch: function() {
        if (this.state.swRunning) {
            // Pause
            clearInterval(this.state.swInterval);
            this.state.swRunning = false;
            this.dom.swBtnStart.innerHTML = '<i class="fas fa-play"></i> Resume';
            this.dom.swBtnStart.classList.remove('stop');
            this.dom.swBtnLap.disabled = true;
        } else {
            // Start
            const now = Date.now();
            this.state.swStartTime = now - this.state.swElapsedTime;
            this.state.swRunning = true;
            
            this.dom.swBtnStart.innerHTML = '<i class="fas fa-pause"></i> Pause';
            this.dom.swBtnStart.classList.add('stop');
            this.dom.swBtnReset.disabled = false;
            this.dom.swBtnLap.disabled = false;

            this.state.swInterval = setInterval(() => {
                this.state.swElapsedTime = Date.now() - this.state.swStartTime;
                this.updateDisplay(this.state.swElapsedTime, 'sw');
            }, 10);
        }
    },

    resetStopwatch: function() {
        clearInterval(this.state.swInterval);
        this.state.swRunning = false;
        this.state.swElapsedTime = 0;
        this.state.laps = [];
        
        this.updateDisplay(0, 'sw');
        this.dom.swBtnStart.innerHTML = '<i class="fas fa-play"></i> Start';
        this.dom.swBtnStart.classList.remove('stop');
        this.dom.swBtnReset.disabled = true;
        this.dom.swBtnLap.disabled = true;
        this.renderLaps();
    },

    recordLap: function() {
        const lapTime = this.state.swElapsedTime;
        const prevLapTime = this.state.laps.length > 0 ? this.state.laps[0].total : 0;
        const split = lapTime - prevLapTime;

        this.state.laps.unshift({
            index: this.state.laps.length + 1,
            total: lapTime,
            split: split
        });
        this.renderLaps();
    },

    renderLaps: function() {
        const list = this.dom.swLapList;
        const container = this.dom.swLapContainer;
        
        if (this.state.laps.length === 0) {
            container.style.display = 'none';
            return;
        }
        
        container.style.display = 'block';
        
        // Find best and worst splits if > 1 lap
        let minSplit = Infinity, maxSplit = 0;
        if (this.state.laps.length > 1) {
            this.state.laps.forEach(l => {
                if (l.split < minSplit) minSplit = l.split;
                if (l.split > maxSplit) maxSplit = l.split;
            });
        }

        list.innerHTML = this.state.laps.map(lap => {
            let badge = '';
            if (this.state.laps.length > 1) {
                if (lap.split === minSplit) badge = '<span class="lb best">Best</span>';
                else if (lap.split === maxSplit) badge = '<span class="lb worst">Worst</span>';
            }
            return `
                <div class="lap-row">
                    <span class="lap-idx">Lap ${lap.index}</span>
                    <span class="lap-time">${this.formatTime(lap.split)}</span>
                    <span class="lap-total">${this.formatTime(lap.total)}</span>
                    ${badge}
                </div>
            `;
        }).join('');
    },

    // ================= TIMER LOGIC =================

    setTimerInput: function(totalSeconds) {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;

        this.dom.tmInputs.hr.value = h > 0 ? h : '';
        this.dom.tmInputs.min.value = m > 0 ? m : '';
        this.dom.tmInputs.sec.value = s > 0 ? s : ''; // Fix zero handling
        
        this.updateTimerDisplayFromInput();
    },

    updateTimerDisplayFromInput: function() {
        const h = parseInt(this.dom.tmInputs.hr.value) || 0;
        const m = parseInt(this.dom.tmInputs.min.value) || 0;
        const s = parseInt(this.dom.tmInputs.sec.value) || 0;
        
        const totalMs = ((h * 3600) + (m * 60) + s) * 1000;
        this.state.tmDuration = totalMs;
        this.state.tmRemaining = totalMs;
        
        this.updateDisplay(totalMs, 'tm');
        this.dom.tmRing.style.strokeDashoffset = 0; // Full circle
        
        this.dom.tmBtnStart.disabled = totalMs <= 0;
    },

    toggleTimer: function() {
        if (this.state.tmRunning) {
            // Pause
            clearInterval(this.state.tmInterval);
            this.state.tmRunning = false;
            this.dom.tmBtnStart.innerHTML = '<i class="fas fa-play"></i> Resume';
            this.dom.tmBtnStart.classList.remove('stop');
            this.dom.tmSetup.classList.remove('disabled');
        } else {
            // Start
            if (this.state.tmRemaining <= 0) return;

            // Lock inputs
            this.dom.tmSetup.classList.add('disabled');
            
            const now = Date.now();
            this.state.tmEndTime = now + this.state.tmRemaining;
            this.state.tmRunning = true;
            
            this.dom.tmBtnStart.innerHTML = '<i class="fas fa-pause"></i> Pause';
            this.dom.tmBtnStart.classList.add('stop');
            this.dom.tmBtnReset.disabled = false;
            this.dom.tmLabel.innerText = "Running";

            this.state.tmInterval = setInterval(() => {
                const current = Date.now();
                const remaining = this.state.tmEndTime - current;
                
                if (remaining <= 0) {
                    this.timerComplete();
                } else {
                    this.state.tmRemaining = remaining;
                    this.updateDisplay(remaining, 'tm');
                    
                    // Update Ring
                    const pct = (remaining / this.state.tmDuration) * 100;
                    const offset = 100 - pct; // SVG pathLength is 100
                    this.dom.tmRing.style.strokeDashoffset = offset;
                }
            }, 50);
        }
    },

    timerComplete: function() {
        clearInterval(this.state.tmInterval);
        this.state.tmRunning = false;
        this.state.tmRemaining = 0;
        this.updateDisplay(0, 'tm');
        this.dom.tmRing.style.strokeDashoffset = 100; // Empty
        
        this.dom.tmLabel.innerText = "Time's Up!";
        this.dom.tmLabel.classList.add('blink');
        this.dom.tmBtnStart.innerHTML = '<i class="fas fa-play"></i> Start';
        this.dom.tmBtnStart.classList.remove('stop');
        this.dom.tmSetup.classList.remove('disabled');
        
        if (this.state.tmSoundEnabled) {
            this.playAlarm();
        }
    },

    resetTimer: function() {
        clearInterval(this.state.tmInterval);
        this.state.tmRunning = false;
        this.dom.tmLabel.innerText = "Set Timer";
        this.dom.tmLabel.classList.remove('blink');
        
        // Reset to initial inputs value
        this.updateTimerDisplayFromInput(); 
        
        this.dom.tmBtnStart.innerHTML = '<i class="fas fa-play"></i> Start';
        this.dom.tmBtnStart.classList.remove('stop');
        this.dom.tmBtnReset.disabled = true;
        this.dom.tmSetup.classList.remove('disabled');
    },

    playAlarm: function() {
        if (!this.audioCtx) return;
        
        // Create oscillator for beep
        const oscillator = this.audioCtx.createOscillator();
        const gainNode = this.audioCtx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioCtx.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, this.audioCtx.currentTime); // A5
        oscillator.frequency.exponentialRampToValueAtTime(440, this.audioCtx.currentTime + 0.5);
        
        gainNode.gain.setValueAtTime(0.5, this.audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.5);
        
        oscillator.start();
        oscillator.stop(this.audioCtx.currentTime + 0.6);
        
        // Vibrate if supported (Mobile)
        if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    },

    // ================= UTILS =================

    updateDisplay: function(ms, type) {
        const str = this.formatTime(ms, type === 'sw'); // show ms for stopwatch
        if (type === 'sw') {
            const parts = str.split('.');
            this.dom.swDisplay.innerHTML = `${parts[0]}<span class="ms">.${parts[1]}</span>`;
        } else {
            // Timer doesn't show MS usually, just HH:MM:SS
            this.dom.tmDisplay.innerText = str.split('.')[0]; 
        }
    },

    formatTime: function(ms, showMs = true) {
        if (ms < 0) ms = 0;
        const totalSec = Math.floor(ms / 1000);
        const h = Math.floor(totalSec / 3600);
        const m = Math.floor((totalSec % 3600) / 60);
        const s = totalSec % 60;
        const milli = Math.floor((ms % 1000) / 10); // 2 digits

        const hStr = h.toString().padStart(2, '0');
        const mStr = m.toString().padStart(2, '0');
        const sStr = s.toString().padStart(2, '0');
        
        let res = `${hStr}:${mStr}:${sStr}`;
        if (showMs) res += `.${milli.toString().padStart(2, '0')}`;
        return res;
    }
};