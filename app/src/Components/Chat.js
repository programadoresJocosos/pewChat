import React, { Component } from 'react'
import Gun from 'gun'
import Moment from 'moment'
import '../css/chat.css'

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
        this.setState({name: this.props.name})
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
            timestamp: Moment().format('LT')
        })
        this.setState({message: ''})
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    render() {
        return (
            <div className="chat-container">
              <p className="user-name">{this.state.name}</p>
              <div className="msg-container">
                {
                  this.state.messages.map(message => (
                    <div className={`msg-card
                        ${message.name === this.state.name
                                ? "bgc-me": "bgc-other"}`} key={message.createdAt}>
                      <p>
                        {message.name === this.state.name ? <></>:<b>{message.name}</b>}
                        {message.name === this.state.name ? <></>:<br/>}
                        {message.message}
                      </p>
                      <sub>
                        {message.timestamp}
                      </sub>
                    </div>
                  ))
                }
              </div>
                <input
                  onChange={this.onChange}
                  placeholder="Message"
                  name="message"
                  value={this.state.message}
                />
                <button onClick={this.saveMessage}>Send Message</button>
            </div>
        )
    }
}

export default Chat;
