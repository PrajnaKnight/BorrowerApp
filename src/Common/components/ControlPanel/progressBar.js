import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProgressBar = ({ progress, timeRemaining }) => {
  const width = `${Math.min(Math.max(progress, 0), 1) * 100}%`;
  const completedPercentage = Math.round(progress * 100);

  return (
    <View style={styles.container}>
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width }]} />
        </View>
        <Text style={styles.progressText}>
          {`${completedPercentage}% Completed`}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressBarContainer: {
    flex: 1,
  },
  progressBarBackground: {
    height: 5,
    width: "100%",
    backgroundColor: "#E2ECFF",
    borderRadius: 5,
    marginBottom: 5,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#213ACE",
    borderRadius: 5,
  },
  progressText: {
    fontSize: 13,
    color: '#213ACE', 
    fontWeight: '600',
    textAlign: 'right',
    lineHeight: 20,
    marginBottom: 5,
  },
});

export default ProgressBar;