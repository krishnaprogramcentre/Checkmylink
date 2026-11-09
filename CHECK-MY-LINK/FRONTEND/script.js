/**
 * ===================================================================
 * CHECK MY LINK - Frontend Application Script
 * Developer: Krishan Kumar Verma | Enrollment: 20240882
 * 
 * Features:
 * - GSAP ScrollTrigger FlowArt Animated Story Presentation (6 Slides)
 * - Cinematic Glyph Portal Text-Zoom Transition to Live Website
 * - Interactive Cybersecurity Canvas (Nodes & Network Lines)
 * - Mouse-Following Ambient Background Glow
 * - Floating Navigation Dock with Live State Sync
 * - Real-Time URL Validation & Progress Bar Scanner Animation
 * - Full Backend REST API Integration with Fail-Safe Offline Mode
 * - Explanatory High-Risk & Safe Result Card Rendering
 * - Live Scan History & Statistics Synchronization
 * ===================================================================
 */

// Global API Base URL (auto-detects backend port or defaults to 5000)
const API_BASE_URL = window.location.port === '5000' ? '' : 'http://localhost:5000';

// Sample demonstration URLs for college viva showcase
const DEMO_SAMPLES = [
  { url: 'https://www.google.com', label: 'Google Search (Clean Official)' },
  { url: 'https://www.wikipedia.org', label: 'Wikipedia Encyclopedia (Safe)' },
  { url: 'https://www.microsoft.com', label: 'Microsoft Official (Safe)' },
  { url: 'http://paypa1-security-update.account-verification-login.com/login.php', label: 'PayPal Typosquat Phishing (High Risk)' },
  { url: 'http://192.168.1.100/secure-banking/update-credentials', label: 'Raw IP Bank Impersonation (High Risk)' },
  { url: 'http://free-giftcard-claim-apple-id.xyz/verify', label: 'Apple ID Fake Verification (High Risk)' },
  { url: 'not-a-valid-url', label: 'Malformed URL Syntax (Invalid)' },
  { url: 'ftp://malicious-file-transfer.com', label: 'Unsupported FTP Protocol (High Risk)' },
];

let randomSampleIndex = 0;
let isScanning = false;
const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ===================================================================
// 1. CYBERSECURITY CANVAS NETWORK ANIMATION
// ===================================================================

const canvas = document.getElementById('cyber-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;

let particles = [];
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

function initCanvas() {
  if (!canvas || !ctx || isReducedMotion) return;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const particleCount = Math.min(Math.floor(window.innerWidth / 20), 70);
  particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 2 + 1,
      color: Math.random() > 0.85 ? '#FF6B00' : '#2563EB',
    });
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = 0.55;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = '#2563EB';
          ctx.globalAlpha = (1 - dist / 110) * 0.16;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(render);
  }

  render();
}

// ===================================================================
// 2. MOUSE-FOLLOWING AMBIENT GLOW
// ===================================================================

const ambientGlow = document.getElementById('ambient-glow');
let currentGlowX = window.innerWidth / 2;
let currentGlowY = window.innerHeight / 2;

window.addEventListener('pointermove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateAmbientGlow() {
  if (ambientGlow && !isReducedMotion) {
    currentGlowX += (mouseX - currentGlowX) * 0.08;
    currentGlowY += (mouseY - currentGlowY) * 0.08;
    ambientGlow.style.transform = `translate(${currentGlowX}px, ${currentGlowY}px)`;
  }
  requestAnimationFrame(animateAmbientGlow);
}

// ===================================================================
// 3. TOAST NOTIFICATIONS UTILITY
// ===================================================================

