import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import reducer from "./reducer";
import thunk from "redux-thunk";

import immutableTransform from "redux-persist-transform-immutable";
import { persistStore, persistReducer } from "redux-persist";
// import storage from "redux-persist/lib/storage";
import storageSession from "redux-persist/lib/storage/session";

const persistConfig = {
  transforms: [immutableTransform()],
  key: "root",
  storage: storageSession,
};

const persistedReducer = persistReducer(persistConfig, reducer /* reducer*/);
const composeEnhancers = composeWithDevTools({});

const enhancer = applyMiddleware(thunk);

const store = createStore(persistedReducer, composeEnhancers(enhancer));

export const persistor = persistStore(store);
export default store;
