import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppProvider } from '../../Common/components/appContext';
import LoanDetails from '../screens/LoanDetailsScreen';
import BusinessInformation from '../screens/BusinessInformation';
import BusinessSummary from '../screens/BusinessSummary';
import BusinessProfile from '../screens/BusinessProfile';
import BusinessTypeDetailsScreen from '../screens/BusinessTypeDetails';
import BusinessLoanEligibilityScreen from '../screens/BusinessLoanEligibility';
import BusinessBankDetails from '../screens/BusinessBankDetails';
import { ProgressBarProvider } from '../../Common/components/ControlPanel/progressContext'; 


const Stack = createNativeStackNavigator();

function CommonNavigator() {
  console.log('MSMENavigator rendering');
  return (
    <AppProvider>
      <ProgressBarProvider>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="LoanDetails" component={LoanDetails} />
          <Stack.Screen name="BusinessInfo" component={BusinessInformation} />
          <Stack.Screen name="BusinessSummary" component={BusinessSummary} />
          <Stack.Screen name="BusinessProfile" component={BusinessProfile} />
          <Stack.Screen
            name="BusinessTypeDetails"
            component={BusinessTypeDetailsScreen}
          />
          <Stack.Screen
            name="BusinessLoanEligibility"
            component={BusinessLoanEligibilityScreen}
          />
          <Stack.Screen
            name="BusinessBankDetails"
            component={BusinessBankDetails}
          />
        </Stack.Navigator>
      </ProgressBarProvider>
    </AppProvider>
  );
}

export default CommonNavigator;