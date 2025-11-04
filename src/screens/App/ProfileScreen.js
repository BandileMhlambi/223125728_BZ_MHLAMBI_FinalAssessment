import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useBookings } from '../../context/BookingContext';
import { db } from '../../firebase/firebase';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { bookings } = useBookings();
  const [name, setName] = useState(user?.displayName || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(db, 'users', user.uid), (snap) => {
      const data = snap.data();
      if (data?.name) setName(data.name);
    });
    return unsub;
  }, [user]);

  const onSaveName = async () => {
    if (!user) return;
    try {
      setSaving(true);
      await updateDoc(doc(db, 'users', user.uid), { name: name.trim() });
      Alert.alert('Updated', 'Name updated successfully');
    } catch (e) {
      Alert.alert('Failed', e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <TextInput style={styles.nameInput} value={name} onChangeText={setName} />
      <TouchableOpacity style={styles.update} onPress={onSaveName} disabled={saving}>
        <Text style={styles.updateText}>{saving ? 'Saving...' : 'Save name'}</Text>
      </TouchableOpacity>
      <Text style={styles.email}>{user?.email}</Text>

      <Text style={styles.sectionTitle}>Your bookings</Text>
      {bookings.length === 0 ? (
        <Text style={styles.muted}>No bookings yet.</Text>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(b) => b.id}
          renderItem={({ item }) => (
            <View style={styles.bookingItem}>
              <Text style={styles.bookingTitle}>{item.hotelName}</Text>
              <Text style={styles.muted}>{item.checkIn} → {item.checkOut} • {item.nights} nights</Text>
            </View>
          )}
        />
      )}

      <TouchableOpacity style={styles.logout} onPress={signOut}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', padding: 16 },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 16 },
  nameInput: { fontSize: 18, fontWeight: '700', marginTop: 12, borderWidth: 1, borderColor: 'lightgray', borderRadius: 10, padding: 12 },
  email: { color: 'gray', marginBottom: 16 },
  update: { marginTop: 8, backgroundColor: 'blue', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  updateText: { color: 'white', fontWeight: '700' },
  sectionTitle: { marginTop: 24, fontWeight: '700', fontSize: 18, marginBottom: 8 },
  muted: { color: 'gray' },
  bookingItem: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: 'whitesmoke' },
  bookingTitle: { fontWeight: '700' },
  logout: { marginTop: 32, backgroundColor: 'red', paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  logoutText: { color: 'white', fontWeight: '700' }
});


