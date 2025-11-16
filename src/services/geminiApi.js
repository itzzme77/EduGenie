// Gemini AI Service
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || 'AIzaSyCd0SEspsYq9Ysv9ZAEmSLBk1luNBTfRYI';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`;

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
    // Build a simple prompt with context
    let prompt = message;
    
    // Add recent conversation context (last 5 messages)
    if (conversationHistory.length > 0) {
      const recentHistory = conversationHistory.slice(-5);
      const context = recentHistory
        .map(msg => `${msg.type === 'user' ? 'User' : 'Assistant'}: ${msg.text}`)
        .join('\n');
      prompt = `Previous conversation:\n${context}\n\nUser: ${message}\n\nAssistant:`;
    }

    const requestBody = {
      contents: [{
        parts: [{
          text: `You are an AI Learning Assistant for EduGenie, an educational platform. Help students with course recommendations, study tips, career guidance, and educational questions. Be friendly, concise, and encouraging.\n\n${prompt}`
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 800,
      }
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Gemini API Error:', data);
      throw new Error(data.error?.message || `API Error: ${response.status}`);
    }
    
    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content) {
      const aiResponse = data.candidates[0].content.parts[0].text;
      return aiResponse;
    } else {
      throw new Error('No response generated from AI');
    }
  } catch (error) {
    console.error('Gemini API Error:', error);
    
    // Return a more specific error message
    if (error.message.includes('API_KEY_INVALID')) {
      throw new Error('Invalid API key. Please check your Gemini API configuration.');
    } else if (error.message.includes('QUOTA_EXCEEDED')) {
      throw new Error('API quota exceeded. Please try again later.');
    } else if (error.message.includes('Failed to fetch')) {
      throw new Error('Network error. Please check your internet connection.');
    }
    
    throw error;
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
