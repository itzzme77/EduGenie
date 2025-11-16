# EduGenie - React Authentication App

A React application with Firebase Authentication featuring email/password login and signup functionality.

## Features

- ✅ User Registration (Sign Up)
- ✅ User Login
- ✅ User Logout
- ✅ Protected Routes
- ✅ Firebase Authentication
- ✅ Error Handling
- ✅ Responsive Design

## Project Structure

```
EduGenie/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Auth.css           # Styling for Login/Signup
│   │   ├── Dashboard.css      # Styling for Dashboard
│   │   ├── Dashboard.js       # Protected dashboard page
│   │   ├── Login.js           # Login component
│   │   ├── Signup.js          # Signup component
│   │   └── PrivateRoute.js    # Route protection component
│   ├── contexts/
│   │   └── AuthContext.js     # Authentication context
│   ├── App.css
│   ├── App.js                 # Main app with routing
│   ├── firebase.js            # Firebase configuration
│   ├── index.css
│   └── index.js
├── .gitignore
├── package.json
├── FIREBASE_SETUP.md          # Firebase setup instructions
└── README.md
```

## Setup Instructions

### 1. Install Dependencies

```powershell
npm install
```

### 2. Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Email/Password authentication:
   - Navigate to **Authentication** > **Sign-in method**
   - Enable **Email/Password** provider
   - Click **Save**

4. Get your Firebase configuration:
   - Go to **Project Settings** (gear icon)
   - Scroll down to **Your apps** section
   - Click on the **web icon** (</>)
   - Register your app and copy the `firebaseConfig` object

5. Update `src/firebase.js`:
   - Replace the placeholder values with your actual Firebase configuration:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_ACTUAL_API_KEY",
     authDomain: "YOUR_ACTUAL_AUTH_DOMAIN",
     projectId: "YOUR_ACTUAL_PROJECT_ID",
     storageBucket: "YOUR_ACTUAL_STORAGE_BUCKET",
     messagingSenderId: "YOUR_ACTUAL_MESSAGING_SENDER_ID",
     appId: "YOUR_ACTUAL_APP_ID"
   };
   ```

### 3. Run the Application

```powershell
npm start
```

The app will open in your browser at `http://localhost:3000`

## Usage

### Sign Up
1. Navigate to the Sign Up page
2. Enter your email and password (minimum 6 characters)
3. Confirm your password
4. Click "Sign Up"
5. You'll be redirected to the dashboard upon successful registration

### Login
1. Navigate to the Login page
2. Enter your registered email and password
3. Click "Login"
4. You'll be redirected to the dashboard upon successful login

### Logout
1. Click the "Logout" button in the dashboard header
2. You'll be redirected to the login page

## Technologies Used

- **React** 18.2.0 - Frontend framework
- **React Router DOM** 6.20.0 - Routing
- **Firebase** 10.7.0 - Authentication backend
- **CSS3** - Styling

## Features Explained

### Authentication Context
The `AuthContext` provides authentication state and methods throughout the app:
- `currentUser` - Current logged-in user
- `signup(email, password)` - Register new user
- `login(email, password)` - Login existing user
- `logout()` - Sign out current user

### Protected Routes
The `PrivateRoute` component ensures only authenticated users can access protected pages like the dashboard.

### Error Handling
Comprehensive error handling for common Firebase authentication errors:
- Invalid email
- Weak password
- Email already in use
- User not found
- Wrong password
- And more...

## Next Steps

You can extend this app by adding:
- Password reset functionality
- Email verification
- Google/Facebook authentication
- User profile management
- Remember me functionality
- Better UI/UX enhancements

## License

MIT

## Support

For issues or questions, please check the Firebase documentation or create an issue in the repository.
