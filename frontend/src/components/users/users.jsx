import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers } from '../../actions/user_actions';
import { NavLink } from 'react-router-dom';
import UserPageItem from './users_page_item';

const UsersViewPage = (props) => {
  const users = useSelector(state => state.entities.users);
  const currentUser = useSelector(state => state.session.user)

  const dispatch = useDispatch();
  useEffect(()=> {
    dispatch(fetchAllUsers())
  }, [])

  return(
    <div className='lobby-background'>
      <navbar className='lobby-navbar'>
          <ul className='lobby-navlist'>
              <NavLink to='/lobby'>Game Lobby</NavLink>
              <NavLink className='navlink-selected' to='/users'>Players</NavLink>
              <NavLink to={`/profile/${currentUser._id}`}>View My Profile</NavLink>
          </ul>
      </navbar>
      <div className='users-page-container'>
        {Object.values(users).map((user, idx) => <UserPageItem key={idx} user={user} />)}
      </div>
    </div>
  )
}

export default UsersViewPage