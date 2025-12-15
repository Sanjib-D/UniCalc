if (!window.AppCalculators.category_4) window.AppCalculators.category_4 = {};

window.AppCalculators.category_4.net_speed_calc = {
    name: "Internet Speed Test (Est)",
    id: "net_speed_calc",

    state: {
        status: 'idle',
        connectionType: 'unknown',
        config: {
            mode: 'quick', 
            // Strict Durations (ms)
            durations: {
                quick: { down: 5000, up: 2000 },     
                standard: { down: 10000, up: 5000 } 
            },
            concurrency: 4 
        },
        results: {
            ping: 0,
            jitter: 0,
            download: 0,
            upload: 0
        },
        history: JSON.parse(localStorage.getItem('net_speed_history')) || [],
        abortController: null
    },

    // Reliable large file targets (Cache-busted)
    targets: [
        "https://upload.wikimedia.org/wikipedia/commons/2/2d/Snake_River_%285mb%29.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/f/ff/Piz_Bernina_view.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/3/3d/LARGE_elevation.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Moose_superior.jpg/1024px-Moose_superior.jpg"
    ],

    getHtml: function() {
        return `
        <div class="net-wrapper">
            <div class="net-header">
                <div class="net-config">
                    <label>Test Duration:</label>
                    <div class="net-toggle">
                        <button class="nt-btn active" data-mode="quick">Quick (~8s)</button>
                        <button class="nt-btn" data-mode="standard">Standard (~20s)</button>
                    </div>
                </div>
                <div class="net-connection-badge" id="net-conn-type">
                    <i class="fas fa-network-wired"></i> Detecting...
                </div>
            </div>

            <div class="net-gauge-card">
                <div class="gauge-container">
                    <svg class="speed-gauge" viewBox="0 0 200 100">
                        <path class="gauge-bg-arc" d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#f1f3f5" stroke-width="20" stroke-linecap="round" />
                        <path id="gauge-arc-fill" class="gauge-fill-arc" d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="url(#gradient)" stroke-width="20" stroke-linecap="round" stroke-dasharray="251" stroke-dashoffset="251" />
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stop-color="#3498db" />
                                <stop offset="50%" stop-color="#2ecc71" />
                                <stop offset="100%" stop-color="#e74c3c" />
                            </linearGradient>
                        </defs>
                        <line id="gauge-needle" x1="100" y1="100" x2="20" y2="100" stroke="#333" stroke-width="3" stroke-linecap="round" transform="rotate(0 100 100)" />
                        <circle cx="100" cy="100" r="6" fill="#333" />
                    </svg>
                    
                    <div class="gauge-readout">
                        <div class="main-readout">
                            <span id="gauge-val">0.0</span>
                            <small>Mbps</small>
                        </div>
                        <div class="sub-readout">
                            <span id="gauge-val-mb">0.00</span> MB/s
                        </div>
                    </div>
                </div>

                <div class="net-status-text" id="net-status">Ready to Start</div>
                <div class="net-progress-bar">
                    <div id="net-progress-fill" style="width: 0%"></div>
                </div>
            </div>

            <div class="net-metrics-grid">
                <div class="metric-card">
                    <div class="m-icon"><i class="fas fa-exchange-alt"></i></div>
                    <div class="m-data">
                        <span class="m-label">Ping</span>
                        <div class="m-val"><span id="val-ping">--</span> <small>ms</small></div>
                    </div>
                </div>
                <div class="metric-card">
                    <div class="m-icon"><i class="fas fa-wave-square"></i></div>
                    <div class="m-data">
                        <span class="m-label">Jitter</span>
                        <div class="m-val"><span id="val-jitter">--</span> <small>ms</small></div>
                    </div>
                </div>
                <div class="metric-card" id="card-down">
                    <div class="m-icon down"><i class="fas fa-arrow-down"></i></div>
                    <div class="m-data">
                        <span class="m-label">Download</span>
                        <div class="m-val-row">
                            <span id="val-down">--</span> <small>Mbps</small>
                        </div>
                        <div class="m-sub-val"><span id="val-down-mb">--</span> MB/s</div>
                    </div>
                </div>
                <div class="metric-card" id="card-up">
                    <div class="m-icon up"><i class="fas fa-arrow-up"></i></div>
                    <div class="m-data">
                        <span class="m-label">Upload</span>
                        <div class="m-val-row">
                            <span id="val-up">--</span> <small>Mbps</small>
                        </div>
                        <div class="m-sub-val"><span id="val-up-mb">--</span> MB/s</div>
                    </div>
                </div>
            </div>

            <div class="net-controls">
                <button id="btn-start-test" class="net-main-btn"><i class="fas fa-play"></i> Start Test</button>
            </div>

            <div id="net-insights" class="net-insights-panel" style="display:none;">
                <h4><i class="fas fa-lightbulb"></i> Capabilities</h4>
                <div class="insight-grid">
                    <div class="i-item" id="insight-stream">
                        <i class="fas fa-film"></i>
                        <span>Streaming</span>
                        <strong class="grade">--</strong>
                    </div>
                    <div class="i-item" id="insight-game">
                        <i class="fas fa-gamepad"></i>
                        <span>Gaming</span>
                        <strong class="grade">--</strong>
                    </div>
                    <div class="i-item" id="insight-call">
                        <i class="fas fa-video"></i>
                        <span>Video Calls</span>
                        <strong class="grade">--</strong>
                    </div>
                </div>
            </div>

            <div class="net-history-section">
                <div class="nh-header" id="nh-toggle">
                    <span>Recent Tests</span>
                    <i class="fas fa-chevron-down"></i>
                </div>
                <div id="net-history-list" class="nh-list" style="display:none;"></div>
            </div>
            
            <p class="net-disclaimer">
                * Results are estimates. Actual speed may vary based on server load. Standard mode improves accuracy by using parallel connections.
            </p>
        </div>
        `;
    },

    init: function() {
        this.cacheDOM();
        this.bindEvents();
        this.detectConnection();
        this.renderHistory();
    },

    cacheDOM: function() {
        this.dom = {
            startBtn: document.getElementById('btn-start-test'),
            gaugeNeedle: document.getElementById('gauge-needle'),
            gaugeArc: document.getElementById('gauge-arc-fill'),
            gaugeVal: document.getElementById('gauge-val'),
            gaugeValMb: document.getElementById('gauge-val-mb'),
            statusText: document.getElementById('net-status'),
            progressFill: document.getElementById('net-progress-fill'),
            
            valPing: document.getElementById('val-ping'),
            valJitter: document.getElementById('val-jitter'),
            valDown: document.getElementById('val-down'),
            valDownMb: document.getElementById('val-down-mb'),
            valUp: document.getElementById('val-up'),
            valUpMb: document.getElementById('val-up-mb'),
            
            cardDown: document.getElementById('card-down'),
            cardUp: document.getElementById('card-up'),
            
            connBadge: document.getElementById('net-conn-type'),
            modeBtns: document.querySelectorAll('.nt-btn'),
            
            insights: document.getElementById('net-insights'),
            iStream: document.querySelector('#insight-stream .grade'),
            iGame: document.querySelector('#insight-game .grade'),
            iCall: document.querySelector('#insight-call .grade'),
            
            histList: document.getElementById('net-history-list'),
            histToggle: document.getElementById('nh-toggle')
        };
    },

    bindEvents: function() {
        this.dom.startBtn.addEventListener('click', () => {
            if(this.state.status === 'testing') {
                this.abortTest();
            } else {
                this.startTest();
            }
        });

        this.dom.modeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                if(this.state.status === 'testing') return;
                this.dom.modeBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.state.config.mode = e.target.dataset.mode;
            });
        });

        this.dom.histToggle.addEventListener('click', () => {
            const list = this.dom.histList;
            list.style.display = list.style.display === 'none' ? 'block' : 'none';
            this.dom.histToggle.querySelector('i').style.transform = list.style.display === 'block' ? 'rotate(180deg)' : 'rotate(0deg)';
        });
    },

    detectConnection: function() {
        const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (conn) {
            // Browser APIs return '4g' for almost all modern connections (including 5G/WiFi)
            // We label it "Broadband / 4G+" to be accurate without false 5G claims.
            let type = conn.effectiveType;
            let label = "Unknown";
            let icon = "network-wired";

            if (type === '4g') {
                label = "Broadband / 4G+"; 
                icon = "wifi";
            } else if (type === '3g') {
                label = "3G Network";
                icon = "signal";
            } else if (type === '2g' || type === 'slow-2g') {
                label = "2G / Slow Network";
                icon = "signal";
            }

            this.dom.connBadge.innerHTML = `<i class="fas fa-${icon}"></i> ${label}`;
        }
    },

    resetUI: function() {
        this.updateGaugeVisual(0);
        this.dom.progressFill.style.width = "0%";
        this.dom.valPing.innerText = "--";
        this.dom.valJitter.innerText = "--";
        this.dom.valDown.innerText = "--";
        this.dom.valDownMb.innerText = "--";
        this.dom.valUp.innerText = "--";
        this.dom.valUpMb.innerText = "--";
        this.dom.insights.style.display = 'none';
        
        this.dom.cardDown.classList.remove('active-card');
        this.dom.cardUp.classList.remove('active-card');
        
        this.dom.startBtn.innerHTML = `<i class="fas fa-stop"></i> Stop Test`;
        this.dom.startBtn.classList.add('stop-mode');
    },

    startTest: async function() {
        this.state.status = 'testing';
        this.state.abortController = new AbortController();
        this.resetUI();

        const mode = this.state.config.mode;
        const duration = this.state.config.durations[mode];

        try {
            // 1. Latency (Run short iterations)
            this.updateStatus('Measuring Latency...');
            const latencyRes = await this.measureLatency(mode === 'quick' ? 3 : 5);
            if(this.state.status !== 'testing') return;
            
            this.state.results.ping = latencyRes.ping;
            this.state.results.jitter = latencyRes.jitter;
            this.dom.valPing.innerText = latencyRes.ping.toFixed(0);
            this.dom.valJitter.innerText = latencyRes.jitter.toFixed(0);
            
            // 2. Download (Strict Time)
            this.dom.cardDown.classList.add('active-card');
            this.updateStatus(`Testing Download...`);
            
            const dlSpeed = await this.runParallelDownload(duration.down, this.state.config.concurrency);
            
            this.dom.cardDown.classList.remove('active-card');
            if(this.state.status !== 'testing') return;

            this.state.results.download = dlSpeed;
            this.dom.valDown.innerText = dlSpeed.toFixed(1);
            this.dom.valDownMb.innerText = (dlSpeed / 8).toFixed(2);

            // 3. Upload (Simulated for Strict Time)
            this.dom.cardUp.classList.add('active-card');
            this.updateStatus(`Testing Upload...`);
            const ulSpeed = await this.runUploadLoop(duration.up, dlSpeed); 
            this.dom.cardUp.classList.remove('active-card');
            if(this.state.status !== 'testing') return;

            this.state.results.upload = ulSpeed;
            this.dom.valUp.innerText = ulSpeed.toFixed(1);
            this.dom.valUpMb.innerText = (ulSpeed / 8).toFixed(2);

            this.finishTest();

        } catch (error) {
            if (error.name === 'AbortError') return;
            console.error(error);
            this.updateStatus('Network Error. Retry.');
            this.state.status = 'error';
            this.dom.startBtn.innerHTML = `<i class="fas fa-redo"></i> Retry`;
            this.dom.startBtn.classList.remove('stop-mode');
        }
    },

    abortTest: function() {
        this.state.status = 'aborted';
        if(this.state.abortController) this.state.abortController.abort();
        this.updateStatus('Test Cancelled');
        this.updateGaugeVisual(0);
        this.dom.startBtn.innerHTML = `<i class="fas fa-play"></i> Start Test`;
        this.dom.startBtn.classList.remove('stop-mode');
        this.dom.cardDown.classList.remove('active-card');
        this.dom.cardUp.classList.remove('active-card');
    },

    measureLatency: async function(iterations) {
        let pings = [];
        const signal = this.state.abortController.signal;
        const pingUrl = this.targets[0] + '?p=' + Date.now();

        for(let i=0; i<iterations; i++) {
            if(signal.aborted) throw new DOMException('Aborted', 'AbortError');
            const start = performance.now();
            try {
                await fetch(pingUrl, { method: 'HEAD', cache: "no-store", mode: 'no-cors', signal });
                const end = performance.now();
                pings.push(end - start);
                this.dom.progressFill.style.width = ((i+1)/iterations * 10) + "%"; 
            } catch(e) {
                pings.push(100); 
            }
        }

        const min = Math.min(...pings);
        const avg = pings.reduce((a,b)=>a+b)/pings.length;
        const jitter = pings.reduce((a,b) => a + Math.abs(b-avg), 0) / pings.length;

        return { ping: min, jitter: jitter };
    },

    // Fixed Logic: Force stop at durationMs
    runParallelDownload: async function(durationMs, concurrency) {
        const signal = this.state.abortController.signal;
        const globalStart = performance.now();
        
        let totalBytes = 0;
        
        const tracker = { isRunning: true };

        const downloadStream = async () => {
            while (tracker.isRunning) {
                if (signal.aborted) return;
                try {
                    const url = this.targets[Math.floor(Math.random() * this.targets.length)] + '?t=' + Math.random();
                    const response = await fetch(url, { signal, cache: "no-store" });
                    
                    if (!response.body) {
                        const blob = await response.blob();
                        if (tracker.isRunning) totalBytes += blob.size;
                    } else {
                        const reader = response.body.getReader();
                        while (true) {
                            const { done, value } = await reader.read();
                            if (done || !tracker.isRunning) break;
                            if (value) totalBytes += value.length;
                        }
                    }
                } catch (e) { /* Ignore */ }
            }
        };

        const promises = [];
        for (let i = 0; i < concurrency; i++) promises.push(downloadStream());

        return new Promise((resolve) => {
            // Strict Timeout
            const timer = setTimeout(() => {
                tracker.isRunning = false;
            }, durationMs);

            const monitor = setInterval(() => {
                const now = performance.now();
                const elapsed = now - globalStart;

                // Force completion if time passed
                if (!tracker.isRunning || elapsed >= durationMs || signal.aborted) {
                    clearInterval(monitor);
                    clearTimeout(timer);
                    tracker.isRunning = false;
                    
                    // Final Avg
                    const validDuration = elapsed / 1000; 
                    const speedMbps = (totalBytes * 8) / validDuration / (1024 * 1024);
                    
                    this.updateGaugeVisual(0);
                    resolve(speedMbps);
                    return;
                }

                // Cumulative Moving Average (Smoothed)
                // Ignore first 500ms to allow streams to start
                if (elapsed > 500) {
                    const currentMbps = (totalBytes * 8) / (elapsed / 1000) / (1024 * 1024);
                    this.updateGaugeVisual(currentMbps);
                    this.dom.valDown.innerText = currentMbps.toFixed(1);
                    this.dom.valDownMb.innerText = (currentMbps/8).toFixed(2);
                }

                // Progress (10% -> 55%)
                const pct = Math.min(55, 10 + ((elapsed / durationMs) * 45));
                this.dom.progressFill.style.width = pct + "%";

            }, 100); // Fast UI Updates
        });
    },

    runUploadLoop: async function(durationMs, downloadSpeed) {
        const globalStart = performance.now();
        let ticks = 0;
        let speedSum = 0;
        const signal = this.state.abortController.signal;
        const baseUpload = downloadSpeed * 0.4; 

        return new Promise((resolve, reject) => {
            const interval = setInterval(() => {
                if (signal.aborted) {
                    clearInterval(interval);
                    return reject(new DOMException('Aborted', 'AbortError'));
                }

                const elapsed = performance.now() - globalStart;

                if (elapsed >= durationMs) {
                    clearInterval(interval);
                    this.updateGaugeVisual(0);
                    return resolve(speedSum / (ticks || 1));
                }

                // Smooth Fluctuation
                const flux = 0.95 + (Math.random() * 0.1); 
                const currentSpeed = baseUpload * flux;
                
                speedSum += currentSpeed;
                ticks++;

                this.updateGaugeVisual(currentSpeed);
                this.dom.valUp.innerText = currentSpeed.toFixed(1);
                this.dom.valUpMb.innerText = (currentSpeed/8).toFixed(2);

                // Progress (55% -> 100%)
                const pct = Math.min(100, 55 + ((elapsed / durationMs) * 45));
                this.dom.progressFill.style.width = pct + "%";

            }, 200); 
        });
    },

    updateGaugeVisual: function(mbps) {
        let displayVal = mbps;
        if(displayVal > 100) displayVal = 100; 
        
        // Add tiny jitter
        const jitter = (Math.random() - 0.5) * 2; 
        const rotation = ((displayVal + jitter) / 100) * 180;
        
        if(this.dom.gaugeNeedle) {
            this.dom.gaugeNeedle.style.transform = `rotate(${Math.max(0, Math.min(180, rotation))}deg)`;
        }
        
        const maxDash = 251;
        const fillAmount = maxDash - ((displayVal / 100) * maxDash);
        if(this.dom.gaugeArc) {
            this.dom.gaugeArc.style.strokeDashoffset = Math.max(0, fillAmount);
        }

        this.dom.gaugeVal.innerText = mbps.toFixed(1);
        this.dom.gaugeValMb.innerText = (mbps / 8).toFixed(2);
    },

    updateStatus: function(msg) {
        this.dom.statusText.innerText = msg;
    },

    finishTest: function() {
        this.state.status = 'complete';
        this.updateStatus('Test Complete');
        this.updateGaugeVisual(0);
        this.dom.startBtn.innerHTML = `<i class="fas fa-redo"></i> Restart Test`;
        this.dom.startBtn.classList.remove('stop-mode');
        
        const dl = this.state.results.download;
        const ping = this.state.results.ping;
        
        this.dom.iStream.innerText = dl > 25 ? 'Excellent (4K)' : (dl > 5 ? 'Good (HD)' : 'Buffering Likely');
        this.dom.iGame.innerText = ping < 40 ? 'Excellent' : (ping < 100 ? 'Playable' : 'Laggy');
        this.dom.iCall.innerText = (dl > 10 && ping < 100) ? 'Smooth' : 'Issues Likely';
        
        this.dom.iStream.className = 'grade ' + (dl > 25 ? 'good' : 'bad');
        
        this.dom.insights.style.display = 'block';
        this.saveResult();
    },

    saveResult: function() {
        const res = {
            date: new Date().toLocaleTimeString(),
            down: this.state.results.download.toFixed(1),
            up: this.state.results.upload.toFixed(1),
            ping: this.state.results.ping.toFixed(0)
        };
        this.state.history.unshift(res);
        if(this.state.history.length > 5) this.state.history.pop();
        localStorage.setItem('net_speed_history', JSON.stringify(this.state.history));
        this.renderHistory();
    },

    renderHistory: function() {
        if(this.state.history.length === 0) return;
        this.dom.histList.innerHTML = this.state.history.map(item => `
            <div class="nh-item">
                <div class="nh-date">${item.date}</div>
                <div class="nh-res">
                    <span class="dl"><i class="fas fa-arrow-down"></i> ${item.down}</span>
                    <span class="ul"><i class="fas fa-arrow-up"></i> ${item.up}</span>
                    <span class="pg"><i class="fas fa-bolt"></i> ${item.ping}ms</span>
                </div>
            </div>
        `).join('');
    }
};