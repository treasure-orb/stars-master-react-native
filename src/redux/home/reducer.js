import { handleActions } from 'redux-actions';
import { KEYWORD } from './types';

const INITIAL_STATE = {
  keyword: '',
};

const actionMap = {};

actionMap[KEYWORD] = (state, { payload }) => ({
  ...state,
  keyword: payload,
});

export default handleActions(actionMap, INITIAL_STATE);
