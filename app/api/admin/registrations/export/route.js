import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getAllRegistrationsForExport } from "@/lib/db";
import { toCSV, toExcelXML } from "@/lib/security/csvSanitize";
import { formatRegistrationTime } from "@/lib/utils/formatDate";

export const dynamic = "force-dynamic";

export async function GET(request) {
  // 1. Authenticate admin
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const format = (searchParams.get("format") || "csv").toLowerCase().trim();

    // 2. Fetch all attendee records from database
    const data = await getAllRegistrationsForExport();

    // 3. Build data rows
    const headers = [
      "S.No",
      "Registration ID",
      "Full Name",
      "Email",
      "Phone",
      "College",
      "Year",
      "Branch",
      "Section",
      "Roll No",
      "Instagram Handle",
      "Registered At",
    ];

    const rows = (data || []).map((r, idx) => [
      idx + 1,
      r.registration_id || "",
      r.full_name || "",
      r.email || "",
      r.phone || "",
      r.college || "MLR Institute of Technology",
      r.year || "",
      r.branch || "",
      r.section || "",
      r.student_id || "",
      r.social_handle || "",
      formatRegistrationTime(r.created_at),
    ]);

    const timestamp = new Date().toISOString().slice(0, 10);

    // Format A: Excel XML Spreadsheet (.xls / .xml)
    if (format === "excel" || format === "xls" || format === "xml") {
      const xmlContent = toExcelXML(headers, rows, "UTSAAH 3.0 Attendees");
      const filename = `utsaah-3-registrations-${timestamp}.xls`;

      return new NextResponse(xmlContent, {
        status: 200,
        headers: {
          "Content-Type": "application/vnd.ms-excel; charset=utf-8",
          "Content-Disposition": `attachment; filename="${filename}"`,
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      });
    }

    // Format B: Standard CSV (.csv) with UTF-8 BOM
    const csvContent = "\uFEFF" + toCSV(headers, rows);
    const filename = `utsaah-3-registrations-${timestamp}.csv`;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error("[api/admin/registrations/export] Export error:", error);
    return NextResponse.json(
      { error: "Failed to generate registrations CSV export." },
      { status: 500 }
    );
  }
}
