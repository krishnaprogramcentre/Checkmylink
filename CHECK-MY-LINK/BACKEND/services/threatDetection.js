/**
 * Advanced Threat Detection & Cybersecurity Engine
 * Project: CHECK MY LINK
 * Developer: Krishan Kumar Verma
 * 
 * CYBERSECURITY PRINCIPLES APPLIED:
 * 1. Zero-Execution & Anti-SSRF: Never connects directly to or downloads content from submitted URLs.
 * 2. Defense-in-Depth: Multi-layered analysis combining strict normalization, algorithmic heuristics,
 *    entropy scoring, homoglyph detection, and Google Safe Browsing Threat Intelligence API.
 * 3. Explainability: Every risk classification is accompanied by transparent, audit-ready detection reasons.
 */

const axios = require('axios');
const validator = require('validator');
const crypto = require('crypto');

// Known high-value brands frequently impersonated in phishing attacks
const MONITORED_BRANDS = [
  'paypal', 'apple', 'microsoft', 'google', 'amazon', 'netflix', 'facebook',
  'instagram', 'whatsapp', 'chase', 'wellsfargo', 'bankofamerica', 'citibank',
  'binance', 'coinbase', 'metamask', 'sbi', 'hdfc', 'icicibank', 'paytm',
  'steam', 'discord', 'dropbox', 'github', 'outlook', 'yahoo', 'adobe'
];

// High-risk keywords commonly found in phishing campaigns
const SUSPICIOUS_KEYWORDS = [
  'login', 'signin', 'verify', 'verification', 'secure', 'security', 'account',
  'update', 'billing', 'confirm', 'suspend', 'suspended', 'unlock', 'banking',
  'wallet', 'credential', 'password', 'recovery', 'authenticate', 'kyc', 'support-desk'
];

// Top-Level Domains (TLDs) disproportionately abused by malicious actors due to free/cheap registration
const SUSPICIOUS_TLDS = [
  '.xyz', '.top', '.work', '.click', '.gq', '.cf', '.tk', '.ml', '.buzz',
  '.fit', '.country', '.surf', '.stream', '.loan', '.racing', '.rest', '.mom',
  '.live', '.monster', '.support', '.download'
];

// Regex for raw IPv4 addresses
const IP_REGEX = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

/**
 * Calculate Shannon Entropy of a string.
 * Measures randomness of characters. Algorithmic Domain Generation (DGA) produces unusually high entropy.
 * @param {string} str 
 * @returns {number} entropy value (typically between 0 and 5)
 */
function calculateShannonEntropy(str) {
  if (!str) return 0;
  const len = str.length;
  const frequencies = {};

  for (let i = 0; i < len; i++) {
    const char = str[i];
    frequencies[char] = (frequencies[char] || 0) + 1;
  }

  let entropy = 0;
  for (const char in frequencies) {
    const p = frequencies[char] / len;
    entropy -= p * Math.log2(p);
  }

  return parseFloat(entropy.toFixed(3));
}

/**
 * Check if an IP address belongs to RFC1918 private, loopback, or link-local ranges.
 * Protects against Server-Side Request Forgery (SSRF).
 * @param {string} ip 
 * @returns {boolean}
 */
function isPrivateOrLocalIP(ip) {
  if (!IP_REGEX.test(ip)) return false;
  const parts = ip.split('.').map(Number);

  // 127.0.0.0/8 (Loopback)
  if (parts[0] === 127) return true;
  // 10.0.0.0/8 (Private)
  if (parts[0] === 10) return true;
  // 172.16.0.0/12 (Private)
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
  // 192.168.0.0/16 (Private)
  if (parts[0] === 192 && parts[1] === 168) return true;
  // 169.254.0.0/16 (Link-local)
  if (parts[0] === 169 && parts[1] === 254) return true;
  // 0.0.0.0/8
  if (parts[0] === 0) return true;

  return false;
}

/**
 * Sanitize URL for safe logging and storage (removes embedded passwords/tokens)
 * @param {URL} parsedUrl 
 * @returns {string}
 */
function sanitizeUrlForStorage(parsedUrl) {
  const safe = new URL(parsedUrl.href);
  safe.username = '';
  safe.password = '';
  // Redact token-like query params
  ['token', 'auth', 'key', 'password', 'pwd', 'session', 'jwt', 'secret'].forEach((param) => {
    if (safe.searchParams.has(param)) {
      safe.searchParams.set(param, '[REDACTED]');
    }
  });
  return safe.toString();
}

