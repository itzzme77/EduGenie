import React from 'react';
import './CourseCard.css';

export default function CourseCard({ course }) {
  return (
    <div className="course-card">
      <div className="course-image">
        <img src={course.image} alt={course.title} />
        <span className="course-platform">{course.platform}</span>
      </div>
      <div className="course-content">
        <h3 className="course-title">{course.title}</h3>
        <p className="course-instructor">👨‍🏫 {course.instructor}</p>
        <p className="course-description">{course.description}</p>
        
        <div className="course-meta">
          <div className="course-stats">
            <span className="rating">⭐ {course.rating}</span>
            <span className="students">👥 {course.students.toLocaleString()} students</span>
          </div>
          <div className="course-details">
            <span className="level">📊 {course.level}</span>
            <span className="duration">⏱️ {course.duration}</span>
          </div>
        </div>
        
        <div className="course-footer">
          <span className="course-price">{course.price}</span>
          <a 
            href={course.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-view-course"
          >
            View Course
          </a>
        </div>
      </div>
    </div>
  );
}
