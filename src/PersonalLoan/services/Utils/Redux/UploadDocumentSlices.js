import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AADHAAR_FRONT_CODE,AADHAAR_BACK_CODE, PAN_CODE } from '../Constants'
import UploadFile, { GetUploadFiles } from '../../API/DocumentUpload'
import { API_RESPONSE_STATUS, STATUS } from '../../API/Constants'
import { clearAadhaarOcr, clearPanCkyc, clearPanOcr, updateAadhaarOcr, updatePanError, updatePanLoading, updatePanOcr } from './DocumentVerificationSlices'
import { call, put, takeLatest } from 'redux-saga/effects'
import OcrAadhaarRequest from '../../API/OcrAadhaarRequest'
import OcrPanRequest from '../../API/OcrPanRequest'
import { all } from 'axios'
import { fetchGetBorrowerAddress } from './AddressDetailSlices'

const initialState = {
    loading : false,
    error : null,
    data: {
        PAN: null,
        AADHAAR: null,
        PAN_FILES: [],
        AADHAAR_FILES: [],
        OTHER_FILES : []
    }
}
export const fetchUploadedFiles = createAsyncThunk(
    'UploadFileSlice/fetchFiles',
    async () => {
        return GetUploadFiles()
    }
)
const UploadFileSlice = createSlice({
    name: 'UploadFileSlice',
    initialState,
    reducers: {

        updatePanNumber(state, payload) {
            state.data.PAN = payload.payload.toUpperCase()
        },

        updateAadhaarNumber(state, payload) {
            state.data.AADHAAR = payload.payload
        },


        updateDocumentAndFields(state, payload){

            const response = payload.payload


            if (response.bundle == null) {
                return
            }
            state.data.loading = true
           
            

            const newAadhaarList = []
            const newPanList = []
            const newOtherList = []
            
            response.bundle.UploadedFiles?.forEach(element => {
                if (element.DocType == AADHAAR_FRONT_CODE || element.DocType == AADHAAR_BACK_CODE) {
                    newAadhaarList.push({ ...element })
                }
                else if (element.DocType == PAN_CODE) {
                    newPanList.push({ ...element })
                }
                else{
                    newOtherList.push({...element })
                }
            });

            state.data.AADHAAR_FILES = newAadhaarList

            state.data.PAN_FILES = newPanList

            state.data.OTHER_FILES = newOtherList





            if (response.shouldFillTheField) {
                state.data.PAN = response.bundle.PAN;
                state.data.AADHAAR = response.bundle.Aadhar;
            }
          
            state.data.loading = false

        },

        updateError(state, payload){
            state.error = payload.payload
            state.loading = false
        },

        updateFileRemove(state, payload){
            const docId = payload.payload
            if(docId == PAN_CODE){
                state.data.PAN_FILES = [{}]
                state.data.PAN = null
            }
            else{

                let newAadharList = [...state.data.AADHAAR_FILES]
                for(let i = 0 ;i < newAadharList.length ; i++){
                    if(newAadharList[i].DocType == docId){
                        newAadharList[i] = {}
                    }
                }

                state.data.AADHAAR_FILES = newAadharList
                state.data.AADHAAR = null
            }
        },
        updateLoading(state, payload){
            console.log("stop loaidng in Upload Document Slices")
            state.loading = payload.payload
        },

        clearUploadedDocs(state, payload)
        {
            state.data = {
                PAN: null,
                AADHAAR: null,
                PAN_FILES: [],
                AADHAAR_FILES: []
            }

            state.error = null,
            state.loading = false;

        }
        
    },
 
})


function* getUploadedFiles(action){
    const apiResponse = API_RESPONSE_STATUS()
    const payload = action.payload
    const userData = yield call(GetUploadFiles);
    if (userData.status == STATUS.ERROR) {
        apiResponse.status = STATUS.ERROR
        apiResponse.message = userData.message
        return apiResponse
    }
    yield put(updateDocumentAndFields({bundle : userData.data, shouldFillTheField : payload.shouldFillTheField}))
    apiResponse.status = STATUS.SUCCESS
    return apiResponse
}


