import React, { useState, useEffect, useCallback } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as ReduxProvider } from 'react-redux';
import { AppProvider } from './src/Common/components/appContext';
import RootNavigator from './RootNavigator';
import SplashScreen from './src/Common/screens/SplashScreen';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_700Bold } from '@expo-google-fonts/poppins';
// import * as ExpoSplashScreen from 'expo-splash-screen';
import { PortalProvider } from '@gorhom/portal';
import { GetBorrowerPhoneNumber } from './src/PersonalLoan/services/LOCAL/AsyncStroage';
import createSagaMiddleware from 'redux-saga';

import NavigationSlices from "./src/PersonalLoan/services/Utils/Redux/NavigationSlices"
import LeadStageSlices from "./src/PersonalLoan/services/Utils/Redux/LeadStageSlices"
import LoanAskSlices from "./src/PersonalLoan/services/Utils/Redux/LoanAskSlices"
import PersonalDeatilSlices from "./src/PersonalLoan/services/Utils/Redux/PersonalDataSlices"
import EmploymentDetailSlices from "./src/PersonalLoan/services/Utils/Redux/EmploymentDetailSlices"
import AddressDetailSlices from "./src/PersonalLoan/services/Utils/Redux/AddressDetailSlices"
import BankDetailSlices from "./src/PersonalLoan/services/Utils/Redux/BankDetailSlices"
import DisbursalInfoSlices from "./src/PersonalLoan/services/Utils/Redux/DisbursalInfo"
import ExtraStageSlice from "./src/PersonalLoan/services/Utils/Redux/ExtraSlices"
import PersonalLoanDetailSlice from "./src/PersonalLoan/services/Utils/Redux/PersonalFinanceDetailSlices"
import DocumentVerificationSlices, { doAadhaarEkyc , doPanCkyc} from "./src/PersonalLoan/services/Utils/Redux/DocumentVerificationSlices"
import UploadDocumentSlices, { sagaFetchFileRunner, sagaSubmitFileRunner } from "./src/PersonalLoan/services/Utils/Redux/UploadDocumentSlices"
import UploadOtherFileSlice, { sagaFetchOtherFileRunner, sagaDeleteFileRunner } from "./src/PersonalLoan/services/Utils/Redux/OtherUploadDocumentSlices"

import HomeScreenSlices from './src/Dashboard/services/Redux/HomeScreenSlice'
import ProfileInfoSlices from './src/Dashboard/services/Redux/ProfileInfoSlice'

import { all } from 'redux-saga/effects';
import { configureStore } from '@reduxjs/toolkit';

// Keep the splash screen visible while we fetch resources
// ExpoSplashScreen.preventAutoHideAsync();
const sagaMiddleware = createSagaMiddleware();


const store = configureStore({
  reducer: {
    navigationSlice: NavigationSlices,
    leadStageSlice: LeadStageSlices,
    loanAskSlice: LoanAskSlices,
    personalDetailSlice: PersonalDeatilSlices,
    employmentDetailSlices: EmploymentDetailSlices,
    addressDetailSlices: AddressDetailSlices,
    bankDetailSlices: BankDetailSlices,
    documentVerificationSlices: DocumentVerificationSlices,
    uploadDocumentSlices : UploadDocumentSlices,
    disbursalInfoSlices : DisbursalInfoSlices,
    otherDocumentSlices : UploadOtherFileSlice,
    extraStageSlice : ExtraStageSlice,
    personalLoanDetailSlice : PersonalLoanDetailSlice,
    homeScreenSlices : HomeScreenSlices,
    profileInfoSlices : ProfileInfoSlices
  },

  middleware: (getDefaultMiddleware) =>  getDefaultMiddleware().concat([sagaMiddleware]), 
 
})


function* rootSaga() {
  yield all([
      doPanCkyc(),
      doAadhaarEkyc(),
      sagaSubmitFileRunner(),
      sagaFetchFileRunner(),
      sagaFetchOtherFileRunner(),
      sagaDeleteFileRunner()
  ]);
}

sagaMiddleware.run(rootSaga)


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