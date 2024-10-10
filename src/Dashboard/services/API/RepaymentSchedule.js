import axios from "axios";
import { API_RESPONSE_STATUS, GetHeader, STATUS } from "../../../Common/Utils/Constant";
import { Network_Error } from "../../../PersonalLoan/services/Utils/Constants";
import { REPAYMENT_SCHEDULE } from "./Constant";

export const GetRepaymentSchedule = async (requestModel) => {

    let status, data, message;

    try {

        console.log("requestModel" +JSON.stringify(requestModel))

        const header = await GetHeader()
        console.log(header)
        let response = await axios.post(REPAYMENT_SCHEDULE, requestModel, { headers: header })
        // let response = await axios.post(CREATE_BORROWER_LEAD, '{', { headers: header })

        data = response.data

        status = response.status == 200  ? STATUS.SUCCESS : STATUS.ERROR

        console.log(response.status)
        if (status == STATUS.SUCCESS) {
            message = data.Message
        }
        else {
            message = data?.Message || "Error : Facing Problem While Fetching Repayment Schedule !"
        }

    } catch (error) {

         const errorresponseData = error?.response?.data?.Message;
         console.error('Error - CreateBorrowerLead - response data : ', errorresponseData);

         status = STATUS.ERROR
         let errorMessage = error.message

         if(errorMessage != Network_Error){
            // errorMessage = errorresponseData
            errorMessage = errorresponseData || "Error : Facing Problem While Fetching Repayment Schedule !"
         }

         message = errorMessage
         data = null

    }
  
    return API_RESPONSE_STATUS(status, data, message)


}
