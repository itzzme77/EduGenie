import React, { useState, useEffect } from 'react';
import { sendMessageToGemini } from '../services/geminiApi';
import './LearningRoadmap.css';

export default function LearningRoadmap({ searchHistory = [] }) {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState('');

  // Get unique search topics from history
  const uniqueTopics = [...new Set(searchHistory.filter(term => term && term.trim()))];

  useEffect(() => {
    // Auto-generate roadmap if there are search topics
    if (uniqueTopics.length > 0 && !selectedTopic) {
      setSelectedTopic(uniqueTopics[0]);
      generateRoadmap(uniqueTopics[0]);
    }
  }, []);

  const generateRoadmap = async (topic) => {
    if (!topic || !topic.trim()) return;

    setLoading(true);
    setError(null);
    
    try {
      const prompt = `Create a comprehensive learning roadmap for "${topic}". 

Structure the roadmap as follows:
1. Beginner Level (2-3 topics with brief descriptions)
2. Intermediate Level (2-3 topics with brief descriptions)
3. Advanced Level (2-3 topics with brief descriptions)
4. Recommended Projects (2-3 project ideas)
5. Estimated Timeline
6. Key Skills to Master

Keep each section concise but informative. Use bullet points and clear formatting.`;

      const response = await sendMessageToGemini(prompt, []);
      
      setRoadmap({
        topic: topic,
        content: response,
        generatedAt: new Date()
      });
    } catch (err) {
      setError(err.message || 'Failed to generate roadmap');
      console.error('Roadmap generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
    generateRoadmap(topic);
  };

  const handleCustomRoadmap = () => {
    const customTopic = prompt('Enter a topic for your learning roadmap:');
    if (customTopic && customTopic.trim()) {
      setSelectedTopic(customTopic);
      generateRoadmap(customTopic);
    }
  };

  return (
    <div className="learning-roadmap">
      <div className="roadmap-header">
        <h2>🗺️ Learning Roadmap</h2>
        <p>Get a personalized learning path based on your interests</p>
      </div>

      {/* Topic Selection */}
      <div className="topic-selection">
        <h3>Select a Topic:</h3>
        <div className="topic-buttons">
          {uniqueTopics.length > 0 ? (
            uniqueTopics.map((topic, index) => (
              <button
                key={index}
                className={`topic-btn ${selectedTopic === topic ? 'active' : ''}`}
                onClick={() => handleTopicSelect(topic)}
              >
                📚 {topic}
              </button>
            ))
          ) : (
            <p className="no-topics">No search history yet. Search for courses first or create a custom roadmap!</p>
          )}
          <button className="topic-btn custom-btn" onClick={handleCustomRoadmap}>
            ✨ Custom Topic
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="roadmap-loading">
          <div className="spinner"></div>
          <p>Generating your personalized learning roadmap...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="roadmap-error">
          <span>⚠️</span>
          <p>{error}</p>
          <button onClick={() => generateRoadmap(selectedTopic)} className="retry-btn">
            Try Again
          </button>
        </div>
      )}

      {/* Roadmap Content */}
      {roadmap && !loading && (
        <div className="roadmap-content">
          <div className="roadmap-topic-header">
            <h3>📖 Learning Path for: {roadmap.topic}</h3>
            <span className="roadmap-date">
              Generated: {roadmap.generatedAt.toLocaleDateString()}
            </span>
          </div>
          
          <div className="roadmap-body">
            <div className="roadmap-text">
              {roadmap.content.split('\n').map((line, index) => {
                if (line.trim() === '') return <br key={index} />;
                
                // Headers (lines with numbers or special chars)
                if (line.match(/^#{1,3}\s/) || line.match(/^\d+\./)) {
                  return <h4 key={index} className="roadmap-section-title">{line.replace(/^#{1,3}\s/, '').replace(/^\d+\.\s/, '')}</h4>;
                }
                
                // Bullet points
                if (line.trim().startsWith('-') || line.trim().startsWith('•')) {
                  return <li key={index} className="roadmap-item">{line.replace(/^[-•]\s/, '')}</li>;
                }
                
                // Regular text
                return <p key={index} className="roadmap-paragraph">{line}</p>;
              })}
            </div>
          </div>

          <div className="roadmap-actions">
            <button onClick={() => generateRoadmap(selectedTopic)} className="refresh-btn">
              🔄 Regenerate
            </button>
            <button onClick={() => window.print()} className="print-btn">
              🖨️ Print
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!roadmap && !loading && !error && uniqueTopics.length === 0 && (
        <div className="roadmap-empty">
          <div className="empty-icon">🎯</div>
          <h3>Start Your Learning Journey!</h3>
          <p>Search for courses or click "Custom Topic" to generate your personalized learning roadmap.</p>
        </div>
      )}
    </div>
  );
}
