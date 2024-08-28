import React, { useState, useCallback } from 'react';
import { KeyboardAvoidingView, Platform, useWindowDimensions, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import LoadingOverlay from '../components/FullScreenLoader';
import ProgressBar from '../components/progressBar';
import { useAppContext } from '../components/useContext';
import CustomInput from '../components/input';
import RadioButton from '../components/radioButton';
import { LinearGradient } from 'expo-linear-gradient';
import { GoBack } from '../services/Utils/ViewValidator';
import { styles } from '../services/style/gloablStyle';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPersonalLoanDetails, updatePersonaLoanDetails } from '../services/Utils/Redux/PersonalFinanceDetailSlices';
import { isValidField, isValidNumberOnlyField, isValidNumberOnlyFieldWithZero } from '../services/Utils/FieldVerifier';
import { GetLeadId } from '../services/LOCAL/AsyncStroage';
import { SavePeronsalFinanceDetails } from '../services/API/SaveEmploymentDetails';
import { STATUS } from '../services/API/Constants';
import { ALL_SCREEN } from '../services/Utils/Constants';
import { updateJumpTo } from '../services/Utils/Redux/LeadStageSlices';
import { useFocusEffect } from '@react-navigation/native';
import useJumpTo from '../components/StageComponent';
import { checkLocationPermission } from './PermissionScreen';


