import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignInScreen from '../../PersonalLoan/screens/signInScreen';
import { Provider } from 'react-redux';
import store from '../../PersonalLoan/services/Utils/Redux/Store';

const Stack = createNativeStackNavigator();

function CommonNavigator() {
  return (
    <Provider store={store}>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" component={SignInScreen} />
    </Stack.Navigator>
    </Provider>
  );
}

export default CommonNavigator;