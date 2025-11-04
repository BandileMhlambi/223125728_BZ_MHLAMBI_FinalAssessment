import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function BookingSuccessScreen({ route, navigation }) {
  const { booking } = route.params;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking Confirmed 🎉</Text>
      <Text style={styles.text}>{booking.hotelName}</Text>
      <Text style={styles.text}>{booking.checkIn} → {booking.checkOut} • {booking.nights} nights</Text>
      <Text style={styles.text}>Rooms: {booking.rooms}</Text>
      <Text style={styles.total}>Total: R{booking.total}</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Tabs', { screen: 'Explore' })}>
        <Text style={styles.buttonText}>Back to Explore</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', padding: 24, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 12 },
  text: { fontSize: 16, color: 'dimgray', marginTop: 4 },
  total: { fontSize: 18, fontWeight: '800', marginTop: 12 },
  button: { marginTop: 24, backgroundColor: 'blue', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10 },
  buttonText: { color: 'white', fontWeight: '700' }
});


