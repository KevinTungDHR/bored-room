import React from 'react';
import { connect } from 'react-redux';
import { closeModal } from '../../actions/modal_actions';
import Avatar from '../profile/avatar';
import { updateUser } from '../../actions/user_actions';

function Modal ({ modal, user, closeModal, updateUser }) {
    if (!modal) {
        return null;
    }

    let component;

    switch(modal.formType) {
        case 'avatar':
            component = <Avatar user={user} updateUser={updateUser} closeModal={closeModal}/>
            break;
        default:
            break;
    }

    return (
        <div>
            {component}
        </div>
    )
}

const mapStateToProps = state => ({
    modal: state.ui.modal,
    user: state.session.user
})

const mapDispatchToProps = dispatch => ({
    closeModal: () => dispatch(closeModal()),
    updateUser: (user) => dispatch(updateUser(user))
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Modal);