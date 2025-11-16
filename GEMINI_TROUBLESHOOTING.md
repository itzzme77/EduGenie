# Testing Gemini AI Integration

## To test if the Gemini API is working:

1. Open the browser console (F12)
2. Navigate to the AI Assistant tab
3. Check the console for:
   - "Gemini API connected successfully" (success)
   - Error messages (if there's an issue)

## Common Issues & Solutions:

### Error: "API_KEY_INVALID"
**Solution:** 
- Verify the API key in `.env` file
- Make sure you've enabled the Gemini API in Google Cloud Console
- Restart the development server after adding `.env`

### Error: "Failed to fetch" or Network Error
**Solution:**
- Check internet connection
- Verify no firewall/proxy blocking the request
- Check browser console for CORS errors

### Error: "QUOTA_EXCEEDED"
**Solution:**
- You've exceeded the free tier limit
- Wait for quota reset or upgrade your plan

### Error: "No response generated from AI"
**Solution:**
- The AI safety filters blocked the response
- Try rephrasing your question

## Manual API Test:

You can test the API directly by running this in the browser console:

```javascript
fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDgZZwyhNJY1O8IhHvzMLJvWH8rQVmATeY', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contents: [{
      parts: [{ text: 'Hello, are you working?' }]
    }]
  })
})
.then(r => r.json())
.then(data => console.log('API Response:', data))
.catch(err => console.error('API Error:', err));
```

## Checking the API Key:

1. Go to: https://aistudio.google.com/app/apikey
2. Verify your API key is active
3. Check if Gemini API is enabled
4. Ensure billing is set up (required for API access)

## Restart Steps:

If you just added the `.env` file:

1. Stop the development server (Ctrl+C)
2. Run `npm run dev` again
3. The app should now load the API key from .env

## Debug Information:

The AI Assistant now shows:
- **Status: Checking...** - Testing API connection
- **Status: Active** - API working correctly
- **Status: Error** - Check console for details
- **Error banner** - Shows specific error messages
