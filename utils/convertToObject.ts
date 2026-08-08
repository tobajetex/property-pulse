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
    const result = {} as Record<string, unknown>;

    for (const [key, value] of Object.entries(
      leanDocument as Record<string, unknown>,
    )) {
      // Convert ObjectId, Date, and other MongoDB types to strings
      if (
        value &&
        typeof value === "object" &&
        "toString" in value &&
        typeof value.toString === "function"
      ) {
        // Special handling for ObjectId
        if (value.constructor?.name === "ObjectId") {
          result[key] = value.toString();
        } else {
          result[key] = value.toString();
        }
      }
      // Recursively convert nested objects
      else if (value && typeof value === "object" && value !== null) {
        result[key] = convertToSerializeableObject(value);
      }
      // Handle primitive values
      else {
        result[key] = value;
      }
    }

    return result as T;
  }

  return leanDocument;
}
