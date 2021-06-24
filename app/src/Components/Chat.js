import React, { Component } from 'react'
import Gun from 'gun'

// initialize gun locally
const gun = Gun({
  peers: [
    'http://localhost:3030/gun'
  ]
})
const getUrl = "test"

class Chat extends Component {
    state = {
        name: '',
        message: '',
        timestamp: '',
        messages: []
    }

    componentDidMount() {
        gun.get(getUrl).map().on( m=> {
            this.setState({ messages: [...this.state.messages, m] })
        } )
    }

    componentDidUpdate() {
        let tmpState = []
        gun.get(getUrl).map().on( m=> {
            tmpState.push(m)
        } )
        if (tmpState.length > this.state.messages.length)
            this.setState({ messages: tmpState })
    }

    saveMessage = () => {
        const msg = gun.get(getUrl)
        msg.set({
            name: this.state.name,
            message: this.state.message,
            timestamp: Date.now()
        })
        this.setState({name: '', message: ''})
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    render() {
        return (
            <div>
                <input
                    onChange={this.onChange}
                    placeholder="Username"
                    name="name"
                    value={this.state.name}
                />
                <input
                    onChange={this.onChange}
                    placeholder="Type something..."
                    name="message"
                    value={this.state.message}
                />
                    <button onClick={this.saveMessage}>Send Message</button>
                {
                    this.state.messages.map(message => (
                    <div key={message.timestamp}>
                        <h2>{message.message}</h2>
                        <h3>From: {message.name}</h3>
                        <p>Date: {message.createdAt}</p>
                    </div>
                    ))
                }
            </div>
        )
    }
}

export default Chat;
