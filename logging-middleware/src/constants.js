// Base URL of the Evaluation Server
const BASE_URL = "http://4.224.186.213/evaluation-service";
const ENDPOINTS = {
  REGISTER: "/register",
  AUTH: "/auth",
  LOGS: "/logs",
};

const STACK = {
  BACKEND: "backend",
  FRONTEND: "frontend",
};

const LEVEL = {
  DEBUG: "debug",
  INFO: "info",
  WARN: "warn",
  ERROR: "error",
  FATAL: "fatal",
};

const BACKEND_PACKAGES = [
  "cache",
  "controller",
  "cron_job",
  "db",
  "domain",
  "handler",
  "repository",
  "route",
  "service",
];

const FRONTEND_PACKAGES = [
  "api",
  "component",
  "hook",
  "page",
  "state",
  "style",
];

const COMMON_PACKAGES = [
  "auth",
  "config",
  "middleware",
  "utils",
];

module.exports = {
  BASE_URL,
  ENDPOINTS,
  STACK,
  LEVEL,
  BACKEND_PACKAGES,
  FRONTEND_PACKAGES,
  COMMON_PACKAGES,
};