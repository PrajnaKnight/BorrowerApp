import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Layout from '../../Common/components/Layout';
import ButtonComponent from '../../Common/components/ControlPanel/button';
import { useProgressBar } from '../../Common/components/ControlPanel/progressContext';
import { GoBack } from '../../PersonalLoan/services/Utils/ViewValidator';
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from '@react-navigation/native';
import { styles } from '../../assets/style/msmeStyle';
import UploadController from '../../Common/components/ControlPanel/UploadController';
import ProgressBar from '../../Common/components/ControlPanel/progressBar';

const { width: screenWidth } = Dimensions.get('window');
const cardWidth = (screenWidth - 40) / 3; // 3 cards with some margin

const PersonalDocumentsScreen = () => {
  const navigation = useNavigation();
  const [selectedApplicant, setSelectedApplicant] = useState('applicant');
  const [selectedDocType, setSelectedDocType] = useState('ID Proof');
  const [selectedIDType, setSelectedIDType] = useState('PAN Card');
  const { setProgress } = useProgressBar();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    setProgress(0.6);
  }, []);

  const applicants = [
    { id: 'applicant', name: 'Leela Lalwani' },
    { id: 'co-applicant', name: 'Co-applicant' }
  ];
  const documentTypes = ['ID Proof', 'Address Proof'];
  const idTypes = [
    { label: 'PAN Card', icon: 'id-card' },
    { label: 'Aadhaar Card', icon: 'id-badge' },
    { label: 'Passport', icon: 'credit-card' },
    { label: 'Voter ID', icon: 'address-card' },
    { label: 'Driving License', icon: 'car' },
  ];

  const handleProceed = () => {
    navigation.navigate("BusinessDocuments");
  };

  const handleIDTypeSelect = (index) => {
    setSelectedIDType(idTypes[index].label);
    setActiveIndex(index);
    scrollViewRef.current?.scrollTo({ x: index * cardWidth, animated: true });
  };

  return (
    <Layout>
      <View style={{ padding: 16, backgroundColor: "#ffffff", paddingBottom: 0 }}>
        <ProgressBar progress={0.6} />
        <View style={styles.TOpTitleContainer}>
          <Text style={[styles.TitleText]}>Personal Documents</Text>
        </View>
      </View>
      <ScrollView style={styles.container}>
        <View style={styles.applicantTabContainer}>
          {applicants.map((applicant) => (
            <TouchableOpacity
              key={applicant.id}
              style={[
                styles.applicantTab,
                selectedApplicant === applicant.id &&
                  styles.selectedApplicantTab,
              ]}
              onPress={() => setSelectedApplicant(applicant.id)}>
              <Text
                style={[
                  styles.applicantTabText,
                  selectedApplicant === applicant.id &&
                    styles.selectedApplicantTabText,
                ]}>
                {applicant.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.PDtabContainer}>
          {documentTypes.map((docType) => (
            <TouchableOpacity
              key={docType}
              style={[
                styles.PDtab,
                selectedDocType === docType && styles.PDselectedTab,
              ]}
              onPress={() => setSelectedDocType(docType)}>
              <Text
                style={[
                  styles.PDtabText,
                  selectedDocType === docType && styles.PDselectedTabText,
                ]}>
                {docType}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
          
        <Text style={styles.sectionTitle}>Select ID Type</Text>
        <View style={styles.carouselContainer}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            snapToInterval={cardWidth}
            snapToAlignment="start"
            contentContainerStyle={styles.carouselContent}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / cardWidth
              );
              setActiveIndex(index);
              setSelectedIDType(idTypes[index].label);
            }}>
            {idTypes.map((item, index) => (
              <TouchableOpacity
                key={item.label}
                style={[
                  styles.carouselItem,
                  activeIndex === index && styles.activeCarouselItem,
                ]}
                onPress={() => handleIDTypeSelect(index)}>
                <Icon
                  name={item.icon}
                  size={24}
                  color={activeIndex === index ? "#FFFFFF" : "#00194c"}
                />
                <Text
                  style={[
                    styles.carouselItemText,
                    activeIndex === index && styles.activeCarouselItemText,
                  ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.paginationContainer}>
            {idTypes.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  activeIndex === index && styles.activePaginationDot,
                ]}
              />
            ))}
          </View>
        </View>

        <Text style={styles.sectionTitle}>File Upload OR Take Photo</Text>
        <View style={styles.uploadContainer}>
          <UploadController
            title={selectedIDType}
            inputPlaceholder={`Enter ${selectedIDType} Number`}
            required={true}
            passwordProtected={true}
            inputEnabled={false}
          />
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => GoBack(navigation)}>
          <Text style={styles.cancelButtonText}>Back</Text>
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


export default PersonalDocumentsScreen;