if (!window.AppCalculators.category_4) window.AppCalculators.category_4 = {};

window.AppCalculators.category_4.pass_gen = {
    name: "Password Generator",
    id: "pass_gen",

    // Default State
    state: {
        length: 16,
        count: 1,
        mode: 'random', // 'random', 'pin', 'passphrase'
        options: {
            upper: true,
            lower: true,
            numbers: true,
            symbols: true,
            excludeAmbiguous: false
        },
        passphraseSeparator: '-',
        passphraseCap: true, // Capitalize words
        history: []
    },

    // Small dictionary for passphrase generation (approx 300 words)
    wordList: [
        "apple", "brave", "cloud", "delta", "eagle", "flame", "grape", "house", "image", "jolly", "kite", "lemon", "mango", "noble", "ocean", "piano", "queen", "river", "stone", "tiger", "unity", "vivid", "whale", "xenon", "yacht", "zebra", "amber", "beach", "coral", "dream", "earth", "frost", "giant", "haven", "iron", "jewel", "knife", "light", "magic", "night", "oasis", "pearl", "quest", "radio", "solar", "train", "urban", "vapor", "water", "youth", "azure", "berry", "crisp", "dusk", "ember", "flora", "glory", "happy", "ivory", "jump", "koala", "lunar", "misty", "nova", "orbit", "petal", "quiet", "royal", "spark", "tulip", "ultra", "vault", "windy", "xerox", "yield", "zest", "baker", "chef", "diver", "pilot", "nurse", "judge", "guard", "clerk", "actor", "artist", "poet", "monk", "ninja", "robot", "alien", "ghost", "witch", "fairy", "gnome", "troll", "beast", "demon", "angel", "saint", "titan", "hydra", "viper", "cobra", "shark", "hawk", "crow", "dove", "swan", "duck", "lion", "bear", "wolf", "fox", "deer", "boar", "bull", "cow", "goat", "lamb", "frog", "toad", "crab", "fish", "seal", "ant", "bee", "wasp", "moth", "worm", "snail", "slug", "fly", "bat", "rat", "cat", "dog", "pig", "hen", "owl", "jay", "elk", "yak", "ape", "imp", "orc", "elf", "ent", "sky", "sea", "sun", "moon", "star", "mars", "bolt", "rain", "snow", "hail", "fog", "dew", "ice", "fire", "ash", "dust", "sand", "mud", "clay", "rock", "lava", "gold", "ruby", "opal", "jade", "onyx", "zinc", "lead", "tin", "salt", "lime", "mint", "sage", "dill", "thyme", "basil", "rose", "lily", "iris", "fern", "moss", "palm", "pine", "oak", "elm", "ash", "yew", "ivy", "vine", "leaf", "bark", "root", "seed", "nut", "pod", "bud", "red", "blue", "tan", "gray", "teal", "cyan", "pink", "lime", "road", "path", "way", "door", "gate", "wall", "roof", "room", "hall", "desk", "chair", "bed", "lamp", "book", "pen", "ink", "map", "key", "lock", "box", "bag", "cup", "mug", "jar", "pan", "pot", "hat", "cap", "tie", "shoe", "boot", "sock", "vest", "coat", "belt", "ring", "wand", "bow", "axe", "mace", "club", "whip", "net", "trap", "cage", "rope", "wire", "chain", "flag", "sign", "post", "pole", "mast", "sail", "ship", "boat", "car", "bus", "van", "cab", "jet", "bike"
    ],

    getHtml: function() {
        return `
        <div class="pg-wrapper">
            <div class="pg-header">
                <div class="pg-modes">
                    <button class="pg-mode-btn active" data-mode="random">Random</button>
                    <button class="pg-mode-btn" data-mode="pin">PIN</button>
                    <button class="pg-mode-btn" data-mode="passphrase">Passphrase</button>
                </div>
            </div>

            <div class="pg-display-card">
                <div class="pg-password-box">
                    <input type="text" id="pg-output" readonly value="Generating...">
                    <div class="pg-actions">
                        <button id="pg-copy-btn" title="Copy to Clipboard"><i class="fas fa-copy"></i></button>
                        <button id="pg-regen-btn" title="Generate New"><i class="fas fa-sync-alt"></i></button>
                    </div>
                </div>
                <div class="pg-strength-container">
                    <div class="pg-strength-bar">
                        <div id="pg-strength-fill" style="width: 0%;"></div>
                    </div>
                    <span id="pg-strength-text">Evaluating...</span>
                </div>
            </div>

            <div class="pg-controls-grid">
                
                <div class="pg-control-box full-width">
                    <div class="flex-label">
                        <label id="pg-len-label">Password Length</label>
                        <span id="pg-len-val" class="pg-val-badge">16</span>
                    </div>
                    <input type="range" id="pg-length-slider" min="4" max="64" value="16" class="pg-slider">
                </div>

                <div id="opts-random" class="pg-options-group">
                    <label class="pg-check">
                        <input type="checkbox" id="chk-upper" checked>
                        <span class="chk-box"><i class="fas fa-check"></i></span>
                        <span>Uppercase (A-Z)</span>
                    </label>
                    <label class="pg-check">
                        <input type="checkbox" id="chk-lower" checked>
                        <span class="chk-box"><i class="fas fa-check"></i></span>
                        <span>Lowercase (a-z)</span>
                    </label>
                    <label class="pg-check">
                        <input type="checkbox" id="chk-num" checked>
                        <span class="chk-box"><i class="fas fa-check"></i></span>
                        <span>Numbers (0-9)</span>
                    </label>
                    <label class="pg-check">
                        <input type="checkbox" id="chk-sym" checked>
                        <span class="chk-box"><i class="fas fa-check"></i></span>
                        <span>Symbols (!@#$)</span>
                    </label>
                    <label class="pg-check full">
                        <input type="checkbox" id="chk-ambig">
                        <span class="chk-box"><i class="fas fa-check"></i></span>
                        <span>Exclude Ambiguous (I, l, 1, O, 0)</span>
                    </label>
                </div>

                <div id="opts-passphrase" class="pg-options-group" style="display:none;">
                    <label class="pg-check">
                        <input type="checkbox" id="chk-pp-cap" checked>
                        <span class="chk-box"><i class="fas fa-check"></i></span>
                        <span>Capitalize Words</span>
                    </label>
                    <div class="pg-select-row">
                        <label>Separator:</label>
                        <select id="pg-pp-sep" class="pg-select">
                            <option value="-">Hyphen (-)</option>
                            <option value=".">Period (.)</option>
                            <option value="_">Underscore (_)</option>
                            <option value=" ">Space ( )</option>
                            <option value="">None</option>
                        </select>
                    </div>
                </div>

                <div class="pg-control-box full-width" style="margin-top:15px;">
                    <div class="pg-batch-row">
                        <label>Batch Generate:</label>
                        <div class="counter-input">
                            <button id="batch-minus">-</button>
                            <input type="number" id="pg-batch-count" value="1" min="1" max="10" readonly>
                            <button id="batch-plus">+</button>
                        </div>
                        <button id="pg-batch-btn" class="pg-main-btn">Generate</button>
                    </div>
                </div>
            </div>

            <div class="pg-history-panel" id="pg-history-panel" style="display:none;">
                <div class="pg-hist-header">
                    <h4>Generated Passwords</h4>
                    <button id="pg-clear-hist">Clear</button>
                </div>
                <div id="pg-history-list" class="pg-hist-list"></div>
                <div class="pg-disclaimer">
                    <i class="fas fa-shield-alt"></i> Passwords are generated locally in your browser. No data is stored or sent to any server.
                </div>
            </div>
        </div>
        `;
    },

    init: function() {
        this.cacheDOM();
        this.bindEvents();
        this.generate(); // Initial generation
    },

    cacheDOM: function() {
        this.dom = {
            output: document.getElementById('pg-output'),
            lenSlider: document.getElementById('pg-length-slider'),
            lenVal: document.getElementById('pg-len-val'),
            lenLabel: document.getElementById('pg-len-label'),
            
            // Mode Toggles
            modeBtns: document.querySelectorAll('.pg-mode-btn'),
            optsRandom: document.getElementById('opts-random'),
            optsPassphrase: document.getElementById('opts-passphrase'),
            
            // Checkboxes
            chkUpper: document.getElementById('chk-upper'),
            chkLower: document.getElementById('chk-lower'),
            chkNum: document.getElementById('chk-num'),
            chkSym: document.getElementById('chk-sym'),
            chkAmbig: document.getElementById('chk-ambig'),
            chkPPCap: document.getElementById('chk-pp-cap'),
            ppSep: document.getElementById('pg-pp-sep'),

            // Strength
            strengthFill: document.getElementById('pg-strength-fill'),
            strengthText: document.getElementById('pg-strength-text'),

            // Batch
            batchCount: document.getElementById('pg-batch-count'),
            batchPlus: document.getElementById('batch-plus'),
            batchMinus: document.getElementById('batch-minus'),
            batchBtn: document.getElementById('pg-batch-btn'),
            
            // History
            histPanel: document.getElementById('pg-history-panel'),
            histList: document.getElementById('pg-history-list'),
            clearHist: document.getElementById('pg-clear-hist'),
            
            // Actions
            copyBtn: document.getElementById('pg-copy-btn'),
            regenBtn: document.getElementById('pg-regen-btn')
        };
    },

    bindEvents: function() {
        // Mode Switching
        this.dom.modeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.dom.modeBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.state.mode = e.target.dataset.mode;
                this.updateUIForMode();
                this.generate();
            });
        });

        // Sliders & Inputs
        this.dom.lenSlider.addEventListener('input', (e) => {
            this.state.length = parseInt(e.target.value);
            this.dom.lenVal.innerText = this.state.length;
            this.generate();
        });

        // Option Toggles
        const inputs = [this.dom.chkUpper, this.dom.chkLower, this.dom.chkNum, this.dom.chkSym, this.dom.chkAmbig, this.dom.chkPPCap, this.dom.ppSep];
        inputs.forEach(el => {
            el.addEventListener('change', () => {
                this.updateState();
                this.generate();
            });
        });

        // Batch Counter
        this.dom.batchPlus.addEventListener('click', () => {
            if(this.state.count < 20) this.state.count++;
            this.dom.batchCount.value = this.state.count;
        });
        this.dom.batchMinus.addEventListener('click', () => {
            if(this.state.count > 1) this.state.count--;
            this.dom.batchCount.value = this.state.count;
        });

        // Actions
        this.dom.regenBtn.addEventListener('click', () => this.generate());
        this.dom.batchBtn.addEventListener('click', () => this.generateBatch());
        this.dom.copyBtn.addEventListener('click', () => {
            this.copyToClipboard(this.dom.output.value);
        });
        this.dom.clearHist.addEventListener('click', () => {
            this.state.history = [];
            this.renderHistory();
        });
    },

    updateUIForMode: function() {
        const slider = this.dom.lenSlider;
        const label = this.dom.lenLabel;
        
        if (this.state.mode === 'random') {
            this.dom.optsRandom.style.display = 'grid';
            this.dom.optsPassphrase.style.display = 'none';
            label.innerText = "Password Length";
            slider.min = 4; slider.max = 64; slider.value = 16;
        } else if (this.state.mode === 'pin') {
            this.dom.optsRandom.style.display = 'none';
            this.dom.optsPassphrase.style.display = 'none';
            label.innerText = "PIN Length";
            slider.min = 3; slider.max = 12; slider.value = 4;
        } else if (this.state.mode === 'passphrase') {
            this.dom.optsRandom.style.display = 'none';
            this.dom.optsPassphrase.style.display = 'block';
            label.innerText = "Word Count";
            slider.min = 3; slider.max = 10; slider.value = 4;
        }
        
        this.state.length = parseInt(slider.value);
        this.dom.lenVal.innerText = slider.value;
    },

    updateState: function() {
        this.state.options.upper = this.dom.chkUpper.checked;
        this.state.options.lower = this.dom.chkLower.checked;
        this.state.options.numbers = this.dom.chkNum.checked;
        this.state.options.symbols = this.dom.chkSym.checked;
        this.state.options.excludeAmbiguous = this.dom.chkAmbig.checked;
        this.state.passphraseCap = this.dom.chkPPCap.checked;
        this.state.passphraseSeparator = this.dom.ppSep.value;
    },

    generate: function() {
        // Reset Batch mode visual if single generate
        if(this.state.count === 1) {
            const pwd = this.createSinglePassword();
            this.dom.output.value = pwd;
            this.assessStrength(pwd);
        }
    },

    generateBatch: function() {
        if(this.state.count === 1) {
            this.generate();
            this.addToHistory(this.dom.output.value);
            return;
        }

        const batch = [];
        for(let i=0; i<this.state.count; i++) {
            batch.push(this.createSinglePassword());
        }
        
        // Show last in main, add all to history
        this.dom.output.value = batch[batch.length-1];
        this.assessStrength(batch[batch.length-1]);
        
        batch.forEach(p => this.addToHistory(p));
        this.dom.histPanel.style.display = 'block';
        this.dom.histPanel.scrollIntoView({behavior: 'smooth'});
    },

    createSinglePassword: function() {
        const mode = this.state.mode;
        
        if (mode === 'pin') {
            return this.generateRandomString(this.state.length, '0123456789');
        } 
        else if (mode === 'passphrase') {
            return this.generatePassphrase();
        } 
        else {
            return this.generateComplexPassword();
        }
    },

    generateComplexPassword: function() {
        const s = this.state.options;
        const len = this.state.length;
        
        const sets = {
            upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            lower: "abcdefghijklmnopqrstuvwxyz",
            num: "0123456789",
            sym: "!@#$%^&*()_+~`|}{[]:;?><,./-="
        };

        let chars = "";
        let password = "";
        
        // Force include one of each selected
        if (s.upper) { password += this.pickOne(sets.upper); chars += sets.upper; }
        if (s.lower) { password += this.pickOne(sets.lower); chars += sets.lower; }
        if (s.numbers) { password += this.pickOne(sets.num); chars += sets.num; }
        if (s.symbols) { password += this.pickOne(sets.sym); chars += sets.sym; }

        // Remove Ambiguous if requested
        if (s.excludeAmbiguous) {
            const ambiguous = /[il1Lo0O]/g;
            chars = chars.replace(ambiguous, "");
            // Re-validate password start chars aren't ambiguous, simple replace
            password = password.replace(ambiguous, this.pickOne(chars));
        }

        if (chars.length === 0) return "Select Options!";

        // Fill remaining length
        while (password.length < len) {
            password += this.pickOne(chars);
        }

        // Shuffle
        return password.split('').sort(() => 0.5 - Math.random()).join('');
    },

    generatePassphrase: function() {
        let words = [];
        for(let i=0; i<this.state.length; i++) { // Length is word count here
            let w = this.wordList[Math.floor(Math.random() * this.wordList.length)];
            if(this.state.passphraseCap) w = w.charAt(0).toUpperCase() + w.slice(1);
            words.push(w);
        }
        return words.join(this.state.passphraseSeparator);
    },

    // Cryptographically secure random picker
    pickOne: function(str) {
        const arr = new Uint32Array(1);
        window.crypto.getRandomValues(arr);
        return str[arr[0] % str.length];
    },

    generateRandomString: function(len, chars) {
        let res = "";
        for(let i=0; i<len; i++) res += this.pickOne(chars);
        return res;
    },

    assessStrength: function(pwd) {
        if(this.state.mode === 'passphrase') {
            this.updateStrengthUI(100, "Very Strong (Passphrase)");
            return;
        }
        if(this.state.mode === 'pin') {
            const score = this.state.length >= 6 ? 50 : 20;
            this.updateStrengthUI(score, this.state.length >=6 ? "Medium (PIN)" : "Weak (PIN)");
            return;
        }

        // Complex Strength Heuristic
        let score = 0;
        if(pwd.length >= 8) score += 20;
        if(pwd.length >= 12) score += 20;
        if(pwd.length >= 16) score += 20;
        
        if(/[A-Z]/.test(pwd)) score += 10;
        if(/[a-z]/.test(pwd)) score += 10;
        if(/[0-9]/.test(pwd)) score += 10;
        if(/[^A-Za-z0-9]/.test(pwd)) score += 10;

        let label = "Weak";
        if(score >= 90) label = "Very Strong";
        else if(score >= 70) label = "Strong";
        else if(score >= 50) label = "Medium";

        this.updateStrengthUI(score, label);
    },

    updateStrengthUI: function(score, label) {
        const bar = this.dom.strengthFill;
        const text = this.dom.strengthText;
        
        bar.style.width = score + '%';
        text.innerText = label;

        bar.className = ''; // Reset
        if(score < 40) { bar.classList.add('weak'); text.style.color = '#e74c3c'; }
        else if(score < 80) { bar.classList.add('medium'); text.style.color = '#f39c12'; }
        else { bar.classList.add('strong'); text.style.color = '#2ecc71'; }
    },

    addToHistory: function(pwd) {
        this.state.history.unshift(pwd);
        if(this.state.history.length > 10) this.state.history.pop();
        this.renderHistory();
    },

    renderHistory: function() {
        if(this.state.history.length > 0) {
            this.dom.histPanel.style.display = 'block';
            this.dom.histList.innerHTML = this.state.history.map(p => `
                <div class="pg-hist-item" onclick="navigator.clipboard.writeText('${p}')">
                    <span class="p-text">${p}</span>
                    <i class="fas fa-copy"></i>
                </div>
            `).join('');
        } else {
            this.dom.histPanel.style.display = 'none';
        }
    },

    copyToClipboard: function(text) {
        navigator.clipboard.writeText(text).then(() => {
            const btn = this.dom.copyBtn;
            const original = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => btn.innerHTML = original, 1500);
        });
    }
};