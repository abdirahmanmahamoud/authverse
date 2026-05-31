// Helper function to extract column names from table definition
export const extractColumnNames = (tableDef: string): string[] => {
  const columns: string[] = [];
  const lines = tableDef.split("\n");

  for (const line of lines) {
    const columnMatch = line.match(/^\s*(\w+):/);
    if (columnMatch && !line.includes("//") && !line.includes("export const")) {
      columns.push(columnMatch[1]);
    }
  }
  return columns;
};

// Helper function to extract table definition from content
export const extractTableDefinition = (
  content: string,
  tableName: string,
): string | null => {
  const tableRegex = new RegExp(
    `export const ${tableName} = pgTable\\(["']${tableName}["'][\\s\\S]*?\\n\\}\\);`,
    "m",
  );
  const match = content.match(tableRegex);
  return match ? match[0] : null;
};

// Helper function to add missing columns to table definition
export const addMissingColumnsToTable = (
  existingTableDef: string,
  templateTableDef: string,
): string => {
  const existingColumns = extractColumnNames(existingTableDef);
  const templateColumns = extractColumnNames(templateTableDef);

  const missingColumns = templateColumns.filter(
    (col) => !existingColumns.includes(col),
  );

  if (missingColumns.length === 0) {
    return existingTableDef;
  }

  // Extract column definitions from template
  const lines = templateTableDef.split("\n");
  const columnDefinitions: string[] = [];

  for (const line of lines) {
    for (const col of missingColumns) {
      if (line.trim().startsWith(`${col}:`)) {
        columnDefinitions.push(line);
        break;
      }
    }
  }

  // Insert missing columns into existing table definition
  const existingLines = existingTableDef.split("\n");
  const insertPosition = existingLines.length - 1; // Before the closing brace

  for (const colDef of columnDefinitions) {
    existingLines.splice(insertPosition, 0, `  ${colDef.trim()}`);
  }

  return existingLines.join("\n");
};
