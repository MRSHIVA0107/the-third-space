/**
 * Generates an event-relevant sequential registration ID in order with S.No.
 * E.g., UTSAAH3-001, UTSAAH3-002, UTSAAH3-003...
 *
 * @param {number} sequenceNumber - Sequential registration count / serial number
 * @param {string} prefix - Event identifier prefix (defaults to 'UTSAAH3')
 * @returns {string} Formatted registration ID
 */
export function formatSequentialId(sequenceNumber, prefix = "UTSAAH3") {
  const num = Math.max(1, parseInt(sequenceNumber, 10) || 1);
  return `${prefix}-${String(num).padStart(3, "0")}`;
}

/**
 * Fallback generator if sequence number is not yet determined
 */
export function generateRegistrationId(seq) {
  if (seq) {
    return formatSequentialId(seq);
  }
  const randomDigits = Math.floor(100 + Math.random() * 900);
  return `UTSAAH3-${randomDigits}`;
}
