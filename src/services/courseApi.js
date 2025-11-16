// Course API Service - Fetches courses from multiple sources

const UDEMY_API_BASE = 'https://www.udemy.com/api-2.0/courses/';
const COURSERA_API_BASE = 'https://api.coursera.org/api/courses.v1';

// Mock course data as fallback (since real APIs require authentication)
const mockCourses = {
  'machine learning': [
    {
      id: 1,
      title: 'Machine Learning A-Z: Hands-On Python & R In Data Science',
      instructor: 'Kirill Eremenko, Hadelin de Ponteves',
      platform: 'Udemy',
      rating: 4.5,
      students: 789000,
      price: '$84.99',
      image: 'https://img-c.udemycdn.com/course/480x270/950390_270f_3.jpg',
      url: 'https://www.udemy.com/course/machinelearning/',
      description: 'Learn to create Machine Learning Algorithms in Python and R from two Data Science experts.',
      level: 'All Levels',
      duration: '44 hours'
    },
    {
      id: 2,
      title: 'Machine Learning Specialization',
      instructor: 'Andrew Ng',
      platform: 'Coursera',
      rating: 4.9,
      students: 500000,
      price: 'Free',
      image: 'https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-course-photos.s3.amazonaws.com/fb/ce8cf049e511e9afb4c7a7c88059e6/New-Course-3-Icon.png',
      url: 'https://www.coursera.org/specializations/machine-learning-introduction',
      description: 'Break into AI with this beginner-friendly program taught by Andrew Ng.',
      level: 'Beginner',
      duration: '3 months'
    },
    {
      id: 3,
      title: 'Applied Machine Learning in Python',
      instructor: 'University of Michigan',
      platform: 'Coursera',
      rating: 4.5,
      students: 150000,
      price: 'Free',
      image: 'https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-course-photos.s3.amazonaws.com/0e/7bfb203cad11e5a1f7b1c4e3d5d7a7/logo3.png',
      url: 'https://www.coursera.org/learn/python-machine-learning',
      description: 'Learn applied machine learning techniques using Python.',
      level: 'Intermediate',
      duration: '4 weeks'
    }
  ],
  'web development': [
    {
      id: 4,
      title: 'The Complete Web Developer Course 3.0',
      instructor: 'Rob Percival',
      platform: 'Udemy',
      rating: 4.5,
      students: 450000,
      price: '$84.99',
      image: 'https://img-c.udemycdn.com/course/480x270/764164_7707_5.jpg',
      url: 'https://www.udemy.com/course/the-complete-web-developer-course-2/',
      description: 'Learn Web Development by building 25 websites and mobile apps using HTML, CSS, JavaScript, PHP, Python, MySQL & more!',
      level: 'All Levels',
      duration: '30 hours'
    },
    {
      id: 5,
      title: 'Full-Stack Web Development with React Specialization',
      instructor: 'The Hong Kong University',
      platform: 'Coursera',
      rating: 4.7,
      students: 200000,
      price: 'Free',
      image: 'https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-course-photos.s3.amazonaws.com/1a/5e7c60c43211e6b18b35cdbd35da4f/reactjs.png',
      url: 'https://www.coursera.org/specializations/full-stack-react',
      description: 'Learn front-end and hybrid mobile development, with server-side support.',
      level: 'Intermediate',
      duration: '4 months'
    }
  ],
  'python': [
    {
      id: 6,
      title: 'Complete Python Bootcamp: Go from zero to hero in Python 3',
      instructor: 'Jose Portilla',
      platform: 'Udemy',
      rating: 4.6,
      students: 1500000,
      price: '$84.99',
      image: 'https://img-c.udemycdn.com/course/480x270/567828_67d0.jpg',
      url: 'https://www.udemy.com/course/complete-python-bootcamp/',
      description: 'Learn Python like a Professional! Start from the basics and go all the way to creating your own applications.',
      level: 'All Levels',
      duration: '22 hours'
    },
    {
      id: 7,
      title: 'Python for Everybody Specialization',
      instructor: 'University of Michigan',
      platform: 'Coursera',
      rating: 4.8,
      students: 800000,
      price: 'Free',
      image: 'https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-course-photos.s3.amazonaws.com/f8/73e6a04e4211e5b5b725f163b7e0f4/logo3.png',
      url: 'https://www.coursera.org/specializations/python',
      description: 'Learn to Program and Analyze Data with Python.',
      level: 'Beginner',
      duration: '8 months'
    }
  ],
  'data science': [
    {
      id: 8,
      title: 'Data Science Course 2024: Complete Data Science Bootcamp',
      instructor: '365 Careers',
      platform: 'Udemy',
      rating: 4.5,
      students: 350000,
      price: '$84.99',
      image: 'https://img-c.udemycdn.com/course/480x270/1754098_e0df_3.jpg',
      url: 'https://www.udemy.com/course/the-data-science-course-complete-data-science-bootcamp/',
      description: 'Complete Data Science Training: Mathematics, Statistics, Python, Advanced Statistics in Python, Machine Learning',
      level: 'All Levels',
      duration: '29 hours'
    },
    {
      id: 9,
      title: 'IBM Data Science Professional Certificate',
      instructor: 'IBM',
      platform: 'Coursera',
      rating: 4.6,
      students: 600000,
      price: 'Free',
      image: 'https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-course-photos.s3.amazonaws.com/1e/5f0c40c43211e68d7f9f8c5c0c9c4e/IBM-Logo-Blk---Square.png',
      url: 'https://www.coursera.org/professional-certificates/ibm-data-science',
      description: 'Kickstart your career in data science. Master Python, SQL, data analysis, and machine learning.',
      level: 'Beginner',
      duration: '11 months'
    }
  ],
  'javascript': [
    {
      id: 10,
      title: 'The Complete JavaScript Course 2024: From Zero to Expert!',
      instructor: 'Jonas Schmedtmann',
      platform: 'Udemy',
      rating: 4.7,
      students: 750000,
      price: '$84.99',
      image: 'https://img-c.udemycdn.com/course/480x270/851712_fc61_6.jpg',
      url: 'https://www.udemy.com/course/the-complete-javascript-course/',
      description: 'The modern JavaScript course for everyone! Master JavaScript with projects, challenges and theory.',
      level: 'All Levels',
      duration: '69 hours'
    }
  ]
};

