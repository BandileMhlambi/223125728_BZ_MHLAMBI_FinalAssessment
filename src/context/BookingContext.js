import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

const BookingContext = createContext(null);

export const BookingProvider = ({ children }) => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const storageKey = user ? `bookings_${user.uid}` : null;

  useEffect(() => {
    const load = async () => {
      if (!storageKey) {
        setBookings([]);
        return;
      }
      const raw = await AsyncStorage.getItem(storageKey);
      setBookings(raw ? JSON.parse(raw) : []);
    };
    load();
  }, [storageKey]);

  const addBooking = async (booking) => {
    if (!user) return;
    const next = [booking, ...bookings];
    setBookings(next);
    await AsyncStorage.setItem(storageKey, JSON.stringify(next));
  };

  const value = useMemo(() => ({ bookings, addBooking }), [bookings]);

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};

export const useBookings = () => useContext(BookingContext);


