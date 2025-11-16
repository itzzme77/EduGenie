const https = require('https');

const GEMINI_API_KEY = 'AIzaSyDgZZwyhNJY1O8IhHvzMLJvWH8rQVmATeY';

console.log('\n🔍 Testing Gemini API Key...\n');
console.log('API Key:', GEMINI_API_KEY.substring(0, 20) + '...\n');

// Test listing models
const listModelsUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`;

https.get(listModelsUrl, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      
      if (result.error) {
        console.log('❌ ERROR:', result.error.message);
        console.log('Status:', result.error.status);
        console.log('\nFull error:', JSON.stringify(result.error, null, 2));
      } else if (result.models) {
        console.log('✅ API Key is valid!\n');
        console.log(`📋 Found ${result.models.length} models:\n`);
        
        result.models.forEach((model, index) => {
          console.log(`${index + 1}. ${model.name}`);
          console.log(`   Display Name: ${model.displayName}`);
          console.log(`   Description: ${model.description || 'N/A'}`);
          console.log(`   Supported Methods: ${model.supportedGenerationMethods?.join(', ') || 'N/A'}`);
          console.log('');
        });

        console.log('\n🎯 RECOMMENDED MODELS FOR CHAT:');
        const chatModels = result.models.filter(m => 
          m.supportedGenerationMethods?.includes('generateContent')
        );
        chatModels.forEach(model => {
          console.log(`   - ${model.name}`);
        });

        console.log('\n💡 TIP: Use one of these model names in your geminiApi.js file');
      } else {
        console.log('⚠️ Unexpected response:', data);
      }
    } catch (error) {
      console.log('❌ Failed to parse response:', error.message);
      console.log('Raw response:', data);
    }
  });

}).on('error', (error) => {
  console.log('❌ Request failed:', error.message);
});

// Also test a simple generation request with gemini-pro
console.log('-----------------------------------');
console.log('Testing gemini-pro model...\n');

const testUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;
const postData = JSON.stringify({
  contents: [{
    parts: [{
      text: 'Say hello in one word'
    }]
  }]
});

const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': postData.length
  }
};

const url = new URL(testUrl);
const req = https.request({
  hostname: url.hostname,
  path: url.pathname + url.search,
  ...options
}, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      
      if (result.error) {
        console.log('❌ gemini-pro ERROR:', result.error.message);
      } else if (result.candidates) {
        console.log('✅ gemini-pro WORKS!');
        console.log('Response:', result.candidates[0].content.parts[0].text);
      }
      console.log('\n-----------------------------------\n');
    } catch (error) {
      console.log('❌ Parse error:', error.message);
    }
  });
});

req.on('error', (error) => {
  console.log('❌ Request error:', error.message);
});

req.write(postData);
req.end();
