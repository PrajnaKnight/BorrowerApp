import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Image } from 'react-native';
import Layout from '../components/Layout';
import applyFontFamily from '../../assets/style/applyFontFamily';
import { FontDisplay } from 'expo-font';

const PaymentSuccessScreen = ({ navigation }) => {
  return (
    <Layout>
      <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/images/celebration.png")}
        style={styles.paymentbackground}
        resizeMode="cover">
        <View style={styles.card}>
        <Image
            source={require('../../assets/images/Done.gif')}
            resizeMode="contain"
            style={styles.successIcon}
          />
          <Text style={styles.loanId}>Loan ID: 24235352</Text>
          <Text style={styles.amount}>₹ 6726.00</Text>
          <Text style={styles.success}>SUCCESSFUL!</Text>
          <Text style={styles.message}>
            Congratulations... Your EMI for March 2024 has been paid successfully
          </Text>
          <Text style={styles.transactionId}>Transaction ID: 12345</Text>
          <Text style={styles.date}>10/04/2023 | 04:35 PM</Text>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => navigation.navigate('Repayment')}
          >
            <Text style={styles.buttonText}>DONE</Text>
          </TouchableOpacity>
          <View style={styles.note}>
            <Text style={[styles.noteText, styles.orangeText]}>Note:</Text>
            <Text style={styles.noteText}> It can take up to 2 working days to update payment in our system post debit from your account</Text>
          </View>
        </View>
        </ImageBackground>
      </View>
    </Layout>
  );
};

const styles = applyFontFamily({
  paymentbackground:{
    width:'100%',
    margin:'auto',
    textAlign:'center',
    flexDirection:'column',
    justifyContent:'center',
    borderRadius:10
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00194C',
  },
  card: {
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
    margin:'auto'
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
  success: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#27AE60',
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
    backgroundColor: '#758BFD',
    borderRadius: 5,
    alignItems: 'center',
    width: '30%',
    paddingHorizontal:16,
    paddingVertical:6
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  successIcon:{
    width:100,
    height:100,
    marginBottom:10
  },
  note:{
    marginTop:15,
    flexDirection:'row',
    marginBottom:20
  },
  noteText:{
    fontSize:10,
    color:'#00194C',
    fontStyle:'italic'  
  },
  orangeText:{
    color:'#FF8800'
  }
});

export default PaymentSuccessScreen;