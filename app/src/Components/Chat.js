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
const getUrl = "messages"
const getUsers = "users"

class Chat extends Component {
    messagesEndRef = React.createRef()
    state = {
        name: '',
        message: '',
        timestamp: '',
        receiver: '',
        messages: [],
        users: ['global']
    }

    scrollToBottom = () => {
        this.messagesEndRef?.current.scrollIntoView({ behavior: 'smooth' })
    }

    componentDidMount() {
        this.scrollToBottom()
        this.setState({ name: this.props.name })
        gun.get(getUrl).map().on( m=> {
            this.setState({ messages: [...this.state.messages, m],
                users: [...this.state.users, ...this.getNames()],
                receiver: 'global'})
        } )
    }

    componentDidUpdate() {
        this.scrollToBottom()
        let tmpMsgs = this.getData()
        let tmpUsrs = this.getNames()
        if (tmpMsgs.length !== this.state.messages.length)
            this.setState({ messages: tmpMsgs, users: ['global', ...tmpUsrs] })
    }

    getData = (users = false) => {
        let tmp = []
        const url = (users === false) ? getUrl : getUsers
        gun.get(url).map().on( m => {
            tmp.push(m)
        })
        return tmp
    }

    getNames = () => {
        let tmp = this.getData(true)
        let names = new Set()
        tmp.map( m => {
            names.add(m.name)
        })
        return Array.from(names)
    }

    saveMessage = () => {
        const msg = gun.get(getUrl)
        if (this.state.message.length > 0) {
            msg.set({
                name: this.state.name,
                message: this.state.message,
                timestamp: Moment().format('LT'),
                receiver: this.state.receiver
            })
            this.setState({message: ''})
        }
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    render() {
        console.log(this.state.users)
        return (
            <div className="app-container">
                <h2 className="user-name">{this.state.name}</h2>
                <div className="main-chat">
                    <div className="user-container">
                    {this.getNames().map((e, i) =>
                        <button className="user-card" key={i}> 
                            {e}
                        </button>
                    )}
                    </div>
                    <div className="chat-container">
                        <div className="msg-container">
                        {
                            this.state.messages.map((message, index) => (
                            <div className={`msg-card
                                ${message.name === this.state.name
                                        ? "bgc-me": "bgc-other"}`} key={index}>
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
                        <div ref={this.messagesEndRef}/>
                        </div>
                        <div className="textbox-container">
                        <input id="textbox"
                            onChange={this.onChange}
                            placeholder="Message"
                            name="message"
                            value={this.state.message}
                        />
                        <button id="btn-send" onClick={this.saveMessage}>Send Message</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Chat;
