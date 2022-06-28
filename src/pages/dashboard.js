import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Header from '../components/header';
import Timeline from '../components/timeline';
import Banner from '../components/banner';
import useUser from '../hooks/use-user';
import LoggedInUserContext from '../context/logged-in-user';
import Sidebar from '../components/sidebar'
import { useParams } from "react-router-dom";

export default function Dashboard({ user: loggedInUser }) {
  const { user, setActiveUser } = useUser(loggedInUser.uid);
  var { type, param2 } = useParams();

  useEffect(() => {
    document.title = 'Home';
  }, []);

  return (
    <LoggedInUserContext.Provider value={{ user, setActiveUser }}>
      <div className="bg-gray-background">
        <Header />
        <div className="grid grid-cols-3-new">
          <Sidebar />
          <Timeline key="post-list-render" type={type} param2={param2} />
        </div>
      </div>
    </LoggedInUserContext.Provider >
  );
}

Dashboard.propTypes = {
  user: PropTypes.object.isRequired
};
