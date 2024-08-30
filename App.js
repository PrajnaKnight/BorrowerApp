import React, { useState, useEffect, useCallback } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as ReduxProvider } from 'react-redux';
import store from './src/PersonalLoan/services/Utils/Redux/Store';
import { AppProvider } from './src/Common/components/appContext';
import RootNavigator from './RootNavigator';
import SplashScreen from './src/Common/screens/SplashScreen';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_700Bold } from '@expo-google-fonts/poppins';
// import * as ExpoSplashScreen from 'expo-splash-screen';
import { PortalProvider } from '@gorhom/portal';
import { GetBorrowerPhoneNumber } from './src/PersonalLoan/services/LOCAL/AsyncStroage';

// Keep the splash screen visible while we fetch resources
// ExpoSplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [initialRouteName, setInitialRouteName] = useState(null)

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  const isUserAvailable = async () => {
    const number = await GetBorrowerPhoneNumber()
    console.log("phone number " +number)
    setInitialRouteName(number  ? "Dashboard" : "Common" )
  }

  
  useEffect(() => {

    isUserAvailable().then(()=>{})
    async function prepare() {
      try {
        console.log('App preparation started');
        // Simulate a delay for other preparation tasks
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('App preparation finished');
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);


  if (!appIsReady || !fontsLoaded) {
    return <SplashScreen />;
  }

  console.log('Rendering main app content');
  return (
    <PortalProvider>
      <View style={{ flex: 1 }}>
        <ReduxProvider store={store}>
          <AppProvider>
            <SafeAreaProvider>
              <RootNavigator initialRouteName = {initialRouteName}/>
            </SafeAreaProvider>
          </AppProvider>
        </ReduxProvider>
      </View>
    </PortalProvider>
  );
}