import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Image } from 'react-native';

export default function DealsScreen() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch('https://fakestoreapi.com/products?limit=8');
        const json = await res.json();
        setItems(json);
      } catch (e) {
        setError('Could not load deals');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}> 
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Deals (from Fake Store)</Text>
      <FlatList
        data={items}
        keyExtractor={(i) => String(i.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={{ flex: 1 }}>
              <Text numberOfLines={1} style={styles.name}>{item.title}</Text>
              <Text style={styles.price}>R{Math.round(item.price * 20)}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', padding: 16 },
  title: { fontSize: 18, fontWeight: '800', marginBottom: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' },
  card: { flexDirection: 'row', gap: 16, padding: 12, borderWidth: 1, borderColor: 'lightgray', borderRadius: 16, marginBottom: 12 },
  image: { width: 70, height: 70, borderRadius: 12 },
  name: { fontSize: 16, fontWeight: '700' },
  price: { marginTop: 6, fontSize: 14, fontWeight: '700' }
});


