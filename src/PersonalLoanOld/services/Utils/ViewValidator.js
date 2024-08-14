
import { BackHandler } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { ALL_SCREEN } from './Constants';

export const GoBack = (navigation) => {
  if (navigation.canGoBack()) {
    navigation.goBack();
  } else {
    BackHandler.exitApp();
  }
}

export const resetNavigationStack =  (navigation, to) => {


  const actions = []

  

  ALL_SCREEN.slice(0, to+1).some((e) => {
    const params = {}
    actions.push({ name: e, params: params })
  })



  navigation.dispatch(
    CommonActions.reset({
      index: actions.length-1,
      routes: actions,
    })
  );
}