const PersonalFinance = ({navigation}) => {
    const dispatch = useDispatch();
    const stageMaintance = useJumpTo("personalFinance", "bankDetail", navigation);
    const extraSlices = useSelector(state => state.extraStageSlice);

    const personalLoanDetailSlice = useSelector((state) => state.personalLoanDetailSlice);

    const { fontSize } = useAppContext();
    const [loading, setLoading] = useState(false)
    const [otherError, setOtherError] = useState(null)
    const [currentSelectOption, setCurrentSelectOption] = useState("Yes")
    const [refresh, setRefresh] = useState(true)

    const dynamicFontSize = (size) => size + fontSize;

    const { width, height } = useWindowDimensions();
    const isWeb = Platform.OS === 'web';
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;
    const isDesktop = width >= 1024;

    const containerStyle = isDesktop ? styles.desktopContainer : isMobile ? styles.mobileContainer : styles.tabletContainer;
    const imageContainerStyle = isDesktop ? { width: '50%' } : { width: '100%' };

    const HandleProcced = async () => {

        if (extraSlices.isBreDone) {
            navigation.navigate('bankDetail');
            return;
        }

        setOtherError(null)
        const LeadId = await GetLeadId()

        const perosnalLoan = { ...personalLoanDetailSlice.data };

        const grossMonthlyIncomeError = isValidNumberOnlyFieldWithZero(perosnalLoan.GrossMonthlyIncome, "Gross Monthly Income")
        if (grossMonthlyIncomeError) {
            perosnalLoan.GrossMonthlyIncomeError = grossMonthlyIncomeError
            dispatch(updatePersonaLoanDetails(perosnalLoan));
            return
        }
        const InvestmentsError = isValidNumberOnlyFieldWithZero(perosnalLoan.Investments, "Investments")
        if (InvestmentsError) {
            perosnalLoan.InvestmentsError = InvestmentsError
            dispatch(updatePersonaLoanDetails(perosnalLoan));
            return
        }
        const FixedAssetsError = isValidNumberOnlyFieldWithZero(perosnalLoan.FixedAssets, "Fixed Assets")
        if (FixedAssetsError) {
            perosnalLoan.FixedAssetsError = FixedAssetsError
            dispatch(updatePersonaLoanDetails(perosnalLoan));
            return
        }


        if (perosnalLoan.IsLoanAvailable) {

            const BorrowerExistingLoanDetails = [...perosnalLoan.BorrowerExistingLoanDetails]
            for (let i = 0; i < BorrowerExistingLoanDetails.length; i++) {
                const loanDetail = {...BorrowerExistingLoanDetails[i]};

                const LoanFromBankError = isValidField(loanDetail.LoanFromBank, "Bank Name")
                if (LoanFromBankError) {
                    loanDetail.LoanFromBankError = LoanFromBankError
                    BorrowerExistingLoanDetails[i] = loanDetail
                    perosnalLoan.BorrowerExistingLoanDetails = BorrowerExistingLoanDetails
                    dispatch(updatePersonaLoanDetails(perosnalLoan));
                    return
                }
                const LoanTypeError = isValidField(loanDetail.LoanType, "Loan Type")
                if (LoanTypeError) {
                    loanDetail.LoanTypeError = LoanTypeError
                    BorrowerExistingLoanDetails[i] = loanDetail
                    perosnalLoan.BorrowerExistingLoanDetails = BorrowerExistingLoanDetails
                    dispatch(updatePersonaLoanDetails(perosnalLoan));
                    return
                }
                const LoanAmountError = isValidField(loanDetail.LoanAmount, "Loan Amount")
                if (LoanAmountError) {
                    loanDetail.LoanAmountError = LoanAmountError
                    BorrowerExistingLoanDetails[i] = loanDetail
                    perosnalLoan.BorrowerExistingLoanDetails = BorrowerExistingLoanDetails
                    dispatch(updatePersonaLoanDetails(perosnalLoan));
                    return
                }
                const EmiError = isValidField(loanDetail.EMI, "EMI")
                if (EmiError) {
                    loanDetail.EmiError = EmiError
                    BorrowerExistingLoanDetails[i] = loanDetail
                    perosnalLoan.BorrowerExistingLoanDetails = BorrowerExistingLoanDetails
                    dispatch(updatePersonaLoanDetails(perosnalLoan));
                    return
                }
            }

            for (let i = 0; i < BorrowerExistingLoanDetails.length; i++) {
                const loanDetail = {...BorrowerExistingLoanDetails[i]};
                loanDetail.LeadId = LeadId
                BorrowerExistingLoanDetails[i] = loanDetail
            }
            perosnalLoan.BorrowerExistingLoanDetails = BorrowerExistingLoanDetails
        }
        else {
            perosnalLoan.BorrowerExistingLoanDetails = []
        }

        perosnalLoan.LeadId = LeadId;
        perosnalLoan.LeadStage = stageMaintance.jumpTo

        console.log(perosnalLoan)

        if (await checkLocationPermission() == false) {
            navigation.navigate("PermissionsScreen", { permissionStatus: "denied", permissionType: "location" })
            return
        }

        setLoading(true)
        const savePeronsalFinanceDetails = await SavePeronsalFinanceDetails(perosnalLoan)
        setLoading(false)
        if (savePeronsalFinanceDetails.status == STATUS.ERROR) {
            setOtherError(savePeronsalFinanceDetails.message)
            return;
        }

        dispatch(updateJumpTo(stageMaintance));
        

        navigation.navigate('bankDetail');

        

    }

    const UpdatePersonalLoan = async (index, key, value) => {
        const perosnalLoan = { ...personalLoanDetailSlice.data };
        if (index != -1) {
            let borrowerExistingLoanDetails = [...perosnalLoan.BorrowerExistingLoanDetails]
            let currentBorrowerExistingLoanDetail = {...borrowerExistingLoanDetails[index]}
            switch (key) {
                case "LoanFromBank":
                    currentBorrowerExistingLoanDetail.LoanFromBank = value
                    currentBorrowerExistingLoanDetail.LoanFromBankError = null
                    break;
                case "LoanType":
                    currentBorrowerExistingLoanDetail.LoanType = value
                    currentBorrowerExistingLoanDetail.LoanTypeError = null
                    break;
                case "LoanAmount":
                    currentBorrowerExistingLoanDetail.LoanAmount = value
                    currentBorrowerExistingLoanDetail.LoanAmountError = null
                    break;
                case "EMI":
                    currentBorrowerExistingLoanDetail.EMI = value
                    currentBorrowerExistingLoanDetail.EmiError = null
                    break;


            }
            borrowerExistingLoanDetails[index] = currentBorrowerExistingLoanDetail
            perosnalLoan.BorrowerExistingLoanDetails = borrowerExistingLoanDetails;
        }
        else {

            switch (key) {
                case "IsLoanAvailable":
                    perosnalLoan.IsLoanAvailable = value
                    break;
                case "GrossMonthlyIncome":
                    perosnalLoan.GrossMonthlyIncome = value
                    perosnalLoan.GrossMonthlyIncomeError = null

                    break;
                case "Investments":
                    perosnalLoan.Investments = value
                    perosnalLoan.InvestmentsError = null

                    break;
                case "FixedAssets":
                    perosnalLoan.FixedAssets = value
                    perosnalLoan.FixedAssetsError = null
                    break;
            }
        }

        dispatch(updatePersonaLoanDetails(perosnalLoan));
    }

    useFocusEffect(
        useCallback(() => {
            setLoading(personalLoanDetailSlice.loading)

        }, [personalLoanDetailSlice.loading])
    )

    useFocusEffect(
        useCallback(() => {
            setOtherError(personalLoanDetailSlice.error)

        }, [personalLoanDetailSlice.error])
    )

    useFocusEffect(
        useCallback(() => {
            if (refresh == false) {
                return
            }

            dispatch(fetchPersonalLoanDetails())
            setRefresh(false);
        }, [refresh]))

    return <View style={styles.mainContainer}>
        <View style={{ flex: 1, flexDirection: isWeb ? "row" : "column" }}>

            {isWeb && (isDesktop || (isTablet && width > height)) && (
                <View style={[styles.leftContainer, imageContainerStyle]}>
                    <View style={styles.mincontainer}>
                        <View style={styles.webheader}>
                            <Text style={styles.WebheaderText}>Personal Loan</Text>
                            <Text style={styles.websubtitleText}>
                                Move Into Your Dreams!
                            </Text>
                        </View>
                        <LinearGradient
                            // button Linear Gradient
                            colors={["#000565", "#111791", "#000565"]}
                            style={styles.webinterestButton}>
                            <TouchableOpacity>
                                <Text style={styles.webinterestText}>
                                    Interest starting from 8.4%*
                                </Text>
                            </TouchableOpacity>
                        </LinearGradient>

                        <View style={styles.webfeaturesContainer}>
                            <View style={styles.webfeature}>
                                <Text
                                    style={[
                                        styles.webfeatureIcon,
                                        { fontSize: 30, marginBottom: 5 },
                                    ]}>
                                    %
                                </Text>
                                <Text style={styles.webfeatureText}>Nil processing fee*</Text>
                            </View>
                            <View style={styles.webfeature}>
                                <Text
                                    style={[
                                        styles.webfeatureIcon,
                                        { fontSize: 30, marginBottom: 5 },
                                    ]}>
                                    3
                                </Text>
                                <Text style={styles.webfeatureText}>
                                    3-Step Instant approval in 30 minutes
                                </Text>
                            </View>
                            <View style={styles.webfeature}>
                                <Text
                                    style={[
                                        styles.webfeatureIcon,
                                        { fontSize: 30, marginBottom: 5 },
                                    ]}>
                                    ⏳
                                </Text>
                                <Text style={styles.webfeatureText}>Longer Tenure</Text>
                            </View>
                        </View>

                        <View style={styles.webdescription}>
                            <Text style={styles.webdescriptionText}>
                                There's more! Complete the entire process in just 3-steps that
                                isn't any more than 30 minutes.
                            </Text>
                            <TouchableOpacity>
                                <Text style={styles.weblinkText}>
                                    To know more about product features & benefits, please click
                                    here
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}

            <KeyboardAvoidingView
                style={[styles.rightCOntainer, { flex: 1 }]}
                behavior={Platform.OS === "ios" ? "padding" : null}
                keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}>
                <LoadingOverlay visible={loading} />
                <View style={{ paddingHorizontal: 16 }}>
                    <ProgressBar progress={0.05} />
                    <Text
                        style={[
                            styles.headerText,
                            { fontSize: dynamicFontSize(styles.headerText.fontSize) },
                        ]}>
                        Personal Financials
                    </Text>
                </View>

                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={styles.container}>
                        <View>
                            {otherError && (
                                <Text
                                    style={[
                                        styles.errorText,
                                        { fontSize: dynamicFontSize(styles.errorText.fontSize) },
                                    ]}>
                                    {otherError}
                                </Text>
                            )}



                            <View style={styles.formGroup}>

                                <Text
                                    style={[
                                        styles.label,
                                        { fontSize: dynamicFontSize(styles.label.fontSize) },
                                    ]}>
                                    Annual Turnover
                                </Text>
                                <CustomInput
                                    placeholder="Enter your gross monthly income"
                                    value={personalLoanDetailSlice?.data?.GrossMonthlyIncome?.toString() }
                                    error={personalLoanDetailSlice?.data?.GrossMonthlyIncomeError}
                                    keyboardType = {"numeric"}

                                    onChangeText={(e) => {
                                        UpdatePersonalLoan(-1, "GrossMonthlyIncome", e)
                                    }}
                                />
                            </View>

                            <View style={styles.formGroup}>

                                <Text
                                    style={[
                                        styles.label,
                                        { fontSize: dynamicFontSize(styles.label.fontSize) },
                                    ]}>
                                    Total Financial Asset
                                </Text>
                                <CustomInput
                                    placeholder="Enter your total investments"
                                    value={personalLoanDetailSlice?.data?.Investments?.toString()}
                                    error={personalLoanDetailSlice?.data?.InvestmentsError}
                                    keyboardType = {"numeric"}

                                    onChangeText={(e) => {
                                        UpdatePersonalLoan(-1, "Investments", e)

                                    }}
                                />

                            </View>
                            <View style={styles.formGroup}>

                                <Text
                                    style={[
                                        styles.label,
                                        { fontSize: dynamicFontSize(styles.label.fontSize) },
                                    ]}>
                                    Total Non-Financial Asset
                                </Text>
                                <CustomInput
                                    placeholder="Enter your total fixed asset"
                                    value={personalLoanDetailSlice?.data?.FixedAssets?.toString()}
                                    error={personalLoanDetailSlice?.data?.FixedAssetsError}
                                    keyboardType = {"numeric"}
                                    onChangeText={(e) => {
                                        UpdatePersonalLoan(-1, "FixedAssets", e)

                                    }}
                                />

                            </View>

                            <View style={styles.formGroup}>
                                <Text
                                    style={[
                                        styles.label,
                                        { fontSize: dynamicFontSize(styles.label.fontSize) },
                                    ]}>
                                    Do you have the existing loans ?
                                </Text>
                                <View style={{ flexDirection: "row" }}>

                                    <View>
                                        <RadioButton
                                            label={"Yes"}
                                            isSelected={personalLoanDetailSlice?.data?.IsLoanAvailable}
                                            onPress={() => { UpdatePersonalLoan(-1, "IsLoanAvailable", true) }}
                                        />
                                        <View style={{ width: 20 }} />
                                    </View>
                                    <View>
                                        <RadioButton
                                            label={"No"}
                                            isSelected={!personalLoanDetailSlice?.data?.IsLoanAvailable}
                                            onPress={() => { UpdatePersonalLoan(-1, "IsLoanAvailable", false) }}
                                        />
                                        <View style={{ width: 20 }} />
                                    </View>

                                </View>
                            </View>

                            {personalLoanDetailSlice?.data?.IsLoanAvailable &&

                                personalLoanDetailSlice.data.BorrowerExistingLoanDetails.map((element, index) => (
                                    <View key={index}>
                                        <View style={styles.formGroup}>

                                            <Text
                                                style={[
                                                    styles.label,
                                                    { fontSize: dynamicFontSize(styles.label.fontSize) },
                                                ]}>
                                                Bank Name
                                            </Text>
                                            <CustomInput
                                                placeholder="Bank Name"
                                                value={element.LoanFromBank?.toString()}
                                                error={element.LoanFromBankError}
                                                onChangeText={(e) => {
                                                    UpdatePersonalLoan(index, "LoanFromBank", e)

                                                }}
                                            />

                                        </View>
                                        <View style={styles.formGroup}>

                                            <Text
                                                style={[
                                                    styles.label,
                                                    { fontSize: dynamicFontSize(styles.label.fontSize) },
                                                ]}>
                                                Loan Type
                                            </Text>
                                            <CustomInput
                                                placeholder="Loan Type"
                                                value={element.LoanType?.toString()}
                                                error={element.LoanTypeError}
                                                onChangeText={(e) => {
                                                    UpdatePersonalLoan(index, "LoanType", e)

                                                }}
                                            />

                                        </View>
                                        <View style={styles.formGroup}>

                                            <Text
                                                style={[
                                                    styles.label,
                                                    { fontSize: dynamicFontSize(styles.label.fontSize) },
                                                ]}>
                                                Loan Amount
                                            </Text>
                                            <CustomInput
                                                placeholder="Loan Amount"
                                                value={element.LoanAmount?.toString()}
                                                error={element.LoanAmountError}
                                                keyboardType={"numeric"}

                                                onChangeText={(e) => {
                                                    UpdatePersonalLoan(index, "LoanAmount", e)

                                                }}
                                            />

                                        </View>
                                        <View style={styles.formGroup}>

                                            <Text
                                                style={[
                                                    styles.label,
                                                    { fontSize: dynamicFontSize(styles.label.fontSize) },
                                                ]}>
                                                EMI Amount
                                            </Text>
                                            <CustomInput
                                                placeholder="EMI Amount"
                                                value={element.EMI?.toString()}
                                                error={element.EmiError}
                                                keyboardType={"numeric"}
                                                onChangeText={(e) => {
                                                    UpdatePersonalLoan(index, "EMI", e)

                                                }}
                                            />

                                        </View>
                                    </View>
                                ))

                            }
                        </View>

                    </View>

                </ScrollView>

                <View style={[styles.actionContainer, styles.boxShadow]}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => {
                            GoBack(navigation);
                        }}>
                        <Text
                            style={[
                                styles.backBtnText,
                                {
                                    fontSize: dynamicFontSize(styles.backBtnText.fontSize),
                                },
                            ]}>
                            BACK
                        </Text>
                    </TouchableOpacity>
                    <LinearGradient
                        colors={["#002777", "#00194C"]}
                        style={[styles.verifyButton]}
                    >
                        <TouchableOpacity
                            onPress={() => { HandleProcced() }}
                        >
                            <Text
                                style={[
                                    styles.buttonText,
                                    {
                                        fontSize: dynamicFontSize(styles.buttonText.fontSize),
                                    },
                                ]}
                            >
                                PROCEED
                            </Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </View>

            </KeyboardAvoidingView>
        </View>
    </View>
}

export default PersonalFinance;