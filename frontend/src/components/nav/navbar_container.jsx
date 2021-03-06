import { connect } from 'react-redux';
import { logout } from '../../actions/session_actions';
import { fetchCurrentUser } from '../../actions/user_actions';
import { withRouter } from 'react-router-dom';
import { openModal } from '../../actions/modal_actions';

import NavBar from './navbar';

const mapStateToProps = (state) => ({
    loggedIn: state.session.isAuthenticated,
    user: state.session.user
});

const mapDispatchToProps = dispatch => ({
    logout: () => dispatch(logout()),
    fetchCurrentUser: () => dispatch(fetchCurrentUser()),
    openModal: (modal) => dispatch(openModal(modal))
})

export default withRouter(connect(
    mapStateToProps, 
    mapDispatchToProps
)(NavBar));