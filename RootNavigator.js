import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CommonNavigator from './src/Common/navigations/CommonNavigator';
import PersonalLoanNavigator from './src/PersonalLoan/navigations/PersonalLoanNavigator';
import DashboardNavigator from './src/Dashboard/navigations/DashboardNavigator';
import MsmeLoanNavigator from './src/MsmeLoan/navigations/MsmeNavigator';

const RootStack = createNativeStackNavigator();

const linking = {
  prefixes: ['myapp://'],
  config: {
    screens: {
      Common: {
        screens: {
          Login: 'login',
          otpverification: 'otp',
          ChoiceScreen: 'choice',
        },
      },
      PersonalLoan: {
        screens: {
          QLA: 'qla',
          primaryInfo: 'primary-info',
          personalInfo: 'personal-info',
          eKycVerify: 'ekyc-verify',
          addressDetail: 'address-detail',
          employmentDetail: 'employment-detail',
          bankDetail: 'bank-detail',
          loanEligibility: 'loan-eligibility',
          sanctionLetter: 'sanction-letter',
          documnetUplaod: 'document-upload',
          eMandate: 'emandate',
          loanAgreement: 'loan-agreement',
          agreementOTP: 'agreement-otp',
          final: 'final',
          RPS: 'rps',
          rejection: 'rejection',
          ShowImage: 'show-image',
          FullScreenWebViewForAadhaarSigning: 'aadhaar-signing',
          ThankYou: 'thank-you',
          InitiateDisbursalScreen: 'initiate-disbursal',
          Disbursement: 'disbursement',
          DisbursalAcceptedScreen: 'disbursal-accepted',
          Preview: 'preview',
          PermissionsScreen: 'permissions',
          WebCameraScreen: 'web-camera',
        },
      },
      Dashboard: {
        screens: {
          Home: 'home',
          Loans: {
            screens: {
              LoansHome: 'loans',
              LoanStages: 'loan-stages',
              IndividualLoanDetails: 'individual-loan-details',
              LoanOverview: 'loan-overview',
              TransactionDetails: 'transaction-details',
              LoanDocuments: 'loan-documents',
              Charges: 'charges',
              LoanRPS: 'loan-rps',
              LoanSubmittedDocuments: 'loan-submitted-documents',
              LoanDirectDownload: 'loan-direct-download',
              RequestDocuments: 'request-documents',
              PreDisbursalCharges: 'pre-disbursal-charges',
              Repayment: 'repayment',
              ClosedLoanOverview: 'closed-loan-overview',
              ClosedLoanRPS: 'closed-loan-rps',
              ClosedPreDisbursalCharges: 'closed-pre-disbursal-charges',
            },
          },
          Profile: 'profile',
          GeneralSetting: 'general-setting',
          AboutUs: 'about-us',
          Notifications: 'notifications',
          Repayment: 'repayment',
          Payment: 'payment',
          PaymentSuccess: 'payment-success',
          PaymentFailure: 'payment-failure',
          NoLoans: 'no-loans',
          LoanEligibilityCalculator: 'loan-eligibility-calculator',
          EMICalculator: 'emi-calculator',
          RepaymentSchedule: 'repayment-schedule',
          AmortizationSchedule: 'amortization-schedule',
          PaymentError: 'payment-error',
          PaymentIntrrupted: 'payment-interrupted',
          SideMenu: 'side-menu',
          PreDisbursementScreen: 'pre-disbursement',
        },
      },
      MsmeLoan: {
        screens: {
          LoanDetails: 'loan-details',
          BusinessInfo: 'business-info',
          BusinessSummary: 'business-summary',
          BusinessProfile: 'business-profile',
          BusinessTypeDetails: 'business-type-details',
          BusinessLoanEligibility: 'business-loan-eligibility',
          BusinessBankDetails: 'business-bank-details',
        },
      },
    },
  },
};

function RootNavigator() {
  return (
    <NavigationContainer linking={linking}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Common" component={CommonNavigator} />
        <RootStack.Screen name="PersonalLoan" component={PersonalLoanNavigator} />
        <RootStack.Screen name="Dashboard" component={DashboardNavigator} />
        <RootStack.Screen name="MsmeLoan" component={MsmeLoanNavigator} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

export default RootNavigator;