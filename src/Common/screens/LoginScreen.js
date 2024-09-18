import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Image, KeyboardAvoidingView, Platform, useWindowDimensions, StatusBar } from 'react-native';
import Checkbox from 'expo-checkbox';
import { styles } from '../../assets/style/personalStyle';
import ButtonComponent from '../components/ControlPanel/button';
import CustomCarousel from '../components/ControlPanel/carousel';
import ReusableModal from '../components/ControlPanel/modal';
import MobileNumberInput from '../components/ControlPanel/mobileInput';
import { useAppContext } from '../components/useContext';
import { useFocusEffect } from '@react-navigation/native';
import GetOTPByPhoneNumber, { GetLoginTopByPhoneRequestModel } from '../../PersonalLoan/services/API/GetLoginOtpByPhone';
import { STATUS } from '../../PersonalLoan/services/API/Constants';
import LoadingOverlay from '../../PersonalLoan/components/FullScreenLoader';
import { isValidPhoneNumber } from '../../PersonalLoan/services/Utils/FieldVerifier';
import { BackHandler } from 'react-native';
import ScreenError, { useErrorEffect } from '../../PersonalLoan/screens/ScreenError';
import { Network_Error, Something_Went_Wrong } from '../../PersonalLoan/services/Utils/Constants';
import { LinearGradient } from 'expo-linear-gradient';
import Layout from '../components/Layout';
import WhatsAppToggle from '../components/ControlPanel/whatsapp';
import { CheckCircle2, MapPin, Lock, Building2 } from 'lucide-react';

