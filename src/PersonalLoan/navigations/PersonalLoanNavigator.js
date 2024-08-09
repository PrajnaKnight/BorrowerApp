import React, { useCallback, useEffect, useState } from 'react';
import { View, StatusBar } from 'react-native';
import { NavigationContainer, useNavigationContainerRef  } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import store from '../services/Utils/Redux/Store'; 
import QuickLoanAsk from '../screens/quickLoanAsk';
import SignInScreen from '../screens/signInScreen';
import OtpVerification from '../screens/otpVerification';
import PrimaryInfo from '../screens/primaryInformation';
import PersonalInfo from '../screens/personalInformation';
import EKycVerify from '../screens/eKyc';
import AddressDetail from '../screens/addressDetails';
import EmploymentDetail from '../screens/employmentDetails';
import BankDetail from '../screens/bankDetails';
import LoanEligibility from '../screens/loanEligibility';
import SanctionLetter from '../screens/sanctionLetter';
import DocumentUpload from '../screens/documentUpload';
import EMandate from '../screens/emandate';
import LoanAgreement from '../screens/loanAgreement';
import AgreementOTP from '../screens/agreementOTP';
import Final from '../screens/final';
import { ProgressBarProvider } from '../components/progressContext';
import { AppProvider } from '../components/appContext';
import Header from '../components/topBar';
import RPS from '../screens/rps';
import Disbursement from '../screens/disbursement';
import RejectionScreen from '../components/rejection';
import SplashScreenComponent from '../screens/SplashScreen';
import ShowImage from '../screens/ShowImage';
import FullScreenWebViewForAadhaarSigning from '../screens/FullScreenWebViewForAadhaarSiging';
import ThankYou from '../screens/ThankYou';
import Preview from '../screens/Preview';
import DisbursementAcceptedScreen from '../screens/DisbursalAcceptedScreen';
import PermissionsScreen from '../screens/PermissionScreen';
import InitiateDisbursalScreen from '../screens/InitiateDisbursalScreen';
import WebCameraScreen from '../screens/WebCameraScreen';
import { PortalProvider } from '@gorhom/portal';
import FAQScreen from '../screens/FAQScreen';

import {decode, encode} from 'base-64'

if (!global.btoa) {
    global.btoa = encode;
}

if (!global.atob) {
    global.atob = decode;
}

const Stack = createNativeStackNavigator();

function PersonalLoanNavigator() {
 

  const [currentScreen, setCurrentScreen] = useState();
  const navigationRef = useNavigationContainerRef();

  
  const navigate = useCallback((name, params) => {
    if (name === 'goBack') {
      navigationRef.current?.goBack();
    } else if (navigationRef.isReady()) {
      navigationRef.navigate(name, params);
    }
  }, [navigationRef]);

  // useEffect(() => {
  //   if (fontsLoaded) {
  //     SplashScreen.hideAsync();
  //   }
  // }, [fontsLoaded]);

  // const onLayoutRootView = useCallback(async () => {
  //   if (fontsLoaded) {
  //     await SplashScreen.hideAsync();
  //   }
  // }, [fontsLoaded]);

  // if (!fontsLoaded) {
  //   return null; // Render nothing until fonts are loaded
  // }

  return (
    <PortalProvider store={store}>
    <View style={{ flex: 1 }}>
      <AppProvider>
        {currentScreen?.length > 0 && currentScreen[currentScreen.length - 1].name !== 'SplashScreen' && (
          <View>
            <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
            <Header 
                navigate={navigate} 
                isOnFAQScreen={currentScreen === 'FAQScreen'} 
              />
          </View>
        )}
        <ProgressBarProvider>
        <NavigationContainer
              ref={navigationRef}
              onReady={() => {
                console.log('Navigation is ready');
              }}
              onStateChange={(state) => {
                const currentRouteName = state.routes[state.index].name;
                console.log('Current screen:', currentRouteName);
                setCurrentScreen(currentRouteName);
              }}
            >
            <Stack.Navigator  screenOptions={{ headerShown: false }}>
              <Stack.Screen name="SplashScreen" component={SplashScreenComponent} />
              {/* <Stack.Screen name="welcome" component={SignInScreen} />
              <Stack.Screen name="otpverification" component={OtpVerification} /> */}
              <Stack.Screen name="QLA" component={QuickLoanAsk} />
              <Stack.Screen name="primaryInfo" component={PrimaryInfo} />
              <Stack.Screen name="personalInfo" component={PersonalInfo} />
              <Stack.Screen name="eKycVerify" component={EKycVerify} />
              <Stack.Screen name="addressDetail" component={AddressDetail} />
              <Stack.Screen name="employmentDetail" component={EmploymentDetail} />
              <Stack.Screen name="bankDetail" component={BankDetail} />
              <Stack.Screen name="loanEligibility" component={LoanEligibility} />
              <Stack.Screen name="sanctionLetter" component={SanctionLetter} />
              <Stack.Screen name="documnetUplaod" component={DocumentUpload} />
              <Stack.Screen name="eMandate" component={EMandate} />
              <Stack.Screen name="loanAgreement" component={LoanAgreement} />
              <Stack.Screen name="agreementOTP" component={AgreementOTP} />
              <Stack.Screen name="final" component={Final} />
              <Stack.Screen name="RPS" component={RPS} />
              <Stack.Screen name="rejection" component={RejectionScreen} />
              <Stack.Screen name="ShowImage" component={ShowImage} />
              <Stack.Screen name="FullScreenWebViewForAadhaarSigning" component={FullScreenWebViewForAadhaarSigning} />
              <Stack.Screen name="ThankYou" component={ThankYou} />
              <Stack.Screen name="InitiateDisbursalScreen" component={InitiateDisbursalScreen} />
              <Stack.Screen name="Disbursement" component={Disbursement} />
              <Stack.Screen name="DisbursalAcceptedScreen" component={DisbursementAcceptedScreen} />
              <Stack.Screen name="Preview" component={Preview} />
              <Stack.Screen name="PermissionsScreen" component={PermissionsScreen} />
              <Stack.Screen name="WebCameraScreen" component={WebCameraScreen} />
              <Stack.Screen name="FAQScreen" component={FAQScreen}  />
              
            </Stack.Navigator>
          </NavigationContainer>
        </ProgressBarProvider>
      </AppProvider>
    </View>
    </PortalProvider>
  );
}

export default PersonalLoanNavigator;
