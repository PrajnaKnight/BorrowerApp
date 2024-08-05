import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, useWindowDimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { styles } from '../../assets/style/personalStyle';
import CustomInput, { AadharMaskedCustomInput } from '../components/input';
import { useProgressBar } from '../components/progressContext';
import ProgressBar from '../components/progressBar';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppContext } from '../components/useContext';
import Icon from 'react-native-vector-icons/FontAwesome';
import UploadFile, { GetUploadFiles } from '../services/API/DocumentUpload';
import { API_RESPONSE_STATUS, STATUS } from '../services/API/Constants';
import { GetBorrowerPhoneNumber, GetLeadId, StoreUserAadhaar, StoreUserPan } from '../services/LOCAL/AsyncStroage';
import { base64ToFile, DownloadMyFile, DownloadMyFileWithBase64, generateUniqueAddress, getBase64MimeType, isValidAadhaar, isValidField, isValidNumberOnlyField, isValidNumberOnlyFieldWithZero, isValidPan } from '../services/Utils/FieldVerifier';
import LoadingOverlay from '../components/FullScreenLoader';
import OcrAadhaarRequest from '../services/API/OcrAadhaarRequest';
import OcrPanRequest, { SavePanKycResult } from '../services/API/OcrPanRequest';
import { GoBack } from '../services/Utils/ViewValidator';
import { BackHandler } from 'react-native';
import CreateBorrowerLead, { CreateBorrowerLeadFromDocuments } from '../services/API/CreateBorrowerLead';
import { useDispatch, useSelector } from 'react-redux';
import PostSaveProceedtage from '../services/API/SaveProceedStage';
import { updateJumpTo } from '../services/Utils/Redux/LeadStageSlices';
import { AADHAAR_FRONT_CODE, AADHAAR_BACK_CODE, ALL_SCREEN, PAN_CODE, Network_Error, Something_Went_Wrong } from '../services/Utils/Constants';
import { clearAadhaarCkyc, executePanCkyc, updatePanError } from '../services/Utils/Redux/DocumentVerificationSlices';
import { SubmitAddressFromDocuments } from '../services/API/AddressDetails';
import MaskInput from 'react-native-mask-input';
import * as DocumentPicker from 'expo-document-picker';

import ScreenError, { useErrorEffect } from './ScreenError';
import { sagaFetchFileRequest, sagaSubmitFileRquest, updateAadhaarNumber, updatePanNumber } from '../services/Utils/Redux/UploadDocumentSlices';
import { fetchGetBorrowerAddress } from '../services/Utils/Redux/AddressDetailSlices';
import { fi } from 'date-fns/locale';
import { checkCameraPermission, checkImagePermission, checkLocationPermission } from './PermissionScreen';
import { useFocusEffect } from '@react-navigation/native';
import DownloadPopup from '../components/DownloadPopup';

