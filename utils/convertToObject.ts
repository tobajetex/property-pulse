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
    const result = { ...leanDocument } as Record<string, any>;

    for (const key of Object.keys(result)) {
      // Convert ObjectId and Date to strings
      if (
        result[key] &&
        typeof result[key] === "object" &&
        "toString" in result[key]
      ) {
        result[key] = result[key].toString();
      }

      // Recursively convert nested objects
      if (typeof result[key] === "object" && result[key] !== null) {
        result[key] = convertToSerializeableObject(result[key]);
      }
    }

    return result as T;
  }

  return leanDocument;
}
