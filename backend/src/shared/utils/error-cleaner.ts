/**
 * Utility function to clean up error messages by removing sensitive data
 * like JWT tokens, payloads, and other sensitive information
 */
export function cleanErrorMessage(message: string): string {
  let cleaned = message;

  // Remove NestJS exception prefixes using regex (much cleaner)
  cleaned = cleaned.replace(/\w+Exception:\s*/g, '');

  // Handle specific token expiration messages
  if (cleaned.includes('Token used too late')) {
    return 'Token used too late: token expired';
  }

  // Handle Google login failed messages - remove the nested error
  if (cleaned.includes('Google login failed: Error:')) {
    return 'Google login failed: invalid or expired token';
  }

  // Remove any JSON objects (JWT payloads) from error messages
  cleaned = cleaned.replace(/:\s*\{[^}]*\}/g, '');
  cleaned = cleaned.replace(/\{[^}]*\}/g, '');

  // Remove timestamp patterns like "1754092435.669 > 1753864750"
  cleaned = cleaned.replace(/\d{10,13}\.\d{3}\s*>\s*\d{10,13}/g, '[timestamp]');

  // Remove redundant "Error: " prefix
  cleaned = cleaned.replace(/^Error:\s*/g, '');

  return cleaned.trim();
}
