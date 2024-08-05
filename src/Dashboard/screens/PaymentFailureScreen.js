import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Layout from '../components/Layout';
import applyFontFamily from '../../assets/style/applyFontFamily';

const PaymentFailureScreen = ({ navigation }) => {
  return (
    <Layout>
      <View style={styles.container}>
        <View style={styles.card}>
        <Image
            source={require('../../assets/images/Error.gif')}
            resizeMode="contain"
            style={styles.failureIcon}
          />
          <Text style={styles.loanId}>Loan ID: 24235352</Text>
          <Text style={styles.amount}>₹ 6726.00</Text>
          <Text style={styles.failure}>PAYMENT FAILED</Text>
          <Text style={styles.message}>
            Payment failed due to insufficient funds
          </Text>
          <Text style={styles.transactionId}>Transaction ID: 12345</Text>
          <Text style={styles.date}>10/04/2023 | 04:35 PM</Text>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => navigation.navigate('Repayment')}
          >
            <Text style={styles.buttonText}>RETRY</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Layout>
  );
};

const styles = applyFontFamily({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00194C',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    width: '90%',
  },
  failureIcon: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  loanId: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  amount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  failure: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
    marginBottom: 10,
  },
  message: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  transactionId: {
    fontSize: 12,
    color: '#999',
    marginBottom: 10,
  },
  date: {
    fontSize: 12,
    color: '#999',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#00194C',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '80%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PaymentFailureScreen;
