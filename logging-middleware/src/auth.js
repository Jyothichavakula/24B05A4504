const config = require("./config");

/**
 * Returns the current access token
 */
function getAccessToken() {
  return config.ACCESS_TOKEN;
}

/**
 * Returns authorization header
 */
function getAuthHeader() {
  return {
    Authorization: `Bearer ${config.ACCESS_TOKEN}`,
  };
}

/**
 * Verify required configuration exists
 */
function validateCredentials() {
  const requiredFields = [
    "BASE_URL",
    "CLIENT_ID",
    "CLIENT_SECRET",
    "ACCESS_TOKEN",
  ];

  const missing = requiredFields.filter(
    (field) => !config[field]
  );

  if (missing.length > 0) {
    throw new Error(
      `Missing configuration: ${missing.join(", ")}`
    );
  }

  return true;
}

module.exports = {
  getAccessToken,
  getAuthHeader,
  validateCredentials,
};