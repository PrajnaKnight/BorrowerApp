import { configureStore } from '@reduxjs/toolkit';
import leadStageReducer from '../PersonalLoan/services/Utils/Redux/LeadStageSlices';
import extraReducer from '../PersonalLoan/services/Utils/Redux/ExtraSlices';

const store = configureStore({
  reducer: {
    leadStage: leadStageReducer,
    extra: extraReducer,
    // Add any other reducers here
  },
});

export default store;