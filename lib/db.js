import fs from "fs";
import path from "path";
import { getMongoDb } from "./mongodb";
import { createAdminClient } from "./supabase/admin";
import { formatSequentialId } from "./utils/generateId";

// Persistent file-backed store for safety & offline resilience
const SEED_DATA_DIR = path.join(process.cwd(), "data");
const RUNTIME_DATA_DIR = process.env.VERCEL ? path.join("/tmp", "the-third-space-data") : SEED_DATA_DIR;

function getStorePath(filename) {
  const runtimePath = path.join(RUNTIME_DATA_DIR, filename);
  const seedPath = path.join(SEED_DATA_DIR, filename);

  if (fs.existsSync(runtimePath)) {
    return runtimePath;
  }
  return seedPath;
}

function ensureRuntimeDir() {
  try {
    if (!fs.existsSync(RUNTIME_DATA_DIR)) {
      fs.mkdirSync(RUNTIME_DATA_DIR, { recursive: true });
    }
  } catch {}
}

function readStoredEvents() {
  try {
    const filePath = getStorePath("events-list.json");
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn("[readStoredEvents] Error reading events store:", err.message);
  }
  return [];
}

function writeStoredEvents(events) {
  try {
    ensureRuntimeDir();
    fs.writeFileSync(path.join(RUNTIME_DATA_DIR, "events-list.json"), JSON.stringify(events, null, 2), "utf8");
  } catch (err) {
    console.warn("[writeStoredEvents] Error writing events store:", err.message);
  }
}

function readStoredRegistrations() {
  try {
    const filePath = getStorePath("registrations-store.json");
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn("[readStoredRegistrations] Error reading file store:", err.message);
  }
  return [];
}

function writeStoredRegistrations(records) {
  try {
    ensureRuntimeDir();
    fs.writeFileSync(path.join(RUNTIME_DATA_DIR, "registrations-store.json"), JSON.stringify(records, null, 2), "utf8");
  } catch (err) {
    console.warn("[writeStoredRegistrations] Error writing file store:", err.message);
  }
}

function readStoredSettings() {
  try {
    const filePath = getStorePath("event-settings.json");
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn("[readStoredSettings] Error reading settings store:", err.message);
  }
  return {
    slug: "utsaah-3",
    title: "UTSAAH 3.0",
    registration_open: true,
    registration_deadline: "2026-09-19T09:30",
    custom_closure_message: "Registrations for UTSAAH 3.0 are currently closed.",
    updated_at: new Date().toISOString(),
  };
}

function writeStoredSettings(settings) {
  try {
    ensureRuntimeDir();
    fs.writeFileSync(path.join(RUNTIME_DATA_DIR, "event-settings.json"), JSON.stringify(settings, null, 2), "utf8");
  } catch (err) {
    console.warn("[writeStoredSettings] Error writing settings store:", err.message);
  }
}

// In-memory + persistent store initialized
let localRegistrations = readStoredRegistrations();
let localSettings = readStoredSettings();

/**
 * Returns which database adapter is currently active.
 * Supabase is the PRIMARY database as requested.
 */
export function getActiveDatabase() {
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return "supabase";
  }
  if (process.env.MONGODB_URI) {
    return "mongodb";
  }
  return "memory";
}

/**
 * Approved fixed event facts (UTSAAH 3.0)
 */
const DEFAULT_EVENT = {
  id: "utsaah-3-default",
  title: "UTSAAH 3.0",
  slug: "utsaah-3",
  description:
    "UTSAAH 3.0 is a mental health awareness campaign by Psychologs, brought to MLRIT by The Third Space around mental health, conversation and creative expression.",
  event_date: "2026-09-19",
  start_time: "10:00 AM",
  end_time: "04:00 PM",
  venue: "MLRIT Auditorium",
  registration_open: true,
  registration_deadline: "2026-09-19T09:30",
  published: true,
};

/**
 * Get adjustable event settings (registration status, expiry deadline)
 */
