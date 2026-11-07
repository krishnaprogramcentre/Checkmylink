/**
 * Scan Model & Schema
 * Project: CHECK MY LINK
 * Developer: Krishan Kumar Verma
 * 
 * Secure Schema: Sanitizes and strips private credentials/tokens
 * before persisting scan history metadata to MongoDB.
 */

const mongoose = require('mongoose');

const scanSchema = new mongoose.Schema(
  {
    scanId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    // Sanitized display URL (passwords, auth tokens & sensitive parameters stripped)
    sanitizedUrl: {
      type: String,
      required: true,
    },
    normalizedDomain: {
      type: String,
      required: true,
      index: true,
    },
    protocol: {
      type: String,
      required: true,
      enum: ['http:', 'https:'],
    },
    status: {
      type: String,
      required: true,
      enum: ['COMPLETED', 'FAILED', 'FLAGGED'],
      default: 'COMPLETED',
    },
    riskLevel: {
      type: String,
      required: true,
      enum: ['SAFE', 'SUSPICIOUS', 'HIGH', 'INVALID'],
      default: 'SAFE',
      index: true,
    },
    isThreat: {
      type: Boolean,
      required: true,
      default: false,
    },
    threatType: {
      type: String,
      default: 'None Detected',
    },
    detectionReasons: {
      type: [String],
      default: [],
    },
    securityScores: {
      heuristicScore: { type: Number, default: 0 },
      threatIntelligenceScore: { type: Number, default: 0 },
    },
    scanSource: {
      type: String,
      default: 'Heuristic Engine + Safe Browsing Intel',
    },
    clientIpHash: {
      type: String,
      select: false, // Privacy protection: never expose client IP
    },
  },
  {
    timestamps: { createdAt: 'timestamp', updatedAt: false },
    versionKey: false,
  }
);

// Method to format scan object for safe client response
scanSchema.methods.toSafeObject = function () {
  return {
    scanId: this.scanId,
    sanitizedUrl: this.sanitizedUrl,
    normalizedDomain: this.normalizedDomain,
    protocol: this.protocol,
    status: this.status,
    riskLevel: this.riskLevel,
    isThreat: this.isThreat,
    threatType: this.threatType,
    detectionReasons: this.detectionReasons,
    timestamp: this.timestamp,
    scanSource: this.scanSource,
  };
};

module.exports = mongoose.model('Scan', scanSchema);
