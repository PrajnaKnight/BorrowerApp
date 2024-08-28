import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
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



  const shouldShowLogin = async () => {


    let response = API_RESPONSE_STATUS(STATUS.SUCCESS, null, null)

    const leadId = await GetLeadId()
    const tokenValidityTime = await GetTokenValidity()
    const isFuture = isThisIsFutureTime(tokenValidityTime)





    if (leadId != null && isFuture) {

      let userAvailable = await GetLookUp()


      response.status = STATUS.ERROR
      response.message = userAvailable.message
      response.data = {jumpTo : null, isSelfEmployed : true}

      if (userAvailable.status == STATUS.ERROR) {
        return response
      }



      response.data.jumpTo = 0

      if (userAvailable.data != null && userAvailable.data.IsLeadExisted) {

        const jumpTo = parseInt(userAvailable.data.LeadStage) || 0
        response.data.jumpTo = jumpTo
        response.data.isSelfEmployed = userAvailable.data.EmploymentType == "Self-Employed"
        dispatch(updateBreStatus(userAvailable.data.IsBREcompleted))

      }

    }

    if (!isFuture) {
      console.log("=== clearing stuff =============")
      await StoreLeadId(null);
      await StoreApplicantId(null)
      await StoreTokenValidity(null)
      await StoreBorrowerPhoneNumber(null)
      await StoreUserPan(null)
      await StoreUserAadhaar(null)
    }



    return response
  }



  useEffect(() => {



    //  checking versioning
    if (fontsLoaded) {




      console.log("============== executing again ===============")

      if (refreshPage == false) {
        return
      }

      setRefreshPage(false)


      shouldShowLogin().then((response) => {

        console.log(response)


        console.log("response ", response)


        if (response.status == STATUS.ERROR) {
          if (response.message == Network_Error) {
            setNewErrorScreen(Network_Error)
            return
          }


          if (response.data.jumpTo != null) {

            const { jumpTo, isSelfEmployed } = response.data
            const launchScreenName = getScreenNameAtLaunch(jumpTo, isSelfEmployed)
            if(!isSelfEmployed){
              
              dispatch(updateThingsToRemove({name : "personalFinance", option : OPTION.ADD}))
            }
            dispatch(updateJumpTo({ jumpTo, screenName: launchScreenName }))

            console.log("---------------------------- LeadStage -------------------------------------")
            console.log(response.data)
            resetNavigationStack(navigation, response.data)
            console.log("---------------------------- LeadStage -------------------------------------")
            return
          }
          console.log("Splash Screen", response.message)
        }


        setNewErrorScreen(null)


        navigation.navigate('welcome');


      })





    }

  }, [refreshPage, fontsLoaded]);



  return (



    <View style={styles.container}>
      {/* <WebCalendar/> */}
      <Image source={require('../../assets/images/your-logo.png')} />
      {errorScreen.type != null && <ScreenError errorObject={errorScreen} onTryAgainClick={onTryAgainClick} setNewErrorScreen={setNewErrorScreen} />}

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