// Function to search courses
export async function searchCourses(query) {
  if (!query || query.trim() === '') {
    return [];
  }

  // Normalize the query
  const normalizedQuery = query.toLowerCase().trim();

  // Try to find exact or partial matches in mock data
  let results = [];
  
  for (const [key, courses] of Object.entries(mockCourses)) {
    if (key.includes(normalizedQuery) || normalizedQuery.includes(key)) {
      results = [...results, ...courses];
    }
  }

  // If no exact match, search through all courses for keyword matches
  if (results.length === 0) {
    const allCourses = Object.values(mockCourses).flat();
    results = allCourses.filter(course => 
      course.title.toLowerCase().includes(normalizedQuery) ||
      course.description.toLowerCase().includes(normalizedQuery) ||
      course.instructor.toLowerCase().includes(normalizedQuery)
    );
  }

  // If still no results, return a sample of all courses
  if (results.length === 0) {
    const allCourses = Object.values(mockCourses).flat();
    results = allCourses.slice(0, 5);
  }

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return results;
}

// Function to get popular courses
export function getPopularCourses() {
  const allCourses = Object.values(mockCourses).flat();
  return allCourses.sort((a, b) => b.students - a.students).slice(0, 6);
}

// Function to save course to Firestore (for user's saved courses)
export async function saveCourseToFirestore(userId, course) {
  // This will be implemented when user wants to save courses
  console.log('Saving course for user:', userId, course);
}
