
import { BackHandler } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { ALL_SCREEN } from './Constants';
import { checkCameraPermission, checkImagePermission, checkLocationPermission } from '../../../Common/screens/PermissionScreen';

export const GoBack = (navigation) => {
  if (navigation.canGoBack()) {
    navigation.goBack();
  } else {
    BackHandler.exitApp();
  }
}


const checkPermission = async () => {
  const locationPermission = await checkLocationPermission();
  const cameraPermission = await checkCameraPermission();
  const imagePermission = await checkImagePermission();
  return locationPermission && cameraPermission && imagePermission
}


const getScreenList = (isSelfEmployed = false) => {
  let SCREEN = [...ALL_SCREEN]

  if (isSelfEmployed != true) {
    let index = SCREEN.indexOf("personalFinance");

    if (index !== -1) {
      SCREEN.splice(index, 1);
    }
  }
  return SCREEN
}

export const getScreenNameAtLaunch = (jumpTo = 0, isSelfEmployed = false) => {
  let SCREEN = getScreenList(isSelfEmployed)
  return SCREEN[jumpTo]
}


export const resetNavigationStack = async (navigation, to) => {

  // to = {jumpTo : 0, isSelfEmployed : false}

  const actions = []

  let SCREEN = getScreenList(to.isSelfEmployed)

  SCREEN.slice(0, to.jumpTo + 1).some((e) => {
    const params = {}
    actions.push({ name: e, params: params })
  })



  const isAllPermissionGiven = await checkPermission()

  if (!isAllPermissionGiven) {


    navigation.replace('PermissionsScreen', {
      launchTimeAsk: true,
      onGoBack: () => {

        if (navigation.canGoBack()) {
          navigation.goBack()
        }
        else {
          BackHandler.exitApp();

        }
      },
    }
    );
    return
  }

  navigation.dispatch(
    CommonActions.reset({
      routes: actions,
    })
  );

}