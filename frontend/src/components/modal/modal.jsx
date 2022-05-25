import React from 'react';
import { connect } from 'react-redux';
import { closeModal } from '../../actions/modal_actions';
import Avatar from '../profile/avatar';
import { updateAvatar } from '../../actions/user_actions';

function Modal ({ modal, user, closeModal, updateAvatar }) {
    if (!modal) {
        return null;
    }

    let component;

    switch(modal.formType) {
        case 'avatar':
            component = <Avatar user={user} updateAvatar={updateAvatar} closeModal={closeModal}/>
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
    updateAvatar: (avatar) => dispatch(updateAvatar(avatar))
})  

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Modal);