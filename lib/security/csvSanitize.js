export function sanitizeCSVField(value) {
  if (value === null || value === undefined) return "";
  const stringValue = String(value);

  // Formula injection defense: prefix dangerous leading characters with single quote
  const dangerousChars = ["=", "+", "-", "@", "\t", "\r"];
  let safeValue = stringValue;
  if (dangerousChars.some((char) => safeValue.startsWith(char))) {
    safeValue = `'${safeValue}`;
  }

  // Escape internal double quotes and wrap in quotes
  return `"${safeValue.replace(/"/g, '""')}"`;
}

export function toCSV(headers, rows) {
  const headerLine = headers.map(sanitizeCSVField).join(",");
  const rowLines = rows.map((row) => row.map(sanitizeCSVField).join(","));
  return [headerLine, ...rowLines].join("\r\n");
}

function escapeXML(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function toExcelXML(headers, rows, sheetName = "Attendee Roster") {
  const headerCells = headers
    .map(
      (h) =>
        `<Cell ss:StyleID="Header"><Data ss:Type="String">${escapeXML(h)}</Data></Cell>`
    )
    .join("");

  const rowLines = rows
    .map((row) => {
      const cells = row
        .map((val, idx) => {
          const isNumber = idx === 0 && typeof val === "number";
          const type = isNumber ? "Number" : "String";
          return `<Cell ss:StyleID="DataCell"><Data ss:Type="${type}">${escapeXML(val)}</Data></Cell>`;
        })
        .join("");
      return `<Row ss:Height="20">${cells}</Row>`;
    })
    .join("\n   ");

  return `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center"/>
   <Font ss:FontName="Segoe UI" ss:Size="10"/>
  </Style>
  <Style ss:ID="Header">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#2D5A27"/>
   </Borders>
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#2D5A27" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="DataCell">
   <Alignment ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2DCD5"/>
   </Borders>
   <Font ss:FontName="Segoe UI" ss:Size="10"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="${escapeXML(sheetName)}">
  <Table ss:DefaultRowHeight="20">
   <Row ss:Height="24">
    ${headerCells}
   </Row>
   ${rowLines}
  </Table>
 </Worksheet>
</Workbook>`;
}