/**
 * Query Google Safe Browsing API v4
 * Checks if the URL is indexed in Google's official threat intelligence database.
 * @param {string} targetUrl 
 * @param {string} apiKey 
 * @returns {Promise<{isThreat: boolean, threatType: string, threatDetails: string[]}>}
 */
async function checkGoogleSafeBrowsing(targetUrl, apiKey) {
  if (!apiKey || apiKey.trim() === '') {
    return { isThreat: false, threatType: null, threatDetails: [] };
  }

  const endpoint = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`;

  const requestBody = {
    client: {
      clientId: 'check-my-link-security',
      clientVersion: '1.0.0',
    },
    threatInfo: {
      threatTypes: [
        'MALWARE',
        'SOCIAL_ENGINEERING',
        'UNWANTED_SOFTWARE',
        'POTENTIALLY_HARMFUL_APPLICATION',
      ],
      platformTypes: ['ANY_PLATFORM'],
      threatEntryTypes: ['URL'],
      threatEntries: [{ url: targetUrl }],
    },
  };

  try {
    const response = await axios.post(endpoint, requestBody, { timeout: 4000 });
    const matches = response.data && response.data.matches ? response.data.matches : [];

    if (matches.length > 0) {
      const matchTypes = matches.map((m) => m.threatType);
      return {
        isThreat: true,
        threatType: matchTypes[0],
        threatDetails: matchTypes,
      };
    }

    return { isThreat: false, threatType: null, threatDetails: [] };
  } catch (err) {
    console.warn(`[THREAT INTEL] Google Safe Browsing query warning: ${err.message}`);
    // Non-fatal: if Google API fails (e.g. invalid key or network issue), system relies on heuristic engine
    return { isThreat: false, threatType: null, threatDetails: [] };
  }
}

/**
 * Main Threat Analysis Engine
 * Performs URL validation, SSRF checks, heuristic behavioral inspection,
 * and threat intelligence correlation.
 * 
 * @param {string} rawUrl - User-submitted URL string
 * @returns {Promise<Object>} Comprehensive security scan assessment
 */
async function analyzeUrl(rawUrl) {
  const scanId = 'SCAN-' + Date.now() + '-' + crypto.randomBytes(3).toString('hex').toUpperCase();

  // Basic sanity check
  if (!rawUrl || typeof rawUrl !== 'string' || rawUrl.trim().length === 0) {
    return {
      scanId,
      status: 'FAILED',
      riskLevel: 'INVALID',
      isThreat: true,
      threatType: 'Malformed URL Input',
      detectionReasons: ['The submitted URL input is empty or invalid.'],
      normalizedDomain: 'N/A',
      protocol: 'http:',
      sanitizedUrl: 'N/A',
      timestamp: new Date().toISOString(),
      source: 'Input Validator',
    };
  }

  const trimmedUrl = rawUrl.trim();

  // Enforce protocol prefix if omitted
  let preparedUrl = trimmedUrl;
  if (!/^https?:\/\//i.test(preparedUrl)) {
    // If it looks like another protocol, let URL parser catch it
    if (/^[a-zA-Z0-9_-]+:\/\//i.test(preparedUrl)) {
      // Disallowed protocol like ftp:, file:, etc.
    } else {
      preparedUrl = 'http://' + preparedUrl;
    }
  }

  let parsed;
  try {
    parsed = new URL(preparedUrl);
  } catch (err) {
    return {
      scanId,
      status: 'FAILED',
      riskLevel: 'INVALID',
      isThreat: true,
      threatType: 'Invalid URL Syntax',
      detectionReasons: [
        'URL fails standard RFC 3986 parsing.',
        'Target contains illegal characters, improper encoding, or invalid structure.'
      ],
      normalizedDomain: 'N/A',
      protocol: 'http:',
      sanitizedUrl: trimmedUrl.slice(0, 100),
      timestamp: new Date().toISOString(),
      source: 'RFC Parser',
    };
  }

  // Protocol Validation: Only HTTP and HTTPS are permitted
  const protocol = parsed.protocol.toLowerCase();
  if (protocol !== 'http:' && protocol !== 'https:') {
    return {
      scanId,
      status: 'FLAGGED',
      riskLevel: 'HIGH',
      isThreat: true,
      threatType: 'Unsupported / Dangerous Protocol',
      detectionReasons: [
        `Dangerous protocol "${protocol}" rejected. Only standard web protocols (HTTP / HTTPS) are allowed.`,
        'Non-standard protocols (such as file:, javascript:, ftp:, data:) are frequently exploited in drive-by malware and XSS attacks.'
      ],
      normalizedDomain: parsed.hostname || 'N/A',
      protocol,
      sanitizedUrl: trimmedUrl.slice(0, 100),
      timestamp: new Date().toISOString(),
      source: 'Protocol Enforcement Gate',
    };
  }

  const hostname = parsed.hostname.toLowerCase();
  const pathname = parsed.pathname.toLowerCase();
  const search = parsed.search.toLowerCase();
  const sanitizedUrl = sanitizeUrlForStorage(parsed);

  const reasons = [];
  let threatScore = 0; // Cumulative score: 0-2 = SAFE, 3-4 = SUSPICIOUS, 5+ = HIGH

  // SSRF & Localhost Protection
  if (hostname === 'localhost' || hostname.endsWith('.local') || isPrivateOrLocalIP(hostname)) {
    return {
      scanId,
      status: 'FLAGGED',
      riskLevel: 'HIGH',
      isThreat: true,
      threatType: 'Private / Localhost Network Target (SSRF Attack)',
      detectionReasons: [
        `Target domain "${hostname}" resolves to a private, loopback, or internal intranet address.`,
        'Access to internal resources from web scanners is blocked to prevent Server-Side Request Forgery (SSRF).'
      ],
      normalizedDomain: hostname,
      protocol,
      sanitizedUrl,
      timestamp: new Date().toISOString(),
      source: 'Anti-SSRF Firewall',
    };
  }

  // 1. IP Address Hostname Check
  if (IP_REGEX.test(hostname)) {
    threatScore += 5;
    reasons.push('Raw numeric IP address used as hostname instead of a registered domain name (common phishing evasion technique).');
  }

  // 2. Punycode / Internationalized Domain Name (IDN) Homoglyph Attack Check
  if (hostname.includes('xn--')) {
    threatScore += 4;
    reasons.push('Punycode (xn--) encoding detected. Attackers frequently use IDN homoglyphs (lookalike characters from Cyrillic or Greek alphabets) to mimic authentic brands.');
  }

  // 3. Excessive Subdomain Stacking / Depth Check
  const domainParts = hostname.split('.');
  if (domainParts.length > 4) {
    threatScore += 3;
    reasons.push(`Excessive subdomain nesting (${domainParts.length} levels detected). Malicious actors use deep subdomains to hide real domain names on mobile viewports.`);
  }

  // 4. Excessive Hyphen Use
  const hyphenCount = (hostname.match(/-/g) || []).length;
  if (hyphenCount >= 3) {
    threatScore += 2;
    reasons.push(`Suspicious hyphen concentration (${hyphenCount} hyphens in domain name). Common in typo-squatted brand imitators.`);
  }

  // 5. High-Risk TLD (Top-Level Domain) Check
  for (const tld of SUSPICIOUS_TLDS) {
    if (hostname.endsWith(tld)) {
      threatScore += 2;
      reasons.push(`Domain uses high-risk Top-Level Domain "${tld}", statistically correlated with malicious or ephemeral scam campaigns.`);
      break;
    }
  }

  // 6. Brand Impersonation & Typosquatting in Subdomains / Hostname
  const baseDomain = domainParts.slice(-2).join('.');
  let impersonatedBrand = null;

  for (const brand of MONITORED_BRANDS) {
    // If brand appears in hostname, but base domain is NOT the official company domain
    if (hostname.includes(brand)) {
      const isOfficial = (baseDomain === `${brand}.com` || baseDomain === `${brand}.org` || baseDomain === `${brand}.net` || baseDomain === `${brand}.co.in`);
      if (!isOfficial) {
        impersonatedBrand = brand;
        threatScore += 5;
        reasons.push(`Target impersonates official brand name "${brand.toUpperCase()}" on unauthorized host "${hostname}".`);
        break;
      }
    }
  }

  // 7. Leetspeak / Visual Obfuscation Check (e.g., paypa1, micros0ft, g00gle)
  const leetPatterns = [
    { pattern: /paypa[1l!|]/i, legit: 'paypal.com', brand: 'PayPal' },
    { pattern: /micr[o0]s[o0]ft/i, legit: 'microsoft.com', brand: 'Microsoft' },
    { pattern: /g[o0][o0]gle/i, legit: 'google.com', brand: 'Google' },
    { pattern: /app[1l!|]e/i, legit: 'apple.com', brand: 'Apple' },
    { pattern: /am[a4]z[o0]n/i, legit: 'amazon.com', brand: 'Amazon' },
    { pattern: /netf[1l!|]ix/i, legit: 'netflix.com', brand: 'Netflix' },
  ];

  for (const item of leetPatterns) {
    if (item.pattern.test(hostname) && !hostname.endsWith(item.legit)) {
      threatScore += 6;
      reasons.push(`Typosquatting / Character Substitution detected for "${item.brand}". Lookalike characters were used to deceive viewers.`);
    }
  }

  // 8. Phishing Keywords in URL Path or Query
  const combinedPathAndQuery = pathname + search;
  const detectedKeywords = SUSPICIOUS_KEYWORDS.filter((kw) => combinedPathAndQuery.includes(kw));
  if (detectedKeywords.length >= 2) {
    threatScore += 3;
    reasons.push(`Suspicious credential harvesting keywords detected in path: [${detectedKeywords.slice(0, 4).join(', ')}].`);
  }

  // 9. Unencrypted HTTP for Sensitive Action
  if (protocol === 'http:' && (impersonatedBrand || detectedKeywords.length > 0 || threatScore >= 2)) {
    threatScore += 2;
    reasons.push('Sensitive login or account workflow transmitted over unencrypted HTTP (no TLS encryption), exposing user data to eavesdropping.');
  }

  // 10. Shannon Entropy of Domain
  // Analyze primary label (e.g. for "x9j2kd0ql.xyz", analyze "x9j2kd0ql")
  const mainLabel = domainParts[0] || '';
  const entropy = calculateShannonEntropy(mainLabel);
  if (mainLabel.length > 10 && entropy > 3.6) {
    threatScore += 2;
    reasons.push(`High Shannon entropy (${entropy}) detected in domain label "${mainLabel}". Indicates possible Algorithmic Domain Generation (DGA).`);
  }

  // 11. Google Safe Browsing Threat Intelligence API Lookup
  const apiKey = process.env.GOOGLE_SAFE_BROWSING_KEY;
  const gsbResult = await checkGoogleSafeBrowsing(preparedUrl, apiKey);

  if (gsbResult.isThreat) {
    threatScore += 10;
    reasons.unshift(`FLAGGED BY GOOGLE SAFE BROWSING: Identified as confirmed "${gsbResult.threatType}".`);
  }

  // Determine Final Risk Level
  let riskLevel = 'SAFE';
  let isThreat = false;
  let threatType = 'None Detected';

  if (threatScore >= 5) {
    riskLevel = 'HIGH';
    isThreat = true;
    threatType = gsbResult.threatType || (impersonatedBrand ? 'Phishing & Brand Impersonation' : 'High-Risk Malicious URL');
  } else if (threatScore >= 2) {
    riskLevel = 'SUSPICIOUS';
    isThreat = false; // Cautionary, not definitively blacklisted
    threatType = 'Suspicious URL Characteristics';
  } else {
    riskLevel = 'SAFE';
    isThreat = false;
    threatType = 'Clean / Low Risk';
    if (reasons.length === 0) {
      reasons.push('Domain matches standard legitimate conventions.');
      reasons.push('Valid web protocol and verified domain syntax.');
      reasons.push('No suspicious phishing keywords or fake brand lookalikes found.');
      if (apiKey) {
        reasons.push('Google Safe Browsing database verified no active threat matches.');
      }
    }
  }

  return {
    scanId,
    status: isThreat ? 'FLAGGED' : 'COMPLETED',
    riskLevel,
    isThreat,
    threatType,
    threatScore,
    detectionReasons: reasons,
    normalizedDomain: hostname,
    protocol,
    sanitizedUrl,
    timestamp: new Date().toISOString(),
    source: apiKey ? 'Google Safe Browsing + Smart Security Engine' : 'Smart Threat Intelligence Engine',
  };
}

module.exports = {
  analyzeUrl,
  calculateShannonEntropy,
  isPrivateOrLocalIP,
};
