import { combineReducers } from 'redux';
import home from './home/reducer';
import message from './message/reducer';
import me from './me/reducer';
import liveStream from './liveStream/reducer';
import categories from './categories/reducer';

const appReducer = combineReducers({
  home,
  message,
  me,
  liveStream,
  categories,
});

const rootReducer = (state, action) => {
  return appReducer(state, action);
};

export default rootReducer;
