import { handleActions } from 'redux-actions';
import { SET_CATEGORIES } from './types';

const INITIAL_STATE = {
  categories: [],
};

const actionMap = {};

actionMap[SET_CATEGORIES] = (state, { payload }) => ({
  ...state,
  categories: payload,
});

export default handleActions(actionMap, INITIAL_STATE);
