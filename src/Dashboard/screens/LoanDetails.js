import React, { useState } from 'react';
import { View, Dimensions, TouchableOpacity, Text, FlatList, ImageBackground } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { styles } from '../../assets/style/globalStyle';
import Layout from '../components/Layout';
import NoLoans from './NoLoans';

const { width } = Dimensions.get('window');

const loans = [
  { id: '1', type: 'Gold Loan', loanAccount: '******1234', amount: '₹ 10,00,000', duration: '60 Months', status: 'In Process' },
  { id: '2', type: 'Car Loan', loanAccount: '******1234', amount: '₹ 10,00,000', duration: '60 Months', status: 'Active' },
  { id: '3', type: 'Personal Loan', loanAccount: '******1234', amount: '₹ 10,00,000', duration: '60 Months', status: 'Active' },
  { id: '4', type: 'Home Loan', loanAccount: '******1234', amount: '₹ 10,00,000', duration: '60 Months', status: 'Closed' },
  { id: '5', type: 'Personal Loan', loanAccount: '******1234', amount: '₹ 10,00,000', duration: '60 Months', status: 'In Process' },
  { id: '6', type: 'Car Loan', loanAccount: '******1234', amount: '₹ 10,00,000', duration: '60 Months', status: 'In Process' },
];

const LoanItem = ({ item, navigation, route }) => {
  const statusStyles = {
    'In Process': { backgroundColor: '#FF8800', text: 'In Process' },
    'Active': { backgroundColor: '#2FC603', text: 'Ongoing' },
    'Closed': { backgroundColor: '#B3B9E1', text: 'Closed' },
  };

  return (
    <TouchableOpacity
    style={styles.loanItemWrapper}
      onPress={() => {
        if (item.status === "In Process") {
          navigation.navigate("LoanStages", {
            loanId: item.id,
            loanStatus: item.status,
          });
        } else {
          navigation.navigate("IndividualLoanDetails", {
            loanId: item.id,
            loanStatus: item.status,
          });
        }
      }}>
      <ImageBackground
        source={require("../../assets/images/loanBg.png")}
        tyle={styles.backgroundImageLoan}
        resizeMode="contain">
        <View style={styles.loanItem}>
          <View style={styles.loanDetails}>
            <Text style={styles.loanType}>{item.type}</Text>
            <Text style={styles.loanAccount}>{item.loanAccount}</Text>
            <Text style={styles.loanSubText}>Loan Amount</Text>
            <Text style={styles.StageloanAmount}>{item.amount}</Text>
          </View>
          <View style={styles.loanMeta}>
            <TouchableOpacity
              style={[
                styles.statusButton,
                { backgroundColor: statusStyles[item.status].backgroundColor },
              ]}>
              <Text style={styles.statusButtonText}>
                {statusStyles[item.status].text}
              </Text>
            </TouchableOpacity>
            <Text style={styles.loanDuration}>Duration</Text>
            <Text style={styles.loanDurationValue}>{item.duration}</Text>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const InProgressRoute = ({ navigation }) => (
  <FlatList
    data={loans.filter(loan => loan.status === 'In Process')}
    renderItem={({ item }) => <LoanItem item={item} navigation={navigation} />}
    keyExtractor={item => item.id}
    contentContainerStyle={styles.loanList}
  />
);

const ActiveRoute = ({ navigation }) => (
  <FlatList
    data={loans.filter(loan => loan.status === 'Active')}
    renderItem={({ item }) => <LoanItem item={item} navigation={navigation} />}
    keyExtractor={item => item.id}
    contentContainerStyle={styles.loanList}
  />
);

const ClosedRoute = ({ navigation }) => (
  <FlatList
    data={loans.filter(loan => loan.status === 'Closed')}
    renderItem={({ item }) => <LoanItem item={item} navigation={navigation}  />}
    keyExtractor={item => item.id}
    contentContainerStyle={styles.loanList}
  />
);

const renderScene = ({ route, jumpTo, navigation }) => {
  switch (route.key) {
    case 'inProgress':
      return <InProgressRoute navigation={navigation} />;
    case 'active':
      return <ActiveRoute navigation={navigation} />;
    case 'closed':
      return <ClosedRoute navigation={navigation} />;
    default:
      return null;
  }
};

const LoansScreen = ({ navigation }) => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'inProgress', title: 'In Progress' },
    { key: 'active', title: 'Active' },
    { key: 'closed', title: 'Closed' },
  ]);

  const inProgressLoans = loans.filter(loan => loan.status === 'In Process').length > 0;
  const activeLoans = loans.filter(loan => loan.status === 'Active').length > 0;
  const closedLoans = loans.filter(loan => loan.status === 'Closed').length > 0;


  return (
    <Layout>
      <View style={styles.container}>
        {inProgressLoans || activeLoans || closedLoans ? (
          <TabView
            navigationState={{ index, routes }}
            renderScene={(props) => renderScene({ ...props, navigation })}
            onIndexChange={setIndex}
            initialLayout={{ width }}
            renderTabBar={(props) => (
              <TabBar
                {...props}
                indicatorStyle={styles.indicator}
                style={styles.tabBar}
                labelStyle={styles.tabLabel}
                activeColor="#fff"
                inactiveColor="#BDBDBD"
                renderLabel={({ route, focused }) => (
                  <Text style={[styles.tabLabel,  { color: focused ? '#fff' : '#BDBDBD', fontWeight: focused ? 'bold' : 'normal' }]}>
                    {route.title}
                  </Text>
                )}
                renderTab={({ route, focused, onPress }) => (
                  <TouchableOpacity
                    onPress={() => {
                      if (route.key === 'active' && !activeLoans) return;
                      if (route.key === 'closed' && !closedLoans) return;
                      onPress();
                    }}
                    style={styles.tabItem}
                  >
                    <Text style={[styles.tabLabel, { color: focused ? '#fff' : '#BDBDBD',fontWeight: focused ? 'bold' : 'normal',  opacity: (route.key === 'active' && !activeLoans) || (route.key === 'closed' && !closedLoans) ? 0.5 : 1 }]}>
                      {route.title}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            )}
          />
        ) : (
          <NoLoans navigation={navigation} />
        )}
      </View>
    </Layout>
  );
};

export default LoansScreen;
