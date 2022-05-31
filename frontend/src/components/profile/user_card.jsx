import React from 'react';
import yoda from '../../assets/images/yoda.png';
import monkey from '../../assets/images/coolMonkey.png';
import socrates from '../../assets/images/socrates.png';
import user_prof from '../../assets/images/user_prof.png';
import { NavLink } from 'react-router-dom';

const UserCard = ({user}) => {
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
    <NavLink to={_id} className="userCard-container">
      <div className='userCard-avatar' style={{ backgroundImage: "url(" + avatars[avatar] + ")"}}></div>
      <div className='userCard-info'>
        <div>{handle}</div>
      </div>
    </NavLink>
  )
}

export default UserCard;