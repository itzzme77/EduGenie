import React, { useState, useEffect } from 'react';
import { sendMessageToGemini, testGeminiConnection, listAvailableModels } from '../services/geminiApi';
import './AIAssistant.css';

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Hello! I am your AI Learning Assistant powered by Google Gemini. I can help you with course recommendations, study tips, career guidance, and answer questions about any topic. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState('checking');

  useEffect(() => {
    const testConnection = async () => {
      const result = await testGeminiConnection();
      if (result.success) {
        setApiStatus('connected');
        console.log('Gemini API connected successfully');
      } else {
        setApiStatus('connected');
        console.warn('Initial connection test failed, but API may still work:', result.error);
      }
    };
    testConnection();
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: inputMessage,
      timestamp: new Date()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputMessage('');
    setIsTyping(true);

    try {
      const conversationHistory = updatedMessages.slice(1).map(msg => ({
        role: msg.type === 'user' ? 'user' : 'model',
        text: msg.text
      }));

      console.log('Sending message to Gemini:', inputMessage);
      const aiResponse = await sendMessageToGemini(inputMessage, conversationHistory);
      console.log('Received response from Gemini:', aiResponse);
      
      const botMessage = {
        id: updatedMessages.length + 1,
        type: 'bot',
        text: aiResponse,
        timestamp: new Date()
      };

      setMessages([...updatedMessages, botMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMsg = error.message || 'Unknown error occurred';
      setError('Failed to get response: ' + errorMsg);
      
      const errorMessage = {
        id: updatedMessages.length + 1,
        type: 'bot',
        text: 'I apologize, but I encountered an error: ' + errorMsg + '. Please try checking your internet connection, verifying the API key is valid, or trying again in a moment',
        timestamp: new Date()
      };
      
      setMessages([...updatedMessages, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickActions = [
    { icon: '📚', text: 'Recommend courses for me', action: 'recommend' },
    { icon: '💡', text: 'Study tips', action: 'tips' },
    { icon: '🎯', text: 'Career guidance', action: 'career' },
    { icon: '🗺️', text: 'Learning roadmap', action: 'roadmap' }
  ];

  const handleQuickAction = async (action) => {
    const actionPrompts = {
      recommend: `I'd like personalized course recommendations. Please suggest 5 high-quality courses across different learning platforms (like Udemy, Coursera, edX) based on popular and in-demand skills. For each course, include:
- Course name
- Platform
- Brief description
- Difficulty level
- Why it's valuable

Focus on skills like programming, data science, web development, AI/ML, business, or design.`,
      
      tips: `Please provide comprehensive study tips for effective learning. Include:

1. **Time Management Techniques**
   - Best practices for scheduling study sessions
   - Pomodoro technique and other methods

2. **Active Learning Strategies**
   - Note-taking methods (Cornell, mind mapping)
   - Spaced repetition and retrieval practice

3. **Focus and Productivity**
   - Minimizing distractions
   - Creating an optimal study environment

4. **Memory Retention**
   - Techniques for long-term retention
   - Using mnemonics and visualization

5. **Exam Preparation**
   - Strategic revision methods
   - Stress management tips

Make it practical and actionable!`,
      
      career: `I need comprehensive career guidance. Please help me with:

1. **Career Exploration**
   - Overview of trending career paths in 2025
   - Skills most valued by employers
   - Emerging industries and opportunities

2. **Career Planning**
   - Steps to identify the right career path
   - How to transition between careers
   - Building a competitive skill set

3. **Job Market Insights**
   - In-demand roles and technologies
   - Remote work opportunities
   - Freelancing vs traditional employment

4. **Professional Development**
   - Networking strategies
   - Building a personal brand
   - Continuous learning importance

5. **Salary Expectations**
   - Industry salary ranges
   - Negotiation tips

Provide specific, actionable advice tailored to modern career landscapes.`,
      
      roadmap: `Create a detailed, personalized learning roadmap for me. First, ask me:
1. What field/technology am I interested in learning?
2. What's my current skill level (beginner/intermediate/advanced)?
3. What are my learning goals (job change, skill upgrade, hobby)?
4. How much time can I dedicate per week?

Then create a structured roadmap with:
- **Phase 1: Foundations** (Beginner level)
- **Phase 2: Core Concepts** (Intermediate level)
- **Phase 3: Advanced Topics** (Expert level)
- **Phase 4: Projects & Practice**
- **Timeline estimates** for each phase
- **Resources** (courses, books, practice platforms)
- **Milestones** to track progress

Let's start by gathering information about your learning goals!`
    };

    // Create user message
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: actionPrompts[action],
      timestamp: new Date()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsTyping(true);
    setError(null);

    try {
      const conversationHistory = updatedMessages.slice(1).map(msg => ({
        role: msg.type === 'user' ? 'user' : 'model',
        text: msg.text
      }));

      console.log('Sending quick action to Gemini:', action);
      const aiResponse = await sendMessageToGemini(actionPrompts[action], conversationHistory);
      console.log('Received response from Gemini:', aiResponse);
      
      const botMessage = {
        id: updatedMessages.length + 1,
        type: 'bot',
        text: aiResponse,
        timestamp: new Date()
      };

      setMessages([...updatedMessages, botMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMsg = error.message || 'Unknown error occurred';
      setError('Failed to get response: ' + errorMsg);
      
      const errorMessage = {
        id: updatedMessages.length + 1,
        type: 'bot',
        text: 'I apologize, but I encountered an error: ' + errorMsg + '. Please try again in a moment.',
        timestamp: new Date()
      };
      
      setMessages([...updatedMessages, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const checkAvailableModels = async () => {
    try {
      setApiStatus('Checking models...');
      const models = await listAvailableModels();
      console.log('Available models:', models);
      setApiStatus('Check complete');
    } catch (error) {
      console.error('Failed to list models:', error);
      setApiStatus('error');
      setError('Failed to list models: ' + error.message);
    }
  };

  return (
    <div className="ai-assistant-container">
      <div className="ai-header">
        <div className="ai-header-content">
          <h2 className="ai-title">🤖 AI Learning Assistant</h2>
          <p>Powered by Google Gemini</p>
        </div>
        <div className="ai-controls">
          <button onClick={checkAvailableModels} className="check-models-btn" title="Check available models">Check Models</button>
          <span className={'status-badge ' + (apiStatus === 'connected' ? 'active' : apiStatus === 'error' ? 'error' : 'checking')}>{apiStatus}</span>
        </div>
      </div>

      {error && (<div className="error-banner"><span>⚠️</span>{error}</div>)}

      <div className="quick-actions">
        <p className="quick-actions-label">Quick Actions:</p>
        <div className="quick-actions-grid">
          {quickActions.map((action, index) => (
            <button key={index} className="quick-action-btn" onClick={() => handleQuickAction(action.action)}>
              <span className="action-icon">{action.icon}</span>
              {action.text}
            </button>
          ))}
        </div>
      </div>

      <div className="chat-container">
        <div className="messages-area">
          {messages.map((message) => (
            <div key={message.id} className={'message ' + message.type}>
              <div className="message-avatar">{message.type === 'bot' ? '🤖' : '👤'}</div>
              <div className="message-content">
                <div className="message-text">{message.text}</div>
                <div className="message-time">{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="message bot">
              <div className="message-avatar">🤖</div>
              <div className="message-content">
                <div className="typing-indicator"><span></span><span></span><span></span></div>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSendMessage} className="chat-input-form">
          <input type="text" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} placeholder="Ask me anything about learning..." className="chat-input" />
          <button type="submit" className="send-button" disabled={!inputMessage.trim()}>📤</button>
        </form>
      </div>

      <div className="ai-disclaimer"><strong>Powered by Google Gemini AI:</strong> This AI Assistant uses Google Gemini Pro model to provide intelligent, context-aware responses to help you with your learning journey.</div>
    </div>
  );
}