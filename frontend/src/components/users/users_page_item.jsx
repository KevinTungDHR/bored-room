import React from 'react';
import { NavLink } from 'react-router-dom';
import yoda from '../../assets/images/yoda.png';
import monkey from '../../assets/images/coolMonkey.png';
import socrates from '../../assets/images/socrates.png';
import user_prof from '../../assets/images/user_prof.png';

const UserPageItem = ({ user }) => {
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

  const { email, bio, handle, eloRating, avatar, _id } = user;

  return(
    <NavLink to={`/profile/${_id}`} className="userCard-container">
      <div className='userCard-avatar' style={{ backgroundImage: "url(" + avatars[avatar] + ")"}}></div>
      <div className='userCard-info'>
        <div className='userCard-handle'>{handle}</div>
        <div className='userCard-bio'>{bio.length > 30 ? `${bio.slice(0, 30)}...` : bio}</div>
      </div>
    </NavLink>
  )
}

export default UserPageItem;