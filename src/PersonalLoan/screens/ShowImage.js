import React from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import { styles } from '../../assets/style/personalStyle';
import { useAppContext } from '../components/useContext';
import { GoBack } from '../services/Utils/ViewValidator';

const ShowImage = ({ navigation, route }) => {
  const { fontSize } = useAppContext();
  const dynamicFontSize = (size) => size + fontSize;

  // Convert the Base64 data to a URI
  const uri = `data:image/jpeg;base64,${route.params.base64}`;

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: "center" }}>
      <Image source={{ uri: uri }} resizeMode="contain" style={{ flex: 1, width:"100%" }} />
      <TouchableOpacity style={[styles.backButton, {width:"95%", marginBottom:10}]} onPress={() => { GoBack(navigation) }}>
        <Text style={[styles.backBtnText, { fontSize: dynamicFontSize(styles.backBtnText.fontSize) }]}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ShowImage;