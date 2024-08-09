import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import ProgressBar from '../components/progressBar';
import { GoBack } from '../services/Utils/ViewValidator';
import { useAppContext } from './useContext';
import { styles } from '../../assets/style/personalStyle';
import applyFontFamily from '../../assets/style/applyFontFamily';

const RejectionScreen = ({navigation}) => {

  const { fontSize } = useAppContext();
  const dynamicFontSize = (size) => size + fontSize;

  return (
    <View style={style.container}>
      <ProgressBar progress={0.3} />



      <View style={{ alignItems: "center", flex: 1, justifyContent: "center" }}>
        <Image
          source={require('../../assets/images/Error.gif')} // replace with your actual rejection icon
          resizeMode="contain"
          style={style.failureIcon}
        />
        <Text style={style.message}>{"Sorry, your loan application cannot be processed\ndue to non-compliance with our policy. We hope\nto serve you in the future."}</Text>
      </View>


      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={[styles.backButton, {width:"100%"}]}
          onPress={() => GoBack(navigation)}
        >
          <Text style={styles.backBtnText }>
            BACK
          </Text>
        </TouchableOpacity>
      </View>
    </View>

  );
};

const style = applyFontFamily({

  failureIcon: {
    width: 180, // Set the width as per your icon's aspect ratio
    height: 180, // Set the height as per your icon's aspect ratio
  },

  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    padding: 16
  },

  message: {
    fontSize: 14,
    color: '#000',
    lineHeight: 20,
    textAlign: 'center',
  },
});

export default RejectionScreen;


//usage in other screen

//<RejectionScreen
//message="Sorry, your loan application cannot be processed due to non-compliance with our policy. We hope to serve you in the future."
///>
