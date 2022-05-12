import React from 'react';
import yoda from '../../assets/images/yoda.png';
import monkey from '../../assets/images/coolMonkey.png';
import socrates from '../../assets/images/socrates.png';
import user_prof from '../../assets/images/user_prof.png';
import space from '../../assets/images/space.jpg';
import earth from '../../assets/images/earth.jpg';

class Profile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: this.props.user,
            btn: 'Edit',
            background: null
            // currImg: 1
        }

        this.toggleBtn = this.toggleBtn.bind(this);
        this.handleChangeBio = this.handleChangeBio.bind(this);
        this.handleChangeHandle = this.handleChangeHandle.bind(this);
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.profile = this.profile.bind(this);
        this.changeBackground = this.changeBackground.bind(this);
    }

    componentDidMount() {
        this.props.fetchUser().then(() => {
            this.setState({user: this.props.user})
        });
    }

    handleChangeBio(e) {
        let newState = this.state;
        newState.user.bio = e.target.value;
        this.setState(newState);
        debugger;
    }

    handleChangeHandle(e) {
        let newState = this.state;
        newState.user.handle = e.target.value;
        this.setState(newState);
    }

    handleChangeEmail(e) {
        let newState = this.state;
        newState.user.email = e.target.value;
        this.setState(newState);
    }

    toggleBtn(e) {
        e.preventDefault();
        let handle = document.getElementById('profile-handle');
        let description = document.getElementById('profile-description');
        let email = document.getElementById('profile-email');
        let newState = this.state;
        let prevBtn = newState.btn;

        newState.btn = (newState.btn === 'Edit') ? 'Save' : 'Edit'; // switch state value

        (newState.btn === 'Edit') ? handle.setAttribute("disabled", "true") : handle.removeAttribute("disabled");
        (newState.btn === 'Edit') ? description.setAttribute("disabled", "true") : description.removeAttribute("disabled");
        (newState.btn === 'Edit') ? email.setAttribute("disabled", "true") : email.removeAttribute("disabled");

        let button = document.getElementById('profile-btn');
        button.innerText = (newState.btn === 'Save') ? 'Save' : "Edit";
        button.className = (prevBtn === 'Edit') ? 'profile-save-btn' : 'profile-edit-btn';
        debugger
        if (prevBtn === 'Save') {
            debugger;
            this.props.updateUser(this.state.user);
            this.setState({ newState })
        }
        
    }

    changeBackground(e) {
        e.preventDefault();
        const image = (e.target.value === 'space') ? space : earth;
        let newState = this.state;
        newState.background = image;
        this.setState({ newState });
    }

    profile() {
        const avatars = {
            'noimage': user_prof,
            'yoda': yoda,
            'monkey': monkey,
            'socrates': socrates
        };
        const { email, bio, handle, eloRating, avatar } = this.props.user;
        
        return (
            <div className='profile-container' style={{ backgroundImage: "url(" + this.state.background + ")" }}>
                <div className='separator'>
                    <button className='space-btn' onClick={this.changeBackground} value="space" >Go to Space</button>
                    <button className='earth-btn' onClick={this.changeBackground} value="earth" >Stay on Earth</button>
                </div>
                <div className='profile-inner-container'>
                    <div className='profile-form'>
                        <div className='avatar-image'>
                            <div className='profile-avatar' style={{ backgroundImage: "url(" + avatars[avatar] + ")"}} >
                                <button onClick={() => this.props.openModal({ formType: 'avatar' })} className='edit-avatar-btn'>Edit Avatar</button>
                            </div>
                        </div>
                        <input onChange={this.handleChangeHandle} disabled id='profile-handle' type="text" value={handle} maxLength='30' />
                        <input onChange={this.handleChangeEmail} disabled id='profile-email' type="text" value={email} maxLength='30' />
                        <div>ELO {eloRating}</div>
                        <textarea onChange={this.handleChangeBio} disabled id='profile-description' value={bio} rows="14" cols="50" />
                        <button className='profile-edit-btn' id='profile-btn' onClick={this.toggleBtn}>{this.state.btn}</button>
                    </div>
                    
                    <div className='profile-board'>
                        {/* {this.generateGrid()} */}
                        <div data-row="1">?</div>
                        <div data-value="10">?</div>
                        <div data-value="20">?</div>
                        <div data-value="30">?</div>
                        <div data-value="40" id='prize'>?</div>
                        <div data-value="50">?</div>
                        <div data-value="60">?</div>
                        <div data-value="70">?</div>
                        <div data-value="80">?</div>
                        <div data-value="90">?</div>
                        <div data-value="100">?</div>
                        <div data-value="110">?</div>
                        <div data-value="120">?</div>
                        <div data-value="130">?</div>
                        <div data-value="140">?</div>
                        <div data-value="150">?</div>
                        <div data-value="160">?</div>
                        <div data-value="170">?</div>
                        <div data-value="180">?</div>
                        <div data-value="190">?</div>
                        <div data-value="200">?</div>
                        <div data-value="210">?</div>
                        <div data-value="220">?</div>
                        <div data-value="230">?</div>
                        <div data-value="240">?</div>
                    </div>
                </div>
            </div>
        )
    }

    render() {        
        return (
            this.props.user && this.profile()
        )
    }
}

export default Profile;