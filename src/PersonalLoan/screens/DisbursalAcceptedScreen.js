import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView,Platform, useWindowDimensions } from 'react-native';
import { styles } from '../../assets/style/personalStyle';
import { useAppContext } from '../../Common/components/useContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useProgressBar } from '../../Common/components/ControlPanel/progressContext';
import ProgressBar from '../../Common/components/ControlPanel/progressBar';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { formateAmmountValue } from '../services/Utils/FieldVerifier';
import { GetApplicantId } from '../services/LOCAL/AsyncStroage';

const DisbursementAcceptedScreen = ({ navigation }) => {

  const [applicationId, setApplicationID] = useState(null)

  const disbursedetails = useSelector(state => state.disbursalInfoSlices);


    useEffect(() => {
        console.log("================ Transaction details =======================")
        console.log(disbursedetails)
    }, []);


    const { fontSize } = useAppContext();
    const dynamicFontSize = (size) => size + fontSize;

    const { setProgress } = useProgressBar();

    useEffect(() => {
        setProgress(10);
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
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <View style={styles.container}>
                <ProgressBar progress={10} />
                <View style={styles.disursecontent}>
                  <View style={styles.statusSection}>
                    <Image
                      source={require("../../assets/images/success.png")}
                      style={styles.statusIcon}
                    />
                    <Text style={styles.disburseSentence}>
                      Your disbursement request is processed
                    </Text>
                    <Text style={styles.disburseamount}>
                      ₹{" "}
                      {formateAmmountValue(disbursedetails?.NetDisbursalAmount)}
                    </Text>
                  </View>
                </View>
                <View style={styles.disbursedetails}>
                <View style={styles.disbuseItemDetails}>
                    <Text style={styles.disbuseItem}>Loan ID</Text>
                    <Text style={styles.disbuseItem}>
                      {applicationId}
                    </Text>
                  </View>
                  <View style={styles.disbuseItemDetails}>
                    <Text style={styles.disbuseItem}>1st EMI Date</Text>
                    <Text style={styles.disbuseItem}>
                      {format(disbursedetails?.FirstEmiDate, "PPP")}
                    </Text>
                  </View>
                  <View style={styles.disbuseItemDetails}>
                    <Text style={styles.disbuseItem}>EMI Amount</Text>
                    <Text style={styles.disbuseItem}>
                      ₹ {disbursedetails?.EmiAmount}
                    </Text>
                  </View>
                  <View style={styles.disbuseItemDetails}>
                    <Text style={styles.disbuseItem}>Transaction UTR</Text>
                    <Text style={styles.disbuseItem}>
                      {disbursedetails?.TransactionUtr}
                    </Text>
                  </View>
                  <View style={styles.disbuseItemDetails}>
                    <Text style={styles.disbuseItem}>Transaction Date</Text>
                    <Text style={styles.disbuseItem}>
                      {format(disbursedetails?.TransactionDate, "PPP")}
                    </Text>
                  </View>
                  <View style={styles.disbuseItemDetails}>
                    <Text style={styles.disbuseItem}>Account No</Text>
                    <Text style={styles.disbuseItem}>
                      {disbursedetails?.BankAcc}
                    </Text>
                  </View>

                  {/* <View style={styles.disbuseItemDetails}>
                        <Text style={styles.disbuseItem}>Transaction Id</Text>
                        <Text style={[styles.disbuseItem,{width:180}]}>{disbursedetails?.TransactionId}</Text>
                    </View>
 */}
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
                                onPress={() => {}}
                            >
                                <Text style={[styles.buttonText, { fontSize: dynamicFontSize(styles.buttonText.fontSize) }]}>Home Page</Text>
                            </TouchableOpacity>
                        </LinearGradient> */}
                  </View>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </View>
    );
};




export default DisbursementAcceptedScreen;
