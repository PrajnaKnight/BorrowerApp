import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AADHAAR_FRONT_CODE, AADHAAR_BACK_CODE, PAN_CODE } from '../Constants'
import { DeleteUploadFiles, GetDocTypeMasterOption, GetUploadFiles, GetUploadOtherFiles } from '../../API/DocumentUpload'
import { API_RESPONSE_STATUS, STATUS } from '../../API/Constants'
import { call, put, takeLatest } from 'redux-saga/effects'


export const documentModel = {
    Name: null,
    ContentType: null,
    DocumentType: null,
    OriginalFile: {},
    DocType: null,
    DocSetTypeDisplayName: null,
    DisplayName: null,
    Error: null,
    ShowPassword: false,
    Password: null,
    EnablePassword: false,
}

const initialState = {
    loading: false,
    error: null,
    data: {
        MASTER_OPTION: [],
        OTHER_FILES: {},
        lastDocType: null,
        lastDisplayName: null,
        selectedDoc: {
            master : null,
            child : null
        }
    }
}

const UploadOtherFileSlice = createSlice({
    name: 'UploadOtherFileSlice',
    initialState,
    reducers: {


        addNewOtherFile(state, payload) {
            const other = state.data.OTHER_FILES
            other.push(payload.payload)
            state.data.OTHER_FILES = other
        },
        updateOtherFile(state, payload) {
            const response = payload.payload
            state.data.OTHER_FILES = response
        },

        updateMasterSelected(state, payload) {
            const newMasterKey = payload.payload
            if(state.data.OTHER_FILES.hasOwnProperty(newMasterKey)){
                const newChildKey = Object.keys(state.data.OTHER_FILES[newMasterKey])
                state.data.selectedDoc = {master : newMasterKey, child : newChildKey[0] }
            }
        
        },

        updateChildSelected(state, payload) {
            const newChildKey = payload.payload
            state.data.selectedDoc = {...state.data.selectedDoc,child : newChildKey }
        },

        updateOtherDocumentAndFields(state, payload) {


            const response = payload.payload


            if (response.bundle == null) {
                return
            }



            let newOtherList = []

            response.bundle.UploadedFiles?.forEach(element => {
                if (element.DocType == AADHAAR_FRONT_CODE || element.DocType == AADHAAR_BACK_CODE) { }
                else if (element.DocType == PAN_CODE) { }
                else {
                    newOtherList.push({ ...element })
                }
            });


            let resultArray = {};

            for (let i = 0; i < state.data.MASTER_OPTION.length; i++) {
                const master = state.data.MASTER_OPTION[i]

                let resultArrayMaster = {}
                
                for (let j = 0; j < master.DocList.length; j++) {

                    
                    let key = master.DocList[j].value
                    resultArrayMaster[key] = {
                        Id: parseInt(master.DocList[j].ID),
                        IsSelected: false,
                        Name: null,
                        Base64: null,
                        Password: null,
                        EnablePassword: false
                    }
                }

                resultArrayMaster = {...resultArrayMaster, MandatoryFlag : master.MandatoryFlag}
                resultArray[master.DoctypeType] = resultArrayMaster

            }

            

            for (let i = 0; i < state.data.MASTER_OPTION.length; i++) {

                const master = state.data.MASTER_OPTION[i]

                let resultArrayMaster = { ...resultArray[master.DoctypeType] }



                for (let j = 0; j < newOtherList.length; j++) {

                    if (newOtherList[j].DocSetTypeDisplayName == master.DoctypeType) {
                        resultArrayMaster[newOtherList[j].DisplayName] = {
                            Id: parseInt(newOtherList[j].DocType),
                            IsSelected: false,
                            Name: newOtherList[j].Name,
                            Base64: newOtherList[j].OriginalFile,
                            Password: newOtherList[j].Password,
                            EnablePassword: newOtherList[j].Password ? true : false
                        }
                    }
                }


                resultArray[master.DoctypeType] = resultArrayMaster


            }






            if(Object.keys(resultArray).length > 0){
                if(state.data.selectedDoc.master == null){
                    let masterKey = Object.keys(resultArray)[0]
                    let childKey = Object.keys(resultArray[masterKey])[0]
                    state.data.selectedDoc = { child :  childKey,  master : masterKey}
                }
                else if(state.data.selectedDoc.child == null){
                    let master = state.data.selectedDoc.master
                    let childKey = Object.keys(resultArray[master])[0]
                    state.data.selectedDoc = {... state.data.selectedDoc, child :  childKey}
                }
            }

           

       



            state.data.OTHER_FILES = resultArray

            state.loading = false

        },


        updateMasterOptionList(state, payload) {


            const convertedData = payload.payload.data.map(docType => ({
                DoctypeType: docType.DoctypeType,
                MandatoryFlag: docType.MandatoryFlag,
                DocList: docType.DocList.map(doc => ({
                    label: doc.Value,
                    value: doc.Value,
                    ID: doc.ID
                }))
            }));


            state.data.MASTER_OPTION = convertedData

        },

        updateLastDocs(state, payload) {
            state.data.lastDisplayName = payload.payload
            
        },
        updateOtherFileError(state, payload) {
            state.error = payload.payload
            state.loading = false
        },
        updateOtherFileLoading(state, payload) {
            state.loading = payload.payload
        },

        updateCleanAll(state, payload) {
            state.data.MASTER_OPTION = []
            state.data.OTHER_FILES = {}
            state.data.lastDocType = null
            state.data.lastDisplayName = null
            state.data.selectedDoc = {
                master : null,
                child : null
            }
        }



    },

})



