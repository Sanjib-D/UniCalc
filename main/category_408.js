// Category 408: Counter / Tally Tool
if (!window.AppCalculators) window.AppCalculators = {};

window.AppCalculators.category_4 = window.AppCalculators.category_4 || {};

window.AppCalculators.category_4.counter_tool = {
    // State management
    counters: [],
    history: [],
    settings: {
        sound: true,
        haptic: true
    },
    audioCtx: null,

    getHtml: function() {
        return `
            <div class="tally-wrapper">
                <div class="tally-header-bar">
                    <div class="tally-global-controls">
                        <button class="tally-btn t-btn-primary" id="add-counter-btn">
                            <i class="fas fa-plus"></i> Add Counter
                        </button>
                        <button class="tally-btn t-btn-outline" id="export-csv-btn">
                            <i class="fas fa-file-csv"></i> Export CSV
                        </button>
                        <button class="tally-btn t-btn-danger" id="reset-all-btn">
                            <i class="fas fa-trash-alt"></i> Reset All
                        </button>
                    </div>
                    
                    <div class="tally-total-badge">
                        <span>Total:</span>
                        <span id="global-total-display">0</span>
                    </div>
                </div>

                <div class="tally-settings-bar">
                    <div class="ts-toggle active" id="sound-toggle">
                        <i class="fas fa-volume-up"></i> Sound
                    </div>
                    <div class="ts-toggle active" id="haptic-toggle">
                        <i class="fas fa-mobile-alt"></i> Haptic
                    </div>
                </div>

                <div id="tally-container" class="tally-grid">
                    </div>

                <div id="empty-state" class="tally-empty-state" style="display:none;">
                    <i class="fas fa-layer-group" style="font-size:3rem; margin-bottom:15px; opacity:0.5;"></i>
                    <p>No counters active. Click "Add Counter" to start.</p>
                </div>

                <div class="tally-history-wrapper">
                    <div class="th-header">
                        <span><i class="fas fa-history"></i> History Log</span>
                        <button class="tc-menu-btn" id="clear-history-btn" title="Clear History">
                            <i class="fas fa-eraser"></i>
                        </button>
                    </div>
                    <div class="th-list" id="history-list">
                        </div>
                </div>
            </div>
        `;
    },

    init: function() {
        this.loadData();
        this.renderAll();
        this.setupEventListeners();
        this.initAudio();

        // Keyboard Shortcuts (Arrow Up/Down for first counter)
        document.addEventListener('keydown', this.handleKeyboard.bind(this));
    },

    initAudio: function() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.audioCtx = new AudioContext();
            }
        } catch (e) {
            console.warn("Web Audio API not supported");
        }
    },

    playSound: function(type) {
        if (!this.settings.sound || !this.audioCtx) return;
        if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        if (type === 'inc') {
            osc.frequency.setValueAtTime(600, this.audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1000, this.audioCtx.currentTime + 0.1);
        } else if (type === 'dec') {
            osc.frequency.setValueAtTime(400, this.audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(200, this.audioCtx.currentTime + 0.1);
        } else {
            // Limit/Error
            osc.type = 'square';
            osc.frequency.setValueAtTime(150, this.audioCtx.currentTime);
        }

        gain.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.1);

        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.1);
    },

    triggerHaptic: function() {
        if (this.settings.haptic && navigator.vibrate) {
            navigator.vibrate(10);
        }
    },

    loadData: function() {
        const stored = localStorage.getItem('uni_tally_data');
        if (stored) {
            const data = JSON.parse(stored);
            this.counters = data.counters || [];
            this.history = data.history || [];
            if (data.settings) this.settings = data.settings;
        } else {
            // Default first counter
            this.addCounter('Counter 1');
        }
        this.updateSettingsUI();
    },

    saveData: function() {
        localStorage.setItem('uni_tally_data', JSON.stringify({
            counters: this.counters,
            history: this.history,
            settings: this.settings
        }));
    },

    addCounter: function(name = `Counter ${this.counters.length + 1}`) {
        const newCounter = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
            name: name,
            value: 0,
            step: 1,
            min: null,
            max: null,
            resetVal: 0
        };
        this.counters.push(newCounter);
        this.saveData();
        this.renderAll();
        this.logAction(newCounter.id, "Created", 0);
    },

    removeCounter: function(id) {
        if (!confirm("Delete this counter?")) return;
        this.counters = this.counters.filter(c => c.id !== id);
        this.saveData();
        this.renderAll();
    },

    updateValue: function(id, delta) {
        const counter = this.counters.find(c => c.id === id);
        if (!counter) return;

        let nextVal = counter.value + delta;

        // Check limits
        if (counter.max !== null && nextVal > counter.max) {
            this.playSound('limit');
            this.flashLimit(id);
            return;
        }
        if (counter.min !== null && nextVal < counter.min) {
            this.playSound('limit');
            this.flashLimit(id);
            return;
        }

        counter.value = nextVal;
        this.saveData();
        this.updateCounterUI(id);
        this.updateGlobalTotal();
        
        // Feedback
        const type = delta > 0 ? 'inc' : 'dec';
        this.playSound(type);
        this.triggerHaptic();
        
        this.logAction(id, delta > 0 ? "+ Increment" : "- Decrement", counter.value);
    },

    resetCounter: function(id) {
        const counter = this.counters.find(c => c.id === id);
        if (!counter) return;

        if (counter.value !== counter.resetVal) {
            if(!confirm("Reset this counter?")) return;
            counter.value = counter.resetVal;
            this.saveData();
            this.updateCounterUI(id);
            this.updateGlobalTotal();
            this.logAction(id, "Reset", counter.value);
        }
    },

    logAction: function(counterId, action, val) {
        const counter = this.counters.find(c => c.id === counterId);
        const name = counter ? counter.name : (counterId ? "Unknown" : "Global");
        
        const entry = {
            time: new Date().toISOString(),
            name: name,
            action: action,
            val: val
        };

        this.history.unshift(entry);
        if (this.history.length > 100) this.history.pop(); // Keep last 100
        this.saveData();
        this.renderHistory();
    },

    flashLimit: function(id) {
        const card = document.getElementById(`card-${id}`);
        if(card) {
            card.classList.add('limit-reached');
            setTimeout(() => card.classList.remove('limit-reached'), 300);
        }
    },

    renderAll: function() {
        const container = document.getElementById('tally-container');
        const emptyState = document.getElementById('empty-state');
        
        if (this.counters.length === 0) {
            container.innerHTML = '';
            emptyState.style.display = 'block';
        } else {
            emptyState.style.display = 'none';
            container.innerHTML = this.counters.map(c => this.createCounterHTML(c)).join('');
            
            // Re-attach listeners for settings visibility
            this.counters.forEach(c => {
                const settingsBtn = document.getElementById(`btn-set-${c.id}`);
                if(settingsBtn) {
                    settingsBtn.onclick = () => {
                        const panel = document.getElementById(`panel-${c.id}`);
                        panel.classList.toggle('open');
                    }
                }
            });
        }
        this.updateGlobalTotal();
        this.renderHistory();
    },

    createCounterHTML: function(c) {
        return `
            <div class="tally-card" id="card-${c.id}">
                <div class="tc-header">
                    <input type="text" class="tc-title-input" value="${c.name}" 
                        onchange="window.AppCalculators.category_4.counter_tool.updateName('${c.id}', this.value)">
                    <div>
                        <button class="tc-menu-btn" id="btn-set-${c.id}"><i class="fas fa-cog"></i></button>
                        <button class="tc-menu-btn" onclick="window.AppCalculators.category_4.counter_tool.removeCounter('${c.id}')">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                
                <div class="tc-settings-panel" id="panel-${c.id}">
                    <div class="tc-form-row">
                        <label>Start / Reset Value:</label>
                        <input type="number" value="${c.resetVal}" 
                            onchange="window.AppCalculators.category_4.counter_tool.updateConfig('${c.id}', 'resetVal', this.value)">
                    </div>
                    <div class="tc-form-row">
                        <label>Step Size:</label>
                        <input type="number" value="${c.step}" 
                            onchange="window.AppCalculators.category_4.counter_tool.updateConfig('${c.id}', 'step', this.value)">
                    </div>
                    <div class="tc-form-row">
                        <label>Min Limit (Optional):</label>
                        <input type="number" placeholder="None" value="${c.min !== null ? c.min : ''}" 
                            onchange="window.AppCalculators.category_4.counter_tool.updateConfig('${c.id}', 'min', this.value)">
                    </div>
                    <div class="tc-form-row">
                        <label>Max Limit (Optional):</label>
                        <input type="number" placeholder="None" value="${c.max !== null ? c.max : ''}" 
                            onchange="window.AppCalculators.category_4.counter_tool.updateConfig('${c.id}', 'max', this.value)">
                    </div>
                </div>

                <div class="tc-body">
                    <div class="tc-display" id="val-${c.id}" 
                         onclick="window.AppCalculators.category_4.counter_tool.manualEdit('${c.id}')">${c.value}</div>
                    
                    <div class="tc-controls">
                        <button class="tc-main-btn btn-minus" 
                                onclick="window.AppCalculators.category_4.counter_tool.updateValue('${c.id}', -${c.step})">
                            <i class="fas fa-minus"></i>
                        </button>
                        <button class="tc-main-btn btn-plus" 
                                onclick="window.AppCalculators.category_4.counter_tool.updateValue('${c.id}', ${c.step})">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>

                <div class="tc-footer">
                    <span>Step: ${c.step}</span>
                    <button class="tc-menu-btn" onclick="window.AppCalculators.category_4.counter_tool.resetCounter('${c.id}')">
                        Reset <i class="fas fa-undo"></i>
                    </button>
                </div>
            </div>
        `;
    },

    updateCounterUI: function(id) {
        const counter = this.counters.find(c => c.id === id);
        if (counter) {
            const el = document.getElementById(`val-${id}`);
            if(el) el.innerText = counter.value;
        }
    },

    updateName: function(id, newName) {
        const counter = this.counters.find(c => c.id === id);
        if(counter) {
            counter.name = newName;
            this.saveData();
        }
    },

    updateConfig: function(id, field, val) {
        const counter = this.counters.find(c => c.id === id);
        if(!counter) return;

        if(val === '') {
            if (field === 'min' || field === 'max') val = null;
            else val = 0;
        } else {
            val = Number(val);
        }

        counter[field] = val;
        this.saveData();
    },

    manualEdit: function(id) {
        const counter = this.counters.find(c => c.id === id);
        if(!counter) return;
        
        const newVal = prompt(`Enter new value for ${counter.name}:`, counter.value);
        if (newVal !== null && !isNaN(newVal) && newVal.trim() !== "") {
            counter.value = Number(newVal);
            this.saveData();
            this.updateCounterUI(id);
            this.updateGlobalTotal();
            this.logAction(id, "Manual Edit", counter.value);
        }
    },

    updateGlobalTotal: function() {
        const total = this.counters.reduce((sum, c) => sum + c.value, 0);
        const el = document.getElementById('global-total-display');
        if(el) el.innerText = total;
    },

    renderHistory: function() {
        const list = document.getElementById('history-list');
        if(!list) return;

        if (this.history.length === 0) {
            list.innerHTML = '<div style="padding:15px; text-align:center; color:#aaa;">No history yet.</div>';
            return;
        }

        list.innerHTML = this.history.map(h => {
            const date = new Date(h.time);
            const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            
            let actionClass = '';
            if (h.action.includes('Inc')) actionClass = 'inc';
            else if (h.action.includes('Dec')) actionClass = 'dec';
            else if (h.action.includes('Reset')) actionClass = 'reset';

            return `
                <div class="th-item">
                    <div>
                        <span class="th-time">${timeStr}</span>
                        <strong>${h.name}</strong>
                    </div>
                    <div>
                        <span class="th-action ${actionClass}">${h.action}</span>
                        <span class="th-val"> → ${h.val}</span>
                    </div>
                </div>
            `;
        }).join('');
    },

    clearHistory: function() {
        if(confirm("Clear history log?")) {
            this.history = [];
            this.saveData();
            this.renderHistory();
        }
    },

    resetAll: function() {
        if(confirm("Reset ALL counters to their start values?")) {
            this.counters.forEach(c => c.value = c.resetVal);
            this.saveData();
            this.renderAll();
            this.logAction(null, "Global Reset", 0);
        }
    },

    exportCSV: function() {
        if (this.history.length === 0) {
            alert("No history to export.");
            return;
        }
        
        let csvContent = "data:text/csv;charset=utf-8,Time,Counter Name,Action,Value\n";
        
        this.history.forEach(h => {
            csvContent += `${h.time},"${h.name}",${h.action},${h.val}\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "tally_history_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },

    setupEventListeners: function() {
        document.getElementById('add-counter-btn').onclick = () => this.addCounter();
        document.getElementById('reset-all-btn').onclick = () => this.resetAll();
        document.getElementById('clear-history-btn').onclick = () => this.clearHistory();
        document.getElementById('export-csv-btn').onclick = () => this.exportCSV();

        const sToggle = document.getElementById('sound-toggle');
        const hToggle = document.getElementById('haptic-toggle');

        this.updateSettingsUI();

        if(sToggle) {
            sToggle.onclick = () => {
                this.settings.sound = !this.settings.sound;
                this.saveData();
                this.updateSettingsUI();
            };
        }

        if(hToggle) {
            hToggle.onclick = () => {
                this.settings.haptic = !this.settings.haptic;
                this.saveData();
                this.updateSettingsUI();
            };
        }
    },

    updateSettingsUI: function() {
        const sToggle = document.getElementById('sound-toggle');
        const hToggle = document.getElementById('haptic-toggle');
        
        if(sToggle) {
            if(this.settings.sound) sToggle.classList.add('active');
            else sToggle.classList.remove('active');
        }
        
        if(hToggle) {
            if(this.settings.haptic) hToggle.classList.add('active');
            else hToggle.classList.remove('active');
        }
    },

    handleKeyboard: function(e) {
        // Only active if interface is visible and counters exist
        if (document.getElementById('tally-container') && this.counters.length > 0) {
            // First counter target
            const firstId = this.counters[0].id;
            const firstStep = this.counters[0].step;

            if (e.code === 'ArrowUp') {
                e.preventDefault();
                this.updateValue(firstId, firstStep);
            } else if (e.code === 'ArrowDown') {
                e.preventDefault();
                this.updateValue(firstId, -firstStep);
            }
        }
    }
};