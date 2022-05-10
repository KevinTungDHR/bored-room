import React from 'react';

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rating: 64,
            username: 'Demo',
            bio: 'I like party games'
            
        }
    }

    generateGrid() {
        let klass;

        for (let row = 4; row > 0; row--) {
            for (let col = 0; col < 5; col++) {

            }
        }
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
                        <h1>BABY YODA</h1>
                        <div>Elo Rating +106</div>
                        <textarea value="I love owning noobs" rows="14" cols="50" />
                    </div>
                    
                    <div className='profile-board'>
                        <div>?</div>
                        <div>?</div>
                        <div>?</div>
                        <div>?</div>
                        <div id='prize'>?</div>
                        <div>?</div>
                        <div>?</div>
                        <div>?</div>
                        <div>?</div>
                        <div>?</div>
                        <div>?</div>
                        <div>?</div>
                        <div>?</div>
                        <div>?</div>
                        <div>?</div>
                        <div>?</div>
                        <div>?</div>
                        <div>?</div>
                        <div>?</div>
                        <div>?</div>
                        <div>?</div>
                        <div>?</div>
                        <div>?</div>
                        <div>?</div>
                        <div>?</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Profile;