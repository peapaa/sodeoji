import { useContext, useState, useEffect } from 'react';
import React from 'react'
import { Navbar, Container } from 'react-bootstrap';
import * as ROUTES from '../../constants/routes';
import UserContext from '../../context/user';
import useUser from '../../hooks/use-user';
import { getUserPostLength } from '../../services/firebase'

import Dialog from '@material-ui/core/Dialog';
import MuiDialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import ChangePost from '../post/change-post';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';

const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);

export default function Sidebar() {
    const { user: loggedInUser } = useContext(UserContext);
    const { user } = useUser(loggedInUser?.uid);
    const [open, setOpen] = useState(false);
    const [userPostNum, setUserPostNum] = useState(null);
    const LIMIT_POST = 20;

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        async function getUserPostNumber() {
            const number = await getUserPostLength(user);

            setUserPostNum(number);
        }

        getUserPostNumber();
        // console.log(user, userPostNum?.length);
    }, [user, userPostNum?.length]);

    return (
        <div className="bg-white h-screen w-full border-gray-primary border flex flex-col items-center sticky">
            <Navbar bg="primary" className="bg-blue-medium mx-auto w-full mt-4">
                <Container className="flex flex-col justify-center items-center">
                    <Navbar.Brand className="text-white text-xl" href={ROUTES.DASHBOARD}>Home</Navbar.Brand>
                </Container>
            </Navbar>
            <Navbar bg="primary" className="bg-blue-medium mx-auto w-full mt-4">
                <Container className="flex flex-col justify-center items-center">
                    <Navbar.Brand className="text-white text-xl" href={ROUTES.QUIZ}>Quiz</Navbar.Brand>
                </Container>
            </Navbar>
            <hr className="w-full mt-4" />
            {window.location.pathname.includes(ROUTES.DASHBOARD) ? (
                <>
                    <Navbar bg="primary" className="bg-blue-medium mx-auto w-full mt-4">
                        <Container className="flex flex-col justify-center items-center">
                            <Navbar.Brand>
                                <button className="text-white text-xl" onClick={handleClickOpen}>
                                    ????ng b??i
                                </button></Navbar.Brand>
                            {userPostNum && userPostNum?.length >= LIMIT_POST ? (
                                <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
                                    <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                                        B??o c??o
                                    </DialogTitle>
                                    <DialogContent dividers>
                                        <Typography gutterBottom>
                                        B???n c?? th??? t???o 20 b??i ????ng cho m???i ng?????i d??ng!
                                        </Typography>
                                        <Typography gutterBottom>
                                        N???u b???n mu???n t???o m???t b??i vi???t m???i, vui l??ng x??a b??i vi???t c???a b???n.
                                        </Typography>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button autoFocus onClick={handleClose} color="primary">
                                            ???? hi???u
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                            ) : (
                                <Dialog open={open}>
                                    <DialogActions>
                                        <ChangePost type="??????" handleClose={handleClose} />
                                    </DialogActions>
                                </Dialog>
                            )}

                        </Container>
                    </Navbar>
                    <hr className="w-full mt-4" />
                    <Navbar className="mx-auto w-full mt-2">
                        <Container className="flex flex-col justify-center items-center">
                            <Navbar.Brand className="text-xl">Ti??u ?????</Navbar.Brand>
                        </Container>
                    </Navbar>
                    <Navbar bg="primary" className="bg-blue-medium mx-auto w-full mt-2">
                        <Container className="flex flex-col justify-center items-center">
                            <Navbar.Brand className="text-white text-xl" href={ROUTES.DASHBOARD}>B??i ????ng</Navbar.Brand>
                        </Container>
                    </Navbar>
                    <Navbar bg="primary" className="bg-blue-medium mx-auto w-full mt-4">
                        <Container className="flex flex-col justify-center items-center">
                            <Navbar.Brand className="text-white text-xl" href={`/dashboard/post/${user?.username}`}>B??i ????ng c???a t??i</Navbar.Brand>
                        </Container>
                    </Navbar>
                    <Navbar bg="primary" className="bg-blue-medium mx-auto w-full mt-4">
                        <Container className="flex flex-col justify-center items-center">
                            <Navbar.Brand className="text-white text-xl" href={`/dashboard/save/${user?.username}`}>L??u</Navbar.Brand>
                        </Container>
                    </Navbar>
                </>
            ) : window.location.pathname.includes(ROUTES.QUIZ) ? (
                <>
                    <Navbar className="mx-auto w-full mt-2">
                        <Container className="flex flex-col justify-center items-center">
                            <Navbar.Brand className="text-xl">Ti??u ????? Quiz</Navbar.Brand>
                        </Container>
                    </Navbar>
                    <Navbar bg="primary" className="bg-blue-medium mx-auto w-full mt-2">
                        <Container className="flex flex-col justify-center items-center">
                            <Navbar.Brand className="text-white text-xl" href={ROUTES.QUIZ_OPENNING}>Quiz c?? s???n</Navbar.Brand>
                        </Container>
                    </Navbar>
                    <Navbar bg="primary" className="bg-blue-medium mx-auto w-full mt-4">
                        <Container className="flex flex-col justify-center items-center">
                            <Navbar.Brand className="text-white text-xl" href={ROUTES.QUIZ_CLOSE}>H???t h???n</Navbar.Brand>
                        </Container>
                    </Navbar>
                    <Navbar bg="primary" className="bg-blue-medium mx-auto w-full mt-4">
                        <Container className="flex flex-col justify-center items-center">
                            <Navbar.Brand className="text-white text-xl" href={`/quiz/done/${user?.username}`}>???? l??m</Navbar.Brand>
                        </Container>
                    </Navbar>
                </>
            ) : null}
        </div>
    );
}