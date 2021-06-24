import React, { Component } from 'react'
import Chat from './Components/Chat'
import Login from './Components/Login'

class App extends Component {
    state = {
        user: ''
    }

    getUser = (e) => {
        this.setState({user: e})
    }

    render() {
        return (
            <div>
                { this.state.user === '' ? <Login user={this.getUser}/> : 
                    <Chat name={this.state.user}/>}
            </div>
        )
    }
}

export default App