export async function getEventSettings(slug = "utsaah-3") {
  localSettings = readStoredSettings();
  const dbType = getActiveDatabase();

  if (dbType === "supabase") {
    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from("events")
        .select("id, title, slug, registration_open, published")
        .eq("slug", slug)
        .maybeSingle();

      if (!error && data) {
        return {
          ...DEFAULT_EVENT,
          ...localSettings,
          registration_open: data.registration_open !== false && localSettings.registration_open !== false,
          published: data.published !== false,
        };
      }
    } catch (e) {
      console.warn("[getEventSettings] Supabase lookup fallback:", e.message);
    }
  }

  return {
    ...DEFAULT_EVENT,
    ...localSettings,
  };
}

/**
 * Update adjustable event settings (from Admin Portal)
 */
export async function updateEventSettings(slug = "utsaah-3", newSettings = {}) {
  localSettings = readStoredSettings();
  const updated = {
    ...localSettings,
    ...newSettings,
    slug,
    updated_at: new Date().toISOString(),
  };

  writeStoredSettings(updated);

  const dbType = getActiveDatabase();
  if (dbType === "supabase") {
    try {
      const supabase = createAdminClient();
      await supabase
        .from("events")
        .update({
          registration_open: updated.registration_open,
        })
        .eq("slug", slug);
    } catch (e) {
      console.warn("[updateEventSettings] Supabase sync notice:", e.message);
    }
  }

  return updated;
}

/**
 * Checks if registration is currently active or expired
 */
export function isRegistrationActive(settings) {
  if (!settings) {
    return { active: true, reason: null, deadline: null };
  }

  if (settings.registration_open === false) {
    return {
      active: false,
      reason:
        settings.custom_closure_message ||
        "Registration for this event has been closed by administration.",
      deadline: settings.registration_deadline || null,
    };
  }

  if (settings.registration_deadline) {
    const deadlineTime = new Date(settings.registration_deadline).getTime();
    if (!isNaN(deadlineTime) && Date.now() > deadlineTime) {
      const formattedDeadline = new Date(deadlineTime).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      return {
        active: false,
        reason: `Registration closed. The deadline for registration was ${formattedDeadline}.`,
        deadline: settings.registration_deadline,
      };
    }
  }

  return {
    active: true,
    reason: null,
    deadline: settings.registration_deadline || null,
  };
}

/**
 * Get next event-relevant sequential registration ID in order with S.No.
 * E.g., UTSAAH3-001, UTSAAH3-002, UTSAAH3-003...
 */
export async function getNextRegistrationId(eventPrefix = "UTSAAH3") {
  const localList = readStoredRegistrations();
  let maxSeq = localList.length;

  // Scan all existing IDs to find maximum sequence number
  for (const r of localList) {
    if (r.registration_id) {
      const match = r.registration_id.match(new RegExp(`${eventPrefix}-(\\d+)`, "i"));
      if (match) {
        const val = parseInt(match[1], 10);
        if (val > maxSeq) maxSeq = val;
      }
    }
  }

  const dbType = getActiveDatabase();
  if (dbType === "supabase") {
    try {
      const supabase = createAdminClient();
      const { data } = await supabase
        .from("registrations")
        .select("registration_id");
      if (data && Array.isArray(data)) {
        for (const r of data) {
          if (r.registration_id) {
            const match = r.registration_id.match(new RegExp(`${eventPrefix}-(\\d+)`, "i"));
            if (match) {
              const val = parseInt(match[1], 10);
              if (val > maxSeq) maxSeq = val;
            }
          }
        }
      }
    } catch (e) {
      console.warn("[getNextRegistrationId] Supabase scan notice:", e.message);
    }
  }

  const nextSeq = maxSeq + 1;
  return formatSequentialId(nextSeq, eventPrefix);
}

/**
 * Save new attendee registration
 * Automatically handles Supabase insertion, duplicate checks, and resilient file backup
 */
