import React, { Component } from 'react'
import Gun from 'gun'
import SHA256 from 'crypto-js/sha256'

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
        pass: "",
        users: [],
    }
    
    componentDidMount() {
        gun.get(getUrl).map().on( m => {
            this.setState({ users: [...this.state.users, m] })
        } )
    }

    componentDidUpdate() {
        let tmpState = []
        gun.get(getUrl).map().on( m => {
            tmpState.push(m)
        } )
        if (tmpState.length !== this.state.users.length)
            this.setState({ users: tmpState })
    }

    onChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }

    onSubmit = (e) => {
        e.preventDefault()
        var found = false
        let tmpPass = SHA256(this.state.pass).toString()
        if (!this.state.name.length || !this.state.pass.length)
            alert("Empty name/password field")
        else {
            for (let i of this.state.users) {
                if (i.name === this.state.name) {
                    found = true
                    tmpPass = i.pass
                    break
                }
            }
            if (found === false) {
                const msg = gun.get(getUrl)
                msg.set({
                    name: this.state.name,
                    pass: SHA256(this.state.pass).toString()
                })
                this.props.user(this.state.name)
                alert(`New account ${this.state.name} succesfully created!`)
            }
            else if (found === true && tmpPass === SHA256(this.state.pass).toString()){
                alert(`Welcome back ${this.state.name}`)
                this.props.user(this.state.name)
            }
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
                        name="pass"
                        placeholder="Password"
                        type="password"
                        autoComplete="false"
                        onChange={this.onChange}/>
                    <button type="submit">Login</button>
                </form>            
            </div>
        )
    }
}

export default Login
