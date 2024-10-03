import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
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
import { LinearGradient } from 'expo-linear-gradient';

const BusinessSummary = ({ navigation }) => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'gst', title: 'GST Details' },
    { key: 'udyam', title: 'UDYAM Details' },
  ]);
  const [openAccordionIndex, setOpenAccordionIndex] = useState(null);
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const { width } = Dimensions.get('window');

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
        
    'Legal Name': "Leena Bakes",
    'Trade Name': "Leena Bakes",
    'Date of Registration': "15 June 2019",
    'Constitution Of Business ': "Sole Prop",
    'Nature of Business': "Supplier of Service",
    'Business Address': "Mumbai, Maharashtra",
    'GSTIN Status': "Active",
    'Latest Return File': "GSTR 3B-May 2024\nGSTR 1-June 2024"
  };

  const udyamDetails = {
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

  const industryDetails = [
    { NIC: "10", Description: "Manufacture of Food Products" },
    { NIC: "46", Description: "Wholesale trade, except of motor vehicles and motorcycles" },
    { NIC: "47", Description: "Retail trade, except of motor vehicles and motorcycles" }
  ];

  const subSectorDetails = [
    { NIC: "1071", Description: "Manufacture of Bakery Products" },
    { NIC: "4630", Description: "Wholesale of food, beverages and tobacco" },
    { NIC: "4721", Description: "Retail sale of food in specialized stores" }
  ];

  const subClassDetails = [
    { NIC: "10711", Description: "Manufacture of Bread" },
    { NIC: "46308", Description: "Wholesale of confectionery, bakery products" }
  ];

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

   // New component for no data available message
   const NoDataAvailable = ({ message }) => (
    <View style={styles.noDataContainer}>
      <Icon name="file-document-outline" size={100} color="#D8DFF2" />
      <Text style={styles.noDataText}>{message}</Text>
    </View>
  );
  const renderDetailsItem = (
    key,
    value,
    index,
    totalItems,
    isUdyam = false
  ) => (
    <View 
      key={`${key}-${index}`} 
      style={[
        styles.detailItem,
        index % 2 === 0 ? styles.evenItem : null,
        index === 0 && styles.firstDetailItem,
        index === totalItems - 1 && styles.lastDetailItem,
      ]}
    >
      {index % 2 !== 0 ? (
        <LinearGradient
          colors={['#D2DEF7', '#EFF4FF']}
          style={[styles.oddItem, StyleSheet.absoluteFillObject]}
        />
      ) : null}
      <Text style={styles.detailLabel}>{key}</Text>
      {key === "Status" && value === "Active" ? (
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
          onPress={() => setOpenAccordionIndex(isOpen ? null : index)}
          style={[
            styles.accordionHeader,
            {
              backgroundColor: isOpen ? "#ffffff" : "#DCE5FF",
              marginHorizontal: isOpen ? 10 : 0,
            },
          ]}>
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
            color={isOpen ? "#ff8500" : "#A2ACC6"}
            style={[
              styles.accodionRightIcon,
              { backgroundColor: isOpen ? "#ffffff" : "#DCE5FF" },
            ]}
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
            <View style={styles.gstinDetailsContainer}>
              {Object.entries(gstDetailsFull).map(
                ([key, value], index, array) =>
                  renderDetailsItem(key, value, index, array.length)
              )}
            </View>
          </View>
        </Collapsible>
      </View>
    );
  };

  const GSTScene = () => (
    <ScrollView style={styles.sceneContainer}>
      {gstDetails.length > 0 ? (
        gstDetails.map((detail, index) => renderGSTAccordion(detail, detail.isPrimary, index))
      ) : (
        <NoDataAvailable message="No GST Available" />
      )}
    </ScrollView>
  );

  
  const renderTable = (data, title) => (
    <View style={styles.tableContainer}>
      <Text style={styles.tableTitle}>{title}</Text>
      <View style={styles.tableWrapper}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, styles.nicColumn]}>NIC</Text>
          <Text style={[styles.tableHeaderText, styles.descriptionColumn]}>Description</Text>
        </View>
        {data.map((item, index) => (
          <View key={index} style={[styles.tableRow, index % 2 === 0 ? styles.evenRow : styles.oddRowTable]}>
            {index % 2 !== 0 && ( 
              <LinearGradient
                colors={['#D2DEF7', '#EFF4FF']}
                style={[StyleSheet.absoluteFillObject]}
              />
            )}
            <Text style={[styles.tableCell, styles.nicColumn]}>{item.NIC}</Text>
            <Text style={[styles.tableCell, styles.descriptionColumn]}>{item.Description}</Text>
          </View>
        ))}
      </View>
    </View>
  );


  


  const UDYAMScene = () => (
    <ScrollView style={styles.sceneContainer}>
      {Object.keys(udyamDetails).length > 0 ? (
        <View style={styles.udyamContainer}>
          <Text style={styles.udyamText}>UDYAM-MH26-938173</Text>
          <View style={styles.udyamDetailsContainer}>
            <View style={{borderWidth:1, borderColor:'#B3B9E1', borderRadius:5}}>
              {Object.entries(udyamDetails).map(([key, value], index, array) =>
                renderDetailsItem(key, value, index, array.length, true)
              )}
            </View>
          </View>
          {renderTable(industryDetails, 'Industry')}
          {renderTable(subSectorDetails, 'Sub Sector')}
          {renderTable(subClassDetails, 'Sub Class')}
        </View>
      ) : (
        <NoDataAvailable message="No UDYAM Available" />
      )}
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
      <View style={{ padding: 16, backgroundColor: "#ffffff" }}>
        <ProgressBar progress={0.4} />
        <View style={styles.TOpTitleContainer}>
          <Text style={[styles.TitleText]}>Business Information</Text>
          <Text style={styles.pageIndex}>
            <Text style={styles.IndexActive}>2</Text>/4
          </Text>
        </View>
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
        {gstDetails.length > 0 && Object.keys(udyamDetails).length > 0  ? (
          
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
              , confirm that the above information is correct and will be used
              to assess my loan application and that I am responsible for the
              accuracy and completeness of all details provided.
            </Text>
          </View>
        ) : <></>}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => GoBack(navigation)}>
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