import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, ImageBackground, Dimensions, useWindowDimensions, FlatList, Image, TextInput, Animated, Pressable } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { styles } from '../services/style/gloablStyle';
import ProgressBar from '../components/progressBar';
import { useProgressBar } from '../components/progressContext';
import CustomDropdown from '../components/dropdownPicker';
import { GoBack } from '../services/Utils/ViewValidator';
import UploadFile from '../services/API/DocumentUpload';
import { STATUS } from '../services/API/Constants';
import LoadingOverlay from '../components/FullScreenLoader';
import Icon from 'react-native-vector-icons/FontAwesome';
import ScreenError, { useErrorEffect } from './ScreenError';
import { base64ToFile, DownloadMyFile, DownloadMyFileWithBase64, generateUniqueAddress, getBase64MimeType, isImage } from '../services/Utils/FieldVerifier';
import { SendGeoLocation } from '../services/API/LocationApi';
import * as DocumentPicker from 'expo-document-picker';
import { checkCameraPermission, checkImagePermission, checkLocationPermission } from './PermissionScreen';
import { useDispatch, useSelector } from 'react-redux';
import { updateOtherFile, sagaFetchOtherFileRequest, sagaDeleteFileRequest, updateMasterSelected, updateLastDocs, updateChildSelected, updateCleanAll } from '../services/Utils/Redux/OtherUploadDocumentSlices';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppContext } from '../components/useContext';
import { ALL_SCREEN, Network_Error } from '../services/Utils/Constants';
import SaveLeadStage from '../services/API/SaveLeadStage';
import { updateJumpTo } from '../services/Utils/Redux/LeadStageSlices';
import { useFocusEffect } from '@react-navigation/native';
import DownloadPopup from '../components/DownloadPopup';
import applyFontFamily from '../services/style/applyFontFamily';
import { AntDesign } from '@expo/vector-icons';
import { retry } from 'redux-saga/effects';
import useJumpTo from "../components/StageComponent";


