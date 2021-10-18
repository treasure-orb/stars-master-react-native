import { createAction } from 'redux-actions';
import { UNREAD_COUNT } from './types';

const setUnreadCountAction = createAction(UNREAD_COUNT);
export const setUnreadCount = (count) => (dispatch) => {
  dispatch(setUnreadCountAction(count));
};
