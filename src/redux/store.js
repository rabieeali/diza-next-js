import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'

import rootReducer from './reducers'

const initialState = {};
const middleware = [thunk];

const store = createStore(rootReducer,initialState,applyMiddleware(...middleware))

export default store

// import { createStore, applyMiddleware } from "redux";
// import { composeWithDevTools } from "redux-devtools-extension";
// import thunk from "redux-thunk";
// import rootReducer from "./reducers";

// export default function initializeStore(initialState = {}) {
//   return createStore(
//     rootReducer,
//     initialState,
//     composeWithDevTools(applyMiddleware(thunk))
//   );
// }