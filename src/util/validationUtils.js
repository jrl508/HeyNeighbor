/**
 * Validation utilities for emails and phone numbers across HeyNeighbor
 */

/**
 * Validates whether an email string adheres to standard email format.
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== "string") return false;
  const trimmed = email.trim();
  // Standard RFC 5322 regex for email validation
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(trimmed);
};

/**
 * Extracts digits only from a phone number string.
 * @param {string} phone
 * @returns {string}
 */
export const cleanPhoneNumber = (phone) => {
  if (!phone) return "";
  const cleaned = String(phone).replace(/\D/g, "");
  // If user included leading US country code 1 with 11 digits, strip the 1
  if (cleaned.length === 11 && cleaned.startsWith("1")) {
    return cleaned.substring(1);
  }
  return cleaned;
};

/**
 * Formats a phone number input in real-time as (XXX) XXX-XXXX.
 * @param {string} value
 * @returns {string}
 */
export const formatPhoneNumber = (value) => {
  if (!value) return "";
  const digits = cleanPhoneNumber(value).slice(0, 10);
  
  if (digits.length === 0) return "";
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
};

/**
 * Validates whether a phone number is a valid 10-digit number.
 * Allows optional empty value if allowEmpty is true.
 * @param {string} phone
 * @param {boolean} [allowEmpty=true]
 * @returns {boolean}
 */
export const isValidPhone = (phone, allowEmpty = true) => {
  if (!phone || String(phone).trim() === "") {
    return allowEmpty;
  }
  const digits = cleanPhoneNumber(phone);
  // Must be exactly 10 digits and valid area code (first digit 2-9)
  return digits.length === 10 && /^[2-9]/.test(digits);
};

/**
 * Normalizes phone numbers to (XXX) XXX-XXXX for clean display.
 * @param {string} phone
 * @returns {string}
 */
export const formatDisplayPhone = (phone) => {
  if (!phone) return "";
  const digits = cleanPhoneNumber(phone);
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return phone;
};
