import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import CourseSearch from './CourseSearch';
import UserProfile from './UserProfile';
import AIAssistant from './AIAssistant';
import LearningRoadmap from './LearningRoadmap';
import './Dashboard.css';

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    async function fetchUserData() {
      if (currentUser) {
        try {
          const userRef = doc(db, 'studentsInfo', currentUser.uid);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            setUserData(userSnap.data());
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);
        }
      }
    }

    fetchUserData();
  }, [currentUser]);

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  const handleCourseSearch = (searchTerm) => {
    // Add to search history (avoid duplicates)
    if (searchTerm && !searchHistory.includes(searchTerm)) {
      setSearchHistory(prev => [...prev, searchTerm]);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading user data...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h1>🎓 EduGenie</h1>
        <div className="header-right">
          <span className="user-email">{currentUser?.email}</span>
          <button onClick={handleLogout} className="btn btn-logout">
            Logout
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="dashboard-nav">
        <button 
          className={`nav-tab ${activeSection === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveSection('dashboard')}
        >
          <span className="tab-icon">📊</span>
          Dashboard
        </button>
        <button 
          className={`nav-tab ${activeSection === 'courses' ? 'active' : ''}`}
          onClick={() => setActiveSection('courses')}
        >
          <span className="tab-icon">🎓</span>
          Search Courses
        </button>
        <button 
          className={`nav-tab ${activeSection === 'roadmap' ? 'active' : ''}`}
          onClick={() => setActiveSection('roadmap')}
        >
          <span className="tab-icon">🗺️</span>
          Learning Roadmap
        </button>
        <button 
          className={`nav-tab ${activeSection === 'ai-assistant' ? 'active' : ''}`}
          onClick={() => setActiveSection('ai-assistant')}
        >
          <span className="tab-icon">🤖</span>
          AI Assistant
        </button>
      </div>

      {/* Content Area */}
      <div className="dashboard-content">
        {/* Dashboard Section */}
        {activeSection === 'dashboard' && (
          <div className="section-content">
            <div className="section-header">
              <h2>📊 Your Dashboard</h2>
              <p>Welcome back! Here's your profile information and activity overview.</p>
            </div>
            <UserProfile userData={userData} currentUser={currentUser} />
          </div>
        )}

        {/* Course Search Section */}
        {activeSection === 'courses' && (
          <div className="section-content">
            <CourseSearch onSearch={handleCourseSearch} />
          </div>
        )}

        {/* Learning Roadmap Section */}
        {activeSection === 'roadmap' && (
          <div className="section-content">
            <LearningRoadmap searchHistory={searchHistory} />
          </div>
        )}

        {/* AI Assistant Section */}
        {activeSection === 'ai-assistant' && (
          <div className="section-content">
            <AIAssistant />
          </div>
        )}
      </div>
    </div>
  );
}
