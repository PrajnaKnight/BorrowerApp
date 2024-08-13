import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import CheckBox from '@react-native-community/checkbox';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Collapsible from 'react-native-collapsible';
import Layout from '../../Common/components/Layout';
import {styles} from '../../assets/style/msmeStyle';
import ButtonComponent from '../../Common/components/ControlPanel/button';
import { useProgressBar } from '../../Common/components/ControlPanel/progressContext';
import ProgressBar from '../../Common/components/ControlPanel/progressBar';
import {GoBack} from '../../PersonalLoan/services/Utils/ViewValidator';

const BusinessSummary = ({ navigation }) => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'gst', title: 'GST Details' },
    { key: 'udyam', title: 'UDYAM Details' },
  ]);
  const [openAccordionIndex, setOpenAccordionIndex] = useState(null);
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const { setProgress } = useProgressBar();
  useEffect(() => {
    setProgress(0.4);
  }, []);

  useEffect(() => {
    setIsButtonDisabled(!agreementChecked);
  }, [agreementChecked]);

  const gstDetails = [
    { gstin: "27AAHCK6791L1ZS", isPrimary: true },
    { gstin: "27AAHCK6791L1ZS", isPrimary: false }
  ];

  const gstDetailsFull = {
        
    'GSTIN Number': "27AAHCK6791L1ZS",
    'Financial Year': "2023-2024",
    'Status': "Active",
    'Legal Name': "Rohit Creations",
    'Constitution': "Sole Prop",
    'Date of Registration': "15 June 2019",
    'Tax Payer Type': "Regular",
    'Nature of Business': "Supplier of Service",
    'Location': "Mumbai, Maharashtra",
    'Latest Return File': "GSTR 3B-May 2024\nGSTR 1-June 2024"
  };

  const udyamDetails = {
    'Registration No': "UDYAM-MH26-938173",
    'Name of Enterprise': "Leena Bakes",
    'Enterprise Type': "Micro",
    'Registration Date': "25/12/2014",
    'Status': "Active",
    'Major Activity': "Services",
    'Constitution': "Sole Prop",
    'Classification Year': "2022-2023",
    'Classification Date': "07/12/2022",
    'Incorporation Date': "25/12/2014",
    'Commencement Date': "25/12/2014",
    'Official Address': "Mumbai, Maharashtra"
  };

  const getValueStyle = (key, value) => {
    if (key === 'Status' && value === 'Active') {
      return [styles.detailValue, styles.activeStatus];
    }
    if (key === 'Latest Return File') {
      return [styles.detailValue, styles.multilineValue];
    }
    if (key === 'GSTIN Number') {
      return [styles.detailValue, styles.gstinValue];
    }
    return styles.detailValue;
  };

  // Custom rounded checkbox component
  const RoundedCheckbox = ({ value, onValueChange }) => (
    <TouchableOpacity onPress={() => onValueChange(!value)} style={styles.checkboxContainer}>
      {value && <View style={styles.checkboxInner}> 
        <Icon name="check" size={12} color="#fff" />
      </View>}
    </TouchableOpacity>
  )

  const renderDetailsItem = (key, value, index, totalItems,isUdyam = false) => (
    <View key={`${key}-${index}`} style={[
      styles.detailItem,
      (key === 'Financial Year' || (isUdyam && key === 'Registration Date')) && styles.borderBottom
    ]}>
      <Text style={styles.detailLabel}>{key}</Text>
      {key === 'Status' && value === 'Active' ? (
        <View style={styles.activeStatusContainer}>
          <View style={styles.activeBullet} />
          <Text style={getValueStyle(key, value)}>{value}</Text>
        </View>
      ) : (
        <Text style={getValueStyle(key, value)}>{value}</Text>
      )}
    </View>
  );



  const renderGSTAccordion = (details, isPrimary, index) => {
    const isOpen = openAccordionIndex === index;
    return (
      <View key={`gst-${index}`} style={styles.accordionContainer}>
        <TouchableOpacity
          style={styles.accordionHeader}
          onPress={() => setOpenAccordionIndex(isOpen ? null : index)}>
          <View style={styles.gstinContainer}>
            <Icon name="file-document-outline" size={24} color="#ff8500" />
            <Text style={styles.gstinText}>{details.gstin}</Text>
          </View>
          {!isOpen && isPrimary && (
            <View style={styles.setPrimaryHeader}>
              <RoundedCheckbox value={isPrimary} onValueChange={() => {}} />
              <Text style={styles.primaryText}>Primary</Text>
            </View>
          )}
        
          <Icon
            name={isOpen ? "chevron-up" : "chevron-down"}
            size={24}
            color="#ff8500"
            style={styles.accodionRightIcon}
          />
        </TouchableOpacity>
        <Collapsible collapsed={!isOpen}>
          <View style={styles.accordionContent}>
            <View style={styles.setPrimaryContainer}>
              <Text style={styles.setPrimaryText}>Set as Primary</Text>
              <RoundedCheckbox
                value={isPrimary}
                onValueChange={(newValue) => {
                  /* Handle primary change */
                }}
              />
            </View>
            {Object.entries(gstDetailsFull).map(([key, value], index, array) =>
              renderDetailsItem(key, value, index, array.length)
            )}
          </View>
        </Collapsible>
      </View>
    );
  };

  const GSTScene = () => (
    <ScrollView style={styles.sceneContainer}>
      {gstDetails.map((detail, index) => renderGSTAccordion(detail, detail.isPrimary, index))}
    </ScrollView>
  );

  const UDYAMScene = () => (
    <ScrollView style={styles.sceneContainer}>
      <View style={styles.udyamContainer}>
        <Text style={styles.udyamText}>
          UDYAM Details
        </Text>
        <View style={styles.udyamDetailsContainer}>
          {Object.entries(udyamDetails).map(([key, value], index, array) =>
            renderDetailsItem(key, value, index, array.length, true)
          )}
        </View>
      </View>
    </ScrollView>
  );


  const renderScene = SceneMap({
    gst: GSTScene,
    udyam: UDYAMScene,
  });

  const handleProceed = () => {
    navigation.navigate("BusinessProfile");
    console.log('Proceed button clicked');
  };

  return (
    <Layout>
      <View style={{ padding: 16, backgroundColor: "#F8FAFF" }}>
        <ProgressBar progress={0.4} />
        <Text style={styles.TitleText}>Business Summary</Text>
      </View>
      <View style={styles.container}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          renderTabBar={(props) => (
            <TabBar
              {...props}
              indicatorStyle={styles.tabIndicator}
              style={styles.tabBar}
              labelStyle={styles.tabLabel}
              activeColor="#FF8500"
              inactiveColor="#00194C"
            />
          )}
        />
        <View style={styles.agreementContainer}>
          <CheckBox
            disabled={false}
            value={agreementChecked}
            onValueChange={(newValue) => setAgreementChecked(newValue)}
            tintColors={{ true: "#ff8500", false: "#00194c" }}
          />
          <Text style={styles.agreementText}>
            I, the{" "}
            <Text style={{ textDecorationLine: "underline" }}>
              undersigned borrower
            </Text>
            , confirm that the above information is correct and will be used to
            assess my loan application and that I am responsible for the
            accuracy and completeness of all details provided.
          </Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton}  onPress={() => GoBack(navigation)}>
          <Text style={[styles.cancelButtonText]}>Back</Text>
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
            containerStyle={styles.proceedButtonContainer}
          />
        </View>
      </View>
    </Layout>
  );
};



export default BusinessSummary;