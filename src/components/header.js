import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Navbar, NavDropdown, Nav, Container } from 'react-bootstrap';
import FirebaseContext from '../context/firebase';
import UserContext from '../context/user';
import useUser from '../hooks/use-user';
import * as ROUTES from '../constants/routes';
import Skeleton from 'react-loading-skeleton';
import { DEFAULT_IMAGE_PATH } from '../constants/paths';

export default function Header() {
  const { user: loggedInUser } = useContext(UserContext);
  const { user } = useUser(loggedInUser?.uid);
  const { firebase } = useContext(FirebaseContext);
  const history = useHistory();

  return (
    <header className="h-16 bg-white border-b border-gray-primary">
      <div className="container mx-auto max-w-screen-md h-full">
        <div className="flex justify-between h-full">
          <div className="text-gray-700 text-center flex items-center cursor-pointer">
            <a className="w-full" href={ROUTES.DASHBOARD}>
              <img aria-label="logo" src="/images/logo.png" alt="Logo" className="w-40 h-full" />
            </a>
          </div>
          <div className="text-gray-700 text-center flex items-center h-90 pb-1">
            <>
              <div className="container flex justify-center items-center">
                {user ? (
                  <img
                    className="rounded-full w-thanh flex"
                    src={user.avatar}
                    onError={(e) => {
                      e.target.src = DEFAULT_IMAGE_PATH;
                    }}
                    alt=""
                  />
                ) : (
                  <Skeleton circle height={150} width={150} count={1} />
                )}
              </div>
              <Navbar className="bg-white" variant="light" bg="light" expand="lg">
                <Container fluid>
                  <Navbar.Collapse id="navbar-light-example">
                    <Nav>
                      <NavDropdown
                        id="nav-dropdown-light-example"
                        title={<span className="text-2xl">{user?.username}</span>}
                        menuVariant="light"
                      >
                        <NavDropdown.Item href={`/p/${user?.username}`}>
                          Profile
                        </NavDropdown.Item>
                        {user?.username === 'admin' ? (
                          <NavDropdown.Item href={`${ROUTES.ADMIN}`}>
                            Quản lí
                          </NavDropdown.Item>
                        ) : null}
                        <NavDropdown.Divider />
                        <NavDropdown.Item title="Sign Out"
                          onClick={() => {
                            firebase.auth().signOut();
                            history.push(ROUTES.DASHBOARD);
                          }}>
                          LogOut
                        </NavDropdown.Item>
                      </NavDropdown>
                    </Nav>
                  </Navbar.Collapse>
                </Container>
              </Navbar>
            </>
          </div>
        </div>
      </div>
    </header>
  );
}
