import { connect } from 'react-redux';
import { logout } from '../../actions/session_actions';
import { fetchUser } from '../../actions/user_actions';
import { withRouter } from 'react-router-dom';
import { openModal } from '../../actions/modal_actions';

import NavBar from './navbar';

const mapStateToProps = (state) => ({
    loggedIn: state.session.isAuthenticated,
    user: state.entities.users[state.session.user.id]
});

const mapDispatchToProps = dispatch => ({
    logout: () => dispatch(logout()),
    fetchUser: () => dispatch(fetchUser()),
    openModal: (modal) => dispatch(openModal(modal))
})

export default withRouter(connect(
    mapStateToProps, 
    mapDispatchToProps
)(NavBar));