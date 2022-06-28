import { useParams, useHistory } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { getUserByUsername, snapshotToArray } from '../services/firebase';
import * as ROUTES from '../constants/routes';
import Header from '../components/header';
import UserProfile from '../components/profile';
import "firebase/auth";
import "./../styles/profile.css";
import FirebaseContext from '../context/firebase';
import { database } from '../lib/firebase';

export default function Profile() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const history = useHistory();

  // get count file
  const {storge, db} = useContext(FirebaseContext);
  const realtimeDb = database;
  const [userPost, setPost] = useState(0);
  const [userFile, setFile] = useState(0);
  const [userJoin, setJoin] = useState(0);
  const [userScore, setScore] = useState(0);

  useEffect(() => {
    async function checkUserExists() {
      const user = await getUserByUsername(username);
      if (user?.user_id) {
        setUser(user);
      } else {
        history.push(ROUTES.NOT_FOUND);
      }
    }

    checkUserExists();



    //console.log(username);

    document.title = 'Profile';

    // count post and file
    async function post(username){
      var postList;
      await realtimeDb.ref(`Posts`).once('value', snapshot => {
        if (snapshot.exists()) {
          postList = snapshotToArray(snapshot);
        }
      });
    
      var countPost = 0;
      var countFile = 0;
      for (var i = 0; i < postList.length; i += 1){
        if (postList[i].author == username){
          countPost += 1;
          if (postList[i].file_name != ""){
            countFile += 1;
          }
        }
      }
      setPost(countPost);
      setFile(countFile);
    }
    post(username);


    async function quizCountAndScore(username){
      var qSList;
      await realtimeDb.ref(`Quizs`).once('value', snapshot => {
        if (snapshot.exists()) {
          qSList = snapshotToArray(snapshot);
        }
      });

      var countJoin = 0;
      var countScore = 0;
      //console.log(qSList);
      for (var i = 0; i < qSList.length; i += 1){
        if (qSList[i].done_user != ""){
          var x = qSList[i].done_user;
          var key = Object.keys(qSList[i].done_user);
          //console.log(key);
          for (var j = 0; j < key.length; j++){
            if (key[j] == username){
              countJoin += 1;
              //console.log(x[username]);
              countScore += x[username].result;
            }
          }
        }
      }
      //console.log(countJoin, countScore);
      setJoin(countJoin);
      setScore(countScore);
    }

    quizCountAndScore(username);

  }, [username, history]);

  return user?.username ? (
  <>
    <div className="bg-gray-background">
      <Header />
      <div className="mx-auto max-w-screen-lg" style={{paddingTop: 10 + 'px', paddingBottom: 10 + 'px'}}>
        <UserProfile user={user} />
      </div>
    </div>
    <div className="show-profile">
      <div className="show-profile-child first-child">
        <h3>Thông tin cá nhân</h3>
      </div>
      <hr />
      <div className="show-profile-child">
        <h3>Tên</h3>
        <span>{user.username}</span>
      </div>

      <div className="show-profile-child">
        <h3>Nhóm</h3>
        <span>{user.group}</span>
      </div>

      <div className="show-profile-child">
        <h3>Điểm</h3>
        <span>{userScore}</span>
      </div>

      <div className="show-profile-child">
        <h3>Bài đăng</h3>
        <span>{userPost}</span>
      </div>
      <div className="show-profile-child">
        <h3>File đã chia sẻ</h3>
        <span>{userFile}</span>
      </div>
      
      <div className="show-profile-child">
        <h3>Quiz đã làm</h3>
        <span>{userJoin}</span>
      </div>
      
    </div>
  </>
  ) : null;
}