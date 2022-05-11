import { connect } from 'react-redux';
import { updateUser, fetchUser } from '../../actions/user_actions';

import Profile from './profile';
import { openModal } from '../../actions/modal_actions';

const mapStateToProps = (state, ownProps) => ({
    user: state.entities.users[state.session.user.id],
    // avatar: state.entities.users[state.session.user.id].avatar
});

const mapDispatchToProps = dispatch => ({
    updateUser: user => dispatch(updateUser(user)),
    openModal: (modal) => dispatch(openModal(modal)),
    fetchUser: () => dispatch(fetchUser())
    // receiveErrors: errors => dispatch(receiveErrors(errors))
})

export default connect(
    mapStateToProps, mapDispatchToProps
)(Profile);