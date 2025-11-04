import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

export default function OnboardingOne({ navigation }) {
  return (
    <View style={styles.container}>
      <Image source={require('../../../Materials/01-Onboarding Page/Onboarding 1.png')} style={styles.image} resizeMode="contain" />
      <Text style={styles.title}>Browse beautiful hotels</Text>
      <Text style={styles.text}>Find great places to stay with clear photos, ratings and prices.</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Onboarding2')}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' },
  image: { width: '100%', height: 260, marginBottom: 24 },
  title: { fontSize: 26, fontWeight: '800', marginBottom: 8, textAlign: 'center' },
  text: { fontSize: 16, color: 'dimgray', textAlign: 'center' },
  button: { marginTop: 24, backgroundColor: 'blue', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12 },
  buttonText: { color: 'white', fontWeight: '700' }
});


