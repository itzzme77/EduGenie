// Gemini AI Service
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY; // Removed insecure hardcoded fallback
if (!GEMINI_API_KEY) {
  console.warn('REACT_APP_GEMINI_API_KEY is not set. Add it to a .env file (not committed).');
}
const GEMINI_MODEL = process.env.REACT_APP_GEMINI_MODEL || 'gemini-2.5-flash';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// Function to list available models
export async function listAvailableModels() {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Error listing models:', data);
      throw new Error(data.error?.message || 'Failed to list models');
    }

    console.log('Available Models:', data);
    
    // Filter models that support generateContent
    const generativeModels = data.models?.filter(model => 
      model.supportedGenerationMethods?.includes('generateContent')
    );
    
    console.log('Models supporting generateContent:', generativeModels?.map(m => m.name));
    
    return {
      allModels: data.models,
      generativeModels: generativeModels
    };
  } catch (error) {
    console.error('Error listing models:', error);
    throw error;
  }
}

export async function sendMessageToGemini(message, conversationHistory = []) {
  try {
    const cleanedMessage = (message || '').toString().trim();
    if (!cleanedMessage) throw new Error('Empty message provided.');

    const systemInstruction = 'You are EduGenie AI Assistant. Provide concise, structured, actionable educational help. Use bullet lists for multi-item responses. Clarify ambiguities by asking for missing info before giving a generic answer.';

    // Build contents with proper roles
    const contents = [];
    if (conversationHistory && conversationHistory.length) {
      conversationHistory.slice(-6).forEach(entry => {
        contents.push({
          role: entry.role === 'model' ? 'model' : 'user',
          parts: [{ text: (entry.text || '').toString().slice(0, 4000) }]
        });
      });
    }
    contents.push({ role: 'user', parts: [{ text: `${systemInstruction}\n${cleanedMessage}` }] });

    const requestBody = {
      contents,
      generationConfig: {
        temperature: 0.65,
        topP: 0.9,
        maxOutputTokens: 850
      }
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    console.log('Gemini raw response:', data); // debug visibility

    if (!response.ok) {
      const apiMessage = data.error?.message || `HTTP ${response.status}`;
      if (/API_KEY|permission/i.test(apiMessage)) {
        throw new Error('Gemini API key invalid or unauthorized. Update REACT_APP_GEMINI_API_KEY.');
      }
      if (/quota|exceeded|RESOURCE_EXHAUSTED/i.test(apiMessage)) {
        throw new Error('Gemini quota exceeded or rate limited. Retry later or lower frequency.');
      }
      throw new Error(apiMessage);
    }

    if (data.promptFeedback?.blockReason) {
      return `Blocked (${data.promptFeedback.blockReason}). Rephrase to be educational and neutral.`;
    }

    // Robust extraction of text parts
    let collected = [];
    if (Array.isArray(data.candidates)) {
      data.candidates.forEach(c => {
        const parts = c?.content?.parts;
        if (Array.isArray(parts)) {
          parts.forEach(p => {
            if (p && typeof p.text === 'string' && p.text.trim()) {
              collected.push(p.text.trim());
            }
          });
        }
      });
    }

    const finalText = collected.join('\n').trim();
    if (!finalText) {
      throw new Error('Empty AI response received.');
    }
    return finalText;
  } catch (err) {
    console.error('Gemini API Error:', err);
    const msg = err.message || 'Unknown error';
    if (/network|Failed to fetch/i.test(msg)) {
      throw new Error('Network error. Check connection.');
    }
    throw err;
  }
}

// Test function to verify API key
export async function testGeminiConnection() {
  try {
    // First, list available models
    console.log('Checking available models...');
    await listAvailableModels();
    
    // Then test with a message
    const response = await sendMessageToGemini('Hello! Can you confirm you are working?', []);
    return { success: true, response };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
