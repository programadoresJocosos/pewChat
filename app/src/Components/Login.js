import React, { Component } from 'react'
import Gun from 'gun'

// initialize gun locally
const gun = Gun({
  peers: [
    'http://localhost:3030/gun'
  ]
})
const getUrl = "users"

class Login extends Component {
    state = {
        name: "",
        pass: ""
    }
    
    onChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }

    onSubmit = (e) => {
        let found = false
        let pass
        e.preventDefault()
        if (!this.state.name.length || !this.state.name.length)
            alert("Empty name/password field")
        else {
            const msg = gun.get(getUrl)
            for (let i in msg) {
                if (i.name === this.state.name) {
                    found = true
                    pass = i.pass
                    break
                }
            }
            if (!found) {
                msg.set({
                    name: this.state.name,
                    pass: pass
                })
                this.props.user(this.state.name)
            }
            else if (found && pass === this.state.pass)
                this.props.user(this.state.name)
            else
                alert("User or password wrong")
        }
    }

    render() {
        return (
            <div>
                <form onSubmit={this.onSubmit}>
                    <input 
                        name="name"
                        placeholder="Username"
                        type="text"
                        onChange={this.onChange}/>
                    <input
                        name="password"
                        placeholder="Password"
                        type="text"
                        onChange={this.onChange}/>
                    <button type="submit">Login</button>
                </form>            
            </div>
        )
    }
}

export default Login
