/**
 * Strip the common leading indentation from a multi-line string.
 *
 * Finds the indentation of the first non-empty line and removes
 * that many leading whitespace characters from every line.
 *
 * @param {string} html
 * @returns {string} The dedented, trimmed string
 */
export function stripBaseIndent(html) {
  const lines = html.split("\n");

  const firstNonEmptyLine = lines.find((line) => line.trim());
  if (!firstNonEmptyLine) return "";

  const baseIndent = firstNonEmptyLine.match(/^(\s*)/)[1].length;

  return lines
    .map((line) => {
      if (line.slice(0, baseIndent).trim() === "") {
        return line.slice(baseIndent);
      }
      return line;
    })
    .join("\n")
    .trim();
}
