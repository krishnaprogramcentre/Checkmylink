/**
 * Scan Controller
 * Project: CHECK MY LINK
 * Developer: Krishan Kumar Verma
 * 
 * Handles incoming scan requests, coordinates with threat detection engine,
 * and persists results in MongoDB (with graceful in-memory fallback).
 */

const Scan = require('../models/Scan');
const { analyzeUrl } = require('../services/threatDetection');
const { getDBStatus } = require('../config/db');

// In-memory fallback repository when MongoDB is offline
const memoryScans = [];
const MAX_MEMORY_SCANS = 50;

/**
 * Seed initial sample scans for demonstration in viva if memory is empty
 */
function seedDemoScans() {
  if (memoryScans.length === 0) {
    memoryScans.push(
      {
        scanId: 'SCAN-DEMO-001',
        sanitizedUrl: 'https://www.google.com',
        normalizedDomain: 'www.google.com',
        protocol: 'https:',
        status: 'COMPLETED',
        riskLevel: 'SAFE',
        isThreat: false,
        threatType: 'Clean / Low Risk',
        detectionReasons: [
          'Domain matches standard legitimate conventions.',
          'Valid HTTPS protocol with verified domain syntax.',
          'No heuristic phishing keywords or homoglyphs found.'
        ],
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        scanSource: 'Heuristic Cyber Threat Intelligence Engine',
      },
      {
        scanId: 'SCAN-DEMO-002',
        sanitizedUrl: 'http://paypa1-security-update.account-verification-login.com/login.php',
        normalizedDomain: 'paypa1-security-update.account-verification-login.com',
        protocol: 'http:',
        status: 'FLAGGED',
        riskLevel: 'HIGH',
        isThreat: true,
        threatType: 'Phishing & Brand Impersonation',
        detectionReasons: [
          'Typosquatting / Character Substitution detected for "PayPal".',
          'Suspicious credential harvesting keywords detected in path: [login, security, account, update].',
          'Sensitive login or account workflow transmitted over unencrypted HTTP (no TLS encryption).'
        ],
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        scanSource: 'Heuristic Cyber Threat Intelligence Engine',
      }
    );
  }
}
seedDemoScans();

/**
 * Controller: Perform URL Scan
 * POST /api/scan
 */
exports.scanUrl = async (req, res, next) => {
  try {
    const { url } = req.body;

    if (!url || typeof url !== 'string' || url.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'URL is required',
        message: 'Please provide a valid URL string in the request body (e.g. {"url": "https://example.com"}).',
      });
    }

    // Run security analysis through cybersecurity engine
    const scanResult = await analyzeUrl(url);

    // Save scan record
    if (getDBStatus()) {
      try {
        const scanDoc = new Scan({
          scanId: scanResult.scanId,
          sanitizedUrl: scanResult.sanitizedUrl,
          normalizedDomain: scanResult.normalizedDomain,
          protocol: scanResult.protocol,
          status: scanResult.status,
          riskLevel: scanResult.riskLevel,
          isThreat: scanResult.isThreat,
          threatType: scanResult.threatType,
          detectionReasons: scanResult.detectionReasons,
          scanSource: scanResult.source,
        });
        await scanDoc.save();
      } catch (dbErr) {
        console.warn(`[DATABASE] Failed to write scan to MongoDB: ${dbErr.message}`);
        // Fallback to in-memory store
        memoryScans.unshift(scanResult);
      }
    } else {
      // MongoDB offline: store in memory
      memoryScans.unshift(scanResult);
      if (memoryScans.length > MAX_MEMORY_SCANS) {
        memoryScans.pop();
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Scan analysis completed successfully.',
      data: scanResult,
      dbStatus: getDBStatus() ? 'MongoDB Connected' : 'In-Memory Fallback Mode (MongoDB Offline)',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: Retrieve Scan History & Statistics
 * GET /api/history
 */
exports.getHistory = async (req, res, next) => {
  try {
    let history = [];
    let stats = {
      totalScans: 0,
      highRiskCount: 0,
      safeCount: 0,
      suspiciousCount: 0,
    };

    if (getDBStatus()) {
      try {
        const docs = await Scan.find()
          .sort({ timestamp: -1 })
          .limit(30)
          .lean();

        history = docs.map((doc) => ({
          scanId: doc.scanId,
          sanitizedUrl: doc.sanitizedUrl,
          normalizedDomain: doc.normalizedDomain,
          protocol: doc.protocol,
          status: doc.status,
          riskLevel: doc.riskLevel,
          isThreat: doc.isThreat,
          threatType: doc.threatType,
          detectionReasons: doc.detectionReasons,
          timestamp: doc.timestamp,
          scanSource: doc.scanSource,
        }));

        stats.totalScans = await Scan.countDocuments();
        stats.highRiskCount = await Scan.countDocuments({ riskLevel: 'HIGH' });
        stats.safeCount = await Scan.countDocuments({ riskLevel: 'SAFE' });
        stats.suspiciousCount = await Scan.countDocuments({ riskLevel: 'SUSPICIOUS' });
      } catch (dbErr) {
        console.warn(`[DATABASE] Read error, serving memory cache: ${dbErr.message}`);
        history = [...memoryScans];
      }
    } else {
      // Memory fallback
      history = [...memoryScans];
      stats.totalScans = memoryScans.length;
      stats.highRiskCount = memoryScans.filter((s) => s.riskLevel === 'HIGH').length;
      stats.safeCount = memoryScans.filter((s) => s.riskLevel === 'SAFE').length;
      stats.suspiciousCount = memoryScans.filter((s) => s.riskLevel === 'SUSPICIOUS').length;
    }

    return res.status(200).json({
      success: true,
      count: history.length,
      statistics: stats,
      data: history,
      dbStatus: getDBStatus() ? 'MongoDB Connected' : 'In-Memory Fallback Mode',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: Clear Scan History
 * DELETE /api/history
 */
exports.clearHistory = async (req, res, next) => {
  try {
    if (getDBStatus()) {
      await Scan.deleteMany({});
    }
    memoryScans.length = 0;

    return res.status(200).json({
      success: true,
      message: 'Scan history cleared successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: System Health & Diagnostics
 * GET /api/health
 */
exports.getHealth = (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'CHECK MY LINK API',
    developer: 'Krishan Kumar Verma',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    database: getDBStatus() ? 'Connected (MongoDB)' : 'In-Memory Fallback Mode',
    googleSafeBrowsingConfigured: Boolean(process.env.GOOGLE_SAFE_BROWSING_KEY),
  });
};
