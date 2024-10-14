import { BASE_URL, STATUS, API_RESPONSE_STATUS, GetHeader } from "../../../Common/Utils/Constant"

import { GetStoreAuthToken } from "../LOCAL/AsyncStroage"

export const CREATE_BORROWER_LEAD = `${BASE_URL}/CreateBorrowerLead`
export const GET_LEADS_DATA = `${BASE_URL}/GetleadsData`

export const LOAD_ASK_DETAILS = `${BASE_URL}/SaveBorrowerLoanAskDetails`
export const GET_LOAD_ASK_DETAILS = `${BASE_URL}/Getloanask`

export const LOAD_PURPOSE = `${BASE_URL}/GetLoanPurpose`

export const BORROWER_ADDRESS = `${BASE_URL}/AddBorrowerLeadAddress`
export const GET_BORROWER_ADDRESS = `${BASE_URL}/GetLeadAddress`

export const GET_CITY_AND_STATE = `${BASE_URL}/GetCityAndStateByPincode`

export const SAVE_EMPLOYEMENT_DETAILS = `${BASE_URL}/SaveBorrowerEmploymentDetail`
export const GET_EMPLOYEMENT_DETAILS = `${BASE_URL}/GetEmploymentDetails`

export const SAVE_BANK_ACC_DEATILS = `${BASE_URL}/SaveBorrowerBankAcctDetails`
export const GET_BANK_ACC_DEATILS = `${BASE_URL}/GetBankDetails`
export const VERIFY_BANK = `${BASE_URL}/VerifyBank`

export const GET_LOGIN_OTP_BY_PHONE_NUMBER = `${BASE_URL}/GetOTPByPhoneNumber`
export const VERIFY_LOGIN_OTP = `${BASE_URL}/GetOTPVarification`
export const SET_LEAD_PRODUCT = `${BASE_URL}/SetBorrowerLeadProduct`
export const GET_MARITAL_STATUS = `${BASE_URL}/GetMaritalStatus`
export const GET_EMPLOYEMENT_TYPE = `${BASE_URL}/GetEmployementType`
export const GET_OCCUPATION_TYPE = `${BASE_URL}/GetOccupationType`
export const SUBMIT_BORROWER_LOAN_APPLICATION_ASYNC = `${BASE_URL}/SubmitBorrowerLoanApplicationAsync`
export const DELETE_UPLOAD_FILES = `${BASE_URL}/DeleteUploadFiles`

export const UploadDocument = `${BASE_URL}/UploadBorrowerFiles`
export const GetUploadDocument = `${BASE_URL}/GetUploadDocs`
export const GetUploadOtherDocument = `${BASE_URL}/GetUploadDoc`
export const GetDocTypeMaster = `${BASE_URL}/GetDocTypeMaster`

export const GET_BRANCH_NAME_BY_ISFC_CODE = `${BASE_URL}/GetBranchNameByISFCCode`
export const GET_Quick_Eligibility_Detail_info = `${BASE_URL}/GetQuickEligibilityDetailinfo`
export const SEND_AADHAAR_OTP_REQUEST = `${BASE_URL}/SendAadharOtpReq`
export const SUBMIT_AADHAAR_OTP_REQUEST = `${BASE_URL}/SubmitAadharOTPRequest`
export const OCR_AADHAAR_REQUEST = `${BASE_URL}/OCRAdhaarRequest`
export const OCR_PAN_REQUEST = `${BASE_URL}/OCRPanRequest`

export const GET_LOOK_UP = `${BASE_URL}/GetLookUp`

export const GetBREEligibility = `${BASE_URL}/GetBREEligibility`
export const SaveBREEligibility = `${BASE_URL}/SaveBREEligibility`

export const GET_PAN_COMPERHENSIVE_DATA = `${BASE_URL}/GetPanComprehensiveData`

export const GET_CKYC_ID = `${BASE_URL}/GetCKYCID`

export const GET_CKYC_Data = `${BASE_URL}/GetCKYCData`

export const SAVE_PROCEED_STAGE = `${BASE_URL}/SaveProceedStage`

export const BORROWER_SACTION = `${BASE_URL}/BorrowerSaction`

export const GET_DOC_TYPE = `${BASE_URL}/GetDocType`

export const GET_DOC_SUB_SET_TYPE = `${BASE_URL}/GetDocSubSetType`

export const E_SIGN_EXTERNAL = `${BASE_URL}/ESignExternal`

export const GET_SANCTION_LETTER_DATA = `${BASE_URL}/GetSanctionLetterData`

export const SENCTION_HTML_PAGE = `${BASE_URL}/GetSanctionLetterPDF`

export const GET_COMPANY_DETAILS = `${BASE_URL}/GetCompanyDetails`



export const DOWNLOAD_E_SIGNED_DOCUMENT = `${BASE_URL}/DownloadESignedDocument`

export const GET_LOAN_AGREEMENT_LETTER = `${BASE_URL}/GetLoanAgreementLetterPDF`

export const GET_LOAN_AGREEMENT_LETTER_HTML = `${BASE_URL}/GetLoanAgreementLetter`


export const SUBMIT_LOCATION = `${BASE_URL}/SaveGeoLocationData`

export const GET_DISBURSAL_DATA = `${BASE_URL}/GetDisbursalData`

export const CREATE_LA = `${BASE_URL}/CreateLA`


export const GET_FUND_OUT_DATA = `${BASE_URL}/GetFundOutData`

export const BANK_FUND_OUT = `${BASE_URL}/BankFundout`

export const GET_CONSUMER_SOFT_PULL_DATA_BY = `${BASE_URL}/GetConsumerSoftpullDataBy`

export const SAVED_LEAD_STAGE = `${BASE_URL}/SaveLeadStage`


export const GET_E_SIGN_LOAN_AGREEMENT = `${BASE_URL}/GetEsignLoanAgreement`


export const DeleteBankDetails = `${BASE_URL}/DeleteBankDetails`

export const SAVE_BORROWER_PERSONAL_FINAL_DETAIL = `${BASE_URL}/SaveBorrowerPersonalFinaDetail`

export const GET_BORROWER_PERSONAL_FINAL_DETAIL = `${BASE_URL}/GetBorrowerPersonalFinaDetail`

export const DELETE_USER = `${BASE_URL}/DeleteLeadPhone`

export const RedirectUrl =  "www.knightfintech.com"

export { STATUS, API_RESPONSE_STATUS, GetHeader };
