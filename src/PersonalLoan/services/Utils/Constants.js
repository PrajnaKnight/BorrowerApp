export const ALL_SCREEN = [
    "QLA",
    "primaryInfo",
    "personalInfo",
    "addressDetail",
    "employmentDetail",
    "personalFinance",
    "bankDetail",
    "loanEligibility",
    "sanctionLetter",
    "documnetUplaod",
    "eMandate",
    "loanAgreement",
    "InitiateDisbursalScreen",
    "Disbursement",
    "DisbursalAcceptedScreen"
]


export const GetCurrentScreen = (navigation, screen, excludedScreens = []) => {
    
  

    const routes = [...ALL_SCREEN]

  
    // Get the current routes from the navigation state
    const foundRoute = routes
        .filter(route => !excludedScreens.includes(route))
        .findIndex(route => route === screen);

    return foundRoute;
}




export const AADHAAR_FRONT_CODE = "AadhaarFrontBack_1509"
export const AADHAAR_BACK_CODE = "AadhaarBack_1510"
export const PAN_CODE = "PAN_1511"
export const Network_Error = "Network Error"
export const Something_Went_Wrong = "Something went wrong"
export const CAMERA_PERMISSION = "camera"
export const FILE_PERMISSION = "files"
export const LOCATION_PERMISSION = "location"
