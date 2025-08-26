// Test simple para verificar el problema con el parseo de dates

// Simular lo que hace el frontend
const dates = ["2025-08-26", "2025-08-27", "2025-08-28", "2025-08-29", "2025-09-01", "2025-09-02", "2025-09-03", "2025-09-04", "2025-09-05", "2025-09-08"];

console.log('Original dates array:', dates);
console.log('JSON.stringify:', JSON.stringify(dates));
console.log('encodeURIComponent:', encodeURIComponent(JSON.stringify(dates)));

// Simular lo que hace la API
const encodedDates = encodeURIComponent(JSON.stringify(dates));
console.log('\n--- API Side ---');
console.log('Received encoded dates:', encodedDates);

try {
  const decodedDates = decodeURIComponent(encodedDates);
  console.log('Decoded dates:', decodedDates);
  
  const parsedDates = JSON.parse(decodedDates);
  console.log('Parsed dates:', parsedDates);
  console.log('Is array:', Array.isArray(parsedDates));
  console.log('Length:', parsedDates.length);
} catch (error) {
  console.error('Error parsing:', error.message);
}

// Test con la URL real que vimos en los logs
const urlParam = "%5B%222025-08-26%22%2C%222025-08-27%22%2C%222025-08-28%22%2C%222025-08-29%22%2C%222025-09-01%22%2C%222025-09-02%22%2C%222025-09-03%22%2C%222025-09-04%22%2C%222025-09-05%22%2C%222025-09-08%22%5D";
console.log('\n--- Real URL Param Test ---');
console.log('URL param:', urlParam);

try {
  const decodedFromUrl = decodeURIComponent(urlParam);
  console.log('Decoded from URL:', decodedFromUrl);
  
  const parsedFromUrl = JSON.parse(decodedFromUrl);
  console.log('Parsed from URL:', parsedFromUrl);
  console.log('Is array:', Array.isArray(parsedFromUrl));
} catch (error) {
  console.error('Error parsing URL param:', error.message);
}