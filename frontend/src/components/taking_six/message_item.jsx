import React from 'react';

const MessageItem = ({ currentUser, message }) => {

  return(
    <div className={currentUser._id === message.user._id ? 'message-item-container-right' : 'message-item-container-left'}>
      <div className='message-item-handle'>{message.user.handle}</div>
      <div className={currentUser._id === message.user._id ? 'message-item-body-right' : 'message-item-body-left'}>{message.body}</div>
    </div>
  )
}

export default MessageItem;