import { useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import Header from './header';
// import UserContext from '../../context/user';

export default function Profile({ user }) {
  const reducer = (state, newState) => ({ ...state, ...newState });
  
  const initialState = {
    profile: {},
  };

  // const { user: loggedInUser } = useContext(UserContext);

  const [{ profile }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    async function getProfileInfoAndPhotos() {
      dispatch({ profile: user });
    }
    getProfileInfoAndPhotos();
  }, [user.username]);

  return (
    <>
      <Header
        profile={profile}
      />
    </>
  );
}

Profile.propTypes = {
  user: PropTypes.shape({
    userId: PropTypes.string,
    username: PropTypes.string
  })
};
