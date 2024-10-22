import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useWindowDimensions,
  Image,
  Linking,
  Alert,
  BackHandler,
  ImageBackground
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { styles } from '../services/style/gloablStyle';
import CustomInput, { AadharMaskedCustomInput } from '../components/input';
import { useProgressBar } from '../components/progressContext';
import ProgressBar from '../components/progressBar';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppContext } from '../components/useContext';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import ScreenError, { useErrorEffect } from './ScreenError';
import LoadingOverlay from '../components/FullScreenLoader';
import {
  sagaFetchFileRequest,
  sagaSubmitFileRquest,
  updateAadhaarNumber,
  updatePanNumber,
  deleteDocumentFile,
  updateFileRemove,
} from '../services/Utils/Redux/UploadDocumentSlices';
import { fetchGetBorrowerAddress } from '../services/Utils/Redux/AddressDetailSlices';
import { API_RESPONSE_STATUS, STATUS } from '../services/API/Constants';
import {
  base64ToFile,
  DownloadMyFile, DownloadMyFileWithBase64, generateUniqueAddress,
  getBase64MimeType,
  isValidAadhaar,
  isValidPan,
} from '../services/Utils/FieldVerifier';
import { clearAadhaarCkyc, executePanCkyc, updatePanError } from '../services/Utils/Redux/DocumentVerificationSlices';
import MaskInput from 'react-native-mask-input';
import * as DocumentPicker from 'expo-document-picker';
import { checkCameraPermission, checkImagePermission, checkLocationPermission } from './PermissionScreen';
import { useFocusEffect } from '@react-navigation/native';
import DownloadPopup from '../components/DownloadPopup';

import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { AADHAAR_BACK_CODE, AADHAAR_FRONT_CODE, ALL_SCREEN, Network_Error, PAN_CODE } from '../services/Utils/Constants';
import { GoBack } from '../services/Utils/ViewValidator';
import { CreateBorrowerLeadFromDocuments } from '../services/API/CreateBorrowerLead';
import { SubmitAddressFromDocuments } from '../services/API/AddressDetails';
import PostSaveProceedtage from '../services/API/SaveProceedStage';
import { updateJumpTo } from '../services/Utils/Redux/LeadStageSlices';
import { StoreUserAadhaar, StoreUserPan } from '../services/LOCAL/AsyncStroage';
import { DeleteUploadFiles } from '../services/API/DocumentUpload';
import useJumpTo from "../components/StageComponent";
import { CheckCircle2, MapPin, Lock, Building2 } from 'lucide-react';


