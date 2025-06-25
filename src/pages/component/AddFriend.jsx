import { getAuth } from "firebase/auth";
import { getDatabase, onValue, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import useFirebaseData from "./useFirebaseData";

const AddFriend = () => {
  const db = getDatabase();
  const auth = getAuth();
  const [userList, setUserList] = useState([]);
  const [requestList, setRequestList] = useState([]);
  const allUser = useFirebaseData("userslist/").map((item) => item.uid);

  // console.log(allUser);
  useEffect(() => {
    const dataFetch = ref(db, "friendRequest/");
    onValue(dataFetch, (snapshot) => {
      const requestArray = [];
      snapshot.forEach((item) => {
        const allData = item.val();
        requestArray.push({ ...allData, uid: item.key });
      });
      setRequestList(requestArray)
      console.log(requestArray);
    });
  }, []);

  const isHaveRequest = (userId)=>{
    requestList.some(
      (req)=>{
        (Rewind.recei)
      }
    )

  }

  return (
    <div>
      <div className="max-w-3xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4 text-center">User List</h2>
        <ul className="space-y-4">
          {


          }
        </ul>
      </div>
    </div>
  );
};

export default AddFriend;
