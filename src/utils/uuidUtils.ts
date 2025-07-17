/**
 * UUID Utility Functions
 *
 * This utility provides functions for generating and validating UUIDs
 * to ensure compatibility with PostgreSQL UUID columns.
 */

/**
 * Generate a v4 UUID
 * @returns {string} A v4 UUID string
 */
export const generateUUID = (): string => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Validate if a string is a valid UUID
 * @param {string} uuid - The string to validate
 * @returns {boolean} True if valid UUID, false otherwise
 */
export const isValidUUID = (uuid: string): boolean => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

/**
 * Generate a deterministic UUID for testing purposes
 * @param {string} seed - A seed string to generate a consistent UUID
 * @returns {string} A deterministic UUID
 */
export const generateDeterministicUUID = (seed: string): string => {
  // Simple hash function for deterministic UUID generation
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Convert hash to hex and pad
  const hex = Math.abs(hash).toString(16).padStart(8, "0");

  // Create UUID format
  return `${hex.substring(0, 8)}-${hex.substring(0, 4)}-4${hex.substring(
    1,
    4
  )}-8${hex.substring(2, 5)}-${hex.substring(0, 12).padEnd(12, "0")}`;
};

/**
 * Common UUID constants for development
 */
export const DEV_UUIDS = {
  SOCIETY_1: "550e8400-e29b-41d4-a716-446655440000",
  SOCIETY_2: "550e8400-e29b-41d4-a716-446655440001",
  SOCIETY_3: "550e8400-e29b-41d4-a716-446655440002",
  ADMIN_USER: "550e8400-e29b-41d4-a716-446655440100",
  MANAGER_USER: "550e8400-e29b-41d4-a716-446655440101",
  RESIDENT_USER: "550e8400-e29b-41d4-a716-446655440102",
} as const;

export default {
  generateUUID,
  isValidUUID,
  generateDeterministicUUID,
  DEV_UUIDS,
};
