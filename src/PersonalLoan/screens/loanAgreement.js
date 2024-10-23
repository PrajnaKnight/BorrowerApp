import { useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StatusBar, Image, Dimensions, KeyboardAvoidingView, useWindowDimensions, BackHandler } from 'react-native';
import { styles } from '../services/style/gloablStyle';
import Checkbox from 'expo-checkbox';
import ProgressBar from '../components/progressBar';
import { useProgressBar } from '../components/progressContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppContext } from '../components/useContext';
import { ESignExternal, GetLoanAgreementLetter, GetLoanAgreementFile, CheckEsignLoanAgreement } from '../services/API/ESignDocument';
import { E_SIGN_EXTERNAL, STATUS } from '../services/API/Constants';
import ScreenError, { useErrorEffect } from './ScreenError';
import LoadingOverlay from '../components/FullScreenLoader';
import { ALL_SCREEN, Network_Error, Something_Went_Wrong } from '../services/Utils/Constants';
import { useFocusEffect } from '@react-navigation/native';
import { DownloadMyFile, generateUniqueAddress } from '../services/Utils/FieldVerifier';
import { Platform } from 'react-native';
import WebView from 'react-native-webview';
import { GoBack } from '../services/Utils/ViewValidator';
import useJumpTo from "../components/StageComponent";

import * as FileSystem from 'expo-file-system';
import { checkImagePermission, checkLocationPermission } from '../../Common/screens/PermissionScreen';
import SaveLeadStage from '../services/API/SaveLeadStage';
import { updateJumpTo } from '../services/Utils/Redux/LeadStageSlices';
import { useDispatch, useSelector } from 'react-redux';
import { CheckCircle2, MapPin, Lock, Building2 } from 'lucide-react';


