import { connect } from 'react-redux';
import { updateUser } from '../../actions/user_actions';
import { receiveErrors } from '../../actions/session_actions';

import Profile from './profile';

const mapStateToProps = (state, ownProps) => ({
    user: state.session.user
});

const mapDispatchToProps = dispatch => ({
    updateUser: user => dispatch(updateUser(user)),

    // receiveErrors: errors => dispatch(receiveErrors(errors))
})

export default connect(
    mapStateToProps, mapDispatchToProps
)(Profile);