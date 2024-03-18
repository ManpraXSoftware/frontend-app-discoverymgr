export function cleanObject(obj) {
  const cleanedObj = { ...obj };

  for (const key in cleanedObj) {
    if (Array.isArray(cleanedObj[key])) {
      // Remove the property if it's an empty array
      if (cleanedObj[key].length === 0) {
        delete cleanedObj[key];
      }
    } else if (typeof cleanedObj[key] === 'object' && cleanedObj[key] !== null) {
      // Recursively clean nested objects
      cleanedObj[key] = cleanObject(cleanedObj[key]);

      // Remove the property if it's an empty object after cleaning
      if (Object.keys(cleanedObj[key]).length === 0) {
        delete cleanedObj[key];
      }
    } else if (cleanedObj[key] === undefined || cleanedObj[key] === null || cleanedObj[key] === '') {
      // Remove properties that are undefined, null, or empty strings
      delete cleanedObj[key];
    }
  }

  return cleanedObj;
}

