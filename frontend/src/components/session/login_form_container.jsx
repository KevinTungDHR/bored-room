import { connect } from 'react-redux';
import { login, receiveErrors, removeErrors } from '../../actions/session_actions';
import LoginForm from './login_form';

const mapStateToProps = (state) => {
    return {
        errors: state.errors.session,
        currentUser: state.session.user
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        login: user => dispatch(login(user)),
        removeErrors: () => dispatch(removeErrors())
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginForm);