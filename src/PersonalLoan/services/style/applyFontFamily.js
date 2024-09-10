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
    }else if (styles[key].fontWeight === '500') {
      newStyles[key] = { 
        fontFamily: 'Poppins_500Medium', 
        ...styles[key],
        fontWeight: undefined  // Remove fontWeight as it's handled by the font
      };
    }
    else {
      newStyles[key] = { 
        fontFamily: 'Poppins_400Regular', 
        ...styles[key],
        fontWeight: undefined  // Remove fontWeight as it's handled by the font

      };
    }
  });
  return StyleSheet.create(newStyles);
};

export default applyFontFamily;