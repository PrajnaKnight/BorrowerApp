import { GetStoreAuthToken } from "../../PersonalLoan/services/LOCAL/AsyncStroage"

export const BASE_URL = "https://demolosapi-qa.azurewebsites.net"
export const BASE_LMS_URL = "https://demolmsapi-qa.azurewebsites.net"

// https://demolosapi-qa.azurewebsites.net
// https://bankofproductlosapi.azurewebsites.net


export const STATUS  = {
    SUCCESS : "SUCCESS",
    ERROR : "ERROR",
}


export const API_RESPONSE_STATUS = (status, data, message) => {
    console.log('status = ', status)
    console.log('data = ', data)
    console.log('message = ', message)
    return {
        status : status,
        data : data,
        message : message,
    }
}

export const GetHeader = async () => {

    const Auth_TOKEN = await GetStoreAuthToken()
    return {
        'AUTHTOKEN': Auth_TOKEN,
        'Content-Type': 'application/json'
      };
}

