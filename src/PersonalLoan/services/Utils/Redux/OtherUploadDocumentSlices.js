import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AADHAAR_FRONT_CODE, AADHAAR_BACK_CODE, PAN_CODE } from '../Constants'
import { DeleteUploadFiles, GetDocTypeMasterOption, GetUploadFiles, GetUploadOtherFiles } from '../../API/DocumentUpload'
import { API_RESPONSE_STATUS, STATUS } from '../../API/Constants'
import { call, put, takeLatest } from 'redux-saga/effects'


export const documentModel = {
    Name: null,
    ContentType: null,
    DocumentType: null,
    OriginalFile: null,
    DocType: null,
    DocSetTypeDisplayName: null,
    DisplayName: null,
    Error : null,



    ShowPassword: false,
    Password: null,
    EnablePassword: false,
}

const initialState = {
    loading: false,
    error: null,
    data: {
        MASTER_OPTION: [],
        OTHER_FILES: []
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
            const other = state.data.OTHER_FILES
            other[response.index] = response.data
            state.data.OTHER_FILES = other
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


            let resultArray = [];

            for (let i = 0; i < state.data.MASTER_OPTION.length; i++) {
                resultArray.push(documentModel)
            }


            

            console.log("-- starting --")
            for(let i = 0 ; i < newOtherList.length ; i++){
                const current = newOtherList[i]

                console.log("-- currenr ---")
                console.log(current)

                for(let j = 0 ; j < state.data.MASTER_OPTION.length ; j++){
                  const master = state.data.MASTER_OPTION[j]
                  console.log("-- master ---")
                  console.log(master)
                  for(let k = 0 ; k < master.DocList.length ; k++){
                    const docs = master.DocList[k]
                    console.log("-- docs ---")
                    console.log(docs)
                    console.log(current.DocType)
                    if(docs.ID == current.DocType){
                      console.log("added")
                      if(!resultArray[j].DocType)
                        {
                            resultArray[j] = current
                        }
                    }
                  }
                }
              }


            console.log(resultArray)
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

            state.loading = false
        },

        updateOtherFileError(state, payload) {
            state.error = payload.payload
            state.loading = false
        },
        updateOtherFileLoading(state, payload) {
            state.loading = payload.payload
        },




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
            docType : docType
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







export const { updateOtherDocumentAndFields, updateOtherFileLoading, updateOtherFileError, addNewOtherFile, updateOtherFile, updateMasterOptionList } = UploadOtherFileSlice.actions
export default UploadOtherFileSlice.reducer