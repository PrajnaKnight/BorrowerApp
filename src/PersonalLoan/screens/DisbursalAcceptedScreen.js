import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView,Platform, useWindowDimensions, ImageBackground } from 'react-native';
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

const DisbursementAcceptedScreen = ({ navigation }) => {

  const [applicationId, setApplicationID] = useState(null)

  const [transactionDetails, setTransactionDetails] = useState(null);

  const [loading, setLoading] = useState(false);
  const onTryAgainClick = () => {
    setNewErrorScreen(null)
  }

  const { errorScreen, setNewErrorScreen } = useErrorEffect(onTryAgainClick)



    const { fontSize } = useAppContext();
    const dynamicFontSize = (size) => size + fontSize;

    const { setProgress } = useProgressBar();

    useEffect(() => {
        setProgress(10);
        setLoading(true)
        

        GetBankFundOutData().then((response) => {
          setLoading(false)
          if (response.status == STATUS.ERROR) {
            setNewErrorScreen(response.message)
            return
          }
  
          setTransactionDetails(GetBankFundOutDataModel(response.data))
  
        })
        GetApplicantId().then((response)=>{
          setApplicationID(response)
        })
    }, []);

    const { width, height } = useWindowDimensions();
    const isWeb = Platform.OS === 'web';
    
    // Definitions for "mobile", "tablet", and "desktop" based on width
    const isMobile = width < 768; 
    const isTablet = width >= 768 && width < 1024; // Tablet range, including iPad portrait
    const isDesktop = width >= 1024; // Desktop and iPad landscape
  
  
    const containerStyle = isDesktop ? styles.desktopContainer : isMobile ? styles.mobileContainer : styles.tabletContainer;
    const imageContainerStyle = isDesktop ? { width: '50%' } : { width: '100%' };

    const DetailItem = ({ iconName, label, value, isLastItem }) => (
      <View style={[styles.detailItem, !isLastItem && styles.borderBottom]}>
        <View style={styles.disburseiconContainer}>
          <FontAwesome5 name={iconName} size={16} color="#FFFFFF" />
        </View>
        <View style={styles.detailTextContainer}>
          <Text style={styles.disbursedetailLabel}>{label}</Text>
          <Text style={styles.detailValue}>{value}</Text>
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
                    <Text style={styles.webfeatureText}>
                      Nil processing fee*
                    </Text>
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
                    There's more! Complete the entire process in just 3-steps
                    that isn't any more than 30 minutes.
                  </Text>
                  <TouchableOpacity>
                    <Text style={styles.weblinkText}>
                      To know more about product features & benefits, please
                      click here
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
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}>
            <LoadingOverlay visible={loading} />

            <View style={{ paddingHorizontal: 16 }}>
              <ProgressBar progress={10} />
            </View>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
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
                        Transaction ID : {transactionDetails?.TransactionID}
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
                      value= {transactionDetails?.EMIDate && format(transactionDetails?.EMIDate, "PPP")}
                    />
                    <DetailItem
                      iconName="rupee-sign"
                      label="EMI Amount"
                      value= {transactionDetails?.EMIAmount && `₹ ${formateAmmountValue(transactionDetails?.EMIAmount)}`}
                    />
                    <DetailItem
                      iconName="id-card"
                      label="Mandate ID"
                      value={null}
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
            </ScrollView>
            <View style={[styles.actionContainer, styles.boxShadow]}>
              <LinearGradient
                // button Linear Gradient
                colors={["#002777", "#00194C"]}
                style={styles.agreebutton}>
                <TouchableOpacity onPress={() => {}}>
                  <Text
                    style={[
                      styles.buttonText,
                      { fontSize: dynamicFontSize(styles.buttonText.fontSize) },
                    ]}>
                    Home Page
                  </Text>
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




export default DisbursementAcceptedScreen;