const LoanAgreementScreen = ({ navigation }) => {



  const { width } = Dimensions.get('window');
  const isWeb = Platform.OS === 'web';




  const stageMaintance = useJumpTo("loanAgreement", "InitiateDisbursalScreen", navigation);


  const [loanWebView, setLoanWebView] = useState(null)
  const [loading, setLoading] = useState(false);
  const [TransactionId, setTransactionId] = useState(null)
  const [AadhaarESignHtmlResponse, setAadhaarESignHtmlResponse] = useState(null)


  const dispatch = useDispatch();



  const { setProgress } = useProgressBar();
  const [refreshPage, setRefreshPage] = useState(true)
  const [otherError, setOtherError] = useState(null)



  const onTryAgainClick = () => {
    setRefreshPage(true)
  }

  const { errorScreen, setNewErrorScreen } = useErrorEffect(onTryAgainClick)



  useEffect(() => {

    if (AadhaarESignHtmlResponse == null) {
      return
    }



    navigation.navigate("FullScreenWebViewForAadhaarSigning", { htmlContent: AadhaarESignHtmlResponse, TransactionId: TransactionId })

  }, [AadhaarESignHtmlResponse])




  useFocusEffect(
    useCallback(() => {
      if (refreshPage == false) {
        return
      }
      setProgress(0.7);
      setLoading(true)
      setLoanWebView(null)
      setChecked(false)
      setTransactionId(null)
      setAadhaarESignHtmlResponse(null)
      GetLoanAgreementLetter().then((response) => {
        setLoading(false)

        if (response.status == STATUS.ERROR) {
          setNewErrorScreen(response.message)
           
          return
        }

        if (response.data != null) {
          setLoanWebView(response.data)
        }
      })
      setRefreshPage(false)
    }, [refreshPage]));

  useEffect(() => {
    const backAction = () => {
      GoBack(navigation, 'eMandate');
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);


  function base64toBlob(base64Data, contentType) {
    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  function base64toFile(base64Data, fileName, contentType) {
    const blob = base64toBlob(base64Data, contentType);
    const file = new File([blob], fileName, { type: contentType });
    return file;
  }

  const getFileNameAndExtensionFromURI = (uri) => {
    const lastIndex = uri.lastIndexOf('/');
    if (lastIndex !== -1) {
      const filenameWithExtension = uri.substring(lastIndex + 1);
      const [filename, extension] = filenameWithExtension.split('.');
      return { filename, extension };
    }
    return null;
  };

  const OnProceedClick = async () => {
    if (loanWebView == null || isChecked == false) {
      return
    }

    // const response = await fetch(loanWebView.Base64PDF);
    // if (!response.ok) {
    //   throw new Error('Failed to fetch file');
    // }

    // const blob = await response.blob();

    // // Create a File object from the blob
    // const file = new File([blob], generateUniqueAddress("LoanAgreeMent", null, "pdf"), { type: "application/pdf" });

    if (await checkLocationPermission() == false) {
      navigation.navigate("PermissionsScreen", { permissionStatus: "denied", permissionType: "location" })
      return
    }

    if (await checkImagePermission() == false) {
      navigation.navigate("PermissionsScreen", { permissionStatus: "denied", permissionType: 'files' })
      return
    }


    setLoading(true)
    setNewErrorScreen(null)

    const checkEsignResponse = await CheckEsignLoanAgreement()
    setLoading(false)

    console.log("=============== loan agreemnt response ===================")
    console.log(checkEsignResponse)
    if (checkEsignResponse.status == STATUS.SUCCESS) {

      setLoading(true)
      const saveLeadStageResponse = await SaveLeadStage(stageMaintance.jumpTo)
      setLoading(false)
      if (saveLeadStageResponse.status == STATUS.ERROR) {
        setNewErrorScreen(saveLeadStageResponse.message)
        return
      }

      dispatch(updateJumpTo(stageMaintance))


      navigation.navigate("InitiateDisbursalScreen")

      return;
    }





    setLoading(true)
    const getBase64OfLoanAgrreement = await GetLoanAgreementFile()
    setLoading(false)
    if (getBase64OfLoanAgrreement.status == STATUS.ERROR) {
      setNewErrorScreen(getBase64OfLoanAgrreement.message)
      return
    }


    // console.log(getBase64OfLoanAgrreement.data)
    // let file = null
    // if (Platform.OS === "web") {
    //   file = base64toFile(getBase64OfLoanAgrreement.data, generateUniqueAddress("LoanAgreeMent", null, "pdf"), "application/pdf");
    // }
    // else {
    //   const uri = await downloadLoanAgreement(getBase64OfLoanAgrreement.data)
    //   const document = getFileNameAndExtensionFromURI(uri)
    //   file = {
    //     uri: uri,
    //     type: "*/*", // or 'image/png', etc.
    //     name: `${document.filename}.${document.extension}`, // or png, etc.
    //   }

    // }

    // console.log("============ Loan Agreement ==================")
    // console.log(file)
    // console.log("============ Loan Agreement ==================")



    setLoading(true)
    const eSignExternal = await ESignExternal()
    setLoading(false)

    if(eSignExternal.status == STATUS.ERROR){
      setNewErrorScreen(eSignExternal.message)
      return
    }

    if (eSignExternal?.data?.TransactionId != null) {
      setTransactionId(eSignExternal.data.TransactionId)
      setAadhaarESignHtmlResponse(eSignExternal.data.AadhaarESignHtmlResponse)
    }
    else {
      setOtherError(Something_Went_Wrong)
    }
  

  }

  const handleDownloadAndShowPdf = (base64) => {
    try {
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
      link.download = generateUniqueAddress("LoanAgreeMent", null, "pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Set the URL for displaying
      console.log("downloaded " + url)
      setLoanAgreementPdf(url);
    }
    catch (e) {
      console.log(e)
    }

  };


  const downloadLoanAgreement = async (base64) => {
    try {
      if (base64 != null) {



        const filePath = FileSystem.documentDirectory + generateUniqueAddress("LoanAgreeMent", null, "pdf");

        // Save the binary data to a file
        await FileSystem.writeAsStringAsync(filePath, base64, {
          encoding: FileSystem.EncodingType.Base64,
        });
        // Set the PDF URI for the PDF viewer component
        console.log(filePath);

        return filePath

      }
    }
    catch (e) {
      console.log(e)
    }

    return null

  }





  const [isChecked, setChecked] = useState(false);

  const { fontSize } = useAppContext();
  const dynamicFontSize = (size) => size + fontSize;


  const isProceedEnabled = loanWebView != null && isChecked;

  const contentComponent = Platform.OS === 'web' ? (
    <View style={styles.webViewWrapper}>

      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          horizontal={true}  // Set to true if you want horizontal scrolling
          vertical={true}    // Set to true if you want vertical scrolling
          showsHorizontalScrollIndicator={false}  // Disable horizontal scrollbar
          showsVerticalScrollIndicator={false}    // Disable vertical scrollbar
        >
          <div
            style={{ flex: 1, width: '100%', overflow: 'scroll' }}
            dangerouslySetInnerHTML={{ __html: loanWebView?.HTMLContent }}
          />
        </ScrollView>
      </View>

      {/* <iframe
        srcDoc={loanWebView?.HTMLContent}
        style={{ height: '100%' }}
        frameBorder="0"
      /> */}
    </View>
  ) : (
    <View style={styles.webViewWrapper}>
      <WebView
        originWhitelist={['*']}
        source={{ html: loanWebView?.HTMLContent || "" }}
        style={styles.webViewcontent}
        scrollEnabled={true} 
        nestedScrollEnabled={true}

      />
    </View>
  );

  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024; // Tablet range, including iPad portrait
  const isDesktop = width >= 1024; // Desktop and iPad landscape


  const containerStyle = isDesktop ? styles.desktopContainer : isMobile ? styles.mobileContainer : styles.tabletContainer;
  const imageContainerStyle = isDesktop ? { width: '60%' } : { width: '100%' };

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
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : null}
          keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}>
          <LoadingOverlay visible={loading} />
          <View style={[styles.centerAlignedContainerHeader,{ padding: 16, paddingBottom:5 }]}>
            <ProgressBar progress={0.7} />
            <Text
              style={[
                styles.headerText,
                { fontSize: dynamicFontSize(styles.headerText.fontSize) },
              ]}>
              Loan Agreement
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
                {/* <View style={isMobile ? styles.webViewContainerMobile : styles.webViewContainer}>
          {loanWebView &&
            Platform.OS === "web" &&
            <iframe
              srcDoc={loanWebView.HTMLContent}
              style={{ flex: 1 }}
            />
          }

          
        </View> */}
                {/* componet for display loan agreement html content */}
                {contentComponent}

                <View style={styles.checkboxContainer}>
                  <Checkbox
                    style={styles.checkbox}
                    value={isChecked}
                    onValueChange={setChecked}
                    color={isChecked ? "#FF8500" : undefined}
                  />
                  <Text
                    style={[
                      styles.checkboxLabel,
                      {
                        fontSize: dynamicFontSize(
                          styles.checkboxLabel.fontSize
                        ),
                      },
                    ]}>
                    I accept the terms and conditions and consent to provide ABC
                    Bank Pvt Ltd to fetch my credit bureau report for the
                    purpose of offering lending services.
                  </Text>
                </View>
              </View>
              <View style={styles.LAproceedButtonContainer}></View>

              {errorScreen.type != null && (
                <ScreenError
                  errorObject={errorScreen}
                  onTryAgainClick={onTryAgainClick}
                  setNewErrorScreen={setNewErrorScreen}
                />
              )}
            </View>
            </View>
          </ScrollView>
          <View style={[ styles.boxShadow]}>
            <View style={[styles.actionContainer,styles.centerAlignedContainer]}>
            <TouchableOpacity
              style={[styles.backButton, { marginRight: 10 }]}
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
                isProceedEnabled
                  ? ["#002777", "#00194C"]
                  : ["#E9EEFF", "#D8E2FF"]
              }
              style={[
                styles.agreebutton,
                !isProceedEnabled && styles.disabledButton,
              ]}>
              <TouchableOpacity
                onPress={() => isProceedEnabled && OnProceedClick()}
                disabled={!isProceedEnabled}>
                <Text
                  style={[
                    styles.buttonText,
                    {
                      fontSize: dynamicFontSize(styles.buttonText.fontSize),
                      color: isProceedEnabled ? "#FFFFFF" : "#ffffff",
                    },
                  ]}>
                  Proceed
                </Text>
              </TouchableOpacity>
            </LinearGradient>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};



export default LoanAgreementScreen;