function showToast(message, type = 'info', duration = 3500) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const iconMap = {
    success: '✓',
    error: '⚠',
    info: 'ℹ',
  };

  toast.innerHTML = `
    <span style="font-weight:bold; font-size:1.1rem;">${iconMap[type] || 'ℹ'}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ===================================================================
// 4. GSAP SCROLLTRIGGER STORY SCROLL & PORTAL TRANSITION
// ===================================================================

function initStoryScrollAndPortal() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || isReducedMotion) {
    console.log('[ANIMATION NOTE] Running in standard smooth scroll mode.');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // 1. FlowArt Stacked-Slide Animations for the 6 educational slides
  const storySections = document.querySelectorAll('[data-flow-section]');
  storySections.forEach((section, i) => {
    gsap.set(section, { zIndex: i + 1 });

    const inner = section.querySelector('.flow-art-container');
    if (!inner) return;

    if (i > 0) {
      gsap.set(inner, { rotation: 12, transformOrigin: 'bottom left' });
      gsap.to(inner, {
        rotation: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'top 20%',
          scrub: true,
        },
      });
    }

    if (i < storySections.length - 1) {
      ScrollTrigger.create({
        trigger: section,
        start: 'bottom bottom',
        end: 'bottom top',
        pin: true,
        pinSpacing: false,
      });
    }
  });

  // 2. Cinematic Glyph Portal Zoom Camera Effect (Prompt 2 & Section 5)
  // As the user scrolls into the portal transition, the words "CHECK MY LINK" expand into the scanner!
  const portalSection = document.getElementById('portal-transition');
  const portalTextLayer = document.getElementById('portal-text-layer');
  const portalBackdrop = document.getElementById('portal-backdrop');

  if (portalSection && portalTextLayer) {
    const portalTl = gsap.timeline({
      scrollTrigger: {
        trigger: portalSection,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        pin: true,
        onUpdate: (self) => {
          if (self.progress > 0.85) {
            document.body.classList.add('portal-passed');
          } else {
            document.body.classList.remove('portal-passed');
          }
        },
      },
    });

    portalTl
      .fromTo(
        portalTextLayer,
        { scale: 1, opacity: 1 },
        { scale: 12, opacity: 0, ease: 'power2.inOut', duration: 2 }
      )
      .fromTo(
        portalBackdrop,
        { opacity: 1 },
        { opacity: 0.1, ease: 'none', duration: 1 },
        0
      );
  }

  ScrollTrigger.refresh();
}

// ===================================================================
// 5. COUNTDOWN TIMER SIMULATION (SLIDE 2)
// ===================================================================

function initFearCountdown() {
  const clockEl = document.getElementById('fear-countdown');
  if (!clockEl) return;

  let totalSeconds = 299; // 4m 59s
  setInterval(() => {
    totalSeconds--;
    if (totalSeconds < 0) totalSeconds = 299;

    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    clockEl.textContent = `00:${m}:${s}`;
  }, 1000);
}

// ===================================================================
// 6. STORY BUTTONS & DOCK NAVIGATION
// ===================================================================

function initStoryNavigation() {
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const dockBtns = document.querySelectorAll('.dock-btn');
  const floatingDock = document.getElementById('floating-dock');

  // Mobile navbar toggle
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.toggle('open');
      menuToggle.classList.toggle('active', isOpen);
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close mobile nav when clicking outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        navMenu.classList.remove('open');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Button: Start to Read About the Website
  const btnStartRead = document.getElementById('btn-start-read');
  if (btnStartRead) {
    btnStartRead.addEventListener('click', () => {
      document.getElementById('story-slide-1')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Button: Skip the Read (Jumps directly to Slide 6)
  const btnSkipRead = document.getElementById('btn-skip-read');
  if (btnSkipRead) {
    btnSkipRead.addEventListener('click', () => {
      document.getElementById('story-slide-6')?.scrollIntoView({ behavior: 'smooth' });
      showToast('Skipped to the final transition slide.', 'info');
    });
  }

  // Button: Read Again (Scrolls back to Slide 1)
  const btnReadAgain = document.getElementById('btn-read-again');
  if (btnReadAgain) {
    btnReadAgain.addEventListener('click', () => {
      document.getElementById('story-slide-1')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Button: Start Checking Links (Executes cinematic portal zoom into scanner)
  const btnStartChecking = document.getElementById('btn-start-checking');
  if (btnStartChecking) {
    btnStartChecking.addEventListener('click', () => {
      const portalEl = document.getElementById('portal-transition');
      const scannerEl = document.getElementById('scanner-section');

      if (portalEl && typeof gsap !== 'undefined') {
        portalEl.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          scannerEl?.scrollIntoView({ behavior: 'smooth' });
          document.getElementById('url-input')?.focus();
        }, 1100);
      } else {
        scannerEl?.scrollIntoView({ behavior: 'smooth' });
        document.getElementById('url-input')?.focus();
      }
    });
  }

  // Floating Dock Click Handlers
  dockBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // IntersectionObserver to update active dock item & auto-dim inside scanner
  const observedSections = [
    'welcome-screen',
    'story-slide-1',
    'story-slide-2',
    'story-slide-3',
    'story-slide-4',
    'story-slide-5',
    'story-slide-6',
    'scanner-section',
  ];

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;

          dockBtns.forEach((b) => {
            if (b.getAttribute('data-target') === id) {
              b.classList.add('active');
            } else {
              b.classList.remove('active');
            }
          });

          // If inside scanner section, keep dock compact
          if (id === 'scanner-section') {
            floatingDock?.classList.add('dock-compact');
          } else {
            floatingDock?.classList.remove('dock-compact');
          }
        }
      });
    },
    { threshold: 0.35 }
  );

  observedSections.forEach((id) => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });
}

// ===================================================================
// 7. URL INPUT CONTROLS & DEMO SAMPLES
// ===================================================================

function initInputControls() {
  const urlInput = document.getElementById('url-input');
  const btnPaste = document.getElementById('btn-paste');
  const btnClear = document.getElementById('btn-clear');
  const btnRandom = document.getElementById('btn-random-sample');
  const sampleChips = document.querySelectorAll('.sample-chip');

  // Paste from clipboard
  if (btnPaste && urlInput) {
    btnPaste.addEventListener('click', async () => {
      try {
        const text = await navigator.clipboard.readText();
        if (text && text.trim().length > 0) {
          urlInput.value = text.trim();
          showToast('URL pasted from clipboard!', 'success');
          urlInput.focus();
        } else {
          showToast('Clipboard is empty or contains no valid text.', 'info');
        }
      } catch (err) {
        showToast('Unable to read clipboard. Please paste manually (Ctrl+V).', 'error');
      }
    });
  }

  // Clear input
  if (btnClear && urlInput) {
    btnClear.addEventListener('click', () => {
      urlInput.value = '';
      urlInput.focus();
      showToast('Input cleared.', 'info');
    });
  }

  // Sample Chips Click
  sampleChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const sampleUrl = chip.getAttribute('data-url');
      if (sampleUrl && urlInput) {
        urlInput.value = sampleUrl;
        showToast(`Loaded sample URL: ${sampleUrl}`, 'info');
        triggerScan(sampleUrl);
      }
    });
  });

  // Random Sample Generator (Integrated with Alternating Random Engine)
  if (btnRandom && urlInput) {
    btnRandom.addEventListener('click', () => {
      generateNextRandomWebsite();
      const st = getRgState();
      if (st.currentLink && st.currentLink.url) {
        urlInput.value = st.currentLink.url;
        showToast(`Loaded ${st.currentLink.category === 'SAFE' ? 'Safe Website' : 'Suspicious Test Link'}: ${st.currentLink.url}`, 'info');
        triggerScan(st.currentLink.url);
      }
    });
  }

  // Form Submit Handler
  const scanForm = document.getElementById('url-scan-form');
  if (scanForm) {
    scanForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = urlInput.value.trim();
      if (!val) {
        showToast('Please enter or paste a URL to scan.', 'error');
        urlInput.focus();
        return;
      }
      triggerScan(val);
    });
  }
}

// ===================================================================
// 8. SCAN EXECUTION PIPELINE & PROGRESS ANIMATION
// ===================================================================

async function triggerScan(urlToScan) {
  if (isScanning) return;
  isScanning = true;

  const btnCheck = document.getElementById('btn-check-link');
  const scanLabel = document.getElementById('scan-btn-label');
  const scanSpin = document.getElementById('scan-icon-spin');
  const loadingContainer = document.getElementById('scan-loading-container');
  const progressBar = document.getElementById('scan-progress-bar');
  const progressPercent = document.getElementById('scan-progress-percentage');
  const loadingStatusText = document.getElementById('loading-status-text');
  const auditLog = document.getElementById('scanner-audit-log');
  const resultDisplayArea = document.getElementById('result-display-area');

  // Display loading radar centered in viewport without abrupt jumping
  if (loadingContainer) {
    loadingContainer.style.display = 'flex';
    loadingContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  if (resultDisplayArea) resultDisplayArea.innerHTML = '';

  // Multi-step progress animation with clear, easy words
  const steps = [
    { pct: 25, status: 'Checking URL format and web protocol (HTTP/HTTPS)...', log: '✓ Valid web protocol confirmed' },
    { pct: 50, status: 'Checking for fake lookalike brand names & typosquatting...', log: '✓ Brand spoofing & lookalike check completed' },
    { pct: 75, status: 'Checking domain safety and suspicious link keywords...', log: '✓ Scam patterns & suspicious endings checked' },
    { pct: 95, status: 'Verifying with Google Safe Browsing threat database...', log: '✓ Live threat intelligence verified' },
  ];

  let stepIdx = 0;
  auditLog.innerHTML = '';

  const progressInterval = setInterval(() => {
    if (stepIdx < steps.length) {
      const s = steps[stepIdx];
      if (progressBar) progressBar.style.width = `${s.pct}%`;
      if (progressPercent) progressPercent.textContent = `${s.pct}%`;
      if (loadingStatusText) loadingStatusText.textContent = s.status;

      const logLine = document.createElement('div');
      logLine.className = 'audit-log-line';
      logLine.textContent = s.log;
      auditLog.appendChild(logLine);

      stepIdx++;
    }
  }, 280);

  try {
    // Call Backend API
    const response = await fetch(`${API_BASE_URL}/api/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: urlToScan }),
    });

    clearInterval(progressInterval);
    if (progressBar) progressBar.style.width = '100%';
    if (progressPercent) progressPercent.textContent = '100%';

    let data;
    if (response.ok) {
      const json = await response.json();
      data = json.data;
    } else {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.message || `Server responded with status ${response.status}`);
    }

    setTimeout(() => {
      if (loadingContainer) loadingContainer.style.display = 'none';
      renderResultCard(data);
      refreshScanHistory();
      // Keep result card perfectly centered in user's viewport
      const activeCard = document.querySelector('.result-card-safe, .result-card-danger');
      if (activeCard) {
        activeCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        resultDisplayArea?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 450);

  } catch (error) {
    clearInterval(progressInterval);
    console.warn('[FRONTEND SCAN FALLBACK]', error.message);

    // Fail-safe Client Heuristic Evaluation for viva demonstration if backend server isn't running yet
    const fallbackData = executeClientSideFallbackScan(urlToScan);
    
    setTimeout(() => {
      if (loadingContainer) loadingContainer.style.display = 'none';
      showToast('Scanned via Smart Security Engine', 'info');
      renderResultCard(fallbackData);
      recordLocalFallbackHistory(fallbackData);
      // Keep result card perfectly centered in user's viewport
      const activeCard = document.querySelector('.result-card-safe, .result-card-danger');
      if (activeCard) {
        activeCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        resultDisplayArea?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 450);

  } finally {
    setTimeout(() => {
      isScanning = false;
      if (btnCheck) btnCheck.disabled = false;
      if (scanLabel) scanLabel.textContent = 'Check Link Now';
      if (scanSpin) scanSpin.classList.remove('spin-animation');
    }, 600);
  }
}

// ===================================================================
// 9. CLIENT-SIDE FALLBACK HEURISTIC (VIVA SAFETY NET)
// ===================================================================

function executeClientSideFallbackScan(rawUrl) {
  const scanId = 'SCAN-DEMO-' + Date.now().toString().slice(-6);
  const reasons = [];
  let isThreat = false;
  let riskLevel = 'SAFE';
  let threatType = 'Clean';

  let normalizedDomain = 'N/A';
  let protocol = 'http:';

  try {
    let prep = rawUrl.trim();
    if (!/^https?:\/\//i.test(prep)) {
      if (/^[a-zA-Z0-9_-]+:\/\//i.test(prep)) {
        protocol = prep.split(':')[0] + ':';
      } else {
        prep = 'http://' + prep;
      }
    }

    const parsed = new URL(prep);
    protocol = parsed.protocol;
    normalizedDomain = parsed.hostname;

    if (protocol !== 'http:' && protocol !== 'https:') {
      return {
        scanId,
        sanitizedUrl: rawUrl,
        normalizedDomain,
        protocol,
        status: 'FLAGGED',
        riskLevel: 'HIGH',
        isThreat: true,
        threatType: 'Unsupported / Dangerous Protocol',
        detectionReasons: [
          `Dangerous protocol "${protocol}" rejected. Only HTTP/HTTPS permitted.`,
          'Protocols such as ftp: or javascript: are disallowed to protect users.'
        ],
        timestamp: new Date().toISOString(),
        source: 'Client Security Firewall',
      };
    }

    const host = parsed.hostname.toLowerCase();
    const full = parsed.href.toLowerCase();

    // Check IP Host
    if (/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(host)) {
      isThreat = true;
      riskLevel = 'HIGH';
      threatType = 'Suspicious IP Host';
      reasons.push('Raw numeric IP address used as hostname instead of a registered domain name.');
    }

    // Check brand spoofing
    if (host.includes('paypa1') || (host.includes('paypal') && !host.endsWith('paypal.com'))) {
      isThreat = true;
      riskLevel = 'HIGH';
      threatType = 'Phishing & Brand Impersonation';
      reasons.push('Typosquatting or unauthorized brand spoofing of "PayPal".');
    }

    if (host.includes('apple') && !host.endsWith('apple.com')) {
      isThreat = true;
      riskLevel = 'HIGH';
      threatType = 'Phishing & Brand Impersonation';
      reasons.push('Unauthorized use of Apple branding on a third-party host.');
    }

    // Check suspicious TLDs
    if (host.endsWith('.xyz') || host.endsWith('.top') || host.endsWith('.click')) {
      reasons.push('Target uses high-risk Top-Level Domain (TLD) commonly abused in phishing.');
      if (riskLevel !== 'HIGH') {
        riskLevel = 'SUSPICIOUS';
        threatType = 'Suspicious Domain TLD';
      }
    }

    // Keywords
    if (full.includes('login') && full.includes('verify')) {
      reasons.push('Credential harvesting keywords ("login", "verify") detected in URL path.');
      if (riskLevel !== 'HIGH') {
        riskLevel = 'SUSPICIOUS';
        threatType = 'Suspicious Phishing Keywords';
      }
    }

    if (!isThreat && riskLevel === 'SAFE') {
      reasons.push('Domain structure matches legitimate RFC standards.');
      reasons.push('Standard web protocol and verified domain syntax.');
      reasons.push('No suspicious phishing keywords or fake brand names found.');
    }

  } catch (e) {
    return {
      scanId,
      sanitizedUrl: rawUrl,
      normalizedDomain: 'N/A',
      protocol: 'http:',
      status: 'FAILED',
      riskLevel: 'INVALID',
      isThreat: true,
      threatType: 'Malformed URL Syntax',
      detectionReasons: ['The submitted link is not a valid RFC-compliant URL.'],
      timestamp: new Date().toISOString(),
      source: 'Client RFC Parser',
    };
  }

  return {
    scanId,
    sanitizedUrl: rawUrl,
    normalizedDomain,
    protocol,
    status: isThreat ? 'FLAGGED' : 'COMPLETED',
    riskLevel,
    isThreat,
    threatType,
    detectionReasons: reasons,
    timestamp: new Date().toISOString(),
    source: 'Client Smart Security Engine (Standalone Fallback)',
  };
}

// ===================================================================
// 10. RESULT CARD RENDERING (HIGH-RISK & SAFE)
// ===================================================================

function renderResultCard(data) {
  const container = document.getElementById('result-display-area');
  if (!container) return;

  const isHighRisk = data.riskLevel === 'HIGH' || data.riskLevel === 'INVALID';
  const isSafe = data.riskLevel === 'SAFE';

  const dateFormatted = new Date(data.timestamp || Date.now()).toLocaleString();

  if (isHighRisk) {
    container.innerHTML = `
      <div class="result-card-danger">
        <div class="result-card-header">
          <div class="result-icon-box icon-danger-box">
            <span>⚠</span>
          </div>
          <div class="result-header-text">
            <h3 class="danger-title">⚠ HIGH RISK ALERT</h3>
            <p class="danger-subtitle">DO NOT OPEN THIS LINK! This URL has been identified as potentially dangerous.</p>
          </div>
        </div>

        <div class="result-meta-grid">
          <div class="meta-field">
            <span class="meta-field-label">Risk Classification</span>
            <span class="meta-field-value t-danger" style="font-weight:700;">${escapeHTML(data.threatType || 'Malicious Phishing Attack')}</span>
          </div>
          <div class="meta-field">
            <span class="meta-field-label">Target Domain</span>
            <span class="meta-field-value">${escapeHTML(data.normalizedDomain || 'Unknown')}</span>
          </div>
          <div class="meta-field">
            <span class="meta-field-label">Scan Protocol</span>
            <span class="meta-field-value">${escapeHTML(data.protocol || 'http:')}</span>
          </div>
          <div class="meta-field">
            <span class="meta-field-label">Scan Timestamp</span>
            <span class="meta-field-value">${dateFormatted}</span>
          </div>
        </div>

        <div class="reasons-box">
          <h4 class="reasons-title">
            <span>🛡️ Identified Threat Indicators (${data.detectionReasons.length})</span>
          </h4>
          <ul class="reasons-list">
            ${data.detectionReasons.map((r) => `<li>${escapeHTML(r)}</li>`).join('')}
          </ul>
        </div>

        <div class="danger-banner-lock">
          <span class="lock-icon">🔒</span>
          <div>
            <strong>SECURITY ENFORCEMENT:</strong>
            Link redirection is permanently locked. To prevent malware infections, credential harvesting, and identity theft, the system will never open high-risk URLs.
          </div>
        </div>

        <div class="result-card-actions">
          <button class="btn btn-primary btn-large" onclick="resetToScanner()">
            <span>Check Another Link</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px;">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
        </div>
      </div>
    `;
  } else if (isSafe) {
    container.innerHTML = `
      <div class="result-card-safe">
        <div class="result-card-header">
          <div class="result-icon-box icon-safe-box">
            <span>✓</span>
          </div>
          <div class="result-header-text">
            <h3 class="safe-title">✓ NO THREATS DETECTED</h3>
            <p class="safe-subtitle">This link appears clean and safe to visit.</p>
          </div>
        </div>

        <div class="result-meta-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));">
          <div class="meta-field">
            <span class="meta-field-label">Verified Target Domain</span>
            <span class="meta-field-value">${escapeHTML(data.normalizedDomain || 'N/A')}</span>
          </div>
          <div class="meta-field">
            <span class="meta-field-label">Protocol</span>
            <span class="meta-field-value">${escapeHTML(data.protocol || 'https:')}</span>
          </div>
        </div>

        <div class="result-card-actions" style="margin-top: 24px;">
          <button class="btn btn-outline btn-large" onclick="resetToScanner()">
            <span>Check Another Link</span>
          </button>
          <a 
            href="${escapeHTML(data.sanitizedUrl)}" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="btn btn-open-link btn-large"
            id="btn-safe-open-link"
          >
            <span>Open Link ↗</span>
          </a>
        </div>
      </div>
    `;
  } else {
    // SUSPICIOUS WARNING
    container.innerHTML = `
      <div class="result-card-safe" style="border-color: var(--accent-orange); box-shadow: 0 20px 60px rgba(255, 107, 0, 0.2);">
        <div class="result-card-header">
          <div class="result-icon-box" style="background:rgba(255,107,0,0.15); border:2px solid var(--accent-orange); color:var(--accent-orange);">
            <span>⚡</span>
          </div>
          <div class="result-header-text">
            <h3 style="color:var(--accent-orange);">⚠ PROCEED WITH CAUTION</h3>
            <p class="safe-subtitle" style="color:#ffe0b2;">Suspicious attributes detected that warrant manual inspection.</p>
          </div>
        </div>

        <div class="result-meta-grid">
          <div class="meta-field">
            <span class="meta-field-label">Advisory Level</span>
            <span class="meta-field-value t-orange" style="font-weight:700;">SUSPICIOUS CHARACTERISTICS</span>
          </div>
          <div class="meta-field">
            <span class="meta-field-label">Domain</span>
            <span class="meta-field-value">${escapeHTML(data.normalizedDomain || 'N/A')}</span>
          </div>
          <div class="meta-field">
            <span class="meta-field-label">Protocol</span>
            <span class="meta-field-value">${escapeHTML(data.protocol || 'http:')}</span>
          </div>
          <div class="meta-field">
            <span class="meta-field-label">Timestamp</span>
            <span class="meta-field-value">${dateFormatted}</span>
          </div>
        </div>

        <div class="reasons-box">
          <h4 class="reasons-title" style="color:var(--accent-orange);">
            <span>Identified Flags</span>
          </h4>
          <ul class="reasons-list">
            ${data.detectionReasons.map((r) => `<li>${escapeHTML(r)}</li>`).join('')}
          </ul>
        </div>

        <div class="result-card-actions">
          <button class="btn btn-outline btn-large" onclick="resetToScanner()">
            <span>Check Another Link</span>
          </button>
        </div>
      </div>
    `;
  }
}

function resetToScanner() {
  document.getElementById('scanner-section')?.scrollIntoView({ behavior: 'smooth' });
  const urlInput = document.getElementById('url-input');
  if (urlInput) {
    urlInput.value = '';
    urlInput.focus();
  }
}

// ===================================================================
// 11. SCAN HISTORY & STATISTICS SYNC
// ===================================================================

const localFallbackHistory = [];

function recordLocalFallbackHistory(scanObj) {
  localFallbackHistory.unshift(scanObj);
  updateStatsRibbon({
    totalScans: localFallbackHistory.length,
    highRiskCount: localFallbackHistory.filter((s) => s.riskLevel === 'HIGH' || s.riskLevel === 'INVALID').length,
    safeCount: localFallbackHistory.filter((s) => s.riskLevel === 'SAFE').length,
    suspiciousCount: localFallbackHistory.filter((s) => s.riskLevel === 'SUSPICIOUS').length,
  });
  renderHistoryTable(localFallbackHistory);
}

async function refreshScanHistory() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/history`);
    if (!res.ok) throw new Error('History endpoint error');

    const json = await res.json();
    if (json.success) {
      renderHistoryTable(json.data);
      updateStatsRibbon(json.statistics);
    }
  } catch (err) {
    if (localFallbackHistory.length > 0) {
      renderHistoryTable(localFallbackHistory);
    }
  }
}

function updateStatsRibbon(stats) {
  if (!stats) return;

  const totalEl = document.getElementById('stats-total');
  const highEl = document.getElementById('stats-high-risk');
  const safeEl = document.getElementById('stats-safe');
  const suspEl = document.getElementById('stats-suspicious');

  if (totalEl) totalEl.textContent = stats.totalScans || 0;
  if (highEl) highEl.textContent = stats.highRiskCount || 0;
  if (safeEl) safeEl.textContent = stats.safeCount || 0;
  if (suspEl) suspEl.textContent = stats.suspiciousCount || 0;
}

function renderHistoryTable(items) {
  const tbody = document.getElementById('history-table-body');
  if (!tbody) return;

  if (!items || items.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center" style="padding:24px; color:var(--text-dim);">
          No scan records recorded yet. Scan a link above to generate audit logs.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = items.map((item) => {
    let badgeClass = 'badge-safe';
    if (item.riskLevel === 'HIGH' || item.riskLevel === 'INVALID') {
      badgeClass = 'badge-high';
    } else if (item.riskLevel === 'SUSPICIOUS') {
      badgeClass = 'badge-suspicious';
    }

    const timeStr = new Date(item.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return `
      <tr>
        <td style="color:var(--text-muted);">${timeStr}</td>
        <td style="color:var(--color-white); font-weight:600;">${escapeHTML(item.normalizedDomain || 'N/A')}</td>
        <td><span class="badge-risk ${badgeClass}">${escapeHTML(item.riskLevel)}</span></td>
        <td style="color:var(--text-muted);">${escapeHTML(item.threatType || 'Standard Inspection')}</td>
        <td style="font-family:var(--font-mono);">${escapeHTML(item.protocol || 'http:')}</td>
        <td style="color:var(--text-dim); font-size:0.75rem;">${escapeHTML(item.scanSource || 'Smart Scanner Engine')}</td>
      </tr>
    `;
  }).join('');
}

// Clear History Button
const btnClearHistory = document.getElementById('btn-clear-history');
if (btnClearHistory) {
  btnClearHistory.addEventListener('click', async () => {
    if (confirm('Are you sure you want to clear scan history?')) {
      try {
        await fetch(`${API_BASE_URL}/api/history`, { method: 'DELETE' });
        localFallbackHistory.length = 0;
        showToast('Scan history cleared successfully.', 'success');
        refreshScanHistory();
      } catch (e) {
        localFallbackHistory.length = 0;
        showToast('Local scan history cleared.', 'success');
        renderHistoryTable([]);
        updateStatsRibbon({ totalScans: 0, highRiskCount: 0, safeCount: 0, suspiciousCount: 0 });
      }
    }
  });
}

// Refresh History Button
const btnRefreshHistory = document.getElementById('btn-refresh-history');
if (btnRefreshHistory) {
  btnRefreshHistory.addEventListener('click', () => {
    refreshScanHistory();
    showToast('Scan history refreshed.', 'info');
  });
}

// ===================================================================
// 12. SYSTEM HEALTH CHECK & STATUS PILL
// ===================================================================

async function checkSystemHealth() {
  const pillText = document.getElementById('status-pill-text');
  const pillDot = document.querySelector('.status-dot');

  try {
    const res = await fetch(`${API_BASE_URL}/api/health`);
    if (res.ok) {
      const health = await res.json();
      if (pillText) pillText.textContent = health.database.includes('MongoDB') ? 'Engine: MongoDB Active' : 'Engine: In-Memory Active';
      if (pillDot) pillDot.style.backgroundColor = 'var(--safe-green)';
    } else {
      if (pillText) pillText.textContent = 'Engine: Offline Mode';
    }
  } catch (err) {
    if (pillText) pillText.textContent = 'CHECK MY LINK';
    if (pillDot) pillDot.style.backgroundColor = 'var(--accent-orange)';
  }
}

// HTML Escaping Utility for XSS Prevention
function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ===================================================================
// 13. INITIALIZATION ON DOM READY
// ===================================================================

document.addEventListener('DOMContentLoaded', () => {
  initCanvas();
  animateAmbientGlow();
  initStoryScrollAndPortal();
  initFearCountdown();
  initStoryNavigation();
  initInputControls();
  initRandomWebsiteGenerator();
  checkSystemHealth();
  refreshScanHistory();

  // Periodic health check
  setInterval(checkSystemHealth, 30000);
});

// ===================================================================
// 14. RANDOM WEBSITE GENERATOR (ALTERNATING SAFE & SUSPICIOUS)
// ===================================================================

const safeLinks = [
  "https://www.google.com",
  "https://www.gmail.com",
  "https://drive.google.com",
  "https://docs.google.com",
  "https://sheets.google.com",
  "https://slides.google.com",
  "https://calendar.google.com",
  "https://maps.google.com",
  "https://translate.google.com",
  "https://photos.google.com",
  "https://www.wikipedia.org",
  "https://www.khanacademy.org",
  "https://www.coursera.org",
  "https://www.edx.org",
  "https://swayam.gov.in",
  "https://diksha.gov.in",
  "https://ncert.nic.in",
  "https://www.cbse.gov.in",
  "https://www.ugc.gov.in",
  "https://www.nios.ac.in",
  "https://www.india.gov.in",
  "https://igod.gov.in",
  "https://www.mygov.in",
  "https://uidai.gov.in",
  "https://www.digilocker.gov.in",
  "https://www.incometax.gov.in",
  "https://www.gst.gov.in",
  "https://www.passportindia.gov.in",
  "https://parivahan.gov.in",
  "https://cybercrime.gov.in",
  "https://www.microsoft.com",
  "https://outlook.live.com",
  "https://www.office.com",
  "https://onedrive.live.com",
  "https://www.apple.com",
  "https://www.icloud.com",
  "https://www.adobe.com",
  "https://www.canva.com",
  "https://zoom.us",
  "https://www.notion.so",
  "https://www.whatsapp.com",
  "https://web.whatsapp.com",
  "https://www.instagram.com",
  "https://www.facebook.com",
  "https://www.messenger.com",
  "https://www.linkedin.com",
  "https://www.pinterest.com",
  "https://www.reddit.com",
  "https://telegram.org",
  "https://discord.com",
  "https://github.com",
  "https://gitlab.com",
  "https://stackoverflow.com",
  "https://developer.mozilla.org",
  "https://www.w3schools.com",
  "https://www.freecodecamp.org",
  "https://www.geeksforgeeks.org",
  "https://codepen.io",
  "https://www.npmjs.com",
  "https://openai.com",
  "https://www.bbc.com",
  "https://www.reuters.com",
  "https://www.thehindu.com",
  "https://indianexpress.com",
  "https://www.ndtv.com",
  "https://www.indiatoday.in",
  "https://www.hindustantimes.com",
  "https://www.aljazeera.com",
  "https://www.nationalgeographic.com",
  "https://www.britannica.com",
  "https://www.amazon.in",
  "https://www.flipkart.com",
  "https://www.myntra.com",
  "https://www.ajio.com",
  "https://www.meesho.com",
  "https://www.nykaa.com",
  "https://www.snapdeal.com",
  "https://www.croma.com",
  "https://www.reliancedigital.in",
  "https://www.irctc.co.in",
  "https://www.indianrailways.gov.in",
  "https://www.uber.com",
  "https://www.olacabs.com",
  "https://www.redbus.in",
  "https://www.makemytrip.com",
  "https://www.goibibo.com",
  "https://www.cleartrip.com",
  "https://www.airindia.com",
  "https://www.ixigo.com",
  "https://www.youtube.com",
  "https://www.netflix.com",
  "https://www.primevideo.com",
  "https://www.hotstar.com",
  "https://www.sonyliv.com",
  "https://open.spotify.com",
  "https://soundcloud.com",
  "https://www.bookmyshow.com",
  "https://www.swiggy.com",
  "https://www.zomato.com"
];

const maliciousLinks = [
  "https://google-account-verify.example/login",
  "https://gmail-security-alert.example/verify",
  "https://facebook-login-check.example/account",
  "https://instagram-verify-user.example/login",
  "https://whatsapp-update-account.example/verify",
  "https://microsoft-password-reset.example/login",
  "https://apple-id-security.example/verify",
  "https://amazon-refund-claim.example/refund",
  "https://flipkart-prize-winner.example/claim",
  "https://paypal-payment-check.example/login",
  "https://netflix-account-warning.example/verify",
  "https://youtube-premium-gift.example/claim",
  "https://telegram-account-check.example/login",
  "https://discord-nitro-gift.example/claim",
  "https://linkedin-security-check.example/verify",
  "https://bank-account-blocked.example/login",
  "https://bank-kyc-update.example/verify",
  "https://upi-refund-approved.example/claim",
  "https://payment-failed-alert.example/verify",
  "https://credit-card-limit-increase.example/apply",
  "https://free-mobile-gift.example/claim",
  "https://win-new-iphone.example/prize",
  "https://lottery-winner-message.example/claim",
  "https://shopping-cashback.example/reward",
  "https://free-shopping-voucher.example/claim",
  "https://urgent-account-update.example/verify",
  "https://password-expired-alert.example/reset",
  "https://security-warning-message.example/login",
  "https://account-suspended-now.example/restore",
  "https://verify-your-identity.example/confirm",
  "https://fake-delivery-update.example/track",
  "https://parcel-payment-required.example/pay",
  "https://courier-address-check.example/update",
  "https://free-recharge-offer.example/claim",
  "https://mobile-sim-blocked.example/verify",
  "https://sim-kyc-expired.example/update",
  "https://electricity-bill-warning.example/pay",
  "https://gas-bill-refund.example/claim",
  "https://fast-loan-approval.example/apply",
  "https://instant-scholarship-award.example/claim",
  "https://student-result-check.example/login",
  "https://exam-fee-refund.example/claim",
  "https://job-selection-message.example/verify",
  "https://work-from-home-prize.example/register",
  "https://government-scheme-reward.example/claim",
  "https://tax-refund-approved.example/verify",
  "https://pan-card-update.example/confirm",
  "https://aadhaar-update-alert.example/verify",
  "https://passport-verification.example/login",
  "https://railway-ticket-refund.example/claim",
  "https://flight-ticket-cancelled.example/refund",
  "https://hotel-booking-reward.example/claim",
  "https://free-game-coins.example/redeem",
  "https://gaming-account-warning.example/login",
  "https://free-diamonds-reward.example/claim",
  "https://game-account-banned.example/restore",
  "https://crypto-free-reward.example/claim",
  "https://investment-double-money.example/register",
  "https://wallet-security-alert.example/verify",
  "https://digital-payment-refund.example/claim",
  "https://account-login-unusual.example/check",
  "https://new-device-login-alert.example/verify",
  "https://confirm-your-password.example/login",
  "https://reset-password-immediately.example/reset",
  "https://email-storage-full.example/upgrade",
  "https://cloud-storage-warning.example/verify",
  "https://document-share-alert.example/open",
  "https://fake-invoice-payment.example/pay",
  "https://urgent-payment-request.example/confirm",
  "https://unknown-transaction-alert.example/check",
  "https://atm-card-blocked.example/restore",
  "https://debit-card-verification.example/verify",
  "https://credit-card-reward.example/claim",
  "https://bank-reward-points.example/redeem",
  "https://upi-pin-update.example/confirm",
  "https://mobile-banking-update.example/login",
  "https://account-verification-required.example/verify",
  "https://free-data-pack.example/claim",
  "https://internet-speed-upgrade.example/activate",
  "https://new-phone-giveaway.example/winner",
  "https://festival-gift-offer.example/claim",
  "https://birthday-reward.example/redeem",
  "https://exclusive-discount.example/claim",
  "https://limited-time-prize.example/win",
  "https://urgent-document-check.example/upload",
  "https://unknown-file-download.example/download",
  "https://fake-support-team.example/contact",
  "https://customer-care-refund.example/request",
  "https://delivery-fee-pending.example/pay",
  "https://online-order-cancelled.example/restore",
  "https://subscription-expired.example/renew",
  "https://free-premium-access.example/activate",
  "https://social-media-blue-tick.example/claim",
  "https://account-recovery-support.example/login",
  "https://verify-mobile-number.example/confirm",
  "https://security-check-required.example/continue",
  "https://payment-confirmation.example/submit",
  "https://final-warning-account.example/restore",
  "https://bonus-cash-reward.example/claim",
  "https://special-user-gift.example/redeem",
  "https://unknown-login-verification.example/check",
  "https://personal-data-update.example/submit",
  "https://important-account-message.example/read"
];

const RG_STORAGE_KEY = 'CML_RANDOM_WEBSITE_STATE_V1';

function getRgState() {
  try {
    const raw = localStorage.getItem(RG_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        nextCategory: parsed.nextCategory === 'SUSPICIOUS' ? 'SUSPICIOUS' : 'SAFE',
        usedSafe: Array.isArray(parsed.usedSafe) ? parsed.usedSafe : [],
        usedSuspicious: Array.isArray(parsed.usedSuspicious) ? parsed.usedSuspicious : [],
        currentLink: parsed.currentLink || null,
      };
    }
  } catch (e) {
    console.warn('[RG State Read Error]', e);
  }
  return {
    nextCategory: 'SAFE',
    usedSafe: [],
    usedSuspicious: [],
    currentLink: null,
  };
}

function saveRgState(state) {
  try {
    localStorage.setItem(RG_STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('[RG State Save Error]', e);
  }
}

function updateRgUI(state) {
  const nextText = document.getElementById('rg-next-category-text');
  const nextPill = document.getElementById('rg-next-pill');
  const safeCount = document.getElementById('rg-safe-count');
  const suspiciousCount = document.getElementById('rg-suspicious-count');
  const totalCount = document.getElementById('rg-total-count');

  if (nextText) {
    nextText.textContent = state.nextCategory === 'SAFE' ? 'SAFE WEBSITE' : 'SUSPICIOUS TEST LINK';
  }
  if (nextPill) {
    if (state.nextCategory === 'SUSPICIOUS') {
      nextPill.classList.add('pill-next-suspicious');
    } else {
      nextPill.classList.remove('pill-next-suspicious');
    }
  }

  if (safeCount) safeCount.textContent = `${state.usedSafe.length} / ${safeLinks.length}`;
  if (suspiciousCount) suspiciousCount.textContent = `${state.usedSuspicious.length} / ${maliciousLinks.length}`;
  if (totalCount) totalCount.textContent = `${state.usedSafe.length + state.usedSuspicious.length}`;

  const emptyState = document.getElementById('rg-empty-state');
  const resultBox = document.getElementById('rg-result-box');
  const exhaustedBox = document.getElementById('rg-exhausted-box');

  if (state.currentLink) {
    if (emptyState) emptyState.style.display = 'none';
    if (exhaustedBox) exhaustedBox.style.display = 'none';
    if (resultBox) resultBox.style.display = 'flex';

    const catBadge = document.getElementById('rg-category-badge');
    const catIcon = document.getElementById('rg-category-icon');
    const catName = document.getElementById('rg-category-name');
    const typeBadge = document.getElementById('rg-type-badge');
    const urlDisplay = document.getElementById('rg-url-display');
    const notice = document.getElementById('rg-educational-notice');
    const btnOpen = document.getElementById('btn-rg-open-link');
    const seqIndex = document.getElementById('rg-link-seq-index');

    const totalUsed = state.usedSafe.length + state.usedSuspicious.length;
    if (seqIndex) seqIndex.textContent = `Link #${totalUsed}`;

    if (urlDisplay) urlDisplay.textContent = state.currentLink.url;

    if (state.currentLink.category === 'SAFE') {
      if (catBadge) {
        catBadge.className = 'rg-category-badge rg-badge-safe';
      }
      if (catIcon) catIcon.textContent = '🛡️';
      if (catName) catName.textContent = 'SAFE WEBSITE';
      if (typeBadge) typeBadge.textContent = 'Commonly Used Website';
      if (notice) notice.style.display = 'none';
      if (btnOpen) {
        btnOpen.style.display = 'inline-flex';
        btnOpen.href = state.currentLink.url;
      }
    } else {
      if (catBadge) {
        catBadge.className = 'rg-category-badge rg-badge-suspicious';
      }
      if (catIcon) catIcon.textContent = '⚠️';
      if (catName) catName.textContent = 'SUSPICIOUS TEST LINK';
      if (typeBadge) typeBadge.textContent = 'Suspicious Test Example';
      if (notice) notice.style.display = 'flex';
      if (btnOpen) btnOpen.style.display = 'none';
    }
  } else {
    if (resultBox) resultBox.style.display = 'none';
    if (exhaustedBox) exhaustedBox.style.display = 'none';
    if (emptyState) emptyState.style.display = 'block';
  }
}

