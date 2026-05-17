import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  User, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import { auth } from './firebase';
import { userDB, UserProfile } from './database';

// ===============================================================
// Type Definitions
// ===============================================================

export type UserRole = 'admin' | 'editor' | null;

export interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  role: UserRole;
  isAdmin: boolean;
  isEditor: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, fullName: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ===============================================================
// Auth Provider Component
// ===============================================================

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Set persistence to local to survive page refreshes
    setPersistence(auth, browserLocalPersistence).catch((err) => {
      console.error('Error setting persistence:', err);
    });

    // Listen to auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        setUser(currentUser);

        if (currentUser) {
          // Fetch user profile from Firestore
          const profile = await userDB.getProfile(currentUser.uid);
          setUserProfile(profile);
        } else {
          setUserProfile(null);
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const getRole = (): UserRole => {
    return userProfile?.role || null;
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      const message = err.code === 'auth/user-not-found' 
        ? 'User not found. Please check your email.'
        : err.code === 'auth/wrong-password'
        ? 'Incorrect password.'
        : err.message || 'Login failed. Please try again.';
      setError(message);
      throw new Error(message);
    }
  };

  const loginWithGoogle = async (): Promise<void> => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // Check if user profile exists, if not create one
      const profile = await userDB.getProfile(result.user.uid);
      if (!profile) {
        await userDB.createProfile(
          result.user.uid,
          result.user.email || '',
          result.user.displayName || 'User',
          'editor' // Default role
        );
      }
    } catch (err: any) {
      const message = err.message || 'Google login failed. Please try again.';
      setError(message);
      throw new Error(message);
    }
  };

  const signup = async (email: string, password: string, fullName: string): Promise<void> => {
    try {
      setError(null);
      const result = await createUserWithEmailAndPassword(auth, email, password);

      // Create user profile in Firestore
      await userDB.createProfile(result.user.uid, email, fullName, 'editor');
    } catch (err: any) {
      const message = err.code === 'auth/email-already-in-use'
        ? 'Email already in use. Please use a different email.'
        : err.code === 'auth/weak-password'
        ? 'Password is too weak. Please use a stronger password.'
        : err.message || 'Signup failed. Please try again.';
      setError(message);
      throw new Error(message);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setError(null);
      await signOut(auth);
      setUserProfile(null);
    } catch (err: any) {
      const message = err.message || 'Logout failed. Please try again.';
      setError(message);
      throw new Error(message);
    }
  };

  const clearError = (): void => {
    setError(null);
  };

  const role = getRole();

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    error,
    role,
    isAdmin: role === 'admin',
    isEditor: role === 'editor' || role === 'admin',
    login,
    loginWithGoogle,
    logout,
    signup,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ===============================================================
// Custom Hook
// ===============================================================

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
