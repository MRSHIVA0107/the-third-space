// ============================================================
// REGISTRATION VALIDATION — PURE JAVASCRIPT
// Used for both client-side and server-side checks (No Zod)
// ============================================================

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+\d\s()-]{10,15}$/;
const VALID_YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

export function validateRegistration(data) {
  if (!data || typeof data !== "object") {
    return { isValid: false, error: "Invalid registration payload." };
  }

  const fullName = (data.fullName || "").trim();
  const email = (data.email || "").trim().toLowerCase();
  const phone = (data.phone || "").trim();
  const college = (data.college || "").trim();
  const year = (data.year || "").trim();
  const branch = (data.branch || "").trim().toUpperCase();
  const section = (data.section || "").trim().toUpperCase();
  const studentId = (data.studentId || "").trim().toUpperCase();
  const socialHandle = (data.socialHandle || "").trim();

  if (!fullName || fullName.length < 2) {
    return { isValid: false, error: "Please enter your full name (minimum 2 characters)." };
  }
  if (fullName.length > 100) {
    return { isValid: false, error: "Name must be 100 characters or fewer." };
  }

  if (!email || !EMAIL_REGEX.test(email)) {
    return { isValid: false, error: "Please enter a valid email address." };
  }
  if (email.length > 254) {
    return { isValid: false, error: "Email is too long." };
  }

  if (!phone || !PHONE_REGEX.test(phone)) {
    return { isValid: false, error: "Please enter a valid 10-digit phone number." };
  }

  if (!college || college.length < 2) {
    return { isValid: false, error: "Please enter your college name." };
  }
  if (college.length > 200) {
    return { isValid: false, error: "College name is too long." };
  }

  if (!year || !VALID_YEARS.includes(year)) {
    return { isValid: false, error: "Please select your year of study." };
  }

  if (!branch || branch.length < 2) {
    return { isValid: false, error: "Please enter your Branch / Department (e.g. CSE, CSM, ECE)." };
  }
  if (branch.length > 50) {
    return { isValid: false, error: "Branch name is too long." };
  }

  if (!section || section.length < 1) {
    return { isValid: false, error: "Please enter your Section (e.g. A, B, C)." };
  }
  if (section.length > 20) {
    return { isValid: false, error: "Section name is too long." };
  }

  if (!studentId || studentId.length < 2) {
    return { isValid: false, error: "Please enter your Roll No / Student ID (e.g. 24R21A05XX)." };
  }
  if (studentId.length > 50) {
    return { isValid: false, error: "Student ID is too long." };
  }

  if (socialHandle.length > 100) {
    return { isValid: false, error: "Social handle is too long." };
  }

  return {
    isValid: true,
    data: {
      fullName,
      email,
      phone,
      college,
      year,
      branch,
      section,
      studentId,
      socialHandle: socialHandle || null,
    },
  };
}

export const MAX_PAYLOAD_BYTES = 10_000;
