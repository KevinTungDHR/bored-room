import React from 'react';
import yoda from '../../assets/images/yoda.png';
import monkey from '../../assets/images/coolMonkey.png';
import socrates from '../../assets/images/socrates.png';
import user_prof from '../../assets/images/user_prof.png';
import { NavLink } from 'react-router-dom';

const UserCard = ({user, status}) => {
  if(!user){
    return (
      <div className="userCard-container">
        <div className="loader"></div>
        <div className='userCard-info'>
        </div>
      </div>
    )
  }

  const avatars = {
    'noimage': user_prof,
    'yoda': yoda,
    'monkey': monkey,
    'socrates': socrates
  };

  const handleUnblock = (e) => {
    e.preventDefault();
    e.stopPropagation();
  }

  const renderbuttons = () => {
    switch(status){
      case 'requestedFriends':
        return (
            <div className='friendship-status friendship-red'>Cancel</div>
        )
      case 'pendingFriends':
        return (
          <>
            <div className='friendship-status friendship-green'>Accept</div>
            <div className='friendship-status friendship-red'>Reject</div>
          </>
        )
      case 'rejectedFriends':
        return (
          <div 
            className='friendship-status friendship-red'
            onClick={handleUnblock}
            >Unblock</div>
        )
      default:
        return null
    }
  } 

  const { email, bio, handle, eloRating, avatar, _id } = user;

  return(
    <NavLink to={_id} className="userCard-container">
      <div className='userCard-avatar' style={{ backgroundImage: "url(" + avatars[avatar] + ")"}}></div>
      <div className='userCard-info'>
        <div className='userCard-handle'>{handle}</div>
        <div className='userCard-bio'>{bio.length > 30 ? `${bio.slice(0, 30)}...` : bio}</div>
      </div>
      <div>
        {renderbuttons()}
      </div>
    </NavLink>
  )
}

export default UserCard;