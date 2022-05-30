import React from 'react';
import yoda from '../../assets/images/yoda.png';
import monkey from '../../assets/images/coolMonkey.png';
import socrates from '../../assets/images/socrates.png';
import user_prof from '../../assets/images/user_prof.png';
import space from '../../assets/images/space.jpg';
import earth from '../../assets/images/earth.jpg';
import game_table from '../../assets/images/game_table.jpg';

class Profile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {},
            btn: 'Edit Profile',
            background: game_table
            // currImg: 1
        }

        this.toggleBtn = this.toggleBtn.bind(this);
        this.handleChangeBio = this.handleChangeBio.bind(this);
        this.handleChangeHandle = this.handleChangeHandle.bind(this);
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.profile = this.profile.bind(this);
        this.changeBackground = this.changeBackground.bind(this);
        this.adjustWidth = this.adjustWidth.bind(this);
    }

    componentDidMount(){
        this.props.fetchUser(this.props.match.params._id);
        document.addEventListener("keydown", event => {
            if (event.key === 'Escape') {
                this.props.closeModal()
            }
        })
    }

    componentDidUpdate(prevProps){
        if (prevProps.match.params._id !== this.props.match.params._id){
         this.props.fetchUser(this.props.match.params._id);
        }

        if (prevProps.user !== this.props.user){
            this.setState({user: {...this.props.user}})  
        }
    }

    componentWillUnmount(){
        this.props.removeErrors();
    }

    handleChangeBio(e) {
        this.setState((prevState) => ({ user: { ...prevState.user, bio: e.target.value }}))
    }

    handleChangeHandle(e) {
        this.setState((prevState) => ({ user: { ...prevState.user, handle: e.target.value }}))
    }

    handleChangeEmail(e) {
        this.setState((prevState) => ({ user: { ...prevState.user, email: e.target.value }}))
    }

    toggleBtn(e) {
        e.preventDefault();
        let handle = document.getElementById('profile-handle');
        let description = document.getElementById('profile-description');
        let email = document.getElementById('profile-email');
        let copiedState = this.state;
        let prevBtn = copiedState.btn;

        copiedState.btn = (copiedState.btn === 'Edit Profile') ? 'Save' : 'Edit Profile'; // switch state value

        (copiedState.btn === 'Edit Profile') ? handle.setAttribute("disabled", "true") : handle.removeAttribute("disabled");
        (copiedState.btn === 'Edit Profile') ? description.setAttribute("disabled", "true") : description.removeAttribute("disabled");
        (copiedState.btn === 'Edit Profile') ? email.setAttribute("disabled", "true") : email.removeAttribute("disabled");

        if (copiedState.btn === 'Save') {
            handle.style.width = handle.value.length + 1 + 'em';
            email.style.width = email.value.length + 1 + 'em';
        }

        let button = document.getElementById('profile-btn');
        button.innerText = (copiedState.btn === 'Save') ? 'Save' : "Edit Profile";
        button.className = (prevBtn === 'Edit Profile') ? 'profile-save-btn' : 'profile-edit-btn';
        if (prevBtn === 'Save') {
            this.props.updateUser(this.state.user);
            this.setState({ ...copiedState })
        }
        
    }

    changeBackground(e) {
        e.preventDefault();
        const styled = document.getElementsByClassName("space-earth-btn");
        if (styled.length > 0) {
            styled[0].classList.remove("space-earth-btn");
        }
        e.target.classList.add("space-earth-btn");

        const image = (e.target.value === 'space') ? space : earth;
        let newState = this.state;
        newState.background = image;
        this.setState({ newState });
    }

    adjustWidth(e) {
        const newWidth = e.target.value.length + 1 + 'em';
        e.target.style.width = newWidth;
    }

    camelize(str) {
        return str.replace(/(?:^\w|\[A-Z\]|\b\w)/g, (word, index) => {
            return index === 0 ? word.toLowerCase() : word.toUpperCase();
        }).replace(/\s+/g, '');
    }

    profile() {
        const avatars = {
            'noimage': user_prof,
            'yoda': yoda,
            'monkey': monkey,
            'socrates': socrates
        };
        const { email, bio, handle, eloRating, avatar } = this.state.user;
        return (
            <div className='profile-container' style={{ backgroundImage: "url(" + this.state.background + ")" }}>
                <img className='hidden' src={space} />
                <img className='hidden' src={earth} />
                <div className='separator'>
                    <button className='background-btn' onClick={this.changeBackground} value="space" >Go to Space</button>
                    <button className='background-btn' onClick={this.changeBackground} value="earth" >Stay on Earth</button>
                </div>
                <div className='profile-inner-container'>
                    <div className='profile-form'>
                        <div className='avatar-image'>
                            <div className='profile-avatar' style={{ backgroundImage: "url(" + avatars[avatar] + ")"}} >
                                {this.props.user._id === this.props.sessionId && <button onClick={() => this.props.openModal({ formType: 'avatar' })} className='edit-avatar-btn'>Edit Avatar</button>}
                            </div>
                        </div>
                        <input onChange={this.handleChangeHandle} disabled id='profile-handle' type="text" value={handle} maxLength='30' onKeyDown={this.adjustWidth} />
                        <input onChange={this.handleChangeEmail} disabled id='profile-email' type="text" value={email} maxLength='30' />
                        <ul>
                            {Object.keys(this.props.errors).map((error, i) => (
                                <li className='session-error' key={`error-${i}`}>
                                    {this.props.errors[error]}
                                </li>
                            ))}
                        </ul>
                        <div className='prof-elo-wrapper'>
                            <h1>Elo Ratings</h1>
                            <div>{Object.keys(eloRating).map(key => {
                                return(
                                    <div>{`${key}: ${eloRating[key]}`}</div>
                                )
                            })}</div>
                        </div>
                        <div>Bio</div>
                        <textarea onChange={this.handleChangeBio} disabled id='profile-description' value={bio} rows="14" cols="50" />
                        {this.props.user._id === this.props.sessionId && <button className='profile-edit-btn' id='profile-btn' onClick={this.toggleBtn}>{this.state.btn}</button>}
                    </div>
                    
                </div>
            </div>
        )
    }

    render() { 
        return (
            <div>
                {Object.keys(this.state.user).length > 0 && this.profile()}
            </div>

        )
    }
}

export default Profile;