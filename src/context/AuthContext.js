import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../firebase/firebase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [hasOnboarded, setHasOnboarded] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const key = `onboarded_${firebaseUser.uid}`;
        const value = await AsyncStorage.getItem(key);
        setHasOnboarded(value === 'true');
      } else {
        setHasOnboarded(false);
      }
      setInitializing(false);
    });
    return unsubscribe;
  }, []);

  const markOnboarded = async (uid) => {
    const key = `onboarded_${uid}`;
    await AsyncStorage.setItem(key, 'true');
    setHasOnboarded(true);
  };

  const value = useMemo(
    () => ({ user, initializing, hasOnboarded, markOnboarded, signOut: () => signOut(auth) }),
    [user, initializing, hasOnboarded]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);


