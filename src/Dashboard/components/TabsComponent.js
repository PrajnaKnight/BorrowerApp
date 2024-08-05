import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../assets/style/globalStyle';
import { useTab } from './TabContext';
import { useNavigation } from '@react-navigation/native';

const TabsComponent = () => {
  const { state, dispatch } = useTab();
  const { activeTab, loanStatus } = state;
  const navigation = useNavigation();

  const handleTabPress = (tabName) => {
    dispatch({ type: 'SET_ACTIVE_TAB', payload: tabName });
    switch (tabName) {
      case 'Loan Details':
        navigation.navigate('IndividualLoanDetails', { loanStatus });
        break;
      case 'Transaction Details':
        navigation.navigate('TransactionDetails', { loanStatus });
        break;
      case 'Loan Documents':
        navigation.navigate('LoanDocuments', { loanStatus });
        break;
    }
  };

  return (
    <View style={{backgroundColor:'#00194c', flexDirection:'row', width:'100%'}}>
      <ScrollView horizontal showsHorizontalScrollIndicator={true}>
        <View style={[styles.IndividualtabBar]}>
          <TouchableOpacity
            onPress={() => handleTabPress("Loan Details")}
            style={styles.marginRight}>
            <Text
              style={
                activeTab === "Loan Details" ? styles.activeTab : styles.tab
              }>
              Loan Details
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleTabPress("Transaction Details")}
            style={styles.marginRight}>
            <Text
              style={
                activeTab === "Transaction Details"
                  ? styles.activeTab
                  : styles.tab
              }>
              Transaction Details
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleTabPress("Loan Documents")}
            style={styles.marginRight}>
            <Text
              style={
                activeTab === "Loan Documents" ? styles.activeTab : styles.tab
              }>
              Loan Documents
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default TabsComponent;