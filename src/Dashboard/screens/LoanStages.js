import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions,Linking, ImageBackground } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Layout from '../components/Layout';
import { styles } from '../../assets/style/globalStyle';

const { width } = Dimensions.get('window');

const stages = [
  { id: '1', title: 'Application Inprogress', description: 'Application Processed', date: '13th Dec 2023', status: 'completed' },
  { id: '2', title: 'Application Submitted', description: 'Application Submitted Successfully', date: '13th Dec 2023', status: 'completed' },
  { id: '3', title: 'Credit Underwriting', description: 'Credit Underwriting Done', date: '20th Dec 2023', status: 'completed' },
  { id: '4', title: 'Document Verification', description: 'Document Verification Successfully', date: '14th Dec 2023', status: 'completed' },
  { id: '5', title: 'Sanctioned', description: 'The Loan has been Sanctioned', date: '20th Dec 2023', status: 'completed' },
  { id: '6', title: 'E-Mandate', description: 'E-Mandate registration pending', date: '20th Dec 2023', status: 'inprocess' },
  { id: '7', title: 'Loan Agreement eSign', description: 'eSign loan agreement pending', date: '20th Dec 2023', status: 'pending' },
  { id: '8', title: 'Disbursement Initiated', description: 'Disbursement Initiate pending', date: '20th Dec 2023', status: 'pending' },
  { id: '9', title: 'Disbursement Completed', description: 'Disbursement Completion pending', date: '20th Dec 2023', status: 'pending' },
];

const LoanStagesScreen = ({ navigation }) => {
  const stageStatusStyles = {
    'completed': { backgroundColor: '#32CD32' },
    'inprocess': { backgroundColor: '#FF8800' },
    'pending': { backgroundColor: '#00187A29' },
  };

  return (
    <Layout>
      <View style={[styles.flexContainer, styles.container]}>
      <View>
          <View style={styles.content}>
            <Text style={styles.congratulations}>Congratulations</Text>
            <Text style={styles.BriefsubText}>
              Application Submitted & Pending Verification
            </Text>
            <ImageBackground
              source={require("../../assets/images/roi.png")}
              style={styles.loanStagebackground}
              resizeMode="cover">
              <View style={styles.LoanStageloanInfo}>
                <Text style={styles.LoanStageloanAmount}>Loan Amount</Text>
                <Text style={styles.LoanStageamount}>₹ 10,00,000</Text>
                <Text style={styles.roi}>ROI - 14%</Text>
              </View>
            </ImageBackground>
            <Text style={styles.progressTitle}>Application Progress</Text>
            <View style={styles.progressContainer}>
              <ScrollView>
                {stages.map((stage, index) => (
                  <View key={stage.id} style={styles.stageItem}>
                    <View style={styles.stageIconContainer}>
                      <FontAwesome
                        name="check-circle"
                        size={24}
                        color={stageStatusStyles[stage.status].backgroundColor}
                        style={styles.stageIcon}
                      />
                      {index < stages.length - 1 && (
                        <View style={styles.LoanStageverticalLine} />
                      )}
                    </View>
                    <View style={styles.stageDetails}>
                      <Text style={styles.stageTitle}>{stage.title}</Text>
                      <Text style={styles.stageDescription}>
                        {stage.description}
                      </Text>
                    </View>
                    <Text style={styles.stageDate}>{stage.date}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
          </View>
        <View style={styles.ContinuebuttonWrapper}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() =>
              Linking.openURL("https://demo-loan-journey.knightfintech.com/")
            }>
            <Text style={styles.continueButtonText}>CONTINUE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Layout>
  );
};

export default LoanStagesScreen;