function LoginScreen({ navigation }) {
  const [loading, setLoading] = useState(false);

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState(null);
  const [mobileError, setMobileError] = useState(null)
  const { fontSize } = useAppContext();

  const [isWhatsAppEnabled, setIsWhatsAppEnabled] = useState(false);

  const toggleWhatsApp = () => {
    setIsWhatsAppEnabled(prevState => !prevState);
  };




  const [requestModel, setRequestModel] = useState(GetLoginTopByPhoneRequestModel())


  const onTryAgainClick = () => {

  }


  const { errorScreen, setNewErrorScreen } = useErrorEffect(onTryAgainClick)

  const { width, height } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';

  // Definitions for "mobile", "tablet", and "desktop" based on width
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024; // Tablet range, including iPad portrait
  const isDesktop = width >= 1024; // Desktop and iPad landscape


  const containerStyle = isDesktop ? styles.desktopContainer : isMobile ? styles.mobileContainer : styles.tabletContainer;
  const imageContainerStyle = isDesktop ? { width: '60%' } : { width: '100%' };


  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp()
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);


  const dynamicFontSize = (size) => size + fontSize;



  useFocusEffect(
    React.useCallback(() => {
      setTermsAccepted(false);
      return () => {
        console.log('Previous screen unfocused');
      };
    }, [])
  );


  const handleMobileChange = (number) => {
    let currentRequestModel = { ...requestModel, LeadPhone: number }
    setRequestModel(currentRequestModel)
    setMobileError(null)
  };


  const submitPhoneNumber = () => {


    setLoading(true)
    setNewErrorScreen(null)
    GetOTPByPhoneNumber(requestModel).then(response => {

      console.log(response)
      setLoading(false)

      if (response.status == STATUS.ERROR) {
        if (response.message == Network_Error || response.message != null) {
          setNewErrorScreen(response.message)
          return
        }
        setError(response.message)
        return
      }

      otpverificationCarryNumber()
    })

  }


  const handleSubmit = () => {

    let mobileError = isValidPhoneNumber(requestModel.LeadPhone)
    setMobileError(mobileError)
    if (mobileError != null) {
      return
    }

    if (termsAccepted) {
      submitPhoneNumber()
    }
    else {
      Alert.alert("Terms and Conditions", "You must accept the terms and conditions to proceed.");
    }
  };

  const otpverificationCarryNumber = () => {
    const fullMobileNumber = `${requestModel.LeadPhone}`;
    navigation.navigate('otpverification', { mobileNumber: fullMobileNumber });
  };

  // Function to handle checkbox tap
  const handleCheckboxTap = () => {
    if (!termsAccepted) {
      Alert.alert("Terms and Conditions", "Please read and accept the terms and conditions to proceed.");
    } else {
      setTermsAccepted(false)
    }
  };

  const modalContentA = (
    <View style={{ flex: 1 }}>
      <ScrollView >
        <Text
          style={[
            styles.Modaltitle,
            { fontSize: dynamicFontSize(styles.Modaltitle.fontSize) },
          ]}>
          Terms and Conditions
        </Text>

        <Text
          style={[
            styles.modalH,
            { fontSize: dynamicFontSize(styles.modalH.fontSize) },
          ]}>
          1. Introduction
        </Text>
        <Text
          style={[
            styles.modalp,
            { fontSize: dynamicFontSize(styles.modalp.fontSize) },
          ]}>
          These Terms and Conditions ("T&C") govern the loan application process
          with [Your Company Name] ("Company", "we", "us", "our"). By applying
          for a loan, you ("Applicant", "you", "your") agree to comply with and
          be bound by these T&C.
        </Text>

        <Text
          style={[
            styles.modalH,
            { fontSize: dynamicFontSize(styles.modalH.fontSize) },
          ]}>
          2. Eligibility
        </Text>
        <Text
          style={[
            styles.modalp,
            { fontSize: dynamicFontSize(styles.modalp.fontSize) },
          ]}>
          To be eligible for a loan, you must:
        </Text>
        <Text
          style={[
            styles.modalp,
            { fontSize: dynamicFontSize(styles.modalp.fontSize) },
          ]}>
          ● Be a resident of India.
        </Text>
        <Text
          style={[
            styles.modalp,
            { fontSize: dynamicFontSize(styles.modalp.fontSize) },
          ]}>
          ● Be at least 18 years old.
        </Text>
        <Text
          style={[
            styles.modalp,
            { fontSize: dynamicFontSize(styles.modalp.fontSize) },
          ]}>
          Provide accurate and complete information during the application
          process.
        </Text>

        <Text
          style={[
            styles.modalH,
            { fontSize: dynamicFontSize(styles.modalH.fontSize) },
          ]}>
          3. Loan Application Process
        </Text>
        <Text
          style={[
            styles.modalH2,
            { fontSize: dynamicFontSize(styles.modalH2.fontSize) },
          ]}>
          3.1 Submission of Application
        </Text>
        <Text
          style={[
            styles.modalp,
            styles.subpoints,
            { fontSize: dynamicFontSize(styles.modalp.fontSize) },
          ]}>
          You must complete the loan application form and provide all required
          documentation. The information provided must be accurate and truthful.
        </Text>
        <Text
          style={[
            styles.modalH2,
            { fontSize: dynamicFontSize(styles.modalH2.fontSize) },
          ]}>
          3.2 Video KYC (Know Your Customer)
        </Text>
        <Text
          style={[
            styles.modalp,
            styles.subpoints,
            { fontSize: dynamicFontSize(styles.modalp.fontSize) },
          ]}>
          By submitting your loan application, you consent to participate in a
          Video KYC process. This process may include recording a video of you
          verifying your identity documents and answering security questions.
          The video and related data will be securely stored and used solely for
          the purpose of identity verification.
        </Text>
        <Text
          style={[
            styles.modalH2,
            { fontSize: dynamicFontSize(styles.modalH2.fontSize) },
          ]}>
          3.3 Credit Bureau Consent
        </Text>
        <Text
          style={[
            styles.modalp,
            styles.subpoints,
            { fontSize: dynamicFontSize(styles.modalp.fontSize) },
          ]}>
          You authorize us to access your credit report from credit bureaus to
          assess your creditworthiness. This consent allows us to obtain your
          credit history, score, and other relevant information from authorized
          credit bureaus.
        </Text>
        <Text
          style={[
            styles.modalH2,
            { fontSize: dynamicFontSize(styles.modalH2.fontSize) },
          ]}>
          3.4 Aadhaar KYC
        </Text>
        <Text
          style={[
            styles.modalp,
            styles.subpoints,
            { fontSize: dynamicFontSize(styles.modalp.fontSize) },
          ]}>
          You consent to the use of your Aadhaar number for KYC (Know Your
          Customer) verification. This process involves validating your identity
          through the Aadhaar database. By providing your Aadhaar number, you
          authorize us to retrieve your KYC information from the Unique
          Identification Authority of India (UIDAI).
        </Text>

        <Text
          style={[
            styles.modalH,
            { fontSize: dynamicFontSize(styles.modalH.fontSize) },
          ]}>
          4. Data Privacy and Security
        </Text>
        <Text
          style={[
            styles.modalH2,
            { fontSize: dynamicFontSize(styles.modalH2.fontSize) },
          ]}>
          4.1 Collection and Use of Personal Data
        </Text>
        <Text
          style={[
            styles.modalp,
            styles.subpoints,
            { fontSize: dynamicFontSize(styles.modalp.fontSize) },
          ]}>
          We collect and use your personal data in accordance with our Privacy
          Policy. Your data will be used for processing your loan application,
          conducting KYC checks, assessing creditworthiness, and for other
          purposes as outlined in our Privacy Policy.
        </Text>
        <Text
          style={[
            styles.modalH2,
            { fontSize: dynamicFontSize(styles.modalH2.fontSize) },
          ]}>
          4.2 Data Sharing
        </Text>
        <Text
          style={[
            styles.modalp,
            styles.subpoints,
            { fontSize: dynamicFontSize(styles.modalp.fontSize) },
          ]}>
          We may share your personal data with third-party service providers,
          credit bureaus, and regulatory authorities as required for processing
          your loan application and complying with legal obligations.
        </Text>
        <Text
          style={[
            styles.modalH2,
            { fontSize: dynamicFontSize(styles.modalH2.fontSize) },
          ]}>
          4.3 Data Security
        </Text>
        <Text
          style={[
            styles.modalp,
            styles.subpoints,
            { fontSize: dynamicFontSize(styles.modalp.fontSize) },
          ]}>
          We implement appropriate technical and organizational measures to
          protect your personal data against unauthorized access, loss, or
          misuse.
        </Text>

        <Text
          style={[
            styles.modalH,
            { fontSize: dynamicFontSize(styles.modalH.fontSize) },
          ]}>
          5. Marketing Consent
        </Text>
        <Text
          style={[
            styles.modalp,
            { fontSize: dynamicFontSize(styles.modalp.fontSize) },
          ]}>
          By applying for a loan, you consent to receive marketing
          communications from us via SMS, email, phone calls, and other
          electronic means. These communications may include promotional offers,
          updates, and other information related to our products and services.
          You can opt out of receiving marketing communications at any time by
          following the unsubscribe instructions provided in the communication.
        </Text>

        <Text
          style={[
            styles.modalH,
            { fontSize: dynamicFontSize(styles.modalH.fontSize) },
          ]}>
          6. Loan Terms and Conditions
        </Text>
        <Text
          style={[
            styles.modalp,
            { fontSize: dynamicFontSize(styles.modalp.fontSize) },
          ]}>
          If your loan application is approved, the specific terms and
          conditions of the loan, including the interest rate, repayment
          schedule, fees, and other relevant details, will be provided in the
          loan agreement. You must review and accept the loan agreement before
          the loan is disbursed.
        </Text>

        <Text
          style={[
            styles.modalH,
            { fontSize: dynamicFontSize(styles.modalH.fontSize) },
          ]}>
          7. Amendments to T&C
        </Text>
        <Text
          style={[
            styles.modalp,
            { fontSize: dynamicFontSize(styles.modalp.fontSize) },
          ]}>
          We reserve the right to amend these T&C at any time. Any changes will
          be communicated to you through appropriate channels. Continued use of
          our services after such changes constitutes your acceptance of the new
          T&C.
        </Text>

        <Text
          style={[
            styles.modalH,
            { fontSize: dynamicFontSize(styles.modalH.fontSize) },
          ]}>
          8. Governing Law and Jurisdiction
        </Text>
        <Text
          style={[
            styles.modalp,
            { fontSize: dynamicFontSize(styles.modalp.fontSize) },
          ]}>
          These T&C are governed by and construed in accordance with the laws of
          [Country]. Any disputes arising out of or in connection with these T&C
          shall be subject to the exclusive jurisdiction of the courts of
          Mumbai, India.
        </Text>

        <Text
          style={[
            styles.modalH,
            { fontSize: dynamicFontSize(styles.modalH.fontSize) },
          ]}>
          9. Contact Information
        </Text>
        <Text
          style={[
            styles.modalp,
            { fontSize: dynamicFontSize(styles.modalp.fontSize) },
          ]}>
          If you have any questions or concerns regarding these T&C, please
          contact us at: ACME Financial Services Pvt Ltd Mumbai, Maharashtra,
          India contact@acmefincial.com
        </Text>

        <Text
          style={[
            styles.modalH,
            { fontSize: dynamicFontSize(styles.modalH.fontSize) },
          ]}>
          Acknowledgment
        </Text>
        <Text
          style={[
            styles.modalp,
            { fontSize: dynamicFontSize(styles.modalp.fontSize) },
          ]}>
          By submitting your loan application, you acknowledge that you have
          read, understood, and agree to these Terms and Conditions.
        </Text>

        <View style={[styles.acceptBtnWrapper, { alignItems: "center" }]}>
        <LinearGradient
            // button Linear Gradient
            colors={['#002777', '#00194C']}
            style={styles.button}
          >
          <TouchableOpacity
            style={styles.accepBtn}
            onPress={() => {
              setModalVisible(false);
              setTermsAccepted(true);
            }}>
            <Text
              style={[
                styles.btnText,
                { fontSize: dynamicFontSize(styles.btnText.fontSize) },
              ]}>
              Accept
            </Text>
          </TouchableOpacity>
          </LinearGradient>
        </View>
      </ScrollView>
    </View>
  );

  const carouselData = [
    {
      image: require('../../assets/images/img-1.png'),
    },
    {
      image: require('../../assets/images/img-2.png'),
    },
    {
      image: require('../../assets/images/img-3.png'),
    },
  ];

  const renderItem = ({ item, index }) => {
    return (
      <View>
        <Image source={item.image} style={styles.image} />
      </View>
    );
  };

  {
    isWeb && (isDesktop || (isTablet && width > height)) && (
      useEffect(() => {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = ` .r-4gszlv, .r-backgroundSize-4gszlv {
        background-size: contain;
        background-position: inherit;
    }`;
        document.head.appendChild(style);

        return () => {
          document.head.removeChild(style);
        };
      }, [])
    )
  }

  const steps = [
    { id: 1, title: 'Primary Information', subtitle: 'प्राथमिक जानकारी', icon: CheckCircle2, status: 'current' },
    { id: 2, title: 'Personal Information', subtitle: 'व्यक्तिगत जानकारी', icon: MapPin, status: 'disabled' },
    { id: 3, title: 'eKYC OTP Verification', subtitle: 'ईकेवाईसी ओटीपी सत्यापन', icon: Lock, status: 'disabled' },
    { id: 4, title: 'Address Details', subtitle: 'पते का विवरण', icon: Building2, status: 'disabled' },
  ];
  

  return (
    <View style={{ flex: 1 }}>
      <Layout>
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
                            step.status === "done" &&
                              styles.stepiconContainerDone,
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
                              step.status === "disabled" &&
                                styles.steptextDisabled,
                            ]}>
                            {step.title}
                          </Text>
                          <Text
                            style={[
                              styles.stepsubtitle,
                              step.status === "disabled" &&
                                styles.steptextDisabled,
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

              <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.centerAlignedContainer}>
                  <View style={styles.container}>
                    <View>
                      <View style={styles.carouselContainer}>
                        <CustomCarousel
                          data={carouselData}
                          renderItem={renderItem}
                        />
                      </View>
                      {error && (
                        <Text
                          style={[
                            styles.errorText,
                            {
                              fontSize: dynamicFontSize(
                                styles.errorText.fontSize
                              ),
                            },
                          ]}>
                          {error}
                        </Text>
                      )}
                      <View style={styles.formGrop}>
                        <Text
                          style={[
                            styles.headerText,
                            {
                              fontSize: dynamicFontSize(
                                styles.headerText.fontSize
                              ),
                            },
                          ]}>
                          Mobile Number
                        </Text>
                        <MobileNumberInput
                          mobileNumber={requestModel.LeadPhone}
                          setMobileNumber={handleMobileChange}
                          error={mobileError}
                        />
                      </View>
                      <View
                        style={{
                          flex: 1,
                          justifyContent: "flex-start",
                        }}>
                        <WhatsAppToggle
                          isEnabled={isWhatsAppEnabled}
                          onToggle={toggleWhatsApp}
                        />
                      </View>
                      <View style={styles.termsContainer}>
                        <Checkbox
                          style={[
                            styles.checkbox,
                            !termsAccepted ? styles.checkboxDisabled : {},
                          ]}
                          value={termsAccepted}
                          onValueChange={handleCheckboxTap}
                          color={termsAccepted ? "#FF8800" : undefined}
                        />

                        <View style={styles.tc}>
                          <Text
                            style={[
                              styles.p,
                              { fontSize: dynamicFontSize(styles.p.fontSize) },
                            ]}>
                            I accept the{" "}
                            <Text
                              style={[
                                styles.link,
                                {
                                  fontSize: dynamicFontSize(
                                    styles.link.fontSize
                                  ),
                                },
                              ]}
                              onPress={() => {
                                let num = isValidPhoneNumber(
                                  requestModel.LeadPhone
                                );
                                setMobileError(num);
                                if (num != null) {
                                  return;
                                }

                                setModalVisible(true);
                              }}>
                              terms and conditions
                            </Text>{" "}
                            and consent to provide ABC Bank Pvt Ltd to fetch my
                            credit bureau report for the purpose of offering
                            lending services.
                          </Text>
                        </View>
                        <ReusableModal
                          modalVisible={modalVisible}
                          setModalVisible={setModalVisible}
                          modalContent={modalContentA}
                        />
                      </View>
                    </View>
                    <ButtonComponent
                      title="Proceed"
                      onPress={handleSubmit}
                      disabled={!termsAccepted}
                      style={{
                        button: !termsAccepted
                          ? styles.buttonDisabled
                          : styles.buttonEnabled,
                      }}
                      textStyle={{
                        buttonText: !termsAccepted
                          ? styles.buttonDisabledText
                          : styles.buttonEnabledText,
                      }}
                    />
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
            </KeyboardAvoidingView>
          </View>
        </View>
      </Layout>
    </View>
  );
}

export default LoginScreen;
