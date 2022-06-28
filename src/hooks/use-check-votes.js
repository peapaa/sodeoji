import { useState, useEffect,useContext } from 'react';
import {snapshotToArray} from '../services/firebase';
import FirebaseContext from '../context/firebase';

export default function useCheckVotes(uid, post_id) {
  const [isVoted, setIsVoted] = useState(false);
  const [id, setId] = useState('');
  const { database } = useContext(FirebaseContext);

  useEffect(() => {
    async function check(uid, post_id) {
        let result;
        await database.ref('Votes').orderByChild('post_id').equalTo(post_id).once("value", snapshot => {
            setIsVoted(false);
            if (snapshot.exists()) {
                result = snapshotToArray(snapshot);
                result.forEach(element => { 
                    if (element?.user_id === uid) {
                        setIsVoted(true);
                        setId(element?.key);
                    }
                });
            }
        });

        await database.ref('Votes').on("child_removed", snapshot => {
            setIsVoted(false);
        })
    }
    if (uid && post_id) {
        check(uid, post_id);
    }
  }, [ database.ref('Votes')]);

  return { isVoted, id, setIsVoted };
}
