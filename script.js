/**
 * SOC ANALYST & CYBERSECURITY PORTFOLIO - JAVASCRIPT
 * Features: Live UTC Clock, Real-time SIEM Alert Streamer,
 * Expandable Project "Zip" Accordion, Metric Counters, and Contact Clipboard.
 */

document.addEventListener('DOMContentLoaded', () => {
    initUtcClock();
    initMetricCounters();
    initSiemAlertStreamer();
    initProjectAccordion();
    initContactAndToast();
    initMobileMenu();
});

/* ===================================================================
   1. LIVE UTC CLOCK (Standard for 24/7 Global SOC Operations)
   =================================================================== */
function initUtcClock() {
    const clockEl = document.getElementById('utcClock');
    if (!clockEl) return;

    function update() {
        const now = new Date();
        const hours = String(now.getUTCHours()).padStart(2, '0');
        const minutes = String(now.getUTCMinutes()).padStart(2, '0');
        const seconds = String(now.getUTCSeconds()).padStart(2, '0');
        clockEl.textContent = `UTC ${hours}:${minutes}:${seconds}`;
    }

    update();
    setInterval(update, 1000);
}

/* ===================================================================
   2. METRIC COUNTER ANIMATIONS
   =================================================================== */
function initMetricCounters() {
    const counters = document.querySelectorAll('.metric-number');
    let hasAnimated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                counters.forEach(counter => {
                    const target = +counter.getAttribute('data-target');
                    const duration = 1200;
                    const stepTime = 20;
                    const steps = duration / stepTime;
                    const increment = target / steps;
                    let current = 0;

                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            counter.textContent = target + (target > 5 ? '+' : '');
                            clearInterval(timer);
                        } else {
                            counter.textContent = Math.floor(current);
                        }
                    }, stepTime);
                });
            }
        });
    }, { threshold: 0.3 });

    const metricsSection = document.querySelector('.metrics-section');
    if (metricsSection) observer.observe(metricsSection);
}

/* ===================================================================
   3. SIMULATED LIVE SIEM TELEMETRY STREAM
   =================================================================== */
function initSiemAlertStreamer() {
    const streamContainer = document.getElementById('siemAlertStream');
    const logCounter = document.getElementById('siemEventCount');
    if (!streamContainer) return;

    let baseLogCount = 1420;

    const alertPool = [
        {
            severity: 'critical',
            title: 'T1190 - In-Band SQL Injection Attempt Detected',
            src: '192.168.145.131 (KALI-DVWA)',
            event: 'Wazuh Rule 100300 (Level 10): Possible SQL Injection attempt',
            action: 'SIEM: Alert Triaged - URL Encoded Tautology 1\' OR \'1\'=\'1 Blocked'
        },
        {
            severity: 'critical',
            title: 'T1059.001 - Encoded PowerShell Execution',
            src: '10.0.10.45 (WS-FIN-02)',
            event: 'Sysmon Event ID 1: Process Creation',
            action: 'EDR: Isolated Endpoint & Killed PID 4820'
        },
        {
            severity: 'high',
            title: 'T1558.003 - Kerberoasting Ticket Request',
            src: '10.0.10.12 (WS-DEV-08)',
            event: 'Windows Event ID 4769: Ticket Options 0x40810000',
            action: 'SIEM: Alert Triaged - Service Account Disabled'
        },
        {
            severity: 'critical',
            title: 'T1003.001 - LSASS Memory Access Detected',
            src: '10.0.10.88 (WS-HR-04)',
            event: 'Sysmon Event ID 10: GrantedAccess 0x1010',
            action: 'EDR: Blocked Handle & Alert Escalated to Tier 2'
        },
        {
            severity: 'medium',
            title: 'T1071.001 - High-Frequency SSL C2 Beaconing',
            src: '10.0.20.15 -> 185.220.101.4:443',
            event: 'Zeek / Suricata IDS: Jitter < 2% across 45-min window',
            action: 'Firewall: External IP Blacklisted on Perimeter'
        },
        {
            severity: 'high',
            title: 'T1566.001 - Weaponized Attachment Quarantined',
            src: 'smtp-gw01 [inbound@external.com]',
            event: 'Proofpoint: Malicious Excel 4.0 Macro with AutoOpen',
            action: 'Sandbox: VirusTotal Score 61/74 - Domain Blocked'
        },
        {
            severity: 'low',
            title: 'T1110.001 - Password Spray Attempt Throttled',
            src: '45.154.255.82 -> ADFS Proxy',
            event: 'Azure AD / Entra ID: 15 accounts targeted',
            action: 'Conditional Access: Geo-blocking & MFA Prompt enforced'
        }
    ];

    // Seed initial 3 items
    for (let i = 0; i < 3; i++) {
        appendAlert(alertPool[i]);
    }

    let alertIndex = 3;

    // Periodic new alerts
    setInterval(() => {
        const alert = alertPool[alertIndex % alertPool.length];
        appendAlert(alert);
        alertIndex++;

        baseLogCount += Math.floor(Math.random() * 5) + 1;
        if (logCounter) {
            logCounter.textContent = `Logs Streamed: ${baseLogCount.toLocaleString()}`;
        }
    }, 4500);

    function appendAlert(alert) {
        const now = new Date();
        const timeStr = now.toISOString().substring(11, 19);

        const entry = document.createElement('div');
        entry.className = `siem-log-entry ${alert.severity}`;
        entry.innerHTML = `
            <div class="log-meta">
                <span class="log-severity ${alert.severity}">[${alert.severity.toUpperCase()}]</span>
                <span class="log-timestamp">${timeStr} UTC</span>
            </div>
            <div class="log-title">${alert.title}</div>
            <div class="log-details">
                <span>SRC: ${alert.src}</span>
                <span>EVENT: ${alert.event}</span>
                <span style="color: var(--accent-cyan);">ACTION: ${alert.action}</span>
            </div>
        `;

        streamContainer.prepend(entry);

        // Keep maximum 4 visible in the HUD box to prevent overflow
        if (streamContainer.children.length > 4) {
            streamContainer.removeChild(streamContainer.lastChild);
        }
    }
}

