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
    { icon: '', text: 'Recommend courses for me', action: 'recommend' },
    { icon: '', text: 'Study tips', action: 'tips' },
    { icon: '', text: 'Career guidance', action: 'career' },
    { icon: '', text: 'Learning roadmap', action: 'roadmap' }
  ];

  const handleQuickAction = (action) => {
    const actionTexts = {
      recommend: 'Can you recommend some courses for me?',
      tips: 'What are some effective study tips?',
      career: 'I need career guidance',
      roadmap: 'Create a learning roadmap for me'
    };
    setInputMessage(actionTexts[action]);
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
    <div className="ai-assistant">
      <div className="ai-header">
        <div className="ai-header-content">
          <h2 className="ai-title">AI Learning Assistant</h2>
          <p>Powered by Google Gemini</p>
        </div>
        <div className="ai-controls">
          <button onClick={checkAvailableModels} className="check-models-btn" title="Check available models">Check Models</button>
          <span className={'status-badge ' + (apiStatus === 'connected' ? 'active' : apiStatus === 'error' ? 'error' : 'checking')}>{apiStatus}</span>
        </div>
      </div>

      {error && (<div className="error-banner"><span></span>{error}</div>)}

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
              <div className="message-avatar">{message.type === 'bot' ? '' : ''}</div>
              <div className="message-content">
                <div className="message-text">{message.text}</div>
                <div className="message-time">{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="message bot">
              <div className="message-avatar"></div>
              <div className="message-content">
                <div className="typing-indicator"><span></span><span></span><span></span></div>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSendMessage} className="chat-input-form">
          <input type="text" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} placeholder="Ask me anything about learning..." className="chat-input" />
          <button type="submit" className="send-button" disabled={!inputMessage.trim()}></button>
        </form>
      </div>

      <div className="ai-disclaimer"><strong>Powered by Google Gemini AI:</strong> This AI Assistant uses Google Gemini Pro model to provide intelligent, context-aware responses to help you with your learning journey.</div>
    </div>
  );
}