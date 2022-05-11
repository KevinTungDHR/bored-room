import { connect } from 'react-redux';
import { logout } from '../../actions/session_actions';
import { fetchUser } from '../../actions/user_actions';

import NavBar from './navbar';

const mapStateToProps = state => ({
    loggedIn: state.session.isAuthenticated,
    user: state.users[state.session.user.id]
});

const mapDispatchToProps = dispatch => ({
    logout: () => dispatch(logout()),
    fetchUser: () => dispatch(fetchUser())
})

export default connect(
    mapStateToProps, 
    mapDispatchToProps
)(NavBar);