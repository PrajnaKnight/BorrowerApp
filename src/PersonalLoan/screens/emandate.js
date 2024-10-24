import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  Linking,
  Alert
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
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';

import UPIIcon from "../../assets/images/upiLogo.png";
import EMandateIcon from "../../assets/images/eNachLogo.png";
import NACHIcon from "../../assets/images/nachLogo.png";
import { LineChart } from "lucide-react";
import useJumpTo from "../components/StageComponent";
import SaveLeadStage from "../services/API/SaveLeadStage";
import { GetHeader, STATUS } from "../services/API/Constants";
import { updateJumpTo } from "../services/Utils/Redux/LeadStageSlices";
import { SendGeoLocation } from "../services/API/LocationApi";
import { useDispatch } from "react-redux";
import ScreenError, { useErrorEffect } from "./ScreenError";
import LoadingOverlay from "../components/FullScreenLoader";
import { CreateMandateModel, CreatePhysicalFormMandate, CreatePhysicalMandate, CreateUPIMandate, CreateUpiMandateModel, DownloadPhysicalMandateForm, GetMandateInfo, UploadPhysicalMandateForm } from "../services/API/Mandate";
import { GetApplicantId, GetLeadId } from "../services/LOCAL/AsyncStroage";
import { Digio, DigioConfig, Environment, GatewayEvent } from '@digiotech/react-native';
import DigioScreen, { DigioStatusScreen } from "../../Common/screens/digioScreen";
import { DownloadMyFile } from "../services/Utils/FieldVerifier";
import { checkImagePermission } from "./PermissionScreen";
import { useFocusEffect } from "@react-navigation/native";

