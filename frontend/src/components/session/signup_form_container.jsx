import { connect } from 'react-redux';
import { signup, receiveErrors, login, removeErrors  } from '../../actions/session_actions';
import SignupForm from './signup_form';

const mapStateToProps = (state) => {
    return {
        signedIn: state.session.isSignedIn,
        errors: state.errors.session
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        signup: user => dispatch(signup(user)),
        receiveErrors: errors => dispatch(receiveErrors(errors)),
        login: user => dispatch(login(user)),
        removeErrors: () => dispatch(removeErrors())
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SignupForm);