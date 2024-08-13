import React, { useRef, useState } from 'react';
import { View, TouchableOpacity, Text, Button, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';
import applyFontFamily from '../services/style/applyFontFamily';

const WebCameraScreen = ({ navigation, route }) => {
  const [facing, setFacing] = useState('back');
  const cameraRef = useRef(null);
  const { onGoBack } = route.params;


  // const [permission, requestPermission] = useCameraPermissions();

  // if (!permission) {
  //   // Camera permissions are still loading.
  //   return <View />;
  // }

  // if (!permission.granted) {
  //   // Camera permissions are not granted yet.
  //   return (
  //     <View style={styles.container}>
  //       <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
  //       <Button onPress={requestPermission} title="grant permission" />
  //     </View>
  //   );
  // }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      let photo = await cameraRef.current.takePictureAsync();
      onGoBack(photo);
      Cancel()
    }
  };

  const Cancel = () =>{
    navigation.goBack();
  }



  return (
    <Camera style={styles.camera} facing={facing} ref={cameraRef}>
      <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.button} onPress={Cancel}>
          <Text style={styles.text}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={takePicture}>
          <Text style={styles.text}>Take Photo</Text>
        </TouchableOpacity>
        
      </View>
    </Camera>
  );
};


const styles = applyFontFamily({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});


export default WebCameraScreen;