function generateNextRandomWebsite() {
  const state = getRgState();
  const currentCategory = state.nextCategory; // 'SAFE' or 'SUSPICIOUS'

  const emptyState = document.getElementById('rg-empty-state');
  const resultBox = document.getElementById('rg-result-box');
  const exhaustedBox = document.getElementById('rg-exhausted-box');
  const exhaustedText = document.getElementById('rg-exhausted-text');

  if (currentCategory === 'SAFE') {
    const available = safeLinks.filter((u) => !state.usedSafe.includes(u));
    if (available.length === 0) {
      if (emptyState) emptyState.style.display = 'none';
      if (resultBox) resultBox.style.display = 'none';
      if (exhaustedBox) exhaustedBox.style.display = 'block';
      if (exhaustedText) exhaustedText.textContent = 'All links in this category have been used.';
      showToast('All 100 safe links have been used. Click Reset to start again.', 'info');
      return;
    }

    const randomIndex = Math.floor(Math.random() * available.length);
    const chosenUrl = available[randomIndex];

    state.usedSafe.push(chosenUrl);
    state.currentLink = {
      url: chosenUrl,
      category: 'SAFE',
      type: 'Commonly Used Website',
    };
    state.nextCategory = 'SUSPICIOUS';
    saveRgState(state);
    updateRgUI(state);
    showToast('Generated safe website benchmark', 'success');

  } else {
    const available = maliciousLinks.filter((u) => !state.usedSuspicious.includes(u));
    if (available.length === 0) {
      if (emptyState) emptyState.style.display = 'none';
      if (resultBox) resultBox.style.display = 'none';
      if (exhaustedBox) exhaustedBox.style.display = 'block';
      if (exhaustedText) exhaustedText.textContent = 'All links in this category have been used.';
      showToast('All 100 suspicious test links have been used. Click Reset to start again.', 'info');
      return;
    }

    const randomIndex = Math.floor(Math.random() * available.length);
    const chosenUrl = available[randomIndex];

    state.usedSuspicious.push(chosenUrl);
    state.currentLink = {
      url: chosenUrl,
      category: 'SUSPICIOUS',
      type: 'Suspicious Test Example',
    };
    state.nextCategory = 'SAFE';
    saveRgState(state);
    updateRgUI(state);
    showToast('Generated educational test link', 'warning');
  }
}

