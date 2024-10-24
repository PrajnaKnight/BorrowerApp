import React, { useState, useEffect } from 'react';
import { View, StatusBar } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigationState } from '@react-navigation/native';
import { Provider } from 'react-redux';
import store from '../services/Utils/Redux/Store'; 
// Import your screens and components here
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
  const navigationState = useNavigationState(state => state);

  useEffect(() => {
    if (navigationState) {
      const routes = navigationState.routes;
      setCurrentScreen(routes);
    }
  }, [navigationState]);

  return (
    <Provider store={store}>
      <View style={{ flex: 1 }}>
        <AppProvider>
          {/* {currentScreen?.length > 0 && currentScreen[currentScreen.length - 1].name !== 'SplashScreen' && ( */}
            <View>
              <StatusBar />
              <Header />
            </View>
         {/* )} */}
          <ProgressBarProvider>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              {/* <Stack.Screen name="SplashScreen" component={SplashScreenComponent} />
              <Stack.Screen name="welcome" component={SignInScreen} />
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
            </Stack.Navigator>
          </ProgressBarProvider>
        </AppProvider>
      </View>
    </Provider>
  );
}

export default PersonalLoanNavigator;