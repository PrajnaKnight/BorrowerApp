import AsyncStorage from '@react-native-async-storage/async-storage';


const LEAD_ID = "LEAD_ID"
const PHONE_NUMBER = "PHONE_NUMBER"
const Auth_TOKEN = "Auth_TOKEN"
const LOAN_ASK_AMOUNT = "LOAN_ASK_AMOUNT"
const USER_INFO = "USER_INFO"
const APPLICANT_ID = "APPLICANT_ID"
const TOKEN_VALID_TILL = "TokenValidTill"
const USER_DOB = "USER_DOB"
const USER_AADHAAR = "USER_AADHAAR"
const USER_PAN = "USER_PAN"
const StoreInStorage = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, `${value}`);
        console.log('Data stored successfully');
    } catch (error) {
        console.error('Error storing data:', error);
    }
};

const FetchFromStorage = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);
        return value;
    
    } catch (error) {
        console.error('Error retrieving data:', error);
    }
    return null
};

export const StoreLeadId = async (value) => {
    await StoreInStorage(LEAD_ID, value)
}

export const GetLeadId = async () => {
    return await FetchFromStorage(LEAD_ID)
}

export const StoreBorrowerPhoneNumber= async (value) => {
    await StoreInStorage(PHONE_NUMBER, value)
}

export const GetBorrowerPhoneNumber = async () => {

    const number = await FetchFromStorage(PHONE_NUMBER)
    return  number && number!="null" ? number : null
}


export const StoreAuthToken= async (value) => {
    await StoreInStorage(Auth_TOKEN, value)
}

export const GetStoreAuthToken= async () => {
    return await FetchFromStorage(Auth_TOKEN)
}


export const StoreLoanAskAmmount= async (value) => {
    await StoreInStorage(LOAN_ASK_AMOUNT, value)
}

export const GetLoanAskAmmount= async () => {
    return await FetchFromStorage(LOAN_ASK_AMOUNT)
}

export const StoreApplicantId= async (value) => {
    await StoreInStorage(APPLICANT_ID, value)
}

export const GetApplicantId= async () => {
    return await FetchFromStorage(APPLICANT_ID)
}


export const StoreTokenValidity= async (value) => {
    await StoreInStorage(TOKEN_VALID_TILL, value)
}

export const GetTokenValidity= async () => {
    const userInfo = await FetchFromStorage(TOKEN_VALID_TILL)
    return userInfo 
}



export const StoreUserDob= async (value) => {
    await StoreInStorage(USER_DOB, value)
}

export const GetUserDob= async () => {
    const userInfo = await FetchFromStorage(USER_DOB)
    return userInfo 
}

export const StoreUserAadhaar= async (value) => {
    await StoreInStorage(USER_AADHAAR, value)
}

export const GetUserAadhaar= async () => {
    const userInfo = await FetchFromStorage(USER_AADHAAR)
    return userInfo 
}


export const StoreUserPan= async (value) => {
    await StoreInStorage(USER_PAN, value)
}

export const GetUserPan= async () => {
    const userInfo = await FetchFromStorage(USER_PAN)
    return userInfo 
}