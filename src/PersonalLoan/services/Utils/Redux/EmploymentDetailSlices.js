import { createSlice } from '@reduxjs/toolkit'
import { GetEmploymentDetails } from '../../API/SaveEmploymentDetails'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { STATUS } from '../../API/Constants'


const EmploymentDetails = {
  LeadId: null,
  ApplicantId: 0, // "Mandatory When Applicant is CoApplicant",



  EmployerType: "102", // "100|101|102|103|104|105|106|107|108|109",
  CompanyName: null, // "string",
  CompanyAddress: null,
  Designation: null, // "string",
  EmpAddress: null, // "string",
  EmpCity: null, // "Valid CityCode",
  EmpState: null, // "DL|BR|AR|AP|JK|KA|MH|NL|PY|RJ|AN|AS|CH|CT|DN|DD|GA|GJ|HR|HP|JH|KL|LD|MP|MN|ML|MZ|OR|PB|SK|TN|TG|TR|UP|UT|WB",
  EmpCountry: null, // "IN|OTR",
  EmpZipCode: null, // "string",
  JoiningDate: null, //"MM/dd/yyyy"


  Experience: null,
  OfficePhoneNo: null,
  WorkEmail: null,
  AnnualCTC: 0,

  AddressLine1: null,
  Addressline2: null,
  AddressLine1Error: null,

  OfficeLandmark: null,

  ExperienceError: null,
  CompanyNameError: null,
  DesignationError: null,
  JoiningDateError: null,
  OfficePhoneNoError: null,
  WorkEmailError: null,
  AnnualCTCError: null,
  ZipCodeError: null,
  CityError: null,
  StateError: null,

}


const SelfEmployed = {
  LeadId: null,
  IncorporationDate_CommencementDate : null,
  Pincode: null,
  RegisteredAddress: null,
  CompanyPhone: null,
  CompanyTurnOver: 0,
  BusinessName: null,
  CompanyEmail: null,
  AddressLine1 : null,
  AddressLine2 : null,
  BusinessExperience: null,
  EmpCity: null,
  EmpState : null,
  OfficeLandmark : null,


  ExperienceError : null,
  CompanyNameError : null,
  JoiningDateError: null,
  OfficePhoneNoError: null,
  WorkEmailError : null,
  AnnualCTCError : null,
  ZipCodeError : null,
  
  AddressLine1Error : null,
  
  CityError: null,
  StateError: null,
}
const requestModel = {
  Salaried: EmploymentDetails,
  SelfEmployed: SelfEmployed,
  EmploymentType: null, // "Salaried|Self Employed Professional|Self Employed",
  EmploymentCategory: null, // "Permanent|Business",
  EmploymentTypeError: null,
  EmploymentCategoryError: null,
  LeadDOB: null
}

const initialState = {
  data: requestModel,
  error: null,
  loading: false
}

export const fetchGetEmploymentDetails = createAsyncThunk(
  'content/GetEmploymentDetails',
  async () => {
    return GetEmploymentDetails()
  }
)

function reverseDateFormat(value) {
  // Check if the date string contains a "-" character
  if (!value) {
    return null
  }
  if (!value?.includes("-")) {
    return value; // Return the original string if the format is not as expected
  }

  const dateParts = value.split("-");
  if (dateParts.length === 3) {
    // Reverse the array and join with "/"
    return dateParts.reverse().join("/");
  }

  return value; // Return the original string if the format is not as expected

}
export const EmploymentDetailSlice = createSlice({
  name: 'EmploymentDetailSlice',
  initialState,
  reducers: {
    updateEmploymentType(state, payload) {
      console.log(payload.payload)
      state.data.EmploymentType = payload.payload
      state.data.EmploymentTypeError = null
    },
    updateEmploymentCategory(state, payload) {
      state.data.EmploymentCategory = payload.payload
      state.data.EmploymentCategoryError = null
    },
    updateEmploymentTypeError(state, payload) {
      state.data.EmploymentTypeError = payload.payload
    },
    updateEmploymentCategoryError(state, payload) {
      state.data.EmploymentCategoryError = payload.payload
    },
    updateSalaried(state, payload) {
      state.data.Salaried = payload.payload
    },
    updateSelfEmployed(state, payload) {
      state.data.SelfEmployed = payload.payload
    },
  },
  extraReducers: (builder) => {

    builder.addCase(fetchGetEmploymentDetails.fulfilled, (state, action) => {

      let response = action.payload
      state.loading = false
      state.error = null

      if (response.status == STATUS.ERROR) {
        state.error = response.message
        return
      }


      if (response.data == null) {
        return
      }
      let EmploymentType = response.data.EmploymentType

      let EmploymentCategory = response.data.EmploymentCategory

      delete response.data.EmploymentType;
      delete response.data.EmploymentCategory;


      state.data.EmploymentType = EmploymentType
      state.data.EmploymentCategory = EmploymentCategory

      if(EmploymentType == "Salaried"){
        const dob = response.data.JoiningDate?.includes("-") ? reverseDateFormat(response.data.JoiningDate) : response.data.JoiningDate



        let CompanyAddress = response.data.CompanyAddress
        let AddressLine1 = CompanyAddress
        let AddressLine2 = null
  
        if (CompanyAddress?.includes("|")) {
          const parts = CompanyAddress.split('|');
          AddressLine1 = parts[0]
          AddressLine2 = parts[1]
        }
        const currentResponse = { ...response.data, JoiningDate: dob, AddressLine1: AddressLine1, AddressLine2: AddressLine2 }
        state.data.Salaried = currentResponse
        console.log("===== current employment ===========")
        console.log(currentResponse)
       
        
      }
      else if (EmploymentType == "Self-Employed") {
        console.log(response.data.IncorporationDate_CommencementDate)
        let dob = response.data.IncorporationDate_CommencementDate;
        if (dob?.includes("T")) {

          // Create a Date object
          let date = new Date(dob);

          // Extract day, month, and year
          let day = date.getDate().toString().padStart(2, '0'); // Ensure two digits
          let month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based, so add 1
          let year = date.getFullYear();
          dob = `${day}/${month}/${year}`;
        }



        let CompanyAddress = response.data.RegisteredAddress
        let AddressLine1 = CompanyAddress
        let AddressLine2 = null
        let City = null
        let State = null
        let Landmark = null


        if (CompanyAddress?.includes("|")) {
          const parts = CompanyAddress.split('|');
          AddressLine1 = parts[0]
          AddressLine2 = parts[1]
          City = parts[2]
          State = parts[3]
          Landmark = parts[4]

        }
        const currentResponse = { ...response.data, IncorporationDate_CommencementDate: dob, AddressLine1: AddressLine1, AddressLine2: AddressLine2, EmpCity: City, EmpState: State, OfficeLandmark: Landmark }

        state.data.SelfEmployed = currentResponse

        console.log("===== current employment ===========")
      console.log(currentResponse)
     
      
      }
      

      state.data.LeadDOB = response.data.LeadDOB

    })
    builder.addCase(fetchGetEmploymentDetails.pending, (state, action) => {

      state.loading = true
      state.error = null


    })
    builder.addCase(fetchGetEmploymentDetails.rejected, (state, action) => {

      state.error = action.error.message
      state.loading = false

    })
  },
})


export const { updateEmploymentType, updateEmploymentCategory, updateSalaried, updateSelfEmployed, updateEmploymentTypeError, updateEmploymentCategoryError } = EmploymentDetailSlice.actions
export default EmploymentDetailSlice.reducer