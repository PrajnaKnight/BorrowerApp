import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { styles } from '../../assets/style/globalStyle';
import TabsComponent from '../components/TabsComponent';
import { useTab } from '../components/TabContext';
import Layout from '../components/Layout';

const Charges = ({ navigation, route }) => {
  const { activeTab, setActiveTab } = useTab();
  const { isOverdue } = route.params || {};

  return (
    <Layout>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <TabsComponent activeTab={activeTab} setActiveTab={setActiveTab} />
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>Re-payment Info</Text>
            <View style={[styles.overdueCard, isOverdue ? styles.redOverdueCard : styles.blueOverdueCard]}>
            <ImageBackground source={require("../../assets/images/repaymentInfo-bg.png")}  style={{backgroundSize:'cover'}}>

              <View style={styles.Chargesheader}>
                <Text style={styles.ChargesoverdueAmount}>
                    { isOverdue ? "Overdue Amount" : "Repayment Amount" }
                </Text>
                <Text style={styles.Chargesamount}>₹23,826.02</Text>
              </View>
              <View style={styles.ChargesrepaymentDateWrapper}>
                <Text style={styles.ChargesrepaymentDateLabel}>
                  Repayment Date
                </Text>
                <Text style={styles.ChargesrepaymentDate}>05 Sep 2024</Text>
              </View>
              </ImageBackground>

            </View>
            <View style={styles.Chargescard}>
              <View style={styles.Chargesdetails}>
                <Text style={styles.ChargesdetailText}>Loan Amount</Text>
                <Text style={styles.ChargesdetailValue}>₹10,00,000.00</Text>
              </View>
              <View style={styles.Chargesdetails}>
                <Text style={styles.ChargesdetailText}>Tenure</Text>
                <Text style={styles.ChargesdetailValue}>60 Months</Text>
              </View>
              <View style={styles.Chargesdetails}>
                <Text style={styles.ChargesdetailText}>Disbursal Amount</Text>
                <Text style={styles.ChargesdetailValue}>₹10,00,000.00</Text>
              </View>
              <View style={styles.Chargesdivider} />
              <View style={styles.Chargesdetails}>
                <Text style={styles.ChargesdetailText}>Principal</Text>
                <Text style={styles.ChargesdetailValue}>₹12,224</Text>
              </View>
              <View style={styles.Chargesdetails}>
                <Text style={styles.ChargesdetailText}>Interest</Text>
                <Text style={styles.ChargesdetailValue}>₹10,000</Text>
              </View>
              <View style={styles.Chargesdetails}>
                <Text style={styles.ChargesdetailText}>Overdue Period (DPD)</Text>
                <Text style={styles.ChargesdetailValue}>2 Days</Text>
              </View>
              <View style={styles.Chargesdetails}>
                <Text style={styles.ChargesdetailText}>Overdue Charges @ 2%</Text>
                <Text style={styles.ChargesdetailValue}>₹244.48</Text>
              </View>
              <View style={styles.Chargesdetails}>
                <Text style={styles.ChargesdetailText}>Bounce Charges</Text>
                <Text style={styles.ChargesdetailValue}>₹531</Text>
              </View>
              <View style={styles.Chargesdetails}>
                <Text style={styles.ChargesdetailText}>Late Payment Charges</Text>
                <Text style={styles.ChargesdetailValue}>₹444.44</Text>
              </View>
              <View style={styles.Chargesdetails}>
                <Text style={styles.ChargesdetailText}>GST (18%)</Text>
                <Text style={styles.ChargesdetailValue}>₹95.58</Text>
              </View>
              <View style={styles.Chargesdivider} />
              <View style={styles.ChargestotalWrapper}>
                <Text style={[styles.ChargestotalLabel, isOverdue ? styles.redText : styles.blueText]}>
                  Total Repayment Amount
                </Text>
                <Text style={[styles.ChargestotalAmount,isOverdue ? styles.redText : styles.blueText]}>₹23,826.02</Text>
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={styles.RepaymentApplybuttonWrapper}>
          <TouchableOpacity
            style={styles.RepaymentapplyNowButton}
            onPress={() => navigation.navigate('Payment')}
          >
            <Text style={styles.RepaymentapplyNowButtonText}>PAY NOW</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Layout>
  );
};

export default Charges;
