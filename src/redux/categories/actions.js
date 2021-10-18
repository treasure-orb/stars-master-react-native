import { createAction } from 'redux-actions';
import { SET_CATEGORIES } from './types';

const setCategoriesAction = createAction(SET_CATEGORIES);
export const setCategories = (categories) => (dispatch) => {
  dispatch(setCategoriesAction(categories));
};
