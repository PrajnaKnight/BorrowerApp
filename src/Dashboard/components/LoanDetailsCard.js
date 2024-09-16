import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import applyFontFamily from '../../assets/style/applyFontFamily';
import { LinearGradient } from 'expo-linear-gradient';

const LoanDetailsCard = ({ loanAmount, emiAmount, tenure, interestRate }) => {
  const navigation = useNavigation();

  return (
    <View>
      <View
        style={{
          backgroundColor: "#73206d",
          padding: 3,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        }}>
        <ImageBackground
          source={require("../../assets/images/loanEligibilityBanner.png")}
          style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
          resizeMode="cover">
          <View style={styles.bannerText}>
            <Text style={styles.eligibleLoan}>Eligible Loan Amount</Text>
            <Text style={styles.loanAmount}>₹ {loanAmount}</Text>
          </View>
        </ImageBackground>
      </View>


      <View style={styles.cardContainer}>
        <View style={styles.detailsRow}>
          <View style={styles.detailText}>
          <Text style={styles.emiLabel}>EMI Amount</Text>
          <Text style={styles.emiValue}>₹ {emiAmount}</Text>
          </View>
          <View style={styles.detailText}>
            <Text style={styles.emiLabel}>Eligible Tenure (M)</Text>
            <Text style={styles.emiValue}>{tenure}</Text>
          </View>
          <View style={styles.detailText}>
            <Text style={styles.emiLabel}>Interest Rate</Text>
            <Text style={styles.emiValue}>{interestRate}%</Text>
          </View>
        </View>
        <View style={styles.buttonRow}>
        <TouchableOpacity
            onPress={() => navigation.navigate("AmortizationSchedule")}>
          <Text style={styles.link}>Amortization Schedule</Text>
          </TouchableOpacity>
          <LinearGradient
            colors={["#E9F0FF", "#BDCEF0"]} style={styles.applyLoanButton}>
            <TouchableOpacity>
              <Text style={styles.disabledButton}>Apply Loan</Text>
            </TouchableOpacity>
          </LinearGradient>
                  </View>
      </View>
    </View>
  );
};

const styles = applyFontFamily({
  cardContainer: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 8,
    elevation: 5,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    padding: 16,
  },
  eligibleLoan: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 5,
  },
  loanAmount: {
    fontSize: 28,
    fontWeight: "500",
    color: "#fff",
    textAlign: "center",
    lineHeight:30,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  detailText: {
    flex: 1,
    flexDirection: "column",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center',
    borderTopWidth:1,
    borderTopColor:'#E9F0FF',
    flex:1,
    paddingTop:10
  },
  link: {
    color: "#758BFD",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  disabledButton: {
    color: "#A6BAE3",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 5,
    textAlign:'center'
  },
  bannerText: {
    paddingHorizontal: 20,
    paddingTop:20,
    paddingBottom:15,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emiLabel: {
    fontSize: 12,
    color: "#00194c",
    textAlign: "center",
    marginBottom: 2,
  },
  emiValue: {
    fontSize: 14,
    color: "#00194c",
    textAlign: "center",
    fontWeight: "bold",
  },
  applyLoanButton:{
    borderRadius:5
  },
});

export default LoanDetailsCard;
