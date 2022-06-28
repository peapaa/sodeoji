/* eslint-disable jsx-a11y/img-redundant-alt */
import { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';
import useUser from '../../hooks/use-user';
import UserContext from '../../context/user';
import { DEFAULT_IMAGE_PATH } from '../../constants/paths';
import Dialog from '@material-ui/core/Dialog';
import EditProfile from './edit-profile';
// import MuiDialogActions from '@material-ui/core/DialogActions';
// import { withStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router';

// const DialogActions = withStyles((theme) => ({
//   root: {
//     margin: 0,
//     padding: theme.spacing(1),
//   },
// }))(MuiDialogActions);

export default function Header({
  profile: {
    key: profileKeyId,
    user_id: profileUserId,
    username: profileUsername,
    avatar
  }
}) {
  const { user: loggedInUser } = useContext(UserContext);
  const { user } = useUser(loggedInUser?.uid);

  const [open, setOpen] = useState(false);

  const { username } = useParams();

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="grid grid-cols-3 gap-4 justify-between mx-auto max-w-screen-lg">
      <div className=" container flex justify-center items-center">
        {user ? (
          <img
            className="rounded-full h-40 w-40 flex"
            src={avatar}
            onError={(e) => {
              e.target.src = DEFAULT_IMAGE_PATH;
            }}
            alt=""
          />
        ) : (
          <Skeleton circle height={150} width={150} count={1} />
        )}
      </div>
      <div className="flex items-center justify-center flex-col col-span-2">
        <div className="container flex justify-between items-center">
          <p className="text-2xl mr-4">{profileUsername}</p>

          {username === user?.username ? (<div>
            <button className={` bg-green-medium text-white px-4 rounded h-8 font-bold `}
              onClick={handleClickOpen}
            > Chỉnh sửa profile
            </button>
            <Dialog open={open}>
              <EditProfile user={user} handleClose={handleClose} />
            </Dialog>
          </div>) : null
          }



        </div>
      </div>
    </div>
  );
}

Header.propTypes = {
  profile: PropTypes.shape({
    key: PropTypes.string,
    user_id: PropTypes.string,
    username: PropTypes.string,
    avatar: PropTypes.array
  }).isRequired
};