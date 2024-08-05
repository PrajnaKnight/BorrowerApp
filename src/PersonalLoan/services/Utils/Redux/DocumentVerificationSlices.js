import { createSlice } from '@reduxjs/toolkit'

import { call, put, takeLatest } from 'redux-saga/effects'
import { GetCKYCData, GetCKYCID, GetPanComprehensiveData } from '../../API/OcrPanRequest'
import { STATUS } from '../../API/Constants'
import SubmitAadhaarOtpRequest from '../../API/SubmitAadhaarOtpRequest'


export const sampleDocumentData = {
    LeadDOB: null,
    LeadName: null,
    FatherName: null,
    LeadEmail: null,
    LeadGender: null,
    LeadAddressLine1: null,
    LeadAddressLine2: null,
    LeadPostalCode: null,
    LeadState: null,
    LeadCity: null
}


const initialState = {
    data: {
        PanOcr: null,
        PanComprehensive: null,
        PanCkyc: null,
        AadhaarOcr: null,
        AadhaarEkyc: null,
        Cibil: null
    },
    panMessage: null,
    panStatus : null,
    aadharError : null,
    panLoading: false,
    aadharLoading : false
}


export const DocumentVerificationSlices = createSlice({
    name: 'DocumentVerificationSlice',
    initialState,
    reducers: {
        updatePanOcr(state, payload) {
            const data = payload.payload
            if (data == null) {
                state.data.PanOcr = sampleDocumentData
                return
            }

            state.data.PanOcr = {
                ...sampleDocumentData,
                LeadName: data.Name,
                FatherName: data.FatherName,
                LeadDOB: data.DateOfBirth,
            }


        },
        updatePanComprehensive(state, payload) {

            const panComprihensiveDataReponse = payload.payload
            if (panComprihensiveDataReponse == null) {
                state.data.PanComprehensive = sampleDocumentData
                return
            }
            let gender = null
            if (panComprihensiveDataReponse.Gender == "M") {
                gender = "Male"
            }
            else if (panComprihensiveDataReponse.Gender == "F") {
                gender = "Female"
            }


            state.data.PanComprehensive = {
                ...sampleDocumentData,
                LeadDOB: panComprihensiveDataReponse.DateOfBirth,
                LeadName: panComprihensiveDataReponse.FullName,
                LeadGender: gender,
                LeadAddressLine1: panComprihensiveDataReponse.AddressLine1,
                LeadAddressLine2: panComprihensiveDataReponse.AddressLine2,
                LeadPostalCode: panComprihensiveDataReponse.Pincode,
                LeadState: panComprihensiveDataReponse.State,
                LeadCity: panComprihensiveDataReponse.City
            }

           
        },
        updatePanCkyc(state, payload) {

            const data = payload.payload
            if (data == null) {
                state.data.PanCkyc = sampleDocumentData
                return
            }
            let gender = null
            if (data.Gender == "MALE") {
                gender = "Male"
            }
            else if (data.Gender == "FEMALE") {
                gender = "Female"
            }


            state.data.PanCkyc = {
                ...sampleDocumentData,
                LeadDOB: data.DOB,
                LeadName: data.FullName,
                LeadGender: gender,
                FatherName: data.FatherFirstName || data.FatherFullname,
                LeadAddressLine1: data.PermLine1,
                LeadAddressLine2: data.PermLine2,
                LeadPostalCode: data.PermPin,
                LeadState: data.PermState,
                LeadCity: data.PermCity,
                LeadEmail : data.Email
            }

            state.panMessage = data.message
            state.panStatus = STATUS.SUCCESS
        },

        updateAadhaarOcr(state, payload) {
            const aadharOcrArray = payload.payload
            if (aadharOcrArray == null || aadharOcrArray.length == 0) {
                state.data.AadhaarOcr = sampleDocumentData
                return
            }

            let dataset = {...sampleDocumentData}

            aadharOcrArray.forEach(element => {
                if(!dataset.LeadDOB || element.DateOfBirth){
                    dataset = {...dataset, LeadDOB : element.DateOfBirth}
                }
                if(!dataset.LeadName || element.Name){
                    dataset = {...dataset, LeadName : element.Name}
                }
                if(!dataset.LeadAddressLine1 || element.Address){
                    dataset = {...dataset, LeadAddressLine1 : element.Address}
                }
                if(!dataset.LeadCity || element.City){
                    dataset = {...dataset, LeadCity : element.City}
                }
                if(!dataset.LeadState || element.State){
                    dataset = {...dataset, LeadState : element.State}
                }
                if(!dataset.LeadGender ||  element.Gender){
                    dataset = {...dataset, LeadGender : element.Gender}
                }

                if(!dataset.LeadPostalCode || element.Pincode){
                    dataset = {...dataset, LeadPostalCode : element.Pincode}
                }
            });

            console.log("============ AADHAR OCR FINAL RESPONSE ================")
            console.log(dataset)
           state.data.AadhaarOcr = dataset
        },
        updateAadhaarEkyc(state, payload) {

            const aadhaarKyc = payload.payload
            if (aadhaarKyc == null) {
                state.data.AadhaarEkyc = sampleDocumentData
                return
            }


            const addressLine1 = `${aadhaarKyc.HouseName || ""} ${aadhaarKyc.LocalityName || aadhaarKyc.PostOfficeName || ""} ${aadhaarKyc.SubDistrictName || ""} ${aadhaarKyc.PinCode || ""} ${aadhaarKyc.StateName || aadhaarKyc.VillageTownCityName || ""} ${aadhaarKyc.CountryName}`

            let gender = null
            if (aadhaarKyc.Gender == "M") {
                gender = "Male"
            }
            else if (aadhaarKyc.Gender == "F") {
                gender = "Female"
            }

            state.data.AadhaarEkyc = {
                ...sampleDocumentData,
                LeadDOB: aadhaarKyc.DateOfBirth,
                LeadName: aadhaarKyc.ResidentName,
                LeadGender: gender,
                LeadAddressLine1: addressLine1,
                LeadPostalCode: aadhaarKyc.PinCode,
                LeadState: aadhaarKyc.StateName,
                LeadCity: aadhaarKyc.DistrictName
            }
        },

        updateCibil(state, payload) {
            state.data.Cibil = payload.payload
        },

        updatePanError(state, payload) {
            state.panMessage = payload.payload
            state.panStatus = STATUS.ERROR
            state.panLoading = false
        },
        updateAadhaarError(state, payload) {
            state.aadharError = payload.payload
            state.aadharLoading = false
        },
        updatePanLoading(state, payload) {
            state.panLoading = payload.payload
        },
        updateAadhaarLoading(state, payload) {
            state.aadharLoading = payload.payload
        },

        clearAadhaarOcr(state){
            state.data.AadhaarOcr = null
        },
        clearPanOcr(state){
            state.data.PanOcr = null
        },
        clearPanCkyc(state){
            state.data.PanComprehensive = null
            state.data.PanCkyc = null
            state.panMessage = null
            state.panStatus = null
        },
        clearAadhaarCkyc(state){
            state.aadharError = null
            state.data.AadhaarEkyc = null
        }
    }
})


