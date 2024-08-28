import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { GetLeadId, GetTokenValidity, StoreApplicantId, StoreBorrowerPhoneNumber, StoreLeadId, StoreTokenValidity, StoreUserAadhaar, StoreUserPan } from '../services/LOCAL/AsyncStroage';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_700Bold } from '@expo-google-fonts/poppins';

import { generatePdf, isThisIsFutureTime } from '../services/Utils/FieldVerifier';
import { getScreenNameAtLaunch, resetNavigationStack } from '../services/Utils/ViewValidator';
import GetLookUp from '../services/API/GetLookUp';
import { API_RESPONSE_STATUS, STATUS } from '../services/API/Constants';
import { useDispatch, useSelector } from 'react-redux';
import { OPTION, updateJumpTo, updateThingsToRemove } from '../services/Utils/Redux/LeadStageSlices';
import { GetHeader } from '../services/API/Constants';
import { Platform } from 'react-native';
import { Network_Error } from '../services/Utils/Constants';
import ScreenError, { useErrorEffect } from './ScreenError';

import { RequestLocationPermission } from '../services/API/LocationApi';
import DeviceInfo from 'react-native-device-info';
import { GetBreEligibility } from '../services/API/LoanEligibility';
import { updateBreStatus } from '../services/Utils/Redux/ExtraSlices';
import useJumpTo from "../components/StageComponent";
import ProgressBar from '../components/progressBar';
import LoadingOverlay from '../components/FullScreenLoader';


const SplashScreen = ({ navigation }) => {


  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });



  const userAgent = Platform.OS === 'web' ? navigator.userAgent : Platform.OS;

  console.log('User Agent:', userAgent);


  const [refreshPage, setRefreshPage] = useState(true)
  const onTryAgainClick = () => {
    setRefreshPage(true)
  }



  const { errorScreen, setNewErrorScreen } = useErrorEffect(onTryAgainClick)

  const dispatch = useDispatch()



  const ShouldShowLogin = async () => {


    let response = API_RESPONSE_STATUS(null, null, null)

    const leadId = await GetLeadId()
    const tokenValidityTime = await GetTokenValidity()
    const isFuture = isThisIsFutureTime(tokenValidityTime)


    if (leadId == null || !isFuture) {
      await StoreLeadId(null);
      await StoreApplicantId(null)
      await StoreTokenValidity(null)
      await StoreBorrowerPhoneNumber(null)
      await StoreUserPan(null)
      await StoreUserAadhaar(null)

      response.status = STATUS.SUCCESS
      response.data = { jumpTo: null }
      return response
    }


    let userAvailable = await GetLookUp()

    if (userAvailable.status == STATUS.ERROR) {
      response.status = STATUS.ERROR
      response.message = userAvailable.message
      return response
    }



    response.status = STATUS.SUCCESS
    response.data = { jumpTo: 0 }

    if (userAvailable.data != null && userAvailable.data.IsLeadExisted) {
      const jumpTo = parseInt(userAvailable.data.LeadStage) || 0
      response.data.jumpTo = jumpTo
      response.data.isSelfEmployed = userAvailable.data.EmploymentType == "Self-Employed"
      dispatch(updateBreStatus(userAvailable.data.IsBREcompleted))
    }


    return response
  }



  useEffect(() => {


    if (!fontsLoaded || !refreshPage) {
      return
    }

    setRefreshPage(false)

    ShouldShowLogin().then((response) => {


      if (response.status == STATUS.ERROR) {
        setNewErrorScreen(response.message)
        return
      }

      setNewErrorScreen(null)

      if (response.data.jumpTo != null) {
        const { jumpTo, isSelfEmployed } = response.data
        const launchScreenName = getScreenNameAtLaunch(jumpTo, isSelfEmployed)
        if (!isSelfEmployed) {
          dispatch(updateThingsToRemove({ name: "personalFinance", option: OPTION.ADD }))
        }
        dispatch(updateJumpTo({ jumpTo, screenName: launchScreenName }))
        resetNavigationStack(navigation, response.data)
        return
      }


      navigation.navigate('welcome');


    })

  }, [refreshPage, fontsLoaded]);



return (



  <View style={styles.container}>

    {errorScreen.type == null ? <ActivityIndicator size="large" color="#758BFD" /> : <ScreenError errorObject={errorScreen} onTryAgainClick={onTryAgainClick} setNewErrorScreen={setNewErrorScreen} />}

  </View>
);
};



const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },



});





export default SplashScreen;
