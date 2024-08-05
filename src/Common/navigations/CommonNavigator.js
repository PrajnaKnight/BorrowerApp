import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import OTPVerificationScreen from '../screens/otpVerification';
import ChoiceScreen from '../screens/ChoiceScreen';

const Stack = createNativeStackNavigator();

function CommonNavigator() {
  console.log('CommonNavigator rendering');
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="otpverification" component={OTPVerificationScreen} />
      <Stack.Screen name="ChoiceScreen" component={ChoiceScreen} />
    </Stack.Navigator>
  );
}

export default CommonNavigator;