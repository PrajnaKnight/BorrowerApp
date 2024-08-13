import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import OTPVerificationScreen from '../screens/otpVerification';
import ChoiceScreen from '../screens/ChoiceScreen';
import { AppProvider } from '../components/appContext';
import FAQScreen from '../screens/Faq';
import { ProgressBarProvider } from '../../Common/components/ControlPanel/progressContext'; 


const Stack = createNativeStackNavigator();

function CommonNavigator() {
  console.log('CommonNavigator rendering');
  return (
    <AppProvider>
      <ProgressBarProvider>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen
            name="otpverification"
            component={OTPVerificationScreen}
          />
          <Stack.Screen name="ChoiceScreen" component={ChoiceScreen} />
          <Stack.Screen name="faq" component={FAQScreen} />
        </Stack.Navigator>
      </ProgressBarProvider>
    </AppProvider>
  );
}

export default CommonNavigator;