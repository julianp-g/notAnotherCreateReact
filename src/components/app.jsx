import React from 'react'
import { connect } from 'react-redux'
import actions from '../actions/exActions'

const App = ( { count, increment, decrement } ) => {
    return(
        <div>
            <button onClick={increment}>inc</button>
            <button onClick={decrement}>dec</button>
            <div>The current count in state: { count }</div>
        </div>
    )
}

const mapStateToProps = ({ count }) => ({ count })

const AppContainer = connect(mapStateToProps, actions)(App)
export default AppContainer
