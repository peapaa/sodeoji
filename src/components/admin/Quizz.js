import { useContext, useState, useEffect } from 'react';
import React from 'react';
import UserContext from '../../context/user';
import useUser from '../../hooks/use-user';
import FirebaseContext from '../../context/firebase';

import Dialog from '@material-ui/core/Dialog';
import MuiDialogActions from '@material-ui/core/DialogActions';
import { withStyles } from '@material-ui/core/styles';
import MakeQuiz from './MakeQuiz';
import { snapshotToArray } from '../../services/firebase';

import ReactPaginate from 'react-paginate';
var stt=1;

const DialogActions = withStyles((theme) => ({
    root: {
        margin: 10,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);

export default function Quizz() {
    const { user: loggedInUser } = useContext(UserContext);
    const { user } = useUser(loggedInUser?.uid);
    const [quizz, setQuizz] = useState([]);
    const [Quiz, setQuiz] = useState([]);
    const { database } = useContext(FirebaseContext);
    const [open, setOpen] = useState(false);
    const [open1, setOpen1] = useState(false);
    const [data, setData] = useState();
    const [value, setValue] = useState();
    const [search, setSearch] = useState();

    //Pagination
    const itemsPerPage = 9;
    const [currentItems, setCurrentItems] = useState(null);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);

    useEffect(() => {
        const endOffset = itemOffset + itemsPerPage;
        setCurrentItems(quizz.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(quizz.length / itemsPerPage));
      }, [itemOffset, itemsPerPage, quizz]);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % quizz.length;
        console.log(
            `User requested page number ${event.selected}, which is offset ${newOffset}`
        );
        setItemOffset(newOffset);
    };

    const handleStop = async (e) => {
        await database.ref('Quizs').child(e.target.value).update({active: 0});
    }
    const handleActive = async (e) => {
        await database.ref('Quizs').child(e.target.value).update({active: 1});
    }

    const handleChange = async (e) => {
        const snapshot = await database.ref('Quizs').child(e.target.value).once('value');
        if (snapshot.exists()){
            setData(snapshot);
            handleClickOpen1();
        }

    }
    const handleDelete = async (e) => {
        await database.ref('Quizs').child(e.target.value).remove();
    }

    const handleClickOpen = () => {
        setOpen(true);
    }

    const handleClose = () => { 
        setOpen(false);
    }
    const handleClickOpen1 = () => {
        setOpen1(true);
    }

    const handleClose1 = () => { 
        setOpen1(false);
    }

    const handleSearch = (e) => {
        console.log("set search: " +value);
        setSearch(value);
    }


    async function getQuizz(value) {
        const snapshot = await database
            .ref('Quizs')
            .once("value");
        var result= [];
        if (snapshot.exists()){
            Object.keys(snapshot.val()).forEach(key => { result.push({
                id: key,
                val: snapshot.val()[key]
            })
        });

        if (value) {
            result = await Promise.all(result.filter((item) => {
                return (item.val.title.toLowerCase().includes(value.toLowerCase()))
              }));
        }
        setQuizz(result);
        }
    }

    useEffect(() => {
        getQuizz(search);
    }, [quizz, search]);
    return (
        <div className="m-4 pt-4 rounded bg-white h-screen w-full border-success border flex flex-col items-center sticky">
            
            <div className='m5 row w-90'>
                <div className='col-md-7'>
                    <button type="button" className="btn btn-light border border-dark rounded" onClick={handleClickOpen}>Tạo Quiz mới</button>
                    <Dialog open={open} maxWidth={'xl'} fullWidth={true}>
                        <DialogActions>
                            <MakeQuiz type="作成" handleClose={handleClose} />
                        </DialogActions>
                    </Dialog>
                    <Dialog open={open1} maxWidth={'xl'} fullWidth={true}>
                        <DialogActions>
                            <MakeQuiz type="編集" data={data} handleClose={handleClose1} />
                        </DialogActions>
                    </Dialog>
                </div>
                <div className='col-md-5'>
                    <input 
                        type="text"
                        class="form-control"
                        id="search_quizz" 
                        name="username" 
                        placeholder='Search' 
                        onChange={(e) => setValue(e.target.value)}
                        onKeyPress={(e) => {if (e.key == "Enter"){handleSearch(e)}}}
                    ></input>
                    
                </div>

                <table className="mt-4 table table-hover text-center">
                    <thead>
                        <tr className=''>
                            <th>Item</th>
                            <th>Tiêu đề</th>
                            <th>Thời gian</th>
                            <th>Kỳ hạn</th>
                            <th>Sô người</th>
                            <th>Tình trạng</th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems?
                            currentItems.map((e, i)=> <>
                                <tr>
                                    <td>{itemOffset+i+1}</td>
                                    <td>{e.val.title}</td>
                                    <td>{new Date(e.val.time * 1000).toISOString().substr(14, 5)}</td>
                                    <td>{e.val.end_date}</td>
                                    <td>{Object.keys(e.val.done_user).length}</td>
                                    {e.val.active==1? 
                                    <>
                                    <td className='text-success'>Hoạt động</td>
                                    <td><button type="button" class="btn btn-danger" onClick={handleStop} value={e.id}>Dừng</button></td>
                                    </>
                                    : <>
                                    <td className='text-danger'> Dừng</td>
                                    <td><button type="button" class="btn btn-success" onClick={handleActive} value={e.id}>Hoạt động</button></td>
                                    </>}
                                    <td><button type="button" class="btn btn-primary" onClick={handleChange} value={e.id}>Chỉnh sửa</button></td>
                                    <td><button type="button" class="btn btn-primary" onClick={handleDelete} value={e.id}>Xóa</button></td>
                                </tr>
                            </>)
                        : null}
                    </tbody>
                </table>
                <div className='d-flex flex-row-reverse'>
                    <ReactPaginate
                        breakLabel="..."
                        nextLabel="next >"
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={5}
                        pageCount={pageCount}
                        previousLabel="< previous"
                        renderOnZeroPageCount={null}
                        pageClassName="page-item"
                        pageLinkClassName="page-link"
                        previousClassName="page-item"
                        previousLinkClassName="page-link"
                        nextClassName="page-item"
                        nextLinkClassName="page-link"
                        breakClassName="page-item"
                        breakLinkClassName="page-link"
                        containerClassName="pagination"
                        activeClassName="active"
                    />
                </div> 
                
            </div>
        </div>
    );
}