const DocumentUploadScreen = ({ navigation }) => {

  const stageMaintance = useJumpTo("documnetUplaod", "eMandate", navigation);

  const [otherError, setOtherError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setProgress } = useProgressBar();
  const [refreshPage, setRefreshPage] = useState(true);
  const uploadDocumentSlices = useSelector(state => state.otherDocumentSlices);
  const nextJumpTo = useSelector(state => state.leadStageSlice.jumpTo);
  const [downloadPath, setDownloadPath] = useState(null)
  const tabsRef = useRef(null);
  const scrollViewRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const windowWidth = Dimensions.get('window').width;
  const itemWidth = 120;

  const [selectedDocType, setSelectedDocType] = useState()
  const [selectedSubDocType, setSelectedSubDocType] = useState()
  const [listOfSubDoc, setListOfSubDoc] = useState()
  const toggleAnimation = useRef(new Animated.Value(0)).current;
  const [currentSelectedFile, setCurrentSelectedFile] = useState()
  const [firstTime, setFirstTime] = useState(true)

  const dispatch = useDispatch();

  const onTryAgainClick = () => {
    setRefreshPage(true);
  };

  const { errorScreen, setNewErrorScreen } = useErrorEffect(onTryAgainClick);

  const changeType = (value) => {
    dispatch(updateChildSelected(value));
  };


  const findCurrentMasterSelectedChild = () => {

    let DisplayName = null, DocType = null, Password = null;
    if (uploadDocumentSlices.data.selectedDoc.master != null && uploadDocumentSlices.data.selectedDoc.child != null) {
      DisplayName = uploadDocumentSlices.data.selectedDoc.child
      DocType = uploadDocumentSlices.data.OTHER_FILES[uploadDocumentSlices.data.selectedDoc.master][uploadDocumentSlices.data.selectedDoc.child].Id
      Password = uploadDocumentSlices.data.OTHER_FILES[uploadDocumentSlices.data.selectedDoc.master][uploadDocumentSlices.data.selectedDoc.child].Password
    }

    return { DisplayName, DocType, Password }
  }

  useFocusEffect(
    useCallback(() => {

      if (firstTime) {
        dispatch(updateCleanAll())
        setFirstTime(false)
      }

    }, [firstTime]));
  useFocusEffect(
    useCallback(() => {
      if (!errorScreen || !refreshPage) {
        return;
      }



      setProgress(0.5);
      dispatch(sagaFetchOtherFileRequest());
      setRefreshPage(false);
    }, [refreshPage]));

  const handleDocumentPick = async (type) => {
    setOtherError(null)

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

    // if (uploadDocumentSlices.data.OTHER_FILES[index].DocType == null) {
    //   setOtherError("* Please Provide Document Type Before Uploading File");      
    //   return;
    // }


    let result = null;
    let document = null;
    let fileName = null;

    let { DisplayName, DocType, Password } = findCurrentMasterSelectedChild()


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


          fileName = generateUniqueAddress(DisplayName, fileData.name || fileData.uri.split('/').pop());
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
              const fileName = generateUniqueAddress(DisplayName, null, "png");
              document = base64ToFile(data.uri, mimeType, fileName);

              console.log(data);

              setLoading(true);
              UploadFile(document, DocType, Password).then((response) => {
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
          fileName = generateUniqueAddress(DisplayName, fileData.name || fileData.uri.split('/').pop());
          document = { uri: fileData.uri, name: fileName, type: fileData.mimeType };
        }
      }
    }

    if (document != null) {

      console.log("final DocType ", DocType)
      setLoading(true);
      const response = await UploadFile(document, DocType, Password);
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

  // const handleDownloadForMobile = async (uri, name) => {
  //   if (await checkImagePermission() === false) {
  //     navigation.navigate("PermissionsScreen", { permissionStatus: "denied", permissionType: 'files' });
  //     return;
  //   }

  //   try {
  //     let Share = require('react-native-share').default;
  //     let fileName = name;
  //     let parts = fileName.split('.');
  //     let extension = parts[parts.length - 1];
  //     let mimeType = getBase64MimeType(extension);
  //     fileName = parts[0];

  //     console.log(mimeType);

  //     await Share.open({
  //       url: `data:${mimeType};base64,${uri}`,
  //       filename: fileName,
  //       isNewTask: true,
  //       title: "Save file",
  //       failOnCancel: false
  //     });
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  // const handleDownloadAndShowPdf = (uri, name) => {
  //   let parts = name.split('.');
  //   let extension = parts[parts.length - 1];
  //   let mimeType = getBase64MimeType(extension);

  //   try {
  //     const byteCharacters = atob(uri);
  //     const byteNumbers = new Array(byteCharacters.length);
  //     for (let i = 0; i < byteCharacters.length; i++) {
  //       byteNumbers[i] = byteCharacters.charCodeAt(i);
  //     }
  //     const byteArray = new Uint8Array(byteNumbers);
  //     const blob = new Blob([byteArray], { type: mimeType });
  //     const url = URL.createObjectURL(blob);

  //     const link = document.createElement('a');
  //     link.href = url;
  //     link.download = name;
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //     return url;
  //   } catch (e) {
  //     console.log(e);
  //     return null;
  //   }
  // };

  const updatePasswordProtected = () => {

    let currentRequestModel = JSON.parse(JSON.stringify(uploadDocumentSlices.data.OTHER_FILES));

    const currentMasterKey = uploadDocumentSlices.data.selectedDoc.master
    const currentChildKey = uploadDocumentSlices.data.selectedDoc.child
    currentRequestModel[currentMasterKey][currentChildKey].EnablePassword = !currentRequestModel[currentMasterKey][currentChildKey].EnablePassword

    console.log(currentRequestModel[currentMasterKey][currentChildKey])


    dispatch(updateOtherFile(currentRequestModel));
  };

  const updatePassword = (value) => {

    let currentRequestModel = JSON.parse(JSON.stringify(uploadDocumentSlices.data.OTHER_FILES));

    const currentMasterKey = uploadDocumentSlices.data.selectedDoc.master
    const currentChildKey = uploadDocumentSlices.data.selectedDoc.child

    currentRequestModel[currentMasterKey][currentChildKey].Password = value
    dispatch(updateOtherFile(currentRequestModel));

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
  const getIconName = (type) => {
    const iconNames = {
      "PAN Card": "id-card",
      "Aadhaar Card": "id-badge",
      "Passport": "file-o",
      "Electricity Bill": "bolt",
      "Bank Statement": "bank",
      "Form - 16": "file-text",
      "Salary Slip": "money",
    };
    return iconNames[type] || "file";
  };
  const goToEmandate = async () => {
    console.log(uploadDocumentSlices.data.OTHER_FILES)
    setOtherError(null)
    const realDocs = uploadDocumentSlices.data.OTHER_FILES
    const masterKeys = Object.keys(realDocs)
    for (let i = 0; i < masterKeys.length; i++) {
      const currentMaster = realDocs[masterKeys[i]]
      if (currentMaster.MandatoryFlag != 1) {
        continue;
      }

      const childKeys = Object.keys(realDocs[masterKeys[i]])
      let isFileAvailable = false
      for (let j = 0; j < childKeys.length; j++) {
        if (realDocs[masterKeys[i]][childKeys[j]].Base64) {
          isFileAvailable = true
        }
      }

      if (!isFileAvailable) {
        setOtherError(`Please provide document for ${masterKeys[i]}`)
        return
      }
    }
    // for (let i = 0; i < uploadDocumentSlices.data.OTHER_FILES.length; i++) {
    // if (!uploadDocumentSlices.data.OTHER_FILES[i].OriginalFile && uploadDocumentSlices.data.MASTER_OPTION[i].MandatoryFlag == 1) {
    //   let currentFile = { ...uploadDocumentSlices.data.OTHER_FILES[i], Error: "* Please Provide " + uploadDocumentSlices.data.MASTER_OPTION[i].DoctypeType };
    //   console.log(currentFile);
    //   dispatch(updateOtherFile({
    //     data: currentFile,
    //     index: i
    //   }));
    //   return;
    // }
    // }

    if (await checkLocationPermission() === false) {
      navigation.navigate("PermissionsScreen", { permissionStatus: "denied", permissionType: "location" });
      return;
    }

    setLoading(true);



    const saveLeadStageResponse = await SaveLeadStage(stageMaintance.jumpTo)
    if (saveLeadStageResponse.status == STATUS.ERROR) {
      setLoading(false)
      setOtherError(null)
      setNewErrorScreen(saveLeadStageResponse.message)
      return
    }

    dispatch(updateJumpTo(stageMaintance))



    console.log("========== fetching location =================");
    await SendGeoLocation(9);
    console.log("========== fetching location =================");
    setLoading(false);

    navigation.navigate('eMandate');
  };


  useEffect(() => {
    try {
      scrollViewRef.current?.scrollTo({ x: 0, animated: true });

    }
    catch (e) {

    }
  }, [uploadDocumentSlices.data.selectedDoc])

  const renderDocList = (list) => (

    list &&
    <View style={styles.DoctabContainer}>
      <FlatList
        ref={tabsRef}
        data={list}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={[styles.Doctab, uploadDocumentSlices.data.selectedDoc.master == item.DoctypeType && styles.DocselectedTab]}
            onPress={() => {
              console.log("clicked : ", index)
              dispatch(updateMasterSelected(item.DoctypeType))

            }}>
            <Text style={[styles.DoctabText, uploadDocumentSlices.data.selectedDoc.master == item.DoctypeType && styles.DocselectedTabText,
            ]}>
              {item.DoctypeType}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.DoctypeType}
      />
      <TouchableOpacity style={styles.DocaddButton} onPress={null}>
        <Text style={styles.DocaddButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / itemWidth);
    setActiveIndex(index);
  };

  const renderDots = (list) => {
    const filteredKeys = Object.keys(list).filter((item) => item !== "MandatoryFlag");
    return (
      <View style={[styles.dotsContainer, { marginTop: 20 }]}>
        {filteredKeys.map((_, index) => (
          <Pressable  key={index} onPress={() => { scrollViewRef.current?.scrollTo({ x: index, animated: true }) }}>
            <View
             
              style={[
                styles.dot,
                index === activeIndex ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          </Pressable>

        ))}

      </View>

    );
  };


  const renderChildType = (list) => (
    list && (
      <View style={[{ flexDirection: "column", marginVertical: 20 }]}>
        <Text style={styles.sectionTitle}>Select ID Type</Text>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <ScrollView
            ref={scrollViewRef}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            style={{ flex: 1 }}
          >
            {Object.keys(list).filter((item) => item !== "MandatoryFlag").map(element => (
              <TouchableOpacity
                key={element}
                style={[
                  styles.docTypeButton,
                  { minWidth: itemWidth },
                  uploadDocumentSlices.data.selectedDoc.child === element && styles.selectedDocTypeButton
                ]}
                onPress={() => changeType(element)}
              >
                <View style={{ flexDirection: "column", alignItems: "center" }}>
                  <Icon
                    name={getIconName(element)}
                    size={24}
                    color={uploadDocumentSlices.data.selectedDoc.child === element ? "#fff" : "#00194c"}
                  />
                  <View style={{ height: 4 }} />
                  <Text
                    style={{
                      color: uploadDocumentSlices.data.selectedDoc.child === element ? "#fff" : "#00194c"
                    }}
                  >
                    {element}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {renderDots(list)}
        </View>
      </View>
    )
  );


  const RenderDocumentPreviews = (selectedFile) =>
    selectedFile ? (
      <View style={styles.fileUploadContainer}>
        <View style={styles.uploadPreviewContainer}>
          <View style={styles.previewArea}>
            <View style={{ flex: 1, width: "100%", height: "100%" }}>
              {selectedFile.Base64 != null &&
                (isImage(selectedFile.Name) ? (
                  <Image
                    source={{
                      uri: `data:image/png;base64,${selectedFile.Base64}`,
                    }}
                    style={{ flex: 1 }}
                    resizeMode="contain" // or 'cover', 'stretch', etc.
                    onError={(e) => console.error("Error loading image", e)}
                  />
                ) : (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}>
                    <Icon name={"file"} size={24} />
                    <View style={{ height: 5 }} />
                    <Text>{selectedFile.Name}</Text>
                  </View>
                ))}

              {selectedFile.Base64 != null && (
                <TouchableOpacity
                  style={styles.closePDF}
                  onPress={() => {
                    handleDeleteFile(selectedFile.Id);
                  }}>
                  <Icon name="times-circle" size={24} color="#FF0000" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.uploadButtonsContainer}>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => {
                handleDocumentPick("library");
              }}>
              <Icon name="upload" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => {
                handleDocumentPick("camera");
              }}>
              <Icon name="camera" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    ) : (
      <View style={styles.previewPlaceholder}>
        <ImageBackground
          source={require("../../assets/images/dummyid.png")}
          style={styles.previewPlaceholder}>
          <Text style={styles.previewPlaceholderText}>Preview</Text>
        </ImageBackground>
      </View>
    );




  const RenderPasswordInput = (selectedFile) => (


    selectedFile && <View style={styles.passwordContainer}>
      <View style={styles.passwordLabelContainer}>
        <Text style={styles.passwordLabel}>Password</Text>

        <TouchableOpacity
          style={{ flexDirection: "row", backgroundColor: selectedFile.EnablePassword ? "#00194C" : "#E0E0E0", borderRadius: 30, paddingHorizontal: 7, paddingVertical: 2 }}
          onPress={() => { updatePasswordProtected() }}
        >

          {selectedFile.EnablePassword ?
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.passwordToggleTextEnabled}>YES</Text>
              <View style={{ width: 10 }}></View>
              <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: "white" }}>

              </View>
            </View>
            :
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: "white" }} />
              <View style={{ width: 10 }}></View>
              <Text style={styles.passwordToggleTextDisabled}>NO</Text>

            </View>
          }

        </TouchableOpacity>

        {/* <TouchableOpacity style={{ flexDirection: "row" }}>
          <Text>YES</Text>
          <View style={{ width: 5 }}></View>
          <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: "red" }}>

          </View>
        </TouchableOpacity> */}

        {/* 
        <TouchableOpacity
          style={[styles.passwordToggle, uploadDocumentSlices.data.OTHER_FILES[uploadDocumentSlices.data.currentSelectedItem].EnablePassword
            ? styles.passwordToggleEnabled
            : styles.passwordToggleDisabled]}
          onPress={() => { updatePasswordProtected() }}
          activeOpacity={0.8}>


          {uploadDocumentSlices.data.OTHER_FILES[uploadDocumentSlices.data.currentSelectedItem].EnablePassword ?

            <>
              <Text
                style={[
                  styles.passwordToggleText, styles.passwordToggleTextEnabled,
                ]}>
                {"YES"}

              </Text>
              <View style={[styles.passwordToggleKnobEnabled, { backgroundColor: "white" }]}>

              </View>
            </>

            :
            <>
              <View style={[styles.toggleKnob, styles.passwordToggleKnobDisabled]}>

              </View>
              <Text
                style={[
                  styles.passwordToggleText,
                  styles.passwordToggleTextDisabled,
                ]}>
                {"NO"}

              </Text>
            </>

          }
         
        </TouchableOpacity> */}


      </View>
      {
        <View style={styles.passwordInputContainer}>
          <TextInput

            style={styles.passwordInput}
            secureTextEntry={true}
            value={selectedFile.Password}
            onChangeText={updatePassword}
            editable={selectedFile.EnablePassword}
          />
        </View>
      }
    </View>)

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
          <View style={{ paddingHorizontal: 16 }}>
            <ProgressBar progress={0.5} />
            <Text
              style={[
                styles.headerText,
                { fontSize: dynamicFontSize(styles.headerText.fontSize) },
              ]}>
              Document Upload
            </Text>
          </View>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.container}>

              {otherError ? (
                <Text
                  style={[
                    styles.errorText,
                    { fontSize: dynamicFontSize(styles.errorText.fontSize) },
                  ]}>
                  {otherError}
                </Text>
              ) : null}



              {renderDocList(uploadDocumentSlices.data.MASTER_OPTION)}
              {renderChildType(uploadDocumentSlices.data.OTHER_FILES[uploadDocumentSlices.data.selectedDoc.master])}

              {uploadDocumentSlices.data.selectedDoc.master && uploadDocumentSlices.data.selectedDoc.child && <>
                <View>
                  <Text style={styles.sectionTitle}>File Upload OR Take Photo</Text>
                  <View style={styles.FileControllerContainer}>
                    {RenderDocumentPreviews(uploadDocumentSlices.data.OTHER_FILES[uploadDocumentSlices.data.selectedDoc.master][uploadDocumentSlices.data.selectedDoc.child])}
                    {RenderPasswordInput(uploadDocumentSlices.data.OTHER_FILES[uploadDocumentSlices.data.selectedDoc.master][uploadDocumentSlices.data.selectedDoc.child])}
                  </View>
                </View>
                <View style={styles.paddingBottom}></View>
              </>}





            </View>
          </ScrollView>
          <View style={[styles.actionContainer, styles.boxShadow]}>
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
