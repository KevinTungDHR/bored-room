import { connect } from 'react-redux';
import { updateUser } from '../../actions/user_actions';
import { receiveErrors } from '../../actions/session_actions';

import Profile from './profile';
import { openModal } from '../../actions/modal_actions';

const mapStateToProps = (state, ownProps) => ({
    user: state.session.user
});

const mapDispatchToProps = dispatch => ({
    updateUser: user => dispatch(updateUser(user)),
    openModal: (modal) => dispatch(openModal(modal))
    // receiveErrors: errors => dispatch(receiveErrors(errors))
})

export default connect(
    mapStateToProps, mapDispatchToProps
)(Profile);