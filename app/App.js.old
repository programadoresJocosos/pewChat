import { useEffect, useState, useReducer, useRef } from 'react'
import Gun from 'gun'
import './css/chat.css'
import moment from 'moment'

// initialize gun locally
const gun = Gun({
  peers: [
    'http://localhost:3030/gun'
  ]
})


// create the initial state to hold the messages
const initialState = {
  messages: []
}

// Create a reducer that will update the messages array
function reducer(state, message) {
  return {
    messages: [...state.messages, message]
  }
}

export default function App() {
  // the form state manages the form input for creating a new message
    const [formState, setForm] = useState({
    name: '', message: ''
  })

  const messagesEndRef = useRef(null)

  // initialize the reducer & state for holding the messages array
  const [state, dispatch] = useReducer(reducer, initialState)

  // when the app loads, fetch the current messages and load them into the state
  // this also subscribes to new data as it changes and updates the local state
  useEffect(() => {
    const messages = gun.get('messages').on( data => 
        console.log("Se cambió el dato: ", data))
    messages.map().on(m => {
      dispatch({
        name: m.name,
        message: m.message,
        createdAt: m.createdAt
      })
    })
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  // set a new message in gun, update the local state to reset the form field
  function saveMessage() {
    const messages = gun.get('messages').on( data => 
        console.log("Se cambió el dato: ", data))
    var date = moment().format('LT');
    messages.set({
      name: formState.name,
      message: formState.message,
      createdAt: date
    })
    setForm({
      name: formState.name, message: ''
    })
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // update the form state as the user types
  function onChange(e) {
    setForm({ ...formState, [e.target.name]: e.target.value  })
  }

  return (
    <div className="chat-container">
      <input
        className="user-name"
        onChange={onChange}
        placeholder="Name"
        name="name"
        value={formState.name}
      />
      <div className="msg-container">
        {
          state.messages.map(message => (
            <div ref={messagesEndRef} className={`msg-card ${message.name === formState.name ? "bgc-me": "bgc-other"}`} key={message.createdAt}>
              <p>
                {message.name === formState.name ? <></>:<b>{message.name}</b>}
                {message.name === formState.name ? <></>:<br/>}
                {message.message}
              </p>
              <sub>
                {message.createdAt}
              </sub>
            </div>
          ))
        }
      </div>
        <input
          onChange={onChange}
          placeholder="Message"
          name="message"
          value={formState.message}
        />
        <button onClick={saveMessage}>Send Message</button>
    </div>
  );
}
