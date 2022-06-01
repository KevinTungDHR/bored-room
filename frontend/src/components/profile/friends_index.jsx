import React, { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import UserCard from './user_card';

const FriendsIndex = ({users, user}) => {
  const [selected, setSelected] = useState(0);

  const sessionId = useSelector(state => state.session.user._id);

  const friendshipHeaders = { 
    acceptedFriends: 'My Friends', 
    requestedFriends: 'Requests', 
    pendingFriends: 'Pending', 
    rejectedFriends: 'Blocked'}

  const status = Object.keys(friendshipHeaders)[selected]

  const currentUserHeaders = Object.values(friendshipHeaders).map((header, idx) => 
      <li key={idx} className={selected !== idx ? 'friendship-header-notselected friendship-header-tab' : 'friendship-header-tab'} onClick={() => setSelected(idx)}>{header}</li>)

  return (
    <div className='friends-container'>
      <ul className='friendship-headers'>
      {sessionId === user._id ? currentUserHeaders : <li className='friendship-header-tab no-hover'>My Friends</li>}
      </ul>
      <div className='friends-list'>
          <div className='friends-flex-container'>
            {sessionId === user._id ? 
            user[Object.keys(friendshipHeaders)[selected]].map((_id, idx) => <UserCard user={users[_id]} key={idx} status={status}/>) :
            user.acceptedFriends.map((_id, idx) => <UserCard user={users[_id]} key={idx}/>)
          }
          </div>
      </div>
    </div>
  )
}

export default FriendsIndex;