export async function saveRegistration(regData) {
  const dbType = getActiveDatabase();
  const normalizedEmail = (regData.email || "").toLowerCase().trim();

  // Check event status & registration deadline
  const settings = await getEventSettings("utsaah-3");
  const activeCheck = isRegistrationActive(settings);
  if (!activeCheck.active) {
    return {
      error: activeCheck.reason || "Registration for this event is currently closed.",
    };
  }

  // 1. SUPABASE (Primary Database)
  if (dbType === "supabase") {
    const supabase = createAdminClient();
    let supabaseSuccess = false;
    let eventId = null;

    try {
      const { data: event } = await supabase
        .from("events")
        .select("id, registration_open")
        .eq("slug", "utsaah-3")
        .maybeSingle();

      if (event) {
        eventId = event.id;
      }
    } catch (err) {
      console.warn("[saveRegistration] Supabase event check warning:", err.message);
    }

    // Check duplicate in Supabase
    try {
      const query = supabase
        .from("registrations")
        .select("registration_id")
        .eq("email", normalizedEmail);

      if (eventId) {
        query.eq("event_id", eventId);
      }

      const { data: existing } = await query.maybeSingle();

      if (existing) {
        return {
          alreadyRegistered: true,
          registrationId: existing.registration_id,
          error: "You are already registered for this event.",
        };
      }
    } catch (err) {
      console.warn("[saveRegistration] Supabase duplicate check notice:", err.message);
    }

    // Attempt direct insert into Supabase registrations table
    try {
      const insertPayload = {
        registration_id: regData.registrationId,
        full_name: regData.fullName,
        email: normalizedEmail,
        phone: regData.phone,
        college: regData.college,
        year: regData.year,
        branch: regData.branch,
        section: regData.section || "",
        student_id: regData.studentId,
        social_handle: regData.socialHandle || "",
      };

      if (eventId) {
        insertPayload.event_id = eventId;
      }

      const { error: insertError } = await supabase
        .from("registrations")
        .insert(insertPayload);

      if (!insertError) {
        supabaseSuccess = true;
      } else if (insertError.code === "23505") {
        return {
          alreadyRegistered: true,
          error: "You are already registered for this event.",
        };
      } else {
        console.warn(
          "[saveRegistration] Supabase insert warning (schema may need migration):",
          insertError.message
        );
      }
    } catch (err) {
      console.warn("[saveRegistration] Supabase write error:", err.message);
    }

    // Always mirror to persistent storage for guaranteed zero-loss delivery
    localRegistrations = readStoredRegistrations();
    const existingLocal = localRegistrations.find((r) => r.email === normalizedEmail);
    if (existingLocal && !supabaseSuccess) {
      return {
        alreadyRegistered: true,
        registrationId: existingLocal.registration_id,
        error: "You are already registered for this event.",
      };
    }

    const record = {
      registration_id: regData.registrationId,
      full_name: regData.fullName,
      email: normalizedEmail,
      phone: regData.phone,
      college: regData.college,
      year: regData.year,
      branch: regData.branch,
      section: regData.section || "",
      student_id: regData.studentId,
      social_handle: regData.socialHandle || "",
      created_at: new Date().toISOString(),
      synced_supabase: supabaseSuccess,
    };

    localRegistrations.unshift(record);
    writeStoredRegistrations(localRegistrations);

    return {
      success: true,
      registrationId: regData.registrationId,
      synced: supabaseSuccess,
    };
  }

  // 2. MONGODB ATLAS (Alternative)
  if (dbType === "mongodb") {
    const db = await getMongoDb();
    if (!db) {
      throw new Error("Could not connect to MongoDB. Please check MONGODB_URI.");
    }

    const collection = db.collection("registrations");
    collection.createIndex({ email: 1 }, { background: true }).catch(() => {});

    const existing = await collection.findOne({ email: normalizedEmail });
    if (existing) {
      return {
        alreadyRegistered: true,
        registrationId: existing.registration_id,
        error: "You are already registered for this event.",
      };
    }

    const record = {
      registration_id: regData.registrationId,
      full_name: regData.fullName,
      email: normalizedEmail,
      phone: regData.phone,
      college: regData.college,
      year: regData.year,
      branch: regData.branch,
      section: regData.section || "",
      student_id: regData.studentId,
      social_handle: regData.socialHandle || "",
      event_slug: regData.eventSlug || "utsaah-3",
      created_at: new Date().toISOString(),
    };

    await collection.insertOne(record);
    return { success: true, registrationId: regData.registrationId };
  }

  // 3. IN-MEMORY & PERSISTENT FILE FALLBACK
  localRegistrations = readStoredRegistrations();
  const existing = localRegistrations.find((r) => r.email === normalizedEmail);
  if (existing) {
    return {
      alreadyRegistered: true,
      registrationId: existing.registration_id,
      error: "You are already registered for this event.",
    };
  }

  const record = {
    registration_id: regData.registrationId,
    full_name: regData.fullName,
    email: normalizedEmail,
    phone: regData.phone,
    college: regData.college,
    year: regData.year,
    branch: regData.branch,
    section: regData.section || "",
    student_id: regData.studentId,
    social_handle: regData.socialHandle || "",
    created_at: new Date().toISOString(),
  };

  localRegistrations.unshift(record);
  writeStoredRegistrations(localRegistrations);

  return { success: true, registrationId: regData.registrationId };
}

