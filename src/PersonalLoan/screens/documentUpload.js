import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, useWindowDimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { styles } from '../../assets/style/personalStyle';
import ProgressBar from '../../Common/components/ControlPanel/progressBar';
import { useProgressBar } from '../../Common/components/ControlPanel/progressContext';
import CustomDropdown from '../components/dropdownPicker';
import { GoBack } from '../services/Utils/ViewValidator'; 
import UploadFile from '../services/API/DocumentUpload';
import { STATUS } from '../services/API/Constants'; 
import LoadingOverlay from '../components/FullScreenLoader';
import Icon from 'react-native-vector-icons/FontAwesome';
import ScreenError, { useErrorEffect } from './ScreenError';
import { base64ToFile, DownloadMyFile, DownloadMyFileWithBase64, generateUniqueAddress, getBase64MimeType } from '../services/Utils/FieldVerifier';
import { SendGeoLocation } from '../services/API/LocationApi';
import * as DocumentPicker from 'expo-document-picker';
import { checkCameraPermission, checkImagePermission, checkLocationPermission } from './PermissionScreen';
import { useDispatch, useSelector } from 'react-redux';
import { updateOtherFile, sagaFetchOtherFileRequest, sagaDeleteFileRequest } from '../services/Utils/Redux/OtherUploadDocumentSlices';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppContext } from '../../Common/components/useContext';
import { ALL_SCREEN, Network_Error } from '../services/Utils/Constants';
import SaveLeadStage from '../services/API/SaveLeadStage';
import { updateJumpTo } from '../services/Utils/Redux/LeadStageSlices';
import { useFocusEffect } from '@react-navigation/native';
import DownloadPopup from '../components/DownloadPopup';
import applyFontFamily from '../../assets/style/applyFontFamily';

