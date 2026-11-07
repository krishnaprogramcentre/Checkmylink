/**
 * Scan Routes
 * Project: CHECK MY LINK
 * Developer: Krishan Kumar Verma
 */

const express = require('express');
const router = express.Router();
const scanController = require('../controllers/scanController');

// URL Threat Scanning Endpoint
router.post('/scan', scanController.scanUrl);

// History & Statistics Endpoints
router.get('/history', scanController.getHistory);
router.delete('/history', scanController.clearHistory);

// Health Check Endpoint
router.get('/health', scanController.getHealth);

module.exports = router;
