import React from 'react'

import useFirebaseData from './useFirebaseData'

const FriendsList = () => {
  const userList = useFirebaseData("userslist/");

  return (
    <div>
      <h2>User List</h2>
      {userList.map((user) => (
        <div key={user.uid}>{user.name}</div>
      ))}
    </div>
  );
};

export default FriendsList