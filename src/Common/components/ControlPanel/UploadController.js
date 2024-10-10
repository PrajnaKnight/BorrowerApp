import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Switch } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import CustomInput from './input';
import applyFontFamily from '../../../assets/style/applyFontFamily';

const UploadController = ({ title, inputPlaceholder, required, passwordProtected = false, inputEnabled = true }) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState(null);
  const [password, setPassword] = useState('');
  const [isPasswordEnabled, setIsPasswordEnabled] = useState(false);

  const handleUpload = () => {
    // Simulating an upload failure
    setUploadError('Document Upload Failed');
    setUploadedFile(null);
  };

  const handleCamera = () => {
    // Simulating an incorrect document type
    setUploadError('Incorrect Document Type');
    setUploadedFile(null);
  };

  const handleClosePreview = () => {
    setUploadedFile(null);
    setUploadError(null);
  };

  const validateInput = (value) => {
    // Add your validation logic here
    if (value.length < 5) {
      setInputError('Invalid input');
    } else {
      setInputError(null);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {title}
        {required && <Text style={styles.required}>*</Text>}
      </Text>
      <View style={styles.UploadContainerWrapper}>
        <View style={styles.uploadContainer}>
          <View
            style={[
              styles.previewContainer,
              uploadError && styles.errorBorder,
            ]}>
            {uploadedFile ? (
              <>
                <Image source={{ uri: uploadedFile }} style={styles.preview} />
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={handleClosePreview}>
                  <Icon name="times" size={20} color="#FF0000" />
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.placeholderPreview}>
                <Text
                  style={[
                    uploadError
                      ? styles.ErrorplaceholderText
                      : styles.placeholderText,
                  ]}>
                  {uploadError ? uploadError : `Preview ${title}`}
                </Text>
                {uploadError && (
                  <Icon
                    name="exclamation-triangle"
                    size={20}
                    color="#FF0000"
                    style={styles.errorIcon}
                  />
                )}
              </View>
            )}
          </View>
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleUpload}>
              <Icon name="upload" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleCamera}>
              <Icon name="camera" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
        {inputEnabled && (
          <CustomInput
            title={title}
            required={required}
            placeholder={inputPlaceholder}
            value={inputValue}
            onChangeText={(text) => {
              setInputValue(text);
              validateInput(text);
            }}
            error={inputError}
          />
        )}
        {passwordProtected && (
          <View style={styles.passwordContainer}>
            <View style={styles.passwordHeader}>
              <Text style={styles.title}>Password</Text>
              <Switch
                value={isPasswordEnabled}
                onValueChange={setIsPasswordEnabled}
                trackColor={{ false: "#00000029", true: "#00194C" }}
                thumbColor={isPasswordEnabled ? "#758BFD" : "#A2ACC6"}
              />
            </View>
            {isPasswordEnabled && (
              <CustomInput
                placeholder="Enter password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
                style={styles.passwordInput}
              />
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = applyFontFamily({
  container: {
    marginBottom: 20,
  },
  UploadContainerWrapper: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#D8DFF2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 3,
    padding: 16,
    borderWidth: 1,
    borderColor: '#D8DFF2',
    borderRadius: 5,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 10,
    color: '#00194c',
  },
  required: {
    color: 'red',
  },
  uploadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    overflow: 'hidden',
  },
  previewContainer: {
    flex: 1,
    aspectRatio: 16 / 9,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D8DFF2',
    borderStyle: 'dashed',
    position: 'relative',
  },
  errorBorder: {
    borderColor: '#FF0000',
  },
  preview: {
    width: '100%',
    height: '100%',
  },
  placeholderPreview: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  placeholderText: {
    color: '#A0A0A0',
    textAlign: 'center',
  },
  ErrorplaceholderText:{
    color: '#FF0000',
    textAlign: 'center',
  },
  actionContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 5,
  },
  actionButton: {
    backgroundColor: '#FF8C00',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    width: 44,
    height: 44,
  },
  closeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorIcon: {
    marginLeft: 5,
  },
  passwordHeader:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    marginBottom:10
  },
  
});

export default UploadController;