/* ===================================================================
   4. EXPANDABLE "ZIP" PROJECT ACCORDION
   =================================================================== */
function toggleProject(projectId) {
    const card = document.getElementById(projectId);
    if (!card) return;

    const isExpanded = card.classList.contains('expanded');
    const toggleBtnText = card.querySelector('.zip-btn-text');
    const folderIcon = card.querySelector('.zip-folder-icon');

    if (isExpanded) {
        // Collapsing → show Summary
        card.classList.remove('expanded');
        if (toggleBtnText) toggleBtnText.textContent = '📂 See Project';
        if (folderIcon) folderIcon.textContent = '📁';
    } else {
        // Expanding → show Full Project
        card.classList.add('expanded');
        if (toggleBtnText) toggleBtnText.textContent = '📁 Hide Project';
        if (folderIcon) folderIcon.textContent = '🗜️';
    }
}

function initProjectAccordion() {
    // Expose toggleProject globally for inline onclick
    window.toggleProject = toggleProject;

    const cards = document.querySelectorAll('.project-zip-card');
    cards.forEach(card => {
        const header = card.querySelector('.project-zip-header');
        if (header && !card.classList.contains('placeholder-slot')) {
            header.setAttribute('tabindex', '0');
            header.setAttribute('role', 'button');
            header.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleProject(card.id);
                }
            });
        }
    });
}

/* ===================================================================
   5. CONTACT & TOAST NOTIFICATION
   =================================================================== */
function initContactAndToast() {
    const copyBtn = document.getElementById('copyEmailBtn');
    const toast = document.getElementById('toast');
    const emailText = document.getElementById('emailText');

    if (!copyBtn || !toast || !emailText) return;

    copyBtn.addEventListener('click', () => {
        const textToCopy = emailText.textContent.trim();
        navigator.clipboard.writeText(textToCopy).then(() => {
            showToast('Email copied to clipboard!');
        }).catch(() => {
            showToast('Failed to copy email.');
        });
    });

    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

/* ===================================================================
   6. MOBILE NAVIGATION MENU
   =================================================================== */
function initMobileMenu() {
    const toggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    if (!toggle || !navLinks) return;

    toggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    document.querySelectorAll('.nav-item, .nav-btn').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
}
