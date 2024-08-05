import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import CustomCheckBox from '../components/CustomCheckBox'; 
import Layout from '../components/Layout';
import { styles } from '../../assets/style/globalStyle';

const PaymentMethodScreen = ({ navigation }) => {
  const [selectedGateway, setSelectedGateway] = useState(null);

  const handleSelectGateway = (gateway) => {
    setSelectedGateway(gateway);
  };

  const isGatewaySelected = (gateway) => selectedGateway === gateway;

  const handlePayment = () => {
    // Simulate payment process
    const isSuccess = Math.random() > 0.5; // Random success or failure for demonstration
    if (isSuccess) {
      navigation.navigate('PaymentSuccess');
    } else {
      navigation.navigate('PaymentFailure');
    }
  };

  return (
    <Layout>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.content}>
          <Text style={styles.smallheader}>Choose Payment Gateway</Text>
          
          {/* Digio */}
          <TouchableOpacity 
            style={styles.gatewayOption} 
            onPress={() => handleSelectGateway('digio')}
          >
            <CustomCheckBox
              isChecked={isGatewaySelected('digio')}
              onPress={() => handleSelectGateway('digio')}
            />
            <Image source={require('../../assets/images/digio_blue.png')} style={styles.gatewayLogo} />
          </TouchableOpacity>

          {/* Razorpay */}
          <TouchableOpacity 
            style={styles.gatewayOption} 
            onPress={() => handleSelectGateway('razorpay')}
          >
            <CustomCheckBox
              isChecked={isGatewaySelected('razorpay')}
              onPress={() => handleSelectGateway('razorpay')}
            />
            <Image source={require('../../assets/images/razorpay.png')} style={styles.gatewayLogo} />
          </TouchableOpacity>

          {/* BillDesk */}
          <TouchableOpacity 
            style={styles.gatewayOption} 
            onPress={() => handleSelectGateway('billdesk')}
          >
            <CustomCheckBox
              isChecked={isGatewaySelected('billdesk')}
              onPress={() => handleSelectGateway('billdesk')}
            />
            <Image source={require('../../assets/images/bill_desk.png')} style={styles.gatewayLogo} />
          </TouchableOpacity>
        </View>
        
        {/* Check and Pay Button */}
        <View style={styles.buttonWrapper}>
          <TouchableOpacity 
            style={[styles.payButton, selectedGateway ? styles.payButtonActive : styles.payButtonInactive]}
            disabled={!selectedGateway}
            onPress={handlePayment}
          >
            <Text style={styles.payButtonText}>CHECK AND PAY</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Layout>
  );
};


export default PaymentMethodScreen;
