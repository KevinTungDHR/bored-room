import { combineReducers } from "redux";
import modalReducer from "./modal_reducer";
import requestReducer from "./request_reducer";

const uiReducer = combineReducers({
    modal: modalReducer,
    requests: requestReducer
})

export default uiReducer;