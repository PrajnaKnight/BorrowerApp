import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAppContext } from "../components/useContext";
import { useRoute } from "@react-navigation/native";
import { styles } from "../services/style/gloablStyle";
import { checkImagePermission } from "../../Common/screens/PermissionScreen";
import { ALL_SCREEN, Something_Went_Wrong } from "../services/Utils/Constants";
import { useDispatch, useSelector } from "react-redux";
import SaveLeadStage from "../services/API/SaveLeadStage";
import { updateJumpTo } from "../services/Utils/Redux/LeadStageSlices";
import ScreenError, { useErrorEffect } from "./ScreenError";
import LoadingOverlay from "../components/FullScreenLoader";
import { CheckEsignLoanAgreement } from "../services/API/ESignDocument";
import { DownloadMyFile } from "../services/Utils/FieldVerifier";
import { STATUS } from "../services/API/Constants";
import { GoBack } from "../services/Utils/ViewValidator";
import applyFontFamily from "../services/style/applyFontFamily";
import useJumpTo from "../components/StageComponent";
import { CheckCircle2, MapPin, Lock, Building2 } from "lucide-react";

const ThankYou = ({ navigation }) => {
  const route = useRoute();

  const ShowPdf = async () => {
    if ((await checkImagePermission()) == false) {
      navigation.navigate("PermissionsScreen", {
        permissionStatus: "denied",
        permissionType: "files",
      });
      return;
    }

    setLoading(true);
    const checkEsignResponse = await CheckEsignLoanAgreement();
    setLoading(false);

    if (checkEsignResponse.status == STATUS.ERROR) {
      setNewErrorScreen(checkEsignResponse.message || Something_Went_Wrong);
    }
  };

  // const handleDownloadForMobile = async () => {

  //     if(await checkImagePermission() == false){
  //       navigation.navigate("PermissionsScreen", { permissionStatus: "denied", permissionType: 'files' })
  //       return
  //     }

  //     try {

  //         let Share = require('react-native-share').default;

  //         let fileName = route.params?.fileName

  //         if (fileName.endsWith('.pdf')) {
  //           fileName = fileName.slice(0, -4); // Remove the last 4 characters (which is ".pdf")
  //         }
  //         let shareResult = await Share.open({
  //           url: `data:application/pdf;base64,${route.params?.pdfUri}`,
  //           filename: fileName,
  //           isNewTask: true,
  //           title: "Save file",
  //           failOnCancel: false
  //         })

  //     }
  //     catch (e) {
  //       console.log(e)
  //     }

  // }
  // const handleDownloadAndShowPdf = () => {
  //   try {
  //     const byteCharacters = atob(route.params.pdfUri);
  //     const byteNumbers = new Array(byteCharacters.length);
  //     for (let i = 0; i < byteCharacters.length; i++) {
  //       byteNumbers[i] = byteCharacters.charCodeAt(i);
  //     }
  //     const byteArray = new Uint8Array(byteNumbers);
  //     const blob = new Blob([byteArray], { type: 'application/pdf' });
  //     const url = URL.createObjectURL(blob);

  //     const link = document.createElement('a');
  //     link.href = url;
  //     link.download = route.params?.fileName;
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //     return url;
  //   } catch (e) {
  //     console.log(e);
  //     return null;
  //   }
  // };

  const { fontSize } = useAppContext();
  const dynamicFontSize = (size) => size + fontSize;

  const { width, height } = useWindowDimensions();
  const isWeb = Platform.OS === "web";

  // Definitions for "mobile", "tablet", and "desktop" based on width
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024; // Tablet range, including iPad portrait
  const isDesktop = width >= 1024; // Desktop and iPad landscape

  const containerStyle = isDesktop
    ? styles.desktopContainer
    : isMobile
    ? styles.mobileContainer
    : styles.tabletContainer;
  const imageContainerStyle = isDesktop ? { width: "60%" } : { width: "100%" };

  const onTryAgainClick = () => {
    setRefreshPage(true);
  };

  const { errorScreen, setNewErrorScreen } = useErrorEffect(onTryAgainClick);

  const [loading, setLoading] = useState(false);

  const stageMaintance = useJumpTo(
    "loanAgreement",
    "InitiateDisbursalScreen",
    navigation
  );

  const nextJumpTo = useSelector((state) => state.leadStageSlice.jumpTo);

  const dispatch = useDispatch();

  const HandleProceed = async () => {
    setLoading(true);
    const saveLeadStageResponse = await SaveLeadStage(stageMaintance.jumpTo);
    setLoading(false);
    if (saveLeadStageResponse.status == STATUS.ERROR) {
      setNewErrorScreen(saveLeadStageResponse.message);
      return;
    }

    dispatch(updateJumpTo(stageMaintance));

    navigation.navigate("InitiateDisbursalScreen");
  };

  const steps = [
    {
      id: 1,
      title: "Primary Information",
      subtitle: "प्राथमिक जानकारी",
      icon: CheckCircle2,
      status: "current",
    },
    {
      id: 2,
      title: "Personal Information",
      subtitle: "व्यक्तिगत जानकारी",
      icon: MapPin,
      status: "disabled",
    },
    {
      id: 3,
      title: "eKYC OTP Verification",
      subtitle: "ईकेवाईसी ओटीपी सत्यापन",
      icon: Lock,
      status: "disabled",
    },
    {
      id: 4,
      title: "Address Details",
      subtitle: "पते का विवरण",
      icon: Building2,
      status: "disabled",
    },
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

          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.container}>
              <View style={styles.centerAlignedContainer}>
                <View
                  style={[
                    screenStyles.successContainer,
                    { flex: 1, minHeight: "83%" },
                  ]}>
                  <Image
                    source={require("../../assets/images/Done.gif")}
                    resizeMode="contain"
                    style={screenStyles.successIcon}
                  />
                  <Text style={screenStyles.message}>Done!</Text>
                  <Text style={screenStyles.subMessage}>
                    Thank you for signing the loan agreement. Your loan amount
                    will be disbursed shortly.
                  </Text>
                  <View style={{ height: 10 }}></View>
                </View>
                {route.params?.pdfUri && (
                  <View style={styles.DownloadBtnWrapper}>
                    <LinearGradient
                      colors={["#002777", "#00194C"]}
                      style={styles.downloadButton}>
                      <TouchableOpacity onPress={() => ShowPdf()}>
                        <Text
                          style={[
                            styles.buttonText,
                            {
                              fontSize: dynamicFontSize(
                                styles.buttonText.fontSize
                              ),
                            },
                          ]}>
                          Download Your Signed Document
                        </Text>
                      </TouchableOpacity>
                    </LinearGradient>
                  </View>
                )}
              </View>
            </View>
          </ScrollView>
          <View style={styles.boxShadow}>
            <View
              style={[
                styles.actionContainer,
                styles.centerAlignedContainer,
                { marginBottom: 10 },
              ]}>
              <TouchableOpacity
                style={[styles.backButton]}
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
              <LinearGradient
                colors={["#002777", "#00194C"]}
                style={styles.verifyButton}>
                <TouchableOpacity onPress={() => HandleProceed()}>
                  <Text
                    style={[
                      styles.buttonText,
                      {
                        fontSize: dynamicFontSize(styles.buttonText.fontSize),
                      },
                    ]}>
                    PROCEED
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

const screenStyles = StyleSheet.create({
  successContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  successIcon: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  message: {
    fontSize: 22,
    color: "green",
    marginBottom: 10,
    fontFamily: "Poppins_500Medium",
  },
  subMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    color: "#00194C",
    fontFamily: "Poppins_400Regular",
  },
  backButtonDisabled: {
    backgroundColor: "#e0e0e0",
    borderColor: "#e0e0e0",
    opacity: 0.7,
  },
});

export default ThankYou;
