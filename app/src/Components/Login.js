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
        let tmpPass = this.state.pass
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
            console.log(found, tmpPass)
            if (found === false) {
                console.log("Not found: ", this.state.pass, tmpPass)
                const msg = gun.get(getUrl)
                msg.set({
                    name: this.state.name,
                    pass: this.state.pass
                })
                this.props.user(this.state.name)
            }
            else if (found === true && tmpPass === this.state.pass) {
                console.log("found")
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
                        type="text"
                        onChange={this.onChange}/>
                    <button type="submit">Login</button>
                </form>            
            </div>
        )
    }
}

export default Login
