import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, useWindowDimensions, Image } from 'react-native';
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
import { CheckCircle2, MapPin, Lock, Building2 } from 'lucide-react';

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
  const imageContainerStyle = isDesktop ? { width: '60%' } : { width: '100%' };

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

          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View
              style={[
                styles.centerAlignedContainerHeader,
                { padding: 16, paddingBottom: 10 },
              ]}>
              <ProgressBar progress={0.6} />
              <Text
                style={[
                  styles.headerText,
                  { fontSize: dynamicFontSize(styles.headerText.fontSize) },
                ]}>
                eMandate
              </Text>
              <Text
                style={{ fontSize: 14, color: "#00194c", fontFamily: "400" }}>
                Please sign the e-mandate
              </Text>
            </View>

            <View style={styles.container}>
              <View style={styles.centerAlignedContainer}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                  <View>
                    <Text
                      style={[
                        styles.label,
                        { fontSize: dynamicFontSize(styles.label.fontSize) },
                        { fontFamily: "Poppins_500Medium" },
                      ]}>
                      Bank Account Number{" "}
                      <Text style={styles.mandatoryStar}>*</Text>
                    </Text>
                    <CustomDropdown
                      options={bankAccounts}
                      selectedValue={selectedAccount}
                      onValueChange={(itemValue) =>
                        setSelectedAccount(itemValue)
                      }
                    />

                    <Text
                      style={[
                        styles.label,
                        {
                          fontSize: dynamicFontSize(styles.label.fontSize),
                          fontFamily: "Poppins_500Medium",
                        },
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
            </View>
            <View style={[styles.boxShadow, { paddingHorizontal: 16 }]}>
              <View
                style={[styles.actionContainer,styles.centerAlignedContainer]}>
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
  );
};

export default EMandateScreen;