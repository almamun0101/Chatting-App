import { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";

const useFirebaseData = (collectionPath) => {
  const [data, setData] = useState([]);
  const db = getDatabase();

  useEffect(() => {
    if (!collectionPath) return;

    const dbRef = ref(db, collectionPath);
    const unsubscribe = onValue(dbRef, (snapshot) => {
      const array = [];
      snapshot.forEach((item) => {
        const itemData = item.val();
        array.push({ ...itemData, uid: item.key });
      });
      setData(array);
    });

    // Optional cleanup (for real-time listeners)
    return () => unsubscribe();
  }, [collectionPath]);

  return data;
};

export default useFirebaseData;
