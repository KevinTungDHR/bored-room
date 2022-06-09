import React from 'react';
import yoda from '../../assets/images/yoda.png';
import monkey from '../../assets/images/coolMonkey.png';
import socrates from '../../assets/images/socrates.png';
import reindeer from '../../assets/images/reindeer.png';
import controller from '../../assets/images/controller.png';
import gameboy from '../../assets/images/gameboy.png';
import owl from '../../assets/images/owl.png';
import pirahna from '../../assets/images/pirahna.png';
import robot from '../../assets/images/robot.png';
import snowman from '../../assets/images/snowman.png';
import camera from '../../assets/images/camera.png';
import coffee from '../../assets/images/coffee.png';
import redRobot from '../../assets/images/redRobot.png';
import pumpkin from '../../assets/images/pumpkin.png';
import rocket from '../../assets/images/rocket.png';
import user_prof from '../../assets/images/user_prof.png';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { cancelRequest, acceptRequest, rejectRequest, unblockUser } from '../../actions/friendship_actions';

const UserCard = ({user, status}) => {
  const dispatch = useDispatch();

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
    'socrates': socrates,
    'reindeer': reindeer,
    'controller': controller,
    'gameboy': gameboy,
    'owl': owl,
    'pirahna': pirahna,
    'robot': robot,
    'snowman': snowman,
    'camera': camera,
    'coffee': coffee,
    'redRobot': redRobot,
    'pumpkin': pumpkin,
    'rocket': rocket
};
  const handleUnblock = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(unblockUser(user._id))
  }

  const handleCancel = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(cancelRequest(user._id))
  }

  const handleAccept = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(acceptRequest(user._id))
  }

  const handleReject = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(rejectRequest(user._id))
  }

  const renderbuttons = () => {
    switch(status){
      case 'requestedFriends':
        return (
            <div className='friendship-status friendship-red' onClick={handleCancel}>Cancel</div>
        )
      case 'pendingFriends':
        return (
          <>
            <div className='friendship-status friendship-green' onClick={handleAccept}>Accept</div>
            <div className='friendship-status friendship-red' onClick={handleReject}>Reject</div>
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
        <div className='userCard-bio'>{bio.length > 26 ? `${bio.slice(0, 26)}...` : bio}</div>
      </div>
      <div className='friendship-status-container'>
        {renderbuttons()}
      </div>
    </NavLink>
  )
}

export default UserCard;