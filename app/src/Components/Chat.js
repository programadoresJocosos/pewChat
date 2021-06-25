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
        name: this.props.name,
        message: '',
        timestamp: '',
        receiver: 'global',
        messages: [],
        users: ['global']
    }

    scrollToBottom = () => {
        this.messagesEndRef?.current.scrollIntoView({ behavior: 'smooth' })
    }

    componentDidMount() {
        this.scrollToBottom()
        let tmpMsgs = this.getData()
        let tmpUsrs = this.getNames()
        this.setState({ name: this.props.name, messages: tmpMsgs,
                users: ['global', ...tmpUsrs] })
        this.interval = setInterval(() => this.setState({ time: Date.now() }), 1000);
    }

    componentWillUnmount() {
      clearInterval(this.interval);
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
        let [first, second] = this.getFirstSecond()
        let url
        if (users === true)
            url = getUsers
        else if (this.state.receiver === "global")
            url = "global"
        else
            url = `${first}:${second}`
        gun.get(url).map().on( m => {
            tmp.push(m)
        })
        return tmp
    }

    getNames = () => {
        let tmp = this.getData(true)
        let names = new Set()
        tmp.map( m => {
            if (m.name !== this.state.name)
                names.add(m.name)
        })
        return Array.from(names)
    }

    getFirstSecond = () => {
        return (this.state.name < this.state.receiver)
                ? [this.state.name, this.state.receiver] : [this.state.receiver, this.state.name]
    }

    saveMessage = () => {
        const [first, second] = this.getFirstSecond()
        const url = (this.state.receiver === "global") ? "global" : `${first}:${second}`
        const msg = gun.get(url)
        if (this.state.message.length > 0) {
            msg.set({
                name: this.state.name,
                message: this.state.message,
                timestamp: Moment().format('LT'),
                receiver: url
            }, () => {
                this.setState({message: ''}, () => console.log("entra"))
            })
        }
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    render() {
        return (
            <div className="app-container">
                <h2 className="user-name">{this.state.name}</h2>
                <div className="main-chat">
                    <div className="user-container">
                    {['global', ...this.getNames()].map((e, i) =>
                        <button
                            name="receiver"
                            value={e}
                            onClick={this.onChange}
                            className="user-card"
                            key={i}> 
                            {e}
                        </button>
                    )}
                    </div>
                    <div className="chat-container">
                        <div className="msg-container">
                        {
                            this.getData().map((message, index) => (
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
