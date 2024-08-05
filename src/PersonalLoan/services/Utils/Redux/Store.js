import { configureStore, combineReducers, getDefaultMiddleware } from "@reduxjs/toolkit"
import NavigationSlices from "./NavigationSlices"
import LeadStageSlices from "./LeadStageSlices"
import LoanAskSlices from "./LoanAskSlices"
import PersonalDeatilSlices from "./PersonalDataSlices"
import EmploymentDetailSlices from "./EmploymentDetailSlices"
import AddressDetailSlices from "./AddressDetailSlices"
import BankDetailSlices from "./BankDetailSlices"
import DisbursalInfoSlices from "./DisbursalInfo"
import ExtraStageSlice from "./ExtraSlices"
import DocumentVerificationSlices, { doAadhaarEkyc } from "./DocumentVerificationSlices"
import UploadDocumentSlices, { sagaFetchFileRunner, sagaSubmitFileRunner } from "./UploadDocumentSlices"
import UploadOtherFileSlice, { sagaFetchOtherFileRunner, sagaDeleteFileRunner } from "./OtherUploadDocumentSlices"


import createSagaMiddleware from "@redux-saga/core";
import { doPanCkyc } from "./DocumentVerificationSlices"
import { FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER } from 'redux-persist';
import { all } from "redux-saga/effects"

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    navigationSlice: NavigationSlices,
    leadStageSlice: LeadStageSlices,
    loanAskSlice: LoanAskSlices,
    personalDetailSlice: PersonalDeatilSlices,
    employmentDetailSlices: EmploymentDetailSlices,
    addressDetailSlices: AddressDetailSlices,
    bankDetailSlices: BankDetailSlices,
    documentVerificationSlices: DocumentVerificationSlices,
    uploadDocumentSlices : UploadDocumentSlices,
    disbursalInfoSlices : DisbursalInfoSlices,
    otherDocumentSlices : UploadOtherFileSlice,
    extraStageSlice : ExtraStageSlice
  },

  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }).concat([sagaMiddleware])
 
})

function* rootSaga() {
  yield all([
      doPanCkyc(),
      doAadhaarEkyc(),
      sagaSubmitFileRunner(),
      sagaFetchFileRunner(),
      sagaFetchOtherFileRunner(),
      sagaDeleteFileRunner()
  ]);
}

sagaMiddleware.run(rootSaga)


export default store