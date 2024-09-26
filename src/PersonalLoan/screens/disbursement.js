import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions, Platform, KeyboardAvoidingView, ScrollView, Image, ImageBackground } from 'react-native';
import { FontAwesome, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'; // Import Expo Vector Icons
import { styles } from '../services/style/gloablStyle';
import { useAppContext } from '../components/useContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useProgressBar } from '../components/progressContext';
import ProgressBar from '../components/progressBar';
import { BankFundOut, GetBankFundOutData, GetBankFundOutDataModel, GetDisbursalData, GetDisbursalModel } from '../services/API/InitialDisbursal';
import { API_RESPONSE_STATUS, STATUS } from '../services/API/Constants';
import ScreenError, { useErrorEffect } from './ScreenError';
import LoadingOverlay from '../components/FullScreenLoader';
import { formatDate, formateAmmountValue, properAmmount } from '../services/Utils/FieldVerifier';
import { format } from 'date-fns';
import { updateDisbursalInfoFromGetBankFundOut } from '../services/Utils/Redux/DisbursalInfo';
import { useDispatch, useSelector } from 'react-redux';
import { GetApplicantId } from '../services/LOCAL/AsyncStroage';
import { useFocusEffect } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import useJumpTo from "../components/StageComponent";
import { CheckCircle2, MapPin, Lock, Building2 } from 'lucide-react';


const DisbursementScreen = ({ navigation }) => {

  const [loading, setLoading] = useState(false);
  const [refreshPage, setRefreshPage] = useState(true)
  const [disbursalInfo, setDisbursalInfo] = useState(null)


  const onTryAgainClick = () => {
    setNewErrorScreen(null)
    setRefreshPage(true)
  }

  const { errorScreen, setNewErrorScreen } = useErrorEffect(onTryAgainClick)


  const LoadPage = async() =>{
    let apiResponse = API_RESPONSE_STATUS()
    const disbursal = await GetDisbursalData()
    if(disbursal.status == STATUS.ERROR){
      apiResponse.status = STATUS.ERROR
      apiResponse.message = disbursal.message
      return apiResponse;
    }

    let details = GetDisbursalModel(disbursal.data)
    setDisbursalInfo(details)


 
    apiResponse.status = STATUS.SUCCESS
    return apiResponse

  }
  useFocusEffect(
    useCallback(() => {
      if (!refreshPage) {
        return
      }
      setLoading(true)
      setNewErrorScreen(null)
      LoadPage().then((response) => {
        setLoading(false)
        if (response.status == STATUS.ERROR) {
          setNewErrorScreen(response.message)
          return
        }
      })
      
    
      setRefreshPage(false)
    }, [refreshPage]))

  useFocusEffect(
    useCallback(() => {
      

      if(disbursalInfo == null){
        return
      }
      if (disbursalInfo.IsFundOutComplete) {
        navigation.replace("DisbursalAcceptedScreen");
        return
      }

      setTimeout(() => {
          setLoading(true)

          setTimeout(() => {
            BankFundOut(disbursalInfo?.LoanAmount).then((response) => {
              setLoading(false);
              if (response.status === STATUS.ERROR) {
                setNewErrorScreen(response.message);
                return;
              }


              navigation.replace("DisbursalAcceptedScreen");
            });
          }, 15000);
        
      }, 5000);
    }, [disbursalInfo]))

  const { fontSize } = useAppContext();
  const dynamicFontSize = (size) => size + fontSize;

  const { setProgress } = useProgressBar();

  useEffect(() => {
    setProgress(10);
  }, []);

  const { width, height } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';

  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;

  const containerStyle = isDesktop ? styles.desktopContainer : isMobile ? styles.mobileContainer : styles.tabletContainer;
  const imageContainerStyle = isDesktop ? { width: '60%' } : { width: '100%' };

  const DetailItem = ({ style, iconName, label, value, isLastItem }) => (
    <View style={[styles.detailItem]}>
      <View style={styles.disburseiconContainer}>
        <FontAwesome5 name={iconName} size={16} color="#FFFFFF" />
      </View>
      <View style={styles.detailTextContainer}>
        <Text style={styles.disbursedetailLabel}>{label}</Text>
        <Text style={[styles.detailValue, style]}>{value}</Text>
      </View>
      <View style={styles.goldAccent} />
    </View>
  );
  
  
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
          <View style={[styles.centerAlignedContainer,{ paddingHorizontal: 16 }]}>
            <ProgressBar progress={10} />
          </View>
          {disbursalInfo != null &&
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <View style={styles.centerAlignedContainer}>
              <View style={[styles.container]}>
              <View style={[styles.disursecontent]}>
              <ImageBackground
                  source={require("../../assets/images/Confetti.png")}
                  style={styles.disbursebackgroundImage}>
                  <View style={styles.statusSection}>
                    <Text style={styles.disbursestatusText}>
                      Your disbursement request is accepted
                    </Text>
                    <Text style={styles.disburseamountText}>
                      ₹{" "}
                      {disbursalInfo?.LoanAmount &&
                        formateAmmountValue(
                          disbursalInfo?.LoanAmount
                        )}
                    </Text>
                    <Text style={styles.disbursesubtitleText}>
                      Net Disbursement Amount
                    </Text>
                  </View>
                  <View style={styles.detailsContainer}>
                    <DetailItem
                      iconName="calendar-alt"
                      label="1st EMI Date"
                      value={
                        disbursalInfo?.FirstEMIDate && format(disbursalInfo?.FirstEMIDate, 'PPP')
                      }
                    />
                    <DetailItem
                      iconName="rupee-sign"
                      label="EMI Amount"
                      value={disbursalInfo?.EmiAmount && `₹ ${formateAmmountValue(disbursalInfo?.EmiAmount)}/ m`}
                    />
                    <DetailItem
                      iconName="id-card"
                      label="Mandate ID"
                      value={disbursalInfo?.MandateID}
                      style={{maxWidth:200}}
                    />
                  </View>
                </ImageBackground>

                <Text style={styles.noteText}>
                  Disbursement requests are usually processed within 1-2 working
                  days
                </Text>

                <View style={styles.disbursebannerContainer}>
                  <Image
                    source={require("../../assets/images/smart-banking.png")}
                    style={styles.disbursebannerImage}
                  />
                </View>
              </View>
            </View>
            </View>
          </ScrollView>
}
          <View style={[ styles.boxShadow]}>
          <View style={[styles.actioncontainer,styles.centerAlignedContainer]}>
            <LinearGradient
              colors={["#002777", "#00194C"]}
              style={styles.homeButton}>
              <TouchableOpacity onPress={() => {
                 navigation.navigate("Dashboard")
              }}>
                <Text style={styles.homeButtonText}>HOME PAGE</Text>
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
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

export default DisbursementScreen;