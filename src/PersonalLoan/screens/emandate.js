import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, useWindowDimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { styles } from '../services/style/gloablStyle';
import Icon from 'react-native-vector-icons/AntDesign';
import ProgressBar from '../components/progressBar';
import { useProgressBar } from '../components/progressContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppContext } from '../components/useContext';
import CustomInput from '../components/input';
import { GoBack } from '../services/Utils/ViewValidator';
import ScreenError, { useErrorEffect } from './ScreenError';
import LoadingOverlay from '../components/FullScreenLoader';
import SaveLeadStage from '../services/API/SaveLeadStage';
import { SendGeoLocation } from '../services/API/LocationApi';
import { STATUS } from '../services/API/Constants';
import { useDispatch, useSelector } from 'react-redux';
import { ALL_SCREEN } from '../services/Utils/Constants';
import { updateJumpTo } from '../services/Utils/Redux/LeadStageSlices';
import CustomDropdown from '../components/Dropdown';
import useJumpTo from "../components/StageComponent";

const EMandateScreen = ({ navigation }) => {

  const stageMaintance = useJumpTo("eMandate", "loanAgreement", navigation);

  const [selectedAccount, setSelectedAccount] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [loading, setLoading] = useState(false);
  const nextJumpTo = useSelector(state => state.leadStageSlice.jumpTo);

  const dispatch = useDispatch();
  const onTryAgainClick = () => {
  };
  const { errorScreen, setNewErrorScreen } = useErrorEffect(onTryAgainClick);


  // Dummy data for bank accounts
  const bankAccounts = [
    { label: '65704123215123 - HDFC Bank Goregaon (W)', value: '1' },
    { label: '65704123215123 - Axis Bank Goregaon (W)', value: '2' },
    // ... more accounts
  ];

  const { setProgress } = useProgressBar();
  const { fontSize } = useAppContext();
  const dynamicFontSize = (size) => size + fontSize;

  const { width, height } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;

  const containerStyle = isDesktop ? styles.desktopContainer : isMobile ? styles.mobileContainer : styles.tabletContainer;
  const imageContainerStyle = isDesktop ? { width: '50%' } : { width: '100%' };

  const HandleProcced = async () => {
    setLoading(true)
    setNewErrorScreen(null)


    const saveLeadStageResponse = await SaveLeadStage(stageMaintance.jumpTo)
    if (saveLeadStageResponse.status == STATUS.ERROR) {
      setLoading(false)
      setNewErrorScreen(saveLeadStageResponse.message)
      return
    }

    dispatch(updateJumpTo(stageMaintance))



    console.log("========== fetching location =================");
    await SendGeoLocation(10);
    console.log("========== fetching location =================");
    setLoading(false);
    navigation.navigate('loanAgreement')
  }

  const renderGradientButton = (text, onPress, disabled = false) => (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={{
        flex: 1,
        borderWidth: 1,
        borderColor: disabled ? '#E9EEFF' : '#002777', // Changed from '#00194c' to '#E9EEFF' for disabled state
        borderRadius: 5,
        overflow: 'hidden',
      }}
    >
      <LinearGradient
        colors={disabled ? ['#E9EEFF', '#D8E2FF'] : ['#002777', '#00194C']}
        style={[styles.button, disabled && styles.disabledButton]}
      >
        <Text style={[
          styles.buttonText,
          {
            fontSize: dynamicFontSize(styles.buttonText.fontSize),
            color: disabled ? '#ffffff' : '#FFFFFF'
          }
        ]}>
          {text}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
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


          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

            <View style={{ padding:16 }}>
              <ProgressBar progress={0.6} />
              <Text
                style={[
                  styles.headerText,
                  {
                    fontSize: dynamicFontSize(styles.headerText.fontSize),
                    textTransform: "none",
                  },

                ]}>
                eMandate
              </Text>
              <Text
                style={{ fontSize: 14, color: "#00194c", fontFamily: 'Poppins_400Regular' }}>
                Please sign the e-mandate
              </Text>
            </View>
            <View style={styles.container}>
              <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View>
                  <Text
                    style={[
                      styles.label,
                      { fontSize: dynamicFontSize(styles.label.fontSize) },
                      {fontFamily:"Poppins_500Medium"}
                    ]}>
                    Bank Account Number{" "}
                    <Text style={styles.mandatoryStar}>*</Text>
                  </Text>
                  <CustomDropdown
                    options={bankAccounts}
                    selectedValue={selectedAccount}
                    onValueChange={(itemValue) => setSelectedAccount(itemValue)}
                  />

                  <Text
                    style={[
                      styles.label,
                      { fontSize: dynamicFontSize(styles.label.fontSize), fontFamily:"Poppins_500Medium" },
                    ]}>
                    Bank Branch IFSC Code{" "}
                    <Text style={styles.mandatoryStar}>*</Text>
                  </Text>
                  <CustomInput
                    value={ifscCode}
                    onChangeText={(text) => setIfscCode(text)}
                    placeholder="Enter your bank branch IFSC code"
                    editable={selectedAccount !== ""}
                    style={selectedAccount === "" ? styles.disabledInput : {}}
                  />

                  {renderGradientButton("SIGN eMANDATE", () => {
                    HandleProcced();
                  })}

                  <View style={styles.orWrapper}>
                    <Text
                      style={[
                        styles.or,
                        { fontSize: dynamicFontSize(styles.or.fontSize) },
                      ]}>
                      OR
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.uploadButtonNach}>
                    <Text
                      style={[
                        styles.uploadButtonNachText,
                        {
                          fontSize: dynamicFontSize(
                            styles.uploadButtonNachText.fontSize
                          ),
                        },
                      ]}>
                      Upload Physical NACH
                    </Text>
                    <Icon
                      name="upload"
                      size={16}
                      color="#fff"
                      style={[
                        styles.icon,
                        { backgroundColor: "#FF8600", padding: 10 },
                      ]}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.downloadSamplebutton}>
                    <Text
                      style={[
                        styles.downloadSamplebuttonText,
                        {
                          fontSize: dynamicFontSize(
                            styles.downloadSamplebuttonText.fontSize
                          ),
                        },
                      ]}>
                      Download NACH Form
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
            <View
              style={[
                styles.actionContainer,
                styles.boxShadow,
                { paddingHorizontal: 16 },
              ]}>
              <TouchableOpacity
                style={[styles.backButton, { marginRight: 10 }]}
                onPress={() => GoBack(navigation)}>
                <Text
                  style={[
                    styles.backBtnText,
                    {
                      fontSize: dynamicFontSize(styles.backBtnText.fontSize),
                    },
                  ]}>
                  BACK
                </Text>
              </TouchableOpacity>
              {renderGradientButton("PROCEED", () => HandleProcced())}
            </View>

          </ScrollView>


          {
            errorScreen.type != null && (
              <ScreenError
                errorObject={errorScreen}
                onTryAgainClick={onTryAgainClick}
                setNewErrorScreen={setNewErrorScreen}
              />
            )
          }
        </KeyboardAvoidingView>
      </View>
    </View >
  );
};

export default EMandateScreen;