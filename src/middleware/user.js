import Actions, {ActionTypes} from '../actions';
import {getChecksum, setPassword} from '../storage';

/**
 * Add async methods to action
 */
const userMiddleware = () => (next) => (action) => {
  // Handle async password start action
  if (action.type === ActionTypes.PW_START) {
    action.asyncPassword = async () => {
      try {
        let isSuccess = false;
        if (typeof action.value === 'string') {
          isSuccess = await setPassword(action.value);
        }

        action.asyncDispatch(
          Actions.pwEnd({isSuccess, newChecksum: getChecksum()})
        );
      } catch (error) {
        console.log(error);
        action.asyncDispatch(Actions.pwEnd({isSuccess: false}));
      }
    };
  }

  next(action);
};

export default userMiddleware;
