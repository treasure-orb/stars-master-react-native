import { createAction } from 'redux-actions';
import { SET_GIFTS, SET_ROOMS } from './types';

const setLiveStreamRoomsAction = createAction(SET_ROOMS);
const setGiftsAction = createAction(SET_GIFTS);

export const setLiveStreamRooms = (rooms) => (dispatch) => {
  dispatch(setLiveStreamRoomsAction(rooms));
};

export const setGifts = (gifts) => (dispatch) => {
  dispatch(setGiftsAction(gifts));
};
