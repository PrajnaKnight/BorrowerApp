import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native'; // Adjust based on your navigation setup
import { GetCurrentScreen } from '../services/Utils/Constants';

const useJumpTo = (currentScreen, nextScreen, navigation) => {
    
    const nextJumpTo = useSelector((state) => state.leadStageSlice);

    let jumpTo = nextJumpTo.jumpTo;
    let screenName = nextJumpTo.screenName;
    let thingsToRemove = nextJumpTo.thingsToRemove

    
    if (screenName === currentScreen) {
        jumpTo = GetCurrentScreen(navigation, currentScreen, thingsToRemove) + 1;
        screenName = nextScreen;
      
    } else {
        jumpTo = GetCurrentScreen(navigation, screenName, thingsToRemove);
        
    }

    


    return {jumpTo, screenName};
};

export default useJumpTo;