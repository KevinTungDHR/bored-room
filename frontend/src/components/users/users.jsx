import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers } from '../../actions/user_actions';

const UsersViewPage = (props) => {
  const users = useSelector(state => state.entities.users);
  const dispatch = useDispatch();
  useEffect(()=> {
    dispatch(fetchAllUsers())
  }, [])

  return(
    <div>
      {Object.values(users).map(user => <div>{user.handle}</div>)}
    </div>
  )
}

export default UsersViewPage