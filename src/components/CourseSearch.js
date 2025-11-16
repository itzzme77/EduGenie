import React, { useState } from 'react';
import { searchCourses, getPopularCourses } from '../services/courseApi';
import CourseCard from './CourseCard';
import './CourseSearch.css';

export default function CourseSearch({ onSearch }) {
  const [query, setQuery] = useState('');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) {
      return;
    }

    setLoading(true);
    setHasSearched(true);
    
    try {
      const results = await searchCourses(query);
      setCourses(results);
      
      // Notify parent component about the search
      if (onSearch) {
        onSearch(query);
      }
    } catch (error) {
      console.error('Error searching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPopularCourses = () => {
    const popular = getPopularCourses();
    setCourses(popular);
    setHasSearched(true);
    setQuery('');
  };

  return (
    <div className="course-search-container">
      <div className="search-header">
        <h2>🎓 Discover Courses</h2>
        <p>Search for courses on any topic and start learning today!</p>
      </div>

      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-group">
          <input
            type="text"
            placeholder="Search for courses (e.g., machine learning, python, web development...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="btn-search" disabled={loading}>
            {loading ? '🔍 Searching...' : '🔍 Search'}
          </button>
        </div>
      </form>

      <div className="quick-search">
        <span className="quick-search-label">Popular topics:</span>
        <button onClick={() => { setQuery('machine learning'); }} className="topic-tag">Machine Learning</button>
        <button onClick={() => { setQuery('web development'); }} className="topic-tag">Web Development</button>
        <button onClick={() => { setQuery('python'); }} className="topic-tag">Python</button>
        <button onClick={() => { setQuery('data science'); }} className="topic-tag">Data Science</button>
        <button onClick={() => { setQuery('javascript'); }} className="topic-tag">JavaScript</button>
        <button onClick={loadPopularCourses} className="topic-tag popular">View Popular</button>
      </div>

      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Searching for courses...</p>
        </div>
      )}

      {!loading && hasSearched && courses.length > 0 && (
        <div className="courses-results">
          <h3>Found {courses.length} course{courses.length !== 1 ? 's' : ''}</h3>
          <div className="courses-grid">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      )}

      {!loading && hasSearched && courses.length === 0 && (
        <div className="no-results">
          <h3>😕 No courses found</h3>
          <p>Try searching with different keywords or browse our popular courses.</p>
        </div>
      )}

      {!hasSearched && (
        <div className="welcome-message">
          <div className="welcome-icon">📚</div>
          <h3>Start Your Learning Journey</h3>
          <p>Search for any topic or click on popular topics to discover amazing courses from top platforms like Udemy and Coursera!</p>
        </div>
      )}
    </div>
  );
}