const DocumentUploadScreen = ({ navigation }) => {
  const [otherError, setOtherError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setProgress } = useProgressBar();
  const [refreshPage, setRefreshPage] = useState(true);
  const uploadDocumentSlices = useSelector(state => state.otherDocumentSlices);
  const nextJumpTo = useSelector(state => state.leadStageSlice.jumpTo);
  const [downloadPath, setDownloadPath] = useState(null)


  const dispatch = useDispatch();

  const onTryAgainClick = () => {
    setRefreshPage(true);
  };

  const { errorScreen, setNewErrorScreen } = useErrorEffect(onTryAgainClick);

  const changeType = (pos, value) => {
    let currentRequestModel = [...uploadDocumentSlices.data.OTHER_FILES];
    console.log(value);
    dispatch(updateOtherFile({
      index: pos,
      data: { ...currentRequestModel[pos], DisplayName: value.label, DocType: value.ID }
    }));
  };

  useFocusEffect(
    useCallback(() => {
      if (!errorScreen || !refreshPage) {
        return;
      }
      setProgress(0.5);
      dispatch(sagaFetchOtherFileRequest());
      setRefreshPage(false);
    }, [refreshPage]));

  const handleDocumentPick = async (index, type) => {
    if (type === 'camera') {
      if (await checkCameraPermission() === false) {
        navigation.navigate("PermissionsScreen", { permissionStatus: "denied", permissionType: 'camera' });
        return;
      }
    } else {
      if (await checkImagePermission() === false) {
        navigation.navigate("PermissionsScreen", { permissionStatus: "denied", permissionType: 'files' });
        return;
      }
    }

    if (uploadDocumentSlices.data.OTHER_FILES[index].DocType == null) {
      let currentFile = { ...uploadDocumentSlices.data.OTHER_FILES[index], Error: "* Please Provide Document Type Before Uploading File" };
      console.log(currentFile);
      dispatch(updateOtherFile({
        data: currentFile,
        index: index
      }));
      return;
    }

    setOtherError(null);

    let result = null;
    let document = null;
    let fileName = null;
    if (type === 'library') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access the media library is required!');
        return;
      }

      if (Platform.OS === "web") {
        result = await DocumentPicker.getDocumentAsync({
          type: '*/*', // You can specify a mime type here, like 'application/pdf' for PDF files
        });

        if (result && !result.canceled && result.assets != null && result.assets.length > 0) {
          let fileData = result.assets[0];
          document = fileData.file;
          fileName = document.name;
        }
      } else {
        result = await DocumentPicker.getDocumentAsync({
          type: '*/*', // Allow any type of file
          copyToCacheDirectory: false, // This is important for Android. We don't want to create a copy in cache
        });

        if (result && !result.canceled && result.assets != null && result.assets.length > 0) {
          let fileData = result.assets[0];

          fileName = generateUniqueAddress(uploadDocumentSlices.data.OTHER_FILES[index].DisplayName, fileData.name || fileData.uri.split('/').pop());
          document = { uri: fileData.uri, name: fileName, type: fileData.mimeType };
        }
      }
    }

    else if (type === 'camera') {
      if (Platform.OS === "web") {
        navigation.navigate('WebCameraScreen', {
          onGoBack: (data) => {
            console.log("============== navigate back ===================");
            console.log(data);

            if (data != null) {
              console.log("data ");

              const mimeType = data.uri.split(';')[0].split(':')[1];
              const fileName = generateUniqueAddress(uploadDocumentSlices.data.OTHER_FILES[index].DisplayName, null, "png");
              document = base64ToFile(data.uri, mimeType, fileName);

              console.log(data);

              setLoading(true);
              UploadFile(document, uploadDocumentSlices.data.OTHER_FILES[index].DocType).then((response) => {
                setLoading(false);

                if (response.status === STATUS.ERROR) {
                  if (response.message === Network_Error || response.message != null) {
                    setNewErrorScreen(response.message);
                    return;
                  }
                  setOtherError(response.message);
                  return;
                }

                setRefreshPage(true);
              });
            }
          },
        });

        console.log("=== execute  below ==");

        return;
      }

      else {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          alert('Permission to access the camera is required!');
          return;
        }

        result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          quality: 0.6,
        });

        if (result && !result.canceled && result.assets != null && result.assets.length > 0) {
          let fileData = result.assets[0];
          fileName = generateUniqueAddress(uploadDocumentSlices.data.OTHER_FILES[index].DisplayName, fileData.name || fileData.uri.split('/').pop());
          document = { uri: fileData.uri, name: fileName, type: fileData.mimeType };
        }
      }
    }

    if (document != null) {
      setLoading(true);
      const response = await UploadFile(document, uploadDocumentSlices.data.OTHER_FILES[index].DocType);
      setLoading(false);

      if (response.status == STATUS.ERROR) {
        if (response.message == Network_Error || response.message != null) {
          setNewErrorScreen(response.message);
          return;
        }
        setOtherError(response.message);
        return;
      }

      setRefreshPage(true);
    }
  };

  const DowloadFile = async (uri, name) => {


    if (await checkImagePermission() == false) {
      navigation.navigate("PermissionsScreen", { permissionStatus: "denied", permissionType: 'files' })
      return
    }

    setLoading(true)
    const downloadResponse = await DownloadMyFileWithBase64(uri, name)

    setLoading(false)

    if (downloadResponse != null) [
      setDownloadPath(downloadResponse)
    ]
  };

  const handleDownloadForMobile = async (uri, name) => {
    if (await checkImagePermission() === false) {
      navigation.navigate("PermissionsScreen", { permissionStatus: "denied", permissionType: 'files' });
      return;
    }

    try {
      let Share = require('react-native-share').default;
      let fileName = name;
      let parts = fileName.split('.');
      let extension = parts[parts.length - 1];
      let mimeType = getBase64MimeType(extension);
      fileName = parts[0];

      console.log(mimeType);

      await Share.open({
        url: `data:${mimeType};base64,${uri}`,
        filename: fileName,
        isNewTask: true,
        title: "Save file",
        failOnCancel: false
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleDownloadAndShowPdf = (uri, name) => {
    let parts = name.split('.');
    let extension = parts[parts.length - 1];
    let mimeType = getBase64MimeType(extension);

    try {
      const byteCharacters = atob(uri);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return url;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  const updatePasswordProtected = (index) => {
    let currentRequestModel = [...uploadDocumentSlices.data.OTHER_FILES];
    if (!currentRequestModel[index].EnablePassword) {
      return;
    }

    dispatch(updateOtherFile({
      index: index,
      data: { ...currentRequestModel[index], ShowPassword: !currentRequestModel[index].ShowPassword }
    }));
  };

  const updatePassword = (index, value) => {
    let currentRequestModel = [...uploadDocumentSlices.data.OTHER_FILES];

    dispatch(updateOtherFile({
      index: index,
      data: { ...currentRequestModel[index], Password: value }
    }));
  };

  const enablePassword = (index, value) => {
    let currentRequestModel = [...uploadDocumentSlices.data.OTHER_FILES];

    dispatch(updateOtherFile({
      index: index,
      data: { ...currentRequestModel[index], EnablePassword: value, Password: null, ShowPassword: true }
    }));
  };

  const { fontSize } = useAppContext();
  const dynamicFontSize = (size) => size + fontSize;

  useEffect(() => {

    setLoading(uploadDocumentSlices.loading);
  }, [uploadDocumentSlices.loading]);

  useEffect(() => {
    setNewErrorScreen(uploadDocumentSlices.error);
  }, [uploadDocumentSlices.error]);

  const handleDeleteFile = async (docType) => {
    dispatch(sagaDeleteFileRequest(docType))
  }

  const goToEmandate = async () => {
    for (let i = 0; i < uploadDocumentSlices.data.OTHER_FILES.length; i++) {
      if (!uploadDocumentSlices.data.OTHER_FILES[i].OriginalFile && uploadDocumentSlices.data.MASTER_OPTION[i].MandatoryFlag == 1) {
        let currentFile = { ...uploadDocumentSlices.data.OTHER_FILES[i], Error: "* Please Provide " + uploadDocumentSlices.data.MASTER_OPTION[i].DoctypeType };
        console.log(currentFile);
        dispatch(updateOtherFile({
          data: currentFile,
          index: i
        }));
        return;
      }
    }

    if (await checkLocationPermission() === false) {
      navigation.navigate("PermissionsScreen", { permissionStatus: "denied", permissionType: "location" });
      return;
    }

    setLoading(true);


    let Leadstage = nextJumpTo
    if (ALL_SCREEN[nextJumpTo] == "documnetUplaod") {
      Leadstage = nextJumpTo + 1

      const saveLeadStageResponse = await SaveLeadStage(Leadstage)
      if (saveLeadStageResponse.status == STATUS.ERROR) {
        setLoading(false)
        setOtherError(null)
        setNewErrorScreen(saveLeadStageResponse.message)
        return
      }

      dispatch(updateJumpTo(Leadstage))
    }


    console.log("========== fetching location =================");
    await SendGeoLocation(9);
    console.log("========== fetching location =================");
    setLoading(false);

    navigation.navigate('eMandate');
  };

  const { width, height } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';

  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;

  const containerStyle = isDesktop ? styles.desktopContainer : isMobile ? styles.mobileContainer : styles.tabletContainer;
  const imageContainerStyle = isDesktop ? { width: '50%' } : { width: '100%' };

  return (
    <View style={styles.mainContainer}>
      <View style={{ flex: 1, flexDirection: isWeb ? "row" : "column" }}>
        {isWeb && (isDesktop || (isTablet && width > height)) && (
          <View style={[styles.leftContainer, imageContainerStyle]}>
            <View style={styles.mincontainer}>
              <View style={styles.webheader}>
                <Text style={styles.WebheaderText}>Personal Loan</Text>
                <Text style={styles.websubtitleText}>
                  Move Into Your Dreams!
                </Text>
              </View>
              <LinearGradient
                colors={["#000565", "#111791", "#000565"]}
                style={styles.webinterestButton}>
                <TouchableOpacity>
                  <Text style={styles.webinterestText}>
                    Interest starting from 8.4%*
                  </Text>
                </TouchableOpacity>
              </LinearGradient>

              <View style={styles.webfeaturesContainer}>
                <View style={styles.webfeature}>
                  <Text
                    style={[
                      styles.webfeatureIcon,
                      { fontSize: 30, marginBottom: 5 },
                    ]}>
                    %
                  </Text>
                  <Text style={styles.webfeatureText}>Nil processing fee*</Text>
                </View>
                <View style={styles.webfeature}>
                  <Text
                    style={[
                      styles.webfeatureIcon,
                      { fontSize: 30, marginBottom: 5 },
                    ]}>
                    3
                  </Text>
                  <Text style={styles.webfeatureText}>
                    3-Step Instant approval in 30 minutes
                  </Text>
                </View>
                <View style={styles.webfeature}>
                  <Text
                    style={[
                      styles.webfeatureIcon,
                      { fontSize: 30, marginBottom: 5 },
                    ]}>
                    ⏳
                  </Text>
                  <Text style={styles.webfeatureText}>Longer Tenure</Text>
                </View>
              </View>

              <View style={styles.webdescription}>
                <Text style={styles.webdescriptionText}>
                  There's more! Complete the entire process in just 3-steps that
                  isn't any more than 30 minutes.
                </Text>
                <TouchableOpacity>
                  <Text style={styles.weblinkText}>
                    To know more about product features & benefits, please click
                    here
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        <KeyboardAvoidingView
          style={[styles.rightCOntainer, { flex: 1 }]}
          behavior={Platform.OS === "ios" ? "padding" : null}
          keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}>
          <LoadingOverlay visible={loading} />
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.container}>
              <View>
                <ProgressBar progress={0.5} />
                <Text
                  style={[
                    styles.headerText,
                    { fontSize: dynamicFontSize(styles.headerText.fontSize) },
                  ]}>
                  Document Upload
                </Text>
                {otherError ? (
                  <Text
                    style={[
                      styles.errorText,
                      { fontSize: dynamicFontSize(styles.errorText.fontSize) },
                    ]}>
                    {otherError}
                  </Text>
                ) : null}
                {uploadDocumentSlices.data.MASTER_OPTION.length > 0 &&
                  uploadDocumentSlices.data.MASTER_OPTION.length ==
                  uploadDocumentSlices.data.OTHER_FILES.length &&
                  uploadDocumentSlices.data.OTHER_FILES.map((doc, index) => (
                    <View
                      key={index}
                      style={[
                        styles.documentSection,
                        {
                          backgroundColor:
                            index % 2 === 1 ? "#EDF1FE" : "#fafbff",
                          zIndex: 10000 + (uploadDocumentSlices.data.OTHER_FILES.length - index),
                        },
                      ]}>

                      {doc.Error ? <Text style={[styles.errorText, { fontSize: dynamicFontSize(styles.errorText.fontSize) }]}>{doc.Error}</Text> : null}

                      <Text
                        style={[
                          styles.label,
                          { fontSize: dynamicFontSize(styles.label.fontSize) },
                        ]}>  Document Category{" "}
                        <Text style={styles.mandatoryStar}>*</Text>
                      </Text>
                      <Text
                        style={[
                          styles.pickerContainer,
                          {
                            fontSize: 15,
                            paddingVertical: 10,
                            paddingLeft: 10,
                            zIndex: 10,
                          },
                        ]}>
                        {
                          uploadDocumentSlices.data.MASTER_OPTION[index]
                            .DoctypeType
                        }
                      </Text>

                      <Text
                        style={[
                          styles.label,
                          { fontSize: dynamicFontSize(styles.label.fontSize) },
                        ]}>
                        Document Type{" "}
                        <Text style={styles.mandatoryStar}>*</Text>
                      </Text>

                      <CustomDropdown
                        value={doc.DisplayName}
                        items={
                          uploadDocumentSlices.data.MASTER_OPTION[index]
                            .DocList || []
                        }
                        setValue={(e) => changeType(index, e)}
                        placeholder="Select"
                        style={[styles.pickerContainer, { fontSize, zIndex: 10002 + (uploadDocumentSlices.data.OTHER_FILES.length - index) }]}
                        zIndex={10002 + (uploadDocumentSlices.data.OTHER_FILES.length - index)}
                      />

                      <View style={styles.buttonContainer}>
                        <TouchableOpacity
                          style={styles.customBtn}
                          onPress={() => handleDocumentPick(index, "library")}>
                          <Text
                            style={[
                              styles.customBtnText,
                              {
                                fontSize: dynamicFontSize(
                                  styles.customBtnText.fontSize
                                ),
                              },
                            ]}>
                            Upload
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.customBtn]}
                          onPress={() => handleDocumentPick(index, "camera")}>
                          <Text
                            style={[
                              styles.customBtnText,
                              {
                                fontSize: dynamicFontSize(
                                  styles.customBtnText.fontSize
                                ),
                              },
                            ]}>
                            Use Camera
                          </Text>
                        </TouchableOpacity>
                      </View>

                      {doc.Name && (
                        <View
                          style={[
                            styles.uploadedDocName,
                            {
                              flexDirection: "row",
                              justifyContent: "space-between",
                              paddingHorizontal: 5,
                              paddingVertical: 8,
                              borderBottomWidth: 1,
                              borderBottomColor: "#ffe5c9",
                              borderRadius: 2,
                            },
                          ]}>
                          <Text
                            style={[
                              styles.uploadedDoc,
                              { flex: 1, fontSize: dynamicFontSize(14) },
                            ]}>
                            {doc.Name}
                          </Text>
                          <View style={{ flexDirection: "row" }}>
                            <TouchableOpacity
                              onPress={() =>
                                DowloadFile(doc.OriginalFile, doc.Name)
                              }>
                              <Icon
                                name="download"
                                size={16}
                                color="#ff8500"
                                style={styles.downloadIcon}
                              />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { handleDeleteFile(doc.DocType) }}>
                              <Icon name="trash" size={16} color="#ff8500" style={styles.downloadIcon} />
                            </TouchableOpacity>
                          </View>
                        </View>
                      )}
                    </View>
                  ))}
                <View style={styles.paddingBottom}></View>
              </View>
              <View style={styles.actionContainer}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => GoBack(navigation)}>
                  <Text
                    style={[
                      styles.backBtnText,
                      {
                        fontSize: dynamicFontSize(styles.backBtnText.fontSize),
                      },
                    ]}>
                    BACK
                  </Text>
                </TouchableOpacity>
                <LinearGradient
                  colors={["#002777", "#00194C"]}
                  style={styles.verifyButton}>
                  <TouchableOpacity onPress={() => goToEmandate()}>
                    <Text
                      style={[
                        styles.buttonText,
                        {
                          fontSize: dynamicFontSize(styles.buttonText.fontSize),
                        },
                      ]}>
                      PROCEED
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            </View>
          </ScrollView>

          {errorScreen.type != null && (
            <ScreenError
              errorObject={errorScreen}
              onTryAgainClick={onTryAgainClick}
              setNewErrorScreen={setNewErrorScreen}
            />
          )}

          <DownloadPopup path={downloadPath} onClose={() => { setDownloadPath(null) }} />

        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

const fieldstyles = applyFontFamily({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    paddingVertical: 8,
    paddingHorizontal: 7
  },
  prefix: {
    marginRight: 5,
    fontSize: 14
  },
  input: {
    fontSize: 14,
    flex: 1
  }
});

export default DocumentUploadScreen;
