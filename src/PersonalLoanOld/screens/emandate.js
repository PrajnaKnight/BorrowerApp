import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StatusBar, KeyboardAvoidingView, Platform, useWindowDimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { styles } from '../../assets/style/personalStyle';
import Icon from 'react-native-vector-icons/FontAwesome';
import ProgressBar from '../../Common/components/ControlPanel/progressBar';
import { useProgressBar } from '../../Common/components/ControlPanel/progressContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppContext } from '../../Common/components/useContext';
import CustomInput from '../../Common/components/ControlPanel/input';
import { GoBack } from '../services/Utils/ViewValidator';
import ScreenError, { useErrorEffect } from './ScreenError';
import LoadingOverlay from '../components/FullScreenLoader';
import SaveLeadStage from '../services/API/SaveLeadStage';
import { SendGeoLocation } from '../services/API/LocationApi';
import { STATUS } from '../services/API/Constants';
import { useDispatch, useSelector } from 'react-redux';
import { ALL_SCREEN } from '../services/Utils/Constants';
import { updateJumpTo } from '../services/Utils/Redux/LeadStageSlices';


const EMandateScreen = ({ navigation }) => {
  const [selectedAccount, setSelectedAccount] = useState();
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

  useEffect(() => {
    setProgress(0.6);
  }, []);

  const { fontSize } = useAppContext();
  const dynamicFontSize = (size) => size + fontSize;

  const { width, height } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  
  // Definitions for "mobile", "tablet", and "desktop" based on width
  const isMobile = width < 768; 
  const isTablet = width >= 768 && width < 1024; // Tablet range, including iPad portrait
  const isDesktop = width >= 1024; // Desktop and iPad landscape


  const containerStyle = isDesktop ? styles.desktopContainer : isMobile ? styles.mobileContainer : styles.tabletContainer;
  const imageContainerStyle = isDesktop ? { width: '50%' } : { width: '100%' };

  const HandleProcced = async() =>{
    setLoading(true)
    setNewErrorScreen(null)

    
    let Leadstage = nextJumpTo
    if (ALL_SCREEN[nextJumpTo] == "eMandate") {
      Leadstage = nextJumpTo + 1

      const saveLeadStageResponse = await SaveLeadStage(Leadstage)
      if(saveLeadStageResponse.status == STATUS.ERROR){
        setLoading(false)
        setNewErrorScreen(saveLeadStageResponse.message)
        return
      }

      dispatch(updateJumpTo(Leadstage))
    }


    console.log("========== fetching location =================");
    await SendGeoLocation(10);
    console.log("========== fetching location =================");
    setLoading(false);
    navigation.navigate('loanAgreement')
  }

  return (

    <View style={styles.mainContainer}>
    <View style={{ flex: 1, flexDirection: isWeb ? 'row' : 'column' }}>
    {isWeb && (isDesktop || (isTablet && width > height)) && (
          <View style={[styles.leftContainer, imageContainerStyle]}>
            <View style={styles.mincontainer}>
              <View style={styles.webheader}>
                <Text style={styles.WebheaderText}>Personal Loan</Text>
                <Text style={styles.websubtitleText}>Move Into Your Dreams!</Text>
              </View>
              <LinearGradient
                // button Linear Gradient
                colors={['#000565', '#111791', '#000565']}
                style={styles.webinterestButton}
              >
                <TouchableOpacity >
                  <Text style={styles.webinterestText}>Interest starting from 8.4%*</Text>
                </TouchableOpacity>

              </LinearGradient>

              <View style={styles.webfeaturesContainer}>
                <View style={styles.webfeature}>
                  <Text style={[styles.webfeatureIcon, { fontSize: 30, marginBottom: 5, }]}>%</Text>
                  <Text style={styles.webfeatureText}>Nil processing fee*</Text>
                </View>
                <View style={styles.webfeature}>
                  <Text style={[styles.webfeatureIcon, { fontSize: 30, marginBottom: 5 }]}>3</Text>
                  <Text style={styles.webfeatureText}>3-Step Instant approval in 30 minutes</Text>
                </View>
                <View style={styles.webfeature}>
                  <Text style={[styles.webfeatureIcon, { fontSize: 30, marginBottom: 5 }]}>⏳</Text>
                  <Text style={styles.webfeatureText}>Longer Tenure</Text>
                </View>
              </View>

              <View style={styles.webdescription}>
                <Text style={styles.webdescriptionText}>
                  There's more! Complete the entire process in just 3-steps that isn't any more than 30 minutes.
                </Text>
                <TouchableOpacity>
                  <Text style={styles.weblinkText}>To know more about product features & benefits, please click here</Text>
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
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <LoadingOverlay visible={loading} />

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} >
        <View style={styles.container}>
          <View>

            <ProgressBar progress={0.6} />
            <Text style={[styles.headerText, { fontSize: dynamicFontSize(styles.headerText.fontSize) }]}>eMandate</Text>
            <Text style={[styles.label, { fontSize: dynamicFontSize(styles.label.fontSize) }]}>Bank Account Number <Text style={styles.mandatoryStar}>*</Text></Text>

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedAccount}
                onValueChange={(itemValue) => setSelectedAccount(itemValue)}
                style={[styles.picker, { fontSize: dynamicFontSize(styles.picker.fontSize) }]}
              >
                {bankAccounts.map(account => (
                  <Picker.Item key={account.value} label={account.label} value={account.value} />
                ))}
              </Picker>
            </View>

            <Text style={[styles.label, { fontSize: dynamicFontSize(styles.label.fontSize) }]}>Bank Branch IFSC Code <Text style={styles.mandatoryStar}>*</Text></Text>
            <CustomInput
              value={ifscCode}
              onChangeText={(text) => setIfscCode('ifsCode', text)}
              placeholder="Enter bank your branch IFSC code"
            />
            {/* Buttons */}
            <View
            >
              <LinearGradient
                // button Linear Gradient
                colors={['#002777', '#00194C']}
                style={[styles.button, styles.signMandate]}
              >
                <TouchableOpacity >
                  <Text style={[styles.signbuttonText, { fontSize: dynamicFontSize(styles.buttonText.fontSize) }]}>Sign eMandate</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>

            <View style={styles.orWrapper}>
              <Text style={[styles.or, { fontSize: dynamicFontSize(styles.or.fontSize) }]}>OR</Text>
            </View>
            <TouchableOpacity style={styles.uploadButtonNach}>
              <Text style={[styles.uploadButtonNachText, { fontSize: dynamicFontSize(styles.uploadButtonNachText.fontSize) }]}>Upload Physical NACH</Text>
              <Icon name="upload" size={16} color="#FF8600" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.downloadSamplebutton}>
              <Text style={[styles.downloadSamplebuttonText, { fontSize: dynamicFontSize(styles.downloadSamplebuttonText.fontSize) }]}>Download NACH Form</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.backButton} onPress={() =>  GoBack(navigation)}>
              <Text style={[styles.backBtnText, { fontSize: dynamicFontSize(styles.backBtnText.fontSize) }]}>BACK</Text>
            </TouchableOpacity>
            <LinearGradient
              // button Linear Gradient
              colors={['#002777', '#00194C']}
              style={styles.verifyButton}
            >
              <TouchableOpacity onPress={()=>HandleProcced()} >
                <Text style={[styles.buttonText, { fontSize: dynamicFontSize(styles.buttonText.fontSize) }]}>PROCEED</Text>
              </TouchableOpacity>
            </LinearGradient>
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
