import React from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const ResponsiveEMILayout = ({ rateOfInterest, emiAmount }) => {
  return (
    <View style={styles.container}>
      <View style={styles.column}>
        <Text style={styles.label}>Rate of Interest</Text>
        <View style={styles.interestContainer}>
          <Text style={styles.interestRate}>{rateOfInterest || 0} %</Text>
          <View style={styles.reducingRateContainer}>
            <Text style={styles.reducingRateText}>Reducing</Text>
            <Text style={styles.reducingRateText}>Rate</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.column}>
        <Text style={styles.label}>EMI Amount</Text>
        <Text style={styles.emiAmount}>₹ {emiAmount || 0}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
    paddingHorizontal: 5,
  },
  label: {
    fontSize: Math.max(12, screenWidth * 0.03),
    marginBottom: 5,
    color: '#00194C',
    ...Platform.select({
      web: {
        fontSize: 15,
      },
    }),
  },
  interestContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderWidth: 1,
    borderColor: '#00194C',
    borderRadius: 5,
    backgroundColor:'#F3F4FC'
  },
  interestRate: {
    fontSize: Math.max(14, screenWidth * 0.035),
    color: '#00194C',
    ...Platform.select({
      web: {
        fontSize: 14,
      },
    }),
  },
  reducingRateContainer: {
    alignItems: 'flex-end',
  },
  reducingRateText: {
    color: '#00194C',
    fontSize: Math.max(8, screenWidth * 0.02),
    lineHeight: Math.max(10, screenWidth * 0.025),
    fontWeight: '500',
    opacity: 0.6,
    ...Platform.select({
      web: {
        fontSize: 10,
        lineHeight: 10,
      },
    }),
  },
  emiAmount: {
    fontSize: Math.max(14, screenWidth * 0.035),
    ...Platform.select({
      web: {
        fontSize: 14,
      },
    }),
    color: '#00194C',
    padding: 10,
    borderWidth: 1,
    borderColor: '#00194C',
    borderRadius: 5,
    backgroundColor:'#F3F4FC'
  },
});

export default ResponsiveEMILayout;