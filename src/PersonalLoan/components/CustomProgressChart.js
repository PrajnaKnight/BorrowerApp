import React from 'react';
import { View } from 'react-native';
import Svg, { Path, G, Text } from 'react-native-svg';

const LoanAmountGauge = ({ loanAmount, minLoanAmount, maxLoanAmount }) => {

  if(!loanAmount || !maxLoanAmount){
    return
  }
  const radius = 80;
  const strokeWidth = 20;
  const centerX = 100;
  const centerY = 100;
  const circumference = Math.PI * radius;
  
  const percentage = ((loanAmount - minLoanAmount) / (maxLoanAmount - minLoanAmount)) * 100;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Define font families directly
  const regularFont = 'System';
  const boldFont = 'System-Bold';

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Svg width="1000" height="140" viewBox="0 0 200 140">
        {/* Background semi-circle */}
        <Path
          d={`M ${centerX - radius}, ${centerY} a ${radius},${radius} 0 1,1 ${radius * 2},0`}
          stroke="#E2ECFF"
          fill="none"
          strokeWidth={strokeWidth}
           strokeLinecap="round"
        />
        {/* Foreground semi-circle */}

        
        <Path
          d={`M ${centerX - radius}, ${centerY} a ${radius},${radius} 0 1,1 ${radius * 2},0`}
          stroke="#0010AC"
          fill="none"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
        {/* Loan Amount label */}
        <Text
          x={centerX}
          y={centerY - 30}
          fontSize="14"
          fill="#00194c"
          textAnchor="middle"
          fontFamily={regularFont}
        >
          Loan Amount
        </Text>
        {/* Rupee symbol */}
        <Text
          x={centerX - 30}
          y={centerY - 5}
          fontSize="18"
          fill="#00194c"
          fontWeight="bold"
          textAnchor="end"
          fontFamily={boldFont}
        >
          ₹
        </Text>
        {/* Loan Amount value */}
        <Text
          x={centerX - 28}
          y={centerY - 6}
          fontSize="18"
          fill="#00194c"
          fontWeight="bold"
          textAnchor="start"
          fontFamily={boldFont}
        >
          {loanAmount?.toLocaleString() || 0}
        </Text>
        {/* Min loan amount */}
        <Text
          x="15"
          y={centerY + 25}
          fontSize="12"
          fill="#00194c"
          textAnchor="start"
          fontFamily={regularFont}
        >
          ₹{minLoanAmount.toLocaleString()}
        </Text>
        {/* Max loan amount */}
        <Text
          x="153"
          y={centerY + 25}
          fontSize="12"
          fill="#00194c"
          fontWeight="bold"
          textAnchor="end"
          fontFamily={boldFont}
        >
          ₹
        </Text>
        <Text
          x="155"
          y={centerY + 25}
          fontSize="12"
          fill="#00194c"
          textAnchor="start"
          fontFamily={regularFont}
        >
          {maxLoanAmount?.toLocaleString() || 0}
        </Text>
      </Svg>
    </View>
  );
};

export default LoanAmountGauge;