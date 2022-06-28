import PropTypes from 'prop-types';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import FirebaseContext from '../../context/firebase';
import { useState, React, useContext, useEffect } from 'react';
import useUser from '../../hooks/use-user';
import UserContext from '../../context/user';
import Vote from './vote';
import { snapshotToArray } from '../../services/firebase';

export default function Footer({ content }) {
    const { user: loggedInUser } = useContext(UserContext);
    const { user } = useUser(loggedInUser?.uid);
    const { database } = useContext(FirebaseContext);
    const [commentNumbers, setCommentNumbers] = useState(0);

    var com_num;
    const [save, setSave] = useState(false);

    const handleSave = async () => {
        if (save === false) await database.ref('Saves').child(`${content?.key}/${user?.username}`).set(1);
        else await database.ref('Saves').child(`${content?.key}/${user?.username}`).remove();
    }

    useEffect(() => {
        async function getSaved() {
            await database
                .ref(`Saves/${content?.key}/${user?.username}`)
                .on('value', (snapshot) => {
                    if (snapshot.exists()) {
                        setSave(true);
                    } else {
                        setSave(false);
                    }
                    // console.log(save);
                });
        }
        getSaved();
    }, [user?.username]);

    useEffect(() => {
        async function getCommentsNumbers() {
            await database
                .ref(`Posts/${content?.key}/comments`)
                .on('value', (snapshot) => {
                    if (snapshot.exists()) {
                        const comments = (snapshotToArray(snapshot));
                        com_num = comments?.length;
                        setCommentNumbers(com_num);
                    } else {
                        com_num = 0;
                        setCommentNumbers(com_num);
                    }
                });
        }
        getCommentsNumbers();
    }, []);

    return (
        <div className="p-4 pt-2 pb-1">
            <div className="grid grid-cols-3 text-2xl">
                <div className="font-bold flex flex-row justify-center items-center">
                    <Vote user={user} linkdb={'Posts'} content={content} />
                </div>
                <div className="font-bold flex flex-row justify-center items-center">
                    <ChatBubbleOutlineIcon className="mr-1" />
                    <div>{commentNumbers}</div>
                </div>
                <div className="font-bold flex justify-center items-center">
                    <BookmarkIcon onClick={handleSave} className="cursor-pointer" fontSize="large" style={save ? { color: '#3f51b5' } : {}} /> Lưu
                </div>
            </div>
        </div>
    );
}

Footer.propTypes = {
    votes: PropTypes.number.isRequired,
    content: PropTypes.object.isRequired
};