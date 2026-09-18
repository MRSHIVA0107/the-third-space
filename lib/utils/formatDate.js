export function formatEventDate(dateString) {
  try {
    const date = new Date(dateString + "T00:00:00");
    return date.toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

export function formatShortDate(dateString) {
  try {
    const date = new Date(dateString + "T00:00:00");
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

export function formatRegistrationTime(isoString) {
  try {
    const date = new Date(isoString);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return isoString;
  }
}

export function getEventStatus(dateString) {
  const today = new Date().toISOString().slice(0, 10);
  if (dateString === today) return "today";
  if (dateString > today) return "upcoming";
  return "past";
}