function* requestAadharOcr(action){


    console.log("------------------------- 1 phase of aadhar ocr ------------------------------")

    yield put(clearAadhaarOcr())

    const apiResponse = API_RESPONSE_STATUS()
    const userData = yield call(OcrAadhaarRequest);
    if (userData.status == STATUS.ERROR) {
        apiResponse.status = STATUS.ERROR
        apiResponse.message = userData.message
        return apiResponse
    }

    console.log("------------------------- 2 phase of aadhar ocr ------------------------------")

    let aadhar = userData.data
    if (aadhar?.length > 0) {
        let number = ""
        aadhar.forEach(element => {
            if(element?.AadhaarNumber){
                number = element.AadhaarNumber
            }
        })
        yield put(updateAadhaarNumber(number))
    }
    yield put(updateAadhaarOcr(aadhar))
    apiResponse.status = STATUS.SUCCESS
    console.log("------------------------- 3 phase of aadhar ocr ------------------------------")

    return apiResponse
}

function* requestPanOcr(action){

    console.log("------------------------- 1 phase of pan ocr ------------------------------")

    yield put(clearPanOcr())

    const apiResponse = API_RESPONSE_STATUS()
    const userData = yield call(OcrPanRequest);
    if (userData.status == STATUS.ERROR) {
        apiResponse.status = STATUS.ERROR
        apiResponse.message = userData.message
        return apiResponse
    }
    console.log("------------------------- 2 phase of pan ocr ------------------------------")

    let pan = userData.data
    if (pan?.PanNumber ?? "") {
        yield put(updatePanNumber(pan.PanNumber))
    }
    yield put(updatePanOcr(pan))
    apiResponse.status = STATUS.SUCCESS
    console.log("------------------------- 3 phase of pan ocr ------------------------------")

    return apiResponse
}

function* uploadedFiles(action){
    
    const apiResponse = API_RESPONSE_STATUS()
    const payload = action.payload
    const userData = yield call(UploadFile, payload.document, payload.DocCode);
    if (userData.status == STATUS.ERROR) {
        apiResponse.status = STATUS.ERROR
        apiResponse.message = userData.message
        return apiResponse
    }
    apiResponse.status = STATUS.SUCCESS
    return apiResponse
}


export function* fetchTheFiles(action) {

    yield put(clearUploadedDocs())
    yield put(updateLoading(true))

    yield put(clearPanOcr())
    yield put(clearPanCkyc())
    yield put(clearAadhaarOcr())
    yield put(updatePanLoading(false))
    yield put(updatePanError(null))

    yield put(fetchGetBorrowerAddress())

    const getFileResponse = yield* getUploadedFiles(action); 
    if(getFileResponse.status == STATUS.ERROR){
        yield put(updateError(getFileResponse.message))
        return
    }

    console.log("------------------------- starting ocr ------------------------------")
    yield all([
        yield* requestPanOcr(action),
        yield* requestAadharOcr(action)
    ]);
    console.log("------------------------- end ocr ------------------------------")


    // yield* requestPanOcr(action);

    // yield* requestAadharOcr(action);


    yield put(updateLoading(false))
}

export function* sagaFetchFileRunner() {
    yield takeLatest("GetAllUploadedFileANdRecords", fetchTheFiles);
}

export const sagaFetchFileRequest = (shouldFillTheField) => (
    {
        type: "GetAllUploadedFileANdRecords",
        payload: {
            shouldFillTheField : shouldFillTheField
        }
    }
);






export function* submitFile(action) {

    console.log("==================== SubmitFile ===================")
    const payload = action.payload
    yield put(updateLoading(true))

    const getUploadResponse = yield* uploadedFiles(action); 

    if(getUploadResponse.status == STATUS.ERROR){
        yield put(updateError(getUploadResponse.message))
        return
    }

    console.log("==================== START AADHAR OCR ===================")


    if(payload.DocCode == AADHAAR_FRONT_CODE || payload.DocCode == AADHAAR_BACK_CODE){
        yield* requestAadharOcr(action);

    }
    else if(payload.DocCode == PAN_CODE){
        yield* requestPanOcr(action);
    }



    const getFileResponse = yield* getUploadedFiles(action); 
    if(getFileResponse.status == STATUS.ERROR){
        yield put(updateError(getFileResponse.message))
        return
    }

    yield put(updateLoading(false))
}

export function* sagaSubmitFileRunner() {
    yield takeLatest("SubmitFileRequest", submitFile);
}

export const sagaSubmitFileRquest = (document, DocCode, shouldFillTheField = false) => (
    {
        type: "SubmitFileRequest",
        payload: {
             document, DocCode, shouldFillTheField
        }
    }
); 



export const { updatePanNumber, updateAadhaarNumber,updateDocumentAndFields, updateLoading, updateError, clearUploadedDocs,updateFileRemove} = UploadFileSlice.actions
export default UploadFileSlice.reducer