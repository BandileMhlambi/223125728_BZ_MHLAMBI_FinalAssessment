import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useBookings } from '../../context/BookingContext';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/firebase';
import { addDoc, collection } from 'firebase/firestore';

export default function BookingScreen({ route, navigation }) {
  const { hotel } = route.params;
  const { addBooking } = useBookings();
  const { user } = useAuth();

  const [checkIn, setCheckIn] = useState(''); // YYYY-MM-DD
  const [checkOut, setCheckOut] = useState('');
  const [rooms, setRooms] = useState('1');
  const [guests, setGuests] = useState('1'); // New state for guests

  const nights = useMemo(() => {
    const a = new Date(checkIn);
    const b = new Date(checkOut);
    const ms = b - a;
    if (!checkIn || !checkOut || Number.isNaN(ms) || ms <= 0) return 0;
    return Math.ceil(ms / (1000 * 60 * 60 * 24));
  }, [checkIn, checkOut]);

  const total = useMemo(() => nights * hotel.price * Math.max(1, parseInt(rooms || '1', 10)), [nights, hotel.price, rooms]);

  const onConfirm = async () => {
    if (nights <= 0) {
      Alert.alert('Invalid dates', 'Check-out must be after check-in. Use YYYY-MM-DD.');
      return;
    }
    const booking = {
      id: `${Date.now()}`,
      hotelId: hotel.id,
      hotelName: hotel.name,
      checkIn,
      checkOut,
      nights,
      rooms: Math.max(1, parseInt(rooms || '1', 10)),
      guests: Math.max(1, parseInt(guests || '1', 10)), // New guests property
      rate: hotel.price,
      total
    };
    addBooking(booking);
    if (user) {
      await addDoc(collection(db, 'users', user.uid, 'bookings'), booking);
    }
    navigation.replace('BookingSuccess', { booking });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking for {hotel.name}</Text>

      <Text style={styles.label}>Check-in (YYYY-MM-DD)</Text>
      <TextInput style={styles.input} placeholder="2025-11-05" value={checkIn} onChangeText={setCheckIn} />

      <Text style={styles.label}>Check-out (YYYY-MM-DD)</Text>
      <TextInput style={styles.input} placeholder="2025-11-07" value={checkOut} onChangeText={setCheckOut} />

      <Text style={styles.label}>Rooms</Text>
      <TextInput style={styles.input} keyboardType="number-pad" value={rooms} onChangeText={setRooms} />

      <Text style={styles.label}>Guests</Text>
      <TextInput style={styles.input} keyboardType="number-pad" value={guests} onChangeText={setGuests} />

      <View style={styles.summaryBox}>
        <Text style={styles.summaryText}>Nights: {nights}</Text>
        <Text style={styles.summaryText}>Rate: R{hotel.price}/night</Text>
        <Text style={styles.total}>Total: R{total}</Text>
      </View>

      <TouchableOpacity style={[styles.button, nights <= 0 && { backgroundColor: 'gray' }]} onPress={onConfirm}>
        <Text style={styles.buttonText}>Confirm Booking</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: 'white' },
  title: { fontSize: 18, fontWeight: '800', marginBottom: 16 },
  label: { fontWeight: '600', marginTop: 12 },
  input: { borderWidth: 1, borderColor: 'lightgray', borderRadius: 10, padding: 12, marginTop: 8, backgroundColor: 'whitesmoke' },
  summaryBox: { marginTop: 24, padding: 16, borderWidth: 1, borderColor: 'lightgray', borderRadius: 10 },
  summaryText: { color: 'dimgray', marginBottom: 4 },
  total: { fontWeight: '800', marginTop: 8, fontSize: 16 },
  button: { marginTop: 24, backgroundColor: 'green', paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: '700' }
});


