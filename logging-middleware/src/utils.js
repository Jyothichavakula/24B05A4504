const {
  STACK,
  LEVEL,
  BACKEND_PACKAGES,
  FRONTEND_PACKAGES,
  COMMON_PACKAGES,
} = require("./constants");

/**
 * Validate stack value
 */
function isValidStack(stack) {
  return Object.values(STACK).includes(stack);
}

/**
 * Validate log level
 */
function isValidLevel(level) {
  return Object.values(LEVEL).includes(level);
}

/**
 * Validate package name
 */
function isValidPackage(stack, packageName) {
  const commonPackages = COMMON_PACKAGES;

  if (commonPackages.includes(packageName)) {
    return true;
  }

  if (stack === STACK.BACKEND) {
    return BACKEND_PACKAGES.includes(packageName);
  }

  if (stack === STACK.FRONTEND) {
    return FRONTEND_PACKAGES.includes(packageName);
  }

  return false;
}

/**
 * Validate log request
 */
function validateLog(stack, level, packageName, message) {
  if (!isValidStack(stack)) {
    throw new Error(`Invalid stack: ${stack}`);
  }

  if (!isValidLevel(level)) {
    throw new Error(`Invalid level: ${level}`);
  }

  if (!isValidPackage(stack, packageName)) {
    throw new Error(`Invalid package: ${packageName}`);
  }

  if (!message || typeof message !== "string") {
    throw new Error("Message must be a non-empty string");
  }

  return true;
}

module.exports = {
  validateLog,
  isValidStack,
  isValidLevel,
  isValidPackage,
};