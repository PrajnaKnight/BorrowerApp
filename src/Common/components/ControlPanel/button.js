import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from '../../../assets/style/personalStyle';

const ButtonComponent = ({
  title,
  onPress,
  disabled,
  style,
  disabledStyle,
  textStyle,
  borderRadius = 5,
  containerStyle,
}) => {
  const gradientColors = disabled
    ? ["#E9EEFF", "#D8E2FF"]
    : ["#2B478B", "#2B478B"];

  const combinedButtonStyle = [
    styles.button,
    style?.button,
    disabled ? disabledStyle?.button : {},
  ];

  const combinedTextStyle = [
    styles.buttonText,
    textStyle?.buttonText,
    disabled ? styles.buttonDisabledText : styles.buttonEnabledText,
    disabled ? disabledStyle?.buttonText : {},
  ];

  return (
    <View style={{width: '100%'}}>
      <LinearGradient
        colors={gradientColors}
        style={[
          styles.gradientButton,
          disabled ? styles.GrayBorder : styles.BlueBorder,
        ]}
      >
        <TouchableOpacity
          onPress={onPress}
          disabled={disabled}
          style={combinedButtonStyle}
        >
          <Text style={combinedTextStyle}>{title}</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

export default ButtonComponent;