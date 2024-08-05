import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar, KeyboardAvoidingView, Platform, useWindowDimensions } from 'react-native';
import { styles } from '../../assets/style/personalStyle';
import { useProgressBar } from '../components/progressContext';
import ProgressBar from '../components/progressBar';
import { useAppContext } from '../components/useContext';
import { LinearGradient } from 'expo-linear-gradient';
import { GoBack } from '../services/Utils/ViewValidator';
import { GetBorrowerSectionData, GetSectionHtmlPage, SendBorrowerSectionData } from '../services/API/Section';
import { API_RESPONSE_STATUS, STATUS } from '../services/API/Constants';

import LoadingOverlay from '../components/FullScreenLoader';
import ScreenError, { useErrorEffect } from './ScreenError';
import { ALL_SCREEN, Network_Error, Something_Went_Wrong } from '../services/Utils/Constants';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base-64';
import { Linking } from 'react-native';
import { generateUniqueAddress } from '../services/Utils/FieldVerifier';
import { checkImagePermission, checkLocationPermission } from './PermissionScreen';
import { GetApplicantId } from '../services/LOCAL/AsyncStroage';
import SaveLeadStage from '../services/API/SaveLeadStage';
import { useDispatch, useSelector } from 'react-redux';
import { updateJumpTo } from '../services/Utils/Redux/LeadStageSlices'; 
import { useFocusEffect } from '@react-navigation/native';

