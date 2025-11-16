# Firestore Database Setup

## What's Been Implemented

Your app now saves user information to Firestore database on signup and login!

### Data Stored in Firestore

When a user signs up, the following data is saved to the `users` collection:
- **uid**: User's unique ID from Firebase Auth
- **email**: User's email address
- **displayName**: Generated from email (prefix before @)
- **createdAt**: Timestamp when account was created
- **lastLogin**: Timestamp of last login (updated on each login)

### Collection Structure

```
Firestore Database
└── studentsInfo (collection)
    └── {userId} (document)
        ├── uid: "abc123..."
        ├── email: "user@example.com"
        ├── displayName: "user"
        ├── createdAt: Timestamp
        └── lastLogin: Timestamp
```

**Note:** The app uses the `studentsInfo` collection to store all student/user information.

## How It Works

### On Signup:
1. User creates account with Firebase Authentication
2. User data is automatically saved to Firestore in the `studentsInfo` collection
3. Document ID = User's UID
4. Initial data includes: uid, email, displayName, createdAt

### On Login:
1. User logs in with Firebase Authentication
2. `lastLogin` timestamp is updated in Firestore
3. User data is fetched and displayed on the dashboard

### On Dashboard:
- User information is retrieved from Firestore
- Displays email, user ID, creation date, and last login time
- Shows raw Firestore data in a formatted view

## Enable Firestore in Firebase Console

**IMPORTANT:** You need to enable Firestore in your Firebase project:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **edugenie-c6916**
3. Click on **Firestore Database** in the left sidebar
4. Click **Create Database**
5. Choose a starting mode:
   - **Production mode** (recommended for live apps - requires security rules)
   - **Test mode** (good for development - allows all reads/writes)
6. Select a Cloud Firestore location (choose one closest to your users)
7. Click **Enable**

### Security Rules (Optional but Recommended)

For production, set up security rules in Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Students can only read/write their own student document
    match /studentsInfo/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Testing the Integration

1. Sign up with a new account
2. Check Firebase Console > Firestore Database
3. You should see a `studentsInfo` collection with your user document
4. Log out and log back in
5. Check that `lastLogin` timestamp is updated
6. View the Dashboard to see all your Firestore data displayed

## Additional Features You Can Add

- User profile updates (name, avatar, bio)
- User preferences/settings
- Activity logs
- User roles (admin, student, teacher)
- Additional user metadata

## Troubleshooting

If data is not being saved:
1. Check that Firestore is enabled in Firebase Console
2. Check browser console for errors
3. Verify Firebase configuration in `src/firebase.js`
4. Check Firestore security rules (use Test mode for development)
5. Ensure you're connected to the internet