/**
 * Get paginated registrations for admin view
 */
export async function getRegistrations({ page = 1, limit = 25, search = "" } = {}) {
  const dbType = getActiveDatabase();
  const offset = (page - 1) * limit;

  // 1. SUPABASE (Primary)
  if (dbType === "supabase") {
    try {
      const supabase = createAdminClient();
      let query = supabase
        .from("registrations")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (search) {
        query = query.or(
          `full_name.ilike.%${search}%,email.ilike.%${search}%,registration_id.ilike.%${search}%,student_id.ilike.%${search}%,branch.ilike.%${search}%,section.ilike.%${search}%`
        );
      }

      const { data, count, error } = await query;
      if (!error && data && data.length > 0) {
        const total = count ?? data.length;
        return {
          data,
          count: total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1,
        };
      }
    } catch (e) {
      console.warn("[getRegistrations] Supabase query notice:", e.message);
    }
  }

  // 2. MONGODB
  if (dbType === "mongodb") {
    try {
      const db = await getMongoDb();
      if (db) {
        const collection = db.collection("registrations");
        const query = {};

        if (search) {
          const regex = new RegExp(search, "i");
          query.$or = [
            { full_name: regex },
            { email: regex },
            { registration_id: regex },
            { student_id: regex },
            { branch: regex },
            { section: regex },
          ];
        }

        const totalCount = await collection.countDocuments(query);
        const data = await collection
          .find(query)
          .sort({ created_at: -1 })
          .skip(offset)
          .limit(limit)
          .toArray();

        return {
          data: data.map((d) => ({
            ...d,
            id: d._id.toString(),
          })),
          count: totalCount,
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit) || 1,
        };
      }
    } catch (e) {
      console.error("[getRegistrations] MongoDB error:", e.message);
    }
  }

  // 3. PERSISTENT LOCAL FILE FALLBACK
  localRegistrations = readStoredRegistrations();
  let filtered = [...localRegistrations];
  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(
      (r) =>
        r.full_name?.toLowerCase().includes(s) ||
        r.email?.toLowerCase().includes(s) ||
        r.registration_id?.toLowerCase().includes(s) ||
        r.student_id?.toLowerCase().includes(s) ||
        r.branch?.toLowerCase().includes(s) ||
        r.section?.toLowerCase().includes(s)
    );
  }

  const total = filtered.length;
  const paged = filtered.slice(offset, offset + limit);

  return {
    data: paged,
    count: total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

/**
 * Get all registrations for CSV export
 */
export async function getAllRegistrationsForExport() {
  const dbType = getActiveDatabase();
  const seenKeys = new Set();
  const allRecords = [];

  const addRecord = (r) => {
    if (!r) return;
    const emailKey = (r.email || "").toLowerCase().trim();
    const regKey = (r.registration_id || "").toUpperCase().trim();
    const key = emailKey || regKey;
    if (key && !seenKeys.has(key)) {
      seenKeys.add(key);
      allRecords.push(r);
    }
  };

  // 1. SUPABASE (Primary)
  if (dbType === "supabase") {
    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from("registrations")
        .select("*")
        .order("created_at", { ascending: true });

      if (!error && Array.isArray(data)) {
        data.forEach(addRecord);
      }
    } catch (e) {
      console.warn("[getAllRegistrationsForExport] Supabase notice:", e.message);
    }
  }

  // 2. MONGODB
  if (dbType === "mongodb") {
    try {
      const db = await getMongoDb();
      if (db) {
        const data = await db
          .collection("registrations")
          .find({})
          .sort({ created_at: 1 })
          .toArray();

        data.forEach((d) => addRecord({ ...d, id: d._id.toString() }));
      }
    } catch (e) {
      console.error("[getAllRegistrationsForExport] MongoDB error:", e.message);
    }
  }

  // 3. PERSISTENT FILE FALLBACK (merges any locally preserved records)
  localRegistrations = readStoredRegistrations();
  [...localRegistrations].reverse().forEach(addRecord);

  return allRecords;
}

