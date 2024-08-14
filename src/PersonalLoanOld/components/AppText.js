import React from 'react';
import { Text, TextProps } from 'react-native';

const AppText = ({ style, ...props }) => {
  return <Text style={[{ fontFamily: 'Poppins_400Regular' }, style]} {...props} />;
};

export default AppText;
