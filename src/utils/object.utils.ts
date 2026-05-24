export function isObjectEmpty(value: unknown) {
  // First, check if it's not null and is an object
  if (value == null || typeof value !== 'object') {
    return false // It's not an object, so it can't be an empty object
  }

  // Check if it's an array
  if (Array.isArray(value)) {
    return false // It's an array, not an object
  }

  // Now we know it's an object, check if it's empty
  return Object.keys(value).length === 0
}
