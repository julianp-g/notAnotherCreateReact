import React from 'react'

export default class App extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            greeting: 'hi there from the state'
        }
    }
    render() {
        return(
            <div>{this.state.greeting}</div>
        )
    }
}
