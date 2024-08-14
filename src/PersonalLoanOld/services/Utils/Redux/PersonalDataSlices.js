import { createSlice } from '@reduxjs/toolkit'
import { GetPersonalData } from '../../API/CreateBorrowerLead'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { formatDate } from '../FieldVerifier'
import { STATUS } from '../../API/Constants'


const requestModel = {
    LeadName: null, //Data
    LeadEmail: null, //abc@gmail.com"
    LeadPAN: null, //WHERE1111P"
    LeadPhone: null, //0123456789",
    LeadEntityType: null, //Individual/salaried | Individual/self-employed-prof |Individual/self-employed | HUF | Proprietorship | Partnership | LLP | PrivateLimited | Society | Trust | GovernmentBody | PublicLimited | CloselyHeldCompanies | Local Authority",
    RegistrationNo: null, //String",
    CustomerTaxResidentType: null, //Resident|Non-Resident",
    Incorporation_Country: null, //IN|OTR",
    FatherName: null, //string",
    MotherName: null, //string",
    CityOfBirth: null, //Enter valid citycode",
    Community: null, //Hindu|Buddhist|Christian|Jain|Muslim|Others|Parsi|Sikh|Zorastrian",
    PlaceOfBirth: null, //IN|OTR",
    LeadCaste: null, //General|OBC|SC|ST|Other",
    LeadMaritalStatus: null, //Divorced|Married|Undisclosed|UnMarried|Unmarried and residing with family |Married and residing with family | Widow and residing without family | Widow and residing with family | Single|Widow ",
    LeadDependents: null, //digit",
    LeadDOB: null, //dd/mm/yyyy",
    EducationalQualification: null, //Code as per given master",
    InstituteName: null, //string",
    refix: null, //Mr|Mrs",
    LeadGender: null, //Male|Female|TransGender",
    FiCode: null, //Max Six Digit Number",
    Creator: null, //string",
    BranchCode: null, //Digit",
    GroupCode: null, //Max Four Digit"

    LeadNameError: null,
    LeadEmailError: null,
    FatherNameError: null,
    LeadMaritalStatusError: null,
    LeadDOBError: null,
    LeadGenderError: null,
    Leadstage: null
}


const initialState = {
    data: requestModel,
    error: null,
    loading: false
}

export const fetchPersonalDetails = createAsyncThunk(
    'content/GetPersonalData',
    async () => {
        return GetPersonalData()
    }
)

export const PersonalDataSlice = createSlice({
    name: 'PersonalDataSlice',
    initialState,
    reducers: {
        updateCurrentPersonalData(state, payload) {
            state.data = payload.payload
        },

    },
    extraReducers: (builder) => {

        builder.addCase(fetchPersonalDetails.fulfilled, (state, action) => {

            const response = action.payload
            state.loading = false
            state.error = null


            if(response.status == STATUS.ERROR){
                state.error = response.message
                return
            }

            if(response.data == null){
                return
            }

            const dob = response.data.LeadDOB != null ?  formatDate(response.data.LeadDOB) : `${new Date(null)}`

            const currentResponse = {...response.data , LeadDOB: dob}
            state.data = currentResponse

        })
        builder.addCase(fetchPersonalDetails.pending, (state, action) => {

            state.loading = true
            state.error = null
        })
        builder.addCase(fetchPersonalDetails.rejected, (state, action) => {
            
            state.error = action.error.message
            state.loading = false

        })
    },
})

export const { updateCurrentPersonalData } = PersonalDataSlice.actions
export default PersonalDataSlice.reducer