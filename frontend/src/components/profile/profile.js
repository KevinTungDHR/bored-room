import React from 'react';

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: this.props.user,    
            btn: 'Edit'
        }
        // this.generateGrid = this.generateGrid.bind(this);
        this.toggleBtn = this.toggleBtn.bind(this);
        this.handleChangeBio = this.handleChangeBio.bind(this);
        this.handleChangeHandle = this.handleChangeHandle.bind(this);
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
    }

    handleChangeBio(e) {
        let newState = this.state;
        newState.user.bio = e.target.value;
        this.setState(newState);

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
        (newState.btn === 'Edit') ? email.setAttribute("disabled", "true") : description.removeAttribute("disabled");

        let button = document.getElementById('profile-btn');
        button.innerText = (newState.btn === 'Save') ? 'Save' : "Edit";
        button.className = (prevBtn === 'Edit') ? 'profile-save-btn' : 'profile-edit-btn';

        if (prevBtn === 'Save') {
            debugger;
            this.props.updateUser(this.state.user);
            this.setState({ newState })
        }
        
    }

    render() {
        const { email, bio, handle, eloRating } = this.state.user;

        // "url(" + { Background } + ")"
        return (
            <div className='profile-container'>
                <div className='separator'></div>
                <div className='profile-inner-container'>
                    <div className='profile-form'>
                        <div className='avatar-ctnr'>
                            <div className='profile-avatar' >
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
}

export default Profile;