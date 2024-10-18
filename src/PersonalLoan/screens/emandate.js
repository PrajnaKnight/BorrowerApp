import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  Linking
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import CustomDropdown from "../../Common/components/ControlPanel/dropdownPicker";
import { useProgressBar } from "../../Common/components/ControlPanel/progressContext";
import ProgressBar from '../components/progressBar';
import { GoBack } from "../../PersonalLoan/services/Utils/ViewValidator";
import ButtonComponent from "../../Common/components/ControlPanel/button";
import Layout from "../../Common/components/Layout";
import CustomInput from "../../Common/components/ControlPanel/input";
import { LinearGradient } from "expo-linear-gradient";
import { styles as msmeStyle } from "../../assets/style/msmeStyle";
import FileUpload from "../../Common/components/ControlPanel/FileUpload";
import applyFontFamily from "../../assets/style/applyFontFamily";
import CustomBankDropdown from "../../Common/components/ControlPanel/CustomBankDropdown";

import UPIIcon from "../../assets/images/upiLogo.png";
import EMandateIcon from "../../assets/images/eNachLogo.png";
import NACHIcon from "../../assets/images/nachLogo.png";
import { LineChart } from "lucide-react";
import useJumpTo from "../components/StageComponent";
import SaveLeadStage from "../services/API/SaveLeadStage";
import { STATUS } from "../services/API/Constants";
import { updateJumpTo } from "../services/Utils/Redux/LeadStageSlices";
import { SendGeoLocation } from "../services/API/LocationApi";
import { useDispatch } from "react-redux";
import ScreenError, { useErrorEffect } from "./ScreenError";
import LoadingOverlay from "../components/FullScreenLoader";
import { CreateMandateModel, CreatePhysicalMandate, CreateUPIMandate, CreateUpiMandateModel, DownloadPhysicalMandateForm, GetMandateInfo } from "../services/API/Mandate";
import { GetApplicantId, GetLeadId } from "../services/LOCAL/AsyncStroage";
import { Digio, DigioConfig, Environment, GatewayEvent } from '@digiotech/react-native';
import DigioScreen, { DigioStatusScreen } from "../../Common/screens/digioScreen";

