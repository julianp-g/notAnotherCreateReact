import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { store } from './store/store'
import AppContainer from './components/app.jsx'
import './styles/style.css'

render(
    <Provider store={ store } >
        < AppContainer />
    </Provider>,
    document.getElementById('root')
)
