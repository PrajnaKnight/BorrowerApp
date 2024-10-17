import { GetStoreAuthToken } from "../../PersonalLoan/services/LOCAL/AsyncStroage"

export const BASE_URL = "https://bankofproductlosapi.azurewebsites.net"
// https://demolosapi-qa.azurewebsites.net
// https://bankofproductlosapi.azurewebsites.net

export const PAYMENT_BASE_URL = "https://demo-payment-api.knightfintech.com"

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

