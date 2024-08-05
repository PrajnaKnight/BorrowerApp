import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Layout from '../components/Layout';

const PaymentErrorScreen = ({ navigation }) => {
  return (
    <Layout>
      <View style={styles.container}>
        <View style={styles.card}>
        <Image
            source={require('../../assets/images/wrong.gif')}
            resizeMode="contain"
            style={styles.failureIcon}
          />
          <Text style={styles.loanId}>Loan ID: 24235352</Text>
          <Text style={styles.amount}>₹ 6726.00</Text>
          <Text style={styles.failure}>ERROR!</Text>
          <Text style={styles.message}>
           We couldn't process your payment. Please check your connection and try again
          </Text>
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

const styles = StyleSheet.create({
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

export default PaymentErrorScreen;
