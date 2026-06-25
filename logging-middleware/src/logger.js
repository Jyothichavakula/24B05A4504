const axios = require("axios");

const config = require("./config");
const { ENDPOINTS } = require("./constants");
const { getAuthHeader, validateCredentials } = require("./auth");
const { validateLog } = require("./utils");

/**
 * Log Function
 * @param {string} stack
 * @param {string} level
 * @param {string} packageName
 * @param {string} message
 */
async function Log(stack, level, packageName, message) {
  try {
    // Validate environment configuration
    validateCredentials();

    // Validate log parameters
    validateLog(stack, level, packageName, message);

    const response = await axios.post(
      `${config.BASE_URL}${ENDPOINTS.LOGS}`,
      {
        stack,
        level,
        package: packageName,
        message,
      },
      {
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Logging Error:", error.response?.data || error.message);

    return {
      success: false,
      error: error.response?.data || error.message,
    };
  }
}

module.exports = Log;