import { createAction } from 'redux-actions';
import { SET_USER } from './types';

const setUser = createAction(SET_USER);
export const setMyUserAction = (user) => (dispatch) => {
  dispatch(setUser(user));
};
