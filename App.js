import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as ReduxProvider } from 'react-redux';
import store from './src/PersonalLoan/services/Utils/Redux/Store';
import { AppProvider } from './src/PersonalLoan/components/appContext'; // Make sure this import path is correct
import DashboardNavigator from './src/Dashboard/navigations/DashboardNavigator';
import PersonalLoanNavigator from './src/PersonalLoan/navigations/PersonalLoanNavigator';

const RootStack = createNativeStackNavigator();

export default function App() {
  return (
    <ReduxProvider store={store}>
      <AppProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            <RootStack.Navigator screenOptions={{ headerShown: false }}>
              <RootStack.Screen name="PersonalLoan" component={PersonalLoanNavigator} />
              <RootStack.Screen
                name="Dashboard"
                component={DashboardNavigator}
              />
            </RootStack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </AppProvider>
    </ReduxProvider>
  );
}