function* getUploadedOtherFiles(action) {
    const apiResponse = API_RESPONSE_STATUS()
    const userData = yield call(GetUploadOtherFiles);
    if (userData.status == STATUS.ERROR) {
        apiResponse.status = STATUS.ERROR
        apiResponse.message = userData.message
        return apiResponse
    }
    yield put(updateOtherDocumentAndFields({ bundle: userData.data }))
    apiResponse.status = STATUS.SUCCESS
    return apiResponse
}

function* deleteFile(action) {

    yield put(updateOtherFileError(null))
    yield put(updateOtherFileLoading(true))

    const docType = action.payload.docType


    const deleteResponse = yield call(DeleteUploadFiles, docType);
    if (deleteResponse.status == STATUS.ERROR) {
        yield put(updateOtherFileError(deleteResponse.message))
        return
    }

    const getFileResponse = yield* getUploadedOtherFiles(action);
    if (getFileResponse.status == STATUS.ERROR) {
        yield put(updateOtherFileError(getFileResponse.message))
        return
    }

    yield put(updateOtherFileLoading(false))
}


function* getMasterDocList(action) {
    const apiResponse = API_RESPONSE_STATUS()
    const userData = yield call(GetDocTypeMasterOption);
    if (userData.status == STATUS.ERROR) {
        apiResponse.status = STATUS.ERROR
        apiResponse.message = userData.message
        return apiResponse
    }
    yield put(updateMasterOptionList({ data: userData.data }))
    apiResponse.status = STATUS.SUCCESS
    return apiResponse
}


export function* fetchTheOtherFiles(action) {
    yield put(updateOtherFileLoading(true))
    const getMasterResponse = yield* getMasterDocList(action);
    if (getMasterResponse.status == STATUS.ERROR) {
        yield put(updateOtherFileError(getMasterResponse.message))
        return
    }
    const getFileResponse = yield* getUploadedOtherFiles(action);
    if (getFileResponse.status == STATUS.ERROR) {
        yield put(updateOtherFileError(getFileResponse.message))
        return
    }

    yield put(updateOtherFileLoading(false))
}


// export function* fetchTheMasterOption(action) {
//     yield put(updateOtherFileLoading(true))
//     const getFileResponse = yield* getMasterDocList(action);
//     if (getFileResponse.status == STATUS.ERROR) {
//         yield put(updateOtherFileError(getFileResponse.message))
//         return
//     }

//     yield put(updateOtherFileLoading(false))
// }

export function* sagaFetchOtherFileRunner() {
    yield takeLatest("GetAllUploadedOtherFileANdRecords", fetchTheOtherFiles);
}

export const sagaFetchOtherFileRequest = () => (
    {
        type: "GetAllUploadedOtherFileANdRecords",
    }
);


export function* sagaDeleteFileRunner() {
    yield takeLatest("DeleteFileRunner", deleteFile);
}

export const sagaDeleteFileRequest = (docType) => (
    {
        type: "DeleteFileRunner",
        payload: {
            docType: docType
        }
    }
);


// export function* sagaFetchMaterOptionRunner() {
//     yield takeLatest("GetAllFetchTheMasterOption", fetchTheMasterOption);
// }

// export const sagaFetchMasterOptionRequest = () => (
//     {
//         type: "GetAllFetchTheMasterOption",

//     }
// );







export const { updateOtherDocumentAndFields, updateOtherFileLoading, updateOtherFileError, addNewOtherFile, updateOtherFile, updateMasterOptionList, updateMasterSelected, updateLastDocs , updateChildSelected, updateCleanAll} = UploadOtherFileSlice.actions
export default UploadOtherFileSlice.reducer




{

    Proof_Of_Address: {
        Aadhar_Card: {
            Id: null;
            IsSelected: false;
            Name: null;
            Base64: null;
            Password: null;
            EnablePassword: false
        }
    }
}