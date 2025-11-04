import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Modal, TextInput, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/firebase';
import { addDoc, collection, onSnapshot, orderBy, query } from 'firebase/firestore';

export default function HotelDetailsScreen({ route, navigation }) {
  const { hotel } = route.params;
  const { user } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [myReviewed, setMyReviewed] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newStars, setNewStars] = useState('5');
  const [newText, setNewText] = useState('');
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(false);

  // Realtime reviews for this hotel
  useEffect(() => {
    const q = query(collection(db, 'hotels', hotel.id, 'reviews'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setReviews(items);
    });
    return unsub;
  }, [hotel.id]);

  // Weather via OpenWeather (uses city name)
  useEffect(() => {
    const key = process.env.EXPO_PUBLIC_OPENWEATHER_KEY;
    if (!key) return;
    const city = encodeURIComponent(hotel.location);
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric`;
    const load = async () => {
      try {
        setLoadingWeather(true);
        const res = await fetch(url);
        const json = await res.json();
        if (json && json.main) setWeather({ temp: json.main.temp, desc: json.weather?.[0]?.main });
      } catch (e) {
      } finally {
        setLoadingWeather(false);
      }
    };
    load();
  }, [hotel.location]);

  const average = useMemo(() => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.stars, 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  }, [reviews]);

  const openBooking = () => {
    if (!user) {
      navigation.navigate('SignIn');
      return;
    }
    navigation.navigate('Booking', { hotel });
  };

  const addReview = () => {
    if (!user) {
      navigation.navigate('SignIn');
      return;
    }
    setModalVisible(true);
  };

  const submitReview = async () => {
    const stars = Math.max(1, Math.min(5, parseInt(newStars || '5', 10)));
    const review = { author: user.displayName || 'You', stars, text: newText.trim(), createdAt: Date.now() };
    await addDoc(collection(db, 'hotels', hotel.id, 'reviews'), review);
    setMyReviewed(true);
    setModalVisible(false);
    setNewText('');
    setNewStars('5');
  };

  const StarRow = ({ count }) => (
    <Text style={{ color: 'orange' }}>{'★'.repeat(count)}{'☆'.repeat(5 - count)}</Text>
  );

  return (
    <View style={styles.container}>
      <Image source={hotel.image} style={styles.cover} />
      <Text style={styles.title}>{hotel.name}</Text>
      <Text style={styles.subtitle}>{hotel.location} • R{hotel.price}/night</Text>
      <Text style={styles.rating}>Average rating: {average} / 5</Text>
      {loadingWeather ? (
        <ActivityIndicator style={{ marginLeft: 16 }} />
      ) : weather ? (
        <Text style={styles.weather}>Weather in {hotel.location}: {weather.temp}°C {weather.desc || ''}</Text>
      ) : null}

      <TouchableOpacity style={[styles.button, !user && { backgroundColor: '#9ca3af' }]} onPress={openBooking}>
        <Text style={styles.buttonText}>Book Now</Text>
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reviews</Text>
        {reviews.length === 0 ? (
          <Text style={styles.muted}>No reviews yet. Be the first!</Text>
        ) : (
          <FlatList
            data={reviews}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.reviewItem}>
                <StarRow count={item.stars} />
                <Text style={styles.reviewText}>{item.text}</Text>
                <Text style={styles.muted}>— {item.author}</Text>
              </View>
            )}
          />
        )}

        {!myReviewed ? (
          <TouchableOpacity style={styles.secondaryButton} onPress={addReview}>
            <Text style={styles.secondaryButtonText}>Add Review</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.thanks}>Thanks for your review!</Text>
        )}
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalWrap}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Your Review</Text>
            <TextInput style={styles.input} placeholder="Stars (1-5)" keyboardType="number-pad" value={newStars} onChangeText={setNewStars} />
            <TextInput style={[styles.input, { height: 100 }]} placeholder="Write a few words" multiline value={newText} onChangeText={setNewText} />
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity style={[styles.button, { flex: 1 }]} onPress={submitReview}>
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.secondaryButton, { flex: 1 }]} onPress={() => setModalVisible(false)}>
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', paddingBottom: 16 },
  cover: { width: '100%', height: 180 },
  title: { fontSize: 22, fontWeight: '800', paddingHorizontal: 16, paddingTop: 16 },
  subtitle: { fontSize: 14, color: 'gray', paddingHorizontal: 16, paddingTop: 4 },
  rating: { fontSize: 14, color: 'dimgray', paddingHorizontal: 16, paddingTop: 8 },
  weather: { fontSize: 14, color: 'dimgray', paddingHorizontal: 16, paddingTop: 4 },
  button: { marginHorizontal: 16, marginTop: 16, backgroundColor: 'green', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: '700' },
  section: { paddingHorizontal: 16, paddingBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  muted: { color: 'gray' },
  reviewItem: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: 'whitesmoke' },
  reviewText: { marginTop: 4, marginBottom: 4 },
  secondaryButton: { marginTop: 12, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: 'lightgray', alignItems: 'center' },
  secondaryButtonText: { fontWeight: '700', color: 'black' },
  thanks: { marginTop: 12, fontWeight: '600', color: 'green' },
  modalWrap: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.4)' },
  modal: { margin: 24, backgroundColor: 'white', borderRadius: 12, padding: 24 },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: 'lightgray', borderRadius: 10, padding: 12, marginVertical: 8, backgroundColor: 'whitesmoke' }
});


