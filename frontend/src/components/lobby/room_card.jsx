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
import { GiBull, GiSundial, GiPeaks } from 'react-icons/gi';
import bull_logo from '../../assets/images/bull_logo.png';
import moment from 'moment';
import { useSelector } from 'react-redux';

const RoomCard = ({ room, handleRoomDelete }) => {
  const currentUser = useSelector(state => state.session.user)
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

  const takingSixIcon = <div className='six-game-logo-small'value="Taking Six" >
                          <GiBull height="12px" width="12px" className='gi-bull-top-left small-icon' />
                          <GiBull height="12px" width="12px" className='gi-bull-top-right small-icon' />
                          <GiBull height="12px" width="12px" className='gi-bull-bot-left small-icon' />
                          <GiBull height="12px" width="12px" className='gi-bull-bot-right small-icon' />
                          <img className='tile-logo' src={bull_logo} height="70px" width="70px" />
                          <h1 className='six-title-tile game-small-title'>Taking Six</h1>
                        </div>

  const frequencyIcon =   <div className='freq-game-logo-small' value="Frequency" >
                            <h1 className='freq-title-tile'>Frequency</h1>
                            <GiSundial size={70} color="turquoise" style={{
                                position: "absolute",
                                right: "15%"
                            }}/>
                          </div>
              
  const dontStopIcon =    <div className='dont-stop-game-tile-small' data-teamgame={false} value="Dont Stop">
                            <GiPeaks className='dont-stop-icon-small' size={60} />
                            <h1 className='dont-stop-tile-title'>Don't Stop</h1>
                          </div>

  const renderIcon = () => {
    switch(room.gameId){
      case 'takingSix':
        return takingSixIcon;
      case 'frequency':
        return frequencyIcon
      case 'dontStop':
        return dontStopIcon;
      default:
        return null;
    }
  }
  const renderUsers = () => {
    let players;
    if(room.teamGame){
      players = room.redTeam.concat(room.blueTeam);
    } else {
      players = room.seatedUsers
    }

    let lobbyCards;
    if (players.length > 6){
      lobbyCards = players.slice(0,5)
    } else {
      lobbyCards = players;
    }

    const cards = lobbyCards.map((user, idx) => {
      return (
      <div key={idx} className='roomCard-user-item'>
        <div className='roomCard-user-avatar' style={{ backgroundImage: "url(" + avatars[user.avatar] + ")"}}></div>
        <div>
          <NavLink to={`/profile/${user._id}`} className='roomCard-user-handle'>{user.handle}</NavLink>
          <div className='roomCard-user-rating'>Rating {user.eloRating[room.gameId]}</div>
        </div>
      </div>
      )
    })
    return(
      <>
        {cards}
        {players.length > 6 && <div className='roomCard-user-item'>{`+${players.length - 5} others`}</div>}
      </>
    )
  } 

  return(
    <div className='roomCard-item'>
      <div className='roomCard-icon'>{renderIcon()}</div>
      <div className='roomCard-description ellipsis'>{`${room.name} - `}<span className='roomCard-description-subtext'>{`Created by: ${room.creator.handle} - ${moment(room.createdAt).fromNow()}`}</span></div>
      <div className='roomCard-users-list ellipsis'>
        {renderUsers()}
      </div>
      <div className="roomCard-links">
        <NavLink className='join-room-button' to={`/rooms/${room.code}`}>Join Room</NavLink>
        {((currentUser._id === room.creator._id && !room.gameOver) || currentUser.isAdmin) && <div className='delete-room-button' onClick={() => handleRoomDelete(room.code)}>Delete</div>}
      </div>
    </div>
   
  )
}

export default RoomCard;