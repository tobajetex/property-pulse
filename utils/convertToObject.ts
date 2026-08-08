/**
 * Converts MongoDB documents to plain JavaScript objects
 * Required for passing data from server to client components
 */
export function convertToSerializeableObject<T>(leanDocument: T): T {
  if (!leanDocument) return leanDocument;

  // Handle arrays
  if (Array.isArray(leanDocument)) {
    return leanDocument.map((item) =>
      convertToSerializeableObject(item),
    ) as unknown as T;
  }

  // Handle objects
  if (typeof leanDocument === "object" && leanDocument !== null) {
    // Use Record<string, unknown> instead of any
    const result = { ...leanDocument } as Record<string, unknown>;

    for (const key of Object.keys(result)) {
      const value = result[key];

      // Convert ObjectId and Date to strings
      if (
        value &&
        typeof value === "object" &&
        "toString" in value &&
        typeof value.toString === "function"
      ) {
        result[key] = value.toString();
      }

      // Recursively convert nested objects
      if (value && typeof value === "object" && value !== null) {
        result[key] = convertToSerializeableObject(value);
      }
    }

    return result as T;
  }

  return leanDocument;
}
