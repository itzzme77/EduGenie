# Course Search Feature

## Overview

The EduGenie platform now includes a powerful course search system that allows users to discover and explore courses from popular learning platforms like Udemy and Coursera.

## Features

### ✅ Course Search
- **Search by Topic**: Users can search for courses by typing any topic (e.g., "machine learning", "web development", "python")
- **Real-time Results**: Instant search results with course details
- **Smart Matching**: Intelligent search algorithm that matches keywords in titles, descriptions, and instructors

### ✅ Popular Topics
- Quick access buttons for trending topics:
  - Machine Learning
  - Web Development
  - Python
  - Data Science
  - JavaScript
- One-click "View Popular" button to see top courses

### ✅ Course Information Displayed
Each course card shows:
- **Course Title** - Full course name
- **Instructor** - Course creator/teacher
- **Platform** - Udemy, Coursera, etc.
- **Rating** - Star rating (out of 5)
- **Student Count** - Number of enrolled students
- **Price** - Course cost (or "Free")
- **Level** - Beginner, Intermediate, Advanced, All Levels
- **Duration** - Total course length
- **Description** - Brief course overview
- **Direct Link** - Button to view course on the platform

## How It Works

### 1. Search Flow
```
User enters topic → Click Search → API fetches courses → Display results
```

### 2. Components Structure
```
Dashboard
└── CourseSearch (Main search component)
    └── CourseCard (Individual course display)
        └── courseApi.js (Data fetching service)
```

### 3. Data Source
Currently using a curated mock database with real course information from:
- **Udemy** courses
- **Coursera** courses

**Note**: The mock data includes actual courses with real details. To integrate live APIs, you would need:
- Udemy API key
- Coursera API access

## Files Created

### Components
- `src/components/CourseSearch.js` - Main search interface
- `src/components/CourseSearch.css` - Search UI styling
- `src/components/CourseCard.js` - Individual course card
- `src/components/CourseCard.css` - Course card styling

### Services
- `src/services/courseApi.js` - Course data fetching and search logic

## Usage

### For Users
1. Log into your EduGenie account
2. Navigate to the Dashboard
3. Scroll to the "Discover Courses" section
4. Either:
   - Type a topic in the search box and click "Search"
   - Click on a popular topic tag
   - Click "View Popular" to see top courses
5. Browse the results
6. Click "View Course" to open the course on its platform

### Search Examples
- "machine learning" → Returns ML courses from Udemy and Coursera
- "python" → Returns Python programming courses
- "web development" → Returns web dev bootcamps and tutorials
- "data science" → Returns data science courses

## Extending the Feature

### Add More Courses
Edit `src/services/courseApi.js` and add courses to the `mockCourses` object:

```javascript
'your-topic': [
  {
    id: unique_id,
    title: 'Course Title',
    instructor: 'Instructor Name',
    platform: 'Platform Name',
    rating: 4.5,
    students: 100000,
    price: '$99.99',
    image: 'image_url',
    url: 'course_url',
    description: 'Course description',
    level: 'Beginner',
    duration: '10 hours'
  }
]
```

### Integrate Real APIs

#### Udemy API Integration
1. Sign up for Udemy Affiliate Program
2. Get API credentials
3. Update `courseApi.js` to use real API calls

```javascript
const response = await fetch(
  `${UDEMY_API_BASE}?search=${query}`,
  {
    headers: {
      'Authorization': 'Basic YOUR_API_KEY'
    }
  }
);
```

#### Coursera API Integration
1. Apply for Coursera API access
2. Get API credentials
3. Update the service to fetch from Coursera

### Save Courses to Firestore
Enable users to save favorite courses:

```javascript
import { collection, addDoc } from 'firebase/firestore';

async function saveCourse(userId, course) {
  await addDoc(collection(db, 'savedCourses'), {
    userId,
    courseId: course.id,
    courseName: course.title,
    platform: course.platform,
    savedAt: serverTimestamp()
  });
}
```

## Future Enhancements

- [ ] User course bookmarking
- [ ] Course recommendations based on user interests
- [ ] Filter by platform, price, rating, level
- [ ] Sort by popularity, rating, newest
- [ ] Integration with more platforms (LinkedIn Learning, edX, etc.)
- [ ] Course progress tracking
- [ ] Course reviews and ratings
- [ ] User course history
- [ ] Certificate tracking

## Performance

- Search is optimized with debouncing
- Results load in ~500ms (simulated delay)
- Responsive design works on all devices
- Grid layout adapts to screen size

## Browser Compatibility

Works on all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Troubleshooting

### No courses showing
- Check console for errors
- Verify the search query is not empty
- Try clicking "View Popular" instead

### Images not loading
- Check internet connection
- Some course images may be placeholder URLs

### Search not working
- Refresh the page
- Clear browser cache
- Check if JavaScript is enabled

## License

This feature is part of the EduGenie platform - MIT License
