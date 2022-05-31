import { connect } from 'react-redux';
import { updateUser, fetchUserAndFriends } from '../../actions/user_actions';

import Profile from './profile';
import { closeModal, openModal } from '../../actions/modal_actions';
import { removeErrors } from '../../actions/session_actions';
import { acceptRequest, 
    addFriend, 
    rejectRequest, 
    removeFriend, 
    cancelRequest, 
    unblockUser } from '../../actions/friendship_actions';

const mapStateToProps = (state, ownProps) => {
    return {
        users: state.entities.users,
        user: state.entities.users[ownProps.match.params._id],
        currentUser: state.session.user,
        sessionId: state.session.user._id,
        errors: state.errors.session,
    }
};

const mapDispatchToProps = dispatch => ({
    updateUser: user => dispatch(updateUser(user)),
    openModal: (modal) => dispatch(openModal(modal)),
    fetchUserAndFriends: (userId) => dispatch(fetchUserAndFriends(userId)),
    closeModal: () => dispatch(closeModal()),
    removeErrors: () => dispatch(removeErrors()),
    addFriend: (userId) => dispatch(addFriend(userId)),
    cancelRequest: (userId) => dispatch(cancelRequest(userId)),
    acceptRequest: (userId) => dispatch(acceptRequest(userId)),
    rejectRequest: (userId) => dispatch(rejectRequest(userId)),
    unblockUser: (userId) => dispatch(unblockUser(userId)),
    removeFriend: (userId) => dispatch(removeFriend(userId))

})

export default connect(
    mapStateToProps, mapDispatchToProps
)(Profile);