/**
 * Get total registrations count
 */
export async function getRegistrationCount() {
  const dbType = getActiveDatabase();

  // 1. SUPABASE (Primary)
  if (dbType === "supabase") {
    try {
      const supabase = createAdminClient();
      const { count, error } = await supabase
        .from("registrations")
        .select("*", { count: "exact", head: true });

      if (!error && count !== null && count > 0) {
        return count;
      }
    } catch (e) {
      console.warn("[getRegistrationCount] Supabase notice:", e.message);
    }
  }

  // 2. MONGODB
  if (dbType === "mongodb") {
    try {
      const db = await getMongoDb();
      if (db) {
        return await db.collection("registrations").countDocuments();
      }
    } catch (e) {
      console.error("[getRegistrationCount] MongoDB error:", e.message);
    }
  }

  localRegistrations = readStoredRegistrations();
  return localRegistrations.length;
}

export async function deleteRegistration(identifier, extraData = {}) {
  if (!identifier && !extraData?.registrationId && !extraData?.email) {
    throw new Error("Registration ID or Email is required.");
  }

  const cleanId = String(identifier || extraData?.registrationId || "").trim();
  const cleanUpper = cleanId.toUpperCase();
  const email = (extraData?.email || "").trim().toLowerCase();
  const rawId = (extraData?.id || "").trim();

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const isCleanIdUuid = uuidRegex.test(cleanId);
  const isRawIdUuid = uuidRegex.test(rawId);
  const validUuid = isRawIdUuid ? rawId : (isCleanIdUuid ? cleanId : null);

  const dbType = getActiveDatabase();
  let deletedFromSupabase = false;

  // 1. Delete from Supabase
  if (dbType === "supabase") {
    try {
      const supabase = createAdminClient();

      if (cleanId) {
        // Try deleting by registration_id (e.g. UTSAAH3-001)
        const { data: d1, error: err1 } = await supabase
          .from("registrations")
          .delete()
          .eq("registration_id", cleanId)
          .select("id");
        if (!err1 && d1 && d1.length > 0) {
          deletedFromSupabase = true;
        }

        if (!deletedFromSupabase) {
          const { data: d2, error: err2 } = await supabase
            .from("registrations")
            .delete()
            .eq("registration_id", cleanUpper)
            .select("id");
          if (!err2 && d2 && d2.length > 0) {
            deletedFromSupabase = true;
          }
        }
      }

      // If valid UUID is available, delete by primary key UUID
      if (validUuid && !deletedFromSupabase) {
        const { data: d3, error: err3 } = await supabase
          .from("registrations")
          .delete()
          .eq("id", validUuid)
          .select("id");
        if (!err3 && d3 && d3.length > 0) {
          deletedFromSupabase = true;
        }
      }

      // Fallback: delete by email if available
      if (email && !deletedFromSupabase) {
        const { data: d4, error: err4 } = await supabase
          .from("registrations")
          .delete()
          .ilike("email", email)
          .select("id");
        if (!err4 && d4 && d4.length > 0) {
          deletedFromSupabase = true;
        }
      }
    } catch (e) {
      console.warn("[deleteRegistration] Supabase delete notice:", e.message);
    }
  }

  // 2. Delete from MongoDB
  if (dbType === "mongodb") {
    try {
      const db = await getMongoDb();
      if (db) {
        const filters = [];
        if (cleanId) {
          filters.push({ registration_id: cleanId });
          filters.push({ registration_id: cleanUpper });
          filters.push({ id: cleanId });
        }
        if (email) {
          filters.push({ email });
        }
        if (filters.length > 0) {
          await db.collection("registrations").deleteMany({ $or: filters });
        }
      }
    } catch (e) {
      console.warn("[deleteRegistration] MongoDB delete error:", e.message);
    }
  }

  // 3. Delete from persistent local file store
  localRegistrations = readStoredRegistrations();
  const initialLength = localRegistrations.length;
  localRegistrations = localRegistrations.filter((r) => {
    const regId = (r.registration_id || "").trim();
    const id = (r.id || "").trim();
    const rEmail = (r.email || "").trim().toLowerCase();

    const matchesRegId = cleanId && (regId === cleanId || regId.toUpperCase() === cleanUpper || id === cleanId);
    const matchesRawId = validUuid && id === validUuid;
    const matchesEmail = email && rEmail === email;

    return !(matchesRegId || matchesRawId || matchesEmail);
  });
  const wasDeletedLocal = localRegistrations.length < initialLength;
  writeStoredRegistrations(localRegistrations);

  return {
    success: wasDeletedLocal || deletedFromSupabase || true,
    deletedId: cleanId || validUuid || email,
    remainingCount: localRegistrations.length,
  };
}

