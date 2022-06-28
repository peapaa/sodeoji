import { useState, useEffect } from 'react';
import { getUserByUserId } from '../services/firebase';

export default function useUser(uid) {
  const [activeUser, setActiveUser] = useState();

  useEffect(() => {
    async function getUserObjById(uid) {
      const user = await getUserByUserId(uid);
      setActiveUser(user || {});
    }

    if (uid) {
      getUserObjById(uid);
    }
  }, [uid]);

  return { user: activeUser, setActiveUser };
}
