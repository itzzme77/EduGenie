import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to save user data to Firestore
  async function saveUserToFirestore(user, additionalData = {}) {
    if (!user) return;

    const userRef = doc(db, 'studentsInfo', user.uid);
    const userSnap = await getDoc(userRef);

    // Only create the document if it doesn't exist
    if (!userSnap.exists()) {
      const { email, uid } = user;
      const createdAt = serverTimestamp();

      try {
        await setDoc(userRef, {
          uid,
          email,
          createdAt,
          ...additionalData
        });
      } catch (error) {
        console.error('Error creating user document:', error);
      }
    }
  }

  // Function to update last login
  async function updateLastLogin(user) {
    if (!user) return;

    const userRef = doc(db, 'studentsInfo', user.uid);
    
    try {
      await setDoc(userRef, {
        lastLogin: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      console.error('Error updating last login:', error);
    }
  }

  // Signup function
  async function signup(email, password) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Save user to Firestore after successful signup
    await saveUserToFirestore(userCredential.user, {
      displayName: email.split('@')[0], // Use email prefix as display name
    });
    return userCredential;
  }

  // Login function
  async function login(email, password) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // Update last login timestamp
    await updateLastLogin(userCredential.user);
    return userCredential;
  }

  // Logout function
  function logout() {
    return signOut(auth);
  }

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Cleanup subscription
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