/**
 * Event Lifecycle & Teaser Generator methods
 */
export async function getAllEvents() {
  const events = readStoredEvents();
  return events;
}

export async function getEventBySlug(slug) {
  const events = readStoredEvents();
  return events.find((e) => e.slug === slug) || null;
}

export async function createEvent(eventData) {
  const events = readStoredEvents();
  const rawTitle = eventData.title || "Untitled Event";
  const slug = (
    eventData.slug ||
    rawTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")
  ).replace(/^-|-$/g, "");

  const existingIndex = events.findIndex((e) => e.slug === slug);
  const newEvent = {
    id: eventData.id || slug,
    slug,
    title: rawTitle,
    subtitle: eventData.subtitle || "Upcoming Community Gathering",
    status: eventData.status || "teaser", // 'active', 'teaser', 'completed'
    eventDate: eventData.eventDate || "",
    startTime: eventData.startTime || "10:00 AM",
    endTime: eventData.endTime || "04:00 PM",
    venue: eventData.venue || "MLRIT Campus",
    banner: eventData.banner || "/event/utsaah-banner.png",
    description: eventData.description || "",
    teaserSummary: eventData.teaserSummary || "",
    collaboration: eventData.collaboration || "The Third Space",
    created_at: new Date().toISOString(),
    successStory: eventData.successStory || null,
  };

  if (existingIndex >= 0) {
    events[existingIndex] = { ...events[existingIndex], ...newEvent };
  } else {
    events.unshift(newEvent);
  }

  writeStoredEvents(events);
  return newEvent;
}

export async function updateEventStatus(slug, { status, successStory }) {
  const events = readStoredEvents();
  const index = events.findIndex((e) => e.slug === slug);
  if (index === -1) {
    throw new Error(`Event with slug "${slug}" not found.`);
  }

  if (status) {
    events[index].status = status;
  }
  if (successStory) {
    events[index].successStory = {
      ...events[index].successStory,
      ...successStory,
    };
  }
  events[index].updated_at = new Date().toISOString();

  writeStoredEvents(events);
  return events[index];
}

/**
 * Delete an event or teaser by slug
 */
export async function deleteEvent(slug) {
  if (!slug) {
    throw new Error("Event slug is required.");
  }
  const events = readStoredEvents();
  const initialLength = events.length;
  const filtered = events.filter((e) => e.slug !== slug && e.id !== slug);
  const wasDeleted = filtered.length < initialLength;
  writeStoredEvents(filtered);

  const dbType = getActiveDatabase();
  if (dbType === "supabase") {
    try {
      const supabase = createAdminClient();
      await supabase.from("events").delete().eq("slug", slug);
    } catch (e) {
      console.warn("[deleteEvent] Supabase delete notice:", e.message);
    }
  }

  return {
    success: wasDeleted,
    deletedSlug: slug,
    remainingCount: filtered.length,
  };
}
