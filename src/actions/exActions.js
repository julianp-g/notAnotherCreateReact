import { createAction } from '@reduxjs/toolkit'

// export const increment = createAction('counter/increment')
export const increment = (action) => (dispatch) => dispatch({ type: 'increment' })

export const decrement = (action) => (dispatch) => dispatch({ type: 'decrement'})

export default {
    increment,
    decrement,
}
