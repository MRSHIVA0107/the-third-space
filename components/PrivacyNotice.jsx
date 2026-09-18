import { ShieldCheck } from "lucide-react";

export function PrivacyNotice() {
  return (
    <div
      className="flex items-start gap-3 p-4 bg-forest/5 border border-forest/15 rounded-sm"
      role="note"
      aria-label="Privacy notice"
    >
      <ShieldCheck size={18} className="text-forest flex-shrink-0 mt-0.5" />
      <p className="text-xs text-ink/70 leading-relaxed">
        <strong>Privacy Assurance:</strong> Your information is collected solely for event
        coordination, communication, and attendance verification by The Third Space team.
        We respect your privacy and will never sell or publicly display your details.
      </p>
    </div>
  );
}
