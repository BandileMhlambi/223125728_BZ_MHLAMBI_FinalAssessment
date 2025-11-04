import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';

import SignInScreen from '../screens/Auth/SignInScreen';
import SignUpScreen from '../screens/Auth/SignUpScreen';
import ForgotPasswordScreen from '../screens/Auth/ForgotPasswordScreen';

import OnboardingOne from '../screens/Onboarding/OnboardingOne';
import OnboardingTwo from '../screens/Onboarding/OnboardingTwo';
import OnboardingThree from '../screens/Onboarding/OnboardingThree';

import ExploreScreen from '../screens/App/ExploreScreen';
import HotelDetailsScreen from '../screens/App/HotelDetailsScreen';
import BookingScreen from '../screens/App/BookingScreen';
import BookingSuccessScreen from '../screens/App/BookingSuccessScreen';
import ProfileScreen from '../screens/App/ProfileScreen';
import DealsScreen from '../screens/App/DealsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SignIn" component={SignInScreen} options={{ title: 'Sign In' }} />
      <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: 'Sign Up' }} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ title: 'Reset Password' }} />
    </Stack.Navigator>
  );
}

function OnboardingStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Onboarding1" component={OnboardingOne} options={{ headerShown: false }} />
      <Stack.Screen name="Onboarding2" component={OnboardingTwo} options={{ headerShown: false }} />
      <Stack.Screen name="Onboarding3" component={OnboardingThree} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function Tabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Deals" component={DealsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
      <Stack.Screen name="HotelDetails" component={HotelDetailsScreen} options={{ title: 'Hotel Details' }} />
      <Stack.Screen name="Booking" component={BookingScreen} options={{ title: 'Booking' }} />
      <Stack.Screen name="BookingSuccess" component={BookingSuccessScreen} options={{ title: 'Success', headerLeft: () => null }} />
    </Stack.Navigator>
  );
}

export default function RootNavigator() {
  const { user, initializing, hasOnboarded } = useAuth();

  if (initializing) {
    return null; // a splash screen could go here
  }

  if (!user) {
    return <AuthStack />;
  }

  if (user && !hasOnboarded) {
    return <OnboardingStack />;
  }

  return <AppStack />;
}


