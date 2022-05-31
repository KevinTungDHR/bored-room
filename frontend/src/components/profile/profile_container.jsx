import { connect } from 'react-redux';
import { updateUser, fetchUserAndFriends } from '../../actions/user_actions';

import Profile from './profile';
import { closeModal, openModal } from '../../actions/modal_actions';
import { removeErrors } from '../../actions/session_actions';

const mapStateToProps = (state, ownProps) => {
    return {
        users: state.entities.users,
        user: state.entities.users[ownProps.match.params._id],
        sessionId: state.session.user._id,
        errors: state.errors.session,
    }
};

const mapDispatchToProps = dispatch => ({
    updateUser: user => dispatch(updateUser(user)),
    openModal: (modal) => dispatch(openModal(modal)),
    fetchUserAndFriends: (userId) => dispatch(fetchUserAndFriends(userId)),
    closeModal: () => dispatch(closeModal()),
    removeErrors: () => dispatch(removeErrors())
})

export default connect(
    mapStateToProps, mapDispatchToProps
)(Profile);