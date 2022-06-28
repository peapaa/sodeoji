import { useContext } from 'react';
import EditUserProfile from '../components/profile/edit-profile'
import UserContext from '../context/user';
import useUser from '../hooks/use-user';
export default function EditProfile() {

  const { user: loggedInUser } = useContext(UserContext);
  const { user } = useUser(loggedInUser?.uid);

  return (
    <div className="bg-gray-background">
      <div className="mx-auto max-w-screen-lg">
        <EditUserProfile user={user}/>
      </div>
    </div>
  );
  }
