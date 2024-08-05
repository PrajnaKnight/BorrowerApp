import { CommonActions } from '@react-navigation/native';

export const navigateToScreen = (navigation, routeName, params = {}) => {
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [
        { name: routeName, params },
      ],
    })
  );
};