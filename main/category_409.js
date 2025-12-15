// Category 409: Case Converter (Text) Tool
if (!window.AppCalculators) window.AppCalculators = {};
if (!window.AppCalculators.category_4) window.AppCalculators.category_4 = {};

window.AppCalculators.category_4.case_conv = {
    // Current state
    originalText: "",
    
    getHtml: function() {
        return `
            <div class="cc-wrapper">
                <div class="cc-stats-bar">
                    <div class="cc-stat"><span id="cc-char-count">0</span> Characters</div>
                    <div class="cc-stat"><span id="cc-word-count">0</span> Words</div>
                    <div class="cc-stat"><span id="cc-line-count">0</span> Lines</div>
                </div>

                <div class="cc-grid">
                    <div class="cc-text-box">
                        <div class="cc-box-header">
                            <span>Input Text</span>
                            <button class="cc-tool-btn" id="cc-clear-btn" title="Clear">
                                <i class="fas fa-eraser"></i> Clear
                            </button>
                        </div>
                        <textarea id="cc-input" class="cc-textarea" placeholder="Paste or type your text here..."></textarea>
                    </div>

                    <div class="cc-controls">
                        <span class="cc-group-label">Standard Cases</span>
                        <button class="cc-btn" onclick="window.AppCalculators.category_4.case_conv.transform('upper')">
                            UPPERCASE <i class="fas fa-font"></i>
                        </button>
                        <button class="cc-btn" onclick="window.AppCalculators.category_4.case_conv.transform('lower')">
                            lowercase <i class="fas fa-font" style="font-size:0.8em"></i>
                        </button>
                        <button class="cc-btn" onclick="window.AppCalculators.category_4.case_conv.transform('title')">
                            Title Case <i class="fas fa-heading"></i>
                        </button>
                        <button class="cc-btn" onclick="window.AppCalculators.category_4.case_conv.transform('sentence')">
                            Sentence case <i class="fas fa-align-left"></i>
                        </button>
                        <button class="cc-btn" onclick="window.AppCalculators.category_4.case_conv.transform('capital')">
                            Capitalize Word <i class="fas fa-text-height"></i>
                        </button>

                        <span class="cc-group-label">Developer Cases</span>
                        <button class="cc-btn" onclick="window.AppCalculators.category_4.case_conv.transform('camel')">
                            camelCase <i class="fas fa-code"></i>
                        </button>
                        <button class="cc-btn" onclick="window.AppCalculators.category_4.case_conv.transform('pascal')">
                            PascalCase <i class="fas fa-code"></i>
                        </button>
                        <button class="cc-btn" onclick="window.AppCalculators.category_4.case_conv.transform('snake')">
                            snake_case <i class="fas fa-underscore"></i>
                        </button>
                        <button class="cc-btn" onclick="window.AppCalculators.category_4.case_conv.transform('kebab')">
                            kebab-case <i class="fas fa-minus"></i>
                        </button>

                        <span class="cc-group-label">Fun / Misc</span>
                        <button class="cc-btn" onclick="window.AppCalculators.category_4.case_conv.transform('invert')">
                            iNVERT cASE <i class="fas fa-retweet"></i>
                        </button>
                        <button class="cc-btn" onclick="window.AppCalculators.category_4.case_conv.transform('alternating')">
                            aLtErNaTiNg <i class="fas fa-random"></i>
                        </button>
                    </div>

                    <div class="cc-text-box">
                        <div class="cc-box-header">
                            <span>Converted Result</span>
                            <div style="display:flex; gap:5px;">
                                <button class="cc-tool-btn" id="cc-undo-btn" title="Undo Last Change">
                                    <i class="fas fa-undo"></i>
                                </button>
                            </div>
                        </div>
                        <textarea id="cc-output" class="cc-textarea" placeholder="Result will appear here..." readonly></textarea>
                        <div class="cc-toolbar">
                            <button class="cc-tool-btn" onclick="window.AppCalculators.category_4.case_conv.downloadText()">
                                <i class="fas fa-download"></i> Save
                            </button>
                            <button class="cc-tool-btn" onclick="window.AppCalculators.category_4.case_conv.copyToInput()">
                                <i class="fas fa-arrow-left"></i> Use as Input
                            </button>
                            <button class="cc-tool-btn primary" onclick="window.AppCalculators.category_4.case_conv.copyOutput()">
                                <i class="fas fa-copy"></i> Copy Text
                            </button>
                        </div>
                    </div>
                </div>

                <p style="text-align:center; font-size:0.8rem; color:#999; margin-top:20px;">
                    <i class="fas fa-shield-alt"></i> Text is processed locally in your browser. No data is sent to any server.
                </p>
            </div>
        `;
    },

    init: function() {
        this.inputEl = document.getElementById('cc-input');
        this.outputEl = document.getElementById('cc-output');
        this.undoStack = [];
        
        // Listeners
        this.inputEl.addEventListener('input', () => {
            this.updateStats();
            // Optional: Auto-convert if a mode was selected? 
            // Better to keep manual for control, but we can clear output if input clears
            if(this.inputEl.value === "") this.outputEl.value = "";
        });

        document.getElementById('cc-clear-btn').onclick = () => {
            if(confirm("Clear all text?")) {
                this.inputEl.value = "";
                this.outputEl.value = "";
                this.updateStats();
            }
        };

        document.getElementById('cc-undo-btn').onclick = () => this.undo();

        this.updateStats();
    },

    updateStats: function() {
        const text = this.inputEl.value;
        const chars = text.length;
        const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
        const lines = text === "" ? 0 : text.split(/\r\n|\r|\n/).length;

        document.getElementById('cc-char-count').innerText = chars.toLocaleString();
        document.getElementById('cc-word-count').innerText = words.toLocaleString();
        document.getElementById('cc-line-count').innerText = lines.toLocaleString();
    },

    saveState: function() {
        if(this.outputEl.value) {
            this.undoStack.push(this.outputEl.value);
            if(this.undoStack.length > 10) this.undoStack.shift();
        }
    },

    undo: function() {
        if(this.undoStack.length > 0) {
            this.outputEl.value = this.undoStack.pop();
        }
    },

    transform: function(type) {
        const text = this.inputEl.value;
        if (!text) return;

        this.saveState();
        let result = "";

        switch(type) {
            case 'upper':
                result = text.toUpperCase();
                break;
            case 'lower':
                result = text.toLowerCase();
                break;
            case 'title':
                // Capitalize first letter of every word, lower others. 
                // Advanced: Ignore minor words could be added, but standard "Title Case" usually converts all words
                // We will use a smart logic for common minor words if needed, but standard logic is usually strictly algorithmic.
                // Let's implement a robust one.
                result = this.toTitleCase(text);
                break;
            case 'sentence':
                result = this.toSentenceCase(text);
                break;
            case 'capital':
                // Capitalize First Letter of Every Word (Simple)
                result = text.replace(/\b\w/g, c => c.toUpperCase());
                break;
            case 'camel':
                result = this.toDeveloperCase(text, 'camel');
                break;
            case 'pascal':
                result = this.toDeveloperCase(text, 'pascal');
                break;
            case 'snake':
                result = this.toDeveloperCase(text, 'snake');
                break;
            case 'kebab':
                result = this.toDeveloperCase(text, 'kebab');
                break;
            case 'invert':
                result = text.split('').map(c => 
                    c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()
                ).join('');
                break;
            case 'alternating':
                result = text.split('').map((c, i) => 
                    i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()
                ).join('');
                break;
        }

        this.outputEl.value = result;
    },

    // --- Logic Helpers ---

    toTitleCase: function(str) {
        // Basic list of minor words to keep lowercase unless first/last
        const minorWords = /^(a|an|the|and|but|or|for|nor|on|at|to|from|by|of|in|with)$/i;
        
        return str.toLowerCase().replace(/(\w+|['’]\w+)/g, (match, word, index) => {
            // Check if it's the first word or not a minor word
            if (index === 0 || !minorWords.test(word) || str[index-1] === '\n' || str[index-2] === '.') {
                return word.charAt(0).toUpperCase() + word.slice(1);
            }
            return word;
        });
    },

    toSentenceCase: function(str) {
        // Lowercase everything first
        let s = str.toLowerCase();
        // Capitalize start of string
        s = s.replace(/(^\s*\w)/, c => c.toUpperCase());
        // Capitalize after sentence terminators (. ? !) followed by space
        s = s.replace(/([.?!]\s+)(\w)/g, (match, p1, p2) => p1 + p2.toUpperCase());
        // Handle 'i'
        s = s.replace(/\b(i)\b/g, 'I');
        return s;
    },

    toDeveloperCase: function(str, type) {
        // Split by non-alphanumeric chars, but keep formatting somewhat logic
        // 1. Clean string: remove special chars, split by spaces/underscores/dashes
        let words = str.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g);
        
        if (!words) return str; // Fallback

        if (type === 'snake') {
            return words.map(x => x.toLowerCase()).join('_');
        }
        if (type === 'kebab') {
            return words.map(x => x.toLowerCase()).join('-');
        }
        if (type === 'camel') {
            return words.map((x, i) => {
                let w = x.toLowerCase();
                if (i > 0) w = w.charAt(0).toUpperCase() + w.slice(1);
                return w;
            }).join('');
        }
        if (type === 'pascal') {
            return words.map(x => {
                let w = x.toLowerCase();
                return w.charAt(0).toUpperCase() + w.slice(1);
            }).join('');
        }
        return str;
    },

    // --- IO Helpers ---

    copyOutput: function() {
        if(!this.outputEl.value) return;
        this.outputEl.select();
        document.execCommand('copy');
        
        // Visual Feedback
        const btn = document.querySelector('.cc-tool-btn.primary');
        const orig = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => btn.innerHTML = orig, 1500);
    },

    copyToInput: function() {
        if(!this.outputEl.value) return;
        this.inputEl.value = this.outputEl.value;
        this.outputEl.value = ""; // Optional: Clear output to indicate transfer? Or keep it.
        // Let's keep input updated stats
        this.updateStats();
    },

    downloadText: function() {
        const text = this.outputEl.value || this.inputEl.value;
        if(!text) {
            alert("No text to download.");
            return;
        }
        
        const blob = new Blob([text], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "converted_text.txt";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};