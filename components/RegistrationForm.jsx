"use client";

import { useState } from "react";
import { validateRegistration } from "@/lib/validation/registration";
import { SuccessState } from "./SuccessState";
import { PrivacyNotice } from "./PrivacyNotice";
import { Loader2, AlertCircle, Clock, Ban } from "lucide-react";

export function RegistrationForm({ eventSettings }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    college: "MLR Institute of Technology",
    year: "1st Year",
    branch: "",
    section: "A",
    studentId: "",
    socialHandle: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successData, setSuccessData] = useState(null);

  // Check whether registration is currently closed or past deadline
  const isRegistrationClosed = () => {
    if (!eventSettings) return false;
    if (eventSettings.registration_open === false) return true;
    if (eventSettings.registration_deadline) {
      const deadline = new Date(eventSettings.registration_deadline).getTime();
      if (!isNaN(deadline) && Date.now() > deadline) return true;
    }
    return false;
  };

  const closed = isRegistrationClosed();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (closed) {
      setErrorMessage("Registration for this event is currently closed.");
      return;
    }

    setErrorMessage("");

    // Client-side pure JS validation
    const validation = validateRegistration(formData);
    if (!validation.isValid) {
      setErrorMessage(validation.error);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 409 && result.registrationId) {
          setErrorMessage(
            `You are already registered! Your Registration ID is: ${result.registrationId}`
          );
        } else {
          setErrorMessage(result.error || "Registration failed. Please try again.");
        }
        setLoading(false);
        return;
      }

      // Success with event-relevant sequential ID
      setSuccessData({
        registrationId: result.registrationId,
        fullName: formData.fullName,
      });
    } catch {
      setErrorMessage(
        "Network connection error. Please check your internet and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (successData) {
    return (
      <SuccessState
        registrationId={successData.registrationId}
        fullName={successData.fullName}
      />
    );
  }

  return (
    <div className="bg-cream-100 border border-sand rounded-sm p-6 sm:p-10 shadow-sm">
      {/* If registration has expired or closed by admin */}
      {closed && (
        <div className="mb-6 p-5 bg-maroon/10 border-2 border-maroon/30 rounded-sm text-maroon space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm uppercase tracking-wider">
            <Ban size={18} />
            <span>Registrations Closed</span>
          </div>
          <p className="text-xs leading-relaxed">
            {eventSettings?.custom_closure_message ||
              "Registrations for UTSAAH 3.0 have concluded as the deadline has passed. Thank you for your interest!"}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Error notification banner */}
        {errorMessage && (
          <div
            className="p-4 bg-maroon/10 border border-maroon/25 text-maroon rounded-sm flex items-start gap-3"
            role="alert"
          >
            <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
            <p className="text-sm">{errorMessage}</p>
          </div>
        )}

        {/* Full Name */}
        <div>
          <label
            htmlFor="fullName"
            className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5"
          >
            Full Name <span className="text-maroon">*</span>
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            disabled={closed}
            value={formData.fullName}
            onChange={handleChange}
            placeholder="e.g. Aanya Sharma"
            className="w-full px-4 py-3 bg-cream border border-sand rounded-sm text-ink text-sm focus:outline-none focus:ring-2 focus:ring-forest disabled:opacity-50"
          />
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5"
            >
              Email Address <span className="text-maroon">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              disabled={closed}
              value={formData.email}
              onChange={handleChange}
              placeholder="you@mlrit.ac.in"
              className="w-full px-4 py-3 bg-cream border border-sand rounded-sm text-ink text-sm focus:outline-none focus:ring-2 focus:ring-forest disabled:opacity-50"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5"
            >
              Phone Number <span className="text-maroon">*</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              disabled={closed}
              value={formData.phone}
              onChange={handleChange}
              placeholder="10-digit mobile number"
              className="w-full px-4 py-3 bg-cream border border-sand rounded-sm text-ink text-sm focus:outline-none focus:ring-2 focus:ring-forest disabled:opacity-50"
            />
          </div>
        </div>

        {/* Divided Academic Fields: Year, Branch & Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {/* Year */}
          <div>
            <label
              htmlFor="year"
              className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5"
            >
              Year of Study <span className="text-maroon">*</span>
            </label>
            <select
              id="year"
              name="year"
              disabled={closed}
              value={formData.year}
              onChange={handleChange}
              className="w-full px-3 py-3 bg-cream border border-sand rounded-sm text-ink text-sm focus:outline-none focus:ring-2 focus:ring-forest disabled:opacity-50"
            >
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
          </div>

          {/* Branch */}
          <div>
            <label
              htmlFor="branch"
              className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5"
            >
              Branch / Dept <span className="text-maroon">*</span>
            </label>
            <input
              id="branch"
              name="branch"
              type="text"
              required
              disabled={closed}
              value={formData.branch}
              onChange={handleChange}
              placeholder="e.g. CSE, CSM, ECE"
              className="w-full px-3 py-3 bg-cream border border-sand rounded-sm text-ink text-sm focus:outline-none focus:ring-2 focus:ring-forest uppercase disabled:opacity-50"
            />
          </div>

          {/* Section */}
          <div>
            <label
              htmlFor="section"
              className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5"
            >
              Section <span className="text-maroon">*</span>
            </label>
            <input
              id="section"
              name="section"
              type="text"
              required
              disabled={closed}
              value={formData.section}
              onChange={handleChange}
              placeholder="e.g. A, B, C"
              className="w-full px-3 py-3 bg-cream border border-sand rounded-sm text-ink text-sm focus:outline-none focus:ring-2 focus:ring-forest uppercase disabled:opacity-50 font-semibold"
            />
          </div>
        </div>

        {/* College & Roll No / Student ID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="college"
              className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5"
            >
              College / Institution <span className="text-maroon">*</span>
            </label>
            <input
              id="college"
              name="college"
              type="text"
              required
              disabled={closed}
              value={formData.college}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-cream border border-sand rounded-sm text-ink text-sm focus:outline-none focus:ring-2 focus:ring-forest disabled:opacity-50"
            />
          </div>

          <div>
            <label
              htmlFor="studentId"
              className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5"
            >
              Roll No / Student ID <span className="text-maroon">*</span>
            </label>
            <input
              id="studentId"
              name="studentId"
              type="text"
              required
              disabled={closed}
              value={formData.studentId}
              onChange={handleChange}
              placeholder="e.g. 24R21A05XX"
              className="w-full px-4 py-3 bg-cream border border-sand rounded-sm text-ink text-sm focus:outline-none focus:ring-2 focus:ring-forest uppercase disabled:opacity-50 font-mono"
            />
          </div>
        </div>

        {/* Instagram / Social handle */}
        <div>
          <label
            htmlFor="socialHandle"
            className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5"
          >
            Instagram Handle <span className="text-muted text-[10px] lowercase">(optional)</span>
          </label>
          <input
            id="socialHandle"
            name="socialHandle"
            type="text"
            disabled={closed}
            value={formData.socialHandle}
            onChange={handleChange}
            placeholder="@yourhandle"
            className="w-full px-4 py-3 bg-cream border border-sand rounded-sm text-ink text-sm focus:outline-none focus:ring-2 focus:ring-forest disabled:opacity-50"
          />
        </div>

        {/* Privacy Note */}
        <PrivacyNotice />

        {/* Submit button */}
        <div>
          <button
            type="submit"
            disabled={loading || closed}
            className="w-full py-4 bg-forest text-cream font-bold text-sm tracking-widest uppercase rounded-sm hover:bg-forest/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Generating Your Event ID...</span>
              </>
            ) : closed ? (
              <span>Registration Closed</span>
            ) : (
              <span>Complete Registration</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
