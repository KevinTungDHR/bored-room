import React from 'react';
import { withRouter } from 'react-router-dom';

class SignupForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            handle: '',
            password: '',
            password2: '',
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.loginDemo = this.loginDemo.bind(this);

        this.clearedErrors = false;
    }

    loginDemo(e){
        e.preventDefault();
        const demoUser = { email: "DemoUser@demouser.com", password: "demouser" }
        this.props.login(demoUser)
    }

    update(field) {
        return e => this.setState({
            [field]: e.currentTarget.value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        // let user = {
        //     email: this.state.email,
        //     handle: this.state.handle,
        //     password: this.state.password,
        //     password2: this.state.password2
        // };
        const user = Object.assign({}, this.state)

        this.props.signup(user)
            // .then(() => 
            // // this.props.history.push("/lobby"),
            // (errors) => this.props.receiveErrors(errors));
    }

    renderErrors() {
        return (
            <ul>
                {Object.keys(this.props.errors).map((error, i) => (
                    <li key={`error-${i}`} className="session-error">
                        {this.props.errors[error]}
                    </li>
                ))}
            </ul>
        );
    }

    render() {
        // const { errors } = this.props;
        return (
            <div className="signup-container">
                <form className='signup-form' onSubmit={this.handleSubmit}>
                    <div className='signup-form-inputs'>
                        <h1>Signup Here!</h1>
                        <input type="text"
                            value={this.state.email}
                            onChange={this.update('email')}
                            placeholder="Email"
                        />
                        <input type="text"
                            value={this.state.handle}
                            onChange={this.update('handle')}
                            placeholder="Handle"
                        />
                        <input type="password"
                            value={this.state.password}
                            onChange={this.update('password')}
                            placeholder="Password"
                        />
                        <input type="password"
                            value={this.state.password2}
                            onChange={this.update('password2')}
                            placeholder="Confirm Password"
                        />
                        <input className='signup-btn' type="submit" value="Sign Up" />
                        <div>or</div>
                        <input className='signup-btn' type="submit" onClick={this.loginDemo} value="Sign in as Demo User" />
                        {this.renderErrors()}
                    </div>
                </form>
            </div>
        );
    }
}

export default withRouter(SignupForm);