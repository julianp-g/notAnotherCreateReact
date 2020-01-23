import { configureStore } from '@reduxjs/toolkit'
import { counterReducer } from '../reducers/exReducer'
import { combineReducers } from 'redux';


const rootReducer = combineReducers({
  count: counterReducer,
})

// this 1 line configureas the store with redux-thunk added and the Redux DevTools Extension is turned on
const store = configureStore({ reducer: rootReducer })

export {
    store,
}
