/* ----------------------------------------------------
   Quranic Centers Survey & Management System - Mali
   Security, Crypto & Sanitization Module
   ---------------------------------------------------- */

// Fixed Salt for Client-Side Password Verification Hashing
const SALT = "AECMEC_MALI_QURANIC_CENTERS_SALT_2026_SECURE";

// Pre-calculated SHA-256 hash of (DEFAULT_PASSWORD + SALT)
// Default Password: "NANA@fatima2"
let ADMIN_PASS_HASH = "";

// Initialize hash for default password
async function initializeDefaultHash() {
  ADMIN_PASS_HASH = await hashText("NANA@fatima2");
}
initializeDefaultHash();

/**
 * SHA-256 Text Hashing using Web Crypto API
 */
export async function hashText(plainText) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plainText + SALT);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Verifies admin password securely using SHA-256 hash
 */
export async function verifyAdminPassword(inputPassword) {
  const inputHash = await hashText(inputPassword.trim());
  const customPassHash = localStorage.getItem('mali_quran_admin_pass_hash');
  
  if (customPassHash) {
    return inputHash === customPassHash;
  }
  return inputHash === ADMIN_PASS_HASH;
}

/**
 * Updates admin password securely
 */
export async function updateAdminPassword(newPassword) {
  const newHash = await hashText(newPassword.trim());
  localStorage.setItem('mali_quran_admin_pass_hash', newHash);
  return true;
}

/**
 * Sanitizes input strings against HTML / XSS Injection
 */
export function xssClean(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Rate Limiting & Cooldown Protection (e.g. max 1 submission per 10 seconds)
 */
const rateLimitMap = new Map();

export function checkRateLimit(actionKey, cooldownSeconds = 10) {
  const now = Date.now();
  const lastTime = rateLimitMap.get(actionKey) || 0;
  if (now - lastTime < cooldownSeconds * 1000) {
    const remaining = Math.ceil((cooldownSeconds * 1000 - (now - lastTime)) / 1000);
    return { allowed: false, remainingSeconds: remaining };
  }
  rateLimitMap.set(actionKey, now);
  return { allowed: true, remainingSeconds: 0 };
}

/**
 * Session Security & Expiry Handler (Expires in 2 hours)
 */
const SESSION_DURATION_MS = 2 * 60 * 60 * 1000;

export function setAdminSession() {
  const sessionData = {
    auth: true,
    expiresAt: Date.now() + SESSION_DURATION_MS
  };
  localStorage.setItem('mali_quran_admin_session', JSON.stringify(sessionData));
}

export function isSessionValid() {
  const sessionRaw = localStorage.getItem('mali_quran_admin_session');
  if (!sessionRaw) return false;
  try {
    const session = JSON.parse(sessionRaw);
    if (session && session.auth && Date.now() < session.expiresAt) {
      return true;
    }
  } catch (e) {
    // Invalid session JSON
  }
  clearAdminSession();
  return false;
}

export function clearAdminSession() {
  localStorage.removeItem('mali_quran_admin_session');
}