const PrimaryInfo = ({ navigation }) => {

  const documentationKycStatus = useSelector(state => state.documentVerificationSlices);
  const AddressDetailSlice = useSelector(state => state.addressDetailSlices);
  const nextJumpTo = useSelector(state => state.leadStageSlice.jumpTo);
  const uploadDocumentSlices = useSelector(state => state.uploadDocumentSlices)
  const dispatch = useDispatch()
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

  const onTryAgainClick = () => {
    setRefreshPage(true)
  }
  const { errorScreen, setNewErrorScreen } = useErrorEffect(onTryAgainClick)



  useFocusEffect(
    useCallback(() => {


    setProgress(0.02);

    if (refreshPage == false) {
      return
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
    // Add event listener for hardware back press
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    // Remove event listener when component is unmounted
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
    setNewErrorScreen(null)
    if (uploadDocumentSlices.error == Network_Error || uploadDocumentSlices.error != null) {
      setNewErrorScreen(uploadDocumentSlices.error)
    }
  }, [uploadDocumentSlices.error])


  useEffect(() => {
    setNewErrorScreen(null)
    if (documentationKycStatus.aadharError == Network_Error || documentationKycStatus.aadharError != null) {
      setNewErrorScreen(documentationKycStatus.aadharError)
    }
  }, [documentationKycStatus.aadharError])

  useEffect(() => {
    setNewErrorScreen(null)
    if (documentationKycStatus.panMessage == Network_Error || documentationKycStatus.panMessage != null) {
      setNewErrorScreen(documentationKycStatus.panMessage)
    }
  }, [documentationKycStatus.panMessage])

  useEffect(() => {
    setOtherError(uploadDocumentSlices.error)
  }, [uploadDocumentSlices.error])

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

    if (submitStart!=null) {
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
    setPanMessage(documentationKycStatus.panMessage)
  }, [documentationKycStatus.panMessage])





  const handlePanChange = (pan) => {


    dispatch(updatePanNumber(pan))
  };

  const handleAadhaarChange = (aadhaar) => {
    dispatch(updateAadhaarNumber(aadhaar))
  };

  const handleDeleteDocument = (documentType) => {

  };
  const handleDownloadDocument = (uri) => {
    Linking.openURL(uri).catch((err) => console.error("Couldn't load document", err));
  };
  // Consolidated document upload and camera access function
  const handleDocumentAction = async (documentType, actionType) => {

    let result = null;
    let document = null;


    if (actionType == 'camera') {
      if (await checkCameraPermission() == false) {
        navigation.navigate("PermissionsScreen", { permissionStatus: "denied", permissionType: actionType === 'camera' ? 'camera' : 'files' })
        return
      }
    }
    else {
      if (await checkImagePermission() == false) {
        navigation.navigate("PermissionsScreen", { permissionStatus: "denied", permissionType: actionType === 'camera' ? 'camera' : 'files' })
        return
      }
    }
    // if(await checkLocationPermission() == false){
    //   navigation.navigate("PermissionsScreen", {permissionStatus : "denied", permissionType : actionType === 'camera' ? 'camera' : 'files'})
    //   return
    // }

    try {


      if (actionType === 'upload') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Permission to access the media library is required!');
          return;
        }


        let result = null
        if (Platform.OS === "web") {
          result = await DocumentPicker.getDocumentAsync({
            type: '*/*', // You can specify a mime type here, like 'application/pdf' for PDF files
          });


          if (result && !result.canceled && result.assets != null && result.assets.length > 0) {
            let fileData = result.assets[0]
            document = fileData.file
            console.log(document)
          }

        }
        else {
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

        if (Platform.OS === "web") {

          navigation.navigate('WebCameraScreen', {
            onGoBack: (data) => {
              console.log("============== navigate back ===================")
              console.log(data);

              // const fileName = generateUniqueAddress(documentType, fileData.name || fileData.uri.split('/').pop());
              if (data != null) {

                const mimeType = data.uri.split(';')[0].split(':')[1];

                const fileName = generateUniqueAddress(documentType, null, "png")
                document = base64ToFile(data.uri, mimeType, fileName)
                if (documentType === 'pan') {


                  dispatch(sagaSubmitFileRquest(document, PAN_CODE))


                } else if (documentType === 'aadhaar') {
                  if (uploadDocumentSlices.data.AADHAAR_FILES == null || uploadDocumentSlices.data.AADHAAR_FILES.length == 0) {
                    dispatch(sagaSubmitFileRquest(document, AADHAAR_FRONT_CODE))
                  }
                  else {
                    dispatch(sagaSubmitFileRquest(document, AADHAAR_BACK_CODE))

                  }

                }
              }

              return
            },
          });

          console.log("=== execute  below ==")

          return

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
            let fileData = result.assets[0]
            const fileName = generateUniqueAddress(documentType, fileData.name || fileData.uri.split('/').pop());
            document = { uri: fileData.uri, name: fileName, type: fileData.mimeType };
          }


        }


      }

      console.log("================== Handle Document Action =======================")
      console.log(result)
      console.log("================== Handle Document Action =======================")



      if (document != null) {
        if (documentType === 'pan') {


          dispatch(sagaSubmitFileRquest(document, PAN_CODE))


        } else if (documentType === 'aadhaar') {
          if (uploadDocumentSlices.data.AADHAAR_FILES == null || uploadDocumentSlices.data.AADHAAR_FILES.length == 0) {
            dispatch(sagaSubmitFileRquest(document, AADHAAR_FRONT_CODE))
          }
          else {
            dispatch(sagaSubmitFileRquest(document, AADHAAR_BACK_CODE))

          }

        }

      }


    } catch (error) {
      console.error(`${actionType} error: `, error);
      // alert(`An error occurred while ${actionType === 'upload' ? 'picking' : 'taking'} the image.`);
      // Reset upload attempt state on error
      // if (documentType === 'pan') {
      //   setPanUploadAttempt(false);
      // } else if (documentType === 'aadhaar') {
      //   setAadhaarUploadAttempt(false);
      // }
    }
  };



  const removeDocument = (doc, type) => {
    if (type == "pan") {
      let currentPans = uploadDocumentSlices.data.PAN_FILES.filter(item => item !== doc);
      setPanDocuments(currentPans)
    }
    else if (type == "aadhaar") {

      let currentAadhaar = uploadDocumentSlices.data.AADHAAR_FILES.filter(item => item !== doc);
      setAadhaarDocuments(currentAadhaar)
    }
  }
  // Function to render the dummy documents list
  const renderDummyDocuments = (documents, type) => (
    <View>
      {documents?.map((doc, index) => (
        <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 5, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#ffe5c9', borderRadius: 2 }}>
          <Text style={{ flex: 1, fontSize: dynamicFontSize(14), color: '#00194c' }}>{doc.Name}</Text>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity onPress={() => DowloadFile(doc.OriginalFile, doc.Name)}>
              <Icon name="download" size={16} color="#ff8500" style={styles.downloadIcon} />
            </TouchableOpacity>

          </View>
        </View>
      ))}
    </View>
  );









  const UploadAllFiles = async (fromSkip = false) => {



    let response = API_RESPONSE_STATUS(STATUS.SUCCESS)
    let panValidation = isValidPan(uploadDocumentSlices.data.PAN)
    if (panValidation == null) {
      console.log("================================== Documentation ========================================")
      console.log("PAN OCR", documentationKycStatus.data.PanOcr)
      console.log("PAN COMPREHENSIVE", documentationKycStatus.data.PanComprehensive)
      console.log("PAN CKYC", documentationKycStatus.data.PanCkyc)
      console.log("AADHAAR OCR", documentationKycStatus.data.AadhaarOcr)
      console.log("AADHAAR EKYC", documentationKycStatus.data.AadhaarEkyc)
      console.log("CIBIL", documentationKycStatus.data.Cibil)
      console.log("================================== Documentation ========================================")


      const requestModel = {
        PanComprehensive: documentationKycStatus.data.PanComprehensive,

        PanOcr: documentationKycStatus.data.PanOcr,
        PanCkyc: documentationKycStatus.data.PanCkyc,
        AadhaarOcr: documentationKycStatus.data.AadhaarOcr,
        AadhaarEkyc: documentationKycStatus.data.AadhaarEkyc,
        Cibil: documentationKycStatus.data.Cibil
      }


      await CreateBorrowerLeadFromDocuments(requestModel)


      let id = 0;
      if (AddressDetailSlice.data != null && AddressDetailSlice.data.length > 0) {
        id = AddressDetailSlice.data[0].Id || 0
      }

      const submitAddressResponse = await SubmitAddressFromDocuments(requestModel, id)
      if (submitAddressResponse.status == STATUS.SUCCESS) {
        dispatch(fetchGetBorrowerAddress())
      }

    }


    await StoreUserPan(uploadDocumentSlices.data.PAN)

    await StoreUserAadhaar(uploadDocumentSlices.data.AADHAAR)



    console.log("aadhar number", uploadDocumentSlices.data.AADHAAR)
    const isValidAadhaarResponse = isValidAadhaar(uploadDocumentSlices.data.AADHAAR)
    if (isValidAadhaarResponse == null && !fromSkip) {
      dispatch(clearAadhaarCkyc())

      response.data = "eKycVerify"
      return response
    }




    let LeadStage = nextJumpTo
    if (ALL_SCREEN[nextJumpTo] == "primaryInfo") {
      LeadStage = nextJumpTo + 1
    }

    const storeTheLead = await PostSaveProceedtage(LeadStage)
    if (storeTheLead.status == STATUS.ERROR) {
      response.status = STATUS.ERROR
      response.message = storeTheLead.message
      return response
    }

    if (ALL_SCREEN[nextJumpTo] == "primaryInfo") {
      dispatch(updateJumpTo(LeadStage))
    }
    response.data = "personalInfo"

    return response
  }


  const DowloadFile = async (uri, name) => {

    if (await checkImagePermission() == false) {
      navigation.navigate("PermissionsScreen", { permissionStatus: "denied", permissionType: 'files' })
      return
    }

    setLoading(true)
    
    const downloadResponse = await DownloadMyFileWithBase64(uri, name)

    setLoading(false)

    if(downloadResponse!=null)[
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

    if(!uploadDocumentSlices.data.PAN){
      setOtherError("Please provide the PAN number")
      return
    }


    setSubmitStart("isProcced")


  }


  const maskAadharNumber = (aadhar) => {


    if (aadhar == null || aadhar.startsWith("null")) {
      return null
    }
    return aadhar
  };

  const maskPanNumber = (pan) => {
    if (pan == null || pan.startsWith("null")) {
      return null
    }
    return pan
  }


  const { width, height } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';

  // Definitions for "mobile", "tablet", and "desktop" based on width
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024; // Tablet range, including iPad portrait
  const isDesktop = width >= 1024; // Desktop and iPad landscape


  const containerStyle = isDesktop ? styles.desktopContainer : isMobile ? styles.mobileContainer : styles.tabletContainer;
  const imageContainerStyle = isDesktop ? { width: '50%' } : { width: '100%' };



  return (

    <View style={styles.mainContainer}>

      <View style={{ flex: 1, flexDirection: isWeb ? 'row' : 'column' }}>
        {isWeb && (isDesktop || (isTablet && width > height)) && (
          <View style={[styles.leftContainer, imageContainerStyle]}>
            <View style={styles.mincontainer}>
              <View style={styles.webheader}>
                <Text style={styles.WebheaderText}>Personal Loan</Text>
                <Text style={styles.websubtitleText}>Move Into Your Dreams!</Text>
              </View>
              <LinearGradient
                // button Linear Gradient
                colors={['#000565', '#111791', '#000565']}
                style={styles.webinterestButton}
              >
                <TouchableOpacity >
                  <Text style={styles.webinterestText}>Interest starting from 8.4%*</Text>
                </TouchableOpacity>

              </LinearGradient>

              <View style={styles.webfeaturesContainer}>
                <View style={styles.webfeature}>
                  <Text style={[styles.webfeatureIcon, { fontSize: 30, marginBottom: 5, }]}>%</Text>
                  <Text style={styles.webfeatureText}>Nil processing fee*</Text>
                </View>
                <View style={styles.webfeature}>
                  <Text style={[styles.webfeatureIcon, { fontSize: 30, marginBottom: 5 }]}>3</Text>
                  <Text style={styles.webfeatureText}>3-Step Instant approval in 30 minutes</Text>
                </View>
                <View style={styles.webfeature}>
                  <Text style={[styles.webfeatureIcon, { fontSize: 30, marginBottom: 5 }]}>⏳</Text>
                  <Text style={styles.webfeatureText}>Longer Tenure</Text>
                </View>
              </View>

              <View style={styles.webdescription}>
                <Text style={styles.webdescriptionText}>
                  There's more! Complete the entire process in just 3-steps that isn't any more than 30 minutes.
                </Text>
                <TouchableOpacity>
                  <Text style={styles.weblinkText}>To know more about product features & benefits, please click here</Text>

                </TouchableOpacity>
              </View>
              {/* <View style={styles.bottomFixed}>
         <Image source={require('../assets/images/poweredby.png')} style={styles.logo} />
      </View> */}

            </View>
          </View>
        )}
        <KeyboardAvoidingView
          style={[styles.rightCOntainer, { flex: 1 }]}
          behavior={Platform.OS === "ios" ? "padding" : null}
          keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        >

          <LoadingOverlay visible={loading} />

          <ScrollView contentContainerStyle={{ flexGrow: 1 }} >
            <View style={styles.container}>
              <View>
                <ProgressBar progress={0.02} />
                <Text style={[styles.headerText, { fontSize: dynamicFontSize(styles.headerText.fontSize) }]}>Primary Information</Text>
                {otherError ? <Text style={[styles.errorText, { fontSize: dynamicFontSize(styles.errorText.fontSize) }]}>{otherError}</Text> : null}

                {/* PAN Upload Section */}
                <Text style={[styles.label, { fontSize: dynamicFontSize(styles.label.fontSize) }]}>PAN Upload / Take PAN Photo <Text style={styles.mandatoryStar}>*</Text> </Text>
                {panMessage && documentationKycStatus.panStatus ? <Text style={[styles.errorText, { fontSize: dynamicFontSize(styles.errorText.fontSize), color: documentationKycStatus.panStatus == STATUS.SUCCESS ? "green" : "red" }]}>{panMessage}</Text> : null}

                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.customBtn} onPress={() => handleDocumentAction('pan', 'upload')}>
                    <Text style={[styles.customBtnText, { fontSize: dynamicFontSize(styles.customBtnText.fontSize) }]}>Upload</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.customBtn} onPress={() => handleDocumentAction('pan', 'camera')}>
                    <Text style={[styles.customBtnText, { fontSize: dynamicFontSize(styles.customBtnText.fontSize) }]}>Use Camera</Text>
                  </TouchableOpacity>


                </View>


                {renderDummyDocuments(uploadDocumentSlices.data.PAN_FILES, "pan")}


                <View style={styles.orWrapper}>
                  <Text style={[styles.or, { fontSize: dynamicFontSize(styles.or.fontSize) }]}>OR</Text>
                </View>
                <CustomInput
                  onChangeText={handlePanChange}
                  value={maskPanNumber(uploadDocumentSlices.data.PAN)}
                  placeholder="Enter your PAN"
                  keyboardType="default"
                  autoCapitalize='characters'
                  maxLength={10}
                />

                {/* Aadhaar Upload Section */}
                <Text style={[styles.label, { fontSize: dynamicFontSize(styles.label.fontSize) }]}>Aadhaar Upload / Take Aadhaar Photo <Text style={styles.optional}>(optional)</Text></Text>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.customBtn} onPress={() => handleDocumentAction('aadhaar', 'upload')}>
                    <Text style={[styles.customBtnText, { fontSize: dynamicFontSize(styles.customBtnText.fontSize) }]}>Upload</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.customBtn} onPress={() => handleDocumentAction('aadhaar', 'camera')}>
                    <Text style={[styles.customBtnText, { fontSize: dynamicFontSize(styles.customBtnText.fontSize) }]}>Use Camera</Text>
                  </TouchableOpacity>
                </View>


                {renderDummyDocuments(uploadDocumentSlices.data.AADHAAR_FILES, "aadhaar")}



                <View style={styles.orWrapper}>
                  <Text style={[styles.or, { fontSize: dynamicFontSize(styles.or.fontSize) }]}>OR</Text>
                </View>



                <AadharMaskedCustomInput
                  value={maskAadharNumber(uploadDocumentSlices.data.AADHAAR)}
                  placeholder="Enter your Aadhaar Number"
                  keyboardType="numeric"
                  maxLength={12}


                  onChangeText={(masked, unmasked) => {
                    handleAadhaarChange(masked); // you can use the unmasked value as well

                  }}
                />

                <TouchableOpacity style={[{ alignItems: 'flex-end' }, styles.skipbuttonpress]} onPress={() => { skipbuttonpress() }}>
                  <Text style={[styles.backBtnText, { fontSize: dynamicFontSize(styles.backBtnText.fontSize), color: "orange" }]}>Skip Aadhaar OTP</Text>
                </TouchableOpacity>

              </View>

              <View style={styles.actionContainer}>
                <View style={{ height: 10 }}></View>
                <TouchableOpacity style={styles.backButton} onPress={() => { GoBack(navigation) }}>
                  <Text style={[styles.backBtnText, { fontSize: dynamicFontSize(styles.backBtnText.fontSize) }]}>Back</Text>
                </TouchableOpacity>
                <LinearGradient colors={['#002777', '#00194C']} style={styles.verifyButton}>
                  <TouchableOpacity onPress={() => handleProceed()}>
                    <Text style={[styles.buttonText, { fontSize: dynamicFontSize(styles.buttonText.fontSize) }]}>Proceed</Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            </View>




          </ScrollView>


          {errorScreen.type != null && <ScreenError errorObject={errorScreen} onTryAgainClick={onTryAgainClick} setNewErrorScreen={setNewErrorScreen} />}
          <DownloadPopup path={downloadPath} onClose={()=>{setDownloadPath(null)}}/>
        </KeyboardAvoidingView>

      </View>
    </View>

  );
};

export default PrimaryInfo;
