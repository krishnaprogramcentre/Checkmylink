# CHECK MY LINK - Mobile Security Phishing Link Checker

> **Developer:** Krishan Kumar Verma  
> **Enrollment No:** 20240882  
> **Project Type:** University Cybersecurity Practical Demonstration Project  
> **Core Theme:** Cybersecurity Defense Hub (Dark Navy `#071426`, Primary Blue `#087CFF`, Orange `#FF8A00`)  
> **Security Standards:** Safe URL Normalization, Anti-SSRF Zero-Execution Architecture, Smart Fake Link Detection, Brand Typosquatting Check, Google Safe Browsing API Integration.

---

## 1. Project Overview

**CHECK MY LINK** is a full-stack cybersecurity application designed to detect and block malicious phishing links, fake login pages, typosquatted brand lookalikes, and credential harvesters before users click on them. 

The application is built specifically for practical college project demonstrations, complete with:
- An ultra-modern, glassmorphism-inspired 3-slide user interface with smooth animations and ambient background effects.
- A robust, zero-execution Node.js + Express backend that analyzes URLs without ever visiting or downloading untrusted remote content (eliminating Server-Side Request Forgery - SSRF).
- MongoDB database integration with an in-memory fallback mechanism (ensuring the live viva presentation never crashes even if MongoDB is not running).
- Explainable risk classifications (`HIGH RISK`, `PROCEED WITH CAUTION`, `SAFE`, `INVALID`) accompanied by transparent bullet-pointed detection reasons.

---

## 2. Professional Directory Structure

```text
CHECK-MY-LINK/
├── FRONTEND/
│   ├── index.html                 # Main single-page web app with 3 multi-slide stages
│   ├── style.css                  # Custom cybersecurity styling, glassmorphism & keyframes
│   ├── script.js                  # Canvas particles, ambient glow, API fetch & result cards
│   └── assets/
│       ├── profile.jpg            # Developer photograph / placeholder for Krishan Kumar Verma
│       └── cybersecurity-bg.png   # Cybernetic network grid background image
├── BACKEND/
│   ├── server.js                  # Main Express server entry point, rate-limiter & middleware
│   ├── package.json               # Node.js project manifest & npm dependencies
│   ├── .env                       # Environment variables (port, db URI, API keys)
│   ├── .env.example               # Template for environment configuration
│   ├── config/
│   │   └── db.js                  # MongoDB connection with Mongoose & auto-reconnect
│   ├── models/
│   │   └── Scan.js                # Mongoose schema for scan audit history & sanitized metadata
│   ├── routes/
│   │   └── scanRoutes.js          # REST API endpoints for scanning and history
│   ├── controllers/
│   │   └── scanController.js      # Business logic, memory cache fallback & analytics
│   ├── services/
│   │   └── threatDetection.js     # Heuristic engine, entropy, homoglyph & Google API service
│   └── middleware/
│       └── errorHandler.js        # Centralized 404 & 500 error management
└── README.md                      # Comprehensive system documentation
```

---

## 3. Explanation of Every File

### Frontend Files (`FRONTEND/`)
1. **`index.html`**:
   - Contains the semantic HTML5 structure of the application.
   - Organizes the user journey into 3 distinct slides:
     - **Slide 1: Welcome / Introduction**: Showcases branding, developer credentials (Krishan Kumar Verma), live terminal widget, and "Get Started" CTA.
     - **Slide 2: Link Scanner**: Features the URL input, Paste/Clear buttons, Random Sample Link generator, demonstration test cases (Safe, Suspicious, Malformed), and educational threat vector cards ("Why Check Your Link?").
     - **Slide 3: Scanning Results**: Features the animated radar scanner, progress bar, and dynamic result cards for High-Risk (Red Warning) and Safe (Green Shield) states.
   - Also provides sections for **Live Scan History**, **System Architecture**, and the **Developer Profile**.

2. **`style.css`**:
   - Defines the cybersecurity color scheme: Dark Navy (`#071426`), Primary Blue (`#087CFF`), Orange (`#FF8A00`), Danger Red (`#FF3030`), and Safe Green (`#18C77A`).
   - Implements modern glassmorphism (`backdrop-filter: blur(14px)`), ambient mouse-following glow, subtle card hover elevations, and radar scan animations.
   - **Zero glowing or flashing cursors**, maintaining clean accessibility and respecting `prefers-reduced-motion`.

3. **`script.js`**:
   - Powers the interactive background canvas (particles and connecting network lines).
   - Coordinates multi-slide smooth scrolling and IntersectionObserver indicators.
   - Manages clipboard operations (`navigator.clipboard.readText()`).
   - Simulates realistic multi-stage scanning with a progress bar and status audit logs.
   - Calls `POST /api/scan` and dynamically renders the results.
   - Includes a built-in **Client-Side Fallback Heuristic Engine** so that if the backend is temporarily offline during a classroom demonstration, tests still evaluate accurately!

