import React, {useState, useEffect} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { styles } from "../../assets/style/msmeStyle";
import { useAppContext } from "../../Common/components/useContext";
import UploadController from '../../Common/components/ControlPanel/UploadController';
import ButtonComponent from '../../Common/components/ControlPanel/button';
import Layout from "../../Common/components/Layout";
import { useProgressBar } from '../../Common/components/ControlPanel/progressContext';  
import ProgressBar from '../../Common/components/ControlPanel/progressBar';
import {GoBack} from '../../PersonalLoan/services/Utils/ViewValidator';

const BusinessInformation = ({ navigation }) => {
  const context = useAppContext();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const fontSize = context?.fontSize ?? 0; // Provide a default value if fontSize is undefined
  const dynamicFontSize = (size) => size + fontSize;
  const { setProgress } = useProgressBar(); 

  useEffect(() => {
    setProgress(0.3);
  }, []);

  const renderHeader = () => (
    <View style={{padding:16, backgroundColor: '#F8FAFF'}}>
      <ProgressBar progress={0.3} />
      <Text style={[styles.TitleText,  { fontSize: dynamicFontSize(24) }]}>
        Business Information
      </Text>
    </View>
  );

  const renderBusinessInformation = () => (
    <View style={styles.businessInfoContainer}>
        <UploadController
          title="Proprietor PAN"
          inputPlaceholder="Enter PAN Number"
          required={true}
        />
        <UploadController
          title="UDYAM Aadhaar"
          inputPlaceholder="Enter UDYAM Aadhaar Number"
          required={true}
        />
    </View>
  );



  const handleProceed = () => {
    // Handle proceed action
    navigation.navigate("BusinessSummary");
    console.log("Proceeding to next step");
  };

  return (
    <Layout>
      <View>{renderHeader()}</View>
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          {renderBusinessInformation()}
        </ScrollView>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton}  onPress={() => GoBack(navigation)}>
          <Text
            style={[
              styles.cancelButtonText,
              { fontSize: dynamicFontSize(14) },
            ]}>
            Back
          </Text>
        </TouchableOpacity>
        <View style={styles.proceedButtonContainer}>
          <ButtonComponent
            title="PROCEED"
            onPress={handleProceed}
            disabled={isButtonDisabled}
            style={{
              button: styles.proceedButton,
            }}
            disabledStyle={{
              button: styles.disabledProceedButton,
            }}
            textStyle={{
              buttonText: { fontSize: dynamicFontSize(14) },
            }}
            containerStyle={styles.proceedButtonContainer}
          />
        </View>
      </View>
    </Layout>
  );
};

export default BusinessInformation;