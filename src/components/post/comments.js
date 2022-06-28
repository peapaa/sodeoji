import { useEffect, useState, React, useContext } from 'react';
import PropTypes from 'prop-types';
import Comment from './comment';
import CommentForm from './comment-form';
import { snapshotToArray } from '../../services/firebase';
import FirebaseContext from '../../context/firebase';
import "../../styles/comments.css";

export default function Comments({ postId, user }) {
  const [backendComments, setBackendComments] = useState(null);
  const [activeComment, setActiveComment] = useState(null);
  const { database } = useContext(FirebaseContext);
  const [rootComments, setRootComments] = useState(null);

  const getReplies = (commentId) => {
    // console.log(backendComments);
    if (backendComments) return (backendComments
      .filter(backendComment => backendComment.parentId === commentId)
      .sort(
        (a, b) => {
          if (b.vote_numbers !== a.vote_numbers) return b.vote_numbers - a.vote_numbers;
          else return new Date(a.create_date).getTime() - new Date(b.create_date).getTime();
        }
      ));
  };

  const getSortCom = () => {
    if (rootComments) return (rootComments
      .sort(
        (a, b) => {
          if (b.vote_numbers !== a.vote_numbers) return b.vote_numbers - a.vote_numbers;
          else return new Date(a.create_date).getTime() - new Date(b.create_date).getTime();
        }
      ));
  };

  var dataSnapshot = [];

  const addComment = async (text, parentId) => {
    // console.log(text, parentId)
    var userId = user?.user_id;
    var username = user?.username;
    if (parentId === undefined) {
      parentId = '';
    }

    var commentId = await database
      .ref(`Posts/${postId}/comments`)
      .push({
        id: postId,
        postId: postId,
        body: text,
        parentId: parentId,
        userId: userId,
        username: username,
        create_date: Date.now(),
        vote_numbers: 0,
        avatar: user?.avatar
      })
      .key;
    var commentRef = `Posts/${postId}/comments/` + commentId;
    await database
      .ref(commentRef)
      .update({
        id: commentId
      });
  };

  const updateComment = async (text, commentId) => {
    await database
      .ref(`Posts/${postId}/comments/` + commentId)
      .update({
        body: text
      });
    // setBackendComments(updatedBackendComments);
  };

  const deleteComment = async (commentId) => {
    if (window.confirm('Are you sure that you want to remove comment?')) {
      var deleteData = [];
      var tempId;
      var datas

      deleteData.push(commentId);
      while (deleteData.length !== 0) {
        tempId = deleteData.shift();
        await database.ref(`Posts/${postId}/comments`).child(tempId).remove();

        await database.ref(`Posts/${postId}/comments`).get().then((snapshot) => {
          if (snapshot.exists()) {
            datas = snapshotToArray(snapshot);
          } else {
            datas = [];
          }
        }).catch((error) => {
          console.error(error);
        });

        await Promise.all(datas.map(function (data) {
          if (data.parentId === tempId) deleteData.push(data.id);
        }));
        // console.log(datas);
        // console.log(deleteData);
      }
    }
  };

  useEffect(() => {
    async function getComments() {
      await database.ref(`Posts/${postId}/comments`).on('value', snapshot => {
        if (snapshot.exists()) {
          // console.log(snapshot.val());
          dataSnapshot = snapshotToArray(snapshot);

          setActiveComment(null);

          setBackendComments(dataSnapshot);

          setRootComments(() => {
            return dataSnapshot.filter(
              (comment) => comment.parentId === ''
            )
          });

          // console.log(dataSnapshot);
          // console.log(backendComments);
          // console.log(rootComments);
        } else {
          dataSnapshot = [];
          setActiveComment(null);

          setBackendComments(dataSnapshot);

          setRootComments(() => {
            return dataSnapshot.filter(
              (comment) => comment.parentId === ''
            )
          });

          // console.log(dataSnapshot);
          // console.log(backendComments);
          // console.log(rootComments);
        }
      });
    }
    getComments();
  }, []);

  return (
    <div className="comments">
      <h3 className="comments-title">Danh sách bình luận</h3>
      <div className="comments-container">
        {rootComments?.length > 0 ? (getSortCom().map((rootComment) => (
          <Comment
            data={backendComments}
            key={rootComment?.id}
            comment={rootComment}
            replies={getReplies(rootComment.id)}
            user={user}
            deleteComment={deleteComment}
            activeComment={activeComment}
            setActiveComment={setActiveComment}
            updateComment={updateComment}
            addComment={addComment}
            parentId={rootComment.parentId}
          />
        ))) : null}
      </div>
      <div className="comment-form-title">Bình luận</div>
      <div className="mb-4">
        <CommentForm submitLabel="Bình luận" handleSubmit={addComment} />
      </div>
    </div>
  );
}

Comments.propTypes = {
  postId: PropTypes.string.isRequired
};