4. **`assets/profile.jpg`**:
   - The developer profile image for Krishan Kumar Verma. You can replace this file anytime with your real photo.

5. **`assets/cybersecurity-bg.png`**:
   - High-definition cybernetic grid background asset for ambient visuals.

---

### Backend Files (`BACKEND/`)
1. **`server.js`**:
   - Initializes the Express server.
   - Enforces security headers via `helmet` and Cross-Origin Resource Sharing via `cors`.
   - Protects against Denial of Service (DoS) and brute force using `express-rate-limit` (100 requests per 15 minutes).
   - Serves the frontend statically or powers the REST API on port `5000`.

2. **`package.json`**:
   - Lists all server dependencies (`express`, `mongoose`, `dotenv`, `cors`, `helmet`, `axios`, `validator`, `express-rate-limit`).
   - Defines run scripts: `npm start` and `npm run dev` (using `nodemon`).

3. **`.env` & `.env.example`**:
   - Stores sensitive configuration settings like `PORT`, `MONGODB_URI`, and `GOOGLE_SAFE_BROWSING_KEY`.
   - Ensures private keys are never exposed in frontend code.

4. **`config/db.js`**:
   - Manages connection to MongoDB using Mongoose.
   - Features non-blocking timeout handling: if MongoDB is not running locally, it logs a helpful warning and switches to **In-Memory Fallback Mode** without crashing.

5. **`models/Scan.js`**:
   - Mongoose data model for scan audit logs.
   - Stores: `scanId`, `sanitizedUrl`, `normalizedDomain`, `protocol`, `riskLevel`, `threatType`, `detectionReasons`, and `timestamp`.
   - Never stores sensitive query parameters (passwords, tokens, or session IDs).

6. **`services/threatDetection.js`**:
   - The cybersecurity core of the project.
   - **Anti-SSRF Gate**: Rejects loopback (`127.0.0.1`), private RFC1918 IPs, and non-web protocols (`file:`, `ftp:`, `javascript:`).
   - **Zero-Execution**: Never sends HTTP GET requests to target websites.
   - **Heuristics**:
     1. Raw IP Host Detection.
     2. Brand Typosquatting / Leetspeak (`paypa1`, `micros0ft`, `g00gle`).
     3. IDN Homoglyph / Punycode (`xn--`) attacks.
     4. Subdomain stacking / depth analysis.
     5. High-risk Top-Level Domain (TLD) correlation (`.xyz`, `.top`, `.click`, `.work`).
     6. Shannon entropy analysis (detects Algorithmic Domain Generation - DGA).
     7. Unencrypted HTTP transmission check for credential keywords.
   - **Google Safe Browsing API v4 Integration**: Queries Google's threat feed if an API key is provided.

7. **`controllers/scanController.js`**:
   - `scanUrl`: Coordinates input validation, calls threat detection, saves to database or memory, and returns formatted JSON.
   - `getHistory`: Returns recent scans and summary statistics (`totalScans`, `highRiskCount`, `safeCount`, `suspiciousCount`).
   - `clearHistory`: Wipes scan logs upon user confirmation.
   - `getHealth`: Returns API heartbeat, uptime, and database connectivity status.

8. **`routes/scanRoutes.js`**:
   - Defines REST endpoints:
     - `POST /api/scan` - Analyze a submitted URL.
     - `GET /api/history` - Fetch recent scan history.
     - `DELETE /api/history` - Clear scan history.
     - `GET /api/health` - Health check diagnostic.

9. **`middleware/errorHandler.js`**:
   - Centralizes 404 Not Found and internal server error responses into uniform JSON.

---

## 4. REST API Documentation

### `POST /api/scan`
- **Request Body:**
  ```json
  {
    "url": "http://paypa1-security-update.account-verification-login.com/login.php"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Scan analysis completed successfully.",
    "data": {
      "scanId": "SCAN-1730652800-4F2",
      "status": "FLAGGED",
      "riskLevel": "HIGH",
      "isThreat": true,
      "threatType": "Phishing & Brand Impersonation",
      "threatScore": 13,
      "detectionReasons": [
        "Typosquatting / Character Substitution detected for \"PayPal\".",
        "Target impersonates official brand name \"PAYPAL\" on unauthorized host.",
        "Suspicious credential harvesting keywords detected in path: [login, security, account, update].",
        "Sensitive login or account workflow transmitted over unencrypted HTTP (no TLS encryption)."
      ],
      "normalizedDomain": "paypa1-security-update.account-verification-login.com",
      "protocol": "http:",
      "sanitizedUrl": "http://paypa1-security-update.account-verification-login.com/login.php",
      "timestamp": "2026-11-03T17:20:00.000Z",
      "source": "Heuristic Cyber Threat Intelligence Engine"
    },
    "dbStatus": "MongoDB Connected"
  }
  ```

### `GET /api/history`
- Returns recent scan records and aggregated counter totals.

### `GET /api/health`
- Returns system status, server uptime, database connectivity state, and API key presence.
