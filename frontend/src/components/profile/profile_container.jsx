import { connect } from 'react-redux';
import { updateUser, fetchCurrentUser } from '../../actions/user_actions';

import Profile from './profile';
import { openModal } from '../../actions/modal_actions';

const mapStateToProps = (state, ownProps) => ({
    user: state.session.user,
    errors: state.errors.session
});

const mapDispatchToProps = dispatch => ({
    updateUser: user => dispatch(updateUser(user)),
    openModal: (modal) => dispatch(openModal(modal)),
    fetchCurrentUser: () => dispatch(fetchCurrentUser())
})

export default connect(
    mapStateToProps, mapDispatchToProps
)(Profile);