import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, useWindowDimensions, ImageBackground } from 'react-native';
import { styles } from '../services/style/gloablStyle';
import { useAppContext } from '../components/useContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useProgressBar } from '../components/progressContext';
import ProgressBar from '../components/progressBar';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { formateAmmountValue } from '../services/Utils/FieldVerifier';
import { GetApplicantId } from '../services/LOCAL/AsyncStroage';
import { FontAwesome5 } from '@expo/vector-icons';
import { GetBankFundOutData, GetBankFundOutDataModel } from '../services/API/InitialDisbursal';
import ScreenError, { useErrorEffect } from './ScreenError';
import LoadingOverlay from '../components/FullScreenLoader';
import { STATUS } from '../services/API/Constants';
import useJumpTo from "../components/StageComponent";
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import { CheckCircle2, MapPin, Lock, Building2 } from 'lucide-react';

const DisbursementAcceptedScreen = ({ navigation }) => {


  const disbursedetails = useSelector(state => state.disbursalInfoSlices);

  const [transactionDetails, setTransactionDetails] = useState(null);

  const [refresh, setRefersh] = useState(true)
  const [loading, setLoading] = useState(false);
  const onTryAgainClick = () => {
    setNewErrorScreen(null)
    setRefersh(true)
  }

  const { errorScreen, setNewErrorScreen } = useErrorEffect(onTryAgainClick)




  const { fontSize } = useAppContext();
  const dynamicFontSize = (size) => size + fontSize;

  const { setProgress } = useProgressBar();

  useFocusEffect(
    useCallback(() => {
      setProgress(10);

      if (!refresh) {
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

      setRefersh(false)

    }, [refresh]));





  const { width, height } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';

  // Definitions for "mobile", "tablet", and "desktop" based on width
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024; // Tablet range, including iPad portrait
  const isDesktop = width >= 1024; // Desktop and iPad landscape


  const containerStyle = isDesktop ? styles.desktopContainer : isMobile ? styles.mobileContainer : styles.tabletContainer;
  const imageContainerStyle = isDesktop ? { width: '60%' } : { width: '100%' };

  const DetailItem = ({ style, iconName, label, value, isLastItem }) => (
    <View style={[styles.detailItem, !isLastItem && styles.borderBottom]}>
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
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}>

          <LoadingOverlay visible={loading} />

          <View style={[ styles.centerAlignedContainerHeader, { padding: 16 }]}>
            <ProgressBar progress={10} />
          </View>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.centerAlignedContainer}>
            <View style={styles.container}>
              <ImageBackground
                source={require("../../assets/images/Confetti.png")}
                style={styles.disbursebackgroundImage}>
                <View style={styles.disursecontent}>
                  <View style={styles.statusSection}>
                    <Text style={styles.disburseSentence}>
                      Your disbursement request is processed
                    </Text>
                    <Text style={styles.disburseamount}>
                      ₹{" "}
                      {formateAmmountValue(transactionDetails?.DisbursementAmount)}
                    </Text>
                    <Text style={styles.disburseAccountInfo}>
                      Transferred to Bank Account - {transactionDetails?.BankAcc}
                    </Text>

                    <Text style={styles.disburseTransactionInfo}>
                      {transactionDetails?.TransactionDate && format(transactionDetails?.TransactionDate, "PPP")}

                    </Text>
                  </View>
                </View>
                <View style={styles.detailsContainer}>
                  <DetailItem
                    iconName="calendar-alt"
                    label="1st EMI Date"
                    value={transactionDetails?.EMIDate && format(transactionDetails?.EMIDate, "PPP")}
                  />
                  <DetailItem
                    iconName="rupee-sign"
                    label="EMI Amount"
                    value={transactionDetails?.EMIAmount && `₹ ${formateAmmountValue(transactionDetails?.EMIAmount)}`}
                  />
                  <DetailItem
                    iconName="id-card"
                    label="Mandate ID"
                    value={transactionDetails?.MandateID}
                    style={{ maxWidth: 200 }}
                    isLastItem
                  />
                </View>
              </ImageBackground>
              <View style={styles.disbursebannerContainer}>
                <Image
                  source={require("../../assets/images/smart-banking.png")}
                  style={styles.disbursebannerImage}
                />
              </View>
            </View>
            </View>
          </ScrollView>
          <View style={[styles.boxShadow]}>
            <View style={[styles.actioncontainer,styles.centerAlignedContainer]}>
            <LinearGradient
              // button Linear Gradient 
              colors={["#002777", "#00194C"]}
              style={styles.homeButton}>
              <TouchableOpacity onPress={() => {
              navigation.navigate("Dashboard")
              }}>
                <Text
                  style={[
                    styles.homeButtonText,
                    { fontSize: dynamicFontSize(styles.homeButtonText.fontSize) },
                  ]}>
                  Home Page
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
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};


export default DisbursementAcceptedScreen;
