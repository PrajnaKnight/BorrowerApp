import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import { GetLeadId, GetTokenValidity, StoreApplicantId, StoreLeadId, StoreTokenValidity } from '../services/LOCAL/AsyncStroage';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { isThisIsFutureTime } from '../services/Utils/FieldVerifier';
import { resetNavigationStack } from '../services/Utils/ViewValidator';
import GetLookUp from '../services/API/GetLookUp';
import { API_RESPONSE_STATUS, STATUS } from '../services/API/Constants';
import { useDispatch } from 'react-redux';
import { updateJumpTo } from '../services/Utils/Redux/LeadStageSlices';
import { Platform } from 'react-native';
import { Network_Error } from '../services/Utils/Constants';
import ScreenError, { useErrorEffect } from './ScreenError';
import { updateBreStatus } from '../services/Utils/Redux/ExtraSlices';


const SplashScreen = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  const [debugMessage, setDebugMessage] = useState('');
  const [refreshPage, setRefreshPage] = useState(true);
  const onTryAgainClick = () => {
    setRefreshPage(true);
  };

  const { errorScreen, setNewErrorScreen } = useErrorEffect(onTryAgainClick);
  const dispatch = useDispatch();

  const shouldShowLogin = async () => {
    setDebugMessage(prev => prev + '\nEntering shouldShowLogin');
    let response = API_RESPONSE_STATUS(STATUS.SUCCESS, null, null);

    const leadId = await GetLeadId();
    console.log('Lead ID:', leadId);
    setDebugMessage(prev => prev + `\nLead ID: ${leadId}`);

    const tokenValidityTime = await GetTokenValidity();
    const isFuture = isThisIsFutureTime(tokenValidityTime);
    console.log('Is Future:', isFuture);
    setDebugMessage(prev => prev + `\nIs Future: ${isFuture}`);

    if (leadId != null && isFuture) {
      let userAvailable = await GetLookUp();
      console.log('User Available:', userAvailable);
      setDebugMessage(prev => prev + `\nUser Available: ${JSON.stringify(userAvailable)}`);

      response.status = STATUS.ERROR;
      response.message = userAvailable.message;
      response.data = null;

      if (userAvailable.status == STATUS.ERROR) {
        return response;
      }

      response.data = 0;
      if (userAvailable.data != null && userAvailable.data.IsLeadExisted) {
        const jumpTo = parseInt(userAvailable.data.LeadStage) || 0;
        response.data = jumpTo;
        dispatch(updateBreStatus(userAvailable.data.IsBREcompleted));
      }
      dispatch(updateJumpTo(response.data));
    }

    if (!isFuture) {
      await StoreLeadId(null);
      await StoreApplicantId(null);
      await StoreTokenValidity(null);
    }

    setDebugMessage(prev => prev + `\nReturning response: ${JSON.stringify(response)}`);
    return response;
  };

  useEffect(() => {
    if (fontsLoaded) {
      console.log("============== executing again ===============");
      setDebugMessage(prev => prev + '\nExecuting effect');
      
      if (refreshPage == false) {
        return;
      }

      setRefreshPage(false);

      shouldShowLogin().then((response) => {
        console.log("response ", response);
        setDebugMessage(prev => prev + `\nResponse: ${JSON.stringify(response)}`);

        if (response.status == STATUS.ERROR) {
          if (response.message == Network_Error) {
            setNewErrorScreen(Network_Error);
            setDebugMessage(prev => prev + '\nSetting Network Error');
            return;
          }

          if (response.data != null) {
            console.log("---------------------------- LeadStage -------------------------------------");
            console.log(response.data);
            resetNavigationStack(navigation, response.data);
            setDebugMessage(prev => prev + `\nResetting navigation stack to: ${response.data}`);
            console.log("---------------------------- LeadStage -------------------------------------");
            return;
          }
          console.log("Splash Screen", response.message);
          setDebugMessage(prev => prev + `\nSplash Screen message: ${response.message}`);
        }

        setNewErrorScreen(null);
        setDebugMessage(prev => prev + '\nNavigating to welcome screen');
        navigation.navigate('welcome');
      }).catch(error => {
        console.error("Error in shouldShowLogin:", error);
        setDebugMessage(prev => prev + `\nError in shouldShowLogin: ${error.message}`);
      });
    }
  }, [refreshPage, fontsLoaded]);

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/your-logo.png')} />
      {errorScreen.type != null && <ScreenError errorObject={errorScreen} onTryAgainClick={onTryAgainClick} setNewErrorScreen={setNewErrorScreen} />}
      <Text style={styles.debugText}>{debugMessage}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  debugText: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    color: 'red',
    fontSize: 10,
  },
});

export default SplashScreen;