import React from 'react';
import './UserProfile.css';

export default function UserProfile({ userData, currentUser }) {
  return (
    <div className="user-profile-section">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {currentUser?.email?.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <h3>{userData?.displayName || 'Student'}</h3>
            <p className="profile-email">{currentUser?.email}</p>
          </div>
        </div>

        <div className="profile-details">
          <div className="detail-item">
            <span className="detail-icon">🆔</span>
            <div className="detail-content">
              <label>User ID</label>
              <p>{currentUser?.uid}</p>
            </div>
          </div>

          {userData?.createdAt && (
            <div className="detail-item">
              <span className="detail-icon">📅</span>
              <div className="detail-content">
                <label>Member Since</label>
                <p>{new Date(userData.createdAt.seconds * 1000).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
              </div>
            </div>
          )}

          {userData?.lastLogin && (
            <div className="detail-item">
              <span className="detail-icon">🕐</span>
              <div className="detail-content">
                <label>Last Login</label>
                <p>{new Date(userData.lastLogin.seconds * 1000).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <h4>0</h4>
            <p>Courses Enrolled</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <h4>0</h4>
            <p>Saved Courses</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h4>0</h4>
            <p>Completed</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <h4>0</h4>
            <p>Day Streak</p>
          </div>
        </div>
      </div>

      <div className="activity-section">
        <h3>📊 Recent Activity</h3>
        <div className="activity-placeholder">
          <p>No recent activity yet. Start exploring courses to see your activity here!</p>
        </div>
      </div>
    </div>
  );
}
