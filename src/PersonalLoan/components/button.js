import { TouchableOpacity, Text, View } from 'react-native';
import { styles } from "../../assets/style/personalStyle";
import { LinearGradient } from 'expo-linear-gradient';

const ButtonComponent = ({ title, onPress, disabled, style, disabledStyle, textStyle, borderRadius   }) => {
  // Combine base style with conditional disabledStyle
  const combinedStyle = [style, disabled ? disabledStyle : {}];

  const gradientStyle = {
    borderRadius: 5, // Apply borderRadius here
  };

  return (
    <TouchableOpacity onPress={onPress} disabled={disabled} style={[styles.button, style && style.button]}>
      <Text style={[styles.buttonText, textStyle && textStyle.buttonText]}>{title}</Text>
    </TouchableOpacity>
  );
};



export default ButtonComponent
