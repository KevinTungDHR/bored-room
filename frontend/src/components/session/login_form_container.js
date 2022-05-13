import { connect } from 'react-redux';
import { login, receiveErrors } from '../../actions/session_actions';
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
        receiveErrors: errors => dispatch(receiveErrors(errors))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginForm);