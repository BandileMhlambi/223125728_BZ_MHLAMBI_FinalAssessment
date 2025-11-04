import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, TextInput, ScrollView, SafeAreaView } from 'react-native';

export default function ExploreScreen({ navigation }) {
  const hotels = [
    { id: 'h1', name: 'Seaside Hotel', location: 'Cape Town', price: 1200, stars: 4, image: require('../../../Materials/06-Explore Page/image-1.png') },
    { id: 'h2', name: 'City Lodge', location: 'Johannesburg', price: 950, stars: 5, image: require('../../../Materials/06-Explore Page/image-13.png') },
    { id: 'h3', name: 'Garden Inn', location: 'Durban', price: 800, stars: 3, image: require('../../../Materials/06-Explore Page/image-14.png') }
  ];

  const StarRow = ({ count }) => (
    <Text style={styles.starRating}>{'★'.repeat(count)}{'☆'.repeat(5 - count)}</Text>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.container}>
        <View style={styles.header}>
            <View>
            <Text style={styles.headerTitle}>Explore</Text>
            <Text style={styles.headerSub}>Book your favorite hotel</Text>
            </View>
            <View style={styles.profileImage} />
        </View>
        <View style={styles.searchBox}>
            <Image source={require('../../../Materials/06-Explore Page/search.png')} style={styles.searchIcon} />
            <TextInput placeholder="Search" style={styles.searchInput} />
        </View>

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recommended</Text>
            <FlatList
            data={hotels}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(h) => h.id}
            renderItem={({ item }) => (
                <TouchableOpacity style={styles.recommendedCard} onPress={() => navigation.navigate('HotelDetails', { hotel: item })}>
                <Image source={item.image} style={styles.recommendedCardImage} />
                <View style={styles.recommendedCardBody}>
                    <Text style={styles.recommendedCardTitle}>{item.name}</Text>
                    <Text style={styles.recommendedCardSub}>{item.location}</Text>
                    <StarRow count={item.stars} />
                    <Text style={styles.recommendedCardPrice}>R{item.price}/night</Text>
                </View>
                </TouchableOpacity>
            )}
            />
        </View>

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Nearby You</Text>
            {hotels.map(hotel => (
            <TouchableOpacity key={hotel.id} style={styles.card} onPress={() => navigation.navigate('HotelDetails', { hotel })}>
                <Image source={hotel.image} style={styles.cardImage} />
                <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{hotel.name}</Text>
                <Text style={styles.cardSub}>{hotel.location}</Text>
                <StarRow count={hotel.stars} />
                <Text style={styles.cardPrice}>R{hotel.price}/night</Text>
                </View>
            </TouchableOpacity>
            ))}
        </View>
        </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'white' },
  container: { flex: 1, backgroundColor: 'white' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 16 },
  headerTitle: { fontSize: 28, fontWeight: '800' },
  headerSub: { color: 'gray' },
  profileImage: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'lightgray' },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'lightgray', borderRadius: 16, paddingHorizontal: 16, marginHorizontal: 24, marginVertical: 16 },
  searchIcon: { width: 24, height: 24, marginRight: 12 },
  searchInput: { flex: 1, fontSize: 16, paddingVertical: 12 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: '700', marginBottom: 16, marginHorizontal: 24 },
  recommendedCard: { width: 200, marginRight: 16, borderWidth: 1, borderColor: 'lightgray', borderRadius: 16 },
  recommendedCardImage: { width: '100%', height: 120, borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  recommendedCardBody: { padding: 12 },
  recommendedCardTitle: { fontSize: 16, fontWeight: '700' },
  recommendedCardSub: { fontSize: 14, color: 'gray' },
  recommendedCardPrice: { marginTop: 6, fontSize: 14, fontWeight: '700' },
  card: { flexDirection: 'row', gap: 16, padding: 12, borderWidth: 1, borderColor: 'lightgray', borderRadius: 16, marginBottom: 12, marginHorizontal: 24 },
  cardImage: { width: 88, height: 72, borderRadius: 10 },
  cardTitle: { fontSize: 16, fontWeight: '700' },
  cardSub: { fontSize: 14, color: 'gray' },
  starRating: { color: 'orange', marginTop: 4 },
  cardPrice: { marginTop: 6, fontSize: 14, fontWeight: '700' }
});