function* startPanCkyc(action) {

    const panNumber = action.payload

    yield put(updatePanLoading(true))

    yield put(clearPanCkyc())

    const userData = yield call(GetPanComprehensiveData, panNumber);
    if (userData.status == STATUS.ERROR) {
        yield put(updatePanError(userData.message))
        return
    }

    const panComprihensiveDataReponse = userData.data?.Data


    yield put(updatePanComprehensive(panComprihensiveDataReponse))


    const dob = panComprihensiveDataReponse?.DateOfBirth

    const getCkcIdResponse = yield call(GetCKYCID, panNumber);
    if (getCkcIdResponse.status == STATUS.ERROR) {
        yield put(updatePanError(getCkcIdResponse.message))
        return
    }

    const ckycid = getCkcIdResponse.data?.CKycId

    const getCkcDataResponse = yield call(GetCKYCData, ckycid, dob);
    if (getCkcDataResponse.status == STATUS.ERROR) {
        yield put(updatePanError(getCkcDataResponse.message))

        return
    }

    const getCkycData = getCkcDataResponse.data



    yield put(updatePanCkyc(getCkycData))

    yield put(updatePanLoading(false))


}



function* startAadhaarEkyc(action) {


    const {aadharNumber, OTP, transactionID} = action.payload

    yield put(updateAadhaarLoading(true))

    yield put(clearAadhaarCkyc())

    const userData = yield call(SubmitAadhaarOtpRequest, aadharNumber, OTP, transactionID);
    if (userData.status == STATUS.ERROR) {
        yield put(updateAadhaarError(userData.message))
        return
    }


    yield put(updateAadhaarEkyc(userData.data?.ResidentDetails))
    

    yield put(updateAadhaarLoading(false))


}


export function* doPanCkyc() {
    yield takeLatest("PAN_CKYC", startPanCkyc);
}

export function* doAadhaarEkyc() {
    yield takeLatest("AADHAAR_CKYC", startAadhaarEkyc);
}
export const executePanCkyc = (panNumber) => (
    {
        type: "PAN_CKYC",
        payload: panNumber
    }
);
export const executeAadhaarEkyc = (aadharNumber, OTP, transactionID) => (
    {
        type: "AADHAAR_CKYC",
        payload: {
            aadharNumber,
            OTP,
            transactionID
        }
    }
);

// dispatch(executePanCkyc(panNumber));


export const { 
    updatePanOcr, 
    updatePanComprehensive, 
    updatePanCkyc, 
    updateAadhaarOcr, 
    updateAadhaarEkyc, 
    updateCibil, 
    updatePanError, 
    updateAadhaarError, 
    updatePanLoading, 
    updateAadhaarLoading,
    clearAadhaarOcr,
    clearPanOcr,
    clearAadhaarCkyc,
    clearPanCkyc
 } = DocumentVerificationSlices.actions
export default DocumentVerificationSlices.reducer