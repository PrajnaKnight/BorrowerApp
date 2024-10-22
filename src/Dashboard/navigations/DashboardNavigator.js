import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; 
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import BottomBar from '../components/BottomTabBar';
import LoanDetails from '../screens/LoanDetails';
import LoanStagesScreen from '../screens/LoanStages';
import IndividualLoanDetailsScreen from '../screens/IndividualLoanDetailsScreen';
import LoanOverviewScreen from '../screens/LoanOverviewScreen';
import TransactionDetailsScreen from '../screens/TransactionDetailsScreen';
import LoanDocumentsScreen from '../screens/LoanDocumentsScreen';
import ChargesScreen from '../screens/Charges';
import LoanRepaymentScheduleScreen from '../screens/LoanRepaymentSchedule';
import LoanSubmittedDocumentsScreen from '../screens/LoanSubmittedDocuments';
import LoanDirectDownloadScreen from '../screens/LoanDirectDownload';
import RequestDocumentsScreen from '../screens/RequestDocuments';
import ProfileScreen from '../screens/ProfileScreen';
import GeneralSettingScreen from '../screens/GeneralSettingScreen';
import AboutUsScreen from '../screens/AboutUsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import RepaymentScreen from '../screens/RepaymentScreen';
import PaymentMethodScreen from '../screens/PaymentMethodScreen';
import PaymentSuccessScreen from '../screens/PaymentSuccessScreen';
import PaymentFailureScreen from '../screens/PaymentFailureScreen';
import NoLoans from '../screens/NoLoans';
import LoanEligibilityCalculator from '../screens/LoanEligibilityCalculator';
import EMICalculator from '../screens/EMICalculator';
import RepaymentSchedule from '../screens/RepaymentSchedule';
import AmortizationSchedule from '../screens/AmortizationSchedule';
import PreDisbursalChargesScreen from '../screens/PreDisbursalCharges';
import PaymentErrorScreen from '../screens/PaymentErrorScreen';
import PaymentIntrruptedScreen from '../screens/PaymentIntrruptedScreen';
import EMINotification from '../components/EMINotification';
import SideMenu from '../components/SideMenu';
import ClosedLoanOverviewScreen from '../screens/ClosedLoanOverview';
import ClosedLoanRPS from '../screens/ClosedLoanRPS';
import ClosedPreDisbursalChargesScreen from '../screens/ClosedPreDisbursalCharges';
import PreDisbursementScreen from '../screens/PreDisbursementChargesScreen';
import { TabProvider } from '../components/TabContext';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfileInfo } from '../services/Redux/ProfileInfoSlice';
import LoadingOverlay from '../../PersonalLoan/components/FullScreenLoader';
import { API_STATE } from '../../Common/Utils/Constant';
import { useFocusEffect } from '@react-navigation/native';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();


const LoanStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="LoansHome" component={LoanDetails} options={{ headerShown: false }} />
    <Stack.Screen name="LoanStages" component={LoanStagesScreen} options={{ headerShown: false }} />
    <Stack.Screen name="IndividualLoanDetails" component={IndividualLoanDetailsScreen} options={{ headerShown: false }} />
    <Stack.Screen name="LoanOverview" component={LoanOverviewScreen} options={{ headerShown: false }} />
    <Stack.Screen name="TransactionDetails" component={TransactionDetailsScreen} options={{ headerShown: false }} />
    <Stack.Screen name="LoanDocuments" component={LoanDocumentsScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Charges" component={ChargesScreen} options={{ headerShown: false }} />
    <Stack.Screen name="LoanRPS" component={LoanRepaymentScheduleScreen} options={{ headerShown: false }} />
    <Stack.Screen name="LoanSubmittedDocuments" component={LoanSubmittedDocumentsScreen} options={{ headerShown: false }} />
    <Stack.Screen name="LoanDirectDownload" component={LoanDirectDownloadScreen} options={{ headerShown: false }} />
    <Stack.Screen name="RequestDocuments" component={RequestDocumentsScreen} options={{ headerShown: false }} />
    <Stack.Screen name="PreDisbursalCharges" component={PreDisbursalChargesScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Repayment" component={RepaymentScreen} options={{ headerShown: false }} />
    <Stack.Screen name="ClosedLoanOverview" component={ClosedLoanOverviewScreen} options={{ headerShown: false }} />
    <Stack.Screen name="ClosedLoanRPS" component={ClosedLoanRPS} options={{ headerShown: false }} />
    <Stack.Screen name="ClosedPreDisbursalCharges" component={ClosedPreDisbursalChargesScreen} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const TabNavigator = () => (
  <Tab.Navigator tabBar={props => <BottomBar {...props} />}>
    <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
    <Tab.Screen name="Loans" component={LoanStack} options={{ headerShown: false }} />
    <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
    <Tab.Screen name="GeneralSetting" component={GeneralSettingScreen} options={{ headerShown: false }} />
    <Tab.Screen name="AboutUs" component={AboutUsScreen} options={{ headerShown: false }} />
    <Tab.Screen name="Notifications" component={NotificationsScreen} options={{ headerShown: false }} />
    <Tab.Screen name="Repayment" component={RepaymentScreen} options={{ headerShown: false }} />
    <Tab.Screen name="Payment" component={PaymentMethodScreen} options={{ headerShown: false }} />
    <Tab.Screen name="PaymentSuccess" component={PaymentSuccessScreen} options={{ headerShown: false }} />
    <Tab.Screen name="PaymentFailure" component={PaymentFailureScreen} options={{ headerShown: false }} />
    <Tab.Screen name="NoLoans" component={NoLoans} options={{ headerShown: false }} />
    <Tab.Screen name="LoanEligibilityCalculator" component={LoanEligibilityCalculator} options={{ headerShown: false }} />
    <Tab.Screen name="EMICalculator" component={EMICalculator} options={{ headerShown: false }} />
    <Tab.Screen name="RepaymentSchedule" component={RepaymentSchedule} options={{ headerShown: false }} />
    <Tab.Screen name="AmortizationSchedule" component={AmortizationSchedule} options={{ headerShown: false }} />
    <Tab.Screen name="PaymentError" component={PaymentErrorScreen} options={{ headerShown: false }} />
    <Tab.Screen name="PaymentIntrrupted" component={PaymentIntrruptedScreen} options={{ headerShown: false }} />
    <Tab.Screen name="SideMenu" component={SideMenu} options={{ headerShown: false }} />
    <Tab.Screen name="PreDisbursementScreen" component={PreDisbursementScreen} options={{ headerShown: false }} />
  </Tab.Navigator>
);

const DashboardNavigator = ()=> {
 

  const [showEMINotification, setShowEMINotification] = useState(true);

  

  const dispatch = useDispatch()
  const userProfileInfo = useSelector((state)=>state.profileInfoSlices)

  useFocusEffect(
    useCallback(() => {
    dispatch(fetchProfileInfo())
  },[]))

  return (
    <TabProvider>
      <View style={styles.container}>
        { userProfileInfo?.state == API_STATE.LOADING &&  <LoadingOverlay visible={true}/>}
        {showEMINotification && userProfileInfo?.state == API_STATE.STOP && (
          <EMINotification
            status="due"
            loanDetails={{
              outstanding: '10,00,000',
              nextEMIDate: '31 Sep 2024',
              emiAmount: '56786.00',
              paidMonth: 'March',
              paidYear: '2024',
            }}
            onClose={() => setShowEMINotification(false)}
            onAction={() => {
              setShowEMINotification(false);
              // Add navigation logic here if needed
            }}
          />
        )}
        <TabNavigator />
      </View>
    </TabProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default DashboardNavigator;