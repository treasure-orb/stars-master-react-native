import { handleActions } from 'redux-actions';
import { UNREAD_COUNT } from './types';

const INITIAL_STATE = {
  unreadCount: null,
};

const actionMap = {};

actionMap[UNREAD_COUNT] = (state, { payload }) => ({
  ...state,
  unreadCount: payload,
});

export default handleActions(actionMap, INITIAL_STATE);
