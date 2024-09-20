import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, ImageBackground, Dimensions, useWindowDimensions, FlatList, Image, TextInput, Animated, Pressable, Alert } from 'react-native';
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
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import { CheckCircle2, MapPin, Lock, Building2 } from 'lucide-react';


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

  const changeType = (value, index) => {
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


            if (data != null) {

              const mimeType = data.uri.split(';')[0].split(':')[1];
              const fileName = generateUniqueAddress(DisplayName, null, "png");
              document = base64ToFile(data.uri, mimeType, fileName);


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
      pagerViewRef.current?.scrollToIndex({ index: 0, animated: true });

    }
    catch (e) {

    }
  }, [uploadDocumentSlices.data.selectedDoc.master])

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
              dispatch(updateMasterSelected(item.DoctypeType))

            }}>
            <Text style={[styles.DoctabText, uploadDocumentSlices.data.selectedDoc.master == item.DoctypeType && styles.DocselectedTabText,
            ]}>
              {item.DoctypeType}

              {item.MandatoryFlag == "1" && <Text style={styles.mandatoryStar}> *</Text>}
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
    const maxScrollPosition = event.nativeEvent.contentSize.width - windowWidth;

    if (scrollPosition >= maxScrollPosition) {
      // We're at the end, select the last item
      const filteredKeys = getFilteredKeys();
      setActiveIndex(filteredKeys.length - 1);
    } else {
      const index = Math.round(scrollPosition / itemWidth);
      setActiveIndex(index);
    }
  };

  const getFilteredKeys = () => {
    const selectedMaster = uploadDocumentSlices.data?.selectedDoc?.master;
    const otherFiles = uploadDocumentSlices.data?.OTHER_FILES;
    if (selectedMaster && otherFiles && otherFiles[selectedMaster]) {
      return Object.keys(otherFiles[selectedMaster]).filter(item => item !== "MandatoryFlag");
    }
    return [];
  };
  const pagerViewRef = useRef(null);


  useEffect(() => {
    const selectedChild = uploadDocumentSlices.data?.selectedDoc?.child;
    if (selectedChild && pagerViewRef.current) {
      const filteredKeys = getFilteredKeys();
      const index = filteredKeys.indexOf(selectedChild);
      if (index !== -1) {
        // pagerViewRef.current?.scrollToIndex(Math.floor(index / 3) || 0, false);
      }
    }
  }, [uploadDocumentSlices.data?.selectedDoc?.child]);


  const TabsView = ({ items = [], filteredKeys }) => (<View style={{ height: 100, width: swiperWidth, flexDirection: "row", justifyContent: "space-between" }}>
    {items.map((element, idx) => {
      const isSelected = uploadDocumentSlices.data.selectedDoc.child === element;
      const truncatedText = element.length > 12 ? element.slice(0, 12) + '...' : element;

      <View style={{ height: 100, width: 200, backgroundColor: "red" }}>
        <Text>{truncatedText}</Text>

      </View>
      // <TouchableOpacity
      //   key={element}
      //   style={[
      //     styles.docTypeButton,
      //     isSelected && styles.selectedDocTypeButton
      //   ]}
      //   onPress={() => changeType(element, filteredKeys.indexOf(element))}
      // >
      //   <View style={{ flexDirection: "column", alignItems: "center" }}>
      //     <Icon
      //       name={getIconName(element)}
      //       size={24}
      //       color={isSelected ? "#fff" : "#00194c"}
      //     />
      //     <View style={{ height: 4 }} />
      //     <Text
      //       style={{
      //         color: isSelected ? "#fff" : "#00194c",
      //         fontFamily: 'Poppins_400Regular',
      //         fontSize: 11,
      //         overflow: 'hidden', // Hide overflow
      //         textOverflow: 'ellipsis', // Show ellipsis
      //         whiteSpace: 'nowrap', // Prevent text wrapping (for web, not for React Native)
      //       }}
      //       numberOfLines={1} // Limit to one line
      //     >
      //       {truncatedText}
      //     </Text>
      //   </View>
      // </TouchableOpacity>
    })}
  </View>
  )


  const renderChildType = () => {
    const filteredKeys = getFilteredKeys();
    if (filteredKeys.length === 0) return null;

    // Group filteredKeys into sets of 3
    const groupedKeys = filteredKeys.reduce((resultArray, item, index) => {
      const chunkIndex = Math.floor(index / 3);
      if (!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = [] // start a new chunk
      }
      resultArray[chunkIndex].push(item);
      console.log(resultArray)
      return resultArray
    }, []);

    return (


      <View style={[{ flexDirection: "column", paddingVertical: 10 }]}>
        <Text style={styles.sectionTitle}>Select ID Type</Text>
        <View>
          {/* <PagerView
            style={styles.pagerView}
            initialPage={0}
            onPageSelected={(e) => {
              setActiveIndex(e.nativeEvent.position || 0)
            }}
            ref={pagerViewRef}
          >
            {groupedKeys.map((group, pageIndex) => (
              <View key={pageIndex} style={styles.pageStyle}>
                {group.map((element) => {
                  const isSelected = uploadDocumentSlices.data.selectedDoc.child === element;
                  const truncatedText = element.length > 12 ? element.slice(0, 12) + '...' : element;

                  return (
                    <TouchableOpacity
                      key={element}
                      style={[
                        styles.docTypeButton,
                        isSelected && styles.selectedDocTypeButton
                      ]}
                      onPress={() => changeType(element, filteredKeys.indexOf(element))}
                    >
                      <View style={{ flexDirection: "column", alignItems: "center" }}>
                        <Icon
                          name={getIconName(element)}
                          size={24}
                          color={isSelected ? "#fff" : "#00194c"}
                        />
                        <View style={{ height: 4 }} />
                        <Text
                          style={{
                            color: isSelected ? "#fff" : "#00194c",
                            fontFamily: 'Poppins_400Regular',
                            fontSize: 11,
                            overflow: 'hidden', // Hide overflow
                            textOverflow: 'ellipsis', // Show ellipsis
                            whiteSpace: 'nowrap', // Prevent text wrapping (for web, not for React Native)
                          }}
                          numberOfLines={1} // Limit to one line
                        >
                          {truncatedText}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </PagerView> */}

          <SwiperFlatList
            ref={pagerViewRef}
            onLayout={(event) => {
              const { width } = event.nativeEvent.layout;
              setSwiperWidth(width); // Update the width when layout changes
            }}

            onChangeIndex={({index, preIndex})=>{setActiveIndex(index)}}
            
            index={0}
            scrollEnabled={true}
            horizontal
            data={groupedKeys}
            
            renderItem={({ item, index }) => {
              return (
                <View key={index} style={{ flexDirection: 'row' , width:swiperWidth}}>
                  {item.map((element, idx) => {
                    const isSelected = uploadDocumentSlices.data.selectedDoc.child === element;
                    const truncatedText = element.length > 12 ? element.slice(0, 12) + '...' : element;

                    return (
                      <TouchableOpacity
                        key={element}
                        style={[
                          styles.docTypeButton,
                          isSelected && styles.selectedDocTypeButton,
                          {width:"30%", marginHorizontal:7}
                        ]}
                        onPress={() => changeType(element, filteredKeys.indexOf(element))}
                      >
                        <View style={{ flexDirection: "column", alignItems: "center" }}>
                          <Icon
                            name={getIconName(element)}
                            size={24}
                            color={isSelected ? "#fff" : "#00194c"}
                          />
                          <View style={{ height: 4 }} />
                          <Text
                            style={{
                              color: isSelected ? "#fff" : "#00194c",
                              fontFamily: 'Poppins_400Regular',
                              fontSize: 11,
                              overflow: 'hidden', // Hide overflow
                              textOverflow: 'ellipsis', // Show ellipsis
                              whiteSpace: 'nowrap', // Prevent text wrapping (for web, not for React Native)
                            }}
                            numberOfLines={1} // Limit to one line
                          >
                            {truncatedText}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              );
            }}
          />
        </View>
        <RenderDots groupedKeys = {groupedKeys}/>
      </View>
    );
  };

  const RenderDots = ({groupedKeys}) => {

    return (
      <View style={[styles.dotsContainer, { marginTop: 10 }]}>
        {groupedKeys.map((_, index) => (
          <Pressable
            key={index}
          >
            <View
              style={[
                styles.dot,
                activeIndex === index ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          </Pressable>
        ))}
      </View>
    );
  };

  const RenderDocumentPreviews = (selectedFile) => (
    <View style={styles.fileUploadContainer}>
      <View style={styles.uploadPreviewContainer}>
        <View style={styles.previewArea}>
          <View style={{ flex: 1, width: "100%", height: "100%" }}>
            {selectedFile.Base64 ?
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
                  <Text style={{ fontFamily: "Poppins_400Regular" }}>{selectedFile.Name}</Text>
                </View>
              )) :
              <View style={styles.previewPlaceholder}>
                <ImageBackground
                  source={require("../../assets/images/dummyid.png")}
                  style={[styles.previewPlaceholder]}>
                  <Text style={styles.previewPlaceholderText}>Preview</Text>
                </ImageBackground>
              </View>

            }

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
  )




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
              <View style={{ width: 10, height: 10, borderRadius: 10, backgroundColor: "white" }}>

              </View>
            </View>
            :
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ width: 10, height: 10, borderRadius: 10, backgroundColor: "white" }} />
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

            style={[styles.passwordInput, { fontFamily: "Poppins_400Regular" }]}
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
  const imageContainerStyle = isDesktop ? { width: '60%' } : { width: '100%' };

  const [swiperWidth, setSwiperWidth] = useState(Dimensions.get('window').width); // Default to screen width

  const steps = [
    { id: 1, title: 'Primary Information', subtitle: 'प्राथमिक जानकारी', icon: CheckCircle2, status: 'current' },
    { id: 2, title: 'Personal Information', subtitle: 'व्यक्तिगत जानकारी', icon: MapPin, status: 'disabled' },
    { id: 3, title: 'eKYC OTP Verification', subtitle: 'ईकेवाईसी ओटीपी सत्यापन', icon: Lock, status: 'disabled' },
    { id: 4, title: 'Address Details', subtitle: 'पते का विवरण', icon: Building2, status: 'disabled' },
  ];

  return (
    <View style={styles.mainContainer}>
      <View style={{ flex: 1, flexDirection: isWeb ? "row" : "column" }}>
        {isWeb && (isDesktop || (isTablet && width > height)) && (
          <View style={[styles.leftContainer, imageContainerStyle]}>
            <View style={styles.mincontainer}>
              <View style={styles.webheader}>
                <Text style={styles.websubtitleText}>Get Your</Text>
                <Text style={styles.WebheaderText}>Loan Approved</Text>
              </View>
              <View>
                {steps.map((step, index) => (
                  <View key={step.id} style={styles.step}>
                    <View
                      style={[
                        styles.stepiconContainer,
                        step.status === "done" && styles.stepiconContainerDone,
                        step.status === "current" &&
                          styles.stepiconContainerCurrent,
                        step.status === "disabled" &&
                          styles.stepiconContainerDisabled,
                      ]}>
                      <step.icon
                        size={24}
                        color={
                          step.status === "disabled" ? "#A0AEC0" : "#FFFFFF"
                        }
                      />
                    </View>
                    <View style={styles.steptextContainer}>
                      <Text
                        style={[
                          styles.steptitle,
                          step.status === "disabled" && styles.steptextDisabled,
                        ]}>
                        {step.title}
                      </Text>
                      <Text
                        style={[
                          styles.stepsubtitle,
                          step.status === "disabled" && styles.steptextDisabled,
                        ]}>
                        {step.subtitle}
                      </Text>
                    </View>
                    {index < steps.length - 1 && (
                      <View style={styles.connectorContainer}>
                        {[...Array(10)].map((_, i) => (
                          <View
                            key={i}
                            style={[
                              styles.dashItem,
                              step.status === "done" && styles.dashItemDone,
                            ]}
                          />
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>
              <View style={styles.bottomFixed}>
                <Image
                  source={require("../../assets/images/poweredby.png")}
                  style={styles.logo}
                />
              </View>
            </View>
          </View>
        )}
        <KeyboardAvoidingView
          style={[styles.rightCOntainer, { flex: 1 }]}
          behavior={Platform.OS === "ios" ? "padding" : null}
          keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}>
          <LoadingOverlay visible={loading} />
          <View style={styles.centerAlignedContainerHeader}>
            <View style={{ padding: 16, paddingBottom: 5 }}>
              <ProgressBar progress={0.5} />
              <Text
                style={[
                  styles.headerText,
                  { fontSize: dynamicFontSize(styles.headerText.fontSize) },
                ]}>
                Document Upload
              </Text>
            </View>
            </View>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <View style={styles.centerAlignedContainer}>
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
                {/* {renderChildType(uploadDocumentSlices.data.OTHER_FILES[uploadDocumentSlices.data.selectedDoc.master])}
                 */}
                {renderChildType()}

                {uploadDocumentSlices.data.selectedDoc.master &&
                  uploadDocumentSlices.data.selectedDoc.child && (
                    <>
                      <View>
                        <Text style={styles.sectionTitle}>
                          File Upload OR Take Photo
                        </Text>
                        <View style={styles.FileControllerContainer}>
                          {RenderDocumentPreviews(
                            uploadDocumentSlices.data.OTHER_FILES[
                              uploadDocumentSlices.data.selectedDoc.master
                            ][uploadDocumentSlices.data.selectedDoc.child]
                          )}
                          {RenderPasswordInput(
                            uploadDocumentSlices.data.OTHER_FILES[
                              uploadDocumentSlices.data.selectedDoc.master
                            ][uploadDocumentSlices.data.selectedDoc.child]
                          )}
                        </View>
                      </View>
                      <View style={styles.paddingBottom}></View>
                    </>
                  )}
              </View>
              </View>
            </ScrollView>
         
          <View style={[styles.boxShadow]}>
            <View
              style={[styles.actionContainer, styles.centerAlignedContainer]}>
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

          {errorScreen.type != null && (
            <ScreenError
              errorObject={errorScreen}
              onTryAgainClick={onTryAgainClick}
              setNewErrorScreen={setNewErrorScreen}
            />
          )}

          <DownloadPopup
            path={downloadPath}
            onClose={() => {
              setDownloadPath(null);
            }}
          />
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