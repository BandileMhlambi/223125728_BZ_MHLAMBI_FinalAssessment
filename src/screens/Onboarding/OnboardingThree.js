import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function OnboardingThree({ navigation }) {
  const { user, markOnboarded } = useAuth();

  const onGetStarted = async () => {
    if (user) {
      await markOnboarded(user.uid);

    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../../Materials/01-Onboarding Page/Onboarding 3.png')} style={styles.image} resizeMode="contain" />
      <Text style={styles.title}>Read and leave reviews</Text>
      <Text style={styles.text}>Share your experience and see what others think.</Text>
      <TouchableOpacity style={styles.button} onPress={onGetStarted}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' },
  image: { width: '100%', height: 260, marginBottom: 24 },
  title: { fontSize: 26, fontWeight: '800', marginBottom: 8, textAlign: 'center' },
  text: { fontSize: 16, color: 'dimgray', textAlign: 'center' },
  button: { marginTop: 24, backgroundColor: 'green', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12 },
  buttonText: { color: 'white', fontWeight: '700' }
});