const SanctionLetterScreen = ({ navigation }) => {
  // Placeholder data, replace with real data
  const nextJumpTo = useSelector(state => state.leadStageSlice.jumpTo);
  const dispatch = useDispatch()

  const [sanctionDetails, setSanctionDetails] = useState([])
  // const [sanctionWebView, setSactionWebView] = useState(null)

  const { setProgress } = useProgressBar();

  const [loading, setLoading] = useState(false);
  const [otherError, setOtherError] = useState(null)
  const [refreshPage, setRefreshPage] = useState(true)


  const onTryAgainClick = () => {
    setRefreshPage(true)
  }

  const { errorScreen, setNewErrorScreen } = useErrorEffect(onTryAgainClick)

  const getSectionDetails = async () => {
    const apiResponse = API_RESPONSE_STATUS()
    const getBorrowerSectionData = await GetBorrowerSectionData()
    if (getBorrowerSectionData.status == STATUS.ERROR) {
      apiResponse.status = STATUS.ERROR
      apiResponse.message = getBorrowerSectionData.message
      return apiResponse
    }


    const sanctionDetails = { "Loan ID" : await GetApplicantId(), ...getBorrowerSectionData.data}
    setSanctionDetails(sanctionDetails)
    
    apiResponse.status = STATUS.SUCCESS
    return apiResponse

  }

  useFocusEffect(
    useCallback(() => {
    if (refreshPage == false) {
      return
    }
    setProgress(0.4);
    setLoading(true)
    getSectionDetails().then((response) => {
      setLoading(false)
      setNewErrorScreen(null)
      if (response.status == STATUS.ERROR) {
        if (response.message == Network_Error || response.message != null) {
          setNewErrorScreen(response.message)
          return
        }
        setOtherError(response.message)
        return
      }


    })

    setRefreshPage(false)
  }, [refreshPage]));



  const { fontSize } = useAppContext();
  const dynamicFontSize = (size) => size + fontSize;


  

  const SubmitSaction = async() => {

    if(await checkLocationPermission() == false){
      navigation.navigate("PermissionsScreen", {permissionStatus : "denied", permissionType : "location"})
      return
    }

    setLoading(true)

    const sendBorrowerSectionResponse = await SendBorrowerSectionData()
    if(sendBorrowerSectionResponse.status == STATUS.ERROR){
      setLoading(false)
      setOtherError(null)
      setNewErrorScreen(sendBorrowerSectionResponse.message)
      return
    }


    let Leadstage = nextJumpTo
    if (ALL_SCREEN[nextJumpTo] == "sanctionLetter") {
      Leadstage = nextJumpTo + 1

      const saveLeadStageResponse = await SaveLeadStage(Leadstage)
      if(saveLeadStageResponse.status == STATUS.ERROR){
        setLoading(false)
        setOtherError(null)
        setNewErrorScreen(saveLeadStageResponse.message)
        return
      }

      dispatch(updateJumpTo(Leadstage))
    }
    setLoading(false)

    navigation.navigate('documnetUplaod')
     
  }

  const ShowPdf = async (uri) => {
    const a = await Print.printAsync({ uri });
  }


  const handleDownloadAndShowPdf = (base64) => {
    try{
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
  
      // Trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.download = generateUniqueAddress("SanctionLetter", null, "pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      // Set the URL for displaying
      console.log("downloaded " + url)
      return url
    }
    catch(e)
    {
      console.log(e)
      return null
    }
    
  };


  const downloadSectionLetter = async () => {
    // console.log("================== Download Section Letter =====================")
    // console.log(sanctionWebView)
    // if (sanctionWebView?.Base64PDF != null) {


    //   const base64 = sanctionWebView?.Base64PDF


    //   if (Platform.OS === "android") {
    //     const filePath = FileSystem.documentDirectory + generateUniqueAddress("SanctionLetter", null, "pdf");

    //     // Save the binary data to a file
    //     FileSystem.writeAsStringAsync(filePath, base64, {
    //       encoding: FileSystem.EncodingType.Base64,
    //     })
    //       .then(() => {
    //         // Set the PDF URI for the PDF viewer component
    //         console.log(filePath);
    //         ShowPdf(filePath)

    //       })
    //       .catch(error => console.log(error));
    //   }
    //   else if (Platform.OS === "web") {
    //     handleDownloadAndShowPdf(base64)
    //   }

    // }


    if(await checkImagePermission() == false){
      navigation.navigate("PermissionsScreen", {permissionStatus : "denied", permissionType : 'files'})
      return
    }

    setLoading(true)
    const getSectionHtmlPage = await GetSectionHtmlPage()
    if (getSectionHtmlPage.status == STATUS.ERROR) {
      setOtherError(getSectionHtmlPage.message)
    }
    setLoading(false)

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
            <ProgressBar progress={0.4} />
            <Text style={[styles.headerText, { fontSize: dynamicFontSize(styles.headerText.fontSize) }]}>Sanction Terms & Conditions</Text>
            {otherError ? <Text style={[styles.errorText, { fontSize: dynamicFontSize(styles.errorText.fontSize) }]}>{otherError}</Text> : null}

            <View style={styles.detailContainer}>
              {Object.entries(sanctionDetails).map(([key, value]) => (
                <View key={key} style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { fontSize: dynamicFontSize(styles.detailLabel.fontSize) }]}>{key}:</Text>
                  <Text style={[styles.detailValue, { fontSize: dynamicFontSize(styles.detailValue.fontSize) }]}>{value}</Text>
                </View>
              ))}


            </View>

           
          </View>
          <View style={styles.DownloadBtnWrapper}>
          <LinearGradient
              // button Linear Gradient
              colors={['#002777', '#00194C']}
              style={[styles.downloadButton, { backgroundColor: "#00194c"  }]}
            >
              <TouchableOpacity onPress={() => { downloadSectionLetter() }}>
                <Text style={[styles.downloadButtonText, { fontSize: dynamicFontSize(styles.downloadButtonText.fontSize) }]}>DOWNLOAD SANCTION LETTER</Text>
              </TouchableOpacity>


            </LinearGradient>
          </View>

          <View style={styles.actionContainer}>

            <TouchableOpacity style={styles.backButton} onPress={() => GoBack(navigation)}>
              <Text style={[styles.backBtnText, { fontSize: dynamicFontSize(styles.backBtnText.fontSize) }]}>BACK</Text>
            </TouchableOpacity>
            <LinearGradient
              // button Linear Gradient
              colors={['#002777', '#00194C']}
              style={styles.verifyButton}
            >
              <TouchableOpacity onPress={() => SubmitSaction()} >
                <Text style={[styles.buttonText, { fontSize: dynamicFontSize(styles.buttonText.fontSize) }]}>PROCEED</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>

        </View>
      </ScrollView>
      {errorScreen.type != null && <ScreenError errorObject={errorScreen} onTryAgainClick={onTryAgainClick} setNewErrorScreen={setNewErrorScreen} />}

    </KeyboardAvoidingView>

</View>
</View>
  );
};


export default SanctionLetterScreen;
