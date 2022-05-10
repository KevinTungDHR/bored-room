import React from 'react';

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rating: 64,
            username: 'Demo',
            bio: 'I like party games',
            btn: 'Edit'
        }
        // this.generateGrid = this.generateGrid.bind(this);
        this.toggleEdit = this.toggleEdit.bind(this);
    }

    // generateGrid() {

    //     [5, 4, 3, 2, 1].map((x) => {
    //         let thresh = (x * 10)
    //         let klass = thresh > this.state.rating ? '' : 'profile-star';
    //         return <div className={klass} data-value={row + " " + col} data-threshold={thresh}></div>
    //     })
    // }

    toggleEdit(e) {
        e.preventDefault();
        let newState = this.state.btn === 'Edit' ? 'Submit' : 'Edit';
        document.getElementsByClassName('profile-handle').disabled = newState === 'Edit' ? true : false;
        document.getElementsByClassName('profile-description').disabled = newState === 'Edit' ? true : false;
        let btn = document.getElementsByClassName('profile-btn');
        btn.innerText = 'Submit';
        this.setState({ btn: newState })
    }

    render() {
        return (
            <div className='profile-container'>
                <div className='separator'></div>
                <div className='profile-inner-container'>
                    <div className='profile-form'>
                        <div className='avatar-ctnr'>
                            <div className='profile-avatar'>
                        </div>
                        </div>
                        <input className='profile-handle' type="text" value="Baby Yoda" />
                        <div>ELO +106</div>
                        <textarea className='profile-description' value="I love owning noobs" rows="14" cols="50" />
                        <button className='profile-btn' onClick={this.toggleEdit}>{this.state.btn}</button>
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