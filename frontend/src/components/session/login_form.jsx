import React from 'react';
import { withRouter } from 'react-router-dom';

class LoginForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.renderErrors = this.renderErrors.bind(this);
        this.loginDemo = this.loginDemo.bind(this);
    }

    componentWillUnmount(){
        this.props.removeErrors();
    }
    
    loginDemo(e){
        e.preventDefault();
        const demoUser = { email: "DemoUser@demouser.com", password: "demouser" }
        this.props.login(demoUser)
    }
    // Handle field updates (called in the render method)
    update(field) {
        return e => this.setState({
            [field]: e.currentTarget.value
        });
    }

    // Handle form submission
    handleSubmit(e) {
        e.preventDefault();

        const user = Object.assign({}, this.state)
        this.props.login(user)
    }

    // Render the session errors if there are any
    renderErrors() {
        return (
            <ul>
                {Object.keys(this.props.errors).map((error, i) => (
                    <li className='session-error' key={`error-${i}`}>
                        {this.props.errors[error]}
                    </li>
                ))}
            </ul>
        );
    }

    render() {
        return (
            <div className='login-container'>
                <form className='login-form' onSubmit={this.handleSubmit}>
                    <h1>Log in and play!</h1>
                    <div className='login-form-inputs'>
                        <input type="text"
                            value={this.state.email}
                            onChange={this.update('email')}
                            placeholder="Email"
                        />
                        <br />
                        <input type="password"
                            value={this.state.password}
                            onChange={this.update('password')}
                            placeholder="Password"
                        />
                        <br />
                        
                        <input className='login-btn' type="submit" value="Login In" />
                        <div>or</div>
                        <input className='login-btn' onClick={this.loginDemo} type="submit" value="Demo Login" />
                        {this.renderErrors()}
                    </div>
                </form>

            </div>
        );
    }
}

export default withRouter(LoginForm);