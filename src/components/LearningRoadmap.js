import React, { useState, useEffect } from 'react';
import { sendMessageToGemini } from '../services/geminiApi';
import './LearningRoadmap.css';

export default function LearningRoadmap({ searchHistory = [] }) {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [cache, setCache] = useState({}); // cache per topic to avoid redundant API calls

  // Get unique search topics from history
  const uniqueTopics = [...new Set(searchHistory.filter(term => term && term.trim()))];

  useEffect(() => {
    // Auto-generate roadmap if there are search topics
    if (uniqueTopics.length > 0 && !selectedTopic && !roadmap) {
      const firstTopic = uniqueTopics[0];
      setSelectedTopic(firstTopic);
      generateRoadmap(firstTopic);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uniqueTopics]);

  const parseRoadmapContent = (content) => {
    if (!content || typeof content !== 'string') return [];
    const sections = [];
    let currentSection = null;
    const lines = content.split(/\r?\n/);

    lines.forEach(rawLine => {
      const line = rawLine.trim();
      if (!line) return;
      // Match headers: numbered, markdown (#), or bold **Title** style
      const headerMatch = line.match(/^(#{1,3}\s.*|\d+\.\s.*|\*\*(.+?)\*\*\s*.*)$/);
      if (headerMatch) {
        if (currentSection) sections.push(currentSection);
        // Extract title removing leading markers and surrounding **
        let title = line
          .replace(/^#{1,3}\s*/, '')
          .replace(/^\d+\.\s*/, '')
          .replace(/^\*\*(.+?)\*\*\s*/, '$1')
          .trim();
        const icon = getSectionIcon(title);
        currentSection = { title, icon, items: [] };
        return;
      }
      // Bullet items
      if (line.match(/^[-•*]\s+/) && currentSection) {
        currentSection.items.push(line.replace(/^[-•*]\s+/, '').trim());
        return;
      }
      // Paragraph fallback
      if (currentSection) {
        currentSection.items.push(line);
      }
    });

    if (currentSection) sections.push(currentSection);
    return sections;
  };

  const getSectionIcon = (title) => {
    const lower = title.toLowerCase();
    if (lower.includes('beginner') || lower.includes('fundamentals') || lower.includes('basics')) return '🌱';
    if (lower.includes('intermediate') || lower.includes('core')) return '🚀';
    if (lower.includes('advanced') || lower.includes('expert') || lower.includes('master')) return '⭐';
    if (lower.includes('project')) return '💼';
    if (lower.includes('timeline') || lower.includes('duration')) return '⏱️';
    if (lower.includes('skill') || lower.includes('tool')) return '🛠️';
    if (lower.includes('resource') || lower.includes('learning')) return '📚';
    return '📌';
  };

  const generateRoadmap = async (topic) => {
    if (!topic || !topic.trim()) return;
    const key = topic.trim().toLowerCase();

    // Serve from cache if exists
    if (cache[key]) {
      setRoadmap(cache[key]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const prompt = `Generate a concise structured learning roadmap for: ${topic}. Use ONLY these sections with bold headers and bullet points:
**Beginner Level** – 3 bullets
**Intermediate Level** – 3 bullets
**Advanced Level** – 3 bullets
**Recommended Projects** – 3 bullets (Project Name: brief)
**Estimated Timeline** – Beginner / Intermediate / Advanced durations
**Key Skills to Master** – 3–5 bullets
Keep each bullet under 18 words, actionable, specific. Avoid filler, avoid repeating section titles inside bullets.`;

      const response = await sendMessageToGemini(prompt, []);
      const parsedSections = parseRoadmapContent(response);

      const roadmapObj = {
        topic,
        content: response,
        sections: parsedSections,
        generatedAt: new Date()
      };
      setRoadmap(roadmapObj);
      setCache(prev => ({ ...prev, [key]: roadmapObj }));
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
            <div className="roadmap-timeline">
              {roadmap.sections && roadmap.sections.length > 0 ? roadmap.sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="roadmap-section">
                  <div className="section-header">
                    <div className="section-icon">{section.icon}</div>
                    <h4 className="section-title">{section.title}</h4>
                  </div>
                  <div className="section-content">
                    {section.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="roadmap-card">
                        <div className="card-bullet">✓</div>
                        <div className="card-text">{item}</div>
                      </div>
                    ))}
                  </div>
                  {sectionIndex < roadmap.sections.length - 1 && (
                    <div className="section-connector"></div>
                  )}
                </div>
              )) : (
                <div className="roadmap-fallback">
                  <div className="fallback-content">
                    <h3>📝 Raw Content</h3>
                    <pre style={{ whiteSpace: 'pre-wrap', background: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
                      {roadmap.content}
                    </pre>
                  </div>
                </div>
              )}
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
