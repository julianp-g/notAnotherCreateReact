import { createReducer } from '@reduxjs/toolkit'

const counterReducer = createReducer(0, {
    increment: (state, action) => state + 1,
    decrement: (state, action) => state - 1
})

export {
    counterReducer,
}