const MandateScreen = ({ navigation }) => {

  const stageMaintance = useJumpTo("eMandate", "loanAgreement", navigation);

  const [selectedAccount, setSelectedAccount] = useState(null);
  const [selectedAccountError, setSelectedAccountError] = useState(null);

  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(true)

  const [digiData, setDigiData] = useState({ mandateId: null, phoneNumber: null, token: null })
  const [digioWebHook, startDigioWebHook] = useState(false)
  const { mandateState, setMandateState } = DigioScreen({ startWebHook: digioWebHook, payload: digiData, setStartDigioWebHook: startDigioWebHook })

  const dispatch = useDispatch();


  const onTryAgainClick = () => {
    setRefresh(true)
    setMandateState(null)
  };
  const { errorScreen, setNewErrorScreen } = useErrorEffect(onTryAgainClick);



  const [ifscCode, setIfscCode] = useState(null);
  const [mandateType, setMandateType] = useState("eMandate");
  const [vpa, setVpa] = useState("");
  const [vpaError, setVpaError] = useState(null);


  const [createMandateModel, setCreateMandateModel] = useState({})
  const [mandateInfo, setMandateInfo] = useState({})
  const [leadId, setLeadId] = useState(null)





  const handleProceed = async () => {
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
  };

  const renderInput = (
    value,
    onChange,
    placeholder,
    editable = true,
    readOnly,
    error
  ) => (
    <View style={[styles.inputContainer, !editable && styles.disabledInput]}>
      <CustomInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChange}
        editable={editable}
        style={styles.input}
        readOnly={readOnly}
        error={error}
      />
    </View>
  );

  const renderMandateOptions = () => {

    const listOfOption = [{ type: "eMandate", icon: EMandateIcon },
    { type: "Physical NACH", icon: NACHIcon },]

    if (createMandateModel.MaximumAmount <= 15000) {
      listOfOption.push({ type: "UPI Mandate", icon: UPIIcon })
    }
    return <View style={styles.mandateOptionsContainer}>
      {listOfOption.map((option) => (



        <TouchableOpacity
          key={option.type}
          style={[
            styles.mandateOption,
            mandateType === option.type && styles.selectedMandateOption,
          ]}
          onPress={() => setMandateType(option.type)}
        >
          <Image
            source={option.icon}
            style={[
              styles.mandateIcon,
              mandateType === option.type && styles.selectedMandateIcon,
            ]}
          />
          <Text
            style={[
              styles.mandateOptionText,
              mandateType === option.type && styles.selectedMandateOptionText,
            ]}
          >
            {option.type}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  }



  const renderButton = (text, onPress, isPrimary = true, icon = null) => (
    <TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
      <LinearGradient
        colors={isPrimary ? ["#002777", "#00194C"] : ["#FFFFFF", "#FFFFFF"]}
        style={[styles.button, !isPrimary && styles.secondaryButton]}
      >
        <Text
          style={[styles.buttonText, !isPrimary && styles.secondaryButtonText]}
        >
          {text}
        </Text>
        {icon && (
          <Icon
            name={icon}
            size={16}
            color={isPrimary ? "#FFFFFF" : "#002777"}
            style={styles.buttonIcon}
          />
        )}
      </LinearGradient>
    </TouchableOpacity>
  );


  useEffect(() => {

    if (!refresh) {
      return
    }
    setNewErrorScreen(null);
    setLoading(true);
    GetLeadId().then((response) => {
      console.warn(response)
      setLeadId(response)
    })
    GetMandateInfo().then((response) => {
      setLoading(false);
      if (response.status == STATUS.ERROR) {
        setNewErrorScreen(response.message);
        return;
      }

      let data = {
        ...response.data,
      }


      if (response?.data?.BankDetails) {

        data.bankDetails = response?.data?.BankDetails?.map((item) => (
          {
            label: `${item.BankName} ${item.BankBranchName || ""}`,
            value: item.AccountNumber,
            bankName: item.BankName,
            destination_bank_id: item.IFSC,
            AccountType : item.AccountType
          }
        ))

      }

      setCreateMandateModel(CreateMandateModel(data, leadId))
      setMandateInfo(data)
    })
    setRefresh(false)

  }, [refresh])


  useEffect(() => {
    if (selectedAccount) {
      setSelectedAccountError(null)
      const selectedBank = mandateInfo?.bankDetails?.find(
        (account) => account.value === selectedAccount
      );
      console.log("selected " + JSON.stringify(selectedBank))

      setIfscCode(selectedBank.destination_bank_id)


      let mandateRole = { 
        ...createMandateModel,
        MandateDetails: { 
          ...createMandateModel.MandateDetails, 
          DestinationBankId: selectedBank.destination_bank_id, 
          DestinationBankName: selectedBank.bankName,
          CustomerAccountNumber : selectedBank.value,
          AccountType : selectedBank.AccountType
        } 
      }


      setCreateMandateModel(mandateRole)
    }


  }, [selectedAccount])

  useEffect(() => {
    if (vpa) {
      setVpaError(null)
    }
  }, vpa)




  const openUrl = async (mandateId, token, phoneNumber, applicationId) => {


    setDigiData(
      {
        mandateId: mandateId,
        token: token,
        phoneNumber: phoneNumber
      }
    )


    startDigioWebHook(true)

    // setStartWebSocket(true)

    // const url = `https://ext.digio.in/#/gateway/login/${mandateId}/${applicationId}/${phoneNumber}?token_id=${token}`;
    // // Check if the URL can be opened

    // if(Platform.OS != "web"){
    //   navigation.navigate("DigioScreen", {documentId, identifier,tokenId,url})
    //   return
    // }

    // console.log(url)
    // const supported = await Linking.canOpenURL(url);

    // if (supported) {
    //   // Open the URL
    //   await Linking.openURL(url);
    // } else {
    //   Alert.alert(`Can't open this URL: ${url}`);
    //   setStartWebSocket(false)

    // }
  };

  const HandleCreateMandate = async () => {
    setNewErrorScreen(null)
    if (!selectedAccount) {
      setSelectedAccountError("Please select the bank account")
      return
    }

    setLoading(true)

    console.log("========== create mandate =============")
    console.log(createMandateModel)
    const response = await CreatePhysicalMandate(createMandateModel)
    setLoading(false)

    if (response.status === STATUS.ERROR) {
      setNewErrorScreen(response.message)
      return
    }


    if (response?.data?.MandateId && response?.data?.TokenValue && mandateInfo?.mandate_data?.customer_mobile) {
      const applicationId = await GetApplicantId()
      openUrl(response?.data?.MandateId, response?.data?.TokenValue, mandateInfo?.mandate_data?.customer_mobile, applicationId)
    }

    console.log(response.data)

  }


  const HandleCreateUPIMandate = async () => {
    setNewErrorScreen(null)

    if (!selectedAccount) {
      setSelectedAccountError("Please select the bank account")
      return
    }

    if (!vpa) {
      setSelectedAccountError("Please provide UPI ID")
      return
    }
    else if (!new RegExp(/^[a-zA-Z0-9.-]{2, 256}@[a-zA-Z][a-zA-Z]{2, 64}$/).test(vpa)) {
      setSelectedAccountError("Please provide valid UPI ID")
      return
    }


    setLoading(true)



    let mandateRole = CreateUpiMandateModel(createMandateModel, leadId, vpa)

    console.log("========== create upi mandate =============")
    console.log(mandateRole)

    const response = await CreateUPIMandate(mandateRole)
    setLoading(false)

    if (response.status === STATUS.ERROR) {
      setNewErrorScreen(response.message)
      return
    }


    if (response?.data?.MandateId && response?.data?.AccessToken?.Id && mandateInfo?.mandate_data?.customer_mobile) {
      const applicationId = await GetApplicantId()
      openUrl(response?.data?.MandateId, response?.data?.AccessToken?.Id, mandateInfo?.mandate_data?.customer_mobile, applicationId)
    }

    console.log(response.data)

  }

  const DownloadNACHForm = async () => {
    setNewErrorScreen(null)
    setLoading(true)

    const createPhysicalMandateResponse = await CreatePhysicalMandate(createMandateModel)
    if (createPhysicalMandateResponse.status === STATUS.ERROR) {
      setNewErrorScreen(createPhysicalMandateResponse.message)
      setLoading(false)
      return
    }


    const reqquestModel = {
      LeadId: leadId,
      MandateId: createPhysicalMandateResponse?.data?.MandateId
    }
    const downloadPhysicalMandateFormResponse = await DownloadPhysicalMandateForm(reqquestModel)
    if (downloadPhysicalMandateFormResponse.status === STATUS.ERROR) {
      setNewErrorScreen(downloadPhysicalMandateFormResponse.message)
      setLoading(false)
      return
    }

    console.log(downloadPhysicalMandateFormResponse.data)
    setLoading(false)

  }

  return (
    <KeyboardAvoidingView
      style={[styles.rightCOntainer, { flex: 1 }]}
      behavior={Platform.OS === "ios" ? "padding" : null}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}>

      <LoadingOverlay visible={loading} />


      <ScrollView style={styles.scrollContainer}>
        <View style={styles.header}>
          <ProgressBar progress={0.1} />
          <Text style={styles.titleText}>Mandate</Text>
          <Text style={styles.subText}>Please sign the mandate</Text>
        </View>
        <View style={styles.container}>
          <CustomBankDropdown
            value={selectedAccount}
            setValue={(val) => {
              console.log("Selected account in MandateScreen:", val);
              setSelectedAccount(val);
            }}
            items={mandateInfo?.bankDetails || []}
            placeholder="Select Bank Account"
            label="Bank Account Number"
            error={selectedAccountError}
            zIndex={1000}
            selectedItemColor="#ffffff"
            arrowIconColor="#ff8500"
            selectedItemBackgroundColor="#758BFD"
          />

          <Text style={styles.label}>Bank Branch IFSC Code</Text>
          {renderInput(ifscCode, setIfscCode, "Enter IFSC Code", false, true)}

          <Text style={styles.label}>Select anyone</Text>
          {renderMandateOptions()}

          {mandateType === "Physical NACH" && (
            <View>
              <Text style={[styles.noteText, { fontStyle: "italic" }]}>
                <Icon name="infocirlceo" color="#FF8500" size={12} /> Download
                below NACH form & upload scanned signed form
              </Text>
              <TouchableOpacity style={styles.downloadNach} onPress={() => { DownloadNACHForm() }}>
                <Text style={styles.downloadNachText}>Download NACH Form</Text>
              </TouchableOpacity>
              <FileUpload
                placeholder="Upload Scanned Signed Form"
                showLabel={false}
              />
              <Text style={[styles.noteText, { marginTop: 30, flex: 1 }]}>
                <Text style={{ color: "#FF8500" }}>Note:-</Text>
                {"\n"} Manual Signature required in scanned NACH form
              </Text>
            </View>
          )}

          {mandateType === "UPI Mandate" && (
            <>
              <Text style={[styles.noteText, { fontStyle: "italic" }]}>
                <Icon name="infocirlceo" color="#FF8500" size={12} /> Sign using
                your UPI id
              </Text>
              <Text style={styles.label}>
                Your Virtual Payment Address (VPA)
              </Text>
              {renderInput(vpa, setVpa, "Enter your VPA", true, false, vpaError)}

              <ButtonComponent
                title="Sign UPI Mandate"
                onPress={() => { HandleCreateUPIMandate() }}
                style={{ button: styles.signButton }}
              />
              <Text style={styles.noteText}>
                <Text style={{ color: "#FF8500" }}>Note:-</Text>
                {"\n"} For UPI please make sure that your EMI should not be
                greater than ₹15000
              </Text>
            </>
          )}

          {mandateType === "eMandate" && (
            <>
              <Text style={[styles.noteText, { fontStyle: "italic" }]}>
                <Icon name="infocirlceo" color="#FF8500" size={12} /> Sign
                digitally using debit card or net banking
              </Text>
              <ButtonComponent
                title="Sign eMandate"
                onPress={() => { HandleCreateMandate() }}
                style={{ button: styles.signButton }}
              />
            </>
          )}
        </View>

        {
          mandateState != null && (
            <DigioStatusScreen
              mandateState={mandateState}
              onTryAgain={() => {
                setMandateState(null)
              }}
            />
          )
        }
      </ScrollView>
      <View style={msmeStyle.buttonContainer}>
        <TouchableOpacity
          style={msmeStyle.cancelButton}
          onPress={() => GoBack(navigation)}
        >
          <Text style={[msmeStyle.cancelButtonText]}>Back</Text>
        </TouchableOpacity>


        <View style={msmeStyle.proceedButtonContainer}>
          <ButtonComponent
            title="PROCEED"
            onPress={handleProceed}
            style={{
              button: msmeStyle.proceedButton,
            }}
            disabledStyle={{
              button: msmeStyle.disabledProceedButton,
            }}
            containerStyle={msmeStyle.proceedButtonContainer}
          />
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
  );
};

const styles = applyFontFamily({
  header: {
    padding: 16,
    backgroundColor: "#ffffff",
  },
  titleText: {
    fontSize: 24,
    fontWeight: "500",
    color: "#00194c",
    lineHeight: 26,
  },
  subText: {
    fontSize: 16,
    color: "#00194c",
    lineHeight: 26,
    fontWeight: "500",
  },
  container: {
    paddingHorizontal: 15,
    backgroundColor: "#ffffff",
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  label: {
    fontSize: 15,
    fontWeight: "500",
    color: "#00194C",
    marginBottom: 8,
  },
  mandateOptionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  mandateOption: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: "transparent",
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#E5ECFC",
    marginHorizontal: 4,
  },
  selectedMandateOption: {
    backgroundColor: "#00194C",
  },
  mandateOptionText: {
    color: "#00194C",
    fontWeight: "500",
    fontSize: 12,
  },
  selectedMandateOptionText: {
    color: "#ffffff",
  },
  noteText: {
    fontSize: 12,
    color: "#6E7EAA",
    marginTop: 8,
    marginBottom: 16,
    fontStyle: "italic",
  },
  signButton: {
    backgroundColor: "#002777",
    padding: 16,
    borderRadius: 4,
    alignItems: "center",
    textTransform: "none",
  },
  mandateIcon: {
    width: 100,
    marginBottom: 8,
    objectFit: "contain",
  },
  downloadNach: {
    justifyContent: "center",
    flexDirection: "row",
    fontWeight: "500",
    marginBottom: 16,
  },
  downloadNachText: {
    color: "#758BFD",
    fontSize: 16,
  },
  selectedMandateIcon: {
    backgroundColor: "#ffffff",
    borderRadius: 5,
    paddingHorizontal: 10,
  },
});

export default MandateScreen;
