// Test específico con las fechas que están causando el error
const dates = [
  "2025-08-26",
  "2025-08-27", 
  "2025-08-28",
  "2025-08-29",
  "2025-09-01",
  "2025-09-02",
  "2025-09-03",
  "2025-09-04",
  "2025-09-05",
  "2025-09-08"
];

console.log('🔍 Testing specific dates that are causing the error');
console.log('Original dates array:', dates);
console.log('Array length:', dates.length);
console.log('Array type:', typeof dates);
console.log('Is array:', Array.isArray(dates));

// Simular el proceso del frontend
const encodedDates = encodeURIComponent(JSON.stringify(dates));
console.log('\n📤 Frontend encoding:');
console.log('JSON.stringify result:', JSON.stringify(dates));
console.log('encodeURIComponent result:', encodedDates);
console.log('Encoded length:', encodedDates.length);

// Simular el proceso de la API
console.log('\n📥 API decoding:');
try {
  const decodedDates = decodeURIComponent(encodedDates);
  console.log('decodeURIComponent result:', decodedDates);
  console.log('Decoded type:', typeof decodedDates);
  
  const parsedDates = JSON.parse(decodedDates);
  console.log('JSON.parse result:', parsedDates);
  console.log('Parsed type:', typeof parsedDates);
  console.log('Is parsed array:', Array.isArray(parsedDates));
  console.log('Parsed length:', parsedDates.length);
  
  // Verificar cada fecha
  console.log('\n🔍 Checking each date:');
  parsedDates.forEach((date, index) => {
    console.log(`Date ${index}: "${date}" (type: ${typeof date})`);
    
    // Verificar formato de fecha
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const isValidFormat = dateRegex.test(date);
    console.log(`  Valid format: ${isValidFormat}`);
    
    // Verificar si es una fecha válida
    const dateObj = new Date(date);
    const isValidDate = !isNaN(dateObj.getTime());
    console.log(`  Valid date: ${isValidDate}`);
    
    if (!isValidFormat || !isValidDate) {
      console.error(`❌ Invalid date found: "${date}"`);
    }
  });
  
  console.log('\n✅ All dates processed successfully');
  
} catch (error) {
  console.error('❌ Error during parsing:', error);
  console.error('Error message:', error.message);
  console.error('Error stack:', error.stack);
}

// Test con URL real
console.log('\n🌐 Testing with real URL parameter:');
const realUrlParam = '%5B%222025-08-26%22%2C%222025-08-27%22%2C%222025-08-28%22%2C%222025-08-29%22%2C%222025-09-01%22%2C%222025-09-02%22%2C%222025-09-03%22%2C%222025-09-04%22%2C%222025-09-05%22%2C%222025-09-08%22%5D';
console.log('Real URL param:', realUrlParam);

try {
  const decodedReal = decodeURIComponent(realUrlParam);
  console.log('Decoded real:', decodedReal);
  
  const parsedReal = JSON.parse(decodedReal);
  console.log('Parsed real:', parsedReal);
  console.log('Real parsed length:', parsedReal.length);
  
  console.log('✅ Real URL parameter processed successfully');
} catch (error) {
  console.error('❌ Error with real URL parameter:', error);
}