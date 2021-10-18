import { handleActions } from 'redux-actions';
import { SET_USER } from './types';

const INITIAL_STATE = {
  user: {},
};

const actionMap = {};

actionMap[SET_USER] = (state, { payload }) => ({
  ...state,
  user: payload,
});
export default handleActions(actionMap, INITIAL_STATE);
