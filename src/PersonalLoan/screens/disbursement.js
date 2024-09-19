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
  const imageContainerStyle = isDesktop ? { width: '50%' } : { width: '100%' };

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
                // button Linear Gradient
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
              {/* <View style={styles.bottomFixed}>
         <Image source={require('../assets/images/poweredby.png')} style={styles.logo} />
      </View> */}
            </View>
          </View>
        )}

        <KeyboardAvoidingView
          style={[styles.rightCOntainer, { flex: 1 }]}
          behavior={Platform.OS === "ios" ? "padding" : null}
          keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}>
          <LoadingOverlay visible={loading} />
          <View style={{ paddingHorizontal: 16 }}>
            <ProgressBar progress={10} />
          </View>
          {disbursalInfo != null &&
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
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
          </ScrollView>
}
          <View style={[styles.actioncontainer, styles.boxShadow]}>
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