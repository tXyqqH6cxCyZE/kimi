import * as constants from "./actionTypes.js";
import { fromJS } from "immutable";
import { combineReducers } from "redux";

const defaultState = fromJS({
  list: [],
  userInfo: {},
  companyInfo: {},
  isShowNav: true,
  isShowContent: true,
  kimmyTabs: [],
  showLoading: false,
  kimmyAuthority: [], //粮票的权限
});
const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case constants.GET_ASYNC_DATA:
      return state.set("list", action.data);
    case constants.GET_USER_INFO:
      return state.set("userInfo", action.data);
    case constants.GET_COMPANY_INFO:
      return state.set("companyInfo", action.data);
    case constants.CHANGE_CONTENT_STATUS:
      return state.set("isShowContent", action.data);
    case constants.CHANGE_NAV_STATUS:
      return state.set("isShowNav", action.data);
    case constants.GET_KIMMY_TABS:
      return state.set("kimmyTabs", action.data);
    case constants.GET_KIMMY_AUTHORITY:
      return state.set("kimmyAuthority", action.data);
    default:
      return state;
  }
};

const allReducer = {
  reducer,
};

export default combineReducers(allReducer);