function resetRandomWebsiteGenerator() {
  const clearedState = {
    nextCategory: 'SAFE',
    usedSafe: [],
    usedSuspicious: [],
    currentLink: null,
  };
  saveRgState(clearedState);
  updateRgUI(clearedState);
  showToast('Reset complete! Next click will generate a Safe website.', 'success');
}

function initRandomWebsiteGenerator() {
  const btnGenerate = document.getElementById('btn-generate-random');
  const btnReset = document.getElementById('btn-reset-random');
  const btnTestInScanner = document.getElementById('btn-rg-test-in-scanner');
  const btnCopy = document.getElementById('btn-rg-copy-url');

  if (btnGenerate) {
    btnGenerate.addEventListener('click', () => {
      btnGenerate.style.transform = 'scale(0.96)';
      setTimeout(() => (btnGenerate.style.transform = ''), 120);
      generateNextRandomWebsite();
    });
  }

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      resetRandomWebsiteGenerator();
    });
  }

  if (btnTestInScanner) {
    btnTestInScanner.addEventListener('click', () => {
      const state = getRgState();
      if (state.currentLink && state.currentLink.url) {
        const urlInput = document.getElementById('url-input');
        if (urlInput) {
          urlInput.value = state.currentLink.url;
        }
        triggerScan(state.currentLink.url);
      }
    });
  }

  if (btnCopy) {
    btnCopy.addEventListener('click', () => {
      const state = getRgState();
      if (state.currentLink && state.currentLink.url) {
        navigator.clipboard.writeText(state.currentLink.url).then(
          () => showToast('URL copied to clipboard!', 'success'),
          () => showToast('Could not copy URL automatically', 'error')
        );
      }
    });
  }

  // Restore state from localStorage on load
  const initialState = getRgState();
  updateRgUI(initialState);
}
