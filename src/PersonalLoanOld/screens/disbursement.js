import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, useWindowDimensions, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';

import { styles } from '../../assets/style/personalStyle';
import { useAppContext } from '../../Common/components/useContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useProgressBar } from '../../Common/components/ControlPanel/progressContext';
import ProgressBar from '../../Common/components/ControlPanel/progressBar';
import { BankFundOut, GetBankFundOutData, GetBankFundOutDataModel } from '../services/API/InitialDisbursal';
import { STATUS } from '../services/API/Constants';
import ScreenError, { useErrorEffect } from './ScreenError';
import LoadingOverlay from '../components/FullScreenLoader';
import { formatDate, formateAmmountValue, properAmmount } from '../services/Utils/FieldVerifier';
import { format } from 'date-fns';
import { updateDisbursalInfoFromGetBankFundOut } from '../services/Utils/Redux/DisbursalInfo';
import { useDispatch, useSelector } from 'react-redux';
import { GetApplicantId } from '../services/LOCAL/AsyncStroage';
import { useFocusEffect } from '@react-navigation/native';

const DisbursementScreen = ({ navigation }) => {
  const disbursedetails = useSelector(state => state.disbursalInfoSlices);

  const [transactionDetails, setTransactionDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshPage, setRefreshPage] = useState(true)
  const [applicationId, setApplicationID] = useState(null)

  const dispatch = useDispatch()

  const onTryAgainClick = () => {
    setNewErrorScreen(null)
    setRefreshPage(true)
  }

  const { errorScreen, setNewErrorScreen } = useErrorEffect(onTryAgainClick)


  useFocusEffect(
    useCallback(() => {
      if (!refreshPage) {
        return
      }
      setLoading(true)
      GetBankFundOutData().then((response) => {
        setLoading(false)
        if (response.status == STATUS.ERROR) {
          setNewErrorScreen(response.message)
          return
        }

        setTransactionDetails(GetBankFundOutDataModel(response.data))

      })
      GetApplicantId().then((response) => {
        setApplicationID(response)
      })
      setRefreshPage(false)
    }, [refreshPage]))

  useEffect(() => {
    if (transactionDetails) {
      dispatch(updateDisbursalInfoFromGetBankFundOut(transactionDetails))
    }

    if (transactionDetails?.IsFundOutComplete) {
      navigation.replace("DisbursalAcceptedScreen");
      return
    }

    setTimeout(() => {
      if (transactionDetails?.UTRNumber && transactionDetails?.DisbursementAmount) {
        setLoading(true)

        setTimeout(() => {
          BankFundOut(transactionDetails?.UTRNumber, transactionDetails?.DisbursementAmount).then((response) => {
            setLoading(false);
            if (response.status === STATUS.ERROR) {
              setNewErrorScreen(response.message);
              return;
            }


            navigation.replace("DisbursalAcceptedScreen");
          });
        }, 15000);
      }
    }, 5000);
  }, [transactionDetails])

  const { fontSize } = useAppContext();
  const dynamicFontSize = (size) => size + fontSize;

  const { setProgress } = useProgressBar();

  useEffect(() => {
    setProgress(10);
  }, []);


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
          {transactionDetails?.UTRNumber != null && (
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <View style={[styles.container]}>
                <ProgressBar progress={10} />
                <View style={[styles.disursecontent, { marginVertical: 10 }]}>
                  <View style={styles.statusSection}>
                    <Image
                      source={require("../../assets/images/success.png")}
                      style={styles.statusIcon}
                    />
                    <Text style={styles.disburseSentence}>
                      Your disbursement request is accepted
                    </Text>
                    <Text style={styles.disburseamount}>
                      ₹ {transactionDetails?.DisbursementAmount}
                    </Text>
                    <Text style={styles.disburseSentence}>
                      Net Disbursement Amount
                    </Text>

                    {/* {transactionDetails.transactionId && (
                    <View style={styles.transferInfo}>
                      <Text style={styles.transerfferedDetails}>Transfer to {transactionDetails.beneficiary}</Text>
                      <Text style={styles.transferDetails}>Transaction ID: {transactionDetails.transactionId}</Text>
                      <Text style={styles.transferDetails}>{transactionDetails.transactionDate}</Text>


                    </View>
                  )
                  } */}
                  </View>
                  <View style={styles.disbursedetails}>
                    <View style={styles.disbuseItemDetails}>
                      <Text style={styles.disbuseItem}>Loan ID</Text>
                      <Text style={styles.disbuseItem}>{applicationId}</Text>
                    </View>

                    <View style={styles.disbuseItemDetails}>
                      <Text style={styles.disbuseItem}>Loan Amount</Text>
                      <Text style={styles.disbuseItem}>
                        {disbursedetails?.LoanAmount &&
                          `₹ ${formateAmmountValue(
                            disbursedetails?.LoanAmount
                          )}`}
                      </Text>
                    </View>

                    <View style={styles.disbuseItemDetails}>
                      <Text style={styles.disbuseItem}>
                        Processing Fee + Insurance
                      </Text>
                      <Text style={styles.disbuseItem}>
                        ₹{" "}
                        {parseInt(
                          (disbursedetails?.ProcessingFee || 0) +
                            (disbursedetails?.Insurance || 0)
                        )}
                      </Text>
                    </View>

                    <View style={styles.disbuseItemDetails}>
                      <Text style={styles.disbuseItem}>1st EMI Date</Text>
                      <Text style={styles.disbuseItem}>
                        {disbursedetails?.FirstEmiDate &&
                          format(disbursedetails?.FirstEmiDate, "PPP")}
                      </Text>
                    </View>

                    <View style={styles.disbuseItemDetails}>
                      <Text style={styles.disbuseItem}>EMI Amount</Text>
                      <Text style={styles.disbuseItem}>
                        {disbursedetails?.EmiAmount &&
                          `₹ ${formateAmmountValue(
                            disbursedetails?.EmiAmount
                          )}/ m`}
                      </Text>
                    </View>

                    <Text style={styles.Note}>
                      Disbursement requests are usually processed within 1-2
                      working days
                    </Text>
                  </View>

                  <View style={styles.bannerImage}>
                    <Image
                      source={require("../../assets/images/loanDisbursement.png")}
                      style={styles.banner}
                    />
                  </View>
                  <View style={styles.proceedButtonContainer}>
                    <View style={styles.actionContainer}>
                      {/* <LinearGradient
                      // button Linear Gradient
                      colors={['#002777', '#00194C']}
                      style={styles.agreebutton}
                    >
                      <TouchableOpacity
                        onPress={() => { }}
                      >
                        <Text style={[styles.buttonText, { fontSize: dynamicFontSize(styles.buttonText.fontSize) }]}>Home Page</Text>
                      </TouchableOpacity>
                    </LinearGradient> */}
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
          )}
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
