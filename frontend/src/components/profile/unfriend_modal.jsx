import React from 'react';
const UnfriendModal = ({ user, unfriend, closeModal }) => {

  return(
    <div className='unfriend-modal' onClick={closeModal}>
      <div className='unfriend-modal-content'>
        <h3>{`Are you sure you want to unfriend ${user.handle}?`}</h3>
        <div className='unfriend-modal-buttons'>
          <div onClick={unfriend} className='friendship-red friendship-modal-button'>Unfriend</div>
          <div onClick={closeModal} className='friendship-modal-button'>cancel</div>
        </div>
      </div>
      
    </div>
  )
}

export default UnfriendModal;