const PrimaryInfo = ({ navigation }) => {

  const stageMaintance = useJumpTo("primaryInfo", "personalInfo", navigation);

  const documentationKycStatus = useSelector((state) => state.documentVerificationSlices);
  const AddressDetailSlice = useSelector((state) => state.addressDetailSlices);
  const uploadDocumentSlices = useSelector((state) => state.uploadDocumentSlices);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [panMessage, setPanMessage] = useState(null)
  const [otherError, setOtherError] = useState(null)
  const [phone, setPhone] = React.useState('');
  const [refreshPage, setRefreshPage] = useState(true)
  const extraSlices = useSelector(state => state.extraStageSlice);

  const [submitStart, setSubmitStart] = useState(null) //isSkiped, isProcced
  // Simulated state for dummy documents
  const { setProgress } = useProgressBar();
  const { fontSize } = useAppContext();
  const dynamicFontSize = (size) => size + fontSize;
  const [downloadPath, setDownloadPath] = useState(null)
  const [uploadProgress, setUploadProgress] = useState({ pan: 0, aadhaar: 0 });

  const onTryAgainClick = () => {
    setRefreshPage(true);
  };
  const { errorScreen, setNewErrorScreen } = useErrorEffect(onTryAgainClick);

  useFocusEffect(
    useCallback(() => {


      setProgress(0.02);

      if (!refreshPage) {
        return;
      }
      setSubmitStart(null)
      dispatch(sagaFetchFileRequest(true))
      setRefreshPage(false)

    }, [refreshPage]))


  useEffect(() => {
    const backAction = () => {

      GoBack(navigation)

      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    // if (uploadDocumentSlices.loading == false && documentationKycStatus.panLoading == true) {
    // if (uploadDocumentSlices.loading == false) {
    //   return
    // }

    // console.log("uploadDocumentSlices.loading", uploadDocumentSlices.loading)

    setLoading(uploadDocumentSlices.loading)
  }, [uploadDocumentSlices.loading])



  useEffect(() => {
    setNewErrorScreen(null);
    if (uploadDocumentSlices.error === Network_Error || uploadDocumentSlices.error !== null) {
      setNewErrorScreen(uploadDocumentSlices.error);
    }
  }, [uploadDocumentSlices.error]);

  useEffect(() => {
    setNewErrorScreen(null);
    if (documentationKycStatus.aadharError === Network_Error || documentationKycStatus.aadharError !== null) {
      setNewErrorScreen(documentationKycStatus.aadharError);
    }
  }, [documentationKycStatus.aadharError]);

  useEffect(() => {
    setNewErrorScreen(null);
    if (documentationKycStatus.panMessage === Network_Error || documentationKycStatus.panMessage !== null) {
      setNewErrorScreen(documentationKycStatus.panMessage);
    }
  }, [documentationKycStatus.panMessage]);

  useEffect(() => {
    setOtherError(uploadDocumentSlices.error);
  }, [uploadDocumentSlices.error]);

  useEffect(() => {
    const isPanCorrect = isValidPan(uploadDocumentSlices.data.PAN)
    if (isPanCorrect != null) {
      return
    }

    console.log(`============================= start pan ckyc ${uploadDocumentSlices.data.PAN} ==========================================`)
    dispatch(executePanCkyc(uploadDocumentSlices.data.PAN))
  }, [uploadDocumentSlices.data.PAN])


  // useEffect(() => {

  //   if (documentationKycStatus.panLoading == false && uploadDocumentSlices.loading == true) {
  //     return
  //   }
  //   console.log("chnage loading from DocumentationKycStatus", documentationKycStatus.panLoading)

  //   setLoading(documentationKycStatus.panLoading)
  // }, [documentationKycStatus.panLoading])



  useEffect(() => {
    // setLoading(documentationKycStatus.panLoading)


    console.log("====== PRESS TO GO AHEAD ======")

    if (submitStart != null) {
      setLoading(true)
      console.log("====== PRESS TO GO AHEAD : LOADER STARTED ======")

      if (documentationKycStatus.panLoading) {
        console.log("====== PRESS TO GO AHEAD : PA  WORKED IS GOING ON ======")
        return
      }

      console.log("====== PRESS TO GO AHEAD : LETS SUBMIT DATA ======")

      UploadAllFiles(submitStart == "isSkiped" ? true : false).then((response) => {

        console.log("====== PRESS TO GO AHEAD : DATA SUBMITED ======")

        setLoading(false)
        setSubmitStart(null)
        setNewErrorScreen(null)
        if (response.status == STATUS.ERROR) {
          setNewErrorScreen(response.message)
          return
        }
        setOtherError(null)

        console.log(`================= navigate to ${response.data} =======================`)
        if (submitStart == "isSkiped") {
          navigation.navigate("personalInfo")
        }
        else {
          navigation.navigate(response.data)

        }

      })

    }




  }, [submitStart, documentationKycStatus.panLoading])


  useEffect(() => {
    setPanMessage(documentationKycStatus.panMessage);
  }, [documentationKycStatus.panMessage]);

  const handlePanChange = (pan) => {
    dispatch(updatePanNumber(pan));
  };

  const handleAadhaarChange = (aadhaar) => {
    dispatch(updateAadhaarNumber(aadhaar));
  };

  const handleDeleteDocument = async (docId) => {
    if (docId) {
      setLoading(true)
      const deleteResponse = await DeleteUploadFiles(docId)
      setLoading(false)
      if (deleteResponse.status == STATUS.ERROR) {
        setNewErrorScreen(deleteResponse.message)
        return;
      }


      dispatch(updateFileRemove(docId))


    }
  };

  const handleDownloadDocument = (uri) => {
    Linking.openURL(uri).catch((err) => console.error("Couldn't load document", err));
  };

  const handleDocumentAction = async (documentType, actionType, docCode) => {
    let result = null;
    let document = null;

    if (actionType === 'camera') {
      if ((await checkCameraPermission()) === false) {
        navigation.navigate('PermissionsScreen', { permissionStatus: 'denied', permissionType: 'camera' });
        return;
      }
    } else {
      if ((await checkImagePermission()) === false) {
        navigation.navigate('PermissionsScreen', { permissionStatus: 'denied', permissionType: 'files' });
        return;
      }
    }

    try {
      if (actionType === 'upload') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Permission to access the media library is required!');
          return;
        }

        if (Platform.OS === 'web') {
          result = await DocumentPicker.getDocumentAsync({
            type: '*/*',
          });

          if (result && !result.canceled && result.assets != null && result.assets.length > 0) {
            let fileData = result.assets[0]
            document = fileData.file
            console.log(document)
          }
        } else {
          result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.6,
          });

          if (result && !result.canceled && result.assets != null && result.assets.length > 0) {
            let fileData = result.assets[0]
            const fileName = generateUniqueAddress(documentType, fileData.name || fileData.uri.split('/').pop());
            document = { uri: fileData.uri, name: fileName, type: fileData.mimeType };
          }
        }
      } else if (actionType === 'camera') {
        if (Platform.OS === 'web') {
          navigation.navigate('WebCameraScreen', {
            onGoBack: (data) => {
              if (data !== null) {
                const mimeType = data.uri.split(';')[0].split(':')[1];
                const fileName = generateUniqueAddress(documentType, null, 'png');
                document = base64ToFile(data.uri, mimeType, fileName);

                if (documentType === 'pan') {
                  dispatch(sagaSubmitFileRquest(document, docCode));
                } else if (documentType === 'aadhaar') {
                  dispatch(sagaSubmitFileRquest(document, docCode));
                  
                }
              }
            },
          });
          return;
        } else {
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
            let fileData = result.assets[0]
            const fileName = generateUniqueAddress(documentType, fileData.name || fileData.uri.split('/').pop());
            document = { uri: fileData.uri, name: fileName, type: fileData.mimeType };
          }
        }
      }

      if (document !== null) {
        if (documentType === 'pan') {
          dispatch(sagaSubmitFileRquest(document, docCode));
        } else if (documentType === 'aadhaar') {
          dispatch(sagaSubmitFileRquest(document, docCode));
        }
      }
    } catch (error) {
      console.error(`${actionType} error: `, error);
    }
  };



  const renderDocumentPreviews = (doc, placeHolderText) => {

    if (doc?.OriginalFile) {
      return (
        <View style={styles.previewDoc}>
          <View style={styles.previewDocWrapper}>
            <View style={styles.previewHeader}>
              <Image
                source={{ uri: `data:image/png;base64,${doc.OriginalFile}` }}
                style={styles.docImagePreview}
                resizeMode="contain"
                onError={(e) => console.error('Error loading image', e)}
              />
              <TouchableOpacity
                style={styles.docdeleteButton}
                onPress={() => handleDeleteDocument(doc.DocType)}>
                <AntDesign name="closecircleo" size={16} color="#FF0000" />
              </TouchableOpacity>
            </View>
          </View>

        </View>

      );
    }

    return (
      <View style={styles.previewPlaceholder}>
        <ImageBackground source={require('../../assets/images/dummyid.png')} style={styles.previewPlaceholder}>
          <Text style={styles.previewPlaceholderText}>
          {placeHolderText}
          </Text>
        </ImageBackground>
      </View>
    );

  };









  const UploadAllFiles = async (fromSkip = false) => {
    let response = API_RESPONSE_STATUS(STATUS.SUCCESS);
    const panValidation = isValidPan(uploadDocumentSlices.data.PAN);
    if (panValidation === null) {
      const requestModel = {
        PanComprehensive: documentationKycStatus.data.PanComprehensive,
        PanOcr: documentationKycStatus.data.PanOcr,
        PanCkyc: documentationKycStatus.data.PanCkyc,
        AadhaarOcr: documentationKycStatus.data.AadhaarOcr,
        AadhaarEkyc: documentationKycStatus.data.AadhaarEkyc,
        Cibil: documentationKycStatus.data.Cibil,
      };

      await CreateBorrowerLeadFromDocuments(requestModel);

      let id = 0;
      if (AddressDetailSlice.data !== null && AddressDetailSlice.data.length > 0) {
        id = AddressDetailSlice.data[0].Id || 0;
      }

      const submitAddressResponse = await SubmitAddressFromDocuments(requestModel, id);
      if (submitAddressResponse.status === STATUS.SUCCESS) {
        dispatch(fetchGetBorrowerAddress());
      }
    }

    await StoreUserPan(uploadDocumentSlices.data.PAN);
    await StoreUserAadhaar(uploadDocumentSlices.data.AADHAAR);

    const isValidAadhaarResponse = isValidAadhaar(uploadDocumentSlices.data.AADHAAR);
    if (isValidAadhaarResponse === null && !fromSkip) {
      dispatch(clearAadhaarCkyc());
      response.data = 'eKycVerify';
      return response;
    }

    const storeTheLead = await PostSaveProceedtage(stageMaintance.jumpTo);
    if (storeTheLead.status === STATUS.ERROR) {
      response.status = STATUS.ERROR;
      response.message = storeTheLead.message;
      return response;
    }

    dispatch(updateJumpTo(stageMaintance));

    response.data = 'personalInfo';

    return response;
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




  //   if (await checkImagePermission() == false) {
  //     navigation.navigate("PermissionsScreen", { permissionStatus: "denied", permissionType: 'files' })
  //     return
  //   }

  //   try {



  //     let Share = require('react-native-share').default;

  //     let fileName = name

  //     let parts = fileName.split('.');
  //     let extension = parts[parts.length - 1];

  //     let mimeType = getBase64MimeType(extension)
  //     fileName = parts[0];

  //     console.log(mimeType)

  //     let shareResult = await Share.open({
  //       url: `data:${mimeType};base64,${uri}`,
  //       filename: fileName,
  //       isNewTask: true,
  //       title: "Save file",
  //       failOnCancel: false
  //     })


  //   }
  //   catch (e) {
  //     console.log(e)
  //   }


  // }
  // const handleDownloadAndShowPdf = (uri, name) => {

  //   let parts = name.split('.');
  //   let extension = parts[parts.length - 1];
  //   let mimeType = getBase64MimeType(extension)

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
  const skipbuttonpress = async () => {

    if (extraSlices.isBreDone) {
      navigation.navigate('personalInfo');
      return;
    }

    if (await checkLocationPermission() == false) {
      navigation.navigate("PermissionsScreen", { permissionStatus: "denied", permissionType: "location" })
      return
    }
    if (!uploadDocumentSlices.data.PAN) {
      setOtherError("Please provide the PAN number")
      return
    }
    setSubmitStart("isSkiped")


  }



  const handleProceed = async () => {
    setOtherError(null)
    if (extraSlices.isBreDone) {
      navigation.navigate('personalInfo');
      return;
    }

    if (await checkLocationPermission() == false) {
      navigation.navigate("PermissionsScreen", { permissionStatus: "denied", permissionType: "location" })
      return
    }

    if (!uploadDocumentSlices.data.PAN) {
      setOtherError("Please provide the PAN number")
      return
    }


    setSubmitStart("isProcced")


  }


  const maskAadharNumber = (aadhar) => {
    if (aadhar === null || aadhar?.startsWith('null')) {
      return null;
    }
    return aadhar;
  };

  const maskPanNumber = (pan) => {
    if (pan === null || pan?.startsWith('null')) {
      return null;
    }
    return pan;
  };

  const { width, height } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';

  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;

  const containerStyle = isDesktop ? styles.desktopContainer : isMobile ? styles.mobileContainer : styles.tabletContainer;
  const imageContainerStyle = isDesktop ? { width: '60%' } : { width: '100%' };

  const steps = [
      { id: 1, title: 'Primary Information', subtitle: 'प्राथमिक जानकारी', icon: CheckCircle2, status: 'current' },
      { id: 2, title: 'Personal Information', subtitle: 'व्यक्तिगत जानकारी', icon: MapPin, status: 'disabled' },
      // { id: 3, title: 'eKYC OTP Verification', subtitle: 'ईकेवाईसी ओटीपी सत्यापन', icon: Lock, status: 'disabled' },
      { id: 3, title: 'Address Details', subtitle: 'पते का विवरण', icon: Building2, status: 'disabled' },
      { id: 4, title: 'Employment Details', subtitle: 'रोजगार विवरण', icon: Building2, status: 'disabled' },
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
          <View style={[styles.centerAlignedContainer, { padding: 16, paddingBottom: 0 }]}>
            <ProgressBar progress={0.02} />
            <Text
              style={[
                styles.headerText,
                { fontSize: dynamicFontSize(styles.headerText.fontSize) },
              ]}>
              Primary Information
            </Text>
          </View>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.centerAlignedContainer}>
            <View style={styles.container}>
              <View>
                {otherError && (
                  <Text
                    style={[
                      styles.errorText,
                      { fontSize: dynamicFontSize(styles.errorText.fontSize) },
                    ]}>
                    {otherError}
                  </Text>
                )}
                {/* PAN Upload Section */}
                <Text
                  style={[
                    styles.label,
                    { fontSize: dynamicFontSize(styles.label.fontSize) },
                  ]}>
                  PAN <Text style={styles.mandatoryStar}>*</Text>
                </Text>
                <View style={styles.docCaptureWrapper}>
                  <View style={styles.docFlex}>
                    <View style={styles.previewWrapper}>


                      {renderDocumentPreviews(
                        uploadDocumentSlices.data.PAN_FILES[0],
                        "Preview PAN"
                      )}
                    </View>
                    <View style={styles.docButtonWrapper}>
                      <TouchableOpacity
                        style={styles.docButton}
                        onPress={() => handleDocumentAction("pan", "upload", PAN_CODE)}>
                        <Feather name="upload" size={24} color="#ffffff" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.docButton}
                        onPress={() => handleDocumentAction("pan", "camera", PAN_CODE)}>
                        <Entypo name="camera" size={24} color="#ffffff" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <CustomInput
                    onChangeText={handlePanChange}
                    value={maskPanNumber(uploadDocumentSlices.data.PAN)}
                    placeholder="Enter PAN"
                    keyboardType="default"
                    autoCapitalize="characters"
                    maxLength={10}
                  />
                </View>
                {panMessage && documentationKycStatus.panStatus && (
                  <Text
                    style={[
                      styles.errorText,
                      {
                        fontSize: dynamicFontSize(styles.errorText.fontSize),
                        color:
                          documentationKycStatus.panStatus === STATUS.SUCCESS
                            ? "green"
                            : "red",
                      },
                    ]}>
                    {panMessage}
                  </Text>
                )}
                {/* Aadhaar Upload Section */}
                <Text
                  style={[
                    styles.label,
                    { fontSize: dynamicFontSize(styles.label.fontSize) },
                  ]}>
                  Aadhaar <Text style={styles.optional}>(optional)</Text>
                </Text>
                <View style={styles.docCaptureWrapper}>
                  <View style={styles.docFlex}>
                    <View style={styles.previewWrapper}>
                      {renderDocumentPreviews(
                        uploadDocumentSlices.data.AADHAAR_FILES.Front,
                        "Preview Aadhaar Front"
                      )}
                    </View>
                    <View style={styles.docButtonWrapper}>
                      <TouchableOpacity
                        style={styles.docButton}
                        onPress={() =>
                          handleDocumentAction("aadhaar", "upload", AADHAAR_FRONT_CODE)
                        }>
                        <Feather name="upload" size={24} color="#ffffff" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.docButton]}
                        onPress={() =>
                          handleDocumentAction("aadhaar", "camera", AADHAAR_FRONT_CODE)
                        }>
                        <Entypo name="camera" size={24} color="#ffffff" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.docFlex}>
                    <View style={styles.previewWrapper}>
                      {renderDocumentPreviews(
                        uploadDocumentSlices.data.AADHAAR_FILES.Back,
                         "Preview Aadhaar Back"
                      )}
                    </View>
                    <View style={styles.docButtonWrapper}>
                      <TouchableOpacity
                        style={styles.docButton}
                        onPress={() =>
                          handleDocumentAction("aadhaar", "upload", AADHAAR_BACK_CODE)
                        }>
                        <Feather name="upload" size={24} color="#ffffff" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.docButton]}
                        onPress={() =>
                          handleDocumentAction("aadhaar", "camera", AADHAAR_BACK_CODE)
                        }>
                        <Entypo name="camera" size={24} color="#ffffff" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <AadharMaskedCustomInput
                    value={maskAadharNumber(uploadDocumentSlices.data.AADHAAR)}
                    placeholder="Enter Aadhaar"
                    keyboardType="numeric"
                    maxLength={12}
                    onChangeText={(masked, unmasked) => {
                      handleAadhaarChange(masked);
                    }}
                  />
                </View>
                <TouchableOpacity
                  style={[{ alignItems: "flex-end" }, styles.skipbuttonpress]}
                  onPress={() => skipbuttonpress()}>
                  <Text
                    style={[
                      styles.backBtnText,
                      {
                        fontSize: dynamicFontSize(styles.backBtnText.fontSize),
                        color: "orange",
                      },
                    ]}>
                    Skip Aadhaar OTP
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            </View>
          </ScrollView>
          <View style={[ styles.boxShadow]}>
          <View style={[styles.actionContainer, styles.centerAlignedContainer]}>
            <View style={{ height: 10 }} />
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => GoBack(navigation)}>
              <Text
                style={[
                  styles.backBtnText,
                  { fontSize: dynamicFontSize(styles.backBtnText.fontSize) },
                ]}>
                Back
              </Text>
            </TouchableOpacity>
            <LinearGradient
              colors={

                ["#002777", "#00194C"]
              }
              style={styles.verifyButton}>
              <TouchableOpacity
                onPress={() => handleProceed()}>
                <Text
                  style={[
                    styles.buttonText,
                    { fontSize: dynamicFontSize(styles.buttonText.fontSize) },
                  ]}>
                  Proceed
                </Text>
              </TouchableOpacity>
            </LinearGradient>
            </View>
          </View>
          {errorScreen.type !== null && (
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

export default PrimaryInfo;