const MandateScreen = ({ navigation }) => {

  const stageMaintance = useJumpTo("eMandate", "loanAgreement", navigation);


  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(true)
  const [digiData, setDigiData] = useState({ mandateId: null, phoneNumber: null, token: null })
  const [digioWebHook, startDigioWebHook] = useState(false)
  const { mandateState, setMandateState } = DigioScreen({ startWebHook: digioWebHook, payload: digiData, setStartDigioWebHook: startDigioWebHook })
  const [fileContent, setFileContent] = useState(null)
  const [mandateId, setMandateId] = useState(null)
  

  const dispatch = useDispatch();



  const onTryAgainClick = () => {
    setRefresh(true)
    setMandateState(null)
  };
  const { errorScreen, setNewErrorScreen } = useErrorEffect(onTryAgainClick);



  const [mandateType, setMandateType] = useState("eMandate");



  const [createMandateModel, setCreateMandateModel] = useState({})
  const [mandateInfo, setMandateInfo] = useState({})
  const [leadId, setLeadId] = useState(null)





  const handleProceed = async () => {

    if(mandateState == null || mandateState.status != STATUS.SUCCESS){
      setNewErrorScreen("Please complete your mandate")
      return
    }

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


  useFocusEffect(
    useCallback(() => {


    if (!refresh) {
      return
    }


    setNewErrorScreen(null);
    setFileContent(null)
    setMandateId(null)
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
            AccountType: item.AccountType
          }
        ))

      }

      setCreateMandateModel(CreateMandateModel(data, leadId))
      setMandateInfo(data)
    })
    setRefresh(false)

  }, [refresh]))



  const openFile = async (path) => {
    const filePath = path;

    try {
      // Check if the file exists
      const header = await GetHeader()
      await DownloadMyFile(header, path, "NACH_FORM.pdf")
    } catch (error) {
      console.error('Error checking file existence:', error);
    }
  };


  const openUrl = async (mandateId, token, phoneNumber) => {


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
    let currentDataSet = {
      ...createMandateModel,
    }
    if (!createMandateModel?.MandateDetails?.CustomerAccountNumber) {
      currentDataSet.MandateDetails = {
        ...createMandateModel.MandateDetails,
        CustomerAccountNumberError: "Please select the bank account",
      }
      setCreateMandateModel(currentDataSet)
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
      openUrl(response?.data?.MandateId, response?.data?.TokenValue, mandateInfo?.mandate_data?.customer_mobile)
    }

    console.log(response.data)

  }


  const HandleCreateUPIMandate = async () => {
    setNewErrorScreen(null)

    let currentDataSet = {
      ...createMandateModel,

    }

    if (!createMandateModel?.MandateDetails?.CustomerAccountNumber) {
      currentDataSet.MandateDetails = {
        ...createMandateModel.MandateDetails,
        CustomerAccountNumberError: "Please select the bank account",
      }
      setCreateMandateModel(currentDataSet)
      return
    }

    if (!createMandateModel?.MandateDetails?.CustomerVpa) {
      currentDataSet.MandateDetails = {
        ...createMandateModel.MandateDetails,
        CustomerVpaError: "Please provide UPI ID",
      }
      setCreateMandateModel(currentDataSet)
      return
    }

    else if (!createMandateModel?.MandateDetails?.CustomerVpa.includes("@")) {
      currentDataSet.MandateDetails = {
        ...createMandateModel.MandateDetails,
        CustomerVpaError: "Please provide valid UPI ID"
      }
      setCreateMandateModel(currentDataSet)
      return
    }


    setLoading(true)



    let mandateRole = CreateUpiMandateModel(createMandateModel, leadId, createMandateModel?.MandateDetails?.CustomerVpa)

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
      openUrl(response?.data?.MandateId, response?.data?.AccessToken?.Id, mandateInfo?.mandate_data?.customer_mobile)
    }

    console.log(response.data)

  }

  const DownloadNACHForm = async () => {
    setNewErrorScreen(null)


    if(await checkImagePermission() == false){
      navigation.navigate("PermissionsScreen", {permissionStatus : "denied", permissionType : 'files'})
      return
    }

    let currentDataSet = {
      ...createMandateModel,

    }

    if (!createMandateModel?.MandateDetails?.CustomerAccountNumber) {
      currentDataSet.MandateDetails = {
        ...createMandateModel.MandateDetails,
        CustomerAccountNumberError: "Please select the bank account",
      }
      setCreateMandateModel(currentDataSet)
      return
    }
    setLoading(true)


    const payload = CreatePhysicalFormMandate(createMandateModel, leadId)
    console.log("physical mandate")

    console.log(payload)
    const createPhysicalMandateResponse = await CreatePhysicalMandate(payload)
    if (createPhysicalMandateResponse.status === STATUS.ERROR) {
      setNewErrorScreen(createPhysicalMandateResponse.message)
      setLoading(false)
      return
    }


    const reqquestModel = {
      LeadId: leadId,
      MandateId: createPhysicalMandateResponse?.data?.MandateId
    }

    setMandateId(createPhysicalMandateResponse?.data?.MandateId)
    const downloadPhysicalMandateFormResponse = await DownloadPhysicalMandateForm(reqquestModel)
    if (downloadPhysicalMandateFormResponse.status === STATUS.ERROR) {
      setNewErrorScreen(downloadPhysicalMandateFormResponse.message)
      setLoading(false)
      return
    }

    if(downloadPhysicalMandateFormResponse.data?.FileUrl){
      openFile(downloadPhysicalMandateFormResponse.data.FileUrl)
    }

    setLoading(false)

  }

  const UpdateDataset = (type, value) => {

    let mandateRole = {
      ...createMandateModel,

    }



    switch (type) {
      case "AccountNumber":

        const selectedBank = mandateInfo?.bankDetails?.find(
          (account) => account.value === value
        );
        mandateRole.MandateDetails = {
          ...createMandateModel.MandateDetails,
          DestinationBankId: selectedBank.destination_bank_id,
          DestinationBankName: selectedBank.bankName,
          CustomerAccountNumber: selectedBank.value,
          AccountType: selectedBank.AccountType,

          DestinationBankIdError: null,
          CustomerAccountNumberError: null,

        }
        break;
      case "IFSC":

        mandateRole.MandateDetails = {
          ...createMandateModel.MandateDetails,
          DestinationBankId: value,
          DestinationBankIdError: null

        }
        break;
      case "UPI":
        mandateRole.MandateDetails = {
          ...createMandateModel.MandateDetails,
          CustomerVpa: value,
          CustomerVpaError: null
        }
        break;
    }


    setCreateMandateModel(mandateRole)

  }


  const UploadScannedPhysicalMandate = (file) =>{
    
    if(!file){
      return
    }
    setNewErrorScreen(null)

    
    setLoading(true)

    UploadPhysicalMandateForm(mandateId, { uri: file.uri, name: file.name, type: file.type }).then((response)=>{
      setLoading(false)
      if(response.status == STATUS.ERROR){
        setNewErrorScreen(response.message)
        return
      }

      console.log(JSON.stringify(response))
      openUrl(mandateId, null, mandateInfo?.mandate_data?.customer_mobile)

    })
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
            value={createMandateModel?.MandateDetails?.CustomerAccountNumber}
            setValue={(val) => {
              UpdateDataset("AccountNumber", val);
            }}
            items={mandateInfo?.bankDetails || []}
            placeholder="Select Bank Account"
            label="Bank Account Number"
            error={createMandateModel?.MandateDetails?.CustomerAccountNumberError}
            zIndex={1000}
            selectedItemColor="#ffffff"
            arrowIconColor="#ff8500"
            selectedItemBackgroundColor="#758BFD"
          />

          <Text style={styles.label}>Bank Branch IFSC Code</Text>
          {renderInput(createMandateModel?.MandateDetails?.DestinationBankId, ((value) => { UpdateDataset("IFSC", value,) }), "Enter IFSC Code", false, true,
            createMandateModel?.MandateDetails?.DestinationBankIdError
          )}

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
                file={fileContent}
                isDisable={!mandateId}
                setFile={(e)=>{
                  if(mandateId){
                    setFileContent(e)
                    UploadScannedPhysicalMandate(e)
                  }
                  
                }}
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
              {renderInput(createMandateModel?.MandateDetails?.CustomerVpa, ((value) => { UpdateDataset("UPI", value) }), "Enter your VPA", true, false, createMandateModel?.MandateDetails.CustomerVpaError)}

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
