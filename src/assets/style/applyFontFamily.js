import { StyleSheet } from 'react-native';

const applyFontFamily = (styles) => {
  const newStyles = {};
  Object.keys(styles).forEach(key => {
    if (styles[key].fontWeight === 'bold') {
      newStyles[key] = { 
        fontFamily: 'Poppins_700Bold', 
        ...styles[key],
        fontWeight: undefined  // Remove fontWeight as it's handled by the font
      };
    } else {
      newStyles[key] = { 
        fontFamily: 'Poppins_400Regular', 
        ...styles[key] 
      };
    }
  });
  return StyleSheet.create(newStyles);
};

export default applyFontFamily;