import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import applyFontFamily from '../../assets/style/applyFontFamily';

const { width, height } = Dimensions.get('window');

const EMINotification = ({ status, loanDetails, onClose }) => {
    const navigation = useNavigation();

    const getStatusColor = () => {
        switch (status) {
            case 'due':
                return 'rgba(0, 25, 76, 0.9)';
            case 'overdue':
                return 'rgba(221, 0, 0, 0.9)';
            case 'paid':
                return 'rgba(39, 174, 96, 0.9)';
            default:
                return 'rgba(0, 25, 76, 0.9)';
        }
    };

    const getStatusMessage = () => {
        switch (status) {
            case 'due':
                return 'EMI Due in 1 Day';
            case 'overdue':
                return 'EMI Overdue';
            case 'paid':
                return 'EMI Paid';
            default:
                return 'EMI Notification';
        }
    };

    const getStatusDescription = () => {
        switch (status) {
            case 'due':
            case 'overdue':
                return 'Pay now to avoid late payment fees and interest charges';
            case 'paid':
                return `Congratulations... Your EMI for ${loanDetails.paidMonth} ${loanDetails.paidYear} has been paid Successfully`;
            default:
                return '';
        }
    };

    const getActionButtonDetails = () => {
        switch (status) {
            case 'due':
                return {
                    text: 'PAY NOW',
                    onPress: () =>{ onClose(); navigation.navigate('Repayment', { type: 'due' })}
                };
            case 'overdue':
                return {
                    text: 'PAY INSTANTLY',
                    onPress: () => { onClose(); navigation.navigate('Repayment', { type: 'overdue' })}
                };
            case 'paid':
                return {
                    text: 'PAY IN ADVANCE',
                    onPress: () => { onClose(); navigation.navigate('Repayment')}
                };
            default:
                return {
                    text: 'PAY',
                    onPress: () =>{ onClose(); navigation.navigate('Repayment', { type: 'default' })}
                };
        }
    };

    const actionButtonDetails = getActionButtonDetails();

    return (
        <View style={styles.overlay}>
            <View style={[styles.container, { backgroundColor: getStatusColor() }]}>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Text style={styles.closeButtonText}>×</Text>
                </TouchableOpacity>
                <Text style={styles.title}>{getStatusMessage()}</Text>
                <Text style={styles.description}>{getStatusDescription()}</Text>
                <View style={styles.loanInfoContainer}>
                    <Text style={styles.loanInfoTitle}>Personal Loan ••••••1234</Text>
                    <Text style={styles.loanInfoText}>Loan Outstanding</Text>
                    <Text style={styles.loanAmount}>₹ {loanDetails.outstanding}</Text>
                    {status !== 'paid' && (
                        <View style={styles.emiDate}>
                            <Text style={styles.emiDateLabel}>EMI Date: </Text>
                            <Text style={styles.emiDateValue}>{loanDetails.nextEMIDate}</Text>
                        </View>
                    )}
                    {status === 'paid' && (
                        <View style={styles.emiDate}>
                            <Text style={styles.emiDateLabel}>Next EMI Date:</Text>
                            <Text style={styles.emiDateValue}> {loanDetails.nextEMIDate}</Text>
                        </View>
                    )}
                </View>
                <Text style={styles.emiAmountText}>
                    {status === 'paid' ? 'Next EMI Amount to be paid' : 'EMI Amount to be paid'}
                </Text>
                <Text style={styles.emiAmount}>₹ {loanDetails.emiAmount}</Text>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={actionButtonDetails.onPress}
                >
                    <Text style={styles.actionButtonText}>{actionButtonDetails.text}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = applyFontFamily({
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    },
    container: {
        padding: 20,
        alignItems: "center",
        justifyContent: "center",
        width: width,
        height: height,
    },
    closeButton: {
        position: "absolute",
        top: 10,
        right: 10,
    },
    closeButtonText: {
        color: "white",
        fontSize: 24,
        fontWeight: "bold",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white", 
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: "white",
        textAlign: "center",
        marginBottom: 40,
        width:'80%'
    },
    loanInfoContainer: {
        backgroundColor: "white",
        paddingTop: 15,
        borderRadius: 8,
        width: "100%",
        marginBottom: 20,
    },
    loanInfoTitle: {
        fontSize: 14,
        color:'#00194c',
        marginBottom: 10,
        textAlign: "center",
    },
    loanInfoText: {
        fontSize: 14,
        color: "#00194c",
        textAlign: "center",
    },
    loanAmount: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#00194c",
        marginBottom: 15,
        textAlign: "center",
    },
    emiDate: {
        backgroundColor: "#D0E4FE",
        padding: 10,
        flexDirection:'row',
        justifyContent:'center',
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
    },
    emiDateLabel: {
        fontSize: 14,
        color: "#00194c",
    },
    emiDateValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: "#00194c",
    },
    emiAmountText: {
        marginTop: 30,
        fontSize: 14,
        color: "white",
    },
    emiAmount: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
        marginVertical: 10,
    },
    actionButton: {
        backgroundColor: "white",
        paddingVertical: 8,
        paddingHorizontal: 19,
        borderRadius: 5,
        marginTop: 10,
    },
    actionButtonText: {
        color: "#00194c",
        fontSize: 16,
        fontWeight: "bold",
        textTransform: 'capitalize'
    },
});

export default EMINotification;