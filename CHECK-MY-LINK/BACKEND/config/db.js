/**
 * Database Configuration & Connection Handler
 * Project: CHECK MY LINK - Mobile Security Phishing Link Checker
 * Developer: Krishan Kumar Verma
 */

const mongoose = require('mongoose');

let isConnected = false;

/**
 * Connect to MongoDB with auto-reconnect and graceful error handling.
 * Never crashes the server if MongoDB service is not running locally.
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/check_my_link';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of hanging
    });

    isConnected = true;
    console.log(`[DATABASE] MongoDB Connected Successfully: ${conn.connection.host}`);
  } catch (error) {
    isConnected = false;
    console.warn(`[DATABASE WARNING] Could not connect to MongoDB at "${uri}".`);
    console.warn(`[DATABASE NOTE] Reason: ${error.message}`);
    console.warn(`[DATABASE NOTE] The application will continue running using In-Memory Storage.`);
    console.warn(`[DATABASE TIP] To enable persistent database storage, start MongoDB locally (mongod) or configure MongoDB Atlas in .env.`);
  }

  // Monitor database connection events
  mongoose.connection.on('disconnected', () => {
    isConnected = false;
    console.warn('[DATABASE] MongoDB connection lost. Operating in fallback mode.');
  });

  mongoose.connection.on('reconnected', () => {
    isConnected = true;
    console.log('[DATABASE] MongoDB reconnected successfully.');
  });
};

/**
 * Check if MongoDB connection is active
 * @returns {boolean}
 */
const getDBStatus = () => isConnected;

module.exports = { connectDB, getDBStatus };
