import { firebase, database, storage } from '../lib/firebase';
import { nonAccentVietnamese } from '../helpers/Vietnamese-converter';

export function snapshotToArray(snapshot) {
  var returnArr = [];

  snapshot.forEach(function (childSnapshot) {
    var item = childSnapshot.val();
    item.key = childSnapshot.key;

    returnArr.push(item);
  });

  return returnArr;
};

export async function getUserByUsername(username) {
  let result;
  await database.ref('Users').orderByChild("username").equalTo(username).once("value", snapshot => {
    if (snapshot.exists()) {
      result = snapshotToArray(snapshot)[0];
    }
  });

  return result;
}

export async function arrayOfGroup() {
  const snapshot = await database
    .ref('Group')
    .once('value');

  const result = snapshot.val();

  return result;
}


export async function getUserByUserId(userId) {
  let result;
  await database.ref('Users').orderByChild("user_id").equalTo(userId).once("value", snapshot => {
    if (snapshot.exists()) {
      result = snapshotToArray(snapshot)[0];
    }
  });

  return result;
}

export async function getPosts(type, param2, search, user) {
  var now = Date.now();
  var cutoff = now - 6 * 30 * 24 * 60 * 60 * 1000;
  await database
    .ref('Posts')
    .orderByChild('create_date')
    .endAt(cutoff)
    .once("value", function (snapshot) {
      snapshot.forEach(function (child) {
        // console.log(child.key);
        // console.log(child.val());
        if (child.val().file_url) storage.refFromURL(child.val().file_url).delete();
        if (child.val().image_url) storage.refFromURL(child.val().image_url).delete();
        database.ref('Saves').child(`${child.key}`).remove();
        database.ref('Posts').child(child.key).remove();
      })
    });
  // console.log(snapshot.val());

  const snapshot = await database
    .ref('Posts')
    .once("value");

  var result = await Promise.all(snapshotToArray(snapshot));

  switch (type) {
    case "post-details":
      result = await Promise.all(result.filter((item) => {
        return item.key === param2;
      }));
      break;
    case "post":
      result = await Promise.all(result.filter((item) => {
        return (user?.username === item.author)
      }));
      break;
    case "save":
      const saved_snapshot = await database
        .ref(`Saves`)
        .once('value');
      const saved = saved_snapshot.val();
      result = await Promise.all(result.filter((item) => {
        return (saved != null && saved[`${item.key}`] && saved[`${item.key}`][`${user?.username}`]);
      }));
      break;
    default:
      result = await Promise.all(result.filter((item) => {
        return (user?.group === item.group || item.active === "all")
      }));
      break;
  }

  if (search && search !== "") {
    result = await Promise.all(result.filter((item) => {
      return (nonAccentVietnamese(item.title).toLowerCase().includes(nonAccentVietnamese(search).toLowerCase()));
    }));
  }

  return result;
}

export async function getPostByPostId(postId) {
  let result;
  await database.ref(`Posts`).orderByChild("postId").equalTo(postId).once("value", snapshot => {
    if (snapshot.exists()) {
      result = snapshotToArray(snapshot)[0];
    }
  });
  return result;
}

export async function updateAvatar(
  avatar, docId
) {
  console.log('avatar func', avatar);
  // let urlName = Date.now() + avatar?.name;
  // let newUrlAvatar = '';

  const uploadTask = storage
    .ref(`/avatars/${avatar?.name}`).put(avatar);

  uploadTask.on(
    "state_changed",
    snapShot => { },
    error => {
      console.error("Error updating user", error);
    },
    () => {
      storage
        .ref()
        .child(`/avatars/${avatar?.name}`)
        .getDownloadURL()
        .then(url => {
          console.log('url', url);
          // newUrlAvatar = url;
          // console.log('newUrlAvatar', newUrlAvatar);

          firebase
            .firestore()
            .collection('users')
            .doc(docId)
            .update({
              avatarImageSrc: url
            })
            .then(function () {
              //window.location.reload()
              console.log('User update avatar with ID', docId);
            })
            .catch(function (error) {
              console.error("Error updating user", error);
            });

        });
    }
  );
};

export async function getQuizs(type, param2) {
  const snapshot = await database
    .ref('Quizs')
    .once("value");

  // console.log(type);
  var result = snapshotToArray(snapshot);
  switch (type) {
    case "openning":
      result = await Promise.all(result.filter((item) => {
        // console.log(item);
        return item.active === 1;
      }));
      break;
    case "close":
      result = await Promise.all(result.filter((item) => {
        // console.log(item);
        return item.active === 0;
      }));
      break;
    case "done":
      result = await Promise.all(result.filter((item) => {
        console.log(item, param2);
        return item.done_user[`${param2}`];
      }));
      break;
    case "do":
      result = await Promise.all(result.filter((item) => {
        // console.log(item);
        return item.key === param2;
      }));
      break;
    default:
      break;
  }

  return result;
}

export async function getUserPostLength(user) {
  const snapshot = await database
    .ref('Posts')
    .once("value");

  var result = await Promise.all(snapshotToArray(snapshot));
  // console.log(result, user);

  result = await Promise.all(result.filter((item) => {
    return (user?.username === item.author)
  }));
  // console.log(result);

  return result;
}